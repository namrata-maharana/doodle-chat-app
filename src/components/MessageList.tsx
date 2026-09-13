import doodleBg from '../assets/doodle-bg.webp'
import { useMessagesQuery } from '../hooks/useMessagesQuery'
import { MessageBubble } from './MessageBubble'
import { StatusBanner } from './StatusBanner'

export function MessageList() {
  const { data, isPending, isError, refetch } = useMessagesQuery()

  if (isPending) {
    return <StatusBanner variant="loading" />
  }

  if (isError) {
    return <StatusBanner variant="error" onRetry={() => refetch()} />
  }

  if (data.length === 0) {
    return <StatusBanner variant="empty" />
  }

  return (
    <main
      role="log"
      aria-live="polite"
      aria-label="Conversation"
      className="flex-1 space-y-3 overflow-y-auto bg-repeat px-6 py-4"
      style={{ backgroundImage: `url(${doodleBg})` }}
    >
      {data.map((message) => (
        <MessageBubble key={message._id} message={message} isMine={false} />
      ))}
    </main>
  )
}
