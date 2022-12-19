import { WithId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import logger from "../../../lib/middlewares/logger"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteCourseById, getCoursesForUser, insertCourse } from "../../../lib/queries/course"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { ICourse } from "../../../models/Course"
import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<ICourse[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
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
    const db = await getMongoDb()
    insertCourse(db, {
      content: req.body.content,
      userId: req.user?._id,
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
