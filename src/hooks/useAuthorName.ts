import { useState } from 'react'

const STORAGE_KEY = 'doodle-chat:author'

export function useAuthorName() {
  const [authorName, setAuthorNameState] = useState(() => localStorage.getItem(STORAGE_KEY))

  function setAuthorName(name: string) {
    localStorage.setItem(STORAGE_KEY, name)
    setAuthorNameState(name)
  }

  return { authorName, setAuthorName }
}
