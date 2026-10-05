import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const modifierSelectionType = pgEnum("modifier_selection_type", [
  "single",
  "multiple"
]);

export const restaurants = pgTable(
  "restaurants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    currency: text("currency").notNull().default("GBP"),
    timezone: text("timezone").notNull().default("Europe/London"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("restaurants_slug_uq").on(table.slug)
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("categories_restaurant_slug_uq").on(table.restaurantId, table.slug),
    index("categories_restaurant_idx").on(table.restaurantId)
  ]
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    legacyId: integer("legacy_id").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    basePricePence: integer("base_price_pence").notNull(),
    imageUrl: text("image_url"),
    badge: text("badge"),
    featured: boolean("featured").notNull().default(false),
    visible: boolean("visible").notNull().default(true),
    active: boolean("active").notNull().default(true),
    soldOut: boolean("sold_out").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("products_restaurant_legacy_id_uq").on(table.restaurantId, table.legacyId),
    index("products_restaurant_category_idx").on(table.restaurantId, table.categoryId),
    index("products_public_menu_idx").on(
      table.restaurantId,
      table.active,
      table.visible,
      table.soldOut
    ),
    check("products_base_price_non_negative", sql`${table.basePricePence} >= 0`)
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    pricePence: integer("price_pence").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("product_variants_product_label_uq").on(table.productId, table.label),
    index("product_variants_product_idx").on(table.productId),
    check("product_variants_price_non_negative", sql`${table.pricePence} >= 0`)
  ]
);

export const modifierGroups = pgTable(
  "modifier_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    selectionType: modifierSelectionType("selection_type").notNull(),
    minSelections: integer("min_selections").notNull().default(0),
    maxSelections: integer("max_selections"),
    active: boolean("active").notNull().default(true),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("modifier_groups_restaurant_code_uq").on(table.restaurantId, table.code),
    index("modifier_groups_restaurant_idx").on(table.restaurantId),
    check("modifier_groups_min_non_negative", sql`${table.minSelections} >= 0`),
    check(
      "modifier_groups_max_valid",
      sql`${table.maxSelections} IS NULL OR ${table.maxSelections} >= ${table.minSelections}`
    )
  ]
);

export const modifierOptions = pgTable(
  "modifier_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    modifierGroupId: uuid("modifier_group_id")
      .notNull()
      .references(() => modifierGroups.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    priceDeltaPence: integer("price_delta_pence").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("modifier_options_group_code_uq").on(table.modifierGroupId, table.code),
    index("modifier_options_group_idx").on(table.modifierGroupId),
    check("modifier_options_price_non_negative", sql`${table.priceDeltaPence} >= 0`)
  ]
);

export const productModifierGroups = pgTable(
  "product_modifier_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    modifierGroupId: uuid("modifier_group_id")
      .notNull()
      .references(() => modifierGroups.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("product_modifier_groups_product_group_uq").on(
      table.productId,
      table.modifierGroupId
    ),
    index("product_modifier_groups_product_idx").on(table.productId),
    index("product_modifier_groups_group_idx").on(table.modifierGroupId)
  ]
);
