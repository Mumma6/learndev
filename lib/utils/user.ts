import bcrypt from "bcryptjs"
import { Db, ObjectId } from "mongodb"
import normalizeEmail from "validator/lib/normalizeEmail"

export function dbProjectionUsers(prefix = "") {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  }
}

export async function findUserWithEmailAndPassword(db: Db, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  const user = await db.collection("users").findOne({ normalizedEmail })
  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined } // filtered out password
  }
  return null
}

export async function findUserForAuth(db: Db, userId: string) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null)
}

export async function findUserById(db: Db, userId: string) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
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

export async function updateUserById(db: Db, id: string, data: any) {
  console.log("update")
  return db
    .collection("users")
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: "after", projection: { password: 0 } })
    .then(({ value }) => value)
}

interface IUser {
  emailVerified: boolean
  profilePicture: any
  email: string
  name: string
  bio: any
  _id?: any
}

export async function insertUser(db: Db, { email, originalPassword, bio = "", name, profilePicture }: any) {
  const user: IUser = {
    emailVerified: false,
    profilePicture,
    email,
    name,
    bio,
  }
  const password = await bcrypt.hash(originalPassword, 10)
  const { insertedId } = await db.collection("users").insertOne({ ...user, password })
  user._id = insertedId
  return user
}
