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
  return db
    .collection("users")
    .findOne({ email: normalizedEmail }, { projection: dbProjectionUsers() })
    .then((user) => user || null)
}

// test by adding a new default value "test"
const defaultUserValues: Omit<IUser, "password"> = {
  email: "",
  bio: "",
  name: "",
  profilePicture: "",
  skills: [],
  workexperience: [],
  completedQuizzes: [],
  emailVerified: false,
  userSettings: {},
  socials: {
    linkedin: "",
    twitter: "",
    youtube: "",
    github: "",
    blog: "",
    personalWebsite: "",
  },
}

// The idea is when something new is added to the IUser, all users will automaticaly get the default values. ex Socails.
const setDefaultValues = async (data: Partial<IUser>, db: Db, id: string): Promise<Omit<IUser, "password">> => {
  const userDbValues = await findUserById(db, id)

  return {
    ...defaultUserValues,
    ...(userDbValues && { ...userDbValues }),
    ...data,
  }
}

export async function updateUserById(db: Db, id: string, data: Partial<IUser>) {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: await setDefaultValues(data, db, id) },
      { returnDocument: "after", projection: { password: 0 } }
    )
    .then(({ value }) => value)
}

export async function insertUser(db: Db, { email, password, name }: Pick<IUser, "email" | "password" | "name">) {
  const user: IUser = {
    ...defaultUserValues,
    email,
    password,
    name,
  }
  const hashedPassword = await bcrypt.hash(user.password, 10)

  const { insertedId } = await db.collection("users").insertOne({ ...user, password: hashedPassword })
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

export const findUserBySession = async (db: Db, sessionId: string) => {
  try {
    const session = await db.collection("sessions").findOne({ _id: sessionId })

    if (!session) {
      return null
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(session.session.passport.user) })
    return user
  } catch (error) {}
}
