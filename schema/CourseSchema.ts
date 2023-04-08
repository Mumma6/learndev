// can not use mongodb on the frontend. Anything that needs parsing on FE cant use objectId
import { z } from "zod"
import { SkillSchema } from "./SharedSchema"
import { ObjectId } from "bson"

export const InstitutionEnum = z.enum(["Udemy", "Youtube", "Pluralsight", "Linkedin", "Other"])

export type InstitutionEnumType = z.infer<typeof InstitutionEnum>

export const StatusEnum = z.enum(["In progress", "Done", "Wishlist"])

export type StatusEnumType = z.infer<typeof StatusEnum>

export const CourseModelContentInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1500),
  duration: z.number(),
  url: z.union([z.literal(""), z.string().trim().url()]).default(""),
  certificateUrl: z.union([z.literal(""), z.string().trim().url()]).default(""),
  status: StatusEnum,
  institution: InstitutionEnum,
})

export type CourseModelContentInputSchemaType = z.infer<typeof CourseModelContentInputSchema>

export const CourseModelformInputSchema = z.object({
  content: CourseModelContentInputSchema,
  topics: z.array(SkillSchema),
})

// We transform the ObjectId to a string so the rest of the application can use it
// Cant use ObjectId dirrectly on the FE, Have to use Object instead if we want to use the Type on the fe side.

export const CourseModelSchema = CourseModelformInputSchema.extend({
  userId: z.instanceof(ObjectId).transform((id) => id.toString()),
  _id: z.union([z.string(), z.instanceof(ObjectId).transform((id) => id.toString())]),
  tags: z.string(),
  createdAt: z.date(),
  tasks: z.array(z.string()).default([]),
  resources: z.array(z.string()).default([]),
})

export type CourseModelSchemaType = z.infer<typeof CourseModelSchema>

export type CourseModelformInputType = z.infer<typeof CourseModelformInputSchema>
