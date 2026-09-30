"use client";

import { useMemo, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita",
    description: "Pizza sauce, 100% mozzarella and Italian herbs.",
    price: 9.8,
    category: "Pizzas",
    badge: "Classic",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Pepperoni, green peppers and Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: 3,
    name: "Hot Shot",
    description: "Pepperoni, fresh chilli, green peppers and red onions.",
    price: 11.35,
    category: "Pizzas",
    badge: "Spicy",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85"
  }
];

const categories = [
  "Popular",
  "Deals",
  "Pizzas",
  "Calzones",
  "Kebabs",
  "Burgers",
  "Chicken",
  "Sides",
  "Desserts",
  "Drinks"
];

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <path
          d="M32 6.5 38.1 21l15.7 1.2-12 10.2 3.7 15.3L32 39.4 18.5 47.7l3.7-15.3-12-10.2L25.9 21 32 6.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  const [orderType, setOrderType] = useState<"delivery" | "collection">("delivery");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [cart, setCart] = useState<number[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);

  const cartItems = useMemo(
    () => cart.map((id) => menuItems.find((item) => item.id === id)).filter(Boolean) as MenuItem[],
    [cart]
  );

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (id: number) => {
    setCart((current) => [...current, id]);
  };

  return (
    <main>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>11 Low Lane, Birstall</span>
          <span className="utility-divider" />
          <span>Delivery & collection</span>
          <a href="tel:01924477755">01924 477755</a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell nav">
          <a className="brand" href="#" aria-label="Star Pizza home">
            <BrandMark />
            <div>
              <strong>STAR PIZZA</strong>
              <span>BIRSTALL</span>
            </div>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#menu">Menu</a>
            <a href="#popular">Popular</a>
            <a href="#story">Our story</a>
          </nav>

          <button className="basket-button" onClick={() => setBasketOpen(true)}>
            <span className="basket-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 8h12l-1 11H7L6 8Zm3-2a3 3 0 0 1 6 0v2H9V6Z" />
              </svg>
            </span>
            <span>Basket</span>
            <span className="basket-count">{cart.length}</span>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-media" />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              Birstall · Made fresh to order
            </div>
            <h1>
              Your night in
              <br />
              just got <em>better.</em>
            </h1>
            <p>
              Fresh dough, proper toppings and all the favourites — ready for
              delivery or collection.
            </p>

            <div className="hero-actions">
              <button
                className="primary-cta"
                onClick={() =>
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Order now
                <span aria-hidden="true">→</span>
              </button>
              <a className="secondary-cta" href="#popular">
                See what&apos;s popular
              </a>
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
                <span>local favourite</span>
              </div>
            </div>
          </div>

          <div className="order-card" id="menu">
            <span className="order-card-label">START YOUR ORDER</span>
            <h2>How do you want it?</h2>
            <p>Choose an option to see the menu and availability.</p>

            <div className="order-toggle" role="tablist" aria-label="Order type">
              <button
                className={orderType === "delivery" ? "active" : ""}
                onClick={() => setOrderType("delivery")}
              >
                <span className="toggle-icon">↗</span>
                <span>
                  <strong>Delivery</strong>
                  <small>To your door</small>
                </span>
              </button>
              <button
                className={orderType === "collection" ? "active" : ""}
                onClick={() => setOrderType("collection")}
              >
                <span className="toggle-icon">◎</span>
                <span>
                  <strong>Collection</strong>
                  <small>Pick it up</small>
                </span>
              </button>
            </div>

            {orderType === "delivery" ? (
              <div className="postcode-box">
                <label htmlFor="postcode">Enter your postcode</label>
                <div className="postcode-row">
                  <input id="postcode" placeholder="e.g. WF17 9EW" />
                  <button>Check</button>
                </div>
                <span>We&apos;ll confirm your delivery area before checkout.</span>
              </div>
            ) : (
              <div className="collection-box">
                <strong>Star Pizza Birstall</strong>
                <span>11 Low Lane, Birstall, WF17 9EW</span>
                <button
                  onClick={() =>
                    document.getElementById("popular")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Browse collection menu
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="category-wrap" aria-label="Menu categories">
        <div className="shell categories">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="popular-section" id="popular">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">CUSTOMER FAVOURITES</span>
              <h2>Popular right now</h2>
            </div>
            <a href="#menu">View full menu <span>→</span></a>
          </div>

          <div className="food-grid">
            {menuItems.map((item) => (
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
                  <button onClick={() => addToCart(item.id)}>
                    Add to order
                    <span className="plus">+</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-strip" id="story">
        <div className="shell story-layout">
          <div>
            <span className="kicker light">SINCE THE FAMILY TRADITION BEGAN</span>
            <h2>Fresh dough. Proper pizza. No shortcuts.</h2>
          </div>
          <p>
            Star Pizza is built around simple things done well: fresh dough,
            generous toppings and food prepared to order for Birstall.
          </p>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <a className="brand footer-brand" href="#">
            <BrandMark />
            <div>
              <strong>STAR PIZZA</strong>
              <span>BIRSTALL</span>
            </div>
          </a>
          <p>11 Low Lane, Birstall, West Yorkshire, WF17 9EW</p>
          <a href="tel:01924477755">01924 477755</a>
        </div>
      </footer>

      {cart.length > 0 && (
        <button className="mobile-cart-bar" onClick={() => setBasketOpen(true)}>
          <span>{cart.length} {cart.length === 1 ? "item" : "items"}</span>
          <strong>View basket</strong>
          <span>£{cartTotal.toFixed(2)}</span>
        </button>
      )}

      {basketOpen && (
        <div className="drawer-backdrop" onClick={() => setBasketOpen(false)}>
          <aside className="basket-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <span className="kicker">YOUR ORDER</span>
                <h2>Basket</h2>
              </div>
              <button className="close-button" onClick={() => setBasketOpen(false)}>
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <strong>Your basket is empty</strong>
                <span>Add something good from the menu.</span>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  {cartItems.map((item, index) => (
                    <div className="drawer-item" key={`${item.id}-${index}`}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>Regular</span>
                      </div>
                      <span>£{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="drawer-total">
                  <span>Subtotal</span>
                  <strong>£{cartTotal.toFixed(2)}</strong>
                </div>
                <button className="checkout-button">Continue to checkout</button>
                <small className="demo-note">Demo checkout — payments will be connected later.</small>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}