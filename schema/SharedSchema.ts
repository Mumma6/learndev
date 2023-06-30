import { z } from "zod"

export const SkillSchema = z.object({
  label: z.string()
})

export type SkillSchemaType = z.infer<typeof SkillSchema>
