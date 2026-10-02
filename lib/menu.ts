export type MenuVariant = {
  label: string;
  price: number;
};


export type PizzaExtraTopping = {
  id: string;
  label: string;
  price: number;
};

export const buildYourOwnToppings = [
  "Extra cheese",
  "Pepperoni",
  "Chicken",
  "Chicken tikka",
  "Doner meat",
  "Spicy beef",
  "Turkey ham",
  "Salami",
  "Garlic sausage",
  "Bacon",
  "Mushrooms",
  "Red onion",
  "Mixed peppers",
  "Jalapeños",
  "Sweetcorn",
  "Pineapple",
  "Olives",
  "Tuna"
];

export const kebabDips = [
  { id: "bbq", label: "BBQ", price: 1.2 },
  { id: "chilli", label: "Chilli", price: 1.2 },
  { id: "garlic-mayo", label: "Garlic mayo", price: 1.2 },
  { id: "ketchup", label: "Ketchup", price: 1.2 },
  { id: "mayo", label: "Mayo", price: 1.2 },
  { id: "mint", label: "Mint sauce", price: 1.2 },
  { id: "sweet-chilli", label: "Sweet chilli", price: 1.2 }
];

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
  featured?: boolean;
  variants?: MenuVariant[];
};

export type BurgerToppingOption = {
  id: string;
  label: string;
  price: number;
  standard?: boolean;
};

export const burgerToppingOptions: BurgerToppingOption[] = [
  { id: "lettuce", label: "Crispy lettuce", price: 0 },
  { id: "red-onion", label: "Red onions", price: 0 },
  { id: "tomato", label: "Tomato", price: 0.5 },
  { id: "pickles", label: "Pickles", price: 0.5 },
  { id: "jalapenos", label: "Jalapeños", price: 0.7 },
  { id: "cheese-slice", label: "Cheese slice", price: 1 },
  { id: "mozzarella", label: "Mozzarella cheese", price: 1.2 },
  { id: "cheddar", label: "Cheddar cheese", price: 1.2 },
  { id: "pepperoni", label: "Pepperoni", price: 1.2 },
  { id: "bacon", label: "Bacon", price: 1.5 },
  { id: "hash-brown", label: "Hash brown", price: 1.2 },
  { id: "onion-rings", label: "Onion rings", price: 1.2 },
  { id: "fried-onions", label: "Fried onions", price: 0.8 },
  { id: "mushrooms", label: "Mushrooms", price: 0.8 },
  { id: "pineapple", label: "Pineapple", price: 0.8 },
  { id: "mayo", label: "Mayo", price: 0 },
  { id: "ketchup", label: "Ketchup", price: 0 },
  { id: "burger-sauce", label: "Burger sauce", price: 0 },
  { id: "garlic-mayo", label: "Garlic mayo", price: 0 },
  { id: "bbq-sauce", label: "BBQ sauce", price: 0 },
  { id: "hot-chilli", label: "Hot chilli sauce", price: 0 },
  { id: "sweet-chilli", label: "Sweet chilli sauce", price: 0 },
  { id: "mozzarella-sticks", label: "Mozzarella sticks", price: 1.5, standard: false },
  { id: "nachos", label: "Nachos", price: 0.8, standard: false },
  { id: "salsa", label: "Salsa", price: 0.5, standard: false },
  { id: "chilli-con-carne", label: "Chilli con carne", price: 1.5, standard: false },
  { id: "garlic-butter", label: "Garlic butter", price: 0.5, standard: false },
  { id: "caramelised-onions", label: "Caramelised onions", price: 0.8, standard: false },
  { id: "fried-egg", label: "Fried egg", price: 1.2, standard: false },
  { id: "thousand-island", label: "1000 Island sauce", price: 0, standard: false },
  { id: "star-special-sauce", label: "Star special sauce", price: 0, standard: false }
];

