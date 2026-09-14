import type { CacheEntry, Message, PendingMessage } from '../api/types'

const PENDING_MATCH_WINDOW_MS = 10_000

export function isConfirmedMessage(entry: CacheEntry): entry is Message {
  return !('clientId' in entry)
}

function matchesPending(message: Message, pending: PendingMessage): boolean {
  if (message.author !== pending.author || message.message !== pending.message) {
    return false
  }

  const diff = Math.abs(
    new Date(message.createdAt).getTime() - new Date(pending.createdAt).getTime(),
  )
  return diff < PENDING_MATCH_WINDOW_MS
}

export function mergeMessages(existing: CacheEntry[], fetched: Message[]): CacheEntry[] {
  const existingIds = new Set(existing.filter(isConfirmedMessage).map((message) => message._id))

  const remainingExisting = existing.filter((entry) => {
    if (isConfirmedMessage(entry)) {
      return true
    }
    return !fetched.some((message) => matchesPending(message, entry))
  })

  const newConfirmed = fetched.filter((message) => !existingIds.has(message._id))

  return [...remainingExisting, ...newConfirmed].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  )
}

export function prependOlderMessages(existing: CacheEntry[], older: Message[]): CacheEntry[] {
  const existingIds = new Set(existing.filter(isConfirmedMessage).map((message) => message._id))
  const newOlder = older.filter((message) => !existingIds.has(message._id))

  return [...newOlder, ...existing].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}
