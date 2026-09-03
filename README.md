# FoodFinder

A full-stack packaged food product search application built as a technical assessment.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Express
- TypeScript
- Prisma
- MySQL

### Integrations

- Open Food Facts
- Stripe

## Project Structure

```text
apps/
├── web/
└── api/

packages/
└── shared/
```

### Start database
```docker compose up -d```

### Install dependencies
```pnpm install```

### Run migrations
```pnpm --filter api exec prisma migrate deploy```

### Start API
```pnpm dev:api```

### Start frontend
```pnpm dev:web```