import { describe, expect, it } from 'vitest'

import type { Message } from '../api/types'
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
})
