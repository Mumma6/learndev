import { Db, InsertOneResult, ObjectId, WithId } from "mongodb"
import { CourseModelContentInputSchemaType, CourseModelSchema, CourseModelSchemaType } from "../../schema/CourseSchema"
import { ZodError } from "zod"
import { Either, right, left } from "../../helpers/either"

export const insertCourse = async (db: Db, data: Omit<CourseModelSchemaType, "_id">) => {
  return await db.collection("courses").insertOne(data)
}

export const getCoursesForUser = async (db: Db, userId: string): Promise<CourseModelSchemaType[]> => {
  // Make sure the find works. Should it be string or ObjectID

  // @ts-ignore
  return await db
    .collection("courses")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1, title: 1 })
    .toArray()
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

export const updateCourseById = async (db: Db, data: Partial<CourseModelSchemaType>) => {
  const dataToUpdate = { ...data }

  delete dataToUpdate._id

  try {
    const updatedCourse = await db
      .collection("courses")
      .findOneAndUpdate({ _id: new ObjectId(data._id) }, { $set: dataToUpdate }, { returnDocument: "after" })

    console.log(updatedCourse)

    return updatedCourse.value
  } catch (error) {
    console.log(error)
  }
}
