export interface Message {
  _id: string
  message: string
  author: string
  createdAt: string
}

export interface PendingMessage {
  clientId: string
  author: string
  message: string
  createdAt: string
  status: 'pending' | 'error'
}

export type CacheEntry = Message | PendingMessage

export interface NewMessagePayload {
  message: string
  author: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