export const burgerIncludedToppings: Record<number, string[]> = {
  70: ["Crispy lettuce", "Red onions", "Hot chilli sauce", "Mozzarella cheese", "Garlic mayo"],
  71: ["Crispy lettuce", "Red onions", "Mozzarella cheese", "Pepperoni"],
  72: ["Crispy lettuce", "Red onions", "Mozzarella sticks", "Mozzarella cheese"],
  73: ["Crispy lettuce", "Red onions", "Onion rings", "Mozzarella cheese"],
  74: ["Crispy lettuce", "Red onions", "Cheese slice"],
  75: ["Crispy lettuce", "Red onions", "Mayo", "Cheese slice"],
  76: ["Crispy lettuce", "Red onions", "Mozzarella cheese", "Hash brown", "Burger sauce"],
  77: ["Crispy lettuce", "Red onions"],
  78: ["Crispy lettuce", "Red onions", "Chilli con carne"],
  79: ["Crispy lettuce", "Red onions", "Pineapple", "Cheddar cheese"],
  80: ["Crispy lettuce", "Red onions", "Mozzarella cheese", "Nachos", "Salsa", "Jalapeños"],
  81: ["Crispy lettuce", "Red onions", "Fried onions", "Mushrooms"],
  82: ["Crispy lettuce", "Red onions", "Garlic butter"],
  83: ["Crispy lettuce", "Red onions", "Mushrooms", "Mozzarella cheese", "Sweet chilli sauce"],
  84: ["Crispy lettuce", "Red onions"],
  85: ["Crispy lettuce", "Red onions", "Cheddar cheese", "Caramelised onions", "Bacon", "Fried egg", "Burger sauce"],
  86: ["Crispy lettuce", "Red onions"],
  87: ["Crispy lettuce", "Red onions", "Cheese slice"],
  88: ["Crispy lettuce", "Red onions", "Fried onions", "Mushrooms"],
  89: ["Crispy lettuce", "Red onions", "Mozzarella cheese", "1000 Island sauce"],
  90: ["Crispy lettuce", "Red onions", "Pepperoni", "Jalapeños", "Mozzarella cheese", "Star special sauce"],
  91: ["Crispy lettuce", "Red onions", "Cheese slice"]
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
    id: 7,
    name: "Tropicana",
    description: "Turkey ham, pineapple & Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 10.9 },
      { label: '11" Deep', price: 11.9 },
      { label: '16" Family', price: 16.9 }
    ]
  },
  {
    id: 8,
    name: "DIY Pizza",
    description: "Any 4 toppings of your choice.",
    price: 11.9,
    category: "Pizzas",
    badge: "Build your own",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.9 },
      { label: '11" Deep', price: 12.9 },
      { label: '16" Family', price: 17.9 }
    ]
  },
  {
    id: 9,
    name: "Tuna & Sweetcorn",
    description: "Tuna, sweetcorn & Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 10.9 },
      { label: '11" Deep', price: 11.9 },
      { label: '16" Family', price: 16.9 }
    ]
  },
  {
    id: 10,
    name: "Salami",
    description: "Salami & Italian herbs.",
    price: 10.35,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 10.35 },
      { label: '11" Deep', price: 11.35 },
      { label: '16" Family', price: 16.35 }
    ]
  },
  {
    id: 11,
    name: "Chicken Tikka",
    description: "Chicken tikka, onion, green peppers & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage1,
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
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.15 },
      { label: '11" Deep', price: 12.15 },
      { label: '16" Family', price: 17.15 }
    ]
  },
  {
    id: 12,
    name: "Spicy Beef",
    description: "Spicy beef & Italian herbs.",
    price: 10.35,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 10.35 },
      { label: '11" Deep', price: 11.35 },
      { label: '16" Family', price: 16.35 }
    ]
  },
  {
    id: 6,
    name: "The Inferno",
    description: "Hot chilli tomato sauce base, fresh chilli, pepperoni, onions, spicy beef, mushrooms & Italian herbs.",
    price: 12.9,
    category: "Pizzas",
    badge: "Hot",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 12.9 },
      { label: '11" Deep', price: 13.9 },
      { label: '16" Family', price: 19.35 }
    ]
  },
  {
    id: 13,
    name: "Chilli",
    description: "Chilli con carne & Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 10.9 },
      { label: '11" Deep', price: 11.9 },
      { label: '16" Family', price: 16.9 }
    ]
  },
  {
    id: 14,
    name: "Vegetarian",
    description: "Peppers, onions, mushrooms, sweetcorn, olives & Italian herbs.",
    price: 11.15,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.15 },
      { label: '11" Deep', price: 12.15 },
      { label: '16" Family', price: 17.15 }
    ]
  },
  {
    id: 15,
    name: "Garlic Margherita",
    description: "Garlic margherita.",
    price: 9.9,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 9.9 },
      { label: '11" Deep', price: 10.9 },
      { label: '16" Family', price: 16.35 }
    ]
  },
  {
    id: 16,
    name: "Toscana",
    description: "Turkey ham, mushrooms, peppers, onions & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 17,
    name: "Meteorite",
    description: "BBQ base, pepperoni, spicy beef, plain chicken & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 18,
    name: "Seafood",
    description: "Tuna, prawn & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 19,
    name: "Hawaiian",
    description: "Chicken, pineapple & Italian herbs.",
    price: 11.15,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 11.15 },
      { label: '11" Deep', price: 12.15 },
      { label: '16" Family', price: 17.15 }
    ]
  },
  {
    id: 20,
    name: "Smokey & the Bandit",
    description: "Pepperoni, garlic sausage, salami, bacon, spicy beef & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 21,
    name: "Lucky Luciano",
    description: "Mushrooms, pepperoni, salami, spicy beef, garlic butter, mixed peppers, onions & Italian herbs.",
    price: 11.9,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 11.9 },
      { label: '11" Deep', price: 12.9 },
      { label: '16" Family', price: 17.9 }
    ]
  },
  {
    id: 22,
    name: "Bolognese",
    description: "Bolognese sauce, minced beef, onions & Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 10.9 },
      { label: '11" Deep', price: 11.9 },
      { label: '16" Family', price: 16.9 }
    ]
  },
  {
    id: 1,
    name: "Margherita",
    description: "Pizza sauce & Italian herbs.",
    price: 9.8,
    category: "Pizzas",
    badge: "Classic",
    featured: true,
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 9.8 },
      { label: '11" Deep', price: 10.8 },
      { label: '16" Family', price: 16.25 }
    ]
  },
  {
    id: 23,
    name: "Caprese",
    description: "Chilli tomato base, chicken tikka, bacon, onions, jalapeños, cherry tomatoes & Italian herbs.",
    price: 10.45,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 10.45 },
      { label: '11" Deep', price: 11.45 }
    ]
  },
  {
    id: 24,
    name: "Prosciutto Funghi",
    description: "Turkey ham, mushrooms & Italian herbs.",
    price: 11.15,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 11.15 },
      { label: '11" Deep', price: 12.15 },
      { label: '16" Family', price: 17.15 }
    ]
  },
  {
    id: 25,
    name: "Meat Feast",
    description: "Minced beef, garlic sausage, pepperoni, salami, turkey ham, chicken & Italian herbs.",
    price: 12.35,
    category: "Pizzas",
    badge: "Popular",
    featured: true,
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 12.35 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 26,
    name: "Star Special",
    description: "Chef’s own preparation.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 27,
    name: "Valtellina",
    description: "Chicken, mushrooms, pineapple, turkey ham, pepperoni & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 28,
    name: "Prosciutto",
    description: "Turkey ham & Italian herbs.",
    price: 10.35,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 10.35 },
      { label: '11" Deep', price: 11.35 },
      { label: '16" Family', price: 16.35 }
    ]
  },
  {
    id: 29,
    name: "Mixed Grill",
    description: "Chicken tikka, doner meat, seekh, onions, green peppers & Italian herbs.",
    price: 12.9,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 12.9 },
      { label: '11" Deep', price: 13.9 },
      { label: '16" Family', price: 19.35 }
    ]
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Pepperoni, peppers & Italian herbs.",
    price: 10.9,
    category: "Pizzas",
    badge: "Popular",
    featured: true,
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 10.9 },
      { label: '11" Deep', price: 11.9 },
      { label: '16" Family', price: 16.9 }
    ]
  },
  {
    id: 30,
    name: "Paulii",
    description: "Fresh chicken & Italian herbs.",
    price: 10.35,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 10.35 },
      { label: '11" Deep', price: 11.35 },
      { label: '16" Family', price: 16.35 }
    ]
  },
  {
    id: 31,
    name: "Triple Threat Pep",
    description: "A selection of three different cheeses, triple pepperoni & Italian herbs.",
    price: 12.6,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 12.6 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 32,
    name: "Galaxy",
    description: "Pepperoni, onions, chicken tikka, jalapeño & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 33,
    name: "Doner",
    description: "Doner meat, peppers, onions & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 34,
    name: "Vegetariana",
    description: "Mushrooms, onions, peppers, cherry tomatoes, sweetcorn, pineapple & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 35,
    name: "Pollo Funghi",
    description: "Fresh chicken, mushrooms & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 36,
    name: "American Hot",
    description: "Pepperoni, onions, jalapeños & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 37,
    name: "Magic Combination",
    description: "Turkey ham, salami, garlic sausage, pepperoni & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 38,
    name: "Starburst",
    description: "Spicy beef, garlic sausage, pepperoni, onions, mushrooms, green peppers & Italian herbs.",
    price: 12.9,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 12.9 },
      { label: '11" Deep', price: 13.9 },
      { label: '16" Family', price: 19.35 }
    ]
  },
  {
    id: 39,
    name: "Half and Half",
    description: "Stuck between two pizzas? Why not have both!",
    price: 12.65,
    category: "Pizzas",
    badge: "Two favourites",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 14.35 },
      { label: '16" Family', price: 20.35 }
    ]
  },
  {
    id: 40,
    name: "Oceano",
    description: "Tuna, onions & pineapple.",
    price: 11.9,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.9 },
      { label: '11" Deep', price: 12.9 },
      { label: '16" Family', price: 17.9 }
    ]
  },
  {
    id: 41,
    name: "BBQ Chicken",
    description: "BBQ chicken, peppers & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  },
  {
    id: 42,
    name: "Bronx Buster",
    description: "Tender beef doner strips, fries, hot chilli sauce, garlic mayo & Italian herbs.",
    price: 11.9,
    category: "Pizzas",
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 11.9 },
      { label: '11" Deep', price: 12.9 },
      { label: '16" Family', price: 17.9 }
    ]
  },
  {
    id: 43,
    name: "Farmer",
    description: "Plain chicken, mushroom, sweetcorn & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 44,
    name: "5 Star",
    description: "Turkey ham, pepperoni, bacon, sweet chilli chicken, onions, cherry tomatoes, mushrooms & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 45,
    name: "Fully Loaded",
    description: "Pepperoni, turkey ham, onions, mixed peppers, mushrooms, sweetcorn, pineapple, spicy beef & Italian herbs.",
    price: 12.65,
    category: "Pizzas",
    badge: "Loaded",
    featured: true,
    image: pizzaImage3,
    variants: [
      { label: '11" Thin', price: 12.65 },
      { label: '11" Deep', price: 13.65 },
      { label: '16" Family', price: 18.35 }
    ]
  },
  {
    id: 5,
    name: "Smokey Joe's BBQ",
    description: "BBQ base, onions, spicy beef, chicken, peppers & Italian herbs.",
    price: 11.9,
    category: "Pizzas",
    badge: "BBQ",
    featured: true,
    image: pizzaImage4,
    variants: [
      { label: '11" Thin', price: 11.9 },
      { label: '11" Deep', price: 12.9 },
      { label: '16" Family', price: 17.9 }
    ]
  },
  {
    id: 46,
    name: "The Shadrack Special - By Gavinio",
    description: "Pepperoni, donner meat, red onions, jalapeño & Italian herbs.",
    price: 12.45,
    category: "Pizzas",
    image: pizzaImage1,
    variants: [
      { label: '11" Thin', price: 12.45 },
      { label: '11" Deep', price: 13.45 },
      { label: '16" Family', price: 18.95 }
    ]
  },
  {
    id: 3,
    name: "Hot Shot",
    description: "Pepperoni, fresh chilli, peppers, onions & Italian herbs.",
    price: 11.35,
    category: "Pizzas",
    badge: "Spicy",
    featured: true,
    image: pizzaImage2,
    variants: [
      { label: '11" Thin', price: 11.35 },
      { label: '11" Deep', price: 12.35 },
      { label: '16" Family', price: 17.35 }
    ]
  }
];


