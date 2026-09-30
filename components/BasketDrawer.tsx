"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart, type CartLine } from "./CartProvider";
import { upsellItems } from "../lib/menu";

export default function BasketDrawer() {
  const {
    lines,
    itemCount,
    total,
    isOpen,
    closeCart,
    addItem,
    addConfiguredItem,
    increaseLine,
    decreaseLine,
    removeLine,
    openCart
  } = useCart();

  const [upsellOpen, setUpsellOpen] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<CartLine | null>(null);

  const suggestions = useMemo(() => {
    const idsInBasket = new Set(lines.map((line) => line.item.id));
    return upsellItems.filter((item) => !idsInBasket.has(item.id)).slice(0, 3);
  }, [lines]);

  const deleteLine = (line: CartLine) => {
    setLastRemoved(line);
    removeLine(line.key);
  };

  const undoDelete = () => {
    if (!lastRemoved) return;
    addConfiguredItem(
      lastRemoved.item.id,
      lastRemoved.unitPrice,
      lastRemoved.options,
      lastRemoved.quantity
    );
    setLastRemoved(null);
  };

  const showUpsell = () => {
    closeCart();
    setUpsellOpen(true);
  };

  return (
    <>
      {itemCount > 0 && (
        <button className="mobile-cart-bar" onClick={openCart}>
          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          <strong>View basket</strong>
          <span>£{total.toFixed(2)}</span>
        </button>
      )}

      {isOpen && (
        <div className="drawer-backdrop" onClick={closeCart}>
          <aside className="basket-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <span className="kicker">YOUR ORDER</span>
                <h2>Basket</h2>
              </div>
              <button className="close-button" onClick={closeCart} aria-label="Close basket">
                ×
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="empty-cart">
                <strong>Your basket is empty</strong>
                <span>Pick something from the menu to get started.</span>
                <Link href="/menu" onClick={closeCart}>Browse menu</Link>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  {lines.map((line) => {
                    const { key, item, quantity, unitPrice, options } = line;

                    return (
                      <div className="drawer-item" key={key}>
                        <div className="drawer-item-copy">
                          <strong>{item.name}</strong>

                          {options.length > 0 ? (
                            options.map((option) => <span key={option}>{option}</span>)
                          ) : (
                            <span>{item.category === "Deals" ? "Feast deal" : item.category}</span>
                          )}

                          <button
                            className="drawer-delete-button"
                            onClick={() => deleteLine(line)}
                            aria-label={`Remove ${item.name} from basket`}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
                            </svg>
                            Remove item
                          </button>
                        </div>

                        <div className="drawer-item-end">
                          <strong>£{(unitPrice * quantity).toFixed(2)}</strong>
                          <div className="quantity-control">
                            <button onClick={() => decreaseLine(key)} aria-label="Decrease quantity">−</button>
                            <span>{quantity}</span>
                            <button onClick={() => increaseLine(key)} aria-label="Increase quantity">+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="drawer-total">
                  <span>Subtotal</span>
                  <strong>£{total.toFixed(2)}</strong>
                </div>

                <button className="checkout-button checkout-button--action" onClick={showUpsell}>
                  <span>Checkout</span>
                  <strong>£{total.toFixed(2)}</strong>
                </button>
                <small className="demo-note">You can review everything again before payment.</small>
              </>
            )}

            {lastRemoved && (
              <div className="basket-undo" role="status">
                <span>Item removed</span>
                <button onClick={undoDelete}>Undo</button>
              </div>
            )}
          </aside>
        </div>
      )}

      {upsellOpen && (
        <div className="upsell-backdrop" onClick={() => setUpsellOpen(false)}>
          <section className="upsell-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="upsell-close"
              onClick={() => setUpsellOpen(false)}
              aria-label="Close suggestions"
            >
              ×
            </button>

            <div className="upsell-heading">
              <span className="kicker">BEFORE YOU GO</span>
              <h2>Fancy something extra?</h2>
              <p>Complete the order with a side, drink or dessert.</p>
            </div>

            <div className="upsell-grid">
              {suggestions.map((item) => (
                <article className="upsell-card" key={item.id}>
                  <div>
                    <span className="upsell-category">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="upsell-card-bottom">
                    <strong>£{item.price.toFixed(2)}</strong>
                    <button onClick={() => addItem(item.id)}>
                      Add <span>+</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="upsell-actions">
              <button className="upsell-skip" onClick={() => setUpsellOpen(false)}>
                Keep browsing
              </button>
              <Link href="/checkout" onClick={() => setUpsellOpen(false)}>
                Continue to checkout
                <span>£{total.toFixed(2)}</span>
              </Link>
            </div>
          </section>
        </div>
      )}
    </>
  );
}