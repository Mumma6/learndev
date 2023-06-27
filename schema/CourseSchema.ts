import { z } from "zod"
import { SkillSchema } from "./SharedSchema"
import { ObjectId } from "bson"

// Lägg till flera här, t ex Coursera, freecodecamp, codeCademy osv osv
export const InstitutionEnum = z.enum([
  "Udemy",
  "Youtube",
  "Pluralsight",
  "Linkedin",
  "Other",
  "Coursera",
  "FreeCodeCamp",
  "Codecademy",
  "Khan Academy",
  "EdX",
  "Udacity",
  "Skillshare",
  "Lynda",
  "Treehouse",
  "FutureLearn",
  "University",
  "College"
])

export type InstitutionEnumType = z.infer<typeof InstitutionEnum>

export const StatusEnum = z.enum(["In progress", "Done", "Wishlist"])

export type StatusEnumType = z.infer<typeof StatusEnum>

export const CourseModelContentInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1500),
  duration: z.number(),
  url: z.union([z.literal(""), z.string().trim().url()]).default(""),
  certificateUrl: z.union([z.literal(""), z.string().trim().url()]).default(""),
  resources: z.array(z.string()).default([]),
  status: StatusEnum,
  institution: InstitutionEnum
})

export type CourseModelContentInputSchemaType = z.infer<typeof CourseModelContentInputSchema>

export const CourseModelformInputSchema = z.object({
  content: CourseModelContentInputSchema,
  topics: z.array(SkillSchema)
})

// We transform the ObjectId to a string so the rest of the application can use it
// Cant use ObjectId directly on the FE, Have to use Object instead if we want to use the Type on the fe side.

export const CourseModelSchema = CourseModelformInputSchema.extend({
  userId: z.instanceof(ObjectId).transform((id) => id.toString()),
  _id: z.union([z.string(), z.instanceof(ObjectId).transform((id) => id.toString())]),
  tags: z.string(),
  createdAt: z.date()
})

export type CourseModelSchemaType = z.infer<typeof CourseModelSchema>

export type CourseModelformInputType = z.infer<typeof CourseModelformInputSchema>

/*
Ieads to add
completionDate: The date when the course was completed. This could be useful for tracking progress and pacing.

instructor: The name of the course instructor or instructors. This could be helpful for users who prefer courses taught by certain instructors.

difficultyLevel: The difficulty level of the course (e.g., beginner, intermediate, advanced). This could be beneficial for users trying to find courses at a suitable level.

rating: The user's personal rating of the course. This could be useful for personal reviews or for recommending courses to others.

courseProvider: If a course is offered through a university or another institution on a platform (like Coursera or edX), it could be useful to capture that information.

cost: If there's a cost associated with the course, users might want to track this.

language: The language in which the course is delivered might be useful, especially for users who are non-native English speakers or prefer courses in a certain language.

*/
