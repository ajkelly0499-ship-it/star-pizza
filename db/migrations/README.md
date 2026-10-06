# Database migrations

Migrations are versioned SQL and must be applied in numeric order.

## Phase 1

- `0001_catalogue.sql` creates the restaurant/menu catalogue foundation.
- It is safe to run once against a fresh Neon database.
- Do not use schema push commands against production.
- Keep every future production schema change as a new migration file.

The live database has not been modified merely by committing these files.
