type StatusBannerVariant = 'loading' | 'empty' | 'error' | 'reconnecting'

interface StatusBannerProps {
  variant: StatusBannerVariant
  onRetry?: () => void
}

const messages: Record<StatusBannerVariant, string> = {
  loading: 'Loading messages…',
  empty: 'No messages yet. Say hello!',
  error: 'Something went wrong loading messages.',
  reconnecting: 'Having trouble reaching the server. Showing the last messages we have.',
}

export function StatusBanner({ variant, onRetry }: StatusBannerProps) {
  if (variant === 'reconnecting') {
    return (
      <div role="status" className="border-b border-slate-200 bg-slate-50 p-2 text-center text-sm text-muted">
        {messages.reconnecting}
      </div>
    )
  }

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted"
    >
      <p>{messages[variant]}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="underline">
          Try again
        </button>
      )}
    </div>
  )
}
