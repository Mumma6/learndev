import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { unknown, z, ZodError } from "zod"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteCourseById, getCoursesForUser, insertCourse, updateCourseById } from "../../../lib/queries/course"
import { checkUser, handleAPIError, handleAPIResponse } from "../../../lib/utils"

import { CourseModelformInputSchema, CourseModelSchema, CourseModelSchemaType } from "../../../schema/CourseSchema"
import { Response } from "../../../types/response"

import { CourseModelformInputType } from "../../../schema/CourseSchema"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

const createTags = (data: Pick<CourseModelSchemaType, "content" | "topics">): string => {
  return [data.content.title, data.content.institution, ...data.topics.map((t) => t.label)]
    .map((tag) => tag.toLowerCase())
    .join(", ")
}

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<CourseModelSchemaType[] | null>>>()

// testa att få saker att funka

handler.post(...auths, async (req, res) => {
  const validateBody = (req: NextApiRequest): E.Either<string, CourseModelformInputType> => {
    const parsedFormInput = CourseModelformInputSchema.safeParse(req.body)
    return parsedFormInput.success ? E.right(parsedFormInput.data) : E.left("parsedFormInput.error")
  }

  const addNonInputData = (data: CourseModelformInputType): Omit<CourseModelSchemaType, "_id"> => ({
    ...data,
    tags: createTags(data),
    createdAt: new Date(),
    userId: req.user?._id!,
    tasks: [], // får komma in som data
    resources: [], // får komma in som data
  })

  const addCourseToDb = (data: Omit<CourseModelSchemaType, "_id">) =>
    E.tryCatch(
      async () => {
        const db = await getMongoDb()
        const result = await insertCourse(db, data)
        return result
      },
      () => `Failed to insert course`
    )

  pipe(
    req,
    checkUser,
    E.chain(validateBody),
    E.map(addNonInputData),
    E.chain(addCourseToDb),
    E.fold(
      (error) => handleAPIError(res, error),
      () => handleAPIResponse(res, null, "Course added")
    )
  )
})

handler.get(...auths, async (req, res) => {
  const getCourses = (req: NextApiRequest): TE.TaskEither<string, CourseModelSchemaType[]> =>
    pipe(
      TE.tryCatch(
        async () => {
          const db = await getMongoDb()
          return await getCoursesForUser(db, req.user?._id!)
        },
        (error) => `Failed to fetch courses: ${error}`
      )
    )

  const validateCourses = (courses: CourseModelSchemaType[]) => {
    const parsedCourses = z.array(CourseModelSchema).safeParse(courses)
    return parsedCourses.success ? E.right(parsedCourses.data) : E.left("Error while parsing courses")
  }

  const task = pipe(
    req,
    checkUser,
    TE.fromEither,
    TE.chain(getCourses),
    TE.chain((courses) => TE.fromEither(validateCourses(courses)))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      (data) => handleAPIResponse(res, data, `Courses for user: ${req.user?.name}`)
    )
  )
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
