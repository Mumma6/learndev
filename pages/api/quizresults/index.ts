import { type NextApiRequest, type NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { addQuizResult, getAllQuizResults } from "../../../lib/queries/quizzes"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

import { checkUser, handleAPIError, handleAPIResponse } from "../../../lib/utils"

import { type IQuizResult } from "../../../models/QuizResult"
import { type Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IQuizResult[] | null>>>()

handler.post(...auths, async (req, res) => {
  // Needs validation here.

  const task = pipe(
    req,
    checkUser,
    E.map((req) => ({
      user_id: req.user?._id,
      takenAt: new Date(),
      ...req.body
    })),
    TE.fromEither,
    TE.chain(addQuizResult)
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, error) },
      () => { handleAPIResponse(res, null, "Quizresult added") }
    )
  )
})

handler.get(...auths, async (req, res) => {
  const task = pipe(req, checkUser, TE.fromEither, TE.chain(getAllQuizResults))

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, error) },
      (quizresults) => { handleAPIResponse(res, quizresults, "All quizResults") }
    )
  )
})

export default handler
