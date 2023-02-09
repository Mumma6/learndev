import bcrypt from "bcryptjs"
import { Db, ObjectId } from "mongodb"
import normalizeEmail from "validator/lib/normalizeEmail"
import { UserModelSchema, UserModelSchemaType } from "../../schema/UserSchema"

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

// The idea is when something new is added to the IUser, all users will automaticaly get the default values. ex Socails.
const setDefaultValues = async (
  data: Partial<UserModelSchemaType>,
  db: Db,
  id: string
): Promise<Partial<Omit<UserModelSchemaType, "_id">>> => {
  const userDbValues = await findUserById(db, id)

  // If something new is added to the userSchema. Add it here.
  const defaultUserValues = UserModelSchema.omit({ _id: true }).safeParse(data)

  if (!defaultUserValues.success) {
    return {
      ...(userDbValues && { ...userDbValues }),
      ...data,
    }
  }

  return {
    ...(defaultUserValues && { ...defaultUserValues }),
    ...(userDbValues && { ...userDbValues }),
    ...data,
  }
}

export async function updateUserById(db: Db, id: string, data: Partial<UserModelSchemaType>) {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: await setDefaultValues(data, db, id) },
      { returnDocument: "after", projection: { password: 0 } }
    )
    .then(({ value }) => value)
}

export async function insertUser(db: Db, data: Pick<UserModelSchemaType, "email" | "password" | "name">) {
  const parsedData = UserModelSchema.omit({ name: true, email: true, password: true, _id: true }).safeParse(data)

  if (!parsedData.success) {
    return null
  }

  const { email, password, name } = data
  const user = {
    ...parsedData.data,
    email,
    password,
    name,
  }
  const hashedPassword = await bcrypt.hash(user.password, 10)

  const { insertedId } = await db.collection("users").insertOne({ ...user, password: hashedPassword })

  const userOutput = await db.collection("users").findOne({ _id: insertedId })

  return userOutput
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
