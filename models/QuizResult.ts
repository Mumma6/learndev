import { type ObjectId } from "mongodb"

// Replace these with Zod

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
