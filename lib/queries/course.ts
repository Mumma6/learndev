import { Db, ObjectId } from "mongodb"

interface NewCourse {
  content: {
    title: string
    description: string
    institution: string
    url?: string
  }
  userId: ObjectId
}

export const insertCourse = async (db: Db, { content, userId }: NewCourse) => {
  const course = {
    content,
    userId,
    createdAt: new Date(),
  }

  return await db.collection("courses").insertOne(course)
}

export const getCoursesForUser = async (db: Db, userId: ObjectId) => {
  return await db.collection("courses").find({ userId }).toArray()
}
