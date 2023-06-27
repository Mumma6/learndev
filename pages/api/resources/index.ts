import { type NextApiRequest, type NextApiResponse } from "next"
import nextConnect from "next-connect"

import auths from "../../../lib/middlewares/auth"

import {
  addUserId,
  checkUser,
  createDeleteHandler,
  getUserId,
  handleAPIError,
  handleAPIResponse,
  validateArrayData2,
  validateReqBody2
} from "../../../lib/utils"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { type Response } from "../../../types/response"
import {
  addToDbCollection,
  deleteFromCollectionById,
  getFromCollectionForUser
} from "../../../lib/queries"
import {
  ResourceModelInputSchema,
  type ResourceModelInputSchemaType,
  ResourceModelSchema,
  type ResourceModelSchemaType
} from "../../../schema/ResourceSchema"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<ResourceModelSchemaType[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(getUserId),
    TE.fromEither,
    TE.chain(getFromCollectionForUser("resources")),
    TE.chain(validateArrayData2<ResourceModelSchemaType>(ResourceModelSchema))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, { message: error }) },
      (data) => { handleAPIResponse(res, data, `resources for user: ${req.user?.name}`) }
    )
  )
})

handler.post(...auths, async (req, res) => {
  const addNonInputData =
    (userId: string) =>
      (data: ResourceModelInputSchemaType): Omit<ResourceModelSchemaType, "_id"> => ({
        ...data,
        createdAt: new Date(),
        userId
      })

  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<ResourceModelInputSchemaType>(ResourceModelInputSchema)),
    E.map(addNonInputData(addUserId(req))),
    TE.fromEither,
    TE.chain(addToDbCollection("resources"))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, { message: error }) },
      () => { handleAPIResponse(res, null, "Task added") }
    )
  )
})

handler.delete(...auths, createDeleteHandler(deleteFromCollectionById("resources")))

export default handler
