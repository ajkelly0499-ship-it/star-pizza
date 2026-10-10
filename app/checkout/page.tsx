"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";

type AuthChoice = "apple" | "google" | "email" | "create" | null;
type PaymentChoice = "online" | "collection";
type CollectionTime = "asap" | "later";

type StoreStatus = {
  orderingPaused: boolean;
  collectionEnabled: boolean;
  deliveryEnabled: boolean;
  prepTimeMinutes: number | null;
  openingHoursEnabled: boolean;
  collectionAccepting: boolean;
  deliveryAccepting: boolean;
  collectionMessage: string | null;
  deliveryMessage: string | null;
};

export default function CheckoutPage() {
  const {
    lines,
    total,
    openCart,
    orderType,
    setOrderType,
    validationStatus,
    validationIssues,
    clearCart
  } = useCart();
  const router = useRouter();
  const [authChoice, setAuthChoice] = useState<AuthChoice>(null);
  const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("online");
  const [collectionTime, setCollectionTime] = useState<CollectionTime>("asap");
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [collectionNotes, setCollectionNotes] = useState("");
  const [preferredCollectionTime, setPreferredCollectionTime] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "submitting">("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    if (orderType === "delivery") {
      setPaymentChoice("online");
    }
  }, [orderType]);

  useEffect(() => {
    let cancelled = false;

    const loadStoreStatus = async () => {
      try {
        const response = await fetch("/api/store/status", { cache: "no-store" });
        if (!response.ok) return;

        const result = (await response.json()) as StoreStatus;
        if (cancelled) return;

        setStoreStatus(result);

        if (
          orderType === "delivery" &&
          !result.deliveryEnabled &&
          result.collectionEnabled
        ) {
          setOrderType("collection");
        }
      } catch {
        // Server-side order creation remains authoritative.
      }
    };

    loadStoreStatus();

    return () => {
      cancelled = true;
    };
  }, [orderType, setOrderType]);

  const showAuthPreview = (choice: Exclude<AuthChoice, null>) => {
    setAuthChoice(choice);
    window.setTimeout(() => setAuthChoice(null), 2600);
  };

  const isCollection = orderType === "collection";
  const payOnCollection = isCollection && paymentChoice === "collection";
  const collectionAvailable = storeStatus?.collectionAccepting ?? true;
  const canPlaceCollectionOrder =
    payOnCollection &&
    collectionAvailable &&
    lines.length > 0 &&
    validationStatus === "valid" &&
    checkoutStatus !== "submitting";

  const placeCollectionOrder = async () => {
    setCheckoutError("");

    if (!customerName.trim() || !customerPhone.trim()) {
      setCheckoutError("Please enter your name and mobile number.");
      return;
    }

    if (customerEmail.trim() && !customerEmail.includes("@")) {
      setCheckoutError("Please enter a valid email address or leave it blank.");
      return;
    }

    if (collectionTime === "later" && !preferredCollectionTime) {
      setCheckoutError("Please choose a collection time.");
      return;
    }

    if (validationStatus !== "valid" || lines.length === 0) {
      setCheckoutError("Your basket must be verified before we can create the order.");
      return;
    }

    const requestKey = idempotencyKey || window.crypto.randomUUID();
    if (!idempotencyKey) setIdempotencyKey(requestKey);

    setCheckoutStatus("submitting");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idempotencyKey: requestKey,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          orderType: "collection",
          requestedTimeLabel:
            collectionTime === "later" ? preferredCollectionTime : "ASAP",
          paymentMethod: "COLLECTION",
          customerNotes: collectionNotes.trim(),
          lines: lines.map((line) => ({
            clientLineKey: line.key,
            itemId: line.item.id,
            quantity: line.quantity,
            options: line.options
          }))
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : "We could not create your order."
        );
      }

      clearCart();
      setIdempotencyKey("");
      router.push(
        `/order/${result.id}?token=${encodeURIComponent(result.publicToken)}`
      );
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "We could not create your order. Please try again."
      );
      setCheckoutStatus("idle");
    }
  };

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="checkout-page">
        <div className="shell checkout-back-row">
          <button className="checkout-back-button" onClick={openCart}>
            <span aria-hidden="true">←</span>
            Back to basket
          </button>
        </div>

        <div className="shell checkout-grid">
          <div className="checkout-form-panel">
            <span className="kicker">CHECKOUT</span>
            <h1>Finish your order.</h1>
            <p className="checkout-intro">
              Sign in for a faster checkout, or continue as a guest. You can review
              everything before placing your order.
            </p>

            <section className="checkout-fulfilment-card">
              <div className="checkout-fulfilment-heading">
                <div>
                  <span className="kicker">ORDER TYPE</span>
                  <h2>How would you like your order?</h2>
                </div>
                <span className="checkout-choice-status">
                  {isCollection ? "Collection" : "Delivery"}
                </span>
              </div>

              <div className="checkout-order-type-toggle" role="group" aria-label="Order type">
                <button
                  type="button"
                  className={orderType === "delivery" ? "active" : ""}
                  onClick={() => setOrderType("delivery")}
                  disabled={storeStatus ? !storeStatus.deliveryEnabled : false}
                >
                  <span>Delivery</span>
                  <small>
                    {storeStatus && !storeStatus.deliveryEnabled
                      ? "Not available yet"
                      : "Delivered to your address"}
                  </small>
                </button>
                <button
                  type="button"
                  className={orderType === "collection" ? "active" : ""}
                  onClick={() => setOrderType("collection")}
                  disabled={storeStatus ? !storeStatus.collectionEnabled : false}
                >
                  <span>Collection</span>
                  <small>Pick up from Star Pizza</small>
                </button>
              </div>

              <p className="checkout-choice-helper">
                {isCollection && storeStatus && !storeStatus.collectionAccepting
                  ? storeStatus.collectionMessage ?? "Collection ordering is currently unavailable."
                  : !isCollection && storeStatus && !storeStatus.deliveryAccepting
                    ? storeStatus.deliveryMessage ?? "Delivery ordering is currently unavailable."
                    : isCollection
                      ? storeStatus?.prepTimeMinutes
                        ? `ASAP collection is currently around ${storeStatus.prepTimeMinutes} minutes.`
                        : "You selected collection on the menu. You can change it here before ordering."
                      : "You selected delivery on the menu. You can change it here before ordering."}
              </p>
            </section>

            <section className="checkout-account-card">
              <div className="checkout-account-heading">
                <div>
                  <span className="kicker">YOUR ACCOUNT</span>
                  <h2>Save your details for next time.</h2>
                </div>
                <span className="checkout-optional">Optional</span>
              </div>

              <div className="checkout-account-mobile-row">
                <div>
                  <strong>Guest checkout is ready</strong>
                  <span>You only need an account if you want faster checkout next time.</span>
                </div>
                <span className="guest-check" aria-hidden="true">✓</span>
              </div>

              <button
                type="button"
                className="checkout-account-mobile-toggle"
                aria-expanded={showAccountOptions}
                onClick={() => setShowAccountOptions((current) => !current)}
              >
                <span>{showAccountOptions ? "Hide account options" : "Sign in or create an account"}</span>
                <strong>{showAccountOptions ? "−" : "+"}</strong>
              </button>

              <div className={`checkout-account-options${showAccountOptions ? " open" : ""}`}>
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

                <div className="checkout-guest-divider">
                  <span>or</span>
                </div>
              </div>

              <div className="checkout-guest-row">
                <div>
                  <strong>Continue as guest</strong>
                  <span>No account needed. Just enter your details below.</span>
                </div>
                <span className="guest-check" aria-hidden="true">✓</span>
              </div>
            </section>

            <div className="checkout-section checkout-section--closer">
              <h2>Contact details</h2>
              <div className="field-grid">
                <label>
                  Name
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                  />
                </label>
                <label>
                  Mobile
                  <input
                    name="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="07..."
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                  />
                </label>
              </div>
              <label>
                Email
                <input
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
              </label>
            </div>

            {isCollection ? (
              <div className="checkout-section">
                <h2>Collection details</h2>

                <div className="collection-location-card">
                  <div className="collection-location-icon" aria-hidden="true">★</div>
                  <div>
                    <span>Collect from</span>
                    <strong>Star Pizza Birstall</strong>
                    <p>11 Low Lane, Birstall, WF17 9EW</p>
                  </div>
                </div>

                <div className="checkout-subchoice">
                  <div className="checkout-subchoice-heading">
                    <strong>When would you like to collect?</strong>
                    <span>Choose one</span>
                  </div>
                  <div className="checkout-time-options">
                    <button
                      type="button"
                      className={collectionTime === "asap" ? "active" : ""}
                      onClick={() => setCollectionTime("asap")}
                    >
                      <span>ASAP</span>
                      <small>Next available collection</small>
                    </button>
                    <button
                      type="button"
                      className={collectionTime === "later" ? "active" : ""}
                      onClick={() => setCollectionTime("later")}
                    >
                      <span>Choose a time</span>
                      <small>Schedule collection</small>
                    </button>
                  </div>
                  {collectionTime === "later" && (
                    <label className="checkout-time-select">
                      Preferred collection time
                      <select
                        value={preferredCollectionTime}
                        onChange={(event) => setPreferredCollectionTime(event.target.value)}
                      >
                        <option value="" disabled>Select a time</option>
                        <option>18:00</option>
                        <option>18:15</option>
                        <option>18:30</option>
                        <option>18:45</option>
                        <option>19:00</option>
                        <option>19:15</option>
                        <option>19:30</option>
                      </select>
                    </label>
                  )}
                </div>

                <label>
                  Collection notes
                  <textarea
                  placeholder="Anything the team should know?"
                  value={collectionNotes}
                  onChange={(event) => setCollectionNotes(event.target.value)}
                  maxLength={500}
                />
                </label>
              </div>
            ) : (
              <div className="checkout-section">
                <h2>Delivery details</h2>
                <div className="field-grid">
                  <label>
                    Postcode
                    <input name="postal-code" autoComplete="postal-code" autoCapitalize="characters" placeholder="WF17 9EW" />
                  </label>
                  <label>
                    House number
                    <input name="address-line1" autoComplete="address-line1" placeholder="11" />
                  </label>
                </div>
                <label>
                  Delivery instructions
                  <textarea placeholder="Gate code, flat number, leave at door..." />
                </label>
              </div>
            )}

            {isCollection && (
              <div className="checkout-section checkout-payment-choice">
                <div className="checkout-payment-choice-heading">
                  <div>
                    <h2>How would you like to pay?</h2>
                    <p>Pre-pay for a quicker pickup, or pay when you collect.</p>
                  </div>
                </div>

                <div className="payment-choice-grid">
                  <button
                    type="button"
                    className={paymentChoice === "online" ? "active" : ""}
                    onClick={() => setPaymentChoice("online")}
                  >
                    <span className="payment-choice-radio">
                      {paymentChoice === "online" ? "✓" : ""}
                    </span>
                    <span>
                      <strong>Pay online now</strong>
                      <small>Fastest pickup — nothing to pay when you arrive.</small>
                    </span>
                    <em>Recommended</em>
                  </button>

                  <button
                    type="button"
                    className={paymentChoice === "collection" ? "active" : ""}
                    onClick={() => setPaymentChoice("collection")}
                  >
                    <span className="payment-choice-radio">
                      {paymentChoice === "collection" ? "✓" : ""}
                    </span>
                    <span>
                      <strong>Pay on collection</strong>
                      <small>Pay at the takeaway when you collect your order.</small>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {lines.length > 0 && (
              <div className="checkout-choice-helper" role="status">
                {validationStatus === "validating" && "Checking your basket against current menu pricing…"}
                {validationStatus === "valid" && "Basket checked — current menu pricing confirmed."}
                {validationStatus === "invalid" &&
                  (validationIssues[0]?.message ||
                    "One or more basket items need to be reviewed before checkout.")}
                {validationStatus === "error" &&
                  "We could not verify the basket right now. Checkout will stay unavailable until it is verified."}
              </div>
            )}

            {checkoutError && (
              <div className="checkout-choice-helper" role="alert">
                {checkoutError}
              </div>
            )}

            <button
              type="button"
              className="payment-placeholder"
              disabled={!canPlaceCollectionOrder}
              onClick={placeCollectionOrder}
            >
              {payOnCollection
                ? checkoutStatus === "submitting"
                  ? "Creating your order…"
                  : "Place collection order"
                : "Continue to secure payment"}
            </button>
            <small className="checkout-payment-note">
              {payOnCollection
                ? "This now creates a real collection order in the Star Pizza database. Payment is due on collection."
                : "Online payment is still disabled until the secure payment phase is connected."}
            </small>
          </div>

          <aside className="checkout-summary">
            <div className="checkout-summary-heading">
              <div>
                <span className="kicker">YOUR ORDER</span>
                <h2>Order summary</h2>
              </div>
              {lines.length > 0 && (
                <button onClick={openCart}>Edit order</button>
              )}
            </div>

            <div className="checkout-summary-order-type">
              <span>{isCollection ? "Collection" : "Delivery"}</span>
              <button
                type="button"
                onClick={() => setOrderType(isCollection ? "delivery" : "collection")}
              >
                Change
              </button>
            </div>

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

                <div className="checkout-breakdown">
                  <div>
                    <span>Subtotal</span>
                    <strong>£{total.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>{isCollection ? "Collection" : "Delivery"}</span>
                    {isCollection ? (
                      <strong>£0.00</strong>
                    ) : (
                      <small>Calculated after address</small>
                    )}
                  </div>
                  <div>
                    <span>Discount</span>
                    <small>—</small>
                  </div>
                </div>

                <div className="checkout-total checkout-total--final">
                  <div>
                    <span>Total</span>
                    <small>
                      {isCollection ? "No delivery fee" : "Before delivery"}
                    </small>
                  </div>
                  <strong>£{total.toFixed(2)}</strong>
                </div>

                {isCollection && (
                  <div className="checkout-summary-payment">
                    <span>Payment</span>
                    <strong>
                      {paymentChoice === "online" ? "Pay online" : "Pay on collection"}
                    </strong>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </section>

      {authChoice && (
        <div className="auth-toast" role="status">
          <span>
            {authChoice === "create"
              ? "Account creation will be connected before launch."
              : authChoice === "email"
                ? "Email sign-in will be connected before launch."
                : `${authChoice === "apple" ? "Apple" : "Google"} sign-in will be connected before launch.`}
          </span>
        </div>
      )}
    </main>
  );
}