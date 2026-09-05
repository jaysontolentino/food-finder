# FoodFinder

A small full-stack food product search application built as a technical assessment.

FoodFinder searches packaged food products through the Open Food Facts API, supports four languages, stores recent searches in MySQL, and uses Stripe subscriptions to control access to detailed nutritional information.

## Features

- Search packaged food products by title or search term
- Product data retrieved through a backend Express API
- Open Food Facts integration isolated behind a dedicated client/mapper layer
- English, Dutch, German, and French language selection
- Localized product names when Open Food Facts provides them
- Product details page with barcode, brand, image, and nutrition
- Nutrition data restricted to users with an active subscription
- Stripe Checkout subscription in test mode
- Stripe webhook handling and subscription synchronization
- Demo user model for the assessment
- Recent searches stored in MySQL
- Five-minute in-memory search cache
- Error handling for Open Food Facts rate limiting/unavailability
- Automated backend tests with Vitest
- Responsive UI with Next.js, React, and Tailwind CSS

## Tech Stack

### Frontend

- TypeScript
- Next.js 16
- React 19
- Tailwind CSS 4
- Next.js App Router

### Backend

- TypeScript
- Node.js
- Express 5
- Prisma 7
- MySQL 8

### Integrations

- Open Food Facts API
- Stripe Checkout
- Stripe Webhooks

### Testing

- Vitest

## Architecture

The application is intentionally split into a frontend and backend so that external services, business rules, and subscription enforcement remain server-side.

```text
                         ┌─────────────────────┐
                         │      Next.js UI      │
                         │  React + Tailwind    │
                         └──────────┬──────────┘
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │    Express API      │
                         │ Controllers/Routes  │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
      │   Services    │     │  Repositories │     │ Integrations  │
      │ Business logic│     │    Prisma     │     │ OFF / Stripe  │
      └───────┬───────┘     └───────┬───────┘     └───────┬───────┘
              │                     │                     │
              │                     ▼                     ▼
              │              ┌──────────────┐      ┌──────────────┐
              │              │    MySQL     │      │ External APIs│
              │              └──────────────┘      └──────────────┘
              │
              └──── subscription access decision
```

### Backend structure

```text
apps/api/src/
├── config/
│   └── env.ts
├── controllers/
│   ├── product.controller.ts
│   ├── search.controller.ts
│   └── subscription.controller.ts
├── integrations/
│   ├── open-food-facts/
│   │   ├── open-food-facts.client.ts
│   │   ├── open-food-facts.mapper.ts
│   │   ├── open-food-facts.types.ts
│   │   └── open-food-facts.errors.ts
│   └── stripe/
│       ├── stripe.client.ts
│       └── stripe-status.mapper.ts
├── lib/
│   ├── prisma.ts
│   └── search-cache.ts
├── middleware/
│   └── demo-user.middleware.ts
├── repositories/
│   ├── search.repository.ts
│   ├── subscription.repository.ts
│   └── user.repository.ts
├── routes/
│   ├── product.routes.ts
│   ├── search.routes.ts
│   ├── subscription.routes.ts
│   └── stripe-webhook.routes.ts
├── services/
│   ├── product.service.ts
│   ├── search.service.ts
│   └── subscription.service.ts
├── container.ts
├── app.ts
├── server.ts
└── seed.ts
```

## Prerequisites

Install the following before running the project:

- Node.js 20+
- pnpm 10+
- Docker / Docker Compose
- Stripe CLI for local webhook testing

Check your versions:

```bash
node --version
pnpm --version
docker --version
stripe --version
```

## Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Then fill in the required values.

## Environment Variables

The repository contains a root `.env.example`.

Example:

```env
NODE_ENV=development

API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000

DATABASE_URL=mysql://food_finder:food_finder@localhost:3306/food_finder

DEMO_USER_ID=

OPEN_FOOD_FACTS_BASE_URL=https://world.openfoodfacts.org
OPEN_FOOD_FACTS_USER_AGENT=
OPEN_FOOD_FACTS_USERNAME=
OPEN_FOOD_FACTS_PASSWORD=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
```

