import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db/client";
import {
  orderItemModifiers,
  orderItems,
  orders,
  orderStatusEvents,
  restaurants
} from "../../db/schema";

const RESTAURANT_SLUG = "star-pizza-birstall";

export type AdminOrderStatus =
  | "PENDING_PAYMENT"
  | "NEW"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export type AdminOrder = {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  orderType: "delivery" | "collection";
  requestedTimeLabel: string;
  customerNotes: string | null;
  deliveryPostcode: string | null;
  deliveryAddressLine1: string | null;
  deliveryInstructions: string | null;
  totalPence: number;
  paymentMethod: "ONLINE" | "COLLECTION";
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: AdminOrderStatus;
  createdAt: string;
  completedAt: string | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    lineTotalPence: number;
    modifiers: string[];
  }>;
};

export class AdminOrderError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

const allowedTransitions: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  PENDING_PAYMENT: ["CANCELLED"],
  NEW: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: []
};

async function getRestaurantId() {
  const db = getDb();
  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(and(eq(restaurants.slug, RESTAURANT_SLUG), eq(restaurants.active, true)))
    .limit(1);

  return restaurant?.id ?? null;
}

export async function getAdminOrders(limit = 80): Promise<AdminOrder[]> {
  const db = getDb();
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return [];

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      customerEmail: orders.customerEmail,
      orderType: orders.orderType,
      requestedTimeLabel: orders.requestedTimeLabel,
      customerNotes: orders.customerNotes,
      deliveryPostcode: orders.deliveryPostcode,
      deliveryAddressLine1: orders.deliveryAddressLine1,
      deliveryInstructions: orders.deliveryInstructions,
      totalPence: orders.totalPence,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      orderStatus: orders.orderStatus,
      createdAt: orders.createdAt,
      completedAt: orders.completedAt
    })
    .from(orders)
    .where(eq(orders.restaurantId, restaurantId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);

  if (!rows.length) return [];

  const orderIds = rows.map((row) => row.id);
  const itemRows = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      name: orderItems.productNameSnapshot,
      quantity: orderItems.quantity,
      lineTotalPence: orderItems.lineTotalPence,
      sortOrder: orderItems.sortOrder
    })
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds))
    .orderBy(asc(orderItems.sortOrder));

  const itemIds = itemRows.map((item) => item.id);
  const modifierRows = itemIds.length
    ? await db
        .select({
          orderItemId: orderItemModifiers.orderItemId,
          label: orderItemModifiers.labelSnapshot,
          sortOrder: orderItemModifiers.sortOrder
        })
        .from(orderItemModifiers)
        .where(inArray(orderItemModifiers.orderItemId, itemIds))
        .orderBy(asc(orderItemModifiers.sortOrder))
    : [];

  const modifiersByItem = new Map<string, string[]>();
  for (const modifier of modifierRows) {
    const list = modifiersByItem.get(modifier.orderItemId) ?? [];
    list.push(modifier.label);
    modifiersByItem.set(modifier.orderItemId, list);
  }

  const itemsByOrder = new Map<string, AdminOrder["items"]>();
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      lineTotalPence: item.lineTotalPence,
      modifiers: modifiersByItem.get(item.id) ?? []
    });
    itemsByOrder.set(item.orderId, list);
  }

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    items: itemsByOrder.get(row.id) ?? []
  }));
}

export async function updateAdminOrderStatus(
  orderId: string,
  nextStatus: AdminOrderStatus
) {
  const db = getDb();
  const restaurantId = await getRestaurantId();

  if (!restaurantId) {
    throw new AdminOrderError("Restaurant is unavailable.", 503);
  }

  const [current] = await db
    .select({
      id: orders.id,
      orderType: orders.orderType,
      orderStatus: orders.orderStatus,
      acceptedAt: orders.acceptedAt
    })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))
    .limit(1);

  if (!current) {
    throw new AdminOrderError("Order not found.", 404);
  }

  if (current.orderStatus === nextStatus) {
    return { id: current.id, orderStatus: nextStatus };
  }

  const allowed = allowedTransitions[current.orderStatus].includes(nextStatus);
  if (!allowed) {
    throw new AdminOrderError(
      `Cannot move an order from ${current.orderStatus} to ${nextStatus}.`,
      409
    );
  }

  if (nextStatus === "OUT_FOR_DELIVERY" && current.orderType !== "delivery") {
    throw new AdminOrderError(
      "Collection orders cannot be marked out for delivery.",
      409
    );
  }

  const now = new Date();
  const updateValues: {
    orderStatus: AdminOrderStatus;
    updatedAt: Date;
    acceptedAt?: Date;
    completedAt?: Date;
  } = {
    orderStatus: nextStatus,
    updatedAt: now
  };

  if (nextStatus === "ACCEPTED" && !current.acceptedAt) {
    updateValues.acceptedAt = now;
  }

  if (nextStatus === "COMPLETED") {
    updateValues.completedAt = now;
  }

  const updateQuery = db
    .update(orders)
    .set(updateValues)
    .where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))
    .returning({
      id: orders.id,
      orderStatus: orders.orderStatus
    });

  const eventQuery = db.insert(orderStatusEvents).values({
    id: crypto.randomUUID(),
    orderId,
    status: nextStatus,
    note: "Status updated from restaurant order desk."
  });

  const result = await (db as any).batch([updateQuery, eventQuery]);
  const updated = result[0]?.[0] as
    | { id: string; orderStatus: AdminOrderStatus }
    | undefined;

  if (!updated) {
    throw new AdminOrderError("Order status was not updated.", 500);
  }

  return updated;
}


export type AdminPaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export async function updateAdminPaymentStatus(
  orderId: string,
  nextPaymentStatus: "UNPAID" | "PAID" | "REFUNDED"
) {
  const db = getDb();
  const restaurantId = await getRestaurantId();

  if (!restaurantId) {
    throw new AdminOrderError("Restaurant is unavailable.", 503);
  }

  const [current] = await db
    .select({
      id: orders.id,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus
    })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))
    .limit(1);

  if (!current) {
    throw new AdminOrderError("Order not found.", 404);
  }

  if (current.paymentMethod !== "COLLECTION") {
    throw new AdminOrderError(
      "Online payment status is managed by the payment provider.",
      409
    );
  }

  if (current.paymentStatus === nextPaymentStatus) {
    return { id: current.id, paymentStatus: nextPaymentStatus };
  }

  if (
    current.paymentStatus === "REFUNDED" &&
    nextPaymentStatus !== "PAID"
  ) {
    throw new AdminOrderError(
      "A refunded order can only be restored to paid.",
      409
    );
  }

  const [updated] = await db
    .update(orders)
    .set({
      paymentStatus: nextPaymentStatus,
      updatedAt: new Date()
    })
    .where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))
    .returning({
      id: orders.id,
      paymentStatus: orders.paymentStatus
    });

  if (!updated) {
    throw new AdminOrderError("Payment status was not updated.", 500);
  }

  return updated;
}
