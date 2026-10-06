# Star Pizza

Modern online ordering platform for Star Pizza Birstall.

## Customer ordering frontend

Milestone 4 locks the approved customer-facing ordering experience on `milestone-4-customer-ordering-frontend-locked`.

## Backend foundation

The reconciled backend preserves Milestone 4 and carries forward the existing Neon/PostgreSQL work:

- database-backed catalogue foundation
- server-side basket validation and authoritative pricing
- order persistence with idempotency protection
- order/item/modifier snapshots
- order status event history
- customer order confirmation route
- collection + pay-on-collection order creation

Online card payments and delivery-zone validation are deliberately not enabled yet.

### Required environment variable

```
DATABASE_URL=your_neon_postgres_connection_string
```

Never expose `DATABASE_URL` to client-side code and never prefix it with `NEXT_PUBLIC_`.

### Database workflow

1. Apply `db/migrations/0001_catalogue.sql`.
2. Run `npm run db:seed:menu`.
3. Apply `db/migrations/0002_orders.sql`.
4. Verify `/api/menu` and `/api/cart/validate`.
5. Test collection + pay-on-collection checkout end to end before enabling restaurant order management.
