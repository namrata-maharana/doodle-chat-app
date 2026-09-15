import { useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchMessages } from '../api/messages'
import type { CacheEntry } from '../api/types'
import { isConfirmedMessage, mergeMessages } from '../utils/mergeMessages'

export function useMessagesQuery() {
  const queryClient = useQueryClient()

  return useQuery<CacheEntry[]>({
    queryKey: ['messages'],
    queryFn: async ({ signal }) => {
      const existing = queryClient.getQueryData<CacheEntry[]>(['messages']) ?? []
      const after = existing.filter(isConfirmedMessage).at(-1)?.createdAt
      const fetched = after
        ? await fetchMessages({ after, limit: 50 }, signal)
        : await fetchMessages({ before: new Date().toISOString(), limit: 50 }, signal)
      return mergeMessages(existing, fetched)
    },
    refetchInterval: 4000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
