# Star Pizza

Modern online ordering platform for Star Pizza Birstall.

## Backend foundation

Phase 1 introduces the Neon/PostgreSQL catalogue foundation while leaving the existing customer-facing menu unchanged.

### Required environment variable

Copy `.env.example` to `.env.local` and set:

```
DATABASE_URL=your_neon_postgres_connection_string
```

Never expose `DATABASE_URL` to client-side code and never prefix it with `NEXT_PUBLIC_`.

### Phase 1 database workflow

1. Apply `db/migrations/0001_catalogue.sql` to the intended Neon development database.
2. Run `npm run db:seed:menu`.
3. Open `/api/menu` and verify the database-backed catalogue response.
4. Keep the current frontend on the static menu until Phase 2 server-side basket validation is ready.

The seed is idempotent for restaurant/category/product records. Upsell UI duplicates are intentionally not imported as separate products.
