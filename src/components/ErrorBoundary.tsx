import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error in Doodle Chat', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex h-dvh flex-col items-center justify-center gap-2 p-6 text-center text-muted"
        >
          <p>Something went wrong. Please reload the page.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="underline"
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
