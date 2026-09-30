"use client";

import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";

export default function CheckoutPage() {
  const { lines, total } = useCart();

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="checkout-page">
        <div className="shell checkout-grid">
          <div className="checkout-form-panel">
            <span className="kicker">CHECKOUT</span>
            <h1>Finish your order.</h1>
            <p className="checkout-intro">
              This is the checkout structure for the demo. Secure card payment will be
              connected when we add Stripe.
            </p>

            <div className="checkout-section">
              <h2>Contact details</h2>
              <div className="field-grid">
                <label>
                  Name
                  <input placeholder="Your name" />
                </label>
                <label>
                  Mobile
                  <input placeholder="07..." />
                </label>
              </div>
              <label>
                Email
                <input placeholder="you@example.com" type="email" />
              </label>
            </div>

            <div className="checkout-section">
              <h2>Delivery details</h2>
              <div className="field-grid">
                <label>
                  Postcode
                  <input placeholder="WF17 9EW" />
                </label>
                <label>
                  House number
                  <input placeholder="11" />
                </label>
              </div>
              <label>
                Delivery instructions
                <textarea placeholder="Gate code, flat number, leave at door..." />
              </label>
            </div>

            <button className="payment-placeholder" disabled>
              Secure payment coming next
            </button>
          </div>

          <aside className="checkout-summary">
            <span className="kicker">YOUR ORDER</span>
            <h2>Order summary</h2>

            {lines.length === 0 ? (
              <div className="checkout-empty">
                <p>Your basket is empty.</p>
                <Link href="/menu">Browse menu</Link>
              </div>
            ) : (
              <>
                <div className="checkout-lines">
                  {lines.map(({ item, quantity }) => (
                    <div key={item.id}>
                      <span>{quantity} × {item.name}</span>
                      <strong>£{(item.price * quantity).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
                <div className="checkout-total">
                  <span>Subtotal</span>
                  <strong>£{total.toFixed(2)}</strong>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}