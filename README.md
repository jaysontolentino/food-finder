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

## Known Limitations

### Open Food Facts rate limits

The application depends on the Open Food Facts API for product search. Open Food Facts applies rate limits to search requests, so the application avoids search-as-you-type behavior and only performs searches when the user submits the search form.

The backend also uses a short-lived in-memory cache to avoid making repeated requests for the same search term. HTTP `429` and `503` responses from Open Food Facts are handled as temporary service/rate-limit errors and returned to the frontend as a user-friendly `503` response.

For a production system with higher traffic, a shared cache such as Redis and a dedicated Open Food Facts/Product Opener deployment could be considered.

### In-memory cache

The current search cache is stored in the API process memory. This means:

- Cached results are lost when the API restarts.
- Multiple API instances would have independent caches.
- The cache is not suitable for a horizontally scaled production deployment.

This was intentionally kept simple for the scope of the technical assessment. A distributed cache could be introduced if the application needs to scale across multiple API instances.

### Demo user

The assessment requires only one demo user, so the application does not implement a complete authentication and authorization system.

The demo user's ID is configured through the `DEMO_USER_ID` environment variable. A production application would require proper authentication and user identity management.

### Stripe webhooks

Subscription state is synchronized through Stripe webhooks rather than relying solely on the Checkout success redirect. In a production deployment, webhook signature verification, idempotency handling, event persistence, and additional monitoring would be important considerations.

### Open Food Facts product data

Open Food Facts is a community-maintained database, so product information can be incomplete or unavailable. Product names, brands, images, and nutritional information may be missing.

The application therefore uses fallback behavior for localized product names and treats optional product fields as nullable.

### Product localization

The application supports English, Dutch, German, and French. UI translations are maintained by the application, while product localization depends on the corresponding language fields available in Open Food Facts.

If a product does not contain a name in the selected language, the application falls back to the English product name and then the default product name.

### API availability

The application depends on an external Open Food Facts service. If the service is unavailable or rate-limited, product searches cannot be completed.

The frontend displays an appropriate error message rather than exposing the external API error directly to the user.

## Technical Decisions

### Open Food Facts Integration

Open Food Facts is accessed exclusively through the Express backend rather than directly from the Next.js frontend.

The integration is isolated in `integrations/open-food-facts/` with separate responsibilities:

- `open-food-facts.client.ts` handles HTTP communication with Open Food Facts.
- `open-food-facts.types.ts` defines the external API response types used by the application.
- `open-food-facts.mapper.ts` converts the external response into the application's internal `Product` model.

This separation prevents the frontend and business logic from becoming tightly coupled to the Open Food Facts response structure.

The application requests only the fields required by the product search feature rather than consuming the entire API response.

The application also uses a short-lived server-side cache to reduce repeated requests for the same search term. Open Food Facts `429` and `503` responses are treated as temporary rate-limit/service availability errors.

The assessment requires full-text product search by title or search term. Because the current Open Food Facts API provides this capability through its legacy search endpoint, the integration is isolated behind `OpenFoodFactsClient` so the underlying endpoint can be replaced without changing the rest of the application.

### Internationalization (i18n)

The application supports four manually selectable languages:

- English (`en`)
- Dutch (`nl`)
- German (`de`)
- French (`fr`)

UI translations are maintained as local JSON files under `apps/web/src/i18n/`. A small translation helper provides the appropriate translation set based on the selected language.

Product localization is handled separately from UI localization. The selected language is sent to the backend, where the product mapper attempts to use the corresponding Open Food Facts product name field.

The product name fallback order is:

1. Selected language
2. English
3. Default product name
4. `Unknown product`

This allows the application to provide localized product information where available while gracefully handling incomplete product data.

A full i18n framework was intentionally not introduced because the assessment requires a small number of manually selectable languages and does not require routing-based localization or automatic locale detection.

### Backend Subscription Enforcement

Nutritional information is considered protected data and is enforced at the backend rather than relying on the frontend to hide it.

The backend obtains the product data from Open Food Facts and internally maps the complete product, including nutrition data. Before returning the product to the client, the API determines whether the demo user has an active subscription.

For an unsubscribed user, the API response contains only basic product information:

- Product name
- Brand
- Image
- Barcode

The `nutrition` field is omitted entirely.

For an active subscriber, nutritional information is included in the response.

This approach ensures that a user cannot bypass the subscription restriction simply by inspecting frontend code, modifying UI state, or making the API request manually.

Stripe webhook events are treated as the source of truth for subscription state. The resulting subscription status is stored in MySQL through Prisma and used by the backend when determining whether nutrition data can be returned.

The frontend therefore controls presentation, while the backend controls authorization.