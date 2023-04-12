import { Db, ObjectId } from "mongodb"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

import { IQuiz } from "../../models/Quiz"
import { IQuizResult } from "../../models/QuizResult"
import { getMongoDb } from "../mongodb"

export const getAllQuizzes = () =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      return await db.collection<IQuiz>("quizzes").find({}).toArray()
    },
    () => "Error getting quizzes"
  )

export const findQuizbyId = async (db: Db, _id: string) => {
  return await db.collection<IQuiz>("quizzes").findOne({ _id: new ObjectId(_id) })
}

export const addQuizResult = (data: Omit<IQuizResult, "_id">) =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      await db.collection("quizresults").insertOne(data)
    },
    () => "Error adding quiz result"
  )

export const getAllQuizResults = () =>
  TE.tryCatch(
    async () => {
      const db = await getMongoDb()
      return await db.collection("quizresults").find({}).sort({ createdAt: -1 }).toArray()
    },
    () => "Error getting quizzes"
  )

export const getQuizResultsForUser = async (db: Db, userId: string) => {
  // Make sure the find works. Should it be string or ObjectID

  return await db.collection("quizresults").find({ user_id: userId }).toArray()
}
