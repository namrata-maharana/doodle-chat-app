import { describe, expect, it } from 'vitest'

import { formatTimestamp } from '../utils/formatTimestamp'

describe('formatTimestamp', () => {
  it('formats an ISO date as "D Mon YYYY HH:mm"', () => {
    expect(formatTimestamp('2018-03-10T10:19:00.000Z')).toBe('10 Mar 2018 10:19')
  })

  it('pads single-digit hours and minutes', () => {
    expect(formatTimestamp('2018-03-10T04:05:00.000Z')).toBe('10 Mar 2018 04:05')
  })
})
