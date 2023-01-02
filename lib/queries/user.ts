import bcrypt from "bcryptjs"
import { Db, ObjectId } from "mongodb"
import normalizeEmail from "validator/lib/normalizeEmail"
import { IUser } from "../../types/user"

export function dbProjectionUsers(prefix = "") {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  }
}

export async function findUserWithEmailAndPassword(db: Db, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  const user = await db.collection("users").findOne({ email: normalizedEmail })
  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined } // filtered out password
  }
  return null
}

export async function findUserForAuth(db: Db, userId: string) {
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    return user || null
  } catch (error) {
    throw error
  }
}

/*
export async function findUserForAuth(db: Db, userId: string) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null)
}
*/

export async function findUserById(db: Db, userId: string) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null)
}

export async function findUserByEmail(db: Db, email: string) {
  const normalizedEmail = normalizeEmail(email)
  console.log("Find user", normalizedEmail)
  return db
    .collection("users")
    .findOne({ email: normalizedEmail }, { projection: dbProjectionUsers() })
    .then((user) => user || null)
}

export async function updateUserById(db: Db, id: string, data: Partial<IUser>) {
  return db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: "after", projection: { password: 0 } })
    .then(({ value }) => value)
}

export async function insertUser(db: Db, { email, originalPassword, bio = "", name, profilePicture, skills }: any) {
  const user: IUser = {
    emailVerified: false,
    profilePicture,
    email,
    name,
    bio,
    skills,
  }
  const password = await bcrypt.hash(originalPassword, 10)
  const { insertedId } = await db.collection("users").insertOne({ ...user, password })
  user._id = insertedId
  return user
}

export async function updateUserPasswordByOldPassword(db: Db, id: string, oldPassword: string, newPassword: string) {
  const user = await db.collection("users").findOne(new ObjectId(id))
  if (!user) return false
  const matched = await bcrypt.compare(oldPassword, user.password)
  if (!matched) return false
  const password = await bcrypt.hash(newPassword, 10)
  await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password } })
  return true
}

// whhy is this unsafe
export async function UNSAFE_updateUserPassword(db: Db, id: string, newPassword: string) {
  const password = await bcrypt.hash(newPassword, 10)
  await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password } })
}

export const deleteUser = async (db: Db, id: string) => {
  await db.collection("users").deleteOne({ _id: new ObjectId(id) })
  await db.collection("courses").deleteMany({ userId: new ObjectId(id) })
}