### Open Food Facts

Set a descriptive User-Agent, for example:

```text
FoodFinder/1.0 (your-email@example.com)
```

The assessment integration uses the Open Food Facts search endpoint because the required feature is full-text product search.

### Stripe

You will need:

- Stripe secret key
- Stripe test-mode Price ID
- Stripe webhook signing secret

Never commit real credentials to Git.

## Database Setup

Start MySQL:

```bash
docker compose up -d
```

Apply Prisma migrations:

```bash
pnpm --filter api exec prisma migrate deploy
```

Generate the Prisma client if necessary:

```bash
pnpm --filter api exec prisma generate
```

Seed the demo user:

```bash
pnpm --filter api exec tsx src/seed.ts
```

The seed script creates or updates:

```text
demo@example.com
```

It also prints the user's ID. Put that value into:

```env
DEMO_USER_ID=...
```

### Reset the database

A reset script is provided at:

```text
scripts/reset-db.sh
```

Run:

```bash
bash scripts/reset-db.sh
```

The script:

1. Resets the configured database.
2. Deletes existing data.
3. Reapplies all Prisma migrations.
4. Seeds the demo user.

> **Warning:** database reset is destructive. Do not run it against a database containing data you need to keep.

For convenience, the root `package.json` can expose it as:

```json
{
  "scripts": {
    "db:reset": "bash ./scripts/reset-db.sh"
  }
}
```

Then:

```bash
pnpm db:reset
```

## Running the Application

Start the API:

```bash
pnpm dev:api
```

The API runs on:

```text
http://localhost:4000
```

Start the frontend in another terminal:

```bash
pnpm dev:web
```

The frontend runs on:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:4000/health
```

You can also open Prisma Studio:

```bash
pnpm dev:studio
```

## Stripe Test Setup

Create a recurring monthly product/price in Stripe Test Mode.

Put the resulting Price ID in:

```env
STRIPE_PRICE_ID=price_...
```

Put your Stripe test secret key in:

```env
STRIPE_SECRET_KEY=sk_test_...
```

### Local webhook forwarding

Start the API first, then run:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Stripe CLI will print a webhook signing secret similar to:

```text
whsec_...
```

Set it in:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the API after changing environment variables.

### Subscription flow

The subscription flow is:

```text
Next.js
   │
   │ POST /api/subscription/checkout
   ▼
Express API
   │
   │ Create Checkout Session
   ▼
Stripe Checkout
   │
   │ Successful subscription
   ▼
Stripe Webhook
   │
   │ Verify signature
   ▼
Express API
   │
   │ Synchronize subscription
   ▼
MySQL
   │
   │ ACTIVE
   ▼
Nutrition access enabled
```

The backend is the authority for subscription access.

The frontend does not decide whether nutrition is available.

## Nutrition Access

Every user can see basic product information:

- Product name
- Brand
- Image
- Barcode

Detailed nutritional information is only included by the backend when the demo user's subscription has status `ACTIVE`.

The backend intentionally omits the `nutrition` field for non-subscribers.

This prevents the frontend from simply hiding already-exposed data.

```text
Free user
    ↓
GET product
    ↓
Basic product information only

Active subscriber
    ↓
GET product
    ↓
Basic product information
+
Nutrition
```

Subscription status is synchronized from Stripe webhooks and stored in MySQL.

## Internationalization

The application supports:

- English (`en`)
- Dutch (`nl`)
- German (`de`)
- French (`fr`)

Translations are stored as JSON files:

```text
apps/web/src/i18n/
├── en.json
├── nl.json
├── de.json
├── fr.json
└── index.ts
```

The language selector is manual as required by the assessment.

Product names use the selected language when Open Food Facts provides a localized value.

The fallback order is:

```text
Selected language
        ↓
English product name
        ↓
Generic product name
        ↓
