import { Db, ObjectId } from "mongodb"
import { ICourse } from "../../models/course"

export const insertCourse = async (db: Db, { content, userId }: ICourse) => {
  const course = {
    content,
    userId,
    createdAt: new Date(),
  }

  return await db.collection<ICourse>("courses").insertOne(course)
}

export const getCoursesForUser = async (db: Db, userId: string) => {
  return await await db.collection<ICourse>("courses").find({ userId }).sort({ createdAt: -1, title: 1 }).toArray()
}

export const deleteCourseById = async (db: Db, id: string) => {
  return await db.collection("courses").deleteOne({ _id: new ObjectId(id) })
}
