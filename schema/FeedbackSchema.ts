import { z } from "zod"
import { ObjectId } from "bson"

export const FeedbackInputSchema = z.object({
  good: z.string().min(1).max(500),
  bad: z.string().min(1).max(500),
  other: z.string().default(""),
  reporterName: z.string(),
  reporterEmail: z.string()
})

export type FeedbackInputSchemaType = z.infer<typeof FeedbackInputSchema>

export const FeedbackModel = FeedbackInputSchema.extend({
  _id: z.instanceof(ObjectId).transform((id) => id.toString()),

  createdAt: z.date().default(new Date())
})

export type FeedbackModelSchemaType = z.infer<typeof FeedbackModel>
