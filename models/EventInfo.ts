import { type ObjectId } from "mongodb"
import { type Event } from "react-big-calendar"

// Replace these with Zod

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
