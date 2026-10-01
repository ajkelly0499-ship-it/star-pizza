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

export const allItems = [...menuItems, ...calzoneItems, ...upsellItems, ...offerItems];

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