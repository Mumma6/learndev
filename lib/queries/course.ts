import { type Db, ObjectId } from "mongodb"
import { CourseModelSchema } from "../../schema/CourseSchema"

// The parsing should not be done here
export const findCoursebyId = async (db: Db, _id: string) => {
  const course = await db.collection("courses").findOne({ _id: new ObjectId(_id) })

  const parsedCourse = CourseModelSchema.safeParse(course)

  if (!parsedCourse.success) {
    return null
  }
  return parsedCourse.data
}
