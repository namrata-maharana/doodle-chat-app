import type { Message } from '../api/types'
import { formatTimestamp } from '../utils/formatTimestamp'

interface MessageBubbleProps {
  message: Message
  isMine: boolean
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
          isMine ? 'bg-bubble-mine' : 'bg-bubble-other'
        }`}
      >
        <span className="sr-only">{isMine ? 'You said' : `${message.author} said`}</span>
        {!isMine && <p className="text-sm font-medium text-muted">{message.author}</p>}
        <p className="font-semibold">{message.message}</p>
        <p className="mt-1 text-xs text-muted">{formatTimestamp(message.createdAt)}</p>
      </div>
    </div>
  )
}