"Unknown product"
```

This approach keeps the implementation small and explicit without introducing a larger internationalization framework for the limited scope of the assessment.

## Product Data

Open Food Facts provides community-maintained product data, so products may have incomplete fields.

The application handles missing values gracefully:

- Missing brand → localized "Unknown brand"
- Missing image → image placeholder
- Missing localized name → fallback to English/general name
- Missing nutrition → nutrition unavailable/locked state

Only the fields required by the application are requested from Open Food Facts.

## API Endpoints

### Health

```text
GET /health
```

Checks API availability and database connectivity.

### Product search

```text
GET /api/products/search?q={query}&lang={language}
```

Supported languages:

```text
en
nl
de
fr
```

Returns products with basic information.

Nutrition is included only for users with an active subscription.

### Product details

```text
GET /api/products/{barcode}?lang={language}
```

Returns one product by barcode.

### Recent searches

```text
GET /api/searches/recent
```

Returns the demo user's recent searches.

### Subscription status

```text
GET /api/subscription
```

Returns:

```json
{
  "active": true
}
```

### Create Stripe Checkout session

```text
POST /api/subscription/checkout
```

Returns the Stripe Checkout URL.

### Stripe webhook

```text
POST /api/webhooks/stripe
```

The webhook verifies the Stripe signature and synchronizes subscription state.

## Testing

Run the complete test suite:

```bash
pnpm test
```

The test suite covers:

- Product mapping
- Product response/nutrition access
- Product service behavior
- Search cache behavior
- Open Food Facts client
- Open Food Facts rate-limit/error handling
- Product controller validation and subscription enforcement
- Subscription access rules
- Stripe subscription status mapping

The latest implementation contains 48 automated tests.

Build the entire workspace:

```bash
pnpm build
```

The frontend and backend should both compile successfully.

## Testing Stripe Webhooks

After starting the API and Stripe listener:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Stripe CLI can also generate test events:

```bash
stripe trigger customer.subscription.created
```

For the most realistic test, complete the application's Stripe Checkout flow using Stripe Test Mode.

After Stripe sends the webhook, verify the subscription in Prisma Studio:

```bash
pnpm dev:studio
```

The corresponding `Subscription` record should contain:

- Stripe subscription ID
- Stripe customer ID
- Subscription status
- Current period end
- Demo user ID

## Database Schema

The application contains three main models:

```text
User
 │
 ├── Search[]
 │
 └── Subscription?
```

### User

Stores the demo user and Stripe customer relationship.

### Search

Stores:

- Search query
- Selected language
- User
- Creation timestamp

### Subscription

Stores:

- Stripe subscription ID
- Stripe customer ID
- Subscription status
- Current billing period end
- User

The subscription has a one-to-one relationship with the user.

## Technical Decisions

### Why a separate Express API?

The assessment explicitly requires Express, and keeping the backend separate from Next.js makes the responsibilities clear:

- Next.js → presentation/UI
- Express → API/business logic
- Prisma → persistence
- Integration clients → external services

It also keeps Stripe secrets and Open Food Facts integration server-side.

### Why isolate Open Food Facts?

The Open Food Facts client is separated from application services:

```text
ProductService
      ↓
OpenFoodFactsClient
      ↓
