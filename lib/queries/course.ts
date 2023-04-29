import { Db, InsertOneResult, ObjectId, WithId } from "mongodb"
import { CourseModelContentInputSchemaType, CourseModelSchema, CourseModelSchemaType } from "../../schema/CourseSchema"
import { ZodError } from "zod"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { getMongoDb } from "../mongodb"
import { NextApiRequest } from "next"

// The parsing should not be done here
export const findCoursebyId = async (db: Db, _id: string) => {
  const course = await db.collection("courses").findOne({ _id: new ObjectId(_id) })

  const parsedCourse = CourseModelSchema.safeParse(course)

  if (!parsedCourse.success) {
    return null
  }
  return parsedCourse.data
}
