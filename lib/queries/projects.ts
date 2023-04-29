import { Db, ObjectId } from "mongodb"
import { ProjectModelSchema, ProjectModelType } from "../../schema/ProjectSchema"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"

export const findProjectById = async (db: Db, _id: string) => {
  const project = await db.collection("projects").findOne({ _id: new ObjectId(_id) })

  const parsedProject = ProjectModelSchema.safeParse(project)

  if (!parsedProject.success) {
    return null
  }
  return parsedProject.data
}
