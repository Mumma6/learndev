import { ObjectId } from "mongodb"

export interface IQuizResult {
  _id: ObjectId
  user_id: string
  quiz_id: string
  score: number
  maxScore: number
  topic: string
  approved: boolean
  takenAt: Date | string
  difficulty: number
  title: string
}
