import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { unknown, z, ZodError } from "zod"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { addCourseToDb, deleteCourseById, getCoursesForUser, updateCourseById } from "../../../lib/queries/course"
import {
  checkUser,
  getUserId,
  handleAPIError,
  handleAPIResponse,
  validateArrayData,
  validateData,
  validateQueryParam,
  validateReqBody,
} from "../../../lib/utils"

import { CourseModelformInputSchema, CourseModelSchema, CourseModelSchemaType } from "../../../schema/CourseSchema"
import { Response } from "../../../types/response"

import { CourseModelformInputType } from "../../../schema/CourseSchema"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { WithId } from "mongodb"

const createTags = (data: Pick<CourseModelSchemaType, "content" | "topics">): string => {
  return [data.content.title, data.content.institution, ...data.topics.map((t) => t.label)]
    .map((tag) => tag.toLowerCase())
    .join(", ")
}

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<CourseModelSchemaType[] | null>>>()

handler.post(...auths, async (req, res) => {
  const addNonInputData = (data: CourseModelformInputType): Omit<CourseModelSchemaType, "_id"> => ({
    ...data,
    tags: createTags(data),
    createdAt: new Date(),
    userId: req.user?._id!,
    tasks: [], // får komma in som data
    resources: [], // får komma in som data
  })

  const task = pipe(
    req,
    checkUser,
    E.chain((req) => validateReqBody<CourseModelformInputType>(req, CourseModelformInputSchema)),
    E.map(addNonInputData),
    TE.fromEither,
    TE.chain(addCourseToDb)
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, error),
      () => handleAPIResponse(res, null, "Course added")
    )
  )
})

handler.get(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(getUserId),
    TE.fromEither,
    TE.chain(getCoursesForUser),
    TE.chain((courses) => TE.fromEither(validateArrayData<CourseModelSchemaType>(courses, CourseModelSchema)))
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
  const task = pipe(req, checkUser, E.chain(validateQueryParam), TE.fromEither, TE.chain(deleteCourseById))

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      () => handleAPIResponse(res, null, `Course was deleted successfully`)
    )
  )
})

handler.patch(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain((req) => validateReqBody<Partial<CourseModelSchemaType>>(req, CourseModelSchema.partial())),
    TE.fromEither,
    TE.chain(updateCourseById)
  )

  const either = await task()

  pipe(
    either,
    E.chain((data) => validateData<CourseModelSchemaType>(data, CourseModelSchema)),
    E.fold(
      (error) => handleAPIError(res, error),
      (data) => handleAPIResponse(res, data, "Course updated successfully")
    )
  )
})

export default handler
