import { Db, ObjectId } from "mongodb"
import { IEventInfo } from "../../models/EventInfo"

export const getEventsForUser = async (db: Db, userId: ObjectId) => {
  return await db.collection("events").find({ userId }).toArray()
}

export const addEventForUser = async (db: Db, data: IEventInfo, userId: ObjectId) => {
  const event = {
    ...data,
    userId,
  }
  return await db.collection<IEventInfo>("events").insertOne(event)
}

export const deleteEventById = async (db: Db, id: string) => {
  return await db.collection("events").deleteOne({ _id: new ObjectId(id) })
}
