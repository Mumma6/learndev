import { ObjectId } from "mongodb"
import { z } from "zod"
import { SkillSchema } from "./SharedSchema"

export const CourseModelformInputSchema = z.object({
  completed: z.boolean(),
  content: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.string(), //.url(),
    institution: z.string().min(1), // Make enum
  }),
  topics: SkillSchema,
})

// We transform the ObjectId to a string so the rest of the application can use it
export const CourseModelSchema = CourseModelformInputSchema.extend({
  userId: z.instanceof(ObjectId).transform((id) => id.toString()),
  _id: z.instanceof(ObjectId).transform((id) => id.toString()),
  tags: z.array(z.string()),
  createdAt: z.date(),
})

export type CourseModelSchemaType = z.infer<typeof CourseModelSchema>

export type CourseModelformInputType = z.infer<typeof CourseModelformInputSchema>

/*
Field ideas

export interface IResources {
  title: string
  link: string // url, github repo osv osv.
}

learningResources?: IResources[], Eller från en egen collection.
  duration?: string // Hur lång den är. t ex 3h eller 20h
  feedback?: string

*/
