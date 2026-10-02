"use client";

import { useMemo, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import { useCart } from "../../components/CartProvider";
import {
  buildYourOwnToppings,
  burgerIncludedToppings,
  burgerItems,
  burgerToppingOptions,
  calzoneItems,
  kebabDips,
  kebabItems,
  menuCategories,
  menuItems,
  pizzaExtraToppings,
  type MenuItem
} from "../../lib/menu";

export default function MenuPage() {
  const [category, setCategory] = useState("Popular");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [notes, setNotes] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedBuildToppings, setSelectedBuildToppings] = useState<string[]>([]);
  const [selectedKebabDips, setSelectedKebabDips] = useState<string[]>([]);
  const [kebabSalad, setKebabSalad] = useState<"standard" | "none">("standard");
  const [removedBurgerToppings, setRemovedBurgerToppings] = useState<string[]>([]);
  const [doubledBurgerToppings, setDoubledBurgerToppings] = useState<string[]>([]);
  const [addedBurgerToppings, setAddedBurgerToppings] = useState<string[]>([]);
  const [halfOne, setHalfOne] = useState("");
  const [halfTwo, setHalfTwo] = useState("");
  const [quantity, setQuantity] = useState(1);

  const {
    addConfiguredItem,
    removeLine,
    openCart,
    itemCount,
    total,
    lines,
    orderType,
    setOrderType
  } = useCart();


  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const catalogue = [...menuItems, ...calzoneItems, ...kebabItems, ...burgerItems];

    if (query) {
      return catalogue.filter((item) =>
        [item.name, item.description, item.category]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (category === "Popular") return menuItems.filter((item) => item.featured);
    if (category === "Pizzas") return menuItems;
    if (category === "Calzones") return calzoneItems;
    if (category === "Kebabs") return kebabItems;
    if (category === "Burgers") return burgerItems;
    return [];
  }, [category, search]);

  const openProduct = (item: MenuItem) => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches) {
      window.scrollTo(0, 0);
    }

    setSelectedItem(item);
    setSelectedVariant(0);
    setNotes("");
    setSelectedToppings([]);
    setSelectedBuildToppings([]);
    setSelectedKebabDips([]);
    setKebabSalad("standard");
    setRemovedBurgerToppings([]);
    setDoubledBurgerToppings([]);
    setAddedBurgerToppings([]);
    setHalfOne("");
    setHalfTwo("");
    setQuantity(1);
  };

  const closeProduct = () => {
    setSelectedItem(null);
    setNotes("");
    setSelectedToppings([]);
    setSelectedBuildToppings([]);
    setSelectedKebabDips([]);
    setKebabSalad("standard");
    setRemovedBurgerToppings([]);
    setDoubledBurgerToppings([]);
    setAddedBurgerToppings([]);
    setHalfOne("");
    setHalfTwo("");
    setQuantity(1);
  };

  const chosenVariant = selectedItem?.variants?.[selectedVariant];
  const baseUnitPrice = chosenVariant?.price ?? selectedItem?.price ?? 0;
  const isDiyPizza = selectedItem?.name === "DIY Pizza";
  const isDiyCalzone = selectedItem?.name === "DIY Calzone";
  const isBuildYourOwn = isDiyPizza || isDiyCalzone;
  const buildToppingLimit = isDiyPizza ? 4 : isDiyCalzone ? 3 : 0;
  const isHalfAndHalf = selectedItem?.name === "Half and Half";
  const isSpecialPizza = isDiyPizza || isHalfAndHalf;
  const isKebab = selectedItem?.category === "Kebabs";
  const isBurger = selectedItem?.category === "Burgers";
  const includedBurgerToppings =
    isBurger && selectedItem ? burgerIncludedToppings[selectedItem.id] ?? [] : [];
  const burgerAvailableExtras = burgerToppingOptions.filter(
    (topping) => topping.standard !== false && !includedBurgerToppings.includes(topping.label)
  );
  const hasKebabSalad =
    isKebab &&
    Boolean(
      selectedItem?.description.toLowerCase().includes("salad") ||
      selectedItem?.description.toLowerCase().includes("lettuce")
    );

  const toppingTotal = pizzaExtraToppings
    .filter((topping) => selectedToppings.includes(topping.id))
    .reduce((sum, topping) => sum + topping.price, 0);

  const kebabDipTotal = kebabDips
    .filter((dip) => selectedKebabDips.includes(dip.id))
    .reduce((sum, dip) => sum + dip.price, 0);

  const burgerDoubleTotal = doubledBurgerToppings.reduce((sum, label) => {
    const topping = burgerToppingOptions.find((option) => option.label === label);
    return sum + (topping?.price ?? 0);
  }, 0);

  const burgerExtraTotal = burgerToppingOptions
    .filter((topping) => addedBurgerToppings.includes(topping.id))
    .reduce((sum, topping) => sum + topping.price, 0);

  const unitPrice =
    baseUnitPrice + toppingTotal + kebabDipTotal + burgerDoubleTotal + burgerExtraTotal;
  const modalTotal = unitPrice * quantity;

  const halfPizzaChoices = menuItems.filter(
    (item) =>
      item.category === "Pizzas" &&
      item.name !== "Half and Half" &&
      item.name !== "DIY Pizza"
  );

  const halfSelectionCount = [halfOne, halfTwo].filter(Boolean).length;

  const configurationComplete =
    !selectedItem ||
    (isBuildYourOwn
      ? selectedBuildToppings.length === buildToppingLimit
      : isHalfAndHalf
        ? Boolean(halfOne && halfTwo && halfOne !== halfTwo)
        : true);

  const toggleTopping = (id: string) => {
    setSelectedToppings((current) => {
      if (current.includes(id)) {
        return current.filter((toppingId) => toppingId !== id);
      }

      if (current.length >= 6) return current;
      return [...current, id];
    });
  };

  const toggleBuildTopping = (label: string) => {
    setSelectedBuildToppings((current) => {
      if (current.includes(label)) {
        return current.filter((item) => item !== label);
      }

      if (current.length >= buildToppingLimit) return current;
      return [...current, label];
    });
  };

  const toggleKebabDip = (id: string) => {
    setSelectedKebabDips((current) =>
      current.includes(id)
        ? current.filter((dipId) => dipId !== id)
        : [...current, id]
    );
  };

  const setBurgerToppingChoice = (
    label: string,
    choice: "keep" | "remove" | "double"
  ) => {
    if (choice === "keep") {
      setRemovedBurgerToppings((current) => current.filter((item) => item !== label));
      setDoubledBurgerToppings((current) => current.filter((item) => item !== label));
      return;
    }

    if (choice === "remove") {
      setRemovedBurgerToppings((current) =>
        current.includes(label) ? current : [...current, label]
      );
      setDoubledBurgerToppings((current) => current.filter((item) => item !== label));
      return;
    }

    setDoubledBurgerToppings((current) =>
      current.includes(label) ? current : [...current, label]
    );
    setRemovedBurgerToppings((current) => current.filter((item) => item !== label));
  };

  const toggleBurgerExtra = (id: string) => {
    setAddedBurgerToppings((current) =>
      current.includes(id)
        ? current.filter((toppingId) => toppingId !== id)
        : [...current, id]
    );
  };

  const addConfiguredProduct = () => {
    if (!selectedItem) return;

    if (!configurationComplete) return;

    const selectedToppingObjects = pizzaExtraToppings.filter((topping) =>
      selectedToppings.includes(topping.id)
    );

    const includedBuildOptions = isBuildYourOwn
      ? [`Chosen toppings: ${selectedBuildToppings.join(", ")}`]
      : [];

    const extraToppingOptions = selectedToppingObjects.map(
      (topping) => `Extra: ${topping.label} (+£${topping.price.toFixed(2)})`
    );

    const halfOptions = isHalfAndHalf
      ? [
          `Half 1: ${halfOne}`,
          `Half 2: ${halfTwo}`
        ]
      : [];

    const kebabOptions = isKebab
      ? [
          ...(hasKebabSalad && kebabSalad === "none" ? ["No salad"] : []),
          ...kebabDips
            .filter((dip) => selectedKebabDips.includes(dip.id))
            .map((dip) => `Dip: ${dip.label} (+£${dip.price.toFixed(2)})`)
        ]
      : [];

    const burgerOptions = isBurger
      ? [
          ...removedBurgerToppings.map((label) => `No ${label}`),
          ...doubledBurgerToppings.map((label) => {
            const topping = burgerToppingOptions.find((option) => option.label === label);
            return topping && topping.price > 0
              ? `Double ${label} (+£${topping.price.toFixed(2)})`
              : `Double ${label}`;
          }),
          ...burgerToppingOptions
            .filter((topping) => addedBurgerToppings.includes(topping.id))
            .map((topping) =>
              topping.price > 0
                ? `Add ${topping.label} (+£${topping.price.toFixed(2)})`
                : `Add ${topping.label}`
            )
        ]
      : [];

    const options = [
      ...(chosenVariant ? [chosenVariant.label] : []),
      ...halfOptions,
      ...includedBuildOptions,
      ...extraToppingOptions,
      ...kebabOptions,
      ...burgerOptions,
      ...(notes.trim() ? [`Note: ${notes.trim()}`] : [])
    ];

    addConfiguredItem(selectedItem.id, unitPrice, options, quantity);
    closeProduct();
  };

  return (
    <main className={selectedItem ? "inner-page product-open" : "inner-page"}>
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
                {!search && category === "Burgers" && (
                  <p className="menu-category-note">
                    All burgers are served in a toasted seeded brioche bun with crispy lettuce, red onions & fries.
                  </p>
                )}
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
                        <strong>{item.variants ? "from " : ""}£{item.price.toFixed(2)}</strong>
                      </div>

                      <p>{item.description}</p>

                      <button className="choose-options-button" onClick={() => openProduct(item)}>
                        <span>
                          {item.variants
                            ? "Choose size"
                            : item.category === "Calzones" || item.category === "Kebabs" || item.category === "Burgers"
                              ? "Customise"
                              : "Add to order"}
                        </span>
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
                    <div className="menu-basket-preview-line" key={line.key}>
                      <div>
                        <span>{line.quantity} × {line.item.name}</span>
                        {line.options.length > 0 && (
                          <div className="menu-basket-option-list">
                            {line.options.map((option) => (
                              <small
                                key={option}
                                className={option.startsWith("Note:") ? "menu-basket-note" : ""}
                              >
                                {option.replace(/^Extra:\s*/, "")}
                              </small>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <strong>£{(line.unitPrice * line.quantity).toFixed(2)}</strong>
                        <button
                          onClick={() => removeLine(line.key)}
                          aria-label={`Remove ${line.item.name} from basket`}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
                          </svg>
                        </button>
                      </div>
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
              {itemCount === 0 ? "Basket is empty" : `Checkout · £${total.toFixed(2)}`}
            </button>

            {itemCount > 0 && (
              <button className="menu-basket-edit" onClick={openCart}>
                View / edit basket
              </button>
            )}
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

              {isBuildYourOwn && (
                <div className="product-option-group product-option-group--required">
                  <div className="product-option-heading">
                    <div>
                      <strong>Choose your {buildToppingLimit} toppings</strong>
                      <span>Required · included in the price</span>
                    </div>
                    <small>{selectedBuildToppings.length}/{buildToppingLimit} selected</small>
                  </div>

                  <p className="product-option-helper">
                    Pick exactly {buildToppingLimit} toppings to build your {selectedItem.name}.
                  </p>

                  <div className="pizza-topping-grid">
                    {buildYourOwnToppings.map((topping) => {
                      const selected = selectedBuildToppings.includes(topping);
                      const disabled =
                        !selected && selectedBuildToppings.length >= buildToppingLimit;

                      return (
                        <button
                          type="button"
                          key={topping}
                          className={selected ? "selected" : ""}
                          disabled={disabled}
                          onClick={() => toggleBuildTopping(topping)}
                        >
                          <span>
                            <span className="topping-check">{selected ? "✓" : "+"}</span>
                            <strong>{topping}</strong>
                          </span>
                          <span>Included</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isHalfAndHalf && (
                <div className="product-option-group product-option-group--required">
                  <div className="product-option-heading">
                    <div>
                      <strong>Choose your two halves</strong>
                      <span>Required</span>
                    </div>
                    <small>{halfSelectionCount}/2 selected</small>
                  </div>

                  <p className="product-option-helper">
                    Pick two different pizza flavours. Both halves use the size selected above.
                  </p>

                  <div className="half-pizza-selectors">
                    <label>
                      First half
                      <select
                        value={halfOne}
                        onChange={(event) => setHalfOne(event.target.value)}
                      >
                        <option value="">Choose first pizza</option>
                        {halfPizzaChoices
                          .filter((pizza) => pizza.name !== halfTwo)
                          .map((pizza) => (
                            <option key={pizza.id} value={pizza.name}>
                              {pizza.name}
                            </option>
                          ))}
                      </select>
                    </label>

                    <label>
                      Second half
                      <select
                        value={halfTwo}
                        onChange={(event) => setHalfTwo(event.target.value)}
                      >
                        <option value="">Choose second pizza</option>
                        {halfPizzaChoices
                          .filter((pizza) => pizza.name !== halfOne)
                          .map((pizza) => (
                            <option key={pizza.id} value={pizza.name}>
                              {pizza.name}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>

                  {halfOne && halfTwo && (
                    <div className="half-pizza-summary">
                      <span>{halfOne}</span>
                      <strong>½ + ½</strong>
                      <span>{halfTwo}</span>
                    </div>
                  )}
                </div>
              )}

              {((selectedItem.category === "Pizzas" && !isHalfAndHalf) ||
                selectedItem.category === "Calzones") && (
                <div className="product-option-group">
                  <div className="product-option-heading">
                    <div>
                      <strong>
                        {selectedItem.category === "Calzones"
                          ? "Add extra fillings"
                          : "Add extra toppings"}
                      </strong>
                      <span>Optional</span>
                    </div>
                    <small>{selectedToppings.length}/6 selected</small>
                  </div>

                  <p className="product-option-helper">
                    {selectedItem.category === "Calzones"
                      ? "Add extra fillings inside your calzone. Prices below are demo prices for the prototype."
                      : "Add any extras you fancy. Prices below are demo prices for the prototype."}
                  </p>

                  <div className="pizza-topping-grid">
                    {pizzaExtraToppings.map((topping) => {
                      const selected = selectedToppings.includes(topping.id);
                      const disabled = !selected && selectedToppings.length >= 6;

                      return (
                        <button
                          type="button"
                          key={topping.id}
                          className={selected ? "selected" : ""}
                          disabled={disabled}
                          onClick={() => toggleTopping(topping.id)}
                        >
                          <span>
                            <span className="topping-check">{selected ? "✓" : "+"}</span>
                            <strong>{topping.label}</strong>
                          </span>
                          <span>+£{topping.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isKebab && (
                <>
                  {hasKebabSalad && (
                    <div className="product-option-group">
                      <div className="product-option-heading">
                        <div>
                          <strong>Salad</strong>
                          <span>Included</span>
                        </div>
                        <small>Choose 1</small>
                      </div>

                      <div className="kebab-choice-grid">
                        <button
                          type="button"
                          className={kebabSalad === "standard" ? "selected" : ""}
                          onClick={() => setKebabSalad("standard")}
                        >
                          <span className="topping-check">
                            {kebabSalad === "standard" ? "✓" : ""}
                          </span>
                          <span>
                            <strong>As served</strong>
                            <small>Keep the salad listed with this kebab.</small>
                          </span>
                        </button>

                        <button
                          type="button"
                          className={kebabSalad === "none" ? "selected" : ""}
                          onClick={() => setKebabSalad("none")}
                        >
                          <span className="topping-check">
                            {kebabSalad === "none" ? "✓" : ""}
                          </span>
                          <span>
                            <strong>No salad</strong>
                            <small>Leave the salad off.</small>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="product-option-group">
                    <div className="product-option-heading">
                      <div>
                        <strong>Add a dip</strong>
                        <span>Optional</span>
                      </div>
                      <small>{selectedKebabDips.length} selected</small>
                    </div>

                    <p className="product-option-helper">
                      Add any published Star Pizza dip for £1.20 each.
                    </p>

                    <div className="pizza-topping-grid">
                      {kebabDips.map((dip) => {
                        const selected = selectedKebabDips.includes(dip.id);

                        return (
                          <button
                            type="button"
                            key={dip.id}
                            className={selected ? "selected" : ""}
                            onClick={() => toggleKebabDip(dip.id)}
                          >
                            <span>
                              <span className="topping-check">{selected ? "✓" : "+"}</span>
                              <strong>{dip.label}</strong>
                            </span>
                            <span>+£{dip.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {isBurger && (
                <>
                  <div className="product-option-group">
                    <div className="product-option-heading">
                      <div>
                        <strong>Make it yours</strong>
                        <span>Included toppings</span>
                      </div>
                      <small>Keep, remove or double</small>
                    </div>

                    <p className="product-option-helper">
                      Every burger comes with crispy lettuce and red onions, plus the toppings listed for this burger.
                    </p>

                    <div className="burger-topping-list">
                      {includedBurgerToppings.map((label) => {
                        const isRemoved = removedBurgerToppings.includes(label);
                        const isDoubled = doubledBurgerToppings.includes(label);
                        const topping = burgerToppingOptions.find((option) => option.label === label);

                        return (
                          <div className="burger-topping-row" key={label}>
                            <div>
                              <strong>{label}</strong>
                              {topping && topping.price > 0 && (
                                <small>Double +£{topping.price.toFixed(2)}</small>
                              )}
                            </div>

                            <div className="burger-topping-actions">
                              <button
                                type="button"
                                className={!isRemoved && !isDoubled ? "active" : ""}
                                onClick={() => setBurgerToppingChoice(label, "keep")}
                              >
                                Keep
                              </button>
                              <button
                                type="button"
                                className={isRemoved ? "active" : ""}
                                onClick={() => setBurgerToppingChoice(label, "remove")}
                              >
                                Remove
                              </button>
                              <button
                                type="button"
                                className={isDoubled ? "active" : ""}
                                onClick={() => setBurgerToppingChoice(label, "double")}
                              >
                                Double
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="product-option-group">
                    <div className="product-option-heading">
                      <div>
                        <strong>Add extra toppings</strong>
                        <span>Optional</span>
                      </div>
                      <small>{addedBurgerToppings.length} selected</small>
                    </div>

                    <p className="product-option-helper">
                      Add classic burger extras. Extra topping prices are placeholder demo prices for this prototype.
                    </p>

                    <div className="pizza-topping-grid burger-extra-grid">
                      {burgerAvailableExtras.map((topping) => {
                        const selected = addedBurgerToppings.includes(topping.id);

                        return (
                          <button
                            type="button"
                            key={topping.id}
                            className={selected ? "selected" : ""}
                            onClick={() => toggleBurgerExtra(topping.id)}
                          >
                            <span>
                              <span className="topping-check">{selected ? "✓" : "+"}</span>
                              <strong>{topping.label}</strong>
                            </span>
                            <span>
                              {topping.price > 0 ? `+£${topping.price.toFixed(2)}` : "Free"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
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

                <button
                  className="modal-add-button"
                  onClick={addConfiguredProduct}
                  disabled={!configurationComplete}
                >
                  <span>
                    {!configurationComplete
                      ? isBuildYourOwn
                        ? `Choose ${buildToppingLimit - selectedBuildToppings.length} more topping${buildToppingLimit - selectedBuildToppings.length === 1 ? "" : "s"}`
                        : `Choose ${2 - halfSelectionCount} more half${2 - halfSelectionCount === 1 ? "" : "s"}`
                      : "Add to basket"}
                  </span>
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