Open Food Facts API
```

This makes the external API easier to mock and test and prevents Open Food Facts response shapes from leaking throughout the application.

### Why use a mapper?

Open Food Facts has a large and evolving response shape.

The mapper converts that external representation into the application's smaller `Product` model.

This gives the rest of the application a stable internal representation.

### Why use the legacy Open Food Facts search endpoint?

The assessment requires searching products by title/search term.

Open Food Facts' newer API endpoints do not provide the same full-text search behavior required for this feature, so the legacy search endpoint is used for this assessment.

For a production system with significantly higher traffic, I would evaluate a local Product Opener/Open Food Facts deployment or another search-oriented data layer.

### Why enforce subscription access on the backend?

Subscription status is an authorization decision.

The frontend cannot be trusted to decide whether nutrition should be available.

The backend therefore:

1. Reads the user's subscription from MySQL.
2. Checks whether it is `ACTIVE`.
3. Includes nutrition only when access is allowed.

### Why JSON-based i18n?

The assessment has only four languages and a relatively small UI.

Simple JSON dictionaries make the implementation:

- easy to understand
- easy to review
- easy to extend
- free from unnecessary framework complexity

### Why an in-memory cache?

Open Food Facts has request rate limits.

A short five-minute in-memory cache reduces repeated requests for identical searches during local/demo usage.

The cache is intentionally simple because this application is a small assessment rather than a distributed production service.

## Security Considerations

- Stripe secret keys remain on the backend.
- Stripe webhook signatures are verified before processing events.
- The Stripe webhook route receives the raw request body required for signature verification.
- Nutrition access is enforced server-side.
- Environment variables are used for secrets and configuration.
- No Stripe secret or webhook secret should be committed to Git.
- Open Food Facts requests use a descriptive User-Agent.
- User input is passed through URL/query parameter handling rather than string-building raw SQL.
- Prisma handles database queries and parameterization.

## Known Limitations

### Demo authentication

The assessment requires one demo user, so authentication is intentionally simplified.

The backend currently resolves the demo user rather than implementing a complete authentication system.

For production, I would replace this with real authentication and derive the user identity from a verified session/token.

### Open Food Facts rate limits

The Open Food Facts API has rate limits.

The application:

- avoids search-as-you-type requests
- searches only on form submission
- requests only required fields
- uses a five-minute in-memory cache
- maps upstream rate-limit/unavailability responses to HTTP 503

A production deployment with multiple API instances would use a shared cache such as Redis.

### In-memory cache

The search cache exists only inside one API process.

It is lost when the process restarts and is not shared between multiple instances.

### Product data quality

Open Food Facts is community-maintained, so some products may have incomplete or missing:

- names
- brands
- images
- localized names
- nutritional values

The UI handles these cases gracefully.

### Localization coverage

The application can only display a localized product name when Open Food Facts has that language-specific field.

The interface translations themselves are provided locally by the application.

### Stripe webhook persistence

Subscription state is synchronized from Stripe webhook events.

A production implementation should additionally persist processed Stripe event IDs to make webhook processing explicitly idempotent and prevent duplicate event processing.

### Checkout URLs

The assessment implementation uses local success/cancel URLs during development.

For deployment, these should be moved into environment configuration.

### Search persistence

Recent searches are stored in MySQL for the demo user.

A production implementation would associate searches with authenticated users.

## Project Scripts

Root scripts:

```bash
pnpm dev:web       # Start Next.js
pnpm dev:api       # Start Express
pnpm dev:studio   # Open Prisma Studio
pnpm build         # Build all workspaces
pnpm test          # Run all tests
pnpm lint          # Run workspace lint scripts
pnpm db:reset      # Reset database and reseed demo user
```

If `pnpm db:reset` is not yet present in `package.json`, add:

```json
{
  "scripts": {
    "db:reset": "bash ./scripts/reset-db.sh"
  }
}
```

The API seed can also be run directly:

```bash
pnpm --filter api exec tsx src/seed.ts
```

## Submission Checklist

Before submitting the repository, verify:

- [ ] `pnpm install` works
- [ ] MySQL starts with Docker Compose
- [ ] Prisma migrations apply successfully
- [ ] Demo user can be seeded
- [ ] `DEMO_USER_ID` is configured
- [ ] Open Food Facts search works
- [ ] All four languages work
- [ ] Product details work
- [ ] Free users cannot receive nutrition data
- [ ] Stripe Checkout works in test mode
- [ ] Stripe webhook is received and verified
- [ ] Subscription row is created/updated in MySQL
- [ ] Active subscribers receive nutrition data
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] `.env` and secrets are not committed
- [ ] `.env.example` contains all required configuration names

## License

This project was created as a technical assessment/demo application.
