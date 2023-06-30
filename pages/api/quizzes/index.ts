import { type NextApiRequest, type NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { getAllQuizzes } from "../../../lib/queries/quizzes"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

import { checkUser, handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { type IQuiz } from "../../../models/Quiz"
import { type Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IQuiz[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(req, checkUser, TE.fromEither, TE.chain(getAllQuizzes))

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, error) },
      (quizzes) => { handleAPIResponse(res, quizzes, "All quizzes") }
    )
  )
})

export default handler
