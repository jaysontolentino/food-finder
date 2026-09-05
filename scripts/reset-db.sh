#!/usr/bin/env bash

set -euo pipefail

echo "Resetting FoodFinder database..."
echo "This will DELETE all data in the configured database."

pnpm --filter api exec prisma migrate reset --force --skip-seed
pnpm --filter api exec tsx src/seed.ts

echo
echo "Database reset complete."
echo "Prisma migrations have been reapplied and the demo user has been seeded."