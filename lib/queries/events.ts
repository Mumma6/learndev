import { ObjectId } from "mongodb"
import { type IEventInfo } from "../../models/EventInfo"
import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"

export const getEventsForUser = (userId: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      return await db
        .collection("events")
        .find({ userId: new ObjectId(userId) })

        .toArray()
    },
    (error) => `Failed to get projects for user ${error}`
  )

interface IUserID {
  userId: string
}

export const addEventForUser = (data: IEventInfo & IUserID) =>
  TE.tryCatch(
    async () => {
      return await (await getMongoDb()).collection<IEventInfo>("events").insertOne(data)
    },
    (error) => "Failed to add project"
  )

export const deleteEventById = (id: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = db.collection("events").deleteOne({ _id: new ObjectId(id) })
      return await result
    },
    () => "Failed to delete event"
  )
