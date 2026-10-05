import { count, eq, sql as rawSql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db/client";
import { categories, products, productVariants, restaurants } from "../../../../db/schema";
import {
  brownieItems, burgerItems, calzoneItems, chickenItems, cookieDoughItems,
  dessertItems, drinkItems, fondueItems, garlicBreadItems, kidsItems,
  kebabItems, loadedFriesItems, menuCategories, menuItems, milkshakeItems,
  naanBreadItems, offerItems, sideItems, starterItems, wrapItems, type MenuItem
} from "../../../../lib/menu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESTAURANT_SLUG = "star-pizza-birstall";

const ddl = [
  `CREATE EXTENSION IF NOT EXISTS pgcrypto`,
  `DO $$ BEGIN CREATE TYPE modifier_selection_type AS ENUM ('single','multiple'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE TABLE IF NOT EXISTS restaurants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL,
    currency text NOT NULL DEFAULT 'GBP', timezone text NOT NULL DEFAULT 'Europe/London',
    active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS restaurants_slug_uq ON restaurants (slug)`,
  `CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name text NOT NULL, slug text NOT NULL, sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS categories_restaurant_slug_uq ON categories (restaurant_id, slug)`,
  `CREATE INDEX IF NOT EXISTS categories_restaurant_idx ON categories (restaurant_id)`,
  `CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, legacy_id integer NOT NULL, name text NOT NULL,
    description text NOT NULL DEFAULT '', base_price_pence integer NOT NULL CHECK (base_price_pence >= 0), image_url text,
    badge text, featured boolean NOT NULL DEFAULT false, visible boolean NOT NULL DEFAULT true,
    active boolean NOT NULL DEFAULT true, sold_out boolean NOT NULL DEFAULT false, sort_order integer NOT NULL DEFAULT 0,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb, archived_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS products_restaurant_legacy_id_uq ON products (restaurant_id, legacy_id)`,
  `CREATE INDEX IF NOT EXISTS products_restaurant_category_idx ON products (restaurant_id, category_id)`,
  `CREATE INDEX IF NOT EXISTS products_public_menu_idx ON products (restaurant_id, active, visible, sold_out)`,
  `CREATE TABLE IF NOT EXISTS product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label text NOT NULL, price_pence integer NOT NULL CHECK (price_pence >= 0), sort_order integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS product_variants_product_label_uq ON product_variants (product_id, label)`,
  `CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants (product_id)`,
  `CREATE TABLE IF NOT EXISTS modifier_groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    code text NOT NULL, name text NOT NULL, selection_type modifier_selection_type NOT NULL,
    min_selections integer NOT NULL DEFAULT 0 CHECK (min_selections >= 0), max_selections integer,
    active boolean NOT NULL DEFAULT true, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT modifier_groups_max_valid CHECK (max_selections IS NULL OR max_selections >= min_selections))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS modifier_groups_restaurant_code_uq ON modifier_groups (restaurant_id, code)`,
  `CREATE INDEX IF NOT EXISTS modifier_groups_restaurant_idx ON modifier_groups (restaurant_id)`,
  `CREATE TABLE IF NOT EXISTS modifier_options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), modifier_group_id uuid NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    code text NOT NULL, name text NOT NULL, price_delta_pence integer NOT NULL DEFAULT 0 CHECK (price_delta_pence >= 0),
    sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS modifier_options_group_code_uq ON modifier_options (modifier_group_id, code)`,
  `CREATE INDEX IF NOT EXISTS modifier_options_group_idx ON modifier_options (modifier_group_id)`,
  `CREATE TABLE IF NOT EXISTS product_modifier_groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    modifier_group_id uuid NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE, sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS product_modifier_groups_product_group_uq ON product_modifier_groups (product_id, modifier_group_id)`,
  `CREATE INDEX IF NOT EXISTS product_modifier_groups_product_idx ON product_modifier_groups (product_id)`,
  `CREATE INDEX IF NOT EXISTS product_modifier_groups_group_idx ON product_modifier_groups (modifier_group_id)`
];

const catalogue: MenuItem[] = [
  ...menuItems, ...calzoneItems, ...kebabItems, ...burgerItems, ...chickenItems,
  ...sideItems, ...garlicBreadItems, ...loadedFriesItems, ...wrapItems, ...naanBreadItems,
  ...starterItems, ...milkshakeItems, ...dessertItems, ...drinkItems, ...cookieDoughItems,
  ...brownieItems, ...fondueItems, ...kidsItems, ...offerItems
];

const slugify = (value: string) => value.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const toPence = (value: number) => Math.round(value * 100);

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview" || process.env.VERCEL_GIT_COMMIT_REF !== "backend-phase-1") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  try {
    const db = getDb();
    for (const statement of ddl) await db.execute(rawSql.raw(statement));

    const [restaurant] = await db.insert(restaurants).values({
      name:"Star Pizza Birstall", slug:RESTAURANT_SLUG, currency:"GBP",
      timezone:"Europe/London", active:true, updatedAt:new Date()
    }).onConflictDoUpdate({
      target:restaurants.slug,
      set:{name:"Star Pizza Birstall",currency:"GBP",timezone:"Europe/London",active:true,updatedAt:new Date()}
    }).returning({id:restaurants.id});

    if (!restaurant) throw new Error("Could not create restaurant.");

    const categoryNames = Array.from(new Set([
      ...menuCategories.filter((name)=>name!=="Popular"),
      ...catalogue.map((item)=>item.category)
    ]));
    const categoryIdByName = new Map<string,string>();

    for (const [sortOrder,name] of categoryNames.entries()) {
      const [category] = await db.insert(categories).values({
        restaurantId:restaurant.id,name,slug:slugify(name),sortOrder,active:true,updatedAt:new Date()
      }).onConflictDoUpdate({
        target:[categories.restaurantId,categories.slug],
        set:{name,sortOrder,active:true,updatedAt:new Date()}
      }).returning({id:categories.id});
      if (!category) throw new Error(`Could not seed category: ${name}`);
      categoryIdByName.set(name,category.id);
    }

    for (const [sortOrder,item] of catalogue.entries()) {
      const categoryId=categoryIdByName.get(item.category);
      if (!categoryId) throw new Error(`Missing category: ${item.category}`);
      const [product]=await db.insert(products).values({
        restaurantId:restaurant.id,categoryId,legacyId:item.id,name:item.name,description:item.description,
        basePricePence:toPence(item.price),imageUrl:item.image??null,badge:item.badge??null,
        featured:item.featured??false,visible:true,active:true,soldOut:false,sortOrder,
        metadata:{source:"legacy-static-menu",requiresOwnerReview:true},updatedAt:new Date()
      }).onConflictDoUpdate({
        target:[products.restaurantId,products.legacyId],
        set:{categoryId,name:item.name,description:item.description,basePricePence:toPence(item.price),
          imageUrl:item.image??null,badge:item.badge??null,featured:item.featured??false,visible:true,
          active:true,sortOrder,metadata:{source:"legacy-static-menu",requiresOwnerReview:true},updatedAt:new Date()}
      }).returning({id:products.id});
      if (!product) throw new Error(`Could not seed product: ${item.name}`);
      await db.delete(productVariants).where(eq(productVariants.productId,product.id));
      if (item.variants?.length) await db.insert(productVariants).values(item.variants.map((variant,variantIndex)=>({
        productId:product.id,label:variant.label,pricePence:toPence(variant.price),sortOrder:variantIndex,active:true
      })));
    }

    const [pc]=await db.select({count:count()}).from(products);
    const [cc]=await db.select({count:count()}).from(categories);
    const [vc]=await db.select({count:count()}).from(productVariants);

    return NextResponse.json({ok:true,products:Number(pc?.count??0),categories:Number(cc?.count??0),variants:Number(vc?.count??0)});
  } catch (error) {
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Unknown bootstrap error"},{status:500});
  }
}
