import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db/client";
import {
  categories,
  products,
  productVariants,
  restaurants
} from "../../db/schema";

export async function getPublicMenu(restaurantSlug: string) {
  const db = getDb();

  const [restaurant] = await db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      slug: restaurants.slug,
      currency: restaurants.currency
    })
    .from(restaurants)
    .where(and(eq(restaurants.slug, restaurantSlug), eq(restaurants.active, true)))
    .limit(1);

  if (!restaurant) {
    return null;
  }

  const categoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      sortOrder: categories.sortOrder
    })
    .from(categories)
    .where(
      and(
        eq(categories.restaurantId, restaurant.id),
        eq(categories.active, true)
      )
    )
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  const productRows = await db
    .select({
      id: products.id,
      legacyId: products.legacyId,
      categoryId: products.categoryId,
      name: products.name,
      description: products.description,
      basePricePence: products.basePricePence,
      imageUrl: products.imageUrl,
      badge: products.badge,
      featured: products.featured,
      soldOut: products.soldOut,
      sortOrder: products.sortOrder
    })
    .from(products)
    .where(
      and(
        eq(products.restaurantId, restaurant.id),
        eq(products.active, true),
        eq(products.visible, true)
      )
    )
    .orderBy(asc(products.sortOrder), asc(products.name));

  const productIds = productRows.map((product) => product.id);

  const variantRows = productIds.length
    ? await db
        .select({
          id: productVariants.id,
          productId: productVariants.productId,
          label: productVariants.label,
          pricePence: productVariants.pricePence,
          sortOrder: productVariants.sortOrder
        })
        .from(productVariants)
        .where(
          and(
            inArray(productVariants.productId, productIds),
            eq(productVariants.active, true)
          )
        )
        .orderBy(asc(productVariants.sortOrder))
    : [];

  const variantsByProduct = new Map<
    string,
    Array<{
      id: string;
      label: string;
      pricePence: number;
      sortOrder: number;
    }>
  >();

  for (const variant of variantRows) {
    const existing = variantsByProduct.get(variant.productId) ?? [];
    existing.push({
      id: variant.id,
      label: variant.label,
      pricePence: variant.pricePence,
      sortOrder: variant.sortOrder
    });
    variantsByProduct.set(variant.productId, existing);
  }

  const productsByCategory = new Map<string, typeof productRows>();

  for (const product of productRows) {
    const existing = productsByCategory.get(product.categoryId) ?? [];
    existing.push(product);
    productsByCategory.set(product.categoryId, existing);
  }

  return {
    restaurant,
    categories: categoryRows.map((category) => ({
      ...category,
      products: (productsByCategory.get(category.id) ?? []).map((product) => ({
        ...product,
        variants: variantsByProduct.get(product.id) ?? []
      }))
    }))
  };
}
