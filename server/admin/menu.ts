import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../db/client";
import { categories, products, restaurants } from "../../db/schema";

const RESTAURANT_SLUG = "star-pizza-birstall";

export type AdminMenuProduct = {
  id: string;
  legacyId: number;
  name: string;
  category: string;
  basePricePence: number;
  soldOut: boolean;
  active: boolean;
  visible: boolean;
};

export class AdminMenuError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

async function getRestaurantId() {
  const db = getDb();
  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(and(eq(restaurants.slug, RESTAURANT_SLUG), eq(restaurants.active, true)))
    .limit(1);

  return restaurant?.id ?? null;
}

export async function getAdminMenuProducts(): Promise<AdminMenuProduct[]> {
  const db = getDb();
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return [];

  return db
    .select({
      id: products.id,
      legacyId: products.legacyId,
      name: products.name,
      category: categories.name,
      basePricePence: products.basePricePence,
      soldOut: products.soldOut,
      active: products.active,
      visible: products.visible
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.restaurantId, restaurantId))
    .orderBy(asc(categories.sortOrder), asc(products.sortOrder), asc(products.name));
}

export async function updateAdminProductAvailability(
  productId: string,
  soldOut: boolean
) {
  const db = getDb();
  const restaurantId = await getRestaurantId();

  if (!restaurantId) {
    throw new AdminMenuError("Restaurant is unavailable.", 503);
  }

  const [updated] = await db
    .update(products)
    .set({
      soldOut,
      updatedAt: new Date()
    })
    .where(and(eq(products.id, productId), eq(products.restaurantId, restaurantId)))
    .returning({
      id: products.id,
      soldOut: products.soldOut
    });

  if (!updated) {
    throw new AdminMenuError("Menu item not found.", 404);
  }

  return updated;
}
