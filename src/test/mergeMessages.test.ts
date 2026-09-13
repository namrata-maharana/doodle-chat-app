import { describe, expect, it } from 'vitest'

import type { Message, PendingMessage } from '../api/types'
import { isConfirmedMessage, mergeMessages } from '../utils/mergeMessages'

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    _id: '1',
    author: 'Alice',
    message: 'Hello',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

function makePending(overrides: Partial<PendingMessage> = {}): PendingMessage {
  return {
    clientId: 'client-1',
    author: 'Alice',
    message: 'Hello',
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'pending',
    ...overrides,
  }
}

describe('mergeMessages', () => {
  it('does not duplicate a message that is already cached', () => {
    const existing = [makeMessage()]
    const fetched = [makeMessage()]

    expect(mergeMessages(existing, fetched)).toHaveLength(1)
  })

  it('adds new confirmed messages in createdAt order', () => {
    const existing = [makeMessage({ _id: '1', createdAt: '2024-01-01T00:00:00.000Z' })]
    const fetched = [makeMessage({ _id: '2', createdAt: '2024-01-01T00:01:00.000Z' })]

    const result = mergeMessages(existing, fetched)

    expect(result.map((entry) => (isConfirmedMessage(entry) ? entry._id : entry.clientId))).toEqual([
      '1',
      '2',
    ])
  })

  it('resolves a pending send with the confirmed message from a poll instead of duplicating it', () => {
    const pending = makePending({ createdAt: '2024-01-01T00:00:00.000Z' })
    const existing = [pending]
    const fetched = [
      makeMessage({
        _id: 'server-id',
        createdAt: '2024-01-01T00:00:02.000Z',
      }),
    ]

    const result = mergeMessages(existing, fetched)

    expect(result).toHaveLength(1)
    expect(isConfirmedMessage(result[0]) && result[0]._id).toBe('server-id')
  })

  it('keeps a pending send that has not been confirmed by an unrelated poll result', () => {
    const pending = makePending()
    const existing = [pending]
    const fetched = [makeMessage({ _id: 'unrelated', author: 'Bob', message: 'Different message' })]

    const result = mergeMessages(existing, fetched)

    expect(result).toHaveLength(2)
  })
})
