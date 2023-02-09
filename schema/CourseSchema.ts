// can not use mongodb on the frontend. Anything that needs parsing on FE cant use objectId
import { z } from "zod"
import { SkillSchema } from "./SharedSchema"
import { ObjectId } from "bson"

/*

Make a seperate type for the datebase stuff?

extends the rest but with _id as objectID

*/

export const InstitutionEnum = z.enum(["Udemy", "Youtube", "Pluralsight", "Linkedin", "Other"])

export type InstitutionEnumType = z.infer<typeof InstitutionEnum>

export const CourseModelContentInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string(), //.url(),
  institution: InstitutionEnum,
})

export type CourseModelContentInputSchemaType = z.infer<typeof CourseModelContentInputSchema>

export const CourseModelformInputSchema = z.object({
  completed: z.boolean(),
  content: CourseModelContentInputSchema,
  topics: z.array(SkillSchema),
})

// We transform the ObjectId to a string so the rest of the application can use it
// Cant use ObjectId dirrectly on the FE, Have to use Object instead if we want to use the Type on the fe side.
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
