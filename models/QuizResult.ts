import { ObjectId } from "mongodb"

export interface IQuizResult {
  _id: ObjectId
  user_id: string
  quiz_id: string
  score: number
  approved: boolean
  takenAt: Date | string
}
