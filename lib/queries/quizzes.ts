import { Db, ObjectId } from "mongodb"

import { IQuiz } from "../../models/Quiz"

export const getAllQuizzes = async (db: Db) => {
  return await db.collection<IQuiz>("quizzes").find({}).toArray()
}

export const findQuizbyId = async (db: Db, _id: string) => {
  return await db.collection<IQuiz>("quizzes").findOne({ _id: new ObjectId(_id) })
}
