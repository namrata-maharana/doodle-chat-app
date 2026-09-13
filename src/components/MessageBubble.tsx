import type { CacheEntry } from '../api/types'
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities'
import { formatTimestamp } from '../utils/formatTimestamp'

interface MessageBubbleProps {
  entry: CacheEntry
  isMine: boolean
  onRetry?: () => void
}

export function MessageBubble({ entry, isMine, onRetry }: MessageBubbleProps) {
  const status = 'clientId' in entry ? entry.status : undefined

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-xl p-4 shadow-sm ${
          isMine ? 'bg-bubble-mine' : 'bg-bubble-other'
        } ${status === 'error' ? 'opacity-60' : ''}`}
      >
        <span className="sr-only">
          {isMine ? 'You said' : `${entry.author} said`}
          {status === 'pending' && ', sending'}
          {status === 'error' && ', failed to send'}
        </span>
        {!isMine && <p className="text-sm font-medium text-muted">{entry.author}</p>}
        <p className="font-semibold">{decodeHtmlEntities(entry.message)}</p>
        <p className={`mt-1 text-xs text-muted ${isMine ? 'text-right' : ''}`}>
          {formatTimestamp(entry.createdAt)}
        </p>
        {status === 'error' && onRetry && (
          <button type="button" onClick={onRetry} className="mt-1 text-xs text-muted underline">
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
