"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Status =
  | "PENDING_PAYMENT"
  | "NEW"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

type AdminOrder = {
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
  orderStatus: Status;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    lineTotalPence: number;
    modifiers: string[];
  }>;
};

const activeColumns: Array<{
  status: Status;
  title: string;
  subtitle: string;
}> = [
  { status: "NEW", title: "New", subtitle: "Needs accepting" },
  { status: "ACCEPTED", title: "Accepted", subtitle: "Queued for kitchen" },
  { status: "PREPARING", title: "Preparing", subtitle: "Being made" },
  { status: "READY", title: "Ready", subtitle: "Waiting to leave" }
];

function money(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

function displayNumber(orderNumber: number) {
  return `SP-${String(orderNumber).padStart(4, "0")}`;
}

function orderTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function nextAction(order: AdminOrder): { label: string; status: Status } | null {
  switch (order.orderStatus) {
    case "NEW":
      return { label: "Accept order", status: "ACCEPTED" };
    case "ACCEPTED":
      return { label: "Start preparing", status: "PREPARING" };
    case "PREPARING":
      return { label: "Mark ready", status: "READY" };
    case "READY":
      return order.orderType === "delivery"
        ? { label: "Out for delivery", status: "OUT_FOR_DELIVERY" }
        : { label: "Complete order", status: "COMPLETED" };
    case "OUT_FOR_DELIVERY":
      return { label: "Complete order", status: "COMPLETED" };
    default:
      return null;
  }
}

function OrderCard({
  order,
  busy,
  onUpdate
}: {
  order: AdminOrder;
  busy: boolean;
  onUpdate: (id: string, status: Status) => void;
}) {
  const primary = nextAction(order);
  const canCancel = !["COMPLETED", "CANCELLED"].includes(order.orderStatus);

  return (
    <article className="admin-order-card">
      <div className="admin-order-card-head">
        <div>
          <strong>{displayNumber(order.orderNumber)}</strong>
          <span>{orderTime(order.createdAt)}</span>
        </div>
        <span className={`admin-order-type admin-order-type--${order.orderType}`}>
          {order.orderType}
        </span>
      </div>

      <div className="admin-order-customer">
        <div>
          <strong>{order.customerName}</strong>
          <a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a>
        </div>
        <div>
          <span>{order.orderType === "collection" ? "Collection" : "Delivery"}</span>
          <strong>{order.requestedTimeLabel}</strong>
        </div>
      </div>

      <div className="admin-order-items">
        {order.items.map((item) => (
          <div className="admin-order-item" key={item.id}>
            <div>
              <strong>
                {item.quantity} × {item.name}
              </strong>
              {item.modifiers.map((modifier) => (
                <small key={modifier}>{modifier.replace(/^Extra:\s*/, "")}</small>
              ))}
            </div>
            <span>{money(item.lineTotalPence)}</span>
          </div>
        ))}
      </div>

      {order.customerNotes && (
        <div className="admin-order-note">
          <span>Customer note</span>
          <p>{order.customerNotes}</p>
        </div>
      )}

      {order.orderType === "delivery" && order.deliveryAddressLine1 && (
        <div className="admin-order-note">
          <span>Delivery</span>
          <p>
            {order.deliveryAddressLine1}
            {order.deliveryPostcode ? `, ${order.deliveryPostcode}` : ""}
          </p>
        </div>
      )}

      <div className="admin-order-total">
        <span>
          {order.paymentMethod === "COLLECTION"
            ? "Pay on collection"
            : order.paymentStatus}
        </span>
        <strong>{money(order.totalPence)}</strong>
      </div>

      {(primary || canCancel) && (
        <div className="admin-order-actions">
          {primary && (
            <button
              className="admin-primary-action"
              onClick={() => onUpdate(order.id, primary.status)}
              disabled={busy}
            >
              {busy ? "Updating…" : primary.label}
            </button>
          )}
          {canCancel && (
            <button
              className="admin-cancel-action"
              onClick={() => onUpdate(order.id, "CANCELLED")}
              disabled={busy}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default function AdminOrdersBoard({
  orders,
  loadError
}: {
  orders: AdminOrder[];
  loadError?: string;
}) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 15000);
    return () => window.clearInterval(timer);
  }, [router]);

  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["NEW", "ACCEPTED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(
          order.orderStatus
        )
      ),
    [orders]
  );

  const historyOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["COMPLETED", "CANCELLED"].includes(order.orderStatus)
      ),
    [orders]
  );

  const counts = {
    new: orders.filter((order) => order.orderStatus === "NEW").length,
    kitchen: orders.filter((order) =>
      ["ACCEPTED", "PREPARING"].includes(order.orderStatus)
    ).length,
    ready: orders.filter((order) =>
      ["READY", "OUT_FOR_DELIVERY"].includes(order.orderStatus)
    ).length
  };

  const updateStatus = async (id: string, status: Status) => {
    setUpdatingId(id);
    setActionError("");

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Could not update the order.");
      }

      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update the order."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <span className="admin-star" aria-hidden="true">★</span>
          <div>
            <strong>STAR PIZZA</strong>
            <span>ORDER DESK</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <span className="admin-live-dot">
            <i />
            Auto-refresh · 15 sec
          </span>
          <button type="button" onClick={() => router.refresh()}>
            Refresh
          </button>
          <form action="/api/admin/session" method="post">
            <input type="hidden" name="action" value="logout" />
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <section className="admin-dashboard">
        <div className="admin-dashboard-heading">
          <div>
            <span className="admin-eyebrow">LIVE ORDERS</span>
            <h1>Tonight&apos;s order desk.</h1>
            <p>Accept orders, move them through the kitchen and mark them complete.</p>
          </div>

          <div className="admin-stat-row">
            <div>
              <span>New</span>
              <strong>{counts.new}</strong>
            </div>
            <div>
              <span>Kitchen</span>
              <strong>{counts.kitchen}</strong>
            </div>
            <div>
              <span>Ready</span>
              <strong>{counts.ready}</strong>
            </div>
          </div>
        </div>

        {(loadError || actionError) && (
          <div className="admin-alert">
            {actionError || loadError}
          </div>
        )}

        <div className="admin-board-scroll">
          <div className="admin-board">
            {activeColumns.map((column) => {
              const columnOrders = activeOrders.filter(
                (order) => order.orderStatus === column.status
              );

              return (
                <section className="admin-board-column" key={column.status}>
                  <div className="admin-board-column-head">
                    <div>
                      <strong>{column.title}</strong>
                      <span>{column.subtitle}</span>
                    </div>
                    <b>{columnOrders.length}</b>
                  </div>

                  <div className="admin-board-column-orders">
                    {columnOrders.length ? (
                      columnOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          busy={updatingId === order.id}
                          onUpdate={updateStatus}
                        />
                      ))
                    ) : (
                      <div className="admin-column-empty">
                        Nothing here right now.
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {activeOrders.some((order) => order.orderStatus === "OUT_FOR_DELIVERY") && (
          <section className="admin-delivery-strip">
            <div>
              <span className="admin-eyebrow">ON THE ROAD</span>
              <h2>Out for delivery</h2>
            </div>
            <div className="admin-delivery-orders">
              {activeOrders
                .filter((order) => order.orderStatus === "OUT_FOR_DELIVERY")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    busy={updatingId === order.id}
                    onUpdate={updateStatus}
                  />
                ))}
            </div>
          </section>
        )}

        <section className="admin-history">
          <button
            type="button"
            className="admin-history-toggle"
            onClick={() => setHistoryOpen((open) => !open)}
          >
            <span>
              Recent completed / cancelled orders
              <small>{historyOrders.length} shown</small>
            </span>
            <strong>{historyOpen ? "−" : "+"}</strong>
          </button>

          {historyOpen && (
            <div className="admin-history-grid">
              {historyOrders.length ? (
                historyOrders.slice(0, 20).map((order) => (
                  <article className="admin-history-card" key={order.id}>
                    <div>
                      <strong>{displayNumber(order.orderNumber)}</strong>
                      <span>{order.customerName}</span>
                    </div>
                    <div>
                      <b>{order.orderStatus}</b>
                      <strong>{money(order.totalPence)}</strong>
                    </div>
                  </article>
                ))
              ) : (
                <div className="admin-column-empty">No recent history yet.</div>
              )}
            </div>
          )}
        </section>
      </section>
    </>
  );
}
