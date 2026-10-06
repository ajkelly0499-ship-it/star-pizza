DO $$ BEGIN
  CREATE TYPE order_type AS ENUM ('delivery', 'collection');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'PENDING_PAYMENT',
    'NEW',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('ONLINE', 'COLLECTION');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  public_token uuid NOT NULL,
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  order_number serial NOT NULL,
  idempotency_key text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  order_type order_type NOT NULL,
  requested_time_label text NOT NULL DEFAULT 'ASAP',
  delivery_postcode text,
  delivery_address_line1 text,
  delivery_instructions text,
  customer_notes text,
  subtotal_pence integer NOT NULL CHECK (subtotal_pence >= 0),
  delivery_fee_pence integer NOT NULL DEFAULT 0 CHECK (delivery_fee_pence >= 0),
  discount_pence integer NOT NULL DEFAULT 0 CHECK (discount_pence >= 0),
  total_pence integer NOT NULL CHECK (total_pence >= 0),
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL,
  order_status order_status NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  completed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS orders_public_token_uq
  ON orders (public_token);

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_uq
  ON orders (order_number);

CREATE UNIQUE INDEX IF NOT EXISTS orders_restaurant_idempotency_uq
  ON orders (restaurant_id, idempotency_key);

CREATE INDEX IF NOT EXISTS orders_restaurant_created_idx
  ON orders (restaurant_id, created_at);

CREATE INDEX IF NOT EXISTS orders_restaurant_status_idx
  ON orders (restaurant_id, order_status);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  requested_item_id integer NOT NULL,
  canonical_item_id integer NOT NULL,
  product_name_snapshot text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_pence integer NOT NULL CHECK (unit_price_pence >= 0),
  line_total_pence integer NOT NULL CHECK (line_total_pence >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx
  ON order_items (order_id);

CREATE TABLE IF NOT EXISTS order_item_modifiers (
  id uuid PRIMARY KEY,
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  label_snapshot text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_item_modifiers_item_idx
  ON order_item_modifiers (order_item_id);

CREATE TABLE IF NOT EXISTS order_status_events (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_status_events_order_idx
  ON order_status_events (order_id, created_at);
