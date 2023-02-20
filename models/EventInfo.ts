import { ObjectId } from "mongodb"
import { Event } from "react-big-calendar"

import { IQuiz } from "./Quiz"

export interface IEventInfo extends Event {
  _id?: string
  description: string

  labelColor?: string | null | undefined

  labelName?: string | null | undefined
  userId?: null | string | ObjectId

  activityName?: string | null | undefined

  activityId?: string | null | undefined
  activityGroup?: string | null | undefined
}
