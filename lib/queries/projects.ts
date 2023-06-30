import { type Db, ObjectId } from "mongodb"
import { ProjectModelSchema } from "../../schema/ProjectSchema"

export const findProjectById = async (db: Db, _id: string) => {
  const project = await db.collection("projects").findOne({ _id: new ObjectId(_id) })

  const parsedProject = ProjectModelSchema.safeParse(project)

  if (!parsedProject.success) {
    return null
  }
  return parsedProject.data
}
