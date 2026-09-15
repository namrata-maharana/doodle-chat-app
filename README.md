# Doodle Chat

A chat UI for the Doodle frontend challenge - sends and displays messages against the provided chat API.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- TanStack Query (fetching, polling, optimistic updates)
- Zod (validation)
- Vitest + Testing Library

## Running it

Make sure the chat API backend is running first (see that repo's README).

### Option 1: Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

Served by `serve` at `http://localhost:8080`.

Heads up: `VITE_API_BASE_URL` and `VITE_API_TOKEN` get baked into the JS bundle at build time, not read at container startup - that's why they're passed as build args in `docker-compose.yml` instead of `environment:`. Change either one and you'll need to rebuild.

### Option 2: Local Development (Without Docker)

```bash
cp .env.example .env
```

Install deps and start the dev server:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm test` - run the test suite

## How it works

- `src/api` - just a thin fetch wrapper around the two endpoints the backend gives us.
- `src/hooks/useMessagesQuery.ts` - grabs the messages and polls every 4s for new ones.
- `src/hooks/useSendMessage.ts` - handles sending optimistically. The message shows up right away, then either gets swapped for the real one once the server responds, or flagged as failed with a retry button if it didn't go through.
- `src/hooks/useLoadOlderMessages.ts` - loads more history when you scroll up near the top.
- `src/components/MessageList.tsx` - uses `@tanstack/react-virtual` to only render what's actually visible, so the list stays fast no matter how long the chat gets.
- `src/utils/mergeMessages.ts` - the messy part - stitches together polling, pagination, and optimistic sends without duplicating or reshuffling anything.
- No real login, just a name prompt the first time you send a message. It gets saved to `localStorage` so the app knows which messages are "yours".

## Known limitations

- Since there's no real auth, if two people use the same display name they'll each think the other's messages are their own. Good enough for a throwaway chatroom, not for anything that actually matters.
- Uses polling instead of a websocket, mostly because the API doesn't give us one to work with.