export const calzoneItems: MenuItem[] = [
  {
    id: 47,
    name: "Doner Calzone",
    description: "Mozzarella cheese, tomato, doner meat, onions, peppers & garlic butter.",
    price: 11.35,
    category: "Calzones",
    image: pizzaImage4
  },
  {
    id: 48,
    name: "Calzone Kiev Special",
    description: "Mozzarella cheese, tomato, turkey ham, chicken, pepperoni, cheddar cheese, parmesan cheese & garlic mushrooms.",
    price: 12.2,
    category: "Calzones",
    badge: "Special",
    image: pizzaImage1
  },
  {
    id: 49,
    name: "5 Star Calzone",
    description: "Mozzarella cheese, tomato, turkey ham, pepperoni, bacon, sweet chilli chicken, onions, garlic butter, cheddar cheese, parmesan cheese, cherry tomatoes & mushrooms.",
    price: 13.3,
    category: "Calzones",
    badge: "Loaded",
    image: pizzaImage2
  },
  {
    id: 50,
    name: "Fully Loaded Calzone",
    description: "Mozzarella cheese, tomato, pepperoni, turkey ham, onions, mixed peppers, mushrooms, sweetcorn, garlic butter, cheddar cheese, parmesan cheese, pineapple & spicy beef.",
    price: 13.3,
    category: "Calzones",
    badge: "Loaded",
    image: pizzaImage3
  },
  {
    id: 51,
    name: "Classic Calzone",
    description: "Mozzarella cheese, tomato, turkey ham, salami, garlic sausage, pepperoni & garlic mushrooms.",
    price: 11.35,
    category: "Calzones",
    image: pizzaImage4
  },
  {
    id: 52,
    name: "DIY Calzone",
    description: "Make your own calzone with any 3 toppings.",
    price: 12.8,
    category: "Calzones",
    badge: "Build your own",
    image: pizzaImage1
  },
  {
    id: 53,
    name: "Vegetarian Calzone",
    description: "Mozzarella cheese, tomato, mushrooms, onions, peppers, sweetcorn, pineapple, garlic butter, cheddar cheese & parmesan cheese.",
    price: 11.6,
    category: "Calzones",
    image: pizzaImage2
  }
];


const kebabImage1 =
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1200&q=85";
const kebabImage2 =
  "https://images.unsplash.com/photo-1756362847925-71c792d6729c?auto=format&fit=crop&w=1200&q=85";

