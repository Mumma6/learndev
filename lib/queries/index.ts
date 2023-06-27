import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"
import { type Document, ObjectId } from "mongodb"

export type CollectionType = "resources" | "tasks" | "courses" | "projects" | "feedback"

export const getFromCollectionForUser = (collection: CollectionType) => (userId: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      return await db
        .collection(collection)
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray()
    },
    (error) => `Failed to fetch ${collection} for user: ${userId}: ${error}`
  )

export const deleteFromCollectionById = (collection: CollectionType) => (id: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) })
      return result
    },
    () => `Failed to delete ${id} from ${collection}`
  )

export const addToDbCollection =
  <T extends Document>(collection: CollectionType) =>
    (data: T) =>
      TE.tryCatch(
        async () => {
          const db = await getMongoDb()
          const result = await db.collection(collection).insertOne(data)
          return result
        },
        () => `Failed to insert data to ${collection}`
      )

// T gets infered from the pipeline
export const updateFromCollectionById =
  <T extends Document>(collection: CollectionType) =>
    (data: T) =>
      TE.tryCatch(
        async () => {
          const { _id, ...dataToUpdate } = data
          const db = await getMongoDb()
          const updatedTask = await db
            .collection(collection)
            .findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: dataToUpdate }, { returnDocument: "after" })

          return updatedTask.value ?? TE.left("Item not found")
        },
        () => `Error while updating item from ${collection}`
      )
