import { z } from 'zod'

const authorSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(50, 'Name must be 50 characters or fewer')
  .regex(/^[\w\s-]+$/, 'Name can only contain letters, numbers, spaces, hyphens and underscores')

const messageSchema = z
  .string()
  .trim()
  .min(1, 'Message is required')
  .max(500, 'Message must be 500 characters or fewer')

export function validateAuthor(value: string): string | null {
  const result = authorSchema.safeParse(value)
  return result.success ? null : result.error.issues[0].message
}

export function validateMessageText(value: string): string | null {
  const result = messageSchema.safeParse(value)
  return result.success ? null : result.error.issues[0].message
}