export const kebabItems: MenuItem[] = [
  {
    id: 54,
    name: "Regular Doner Kebab",
    description: "In a pitta bread with salad.",
    price: 7,
    category: "Kebabs",
    badge: "Pitta",
    image: kebabImage1
  },
  {
    id: 55,
    name: "Large Doner Kebab",
    description: "In a pitta bread with salad.",
    price: 8.2,
    category: "Kebabs",
    badge: "Pitta",
    image: kebabImage1
  },
  {
    id: 56,
    name: "Chicken Kebab",
    description: "In a pitta bread with salad.",
    price: 8.2,
    category: "Kebabs",
    badge: "Pitta",
    image: kebabImage2
  },
  {
    id: 57,
    name: "Mixed Kebab",
    description: "In a pitta bread with salad.",
    price: 9.2,
    category: "Kebabs",
    badge: "Pitta",
    image: kebabImage1
  },
  {
    id: 58,
    name: "Doner Meat & Chips",
    description: "Doner meat with chips.",
    price: 8.2,
    category: "Kebabs",
    image: kebabImage2
  },
  {
    id: 59,
    name: "Mixed Meat & Chips",
    description: "Mixed meat with chips.",
    price: 10,
    category: "Kebabs",
    image: kebabImage1
  },
  {
    id: 60,
    name: "Chicken Tikka & Chips",
    description: "Chicken tikka with chips.",
    price: 9.2,
    category: "Kebabs",
    image: kebabImage2
  },
  {
    id: 61,
    name: "Doner Meat Tray Small",
    description: "Small doner meat tray.",
    price: 6,
    category: "Kebabs",
    image: kebabImage1
  },
  {
    id: 62,
    name: "Doner Meat Tray Medium",
    description: "Medium doner meat tray.",
    price: 7,
    category: "Kebabs",
    image: kebabImage1
  },
  {
    id: 63,
    name: "Doner Kebab on Naan - Beef",
    description: "Served on a naan bread with crispy lettuce & red onions.",
    price: 8.5,
    category: "Kebabs",
    badge: "Naan",
    image: kebabImage1
  },
  {
    id: 64,
    name: "Chicken Tikka Naan Kebab",
    description: "Served on a naan bread with crispy lettuce & red onions.",
    price: 9.5,
    category: "Kebabs",
    badge: "Naan",
    image: kebabImage2
  },
  {
    id: 65,
    name: "Mixed Kebab Naan",
    description: "Chicken tikka & doner meat. Served on a naan bread with crispy lettuce & red onions.",
    price: 10.5,
    category: "Kebabs",
    badge: "Naan",
    image: kebabImage1
  },
  {
    id: 66,
    name: "Star Special Naan Kebab",
    description: "Chicken tikka, doner meat & chicken seekh kebab. Served on a naan bread with crispy lettuce & red onions.",
    price: 11.5,
    category: "Kebabs",
    badge: "Naan",
    image: kebabImage2
  },
  {
    id: 67,
    name: "Seekh Kebab Naan (3 Pcs)",
    description: "Served on a naan bread with crispy lettuce & red onions.",
    price: 9.5,
    category: "Kebabs",
    badge: "Naan",
    image: kebabImage1
  },
  {
    id: 68,
    name: "Maradona Naan Kebab",
    description: "Doner meat, chicken seekh kebab, shami kebab & chicken tikka. Served on a naan bread with crispy lettuce & red onions.",
    price: 12.5,
    category: "Kebabs",
    badge: "Naan",
    image: kebabImage2
  },
  {
    id: 69,
    name: "Notorious Naan Kebab",
    description: "Doner meat, chicken tikka, 3 seekh kebabs, 3 shami kebabs, side salad & a selection of 3 naans: plain, cheesy and garlic.",
    price: 30,
    category: "Kebabs",
    badge: "Sharing",
    image: kebabImage1
  }
];
const burgerImage1 =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85";
const burgerImage2 =
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=85";
const burgerImage3 =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85";

