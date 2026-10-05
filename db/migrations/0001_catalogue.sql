CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE modifier_selection_type AS ENUM ('single', 'multiple');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  timezone text NOT NULL DEFAULT 'Europe/London',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS restaurants_slug_uq
  ON restaurants (slug);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_restaurant_slug_uq
  ON categories (restaurant_id, slug);
CREATE INDEX IF NOT EXISTS categories_restaurant_idx
  ON categories (restaurant_id);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  legacy_id integer NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  base_price_pence integer NOT NULL CHECK (base_price_pence >= 0),
  image_url text,
  badge text,
  featured boolean NOT NULL DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  sold_out boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS products_restaurant_legacy_id_uq
  ON products (restaurant_id, legacy_id);
CREATE INDEX IF NOT EXISTS products_restaurant_category_idx
  ON products (restaurant_id, category_id);
CREATE INDEX IF NOT EXISTS products_public_menu_idx
  ON products (restaurant_id, active, visible, sold_out);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label text NOT NULL,
  price_pence integer NOT NULL CHECK (price_pence >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_variants_product_label_uq
  ON product_variants (product_id, label);
CREATE INDEX IF NOT EXISTS product_variants_product_idx
  ON product_variants (product_id);

CREATE TABLE IF NOT EXISTS modifier_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  selection_type modifier_selection_type NOT NULL,
  min_selections integer NOT NULL DEFAULT 0 CHECK (min_selections >= 0),
  max_selections integer,
  active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT modifier_groups_max_valid
    CHECK (max_selections IS NULL OR max_selections >= min_selections)
);

CREATE UNIQUE INDEX IF NOT EXISTS modifier_groups_restaurant_code_uq
  ON modifier_groups (restaurant_id, code);
CREATE INDEX IF NOT EXISTS modifier_groups_restaurant_idx
  ON modifier_groups (restaurant_id);

CREATE TABLE IF NOT EXISTS modifier_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modifier_group_id uuid NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  price_delta_pence integer NOT NULL DEFAULT 0 CHECK (price_delta_pence >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS modifier_options_group_code_uq
  ON modifier_options (modifier_group_id, code);
CREATE INDEX IF NOT EXISTS modifier_options_group_idx
  ON modifier_options (modifier_group_id);

CREATE TABLE IF NOT EXISTS product_modifier_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  modifier_group_id uuid NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_modifier_groups_product_group_uq
  ON product_modifier_groups (product_id, modifier_group_id);
CREATE INDEX IF NOT EXISTS product_modifier_groups_product_idx
  ON product_modifier_groups (product_id);
CREATE INDEX IF NOT EXISTS product_modifier_groups_group_idx
  ON product_modifier_groups (modifier_group_id);
