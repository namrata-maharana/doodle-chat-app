import { useRef, useState } from 'react'

import { useSendMessage } from '../hooks/useSendMessage'
import { validateMessageText } from '../utils/validation'

interface ComposerProps {
  authorName: string
}

export function Composer({ authorName }: ComposerProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sendMessage = useSendMessage()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const validationError = validateMessageText(text)
    if (validationError) {
      setError(validationError)
      inputRef.current?.focus()
      return
    }

    sendMessage.mutate({ message: text.trim(), author: authorName })
    setText('')
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <footer className="bg-composer p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label htmlFor="message-input" className="sr-only">
          Message
        </label>
        <input
          id="message-input"
          ref={inputRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Message"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'message-input-error' : undefined}
          className="flex-1 rounded-lg border-2 border-composer-border bg-white px-4 py-2 text-slate-900"
        />
        <button type="submit" className="rounded-lg bg-send px-6 py-2 font-semibold text-white">
          Send
        </button>
      </form>
      {error && (
        <p id="message-input-error" role="alert" className="mt-2 text-sm text-white">
          {error}
        </p>
      )}
    </footer>
  )
}
