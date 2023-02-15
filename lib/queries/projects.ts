import { Db, ObjectId } from "mongodb"
import { ProjectModelType } from "../../schema/ProjectSchema"

export const getProjectsForUser = async (db: Db, userId: string) => {
  return await db.collection("projects").find({ userId }).sort({ createdAd: -1 }).toArray()
}

export const insertProject = async (db: Db, data: Omit<ProjectModelType, "_id">) => {
  return await db.collection("projects").insertOne(data)
}

export const deleteProjectById = async (db: Db, id: string) => {
  return await db.collection("projects").deleteOne({ _id: new ObjectId(id) })
}

export const findProjectById = async (db: Db, _id: string) => {
  return await db.collection("projects").findOne({ _id: new ObjectId(_id) })
}
