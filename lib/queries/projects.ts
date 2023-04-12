import { Db, ObjectId } from "mongodb"
import { ProjectModelSchema, ProjectModelType } from "../../schema/ProjectSchema"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"

export const getProjectsForUser = (userId: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      return await db
        .collection("projects")
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray()
    },
    (error) => `Failed to get projects for user ${error}`
  )

export const insertProject = (data: Omit<ProjectModelType, "_id">) =>
  TE.tryCatch(
    async () => await (await getMongoDb()).collection("projects").insertOne(data),
    (error) => "Failed to add project"
  )

export const deleteProjectById = (id: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) })
      return result
    },
    () => `Failed to delete course`
  )

export const findProjectById = async (db: Db, _id: string) => {
  const project = await db.collection("projects").findOne({ _id: new ObjectId(_id) })

  const parsedProject = ProjectModelSchema.safeParse(project)

  if (!parsedProject.success) {
    return null
  }
  return parsedProject.data
}

export const updateProjectById = (data: Partial<ProjectModelType>) =>
  pipe(
    TE.tryCatch(
      async () => {
        const { _id, ...dataToUpdate } = data
        const db = await getMongoDb()
        const updatedProject = await db
          .collection("projects")
          .findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: dataToUpdate }, { returnDocument: "after" })

        return updatedProject.value ?? TE.left("Project not found")
      },
      (error) => `Error while updating project`
    )
  )
