import { X } from "chart.js/dist/chunks/helpers.core"
import { WithId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { string } from "yup/lib/locale"
import { z } from "zod"
import { Institution } from "../../../components/courses/Courses"
import auths from "../../../lib/middlewares/auth"
import logger from "../../../lib/middlewares/logger"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteCourseById, getCoursesForUser, insertCourse } from "../../../lib/queries/course"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { implementZod, schemaForType } from "../../../lib/zodUtils"
import { ICourse } from "../../../models/Course"
import { Response } from "../../../types/response"

// this will trown an error in vercel deployment.
interface ExtendedNextApiRequest extends NextApiRequest {
  body: Pick<ICourse, "content" | "completed" | "topics">
}

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<ICourse[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  try {
    const db = await getMongoDb()
    const courses = await getCoursesForUser(db, req.user?._id)
    handleAPIResponse(res, courses, `Courses for user: ${req.user?.name}`)
  } catch (error) {
    console.log("Error when fethcing courses")
    handleAPIError(res, error)
  }
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, null, "No user found")
  }
  try {
    const createTags = (data: any) => []
    const tags = createTags(req.body)
    const db = await getMongoDb()

    // Is it possible to make sure we dont add anything thats not in the ICourse
    const CourseModelSchema = z.object({
      completed: z.boolean(),
      content: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        url: z.string().min(1),
        institution: z.string().min(1),
      }),
      topics: z.array(
        z.object({
          label: z.string(),
        })
      ),
    })

    const result = CourseModelSchema.safeParse(req.body)
    if (!result.success) {
      return handleAPIError(res, { message: "Validatation error" })
    }

    insertCourse(db, {
      content: req.body.content,
      userId: req.user?._id,
      completed: req.body.completed,
      topics: req.body.topics,
      createdAt: new Date(),
    })

    handleAPIResponse(res, null, "Course added")
  } catch (error) {
    console.log("Error when inserting course")
    handleAPIError(res, error)
  }
})

handler.delete(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, null, "No user found")
  }
  if (!req.query.id) {
    handleAPIResponse(res, null, "ID provided")
  }

  try {
    const db = await getMongoDb()
    deleteCourseById(db, req.query.id as string)
    handleAPIResponse(res, null, `Course with id: ${req.query.id} was deleted successfully`)
  } catch (error) {
    console.log("Error when deleting course")
    handleAPIError(res, error)
  }
})

export default handler