export const burgerItems: MenuItem[] = [
  {
    id: 70,
    name: "Hot Chick Burger",
    description: "Zinger fillet burger dipped in Star Pizza’s special hot chilli sauce, mozzarella cheese & garlic mayo.",
    price: 9.4,
    category: "Burgers",
    image: burgerImage1,
    variants: [
      { label: "Quarter Pound", price: 9.4 },
      { label: "Half Pound", price: 10.6 }
    ]
  },
  {
    id: 71,
    name: "Ceasefire Burger",
    description: "Zinger fillet, mozzarella cheese & pepperoni.",
    price: 9.4,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 9.4 },
      { label: "Half Pound", price: 10.6 }
    ]
  },
  {
    id: 72,
    name: "Star Smasher Burger",
    description: "One beef patty, two zinger fillets, mozzarella sticks, mozzarella cheese & your choice of sauce.",
    price: 12.5,
    category: "Burgers",
    badge: "Loaded",
    image: burgerImage3
  },
  {
    id: 73,
    name: "Ring-o-Burger",
    description: "Beef burger topped with onion rings and mozzarella cheese.",
    price: 8.4,
    category: "Burgers",
    image: burgerImage1,
    variants: [
      { label: "Quarter Pound", price: 8.4 },
      { label: "Half Pound", price: 9.7 }
    ]
  },
  {
    id: 74,
    name: "Cheese Burger",
    description: "Cheese burger.",
    price: 7.9,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 7.9 },
      { label: "Half Pound", price: 9.2 }
    ]
  },
  {
    id: 75,
    name: "Zinger Fillet Burger",
    description: "Mayo & cheese slice.",
    price: 8.4,
    category: "Burgers",
    image: burgerImage3,
    variants: [
      { label: "Quarter Pound", price: 8.4 },
      { label: "Half Pound", price: 9.7 }
    ]
  },
  {
    id: 76,
    name: "Bugsey Siegel Burger",
    description: "Zinger fillet topped with mozzarella cheese, hash brown & burger sauce.",
    price: 9.4,
    category: "Burgers",
    image: burgerImage1,
    variants: [
      { label: "Quarter Pound", price: 9.4 },
      { label: "Half Pound", price: 10.6 }
    ]
  },
  {
    id: 77,
    name: "Veggie Burger",
    description: "Veggie burger.",
    price: 7.7,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 7.7 },
      { label: "Half Pound", price: 9 }
    ]
  },
  {
    id: 78,
    name: "Chilli Burger",
    description: "Chilli con carne.",
    price: 7.7,
    category: "Burgers",
    image: burgerImage3,
    variants: [
      { label: "Quarter Pound", price: 7.7 },
      { label: "Half Pound", price: 9 }
    ]
  },
  {
    id: 79,
    name: "Five 'O' Burger",
    description: "Pineapple & cheddar cheese toppings.",
    price: 8.2,
    category: "Burgers",
    image: burgerImage1,
    variants: [
      { label: "Quarter Pound", price: 8.2 },
      { label: "Half Pound", price: 9.5 }
    ]
  },
  {
    id: 80,
    name: "Amigo Star Burger",
    description: "Beef patty, mozzarella cheese, nachos, salsa & jalapeños.",
    price: 9.4,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 9.4 },
      { label: "Half Pound", price: 10.6 }
    ]
  },
  {
    id: 81,
    name: "Beef Swiss Burger",
    description: "Beef burger served with your choice of sauce, fried onions and mushrooms.",
    price: 9,
    category: "Burgers",
    image: burgerImage3,
    variants: [
      { label: "Quarter Pound", price: 9 },
      { label: "Half Pound", price: 10.3 }
    ]
  },
  {
    id: 82,
    name: "Garlic Burger",
    description: "Garlic butter.",
    price: 7.45,
    category: "Burgers",
    image: burgerImage1,
    variants: [
      { label: "Quarter Pound", price: 7.45 },
      { label: "Half Pound", price: 8.7 }
    ]
  },
  {
    id: 83,
    name: "Veggie Stack Burger",
    description: "Oven baked veg patty, sautéed mushrooms, mozzarella cheese & sweet chilli sauce.",
    price: 9.4,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 9.4 },
      { label: "Half Pound", price: 10.6 }
    ]
  },
  {
    id: 84,
    name: "Classic Chicken Burger",
    description: "Classic chicken burger.",
    price: 8.1,
    category: "Burgers",
    image: burgerImage3,
    variants: [
      { label: "Quarter Pound", price: 8.1 },
      { label: "Half Pound", price: 9.4 }
    ]
  },
  {
    id: 85,
    name: "Al Capone Burger",
    description: "Double beef patty topped with cheddar cheese, caramelised onions, bacon, fried egg & burger sauce.",
    price: 12.5,
    category: "Burgers",
    badge: "Loaded",
    image: burgerImage1
  },
  {
    id: 86,
    name: "Plain Jane Burger",
    description: "Plain.",
    price: 7.45,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 7.45 },
      { label: "Half Pound", price: 8.7 }
    ]
  },
  {
    id: 87,
    name: "Butcher's Favourite Burger",
    description: "Beef burger, cheese, chicken burger & doner on the side.",
    price: 11.45,
    category: "Burgers",
    badge: "Half Pound",
    image: burgerImage3
  },
  {
    id: 88,
    name: "Chicken Swiss Burger",
    description: "Chicken burger served with your choice of sauce, fried onions and mushrooms.",
    price: 9,
    category: "Burgers",
    image: burgerImage1,
    variants: [
      { label: "Quarter Pound", price: 9 },
      { label: "Half Pound", price: 10.3 }
    ]
  },
  {
    id: 89,
    name: "Star Special Burger",
    description: "Mozzarella cheese & 1000 Island sauce.",
    price: 8.2,
    category: "Burgers",
    image: burgerImage2,
    variants: [
      { label: "Quarter Pound", price: 8.2 },
      { label: "Half Pound", price: 9.5 }
    ]
  },
  {
    id: 90,
    name: "Sammy's Special Gourmet Burger",
    description: "Pepperoni, jalapeño, mozzarella cheese & Star special sauce.",
    price: 9,
    category: "Burgers",
    image: burgerImage3,
    variants: [
      { label: "Quarter Pound", price: 9 },
      { label: "Half Pound", price: 10.3 }
    ]
  },
  {
    id: 91,
    name: "Big Momma's Burger",
    description: "4 succulent beef patties in a toasted bun topped with cheese.",
    price: 11,
    category: "Burgers",
    badge: "Big",
    image: burgerImage1
  }
];

const chickenImage1 =
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=85";
const chickenImage2 =
  "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=85";
const chickenImage3 =
  "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=85";

export const chickenItems: MenuItem[] = [
  {
    id: 300,
    name: "2 Pc Chicken & Chips",
    description: "2 pieces of southern fried chicken served with chips.",
    price: 6.45,
    category: "Chicken",
    image: chickenImage1
  },
  {
    id: 301,
    name: "3 Pc Chicken, 3 Spicy Wings & Chips",
    description: "3 pieces of chicken, 3 spicy wings & chips.",
    price: 8.45,
    category: "Chicken",
    badge: "Combo",
    image: chickenImage2
  },
  {
    id: 302,
    name: "3 Pc Chicken & Chips",
    description: "3 pieces of southern fried chicken served with chips.",
    price: 7.8,
    category: "Chicken",
    image: chickenImage1
  },
  {
    id: 303,
    name: "Superstar Box",
    description: "10pc popcorn chicken, 4pc chicken tikka, 3pc chicken strips, chips, garlic mayo & Pepsi can.",
    price: 10,
    category: "Chicken",
    badge: "Box meal",
    image: chickenImage3
  },
  {
    id: 304,
    name: "5 Pc Strips & Chips",
    description: "5 chicken strips served with chips.",
    price: 7.45,
    category: "Chicken",
    image: chickenImage2
  },
  {
    id: 305,
    name: "6 Pc Spicy Wings & Chips",
    description: "6 spicy wings served with chips.",
    price: 8,
    category: "Chicken",
    image: chickenImage1
  },
  {
    id: 306,
    name: "2 Pc Chicken, 3 Spicy Wings & Chips",
    description: "2 pieces of chicken, 3 spicy wings & chips.",
    price: 7.45,
    category: "Chicken",
    badge: "Combo",
    image: chickenImage2
  },
  {
    id: 307,
    name: "Full Moon Box",
    description: "Zinger fillet burger, 5pc chicken nuggets, 5pc popcorn chicken, chips, garlic mayo & Pepsi can.",
    price: 10,
    category: "Chicken",
    badge: "Box meal",
    image: chickenImage3
  },
  {
    id: 308,
    name: "Family Bucket",
    description: "10 pieces chicken, 5 wings, 2 chips, coleslaw, beans & bottle of soft drink.",
    price: 22.45,
    category: "Chicken",
    badge: "Sharing",
    image: chickenImage1
  },
  {
    id: 309,
    name: "Mini Bucket",
    description: "6 pieces chicken, 4 strips, coleslaw or beans & 2 cans of Pepsi.",
    price: 17.5,
    category: "Chicken",
    badge: "Sharing",
    image: chickenImage2
  },
  {
    id: 310,
    name: "8 Pc Nuggets & Chips",
    description: "8 chicken nuggets served with chips.",
    price: 7.45,
    category: "Chicken",
    image: chickenImage3
  }
];

