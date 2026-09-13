import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import * as messagesApi from '../api/messages'
import { Composer } from '../components/Composer'

function renderComposer() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <Composer authorName="Alice" />
    </QueryClientProvider>,
  )
}

describe('Composer', () => {
  it('shows a validation error instead of sending an empty message', async () => {
    const postMessageSpy = vi.spyOn(messagesApi, 'postMessage')
    renderComposer()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/message is required/i)
    expect(postMessageSpy).not.toHaveBeenCalled()
  })

  it('sends the message and clears the input', async () => {
    const postMessageSpy = vi.spyOn(messagesApi, 'postMessage').mockResolvedValue({
      _id: '1',
      author: 'Alice',
      message: 'Hi there',
      createdAt: new Date().toISOString(),
    })

    renderComposer()
    const user = userEvent.setup()

    const input = screen.getByLabelText(/message/i)
    await user.type(input, 'Hi there')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(postMessageSpy).toHaveBeenCalledWith({ message: 'Hi there', author: 'Alice' })
    expect(input).toHaveValue('')
  })
})
