import { Db, ObjectId } from "mongodb"
import { IProjects } from "../../models/Projects"

export const getProjectsForUser = async (db: Db, userId: string) => {
  return await db
    .collection<IProjects>("projects")
    .find({ userId })
    .sort({ createdAd: -1 })
    .toArray()
}

export const insertProject = async (db: Db, data: IProjects) => {
  return await db.collection<IProjects>("projects").insertOne(data)
}

export const deleteProjectById = async (db: Db, id: string) => {
  return await db.collection("projects").deleteOne({ _id: new ObjectId(id) })
}

export const findProjectById = async (db: Db, _id: string) => {
  return await db.collection<IProjects>("projects").findOne({ _id: new ObjectId(_id) })
}