const sideImage1 =
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=85";
const sideImage2 =
  "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=1200&q=85";
const sideImage3 =
  "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=85";

export const sideItems: MenuItem[] = [
  {
    id: 400,
    name: "Popcorn Chicken",
    description: "Popcorn chicken.",
    price: 5.7,
    category: "Sides",
    image: sideImage1
  },
  {
    id: 401,
    name: "Star Special Salad",
    description: "Lettuce, red onions, green peppers, sweetcorn, pineapple, mozzarella cheese & star special sauce.",
    price: 3.45,
    category: "Sides",
    image: sideImage2
  },
  {
    id: 402,
    name: "Cheesy Curly Fries",
    description: "Cheesy curly fries.",
    price: 6.45,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 403,
    name: "Prawn Cocktail Salad",
    description: "Lettuce, king prawns, red onions, green peppers, sweetcorn, pineapple, mozzarella cheese & prawn cocktail sauce.",
    price: 4,
    category: "Sides",
    image: sideImage2
  },
  {
    id: 404,
    name: "Chilli Cheese Nuggets",
    description: "Chilli cheese nuggets.",
    price: 5.7,
    category: "Sides",
    image: sideImage1
  },
  {
    id: 405,
    name: "4 Cheese Fries",
    description: "Four-cheese fries.",
    price: 7.45,
    category: "Sides",
    badge: "Loaded",
    image: sideImage3
  },
  {
    id: 406,
    name: "Chicken Strip Dippers (5 Pcs)",
    description: "Served with 1 dip of your choice.",
    price: 5.7,
    category: "Sides",
    image: sideImage1
  },
  {
    id: 407,
    name: "Mozzarella Sticks (6 Pcs)",
    description: "Six mozzarella sticks.",
    price: 5.45,
    category: "Sides",
    image: sideImage2
  },
  {
    id: 408,
    name: "French Fries",
    description: "Choose regular or large.",
    price: 3.5,
    category: "Sides",
    image: sideImage3,
    variants: [
      { label: "Regular", price: 3.5 },
      { label: "Large", price: 4.9 }
    ]
  },
  {
    id: 409,
    name: "Cheesy Nachos",
    description: "Salsa sauce, jalapeños, coated with melted cheese.",
    price: 5.25,
    category: "Sides",
    image: sideImage2
  },
  {
    id: 410,
    name: "Curly Fries",
    description: "Curly fries.",
    price: 4.45,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 411,
    name: "Cream Cheese Jalapeños (6 Pcs)",
    description: "Six cream cheese jalapeños.",
    price: 5.7,
    category: "Sides",
    image: sideImage1
  },
  {
    id: 412,
    name: "Onion Rings",
    description: "Choose regular or large.",
    price: 3.4,
    category: "Sides",
    image: sideImage2,
    variants: [
      { label: "Regular", price: 3.4 },
      { label: "Large", price: 5.1 }
    ]
  },
  {
    id: 413,
    name: "Cheesy Chips - Lrg",
    description: "Large cheesy chips.",
    price: 5.75,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 414,
    name: "Coleslaw",
    description: "Coleslaw.",
    price: 3,
    category: "Sides",
    image: sideImage2
  },
  {
    id: 415,
    name: "Hash Browns (4 Pcs)",
    description: "Four hash browns.",
    price: 4,
    category: "Sides",
    image: sideImage1
  },
  {
    id: 416,
    name: "Side Salad",
    description: "Lettuce, red onions & cherry tomatoes.",
    price: 2.5,
    category: "Sides",
    image: sideImage2
  },
  {
    id: 417,
    name: "BBQ Dip",
    description: "BBQ dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 418,
    name: "Chilli Dip",
    description: "Chilli dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 419,
    name: "Garlic Mayo Dip",
    description: "Garlic mayo dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 420,
    name: "Ketchup Dip",
    description: "Ketchup dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 421,
    name: "Mayo Dip",
    description: "Mayo dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 422,
    name: "Mint Sauce Dip",
    description: "Mint sauce dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  },
  {
    id: 423,
    name: "Sweet Chilli Dip",
    description: "Sweet chilli dip.",
    price: 1.2,
    category: "Sides",
    image: sideImage3
  }
];

export const garlicBreadItems: MenuItem[] = [
  {
    id: 500,
    name: "Garlic Bread Tomato",
    description: '11" thin garlic bread with tomato.',
    price: 7.3,
    category: "Garlic Bread",
    image: pizzaImage1
  },
  {
    id: 501,
    name: "Garlic Doner",
    description: "Plain garlic bread topped with freshly cut tender beef doner strips, crispy lettuce, red onions & cherry tomatoes.",
    price: 9.65,
    category: "Garlic Bread",
    badge: "Loaded",
    image: pizzaImage2
  },
  {
    id: 502,
    name: "Garlic Funghi",
    description: '11" thin garlic bread with cheese & mushrooms.',
    price: 8.9,
    category: "Garlic Bread",
    image: pizzaImage3
  },
  {
    id: 503,
    name: "Garlic Bread Special",
    description: '11" thin garlic bread with mushrooms, doner, jalapeños & cheese.',
    price: 9.35,
    category: "Garlic Bread",
    badge: "Special",
    image: pizzaImage4
  },
  {
    id: 504,
    name: "Garlic Bread Supreme",
    description: '11" thin garlic bread with cheese.',
    price: 8.35,
    category: "Garlic Bread",
    image: pizzaImage1
  },
  {
    id: 505,
    name: "Garlic Bread",
    description: 'Classic 11" thin garlic bread.',
    price: 6.9,
    category: "Garlic Bread",
    image: pizzaImage2
  }
];

export const loadedFriesItems: MenuItem[] = [
  {
    id: 520,
    name: "Chipizza Fries with Cheese",
    description: '11" family loaded fries with cheese and one topping of your choice. Extra toppings are £2.85 each.',
    price: 8.45,
    category: "Loaded Fries",
    badge: "Build your own",
    image: pizzaImage3
  }
];

const wrapImage1 =
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=85";
const wrapImage2 =
  "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=1200&q=85";

export const wrapItems: MenuItem[] = [
  {
    id: 540,
    name: "Veggie Wrap",
    description: "Filled with crispy lettuce, red onions & mayonnaise. Includes a sugar-free soft drink can.",
    price: 5.5,
    category: "Wraps",
    image: wrapImage1
  },
  {
    id: 541,
    name: "Doner Wrap",
    description: "Filled with crispy lettuce, red onions & mayonnaise. Includes a sugar-free soft drink can.",
    price: 5.75,
    category: "Wraps",
    image: wrapImage2
  },
  {
    id: 542,
    name: "Seesh Wrap",
    description: "Filled with crispy lettuce, red onions & mayonnaise. Includes a sugar-free soft drink can.",
    price: 6,
    category: "Wraps",
    image: wrapImage1
  },
  {
    id: 543,
    name: "Chicken Wrap",
    description: "Filled with crispy lettuce, red onions & mayonnaise. Includes a sugar-free soft drink can.",
    price: 6,
    category: "Wraps",
    image: wrapImage2
  },
  {
    id: 544,
    name: "Twister Wrap",
    description: "Chicken tikka & doner meat with crispy lettuce, red onions & mayonnaise. Includes a sugar-free soft drink can.",
    price: 7,
    category: "Wraps",
    badge: "Mixed",
    image: wrapImage1
  },
  {
    id: 545,
    name: "Chicken Tikka Wrap",
    description: "Filled with crispy lettuce, red onions & mayonnaise. Includes a sugar-free soft drink can.",
    price: 6.25,
    category: "Wraps",
    image: wrapImage2
  }
];

const naanImage1 =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85";
const naanImage2 =
  "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=1200&q=85";
const starterImage1 =
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=85";
const starterImage2 =
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=85";

export const naanBreadItems: MenuItem[] = [
  {
    id: 560,
    name: "Garlic Naan",
    description: "Garlic naan bread.",
    price: 4.3,
    category: "Naan Breads",
    image: naanImage1
  },
  {
    id: 561,
    name: "Cheesy Naan",
    description: "Naan bread with cheese.",
    price: 5,
    category: "Naan Breads",
    image: naanImage2
  },
  {
    id: 562,
    name: "Plain Naan",
    description: "Plain naan bread.",
    price: 3.6,
    category: "Naan Breads",
    image: naanImage1
  },
  {
    id: 563,
    name: "Cheesy Garlic Naan",
    description: "Naan bread with cheese and garlic.",
    price: 5.8,
    category: "Naan Breads",
    badge: "Popular combo",
    image: naanImage2
  }
];

export const starterItems: MenuItem[] = [
  {
    id: 570,
    name: "Chicken Seekh Kebab (2 Pieces)",
    description: "Two chicken seekh kebabs. Served with a mint sauce dip.",
    price: 4.95,
    category: "Starters",
    image: starterImage1
  },
  {
    id: 571,
    name: "Chicken Tikka Starter",
    description: "Chicken tikka starter. Served with a mint sauce dip.",
    price: 5.95,
    category: "Starters",
    image: starterImage2
  },
  {
    id: 572,
    name: "Shami Kebab (2 Pieces)",
    description: "Two shami kebabs. Served with a mint sauce dip.",
    price: 4.95,
    category: "Starters",
    image: starterImage1
  }
];

const milkshakeImage1 =
  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=85";
const milkshakeImage2 =
  "https://images.unsplash.com/photo-1568901839119-631418a3910d?auto=format&fit=crop&w=1200&q=85";
const milkshakeImage3 =
  "https://images.unsplash.com/photo-1627998691167-4dab0dfcae31?auto=format&fit=crop&w=1200&q=85";

export const milkshakeItems: MenuItem[] = [
  { id: 580, name: "Brownie Milkshake", description: "Brownie milkshake.", price: 7.45, category: "Milkshakes", image: milkshakeImage1 },
  { id: 581, name: "Lindor Milkshake", description: "Lindor milkshake.", price: 7.45, category: "Milkshakes", image: milkshakeImage2 },
  { id: 582, name: "Flake Milkshake", description: "Flake milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage3 },
  { id: 583, name: "Strawberry Milkshake", description: "Strawberry milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage1 },
  { id: 584, name: "Vanilla Milkshake", description: "Vanilla milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage2 },
  {
    id: 585,
    name: "Star’s Favourite Milkshake",
    description: "Jammie Dodgers, Milkybar & strawberries.",
    price: 7.45,
    category: "Milkshakes",
    badge: "Star favourite",
    image: milkshakeImage3
  },
  { id: 586, name: "Bischoff Milkshake", description: "Bischoff milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage1 },
  { id: 587, name: "Snickers Milkshake", description: "Snickers milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage2 },
  { id: 588, name: "Ferrero Rocher Milkshake", description: "Ferrero Rocher milkshake.", price: 7.45, category: "Milkshakes", image: milkshakeImage3 },
  { id: 589, name: "Terry’s Orange Milkshake", description: "Terry’s Orange milkshake.", price: 7.45, category: "Milkshakes", image: milkshakeImage1 },
  { id: 590, name: "Banana Milkshake", description: "Banana milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage2 },
  {
    id: 591,
    name: "Nutty Professor Milkshake",
    description: "Snickers & banana.",
    price: 7.45,
    category: "Milkshakes",
    image: milkshakeImage3
  },
  { id: 592, name: "Strawnana Milkshake", description: "Strawberry & banana milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage1 },
  {
    id: 593,
    name: "Cloud Nine Milkshake",
    description: "Kinder Bueno, Oreos & strawberries.",
    price: 7.45,
    category: "Milkshakes",
    badge: "Loaded",
    image: milkshakeImage2
  },
  {
    id: 594,
    name: "The Baller Milkshake",
    description: "Ferrero Rocher, strawberries, milk chocolate sauce & Cadbury's Flake.",
    price: 8.45,
    category: "Milkshakes",
    badge: "Loaded",
    image: milkshakeImage3
  },
  { id: 595, name: "Jammie Dodger Milkshake", description: "Jammie Dodger milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage1 },
  { id: 596, name: "Kinder Milkshake", description: "Kinder milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage2 },
  { id: 597, name: "Oreo Milkshake", description: "Oreo milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage3 },
  { id: 598, name: "Milkybar Milkshake", description: "Milkybar milkshake.", price: 6.45, category: "Milkshakes", image: milkshakeImage1 }
];

const dessertImage1 =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85";
const dessertImage2 =
  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=85";
const drinkImage1 =
  "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=1200&q=85";
const drinkImage2 =
  "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=1200&q=85";

export const dessertItems: MenuItem[] = [
  {
    id: 600,
    name: "Tiramisu",
    description: "Traditional tiramisu made with Savoy biscuits, coffee and mascarpone cream.",
    price: 7.45,
    category: "Desserts",
    image: dessertImage2
  },
  {
    id: 601,
    name: "Jam & Coconut Sponge Pudding",
    description: "Served with hot custard.",
    price: 5.95,
    category: "Desserts",
    image: dessertImage1
  },
  {
    id: 602,
    name: "Italian Chocolate Fudge Cake",
    description: "Italian chocolate fudge cake.",
    price: 4.5,
    category: "Desserts",
    image: dessertImage1
  },
  {
    id: 603,
    name: "The Matilda Cake!",
    description: "7 layers of signature chocolate sponge sandwiched with a soft set milk chocolate ganache.",
    price: 6.45,
    category: "Desserts",
    badge: "7 layers",
    image: dessertImage1
  },
  {
    id: 604,
    name: "Sticky Toffee Pudding",
    description: "Served with hot custard or Italian vanilla gelato.",
    price: 5.99,
    category: "Desserts",
    image: dessertImage2
  },
  {
    id: 605,
    name: "Apple Crumble",
    description: "Served with hot custard or Italian vanilla gelato.",
    price: 5.99,
    category: "Desserts",
    image: dessertImage2
  }
];

export const drinkItems: MenuItem[] = [
  {
    id: 620,
    name: "Sprite Lemon Lime 330ml Can",
    description: "Sparkling lemon-lime low calorie soft drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage1
  },
  {
    id: 621,
    name: "Fanta Lemon 330ml Can",
    description: "Sparkling lemon fruit drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage2
  },
  {
    id: 622,
    name: "Fanta Orange 1.25L Bottle",
    description: "Sparkling orange fruit drink.",
    price: 4.5,
    category: "Drinks",
    image: drinkImage1
  },
  {
    id: 623,
    name: "Diet Coke 1.5L Bottle",
    description: "Low calorie cola soft drink.",
    price: 4.5,
    category: "Drinks",
    image: drinkImage2
  },
  {
    id: 624,
    name: "Fanta Orange 330ml Can",
    description: "Sparkling orange fruit drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage1
  },
  {
    id: 625,
    name: "Pepsi Max 330ml",
    description: "Sugar-free cola soft drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage2
  },
  {
    id: 626,
    name: "Red Bull Energy Drink 4 x 250ml",
    description: "Four 250ml cans of Red Bull Energy Drink.",
    price: 8.45,
    category: "Drinks",
    badge: "4 pack",
    image: drinkImage1
  },
  {
    id: 627,
    name: "Dr Pepper 330ml Can",
    description: "Sparkling fruit flavour soft drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage2
  },
  {
    id: 628,
    name: "Red Bull Energy Drink 8 x 250ml",
    description: "Eight 250ml cans of Red Bull Energy Drink.",
    price: 13.95,
    category: "Drinks",
    badge: "8 pack",
    image: drinkImage1
  },
  {
    id: 629,
    name: "Coca-Cola Original Taste 330ml",
    description: "Sparkling cola soft drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage2
  },
  {
    id: 630,
    name: "Mineral Water",
    description: "Mineral water.",
    price: 2,
    category: "Drinks",
    image: drinkImage1
  },
  {
    id: 631,
    name: "Pepsi 330ml",
    description: "Cola flavoured soft drink.",
    price: 2.5,
    category: "Drinks",
    image: drinkImage2
  },
  {
    id: 632,
    name: "Red Bull Energy Drink Can",
    description: "Red Bull Energy Drink can.",
    price: 2.65,
    category: "Drinks",
    image: drinkImage1
  },
  {
    id: 633,
    name: "Large Drink Bottle - Coca-Cola",
    description: "Large bottle of Coca-Cola.",
    price: 4.5,
    category: "Drinks",
    image: drinkImage2
  }
];

export const upsellItems: MenuItem[] = [
  {
    id: 201,
    name: "Garlic Bread",
    description: '11" thin garlic bread.',
    price: 6.9,
    category: "Sides",
    badge: "Side",
    image: "https://images.unsplash.com/photo-1556008531-57e6eefc7be4?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: 202,
    name: "French Fries",
    description: "Regular portion of French fries.",
    price: 3.5,
    category: "Sides",
    badge: "Side",
    image: "https://images.unsplash.com/photo-1529259266118-cf22737f713f?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: 203,
    name: "Coca-Cola",
    description: "Coca-Cola Original Taste 330ml.",
    price: 2.5,
    category: "Drinks",
    badge: "Drink",
    image: "https://images.unsplash.com/photo-1773188243488-702914547143?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: 204,
    name: "Chocolate Fudge Cake",
    description: "Italian chocolate fudge cake.",
    price: 4.5,
    category: "Desserts",
    badge: "Dessert",
    image: "https://images.unsplash.com/photo-1540337706094-da10342c93d8?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: 205,
    name: "Mozzarella Sticks",
    description: "6 pieces of crispy mozzarella sticks.",
    price: 5.45,
    category: "Sides",
    badge: "Side",
    image: "https://images.unsplash.com/photo-1778449665117-2c607bbc7415?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: 206,
    name: "Chicken Strip Dippers",
    description: "5 chicken strips served with 1 dip of your choice.",
    price: 5.7,
    category: "Sides",
    badge: "Side",
    image: "https://images.unsplash.com/photo-1605291581926-df4bf7ee3e89?auto=format&fit=crop&w=900&q=82"
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

export const allItems = [
  ...menuItems,
  ...calzoneItems,
  ...kebabItems,
  ...burgerItems,
  ...chickenItems,
  ...sideItems,
  ...garlicBreadItems,
  ...loadedFriesItems,
  ...wrapItems,
  ...naanBreadItems,
  ...starterItems,
  ...milkshakeItems,
  ...dessertItems,
  ...drinkItems,
  ...upsellItems,
  ...offerItems
];

export const menuCategories = [
  "Popular",
  "Pizzas",
  "Calzones",
  "Kebabs",
  "Burgers",
  "Chicken",
  "Garlic Bread",
  "Loaded Fries",
  "Wraps",
  "Naan Breads",
  "Starters",
  "Milkshakes",
  "Sides",
  "Desserts",
  "Drinks"
];