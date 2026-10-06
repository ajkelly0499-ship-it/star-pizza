import Link from "next/link";
import { and, asc, eq, inArray } from "drizzle-orm";
import SiteHeader from "../../../components/SiteHeader";
import { getDb } from "../../../db/client";
import {
  orderItemModifiers,
  orderItems,
  orders
} from "../../../db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatOrderNumber(orderNumber: number) {
  return `SP-${String(orderNumber).padStart(4, "0")}`;
}

function formatMoney(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export default async function OrderConfirmationPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="inner-page">
        <SiteHeader />
        <section className="checkout-page">
          <div className="shell order-confirmation-shell">
            <div className="order-confirmation-card">
              <span className="kicker">ORDER</span>
              <h1>We can’t open this order.</h1>
              <p>The confirmation link is incomplete.</p>
              <Link className="menu-basket-button" href="/menu">
                Back to menu
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const db = getDb();

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      orderType: orders.orderType,
      requestedTimeLabel: orders.requestedTimeLabel,
      subtotalPence: orders.subtotalPence,
      totalPence: orders.totalPence,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      orderStatus: orders.orderStatus,
      createdAt: orders.createdAt
    })
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.publicToken, token)))
    .limit(1);

  if (!order) {
    return (
      <main className="inner-page">
        <SiteHeader />
        <section className="checkout-page">
          <div className="shell order-confirmation-shell">
            <div className="order-confirmation-card">
              <span className="kicker">ORDER</span>
              <h1>Order not found.</h1>
              <p>This confirmation link is invalid or has expired.</p>
              <Link className="menu-basket-button" href="/menu">
                Back to menu
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const items = await db
    .select({
      id: orderItems.id,
      name: orderItems.productNameSnapshot,
      quantity: orderItems.quantity,
      unitPricePence: orderItems.unitPricePence,
      lineTotalPence: orderItems.lineTotalPence,
      sortOrder: orderItems.sortOrder
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.sortOrder));

  const itemIds = items.map((item) => item.id);

  const modifiers = itemIds.length
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

  const modifierMap = new Map<string, string[]>();

  for (const modifier of modifiers) {
    const current = modifierMap.get(modifier.orderItemId) ?? [];
    current.push(modifier.label);
    modifierMap.set(modifier.orderItemId, current);
  }

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="checkout-page">
        <div className="shell order-confirmation-shell">
          <div className="order-confirmation-card">
            <span className="kicker">ORDER CONFIRMED</span>
            <div className="order-confirmation-check" aria-hidden="true">
              ✓
            </div>
            <h1>Thanks, {order.customerName}.</h1>
            <p>
              Your collection order has been created and sent into the Star Pizza
              ordering system.
            </p>

            <div className="order-confirmation-number">
              <span>Order number</span>
              <strong>{formatOrderNumber(order.orderNumber)}</strong>
            </div>

            <div className="order-confirmation-meta">
              <div>
                <span>Collection</span>
                <strong>{order.requestedTimeLabel}</strong>
              </div>
              <div>
                <span>Payment</span>
                <strong>
                  {order.paymentMethod === "COLLECTION"
                    ? "Pay on collection"
                    : "Online"}
                </strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{order.orderStatus}</strong>
              </div>
            </div>

            <div className="order-confirmation-items">
              {items.map((item) => (
                <div className="order-confirmation-item" key={item.id}>
                  <div>
                    <strong>
                      {item.quantity} × {item.name}
                    </strong>
                    {(modifierMap.get(item.id) ?? []).map((modifier) => (
                      <small key={modifier}>{modifier}</small>
                    ))}
                  </div>
                  <strong>{formatMoney(item.lineTotalPence)}</strong>
                </div>
              ))}
            </div>

            <div className="order-confirmation-total">
              <span>Total due on collection</span>
              <strong>{formatMoney(order.totalPence)}</strong>
            </div>

            <p className="order-confirmation-note">
              This is the Phase 3 collection-order flow. Online card payment and
              delivery checkout remain disabled until those backend phases are
              connected.
            </p>

            <Link className="menu-basket-button" href="/menu">
              Back to menu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
