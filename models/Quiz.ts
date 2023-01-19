import { ObjectId } from "mongodb"

export interface IAnswer {
  text: string
  key: number
}

export interface IQuestion {
  text: string
  answers: IAnswer[]
  correctAnswer: number
}

export interface IQuiz {
  _id: ObjectId | string
  title: string
  difficulty: 1 | 2 | 3 // 1-3. Show stars on the frontend. 1 star = easy, 3 stars = hard
  description: string
  tags: string[] // t ex "javascript, functionell programming, front end."
  passingScore: number
  questions: IQuestion[]
}
