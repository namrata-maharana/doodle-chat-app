import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import { fetchMessages } from '../api/messages'
import type { CacheEntry } from '../api/types'
import { isConfirmedMessage, prependOlderMessages } from '../utils/mergeMessages'

const OLDER_PAGE_SIZE = 50

export function useLoadOlderMessages() {
  const queryClient = useQueryClient()
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMoreOlder, setHasMoreOlder] = useState(true)
  const isLoadingRef = useRef(false)

  async function loadOlder() {
    if (isLoadingRef.current || !hasMoreOlder) return

    const current = queryClient.getQueryData<CacheEntry[]>(['messages']) ?? []
    const oldest = current.filter(isConfirmedMessage).at(0)
    if (!oldest) return

    isLoadingRef.current = true
    setIsLoadingOlder(true)
    try {
      const older = await fetchMessages({ before: oldest.createdAt, limit: OLDER_PAGE_SIZE })
      if (older.length < OLDER_PAGE_SIZE) setHasMoreOlder(false)
      if (older.length > 0) {
        queryClient.setQueryData<CacheEntry[]>(['messages'], (existing = []) =>
          prependOlderMessages(existing, older),
        )
      }
    } finally {
      isLoadingRef.current = false
      setIsLoadingOlder(false)
    }
  }

  return { loadOlder, isLoadingOlder, hasMoreOlder }
}
