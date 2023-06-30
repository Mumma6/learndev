import { type NextApiRequest, type NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"

import {
  checkUser,
  handleAPIError,
  handleAPIResponse,
  validateReqBody2
} from "../../../lib/utils"
import { FeedbackInputSchema, type FeedbackInputSchemaType, type FeedbackModelSchemaType } from "../../../schema/FeedbackSchema"

import { type Response } from "../../../types/response"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import {
  addToDbCollection
} from "../../../lib/queries"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<FeedbackModelSchemaType[] | null>>>()
handler.post(...auths, async (req, res) => {
  const addNonInputData = (data: FeedbackInputSchemaType): Omit<FeedbackModelSchemaType, "_id"> => ({
    ...data,
    createdAt: new Date()
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
      (error) => { handleAPIError(res, error) },
      () => { handleAPIResponse(res, null, "Feedback added") }
    )
  )
})

export default handler
