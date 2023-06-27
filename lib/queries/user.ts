import bcrypt from "bcryptjs"
import { type Db, ObjectId } from "mongodb"
import normalizeEmail from "validator/lib/normalizeEmail"
import { UserModelSchema, type UserModelSchemaType } from "../../schema/UserSchema"

// Add TaskEither to all these functions

export function dbProjectionUsers (prefix = "") {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0
  }
}

export async function findUserWithEmailAndPassword (db: Db, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  const user = await db.collection("users").findOne({ email: normalizedEmail })
  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined } // filtered out password
  }
  return null
}

export async function findUserForAuth (db: Db, userId: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    return user || null
  } catch (error) {
    throw error
  }
}

export async function findUserById (db: Db, userId: string) {
  return await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null)
}

export async function findCompleteUserById (db: Db, userId: string) {
  return await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) })
    .then((user) => user || null)
}

export async function findUserByEmail (db: Db, email: string) {
  return await db
    .collection("users")
    .findOne({ email }, { projection: dbProjectionUsers() })
    .then((user) => user || null)
}

// When something new is added to the IUser, all users will automaticaly get the default values
const setDefaultValues = async (
  data: Partial<UserModelSchemaType>,
  db: Db,
  id: string
): Promise<Partial<Omit<UserModelSchemaType, "_id" | "password">>> => {
  const userDbValues = await findUserById(db, id)

  const defaultUserValues = UserModelSchema.omit({ password: true, _id: true, email: true, name: true }).safeParse(data)

  if (!defaultUserValues.success) {
    return {
      ...(userDbValues && { ...userDbValues }),
      ...data
    }
  }

  return {
    ...(defaultUserValues.data && { ...defaultUserValues.data }),
    ...(userDbValues && { ...userDbValues }),
    ...data
  }
}

export const updateUserById = async (db: Db, id: string, data: Partial<UserModelSchemaType>) => {
  try {
    const updatedUser = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: await setDefaultValues(data, db, id) },
        { returnDocument: "after", projection: { password: 0 } }
      )
    return updatedUser.value
  } catch (err) {
    // handle error
  }
}

export async function insertUser (db: Db, data: Pick<UserModelSchemaType, "email" | "password" | "name">) {
  const parsedData = UserModelSchema.omit({ name: true, email: true, password: true, _id: true }).safeParse(data)

  if (!parsedData.success) {
    return null
  }

  const { email, password, name } = data
  const user = {
    ...parsedData.data,
    email,
    password,
    name
  }
  const hashedPassword = await bcrypt.hash(user.password, 10)

  const insert = await db.collection("users").insertOne({ ...user, password: hashedPassword })

  const userOutput = await db.collection("users").findOne({ _id: insert.insertedId })

  return userOutput
}

export async function updateUserPasswordByOldPassword (db: Db, id: string, oldPassword: string, newPassword: string) {
  const user = await db.collection("users").findOne(new ObjectId(id))
  if (!user) return false
  const matched = await bcrypt.compare(oldPassword, user.password)
  if (!matched) return false
  const password = await bcrypt.hash(newPassword, 10)
  await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password } })
  return true
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function UNSAFE_updateUserPassword (db: Db, id: string, newPassword: string) {
  const password = await bcrypt.hash(newPassword, 10)
  await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password } })
}

export const deleteUser = async (db: Db, id: string) => {
  await db.collection("users").deleteOne({ _id: new ObjectId(id) })
  await db.collection("courses").deleteMany({ userId: new ObjectId(id) })
  await db.collection("projects").deleteMany({ userId: new ObjectId(id) })
  await db.collection("events").deleteMany({ userId: new ObjectId(id) })
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
