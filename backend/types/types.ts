import * as z from "zod"

export const submissionObject = z.object({
  language: z.string(),
  code: z.string(),
  userId: z.string().optional(),
})

export type submissionType = z.infer<typeof submissionObject>