import { Db, ObjectId } from "mongodb"
import { TaskModelSchema, TaskModelType } from "../../schema/TaskSchema"

export const getTasksForUser = async (db: Db, userId: string) => {
  return await db
    .collection("tasks")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray()
}

export const insertTask = async (db: Db, data: Omit<TaskModelType, "_id">) => {
  return await db.collection("tasks").insertOne(data)
}
