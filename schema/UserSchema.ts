import { z } from "zod"
import { SkillSchema } from "./SharedSchema"
import { ObjectId } from "bson"

export const UserRegistrationSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(1).max(100),
})

export type UserRegistrationSchemaType = z.infer<typeof UserRegistrationSchema>

export const UserSocialsSchema = z.object({
  linkedin: z.string().default(""),
  twitter: z.string().default(""),
  youtube: z.string().default(""),
  github: z.string().default(""),
  personalWebsite: z.string().default(""),
  blog: z.string().default(""),
})

export type UserSocialsSchemaType = z.infer<typeof UserSocialsSchema>

export const UserWorkexperienceSchema = z.object({
  role: z.string(),
  startDate: z.string(), // borde detta vara Date?
  endDate: z.string().optional(),
  description: z.string().min(1),
  company: z.string().min(1),
  currentJob: z.boolean().default(false),
})

export type UserWorkexperienceSchemaType = z.infer<typeof UserWorkexperienceSchema>

// Any field added to the schema will get added in the database aswell. This is a one way only. If we add the ability to remove fields via the schema aswell we open up for alot of bugs. IF we want to there is a code snippet in quieris/users we can use. BE AWERE THO!

export const UserModelSchema = UserRegistrationSchema.extend({
  _id: z.instanceof(ObjectId).transform((id) => id.toString()),
  completedQuizzes: z.array(z.string()).default([]),
  about: z.string().default(""),
  goals: z.string().default(""),
  from: z.string().default(""),
  lookingForWork: z.boolean().default(false),
  emailVerified: z.boolean().default(false), // Move this to userSettings
  socials: UserSocialsSchema.default({}),
  skills: z.array(SkillSchema).default([]),
  workexperience: z.array(UserWorkexperienceSchema).default([]),
})

export type UserModelSchemaType = z.infer<typeof UserModelSchema>
