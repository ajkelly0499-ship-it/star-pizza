import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { menuItems } from "../lib/menu";

const popularItems = menuItems.slice(0, 3);

export default function Home() {
  return (
    <main>
      <SiteHeader overlay />

      <section className="home-hero">
        <div className="home-hero-media" />
        <div className="home-hero-shade" />

        <div className="shell home-hero-content">
          <div className="home-hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              Birstall · Made fresh to order
            </div>

            <h1>
              <span>Your night in</span>
              <span>just got <em>better.</em></span>
            </h1>

            <p>
              Fresh dough, proper toppings and all the favourites — ready for
              delivery or collection.
            </p>

            <div className="home-hero-actions">
              <Link className="primary-cta" href="/menu">
                Order now <span>→</span>
              </Link>
              <Link className="secondary-cta" href="/offers">
                View offers
              </Link>
            </div>

            <div className="hero-proof">
              <div>
                <strong>Fresh dough</strong>
                <span>made daily</span>
              </div>
              <div>
                <strong>400°C</strong>
                <span>stone fired</span>
              </div>
              <div>
                <strong>Birstall</strong>
                <span>delivery & collection</span>
              </div>
            </div>
          </div>

          <div className="start-order-card">
            <span className="order-card-label">START YOUR ORDER</span>
            <h2>What are you in the mood for?</h2>
            <p>Jump straight into the menu or check the latest feast deals.</p>

            <div className="start-order-links">
              <Link href="/menu">
                <div>
                  <span>Delivery or collection</span>
                  <strong>Browse the menu</strong>
                </div>
                <span>→</span>
              </Link>

              <Link href="/offers">
                <div>
                  <span>Feeding more than one?</span>
                  <strong>See the offers</strong>
                </div>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-offer-teaser">
        <div className="shell home-offer-grid">
          <div className="home-offer-photo">
            <span>Featured deal</span>
          </div>

          <div className="home-offer-copy">
            <span className="kicker">THE FAMILY FEAST</span>
            <h2>Big night in. £30.</h2>
            <p>
              16&quot; family pizza, garlic bread with tomato, two fries and a bottle.
            </p>
            <Link href="/offers">
              See all offers <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-popular">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">CUSTOMER FAVOURITES</span>
              <h2>Popular right now</h2>
            </div>
            <Link href="/menu">
              View full menu <span>→</span>
            </Link>
          </div>

          <div className="food-grid">
            {popularItems.map((item) => (
              <article className="food-card" key={item.id}>
                <div className="food-image-wrap">
                  <img src={item.image} alt={item.name} className="food-image" />
                  {item.badge && <span className="food-badge">{item.badge}</span>}
                </div>
                <div className="food-card-body">
                  <div className="food-card-top">
                    <div>
                      <span className="food-category">{item.category}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <strong className="price">from £{item.price.toFixed(2)}</strong>
                  </div>
                  <p>{item.description}</p>
                  <Link className="food-card-link" href="/menu">
                    Order from menu <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-reassurance">
        <div className="shell reassurance-grid">
          <article>
            <span>01</span>
            <h3>Order online</h3>
            <p>Choose your food without leaving the Star Pizza website.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Pay securely</h3>
            <p>Checkout will be handled securely through the finished ordering system.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Track progress</h3>
            <p>Customers will be able to follow the order from accepted to ready.</p>
          </article>
        </div>
      </section>
    </main>
  );
}