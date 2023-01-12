import { Db, ObjectId } from "mongodb"

import { IQuiz } from "../../models/Quiz"
import { IQuizResult } from "../../models/QuizResult"

export const getAllQuizzes = async (db: Db) => {
  return await db.collection<IQuiz>("quizzes").find({}).toArray()
}

export const findQuizbyId = async (db: Db, _id: string) => {
  return await db.collection<IQuiz>("quizzes").findOne({ _id: new ObjectId(_id) })
}

export const addQuizResult = async (db: Db, data: Omit<IQuizResult, "_id">) => {
  return await db.collection("quizresults").insertOne(data)
}

export const getAllQuizResults = async (db: Db) => {
  return await db.collection("quizresults").find({}).toArray()
}
