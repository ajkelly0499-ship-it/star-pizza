"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";

type AuthChoice = "apple" | "google" | "email" | "create" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, total } = useCart();
  const [authChoice, setAuthChoice] = useState<AuthChoice>(null);

  const showAuthPreview = (choice: Exclude<AuthChoice, null>) => {
    setAuthChoice(choice);
  };

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="checkout-page">
        <div className="shell checkout-back-row">
          <button className="checkout-back-button" onClick={() => router.back()}>
            <span aria-hidden="true">←</span>
            Back
          </button>
          <Link href="/menu">Back to menu</Link>
        </div>

        <div className="shell checkout-grid">
          <div className="checkout-form-panel">
            <span className="kicker">CHECKOUT</span>
            <h1>Finish your order.</h1>
            <p className="checkout-intro">
              Sign in for a faster checkout, or continue as a guest. You can review
              everything before payment.
            </p>

            <section className="checkout-account-card">
              <div className="checkout-account-heading">
                <div>
                  <span className="kicker">YOUR ACCOUNT</span>
                  <h2>Save your details for next time.</h2>
                </div>
                <span className="checkout-optional">Optional</span>
              </div>

              <div className="checkout-social-grid">
                <button
                  className="auth-button auth-button--apple"
                  onClick={() => showAuthPreview("apple")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.1 12.5c0-2.5 2-3.7 2.1-3.8-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.2 1-4 .9-.9 0-2.1-.9-3.5-.9-1.8 0-3.5 1.1-4.5 2.7-1.9 3.3-.5 8.2 1.4 10.9.9 1.3 2 2.8 3.5 2.7 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.1.9 3.6.9 1.5 0 2.5-1.3 3.4-2.7 1.1-1.5 1.5-3 1.5-3.1-.1 0-3.3-1.3-3.3-4.7ZM14.4 5c.8-1 1.4-2.4 1.2-3.8-1.2.1-2.6.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.3.1 2.7-.7 3.6-1.7Z" />
                  </svg>
                  Continue with Apple
                </button>

                <button
                  className="auth-button"
                  onClick={() => showAuthPreview("google")}
                >
                  <span className="google-mark" aria-hidden="true">G</span>
                  Continue with Google
                </button>
              </div>

              <button
                className="auth-button auth-button--email"
                onClick={() => showAuthPreview("email")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 5h18v14H3V5Zm1.5 1.5 7.5 6 7.5-6M4.5 17.5l5.2-5m9.8 5-5.2-5" />
                </svg>
                Continue with email
              </button>

              <div className="checkout-account-create">
                <span>New to Star Pizza?</span>
                <button onClick={() => showAuthPreview("create")}>Create an account</button>
              </div>

              {authChoice && (
                <div className="auth-demo-notice" role="status">
                  <div>
                    <strong>
                      {authChoice === "create"
                        ? "Account creation"
                        : authChoice === "email"
                          ? "Email sign in"
                          : `${authChoice === "apple" ? "Apple" : "Google"} sign in`}
                    </strong>
                    <span>
                      This demo screen is ready; secure account authentication will be connected in the next build stage.
                    </span>
                  </div>
                  <button onClick={() => setAuthChoice(null)} aria-label="Dismiss">×</button>
                </div>
              )}

              <div className="checkout-guest-divider">
                <span>or</span>
              </div>

              <div className="checkout-guest-row">
                <div>
                  <strong>Continue as guest</strong>
                  <span>No account needed. Just enter your details below.</span>
                </div>
                <span className="guest-check" aria-hidden="true">✓</span>
              </div>
            </section>

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
              Continue to secure payment
            </button>
            <small className="checkout-payment-note">
              Payment will be connected securely through Stripe in the production build.
            </small>
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
                  {lines.map(({ key, item, quantity, unitPrice, options }) => (
                    <div key={key} className="checkout-line-detailed">
                      <div>
                        <span>{quantity} × {item.name}</span>
                        {options.map((option) => (
                          <small key={option}>{option.replace(/^Extra:\s*/, "")}</small>
                        ))}
                      </div>
                      <strong>£{(unitPrice * quantity).toFixed(2)}</strong>
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