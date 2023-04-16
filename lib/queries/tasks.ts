import { Db, ObjectId } from "mongodb"
import { TaskModelSchema, TaskModelType } from "../../schema/TaskSchema"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"

export const getTasksForUser = (userId: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      return await db
        .collection("tasks")
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray()
    },
    (error) => `Failed to fetch todos for user: ${userId}: ${error}`
  )

export const deleteTaskById = (id: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) })
      return result
    },
    () => `Failed to delete task`
  )

export const addTaskToDb = (data: Omit<TaskModelType, "_id">) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = await db.collection("tasks").insertOne(data)
      return result
    },
    () => `Failed to insert task`
  )

export const updateTaskById = (data: Partial<TaskModelType>) =>
  TE.tryCatch(
    async () => {
      const { _id, ...dataToUpdate } = data
      const db = await getMongoDb()
      const updatedTask = await db
        .collection("tasks")
        .findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: dataToUpdate }, { returnDocument: "after" })

      return updatedTask.value ?? TE.left("Task not found")
    },
    (error) => `Error while updating task`
  )
