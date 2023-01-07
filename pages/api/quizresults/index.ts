import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { addQuizResult, getAllQuizzes } from "../../../lib/queries/quizzes"

import { handleAPIError, handleAPIResponse } from "../../../lib/utils"

import { IQuizResult } from "../../../models/QuizResult"
import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IQuizResult[] | null>>>()

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  const payload = {
    user_id: req.user._id,
    takenAt: new Date(),
    ...req.body,
  }

  try {
    const db = await getMongoDb()
    addQuizResult(db, payload)
    handleAPIResponse(res, null, "Quiz result added")
  } catch (error) {
    console.log("Error when adding quiz result")
    handleAPIError(res, error)
  }
})

export default handler
