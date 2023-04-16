import { Db, InsertOneResult, ObjectId, WithId } from "mongodb"
import { CourseModelContentInputSchemaType, CourseModelSchema, CourseModelSchemaType } from "../../schema/CourseSchema"
import { ZodError } from "zod"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"
import { NextApiRequest } from "next"

export const addCourseToDb = (data: Omit<CourseModelSchemaType, "_id">) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = await db.collection("courses").insertOne(data)
      return result
    },
    () => `Failed to insert course`
  )

export const getCoursesForUser = (userId: string) =>
  pipe(
    TE.tryCatch(
      async () => {
        const db = await getMongoDb()
        return await db
          .collection("courses")
          .find({ userId: new ObjectId(userId) })
          .sort({ createdAt: -1, title: 1 })
          .toArray()
      },
      (error) => `Failed to fetch courses: ${error}`
    )
  )

export const deleteCourseById = (id: string) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      const result = await db.collection("courses").deleteOne({ _id: new ObjectId(id) })
      return result
    },
    () => `Failed to delete course`
  )

// The parsing should not be done here
export const findCoursebyId = async (db: Db, _id: string) => {
  const course = await db.collection("courses").findOne({ _id: new ObjectId(_id) })

  const parsedCourse = CourseModelSchema.safeParse(course)

  if (!parsedCourse.success) {
    return null
  }
  return parsedCourse.data
}

export const updateCourseById = (data: Partial<CourseModelSchemaType>) =>
  pipe(
    TE.tryCatch(
      async () => {
        const { _id, ...dataToUpdate } = data
        const db = await getMongoDb()
        const updatedCourse = await db
          .collection("courses")
          .findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: dataToUpdate }, { returnDocument: "after" })

        return updatedCourse.value ?? TE.left("Course not found")
      },
      (error) => `Error while updating course`
    )
  )
