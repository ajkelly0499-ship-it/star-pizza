"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSectionNav from "./AdminSectionNav";

type Status =
  | "PENDING_PAYMENT"
  | "NEW"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type Period = "today" | "7d" | "30d" | "all";

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
  paymentStatus: PaymentStatus;
  orderStatus: Status;
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

function money(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

function displayNumber(orderNumber: number) {
  return `SP-${String(orderNumber).padStart(4, "0")}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function inPeriod(value: string, period: Period) {
  if (period === "all") return true;

  const date = new Date(value);
  const now = new Date();

  if (period === "today") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  const days = period === "7d" ? 7 : 30;
  return date.getTime() >= now.getTime() - days * 24 * 60 * 60 * 1000;
}

export default function AdminHistoryDashboard({
  orders,
  loadError
}: {
  orders: AdminOrder[];
  loadError?: string;
}) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("today");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const periodOrders = useMemo(
    () => orders.filter((order) => inPeriod(order.createdAt, period)),
    [orders, period]
  );

  const completed = useMemo(
    () => periodOrders.filter((order) => order.orderStatus === "COMPLETED"),
    [periodOrders]
  );

  const grossOrderValue = completed.reduce(
    (sum, order) => sum + order.totalPence,
    0
  );
  const paidTakings = completed
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + order.totalPence, 0);
  const unpaidDue = completed
    .filter((order) => order.paymentStatus === "UNPAID")
    .reduce((sum, order) => sum + order.totalPence, 0);
  const averageOrder = completed.length
    ? Math.round(grossOrderValue / completed.length)
    : 0;

  const topProducts = useMemo(() => {
    const products = new Map<string, { quantity: number; revenue: number }>();

    for (const order of completed) {
      for (const item of order.items) {
        const current = products.get(item.name) ?? { quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += item.lineTotalPence;
        products.set(item.name, current);
      }
    }

    return [...products.entries()]
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 8);
  }, [completed]);

  const visibleOrders = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return periodOrders.filter((order) => {
      if (status !== "all" && order.orderStatus !== status) return false;
      if (!needle) return true;

      return [
        displayNumber(order.orderNumber),
        order.customerName,
        order.customerPhone,
        order.customerEmail ?? "",
        ...order.items.map((item) => item.name)
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [periodOrders, query, status]);

  const updatePayment = async (
    id: string,
    paymentStatus: "UNPAID" | "PAID"
  ) => {
    setUpdatingId(id);
    setActionError("");

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Could not update payment.");
      }

      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update payment."
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
          <button type="button" onClick={() => router.refresh()}>Refresh</button>
          <form action="/api/admin/session" method="post">
            <input type="hidden" name="action" value="logout" />
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <AdminSectionNav active="history" />

      <section className="admin-dashboard admin-reporting">
        <div className="admin-dashboard-heading admin-reporting-heading">
          <div>
            <span className="admin-eyebrow">ORDER HISTORY + REPORTING</span>
            <h1>Know what&apos;s selling.</h1>
            <p>
              Track completed orders, actual paid takings, money still due and
              product quantities sold.
            </p>
          </div>

          <div className="admin-period-tabs">
            {([
              ["today", "Today"],
              ["7d", "7 days"],
              ["30d", "30 days"],
              ["all", "All time"]
            ] as Array<[Period, string]>).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={period === value ? "active" : ""}
                onClick={() => setPeriod(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {(loadError || actionError) && (
          <div className="admin-alert">{actionError || loadError}</div>
        )}

        <div className="admin-report-cards">
          <article>
            <span>Completed orders</span>
            <strong>{completed.length}</strong>
            <small>Orders fulfilled in this period</small>
          </article>
          <article>
            <span>Paid takings</span>
            <strong>{money(paidTakings)}</strong>
            <small>Completed orders marked paid</small>
          </article>
          <article>
            <span>Order value</span>
            <strong>{money(grossOrderValue)}</strong>
            <small>Total value of completed orders</small>
          </article>
          <article className={unpaidDue > 0 ? "attention" : ""}>
            <span>Payment due</span>
            <strong>{money(unpaidDue)}</strong>
            <small>Completed collection orders not marked paid</small>
          </article>
          <article>
            <span>Average order</span>
            <strong>{money(averageOrder)}</strong>
            <small>Average completed order value</small>
          </article>
        </div>

        <div className="admin-report-grid">
          <section className="admin-report-panel">
            <div className="admin-report-panel-head">
              <div>
                <span className="admin-eyebrow">PRODUCT MOVEMENT</span>
                <h2>Top sellers</h2>
              </div>
              <small>Based on completed orders</small>
            </div>

            <div className="admin-top-products">
              {topProducts.length ? (
                topProducts.map((product, index) => (
                  <div key={product.name}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>{product.name}</span>
                    <strong>{product.quantity} sold</strong>
                    <em>{money(product.revenue)}</em>
                  </div>
                ))
              ) : (
                <div className="admin-column-empty">No completed product sales yet.</div>
              )}
            </div>
          </section>

          <section className="admin-report-panel admin-report-explainer">
            <span className="admin-eyebrow">STOCK + INCOME</span>
            <h2>Useful numbers, not guesswork.</h2>
            <p>
              “Paid takings” only counts orders the team has actually marked as
              paid. “Order value” shows the value fulfilled even if collection
              payment still needs recording.
            </p>
            <p>
              Product quantities show what has moved through the kitchen. The next
              control layer will add sold-out switches and menu availability.
            </p>
          </section>
        </div>

        <section className="admin-history-table-section">
          <div className="admin-history-controls">
            <div>
              <span className="admin-eyebrow">ALL ORDERS</span>
              <h2>Order history</h2>
            </div>
            <div className="admin-history-filters">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search order, customer, phone or item"
                aria-label="Search order history"
              />
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "all" | Status)
                }
                aria-label="Filter order status"
              >
                <option value="all">All statuses</option>
                <option value="NEW">New</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="admin-history-table-wrap">
            <table className="admin-history-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{displayNumber(order.orderNumber)}</strong>
                      <small>{formatDateTime(order.createdAt)}</small>
                    </td>
                    <td>
                      <strong>{order.customerName}</strong>
                      <small>{order.customerPhone}</small>
                    </td>
                    <td>
                      <strong>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </strong>
                      <small>
                        {order.items
                          .slice(0, 2)
                          .map((item) => `${item.quantity}× ${item.name}`)
                          .join(", ")}
                        {order.items.length > 2 ? "…" : ""}
                      </small>
                    </td>
                    <td>
                      <span className={`admin-table-status admin-table-status--${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-table-payment admin-table-payment--${order.paymentStatus.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td><strong>{money(order.totalPence)}</strong></td>
                    <td>
                      {order.paymentMethod === "COLLECTION" &&
                        order.paymentStatus !== "REFUNDED" &&
                        order.orderStatus !== "CANCELLED" && (
                          <button
                            type="button"
                            className="admin-history-payment-button"
                            disabled={updatingId === order.id}
                            onClick={() =>
                              updatePayment(
                                order.id,
                                order.paymentStatus === "PAID" ? "UNPAID" : "PAID"
                              )
                            }
                          >
                            {updatingId === order.id
                              ? "Updating…"
                              : order.paymentStatus === "PAID"
                                ? "Mark due"
                                : "Mark paid"}
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!visibleOrders.length && (
              <div className="admin-column-empty">No orders match these filters.</div>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
