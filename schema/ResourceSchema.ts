import { z } from "zod"
import { ObjectId } from "bson"

export const ResourceTypeEnum = z.enum([
  "Book",
  "Tutorial",
  "Blog",
  "Documentation",
  "Podcast",
  "Article",
  "Code repository",
  "Forum",
  "Cheat sheet",
  "Video clip",
  "Website",
  "Other"
])

export type ResourceEnum = z.infer<typeof ResourceTypeEnum>

export const ResourceModelInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1500),
  link: z.union([z.literal(""), z.string().trim().url()]).default(""),
  type: ResourceTypeEnum
})

export type ResourceModelInputSchemaType = z.infer<typeof ResourceModelInputSchema>

export const ResourceModelSchema = ResourceModelInputSchema.extend({
  userId: z.instanceof(ObjectId).transform((id) => id.toString()),
  _id: z.union([z.string(), z.instanceof(ObjectId).transform((id) => id.toString())]),
  createdAt: z.date()
})

export type ResourceModelSchemaType = z.infer<typeof ResourceModelSchema>

/*

Ska funkera tvärtemot Tasks.

I tasks så länkar man en task till en aktivitet

I resurserna ska man bara skapa upp dom. Sen i kurser eller projekt
så kan man länka till en specifik resurs

*/
