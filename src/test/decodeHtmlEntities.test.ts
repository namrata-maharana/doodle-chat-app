import { describe, expect, it } from 'vitest'

import { decodeHtmlEntities } from '../utils/decodeHtmlEntities'

describe('decodeHtmlEntities', () => {
  it('decodes HTML entities like the API sometimes sends', () => {
    expect(decodeHtmlEntities('Cool! It&#39;s super easy to vote.')).toBe(
      "Cool! It's super easy to vote.",
    )
  })

  it('leaves plain text unchanged', () => {
    expect(decodeHtmlEntities("Can't wait for the lunch!")).toBe("Can't wait for the lunch!")
  })
})
