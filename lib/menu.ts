export type MenuVariant = {
  label: string;
  price: number;
};


export type PizzaExtraTopping = {
  id: string;
  label: string;
  price: number;
};

export const pizzaExtraToppings: PizzaExtraTopping[] = [
  { id: "extra-cheese", label: "Extra cheese", price: 1.5 },
  { id: "pepperoni", label: "Pepperoni", price: 1.5 },
  { id: "chicken", label: "Chicken", price: 1.75 },
  { id: "donner", label: "Donner meat", price: 1.75 },
  { id: "spicy-beef", label: "Spicy beef", price: 1.75 },
  { id: "mushrooms", label: "Mushrooms", price: 1.2 },
  { id: "red-onion", label: "Red onion", price: 1.2 },
  { id: "mixed-peppers", label: "Mixed peppers", price: 1.2 },
  { id: "jalapenos", label: "Jalapeños", price: 1.2 },
  { id: "sweetcorn", label: "Sweetcorn", price: 1.2 },
  { id: "pineapple", label: "Pineapple", price: 1.2 },
  { id: "olives", label: "Olives", price: 1.2 }
];

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  badge?: string;
  variants?: MenuVariant[];
};

const pizzaImage1 =
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85";
const pizzaImage2 =
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1200&q=85";
const pizzaImage3 =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85";
const pizzaImage4 =
  "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=85";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita",
    description: "Pizza sauce & Italian herbs.",
    price: 9.8,
    category: "Pizzas",
    badge: "Classic",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 9.8 },
      { label: '11" Deep', price: 10.8 },
      { label: '16" Family', price: 16.25 }
    ]
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Pepperoni, peppers & Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    badge: "Popular",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 10.9 },
      { label: '11" Deep', price: 11.9 },
      { label: '16" Family', price: 16.9 }
    ]
  },
  {
    id: 3,
    name: "Hot Shot",
    description: "Pepperoni, fresh chilli, peppers, onions & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    badge: "Spicy",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 4,
    name: "Quattro Formaggi",
    description: "Combination of four different cheeses & Italian herbs.",
    price: 11.15,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 11.15 },
      { label: '11" Deep', price: 12.15 },
      { label: '16" Family', price: 17.15 }
    ]
  },
  {
    id: 5,
    name: "Smokey Joe's BBQ",
    description: "BBQ base, onions, spicy beef, chicken, peppers & Italian herbs.",
    price: 11.9,
    category: "Pizzas",
    badge: "BBQ",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.9 },
      { label: '11" Deep', price: 12.9 },
      { label: '16" Family', price: 17.9 }
    ]
  },
  {
    id: 6,
    name: "The Inferno",
    description: "Hot chilli tomato base, fresh chilli, pepperoni, onions, spicy beef & mushrooms.",
    price: 12.9,
    category: "Pizzas",
    badge: "Hot",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 12.9 },
      { label: '11" Deep', price: 13.9 },
      { label: '16" Family', price: 19.35 }
    ]
  }
];


export const upsellItems: MenuItem[] = [
  {
    id: 201,
    name: "Garlic Bread",
    description: '11" thin garlic bread.',
    price: 6.9,
    category: "Sides",
    badge: "Side"
  },
  {
    id: 202,
    name: "French Fries",
    description: "Regular portion of French fries.",
    price: 3.5,
    category: "Sides",
    badge: "Side"
  },
  {
    id: 203,
    name: "Coca-Cola",
    description: "Coca-Cola Original Taste 330ml.",
    price: 2.5,
    category: "Drinks",
    badge: "Drink"
  },
  {
    id: 204,
    name: "Chocolate Fudge Cake",
    description: "Italian chocolate fudge cake.",
    price: 4.5,
    category: "Desserts",
    badge: "Dessert"
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

export const allItems = [...menuItems, ...upsellItems, ...offerItems];

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