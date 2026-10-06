import { and, eq } from "drizzle-orm";
import { getDb } from "../../db/client";
import {
  orderItemModifiers,
  orderItems,
  orders,
  orderStatusEvents,
  restaurants
} from "../../db/schema";
import {
  validateBasket,
  type BasketValidationInputLine
} from "../cart/validation";

const RESTAURANT_SLUG = "star-pizza-birstall";

export type CreateOrderInput = {
  idempotencyKey: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  orderType: "delivery" | "collection";
  requestedTimeLabel: string;
  paymentMethod: "ONLINE" | "COLLECTION";
  delivery?: {
    postcode?: string;
    addressLine1?: string;
    instructions?: string;
  };
  customerNotes?: string;
  lines: BasketValidationInputLine[];
};

export type CreatedOrder = {
  id: string;
  publicToken: string;
  orderNumber: number;
  displayOrderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalPence: number;
  replayed: boolean;
};

export class OrderCreationError extends Error {
  constructor(
    public code:
      | "BASKET_INVALID"
      | "EMPTY_BASKET"
      | "PAYMENT_NOT_CONNECTED"
      | "DELIVERY_NOT_READY"
      | "RESTAURANT_UNAVAILABLE",
    message: string,
    public status = 422
  ) {
    super(message);
  }
}

function formatOrderNumber(orderNumber: number) {
  return `SP-${String(orderNumber).padStart(4, "0")}`;
}

async function findExistingOrder(
  restaurantId: string,
  idempotencyKey: string
): Promise<CreatedOrder | null> {
  const db = getDb();

  const [existing] = await db
    .select({
      id: orders.id,
      publicToken: orders.publicToken,
      orderNumber: orders.orderNumber,
      orderStatus: orders.orderStatus,
      paymentStatus: orders.paymentStatus,
      totalPence: orders.totalPence
    })
    .from(orders)
    .where(
      and(
        eq(orders.restaurantId, restaurantId),
        eq(orders.idempotencyKey, idempotencyKey)
      )
    )
    .limit(1);

  if (!existing) return null;

  return {
    ...existing,
    displayOrderNumber: formatOrderNumber(existing.orderNumber),
    replayed: true
  };
}

export async function createOrder(
  input: CreateOrderInput
): Promise<CreatedOrder> {
  if (input.lines.length === 0) {
    throw new OrderCreationError(
      "EMPTY_BASKET",
      "Your basket is empty.",
      400
    );
  }

  // Phase 3 deliberately creates only pay-on-collection orders.
  // Online payments are connected in the payment phase and delivery requires
  // delivery-zone validation before it can be accepted safely.
  if (input.orderType === "delivery") {
    throw new OrderCreationError(
      "DELIVERY_NOT_READY",
      "Delivery checkout will be enabled after delivery-zone validation is connected.",
      409
    );
  }

  if (input.paymentMethod !== "COLLECTION") {
    throw new OrderCreationError(
      "PAYMENT_NOT_CONNECTED",
      "Online payment is not connected yet. Choose pay on collection for this phase.",
      409
    );
  }

  const basket = await validateBasket(input.lines);

  if (!basket.valid) {
    const message =
      basket.issues[0]?.message ??
      "One or more basket items are no longer valid.";

    throw new OrderCreationError("BASKET_INVALID", message, 422);
  }

  const db = getDb();

  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(
      and(
        eq(restaurants.slug, RESTAURANT_SLUG),
        eq(restaurants.active, true)
      )
    )
    .limit(1);

  if (!restaurant) {
    throw new OrderCreationError(
      "RESTAURANT_UNAVAILABLE",
      "Star Pizza is not available for ordering.",
      503
    );
  }

  const existing = await findExistingOrder(
    restaurant.id,
    input.idempotencyKey
  );

  if (existing) return existing;

  const orderId = crypto.randomUUID();
  const publicToken = crypto.randomUUID();

  const itemRows = basket.lines.map((line, sortOrder) => ({
    id: crypto.randomUUID(),
    orderId,
    productId: line.productId,
    requestedItemId: line.requestedItemId,
    canonicalItemId: line.canonicalItemId,
    productNameSnapshot: line.name,
    quantity: line.quantity,
    unitPricePence: line.unitPricePence,
    lineTotalPence: line.lineTotalPence,
    sortOrder
  }));

  const modifierRows = basket.lines.flatMap((line, lineIndex) => {
    const item = itemRows[lineIndex];

    return line.options.map((option, sortOrder) => ({
      id: crypto.randomUUID(),
      orderItemId: item.id,
      labelSnapshot: option,
      sortOrder
    }));
  });

  const totalPence = basket.subtotalPence;

  const insertOrder = db
    .insert(orders)
    .values({
      id: orderId,
      publicToken,
      restaurantId: restaurant.id,
      idempotencyKey: input.idempotencyKey,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail?.trim() || null,
      orderType: input.orderType,
      requestedTimeLabel: input.requestedTimeLabel,
      deliveryPostcode: null,
      deliveryAddressLine1: null,
      deliveryInstructions: null,
      customerNotes: input.customerNotes?.trim() || null,
      subtotalPence: basket.subtotalPence,
      deliveryFeePence: 0,
      discountPence: 0,
      totalPence,
      paymentMethod: "COLLECTION",
      paymentStatus: "UNPAID",
      orderStatus: "NEW",
      updatedAt: new Date()
    })
    .returning({
      orderNumber: orders.orderNumber
    });

  const queries: any[] = [insertOrder];

  if (itemRows.length) {
    queries.push(db.insert(orderItems).values(itemRows));
  }

  if (modifierRows.length) {
    queries.push(db.insert(orderItemModifiers).values(modifierRows));
  }

  queries.push(
    db.insert(orderStatusEvents).values({
      id: crypto.randomUUID(),
      orderId,
      status: "NEW",
      note: "Order created from customer checkout."
    })
  );

  try {
    const results = await (db as any).batch(queries);
    const inserted = results[0] as Array<{ orderNumber: number }>;
    const orderNumber = inserted?.[0]?.orderNumber;

    if (!orderNumber) {
      throw new Error("Order was not created.");
    }

    return {
      id: orderId,
      publicToken,
      orderNumber,
      displayOrderNumber: formatOrderNumber(orderNumber),
      orderStatus: "NEW",
      paymentStatus: "UNPAID",
      totalPence,
      replayed: false
    };
  } catch (error) {
    // If two identical requests arrive at nearly the same time, the unique
    // idempotency constraint allows us to return the already-created order.
    const replay = await findExistingOrder(
      restaurant.id,
      input.idempotencyKey
    );

    if (replay) return replay;

    throw error;
  }
}
