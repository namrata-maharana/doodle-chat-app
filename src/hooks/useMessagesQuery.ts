import { useQuery } from '@tanstack/react-query'

import { fetchMessages } from '../api/messages'

export function useMessagesQuery() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: ({ signal }) => fetchMessages({ limit: 50 }, signal),
  })
}
