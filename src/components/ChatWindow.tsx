import { useAuthorName } from '../hooks/useAuthorName'
import { AuthorPrompt } from './AuthorPrompt'
import { Composer } from './Composer'
import { MessageList } from './MessageList'

export function ChatWindow() {
  const { authorName, setAuthorName } = useAuthorName()

  return (
    <div className="flex h-dvh flex-col">
      <MessageList authorName={authorName} />
      {authorName ? (
        <Composer authorName={authorName} />
      ) : (
        <AuthorPrompt onSubmit={setAuthorName} />
      )}
    </div>
  )
}
