import { Db, ObjectId, WithId } from "mongodb"
import { CourseModelContentInputSchemaType, CourseModelSchema, CourseModelSchemaType } from "../../schema/CourseSchema"

export const insertCourse = async (db: Db, data: Omit<CourseModelSchemaType, "_id">) => {
  // Ska ta emot all kurs data här.

  return await db.collection("courses").insertOne(data)
}

export const getCoursesForUser = async (db: Db, userId: string) => {
  // Make sure the find works. Should it be string or ObjectID

  return await db.collection("courses").find({ userId }).sort({ createdAt: -1, title: 1 }).toArray()
}

export const deleteCourseById = async (db: Db, id: string) => {
  return await db.collection("courses").deleteOne({ _id: new ObjectId(id) })
}

export const findCoursebyId = async (db: Db, _id: string) => {
  const course = await db.collection("courses").findOne({ _id: new ObjectId(_id) })

  const parsedCourse = CourseModelSchema.safeParse(course)

  if (!parsedCourse.success) {
    return null
  }
  return parsedCourse.data
}
