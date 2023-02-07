import { z } from "zod"

export const SkillSchema = z
  .array(
    z.object({
      label: z.string(),
    })
  )
  .default([])

export type SkillSchemaType = z.infer<typeof SkillSchema>
