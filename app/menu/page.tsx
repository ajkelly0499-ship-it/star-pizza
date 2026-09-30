"use client";

import { useMemo, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";
import { menuCategories, menuItems } from "../../lib/menu";

export default function MenuPage() {
  const [category, setCategory] = useState("Popular");
  const [orderType, setOrderType] = useState<"delivery" | "collection">("delivery");
  const { addItem, openCart, itemCount } = useCart();

  const visibleItems = useMemo(() => {
    if (category === "Popular" || category === "Pizzas") return menuItems;
    return [];
  }, [category]);

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="page-hero menu-page-hero">
        <div className="shell page-hero-grid">
          <div>
            <span className="page-eyebrow">ORDER ONLINE</span>
            <h1>Pick your favourites.</h1>
            <p>
              Choose delivery or collection, browse the menu and build your order.
            </p>
          </div>

          <div className="menu-order-type">
            <span>How are you ordering?</span>
            <div>
              <button
                className={orderType === "delivery" ? "active" : ""}
                onClick={() => setOrderType("delivery")}
              >
                Delivery
              </button>
              <button
                className={orderType === "collection" ? "active" : ""}
                onClick={() => setOrderType("collection")}
              >
                Collection
              </button>
            </div>
            <small>
              {orderType === "delivery"
                ? "Delivery area will be confirmed at checkout."
                : "Collect from 11 Low Lane, Birstall."}
            </small>
          </div>
        </div>
      </section>

      <section className="menu-category-bar">
        <div className="shell menu-category-scroll">
          {menuCategories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="menu-page-content">
        <div className="shell">
          <div className="menu-heading-row">
            <div>
              <span className="kicker">{category === "Popular" ? "CUSTOMER FAVOURITES" : "MENU"}</span>
              <h2>{category}</h2>
            </div>

            {itemCount > 0 && (
              <button className="basket-inline" onClick={openCart}>
                View basket · {itemCount} {itemCount === 1 ? "item" : "items"}
              </button>
            )}
          </div>

          {visibleItems.length > 0 ? (
            <div className="menu-product-grid">
              {visibleItems.map((item) => (
                <article className="menu-product-card" key={item.id}>
                  <div className="menu-product-image-wrap">
                    <img src={item.image} alt={item.name} />
                    {item.badge && <span>{item.badge}</span>}
                  </div>

                  <div className="menu-product-body">
                    <div>
                      <h3>{item.name}</h3>
                      <strong>from £{item.price.toFixed(2)}</strong>
                    </div>
                    <p>{item.description}</p>
                    <button onClick={() => addItem(item.id)}>
                      Add to order
                      <span>+</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="menu-empty-state">
              <span className="kicker">FULL MENU IMPORT NEXT</span>
              <h3>{category} will live here.</h3>
              <p>
                The page structure is ready. We&apos;ll populate every real menu item,
                option and price once we move into the full menu build.
              </p>
              <button onClick={() => setCategory("Pizzas")}>View pizzas</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}