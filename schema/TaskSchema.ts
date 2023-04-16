import { z } from "zod"
import { ObjectId } from "bson"

export const PrioEnum = z.enum(["Low", "Medium", "High"])

export type TaskPrioEnumType = z.infer<typeof PrioEnum>

export const TaskFormInputSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(50),
  completed: z.boolean().default(false),
  prio: PrioEnum,
  activityName: z.string().default(""),
  activityId: z.string().default(""),
  activityGroup: z.string().default(""),
})

export type TaskFormInputType = z.infer<typeof TaskFormInputSchema>

export const TaskModelSchema = TaskFormInputSchema.extend({
  userId: z.instanceof(ObjectId).transform((id) => id.toString()),
  _id: z.union([z.string(), z.instanceof(ObjectId).transform((id) => id.toString())]),
  createdAt: z.date(),
})

export type TaskModelType = z.infer<typeof TaskModelSchema>
