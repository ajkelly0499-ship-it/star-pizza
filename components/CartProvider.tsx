"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { allItems, type MenuItem } from "../lib/menu";

type StoredCartLine = {
  key: string;
  itemId: number;
  quantity: number;
  unitPrice: number;
  options: string[];
};

export type CartLine = {
  key: string;
  item: MenuItem;
  quantity: number;
  unitPrice: number;
  options: string[];
};

export type OrderType = "delivery" | "collection";
export type CartValidationStatus =
  | "idle"
  | "validating"
  | "valid"
  | "invalid"
  | "error";

export type CartValidationIssue = {
  clientLineKey: string;
  code: string;
  message: string;
};

type CartValidationResponse = {
  valid: boolean;
  subtotalPence: number;
  lines: Array<{
    clientLineKey: string;
    unitPricePence: number;
    lineTotalPence: number;
  }>;
  issues: CartValidationIssue[];
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  orderType: OrderType;
  validationStatus: CartValidationStatus;
  validationIssues: CartValidationIssue[];
  setOrderType: (type: OrderType) => void;
  addItem: (id: number) => void;
  addConfiguredItem: (
    id: number,
    unitPrice: number,
    options: string[],
    quantity?: number
  ) => void;
  increaseLine: (key: string) => void;
  decreaseLine: (key: string) => void;
  removeLine: (key: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeLineKey(itemId: number, unitPrice: number, options: string[]) {
  return [itemId, unitPrice.toFixed(2), ...options].join("::");
}

function isStoredCartLine(value: unknown): value is StoredCartLine {
  if (!value || typeof value !== "object") return false;

  const line = value as Partial<StoredCartLine>;

  return (
    typeof line.key === "string" &&
    typeof line.itemId === "number" &&
    typeof line.quantity === "number" &&
    line.quantity > 0 &&
    typeof line.unitPrice === "number" &&
    Array.isArray(line.options) &&
    line.options.every((option) => typeof option === "string")
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoredCartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderTypeState] = useState<OrderType>("delivery");
  const [hydrated, setHydrated] = useState(false);
  const [validationStatus, setValidationStatus] =
    useState<CartValidationStatus>("idle");
  const [validationIssues, setValidationIssues] = useState<CartValidationIssue[]>([]);
  const [validatedTotalPence, setValidatedTotalPence] = useState<number | null>(
    null
  );

  useEffect(() => {
    try {
      const savedOrderType = window.localStorage.getItem("star-pizza-order-type");
      if (savedOrderType === "delivery" || savedOrderType === "collection") {
        setOrderTypeState(savedOrderType);
      }

      const saved = window.localStorage.getItem("star-pizza-cart");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setCart(parsed.filter(isStoredCartLine));
        return;
      }

      if (parsed && typeof parsed === "object") {
        const migrated: StoredCartLine[] = Object.entries(parsed)
          .map(([id, quantity]) => {
            const item = allItems.find((entry) => entry.id === Number(id));
            if (!item || typeof quantity !== "number" || quantity <= 0) return null;

            return {
              key: makeLineKey(item.id, item.price, []),
              itemId: item.id,
              quantity,
              unitPrice: item.price,
              options: []
            };
          })
          .filter(Boolean) as StoredCartLine[];

        setCart(migrated);
      }
    } catch {
      setCart([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("star-pizza-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("star-pizza-order-type", orderType);
  }, [orderType, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    if (cart.length === 0) {
      setValidationStatus("valid");
      setValidationIssues([]);
      setValidatedTotalPence(0);
      return;
    }

    const controller = new AbortController();

    setValidationStatus("validating");
    setValidationIssues([]);
    setValidatedTotalPence(null);

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/cart/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            lines: cart.map((line) => ({
              clientLineKey: line.key,
              itemId: line.itemId,
              quantity: line.quantity,
              options: line.options
            }))
          }),
          signal: controller.signal
        });

        const result = (await response.json()) as CartValidationResponse;

        if (!response.ok && response.status !== 422) {
          throw new Error("Basket validation request failed.");
        }

        if (!result.valid) {
          setValidationStatus("invalid");
          setValidationIssues(result.issues ?? []);
          setValidatedTotalPence(null);
          return;
        }

        setValidationStatus("valid");
        setValidationIssues([]);
        setValidatedTotalPence(result.subtotalPence);

        const authoritativePrices = new Map(
          result.lines.map((line) => [
            line.clientLineKey,
            line.unitPricePence / 100
          ])
        );

        setCart((current) => {
          let changed = false;

          const next = current.map((line) => {
            const authoritativePrice = authoritativePrices.get(line.key);
            if (
              authoritativePrice === undefined ||
              Math.abs(authoritativePrice - line.unitPrice) < 0.0001
            ) {
              return line;
            }

            changed = true;
            return {
              ...line,
              unitPrice: authoritativePrice
            };
          });

          return changed ? next : current;
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Unable to validate basket", error);
        setValidationStatus("error");
        setValidationIssues([
          {
            clientLineKey: "",
            code: "VALIDATION_UNAVAILABLE",
            message: "We could not verify your basket. Please try again."
          }
        ]);
        setValidatedTotalPence(null);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [cart, hydrated]);

  const setOrderType = (type: OrderType) => {
    setOrderTypeState(type);
  };

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const item = allItems.find((entry) => entry.id === line.itemId);
          return item ? { ...line, item } : null;
        })
        .filter(Boolean) as CartLine[],
    [cart]
  );

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const localTotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );
  const total =
    validationStatus === "valid" && validatedTotalPence !== null
      ? validatedTotalPence / 100
      : localTotal;

  const addConfiguredItem = (
    id: number,
    unitPrice: number,
    options: string[],
    quantity = 1
  ) => {
    const key = makeLineKey(id, unitPrice, options);

    setCart((current) => {
      const existing = current.find((line) => line.key === key);

      if (existing) {
        return current.map((line) =>
          line.key === key
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }

      return [
        ...current,
        {
          key,
          itemId: id,
          quantity,
          unitPrice,
          options
        }
      ];
    });
  };

  const addItem = (id: number) => {
    const item = allItems.find((entry) => entry.id === id);
    if (!item) return;
    addConfiguredItem(id, item.price, [], 1);
  };

  const increaseLine = (key: string) =>
    setCart((current) =>
      current.map((line) =>
        line.key === key ? { ...line, quantity: line.quantity + 1 } : line
      )
    );

  const decreaseLine = (key: string) =>
    setCart((current) =>
      current
        .map((line) =>
          line.key === key ? { ...line, quantity: line.quantity - 1 } : line
        )
        .filter((line) => line.quantity > 0)
    );

  const removeLine = (key: string) =>
    setCart((current) => current.filter((line) => line.key !== key));

  return (
    <CartContext.Provider
      value={{
        lines,
        itemCount,
        total,
        isOpen,
        orderType,
        validationStatus,
        validationIssues,
        setOrderType,
        addItem,
        addConfiguredItem,
        increaseLine,
        decreaseLine,
        removeLine,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
