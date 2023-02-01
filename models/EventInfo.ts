import { ObjectId } from "mongodb"
import { Event } from "react-big-calendar"
import { ICourse } from "./Course"
import { IQuiz } from "./Quiz"

export interface IEventInfo extends Event {
  _id?: string
  description: string

  color?: string | null | undefined
  userId?: null | string | ObjectId
  quizId?: null | string
  courseId?: null | string
  courseName?: null | string
}
