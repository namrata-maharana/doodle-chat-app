import { useState } from 'react'

const STORAGE_KEY = 'doodle-chat:author'

function readStoredAuthorName(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function useAuthorName() {
  const [authorName, setAuthorNameState] = useState(readStoredAuthorName)

  function setAuthorName(name: string) {
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      // localStorage unavailable (e.g. private browsing) - keep the name in memory for this session
    }
    setAuthorNameState(name)
  }

  return { authorName, setAuthorName }
}
