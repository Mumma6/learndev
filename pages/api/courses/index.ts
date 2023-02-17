import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { z } from "zod"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteCourseById, getCoursesForUser, insertCourse, updateCourseById } from "../../../lib/queries/course"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { validateBody } from "../../../lib/zodUtils"

import { CourseModelformInputSchema, CourseModelSchema, CourseModelSchemaType } from "../../../schema/CourseSchema"
import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<CourseModelSchemaType[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  try {
    const db = await getMongoDb()
    const courses = await getCoursesForUser(db, req.user?._id)

    // Move this logic to the query instead?
    const parsedCourses = z.array(CourseModelSchema).safeParse(courses)

    if (!parsedCourses.success) {
      return handleAPIError(res, { message: "Validation error" })
    }

    const { data } = parsedCourses

    handleAPIResponse(res, data, `Courses for user: ${req.user?.name}`)
  } catch (error) {
    console.log("Error when fethcing courses")
    handleAPIError(res, error)
  }
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }

  try {
    const parsedFormInput = CourseModelformInputSchema.safeParse(req.body)

    if (!parsedFormInput.success) {
      console.log(parsedFormInput.error)

      // gör en cool generic function som visar alla felen från valideringen
      return handleAPIError(res, { message: "Validation error" })
    }

    const { data } = parsedFormInput
    const createTags = (data: Pick<CourseModelSchemaType, "content" | "topics">) =>
      [data.content.title, data.content.institution, ...data.topics.map((t) => t.label)]
        .map((tag) => tag.toLowerCase())
        .join(" ,")

    const db = await getMongoDb()

    const tags = createTags(data)

    insertCourse(db, {
      ...data,
      userId: req.user._id,
      tags,
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
    // deleteEvents
    // deleteProjects
    handleAPIResponse(res, null, `Course with id: ${req.query.id} was deleted successfully`)
  } catch (error) {
    console.log("Error when deleting course")
    handleAPIError(res, error)
  }
})

handler.patch(...auths, async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }

  try {
    const db = await getMongoDb()

    const parsedBody = CourseModelSchema.partial().safeParse(req.body)

    if (!parsedBody.success) {
      console.log(parsedBody.error)
      return handleAPIError(res, { message: "Validation error. User input" })
    }

    const updatedCourse = await updateCourseById(db, parsedBody.data)

    console.log(updatedCourse)

    const parsedProject = CourseModelSchema.safeParse(updatedCourse)

    if (!parsedProject.success) {
      return handleAPIError(res, { message: "Validation error when updating Course" })
    }

    handleAPIResponse(res, parsedProject.data, "Course updated successfully")
  } catch (error) {
    console.log("Error when updating course")
    handleAPIError(res, error)
  }
})

export default handler
