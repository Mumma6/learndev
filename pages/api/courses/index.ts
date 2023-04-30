import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"

import {
  addUserId,
  checkUser,
  createDeleteHandler,
  getUserId,
  handleAPIError,
  handleAPIResponse,
  validateAndGetUserId,
  validateArrayData2,
  validateData2,
  validateReqBody2,
} from "../../../lib/utils"

import { CourseModelformInputSchema, CourseModelSchema, CourseModelSchemaType } from "../../../schema/CourseSchema"
import { Response } from "../../../types/response"

import { CourseModelformInputType } from "../../../schema/CourseSchema"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import {
  addToDbCollection,
  deleteFromCollectionById,
  getFromCollectionForUser,
  updateFromCollectionById,
} from "../../../lib/queries"

const createTags = (data: Pick<CourseModelSchemaType, "content" | "topics">): string => {
  return [data.content.title, data.content.institution, ...data.topics.map((t) => t.label)]
    .map((tag) => tag.toLowerCase())
    .join(", ")
}

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<CourseModelSchemaType[] | null>>>()

handler.post(...auths, async (req, res) => {
  const addNonInputData =
    (userId: string) =>
    (data: CourseModelformInputType): Omit<CourseModelSchemaType, "_id"> => ({
      ...data,
      tags: createTags(data),
      createdAt: new Date(),
      userId,
    })

  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<CourseModelformInputType>(CourseModelformInputSchema)),
    E.map(addNonInputData(addUserId(req))),
    TE.fromEither,
    TE.chain(addToDbCollection("courses"))
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
    validateAndGetUserId,
    TE.chain(getFromCollectionForUser("courses")),
    TE.chain(validateArrayData2<CourseModelSchemaType>(CourseModelSchema))
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

handler.delete(...auths, createDeleteHandler(deleteFromCollectionById("courses")))

handler.patch(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<Partial<CourseModelSchemaType>>(CourseModelSchema.partial())),
    TE.fromEither,
    TE.chain(updateFromCollectionById("courses"))
  )

  const either = await task()

  pipe(
    either,
    E.chain(validateData2<CourseModelSchemaType>(CourseModelSchema)),
    E.fold(
      (error) => handleAPIError(res, error),
      (data) => handleAPIResponse(res, data, "Course updated successfully")
    )
  )
})

export default handler
