import { Event } from "react-big-calendar"
import { ICourse } from "./Course"
import { IQuiz } from "./Quiz"

export interface IEventInfo extends Event {
  description: string
  course?: ICourse | null
  quiz?: IQuiz | null
  titleColor?: string | null
}
