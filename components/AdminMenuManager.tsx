"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSectionNav from "./AdminSectionNav";

type AdminMenuProduct = {
  id: string;
  legacyId: number;
  name: string;
  category: string;
  basePricePence: number;
  soldOut: boolean;
  active: boolean;
  visible: boolean;
};

function money(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function AdminMenuManager({
  products,
  loadError
}: {
  products: AdminMenuProduct[];
  loadError?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<"all" | "available" | "soldout">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (availability === "available" && product.soldOut) return false;
      if (availability === "soldout" && !product.soldOut) return false;
      if (!needle) return true;

      return [product.name, product.category, String(product.legacyId)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [products, query, category, availability]);

  const soldOutCount = products.filter((product) => product.soldOut).length;
  const availableCount = products.filter(
    (product) => product.active && product.visible && !product.soldOut
  ).length;

  const toggleSoldOut = async (product: AdminMenuProduct) => {
    setUpdatingId(product.id);
    setActionError("");

    try {
      const response = await fetch(`/api/admin/menu/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soldOut: !product.soldOut })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Could not update availability.");
      }

      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update availability."
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
            <span>RESTAURANT ADMIN</span>
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

      <AdminSectionNav active="menu" />

      <section className="admin-dashboard admin-menu-manager">
        <div className="admin-dashboard-heading admin-menu-heading">
          <div>
            <span className="admin-eyebrow">MENU &amp; STOCK</span>
            <h1>Control what customers can order.</h1>
            <p>
              Mark an item sold out and checkout rejects it immediately. The customer
              menu also shows it as unavailable.
            </p>
          </div>

          <div className="admin-stat-row">
            <div>
              <span>Available</span>
              <strong>{availableCount}</strong>
            </div>
            <div>
              <span>Sold out</span>
              <strong>{soldOutCount}</strong>
            </div>
            <div>
              <span>Total items</span>
              <strong>{products.length}</strong>
            </div>
          </div>
        </div>

        {(loadError || actionError) && (
          <div className="admin-alert">{actionError || loadError}</div>
        )}

        <div className="admin-menu-toolbar">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menu item"
            aria-label="Search menu items"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter category"
          >
            <option value="all">All categories</option>
            {categories.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value as "all" | "available" | "soldout")
            }
            aria-label="Filter availability"
          >
            <option value="all">All availability</option>
            <option value="available">Available</option>
            <option value="soldout">Sold out</option>
          </select>
        </div>

        <div className="admin-menu-list">
          {visibleProducts.map((product) => (
            <article
              className={`admin-menu-row${product.soldOut ? " sold-out" : ""}`}
              key={product.id}
            >
              <div className="admin-menu-row-copy">
                <span>{product.category}</span>
                <strong>{product.name}</strong>
                <small>
                  Item #{product.legacyId} · from {money(product.basePricePence)}
                </small>
              </div>

              <div className="admin-menu-row-state">
                <span className={product.soldOut ? "sold-out" : "available"}>
                  {product.soldOut ? "Sold out" : "Available"}
                </span>

                <button
                  type="button"
                  className={product.soldOut ? "restore" : "sellout"}
                  disabled={updatingId === product.id}
                  onClick={() => toggleSoldOut(product)}
                >
                  {updatingId === product.id
                    ? "Updating…"
                    : product.soldOut
                      ? "Make available"
                      : "Mark sold out"}
                </button>
              </div>
            </article>
          ))}

          {!visibleProducts.length && (
            <div className="admin-column-empty">No menu items match these filters.</div>
          )}
        </div>
      </section>
    </>
  );
}
