# Timetable App

A calendar and scheduling app built with Next.js, Prisma, PostgreSQL, and OpenAI-powered event creation.

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (local or hosted)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Create a local `.env` file:

```bash
cp .env.example .env
```

Then update values in `.env`.

## 3. Run database migrations

```bash
npx prisma migrate deploy
```

For local development when creating new schema changes, use:

```bash
npx prisma migrate dev
```

(Optional) Seed sample data:

```bash
npm run seed
```

## 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` - start Next.js in development mode
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run seed` - seed database

## AI event creation

The "Add via AI" flow uses OpenAI Chat Completions and expects these env vars:

- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional, default: `gpt-4.1-mini`)

If you provide recurring prompts (for example: "Mon-Wed-Fri this week"), the app expands and creates multiple events.
