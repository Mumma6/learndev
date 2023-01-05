import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import logger from "../../../lib/middlewares/logger"
import { getMongoDb } from "../../../lib/mongodb"
import { getAllQuizzes } from "../../../lib/queries/quizzes"

import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { IQuiz } from "../../../models/Quiz"
import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IQuiz[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  try {
    const db = await getMongoDb()
    const quizzes = await getAllQuizzes(db)
    handleAPIResponse(res, quizzes, "All quizzes")
  } catch (error) {
    console.log("Error when fethcing quizzes")
    handleAPIError(res, error)
  }
})

export default handler
