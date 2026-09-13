import { useState } from 'react'

import { validateAuthor } from '../utils/validation'

interface AuthorPromptProps {
  onSubmit: (name: string) => void
}

export function AuthorPrompt({ onSubmit }: AuthorPromptProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const validationError = validateAuthor(name)
    if (validationError) {
      setError(validationError)
      return
    }

    onSubmit(name.trim())
  }

  return (
    <div className="bg-composer p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label htmlFor="author-name" className="sr-only">
          Your name
        </label>
        <input
          id="author-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Message"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'author-name-error' : undefined}
          className="flex-1 rounded-lg border-2 border-composer-border bg-white px-4 py-2 text-slate-900"
          autoFocus
        />
        <button type="submit" className="rounded-lg bg-send px-6 py-2 font-semibold text-white">
          Send
        </button>
      </form>
      {error && (
        <p id="author-name-error" role="alert" className="mt-2 text-sm text-white">
          {error}
        </p>
      )}
    </div>
  )
}
