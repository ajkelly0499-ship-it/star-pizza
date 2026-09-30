"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function BasketDrawer() {
  const {
    lines,
    itemCount,
    total,
    isOpen,
    closeCart,
    addItem,
    decreaseItem,
    removeItem,
    openCart
  } = useCart();

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
                  {lines.map(({ item, quantity }) => (
                    <div className="drawer-item" key={item.id}>
                      <div className="drawer-item-copy">
                        <strong>{item.name}</strong>
                        <span>{item.category === "Deals" ? "Feast deal" : item.category}</span>
                        <button onClick={() => removeItem(item.id)}>Remove</button>
                      </div>

                      <div className="drawer-item-end">
                        <strong>£{(item.price * quantity).toFixed(2)}</strong>
                        <div className="quantity-control">
                          <button onClick={() => decreaseItem(item.id)} aria-label="Decrease quantity">−</button>
                          <span>{quantity}</span>
                          <button onClick={() => addItem(item.id)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="drawer-total">
                  <span>Subtotal</span>
                  <strong>£{total.toFixed(2)}</strong>
                </div>

                <Link className="checkout-button" href="/checkout" onClick={closeCart}>
                  Continue to checkout
                </Link>
                <small className="demo-note">Secure online payment will be connected later.</small>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}