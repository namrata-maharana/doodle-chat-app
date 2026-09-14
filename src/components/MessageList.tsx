import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import type { CacheEntry, PendingMessage } from '../api/types'
import doodleBg from '../assets/doodle-bg.webp'
import { useMessagesQuery } from '../hooks/useMessagesQuery'
import { useSendMessage } from '../hooks/useSendMessage'
import { MessageBubble } from './MessageBubble'
import { StatusBanner } from './StatusBanner'

const NEAR_BOTTOM_THRESHOLD_PX = 100

interface MessageListProps {
  authorName: string | null
}

export function MessageList({ authorName }: MessageListProps) {
  const { data, isPending, isError, refetch } = useMessagesQuery()
  const queryClient = useQueryClient()
  const sendMessage = useSendMessage()
  const scrollContainerRef = useRef<HTMLElement>(null)
  const isNearBottomRef = useRef(true)

  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD_PX
  }

  useEffect(() => {
    if (!isNearBottomRef.current) return
    const el = scrollContainerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [data])

  if (isPending) {
    return <StatusBanner variant="loading" />
  }

  if (!data || data.length === 0) {
    if (isError) {
      return <StatusBanner variant="error" onRetry={() => refetch()} />
    }
    return <StatusBanner variant="empty" />
  }

  function handleRetry(entry: PendingMessage) {
    queryClient.setQueryData<CacheEntry[]>(['messages'], (current = []) =>
      current.filter((item) => !('clientId' in item && item.clientId === entry.clientId)),
    )
    sendMessage.mutate({ message: entry.message, author: entry.author })
  }

  return (
    <>
      {isError && <StatusBanner variant="reconnecting" />}
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-repeat px-6 py-4"
        style={{ backgroundImage: `url(${doodleBg})` }}
      >
        <div role="log" aria-live="polite" aria-label="Conversation" className="space-y-3">
          {data.map((entry) => (
            <MessageBubble
              key={'clientId' in entry ? entry.clientId : entry._id}
              entry={entry}
              isMine={entry.author === authorName}
              onRetry={
                'clientId' in entry && entry.status === 'error'
                  ? () => handleRetry(entry)
                  : undefined
              }
            />
          ))}
        </div>
      </main>
    </>
  )
}
