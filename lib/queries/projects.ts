import { Db, ObjectId } from "mongodb"
import { ProjectModelSchema, ProjectModelType } from "../../schema/ProjectSchema"

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
  const project = await db.collection("projects").findOne({ _id: new ObjectId(_id) })

  const parsedProject = ProjectModelSchema.safeParse(project)

  if (!parsedProject.success) {
    return null
  }
  return parsedProject.data
}

export const updateProjectById = async (db: Db, data: Partial<ProjectModelType>) => {
  /*
  const createTags = (data: Pick<ProjectModelType, "techStack" | "title">) =>
    [data.title, ...data.techStack.map((t) => t.label)].map((tag) => tag.toLowerCase()).join(", ")

  const tags = createTags(data)
  */

  const dataToUpdate = { ...data }

  delete dataToUpdate._id

  try {
    const updatedProject = await db
      .collection("projects")
      .findOneAndUpdate({ _id: new ObjectId(data._id) }, { $set: dataToUpdate }, { returnDocument: "after" })

    console.log(updatedProject)

    return updatedProject.value
  } catch (error) {
    console.log(error)
  }
}
