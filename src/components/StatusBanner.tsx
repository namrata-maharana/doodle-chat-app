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
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className="p-6 text-center text-muted">
      <p>{messages[variant]}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-2 underline">
          Try again
        </button>
      )}
    </div>
  )
}
