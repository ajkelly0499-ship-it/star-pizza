"use client";

import { useMemo, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";
import { menuCategories, menuItems, type MenuItem } from "../../lib/menu";

export default function MenuPage() {
  const [category, setCategory] = useState("Popular");
  const [orderType, setOrderType] = useState<"delivery" | "collection">("delivery");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const {
    addConfiguredItem,
    openCart,
    itemCount,
    total,
    lines
  } = useCart();

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query) {
      return menuItems.filter((item) =>
        [item.name, item.description, item.category]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (category === "Popular" || category === "Pizzas") return menuItems;
    return [];
  }, [category, search]);

  const openProduct = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedVariant(0);
    setNotes("");
    setQuantity(1);
  };

  const closeProduct = () => {
    setSelectedItem(null);
    setNotes("");
    setQuantity(1);
  };

  const chosenVariant = selectedItem?.variants?.[selectedVariant];
  const unitPrice = chosenVariant?.price ?? selectedItem?.price ?? 0;
  const modalTotal = unitPrice * quantity;

  const addConfiguredProduct = () => {
    if (!selectedItem) return;

    const options = [
      ...(chosenVariant ? [chosenVariant.label] : []),
      ...(notes.trim() ? [`Note: ${notes.trim()}`] : [])
    ];

    addConfiguredItem(selectedItem.id, unitPrice, options, quantity);
    closeProduct();
  };

  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="menu-compact-hero">
        <div className="shell menu-compact-hero-inner">
          <div className="menu-compact-copy">
            <span className="page-eyebrow">ORDER ONLINE</span>
            <h1>What are you hungry for?</h1>
            <p>Browse the menu, choose your size and build your order.</p>
          </div>

          <div className="menu-order-type menu-order-type--compact">
            <span>Order type</span>
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
                ? "We’ll confirm your postcode at checkout."
                : "Collect from 11 Low Lane, Birstall."}
            </small>
          </div>
        </div>
      </section>

      <section className="menu-category-bar menu-category-bar--with-search">
        <div className="shell menu-nav-row">
          <div className="menu-category-scroll">
            {menuCategories.map((item) => (
              <button
                key={item}
                className={!search && category === item ? "active" : ""}
                onClick={() => {
                  setCategory(item);
                  setSearch("");
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="menu-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 21-4.3-4.3m2.3-5.2A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search menu"
              aria-label="Search menu"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </label>
        </div>
      </section>

      <section className="menu-page-content menu-page-content--ordering">
        <div className="shell menu-ordering-layout">
          <div className="menu-results">
            <div className="menu-heading-row">
              <div>
                <span className="kicker">
                  {search ? "SEARCH RESULTS" : category === "Popular" ? "CUSTOMER FAVOURITES" : "MENU"}
                </span>
                <h2>{search ? `Results for “${search}”` : category}</h2>
              </div>
              <span className="menu-result-count">
                {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            {visibleItems.length > 0 ? (
              <div className="compact-menu-grid">
                {visibleItems.map((item) => (
                  <article className="compact-menu-card" key={item.id}>
                    <button
                      className="compact-menu-image"
                      onClick={() => openProduct(item)}
                      aria-label={`Choose ${item.name}`}
                    >
                      <img src={item.image} alt="" />
                      {item.badge && <span>{item.badge}</span>}
                    </button>

                    <div className="compact-menu-copy">
                      <div className="compact-menu-title-row">
                        <h3>{item.name}</h3>
                        <strong>from £{item.price.toFixed(2)}</strong>
                      </div>

                      <p>{item.description}</p>

                      <button className="choose-options-button" onClick={() => openProduct(item)}>
                        <span>{item.variants ? "Choose size" : "Add to order"}</span>
                        <span className="choose-options-plus">+</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="menu-empty-state menu-empty-state--compact">
                <span className="kicker">
                  {search ? "NO MATCHES" : "FULL MENU IMPORT NEXT"}
                </span>
                <h3>
                  {search ? "Try another search." : `${category} will live here.`}
                </h3>
                <p>
                  {search
                    ? "Search for a pizza name or ingredient."
                    : "The ordering layout is ready. We’ll populate this category with the real Star Pizza menu next."}
                </p>
                {!search && (
                  <button onClick={() => setCategory("Pizzas")}>View pizzas</button>
                )}
              </div>
            )}
          </div>

          <aside className="menu-basket-summary">
            <div className="menu-basket-summary-head">
              <div>
                <span className="kicker">YOUR ORDER</span>
                <h3>Basket</h3>
              </div>
              <span>{itemCount}</span>
            </div>

            {lines.length === 0 ? (
              <div className="menu-basket-empty">
                <div className="menu-basket-icon">+</div>
                <strong>Your basket is empty</strong>
                <p>Choose something from the menu and it’ll appear here.</p>
              </div>
            ) : (
              <>
                <div className="menu-basket-lines">
                  {lines.slice(0, 4).map((line) => (
                    <div key={line.key}>
                      <span>{line.quantity} × {line.item.name}</span>
                      <strong>£{(line.unitPrice * line.quantity).toFixed(2)}</strong>
                    </div>
                  ))}
                  {lines.length > 4 && (
                    <small>+ {lines.length - 4} more {lines.length - 4 === 1 ? "item" : "items"}</small>
                  )}
                </div>

                <div className="menu-basket-total">
                  <span>Subtotal</span>
                  <strong>£{total.toFixed(2)}</strong>
                </div>
              </>
            )}

            <button
              className="menu-basket-button"
              onClick={openCart}
              disabled={itemCount === 0}
            >
              {itemCount === 0 ? "Basket is empty" : "View basket"}
            </button>
          </aside>
        </div>
      </section>

      {selectedItem && (
        <div className="product-modal-backdrop" onClick={closeProduct}>
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Customise ${selectedItem.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="product-modal-close" onClick={closeProduct} aria-label="Close">
              ×
            </button>

            <div className="product-modal-image">
              <img src={selectedItem.image} alt={selectedItem.name} />
            </div>

            <div className="product-modal-content">
              <span className="kicker">CUSTOMISE YOUR ORDER</span>
              <h2>{selectedItem.name}</h2>
              <p className="product-modal-description">{selectedItem.description}</p>

              {selectedItem.variants && (
                <div className="product-option-group">
                  <div className="product-option-heading">
                    <div>
                      <strong>Choose your size</strong>
                      <span>Required</span>
                    </div>
                    <small>Choose 1</small>
                  </div>

                  <div className="product-variant-list">
                    {selectedItem.variants.map((variant, index) => (
                      <label
                        className={selectedVariant === index ? "selected" : ""}
                        key={variant.label}
                      >
                        <span>
                          <input
                            type="radio"
                            name="pizza-size"
                            checked={selectedVariant === index}
                            onChange={() => setSelectedVariant(index)}
                          />
                          <strong>{variant.label}</strong>
                        </span>
                        <span>£{variant.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="product-option-group">
                <div className="product-option-heading">
                  <div>
                    <strong>Special instructions</strong>
                    <span>Optional</span>
                  </div>
                </div>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Anything the kitchen should know?"
                  maxLength={120}
                />
                <small className="product-note-count">{notes.length}/120</small>
              </div>

              <div className="product-modal-footer">
                <div className="modal-quantity">
                  <button
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    onClick={() => setQuantity((current) => current + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button className="modal-add-button" onClick={addConfiguredProduct}>
                  <span>Add to basket</span>
                  <strong>£{modalTotal.toFixed(2)}</strong>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}