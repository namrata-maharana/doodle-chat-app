import { describe, expect, it } from 'vitest'

import { validateAuthor } from '../utils/validation'

describe('validateAuthor', () => {
  it('accepts a plain ASCII name', () => {
    expect(validateAuthor('John Doe')).toBeNull()
  })

  it('accepts names with non-English letters', () => {
    expect(validateAuthor('José')).toBeNull()
    expect(validateAuthor('田中')).toBeNull()
  })

  it('rejects an empty name', () => {
    expect(validateAuthor('  ')).not.toBeNull()
  })

  it('rejects symbols that are not letters, numbers, spaces, hyphens or underscores', () => {
    expect(validateAuthor('John@Doe')).not.toBeNull()
  })
})
