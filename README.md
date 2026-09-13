# Doodle Chat

A simple chat UI built for the Doodle frontend challenge.

## Tech stack

- React + TypeScript
- Vite

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
