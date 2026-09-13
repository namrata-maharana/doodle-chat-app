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

Make sure the chat API backend is running locally (`docker compose up` in that repo), then create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TOKEN=super-secret-doodle-token
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

- `src/api` - a small typed fetch wrapper for the two backend endpoints.
- `src/hooks/useMessagesQuery.ts` - fetches messages and polls for new ones every 4 seconds.
- `src/hooks/useSendMessage.ts` - sends a message optimistically: it appears instantly, gets replaced once the server confirms it, or gets marked as failed with a retry option if the request errors.
- `src/utils/mergeMessages.ts` - keeps the list correct when a poll and an optimistic send land around the same time, so a message you just sent doesn't briefly show up twice.
- There's no login. The first time you send a message you're asked for a display name, saved in `localStorage`, used to tell your own messages apart from everyone else's.

## Known limitations

- No real auth, so two people picking the same display name will see each other's messages as their own. Fine for a nameless chatroom, not fine for anything real.
- No pagination yet - loads the latest 50 messages and polls for new ones; older history isn't fetchable from the UI.
- Polls every 4 seconds instead of using a websocket, since the API doesn't offer one.
