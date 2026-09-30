"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { allItems, type MenuItem } from "../lib/menu";

type CartLine = {
  item: MenuItem;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  addItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  removeItem: (id: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("star-pizza-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // Ignore invalid local storage data in the demo.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("star-pizza-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const item = allItems.find((entry) => entry.id === Number(id));
          return item && quantity > 0 ? { item, quantity } : null;
        })
        .filter(Boolean) as CartLine[],
    [cart]
  );

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  const addItem = (id: number) =>
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

  const decreaseItem = (id: number) =>
    setCart((current) => {
      const next = { ...current };
      if ((next[id] ?? 0) <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });

  const removeItem = (id: number) =>
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

  return (
    <CartContext.Provider
      value={{
        lines,
        itemCount,
        total,
        isOpen,
        addItem,
        decreaseItem,
        removeItem,
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