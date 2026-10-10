import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
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
    orderingPaused: boolean("ordering_paused").notNull().default(false),
    collectionEnabled: boolean("collection_enabled").notNull().default(true),
    deliveryEnabled: boolean("delivery_enabled").notNull().default(false),
    prepTimeMinutes: integer("prep_time_minutes"),
    openingHoursEnabled: boolean("opening_hours_enabled").notNull().default(false),
    openingHours: jsonb("opening_hours")
      .$type<Record<string, { enabled: boolean; open: string; close: string }>>()
      .notNull()
      .default(sql`'{"mon":{"enabled":true,"open":"00:00","close":"23:59"},"tue":{"enabled":true,"open":"00:00","close":"23:59"},"wed":{"enabled":true,"open":"00:00","close":"23:59"},"thu":{"enabled":true,"open":"00:00","close":"23:59"},"fri":{"enabled":true,"open":"00:00","close":"23:59"},"sat":{"enabled":true,"open":"00:00","close":"23:59"},"sun":{"enabled":true,"open":"00:00","close":"23:59"}}'::jsonb`),
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


export const orderType = pgEnum("order_type", ["delivery", "collection"]);

export const orderStatus = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "NEW",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED"
]);

export const paymentMethod = pgEnum("payment_method", [
  "ONLINE",
  "COLLECTION"
]);

export const paymentStatus = pgEnum("payment_status", [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED"
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey(),
    publicToken: uuid("public_token").notNull(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "restrict" }),
    orderNumber: serial("order_number").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    orderType: orderType("order_type").notNull(),
    requestedTimeLabel: text("requested_time_label").notNull().default("ASAP"),
    deliveryPostcode: text("delivery_postcode"),
    deliveryAddressLine1: text("delivery_address_line1"),
    deliveryInstructions: text("delivery_instructions"),
    customerNotes: text("customer_notes"),
    subtotalPence: integer("subtotal_pence").notNull(),
    deliveryFeePence: integer("delivery_fee_pence").notNull().default(0),
    discountPence: integer("discount_pence").notNull().default(0),
    totalPence: integer("total_pence").notNull(),
    paymentMethod: paymentMethod("payment_method").notNull(),
    paymentStatus: paymentStatus("payment_status").notNull(),
    orderStatus: orderStatus("order_status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true })
  },
  (table) => [
    uniqueIndex("orders_public_token_uq").on(table.publicToken),
    uniqueIndex("orders_order_number_uq").on(table.orderNumber),
    uniqueIndex("orders_restaurant_idempotency_uq").on(
      table.restaurantId,
      table.idempotencyKey
    ),
    index("orders_restaurant_created_idx").on(table.restaurantId, table.createdAt),
    index("orders_restaurant_status_idx").on(table.restaurantId, table.orderStatus),
    check("orders_subtotal_non_negative", sql`${table.subtotalPence} >= 0`),
    check("orders_delivery_fee_non_negative", sql`${table.deliveryFeePence} >= 0`),
    check("orders_discount_non_negative", sql`${table.discountPence} >= 0`),
    check("orders_total_non_negative", sql`${table.totalPence} >= 0`)
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null"
    }),
    requestedItemId: integer("requested_item_id").notNull(),
    canonicalItemId: integer("canonical_item_id").notNull(),
    productNameSnapshot: text("product_name_snapshot").notNull(),
    quantity: integer("quantity").notNull(),
    unitPricePence: integer("unit_price_pence").notNull(),
    lineTotalPence: integer("line_total_pence").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    check("order_items_quantity_positive", sql`${table.quantity} > 0`),
    check("order_items_unit_price_non_negative", sql`${table.unitPricePence} >= 0`),
    check("order_items_line_total_non_negative", sql`${table.lineTotalPence} >= 0`)
  ]
);

export const orderItemModifiers = pgTable(
  "order_item_modifiers",
  {
    id: uuid("id").primaryKey(),
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    labelSnapshot: text("label_snapshot").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("order_item_modifiers_item_idx").on(table.orderItemId)
  ]
);

export const orderStatusEvents = pgTable(
  "order_status_events",
  {
    id: uuid("id").primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    status: orderStatus("status").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("order_status_events_order_idx").on(table.orderId, table.createdAt)
  ]
);
