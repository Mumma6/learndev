import bcrypt from "bcryptjs"
import { Db, ObjectId } from "mongodb"
import normalizeEmail from "validator/lib/normalizeEmail"
import * as _ from "lodash"
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

export async function findCompleteUserById(db: Db, userId: string) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) })
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
): Promise<Partial<Omit<UserModelSchemaType, "_id" | "password">>> => {
  // Behövs verkligen userDbValues? Objektet behöver kanske inte vara komplett i findAndUpdate
  const userDbValues = await findUserById(db, id)

  const defaultUserValues = UserModelSchema.omit({ password: true, _id: true, email: true, name: true }).safeParse(data)

  console.log(defaultUserValues)

  if (!defaultUserValues.success) {
    console.log("feeeel")
    return {
      ...(userDbValues && { ...userDbValues }),
      ...data,
    }
  }

  return {
    ...(defaultUserValues.data && { ...defaultUserValues.data }),
    ...(userDbValues && { ...userDbValues }),
    ...data,
  }
}

// detta görs med en patch
/*
export const updateUserById = async (db: Db, id: string, data: Partial<UserModelSchemaType>) => {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: await setDefaultValues(data, db, id) },
      { returnDocument: "after", projection: { password: 0 } }
    )
    .then(({ value }) => value)
}
*/

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

/*
---------------------- This code will allow us to add and remove fields based on the schema. This can be danger if we accedently remove something from the schema.

// Should never be sent to the frontend
export async function findUserByIdWithPassword(db: Db, userId: string) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) })
    .then((user) => user || null)
}



function removeProperties<T extends object>(obj1: T, obj2: object | null): T & object {
  if (obj2 === null) return obj1
  const commonKeys = _.intersection(Object.keys(obj1), Object.keys(obj2)) as Array<keyof T & keyof object>
  const result = _.pick(obj2, commonKeys) as T & object
  return result
}

// The idea is when something new is added to the IUser, all users will automaticaly get the default values. ex Socails.
const setDefaultValues = async (
  data: Partial<UserModelSchemaType>,
  db: Db,
  id: string
): Promise<Partial<Omit<UserModelSchemaType, "_id" | "password">>> => {
  const userDbValues = await findUserByIdWithPassword(db, id)

  // will clean up all removed properties
  const userDbValuesParsed = UserModelSchema.safeParse(userDbValues)

  // will add all new props
  const defaultUserValues = UserModelSchema.omit({ password: true, _id: true, email: true, name: true }).safeParse(data)

  if (!defaultUserValues.success || !userDbValuesParsed.success) {
    return {
      ...(userDbValues && { ...userDbValues }),
      ...data,
    }
  }

  const cleanedValues = removeProperties(userDbValuesParsed.data, userDbValues)

  return {
    ...defaultUserValues.data,
    ...cleanedValues,
    ...data,
  }
}


*/
