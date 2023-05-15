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
import { FeedbackInputSchema, FeedbackInputSchemaType, FeedbackModelSchemaType } from "../../../schema/FeedbackSchema"

import { Response } from "../../../types/response"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import {
  addToDbCollection,
  deleteFromCollectionById,
  getFromCollectionForUser,
  updateFromCollectionById,
} from "../../../lib/queries"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<FeedbackModelSchemaType[] | null>>>()
handler.post(...auths, async (req, res) => {
  const addNonInputData = (data: FeedbackInputSchemaType): Omit<FeedbackModelSchemaType, "_id"> => ({
    ...data,
    createdAt: new Date(),
  })

  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<FeedbackInputSchemaType>(FeedbackInputSchema)),
    E.map(addNonInputData),
    TE.fromEither,
    TE.chain(addToDbCollection("feedback"))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, error),
      () => handleAPIResponse(res, null, "Feedback added")
    )
  )
})

export default handler
