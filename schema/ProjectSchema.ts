import { z } from "zod"
import { SkillSchema } from "./SharedSchema"
import { ObjectId } from "bson"

// Avänd samma fält i /:id som man kan editera. Nya fält läggs i ett eget schema?
export const ProjectModelFormInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1500),
  techStack: z.array(SkillSchema),
  completed: z.boolean().default(false),
  sourceCodeUrl: z.union([z.literal(""), z.string().trim().url()]).default(""),
  deployedUrl: z.union([z.literal(""), z.string().trim().url()]).default(""),
})

export type ProjectModelFromInputType = z.infer<typeof ProjectModelFormInputSchema>

export const ProjectModelSchema = ProjectModelFormInputSchema.extend({
  userId: z.instanceof(ObjectId).transform((id) => id.toString()),
  _id: z.union([z.string(), z.instanceof(ObjectId).transform((id) => id.toString())]),
  tags: z.string(),
  createdAt: z.date(),
})

export type ProjectModelType = z.infer<typeof ProjectModelSchema>
