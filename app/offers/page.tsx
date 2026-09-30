"use client";

import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";
import { offerItems } from "../../lib/menu";

export default function OffersPage() {
  const { addItem, openCart } = useCart();

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="page-hero offers-page-hero">
        <div className="shell page-hero-grid">
          <div>
            <span className="page-eyebrow">STAR PIZZA DEALS</span>
            <h1>More food. Better value.</h1>
            <p>
              Feast deals for date night, family night and the nights nobody wants to cook.
            </p>
          </div>
          <Link className="page-hero-link" href="/menu">
            Browse full menu <span>→</span>
          </Link>
        </div>
      </section>

      <section className="offers-page-content">
        <div className="shell">
          <article className="offer-feature-large">
            <div className="offer-feature-photo">
              <span>Featured feast</span>
            </div>

            <div className="offer-feature-detail">
              <span className="kicker">THE FAMILY FEAST</span>
              <h2>Everyone sorted for £30.</h2>
              <p>
                16&quot; family pizza, garlic bread with tomato, two fries and a bottle.
              </p>

              <div className="offer-feature-footer">
                <strong>£30</strong>
                <button
                  onClick={() => {
                    addItem(101);
                    openCart();
                  }}
                >
                  Add to basket <span>→</span>
                </button>
              </div>
            </div>
          </article>

          <div className="deal-grid">
            {offerItems.slice(1).map((offer) => (
              <article className="deal-card" key={offer.id}>
                <div>
                  <span className="kicker">FEAST DEAL</span>
                  <h3>{offer.name}</h3>
                  <p>{offer.description}</p>
                </div>
                <div className="deal-card-bottom">
                  <strong>£{offer.price.toFixed(0)}</strong>
                  <button
                    onClick={() => {
                      addItem(offer.id);
                      openCart();
                    }}
                  >
                    Choose deal
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="offers-callout">
            <div>
              <span className="kicker">WANT SOMETHING ELSE?</span>
              <h2>Build your own order.</h2>
            </div>
            <Link href="/menu">Go to the menu <span>→</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}