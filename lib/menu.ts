export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  badge?: string;
};

export const menuItems: MenuItem[] = [
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

export const offerItems: MenuItem[] = [
  {
    id: 101,
    name: "The Family Feast",
    description: '16" family pizza, garlic bread with tomato, 2 fries and a bottle.',
    price: 30,
    category: "Deals"
  },
  {
    id: 102,
    name: "The Duo Feast",
    description: 'Two 11" thin pizzas, 2 fries and a bottle.',
    price: 30,
    category: "Deals"
  },
  {
    id: 103,
    name: "The Mega Feast",
    description: 'Three 11" thin pizzas, 3 fries and a bottle.',
    price: 40,
    category: "Deals"
  },
  {
    id: 104,
    name: "The BALR$ Feast",
    description: 'Three 16" family pizzas, 3 sides and a bottle.',
    price: 65,
    category: "Deals"
  }
];

export const allItems = [...menuItems, ...offerItems];

export const menuCategories = [
  "Popular",
  "Pizzas",
  "Calzones",
  "Kebabs",
  "Burgers",
  "Chicken",
  "Sides",
  "Desserts",
  "Drinks"
];