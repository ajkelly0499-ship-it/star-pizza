import { eq } from "drizzle-orm";
import { getDb } from "./client";
import {
  categories,
  products,
  productVariants,
  restaurants
} from "./schema";
import {
  brownieItems,
  burgerItems,
  calzoneItems,
  chickenItems,
  cookieDoughItems,
  dessertItems,
  drinkItems,
  fondueItems,
  garlicBreadItems,
  kidsItems,
  kebabItems,
  loadedFriesItems,
  menuCategories,
  menuItems,
  milkshakeItems,
  naanBreadItems,
  offerItems,
  sideItems,
  starterItems,
  wrapItems,
  type MenuItem
} from "../lib/menu";

const RESTAURANT_SLUG = "star-pizza-birstall";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toPence(value: number) {
  return Math.round(value * 100);
}

// Deliberately exclude upsellItems: those are UI shortcuts that duplicate
// canonical menu products and must not become duplicate database products.
const catalogue: MenuItem[] = [
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
  ...cookieDoughItems,
  ...brownieItems,
  ...fondueItems,
  ...kidsItems,
  ...offerItems
];

async function seed() {
  const db = getDb();

  const [restaurant] = await db
    .insert(restaurants)
    .values({
      name: "Star Pizza Birstall",
      slug: RESTAURANT_SLUG,
      currency: "GBP",
      timezone: "Europe/London",
      active: true,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: restaurants.slug,
      set: {
        name: "Star Pizza Birstall",
        currency: "GBP",
        timezone: "Europe/London",
        active: true,
        updatedAt: new Date()
      }
    })
    .returning({ id: restaurants.id });

  if (!restaurant) {
    throw new Error("Could not create or locate Star Pizza restaurant record.");
  }

  const canonicalCategoryOrder = menuCategories.filter((name) => name !== "Popular");
  const categoryNames = Array.from(
    new Set([...canonicalCategoryOrder, ...catalogue.map((item) => item.category)])
  );

  const categoryIdByName = new Map<string, string>();

  for (const [sortOrder, name] of categoryNames.entries()) {
    const slug = slugify(name);
    const [category] = await db
      .insert(categories)
      .values({
        restaurantId: restaurant.id,
        name,
        slug,
        sortOrder,
        active: true,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [categories.restaurantId, categories.slug],
        set: {
          name,
          sortOrder,
          active: true,
          updatedAt: new Date()
        }
      })
      .returning({ id: categories.id });

    if (!category) {
      throw new Error(`Could not seed category: ${name}`);
    }

    categoryIdByName.set(name, category.id);
  }

  for (const [sortOrder, item] of catalogue.entries()) {
    const categoryId = categoryIdByName.get(item.category);

    if (!categoryId) {
      throw new Error(`Missing category mapping for ${item.category}`);
    }

    const [product] = await db
      .insert(products)
      .values({
        restaurantId: restaurant.id,
        categoryId,
        legacyId: item.id,
        name: item.name,
        description: item.description,
        basePricePence: toPence(item.price),
        imageUrl: item.image ?? null,
        badge: item.badge ?? null,
        featured: item.featured ?? false,
        visible: true,
        active: true,
        soldOut: false,
        sortOrder,
        metadata: {
          source: "legacy-static-menu",
          requiresOwnerReview: true
        },
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [products.restaurantId, products.legacyId],
        set: {
          categoryId,
          name: item.name,
          description: item.description,
          basePricePence: toPence(item.price),
          imageUrl: item.image ?? null,
          badge: item.badge ?? null,
          featured: item.featured ?? false,
          visible: true,
          active: true,
          sortOrder,
          metadata: {
            source: "legacy-static-menu",
            requiresOwnerReview: true
          },
          updatedAt: new Date()
        }
      })
      .returning({ id: products.id });

    if (!product) {
      throw new Error(`Could not seed product: ${item.name}`);
    }

    await db.delete(productVariants).where(eq(productVariants.productId, product.id));

    if (item.variants?.length) {
      await db.insert(productVariants).values(
        item.variants.map((variant, variantIndex) => ({
          productId: product.id,
          label: variant.label,
          pricePence: toPence(variant.price),
          sortOrder: variantIndex,
          active: true
        }))
      );
    }
  }

  console.log(
    `Seed complete: ${categoryNames.length} categories and ${catalogue.length} products imported.`
  );
}

seed().catch((error) => {
  console.error("Menu seed failed.");
  console.error(error);
  process.exit(1);
});
