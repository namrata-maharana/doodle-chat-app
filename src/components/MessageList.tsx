import { useQueryClient } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useLayoutEffect, useRef } from 'react'

import type { CacheEntry, PendingMessage } from '../api/types'
import doodleBg from '../assets/doodle-bg.webp'
import { useLoadOlderMessages } from '../hooks/useLoadOlderMessages'
import { useMessagesQuery } from '../hooks/useMessagesQuery'
import { useSendMessage } from '../hooks/useSendMessage'
import { MessageBubble } from './MessageBubble'
import { StatusBanner } from './StatusBanner'

const NEAR_BOTTOM_THRESHOLD_PX = 100
const NEAR_TOP_THRESHOLD_PX = 100
const ESTIMATED_ROW_HEIGHT_PX = 88

interface MessageListProps {
  authorName: string | null
}

function getEntryKey(entry: CacheEntry): string {
  return 'clientId' in entry ? entry.clientId : entry._id
}

export function MessageList({ authorName }: MessageListProps) {
  const { data, isPending, isError, refetch } = useMessagesQuery()
  const messages = data ?? []
  const { loadOlder, isLoadingOlder, hasMoreOlder } = useLoadOlderMessages()
  const queryClient = useQueryClient()
  const sendMessage = useSendMessage()
  const scrollContainerRef = useRef<HTMLElement>(null)
  const isNearBottomRef = useRef(true)
  const olderScrollAdjustRef = useRef<number | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT_PX,
    overscan: 8,
    getItemKey: (index) => getEntryKey(messages[index]),
  })

  function handleScroll() {
    const el = scrollContainerRef.current
    if (!el) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD_PX

    if (el.scrollTop < NEAR_TOP_THRESHOLD_PX && hasMoreOlder && !isLoadingOlder) {
      olderScrollAdjustRef.current = el.scrollHeight
      loadOlder()
    }
  }

  useEffect(() => {
    if (!isNearBottomRef.current || messages.length === 0) return
    const lastIndex = messages.length - 1
    rowVirtualizer.scrollToIndex(lastIndex, { align: 'end' })
    // Row heights are only measured after this paint, so the first scroll can
    // land short for multi-line messages - a follow-up call on the next frame
    // corrects for that once real measurements are in.
    requestAnimationFrame(() => rowVirtualizer.scrollToIndex(lastIndex, { align: 'end' }))
  }, [data, messages.length, rowVirtualizer])

  useLayoutEffect(() => {
    const el = scrollContainerRef.current
    const heightBeforeLoad = olderScrollAdjustRef.current
    if (!el || heightBeforeLoad === null) return
    el.scrollTop += el.scrollHeight - heightBeforeLoad
    olderScrollAdjustRef.current = null
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
        {isLoadingOlder && (
          <p className="pb-2 text-center text-xs text-muted">Loading older messages…</p>
        )}
        {!hasMoreOlder && (
          <p className="pb-2 text-center text-xs text-muted">Beginning of conversation</p>
        )}
        <div
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          style={{ position: 'relative', height: rowVirtualizer.getTotalSize() }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const entry = messages[virtualRow.index]
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="pb-3"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <MessageBubble
                  entry={entry}
                  isMine={entry.author === authorName}
                  onRetry={
                    'clientId' in entry && entry.status === 'error'
                      ? () => handleRetry(entry)
                      : undefined
                  }
                />
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
