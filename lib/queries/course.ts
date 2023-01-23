import { Db, ObjectId } from "mongodb"
import { ICourse } from "../../models/Course"

export const insertCourse = async (db: Db, { content, userId }: ICourse) => {
  // Ska ta emot all kurs data här.
  const course: ICourse = {
    content,
    userId,
    createdAt: new Date(), // skicka med detta som en parameter också so att data: ICourse är komplett.
  }

  return await db.collection<ICourse>("courses").insertOne(course)
}

export const getCoursesForUser = async (db: Db, userId: string) => {
  return await db.collection<ICourse>("courses").find({ userId }).sort({ createdAt: -1, title: 1 }).toArray()
}

export const deleteCourseById = async (db: Db, id: string) => {
  return await db.collection("courses").deleteOne({ _id: new ObjectId(id) })
}

export const findCoursebyId = async (db: Db, _id: string) => {
  return await db.collection<ICourse>("courses").findOne({ _id: new ObjectId(_id) })
}
