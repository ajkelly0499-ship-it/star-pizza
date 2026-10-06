import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db/client";
import {
  categories,
  products,
  productVariants,
  restaurants
} from "../../db/schema";
import {
  buildYourOwnToppings,
  burgerIncludedToppings,
  burgerToppingOptions,
  dessertExtraOptions,
  kebabDips,
  menuItems,
  pizzaExtraToppings
} from "../../lib/menu";

export type BasketValidationInputLine = {
  clientLineKey: string;
  itemId: number;
  quantity: number;
  options: string[];
};

export type BasketValidationIssue = {
  clientLineKey: string;
  code:
    | "PRODUCT_NOT_FOUND"
    | "PRODUCT_UNAVAILABLE"
    | "INVALID_QUANTITY"
    | "INVALID_VARIANT"
    | "INVALID_OPTION"
    | "MISSING_REQUIRED_OPTION"
    | "DUPLICATE_OPTION";
  message: string;
};

export type ValidatedBasketLine = {
  clientLineKey: string;
  requestedItemId: number;
  canonicalItemId: number;
  productId: string;
  name: string;
  quantity: number;
  unitPricePence: number;
  lineTotalPence: number;
  options: string[];
};

export type BasketValidationResult = {
  valid: boolean;
  subtotalPence: number;
  lines: ValidatedBasketLine[];
  issues: BasketValidationIssue[];
};

type ProductRow = {
  productId: string;
  legacyId: number;
  name: string;
  description: string;
  basePricePence: number;
  soldOut: boolean;
  active: boolean;
  visible: boolean;
  category: string;
};

type VariantRow = {
  id: string;
  productId: string;
  label: string;
  pricePence: number;
};

const RESTAURANT_SLUG = "star-pizza-birstall";

const quickUpsellAliases: Record<
  number,
  { canonicalItemId: number; defaultVariant?: string }
> = {
  201: { canonicalItemId: 505 },
  202: { canonicalItemId: 408, defaultVariant: "Regular" },
  203: { canonicalItemId: 629 },
  204: { canonicalItemId: 602 },
  205: { canonicalItemId: 407 },
  206: { canonicalItemId: 406 },
  207: { canonicalItemId: 400 }
};

const dessertServingChoices = new Set([
  "Hot custard",
  "Italian vanilla gelato"
]);

const halfPizzaChoices = new Set(
  menuItems
    .filter(
      (item) =>
        item.category === "Pizzas" &&
        item.name !== "Half and Half" &&
        item.name !== "DIY Pizza"
    )
    .map((item) => item.name)
);

function stripDisplayedPrice(value: string) {
  return value.replace(/\s+\(\+£\d+(?:\.\d{1,2})?\)$/u, "").trim();
}

function addIssue(
  issues: BasketValidationIssue[],
  clientLineKey: string,
  code: BasketValidationIssue["code"],
  message: string
) {
  issues.push({ clientLineKey, code, message });
}

function findUniquePrefixed(
  options: string[],
  prefix: string
): { value: string | null; matches: string[] } {
  const matches = options.filter((option) => option.startsWith(prefix));
  return {
    value: matches.length === 1 ? matches[0].slice(prefix.length).trim() : null,
    matches
  };
}

function validateUniqueLabels(
  labels: string[],
  clientLineKey: string,
  issues: BasketValidationIssue[]
) {
  if (new Set(labels).size !== labels.length) {
    addIssue(
      issues,
      clientLineKey,
      "DUPLICATE_OPTION",
      "The same option cannot be selected more than once."
    );
    return false;
  }
  return true;
}

function optionPriceByLabel(
  label: string,
  options: Array<{ label: string; price: number }>
) {
  return options.find((option) => option.label === label);
}

function validateConfiguredOptions({
  product,
  options,
  clientLineKey
}: {
  product: ProductRow;
  options: string[];
  clientLineKey: string;
}) {
  const issues: BasketValidationIssue[] = [];
  let extraPricePence = 0;

  const noteOptions = options.filter((option) => option.startsWith("Note: "));
  if (noteOptions.length > 1) {
    addIssue(
      issues,
      clientLineKey,
      "DUPLICATE_OPTION",
      "Only one special-instructions note is allowed."
    );
  }
  for (const note of noteOptions) {
    if (note.slice("Note: ".length).trim().length > 120) {
      addIssue(
        issues,
        clientLineKey,
        "INVALID_OPTION",
        "Special instructions are too long."
      );
    }
  }

  const working = options.filter((option) => !option.startsWith("Note: "));

  if (product.category === "Pizzas" || product.category === "Calzones") {
    if (product.name === "Half and Half") {
      const halfOne = findUniquePrefixed(working, "Half 1: ");
      const halfTwo = findUniquePrefixed(working, "Half 2: ");
      const allowed = [
        ...halfOne.matches,
        ...halfTwo.matches
      ];

      if (!halfOne.value || !halfTwo.value) {
        addIssue(
          issues,
          clientLineKey,
          "MISSING_REQUIRED_OPTION",
          "Half and Half requires two pizza choices."
        );
      } else if (
        halfOne.value === halfTwo.value ||
        !halfPizzaChoices.has(halfOne.value) ||
        !halfPizzaChoices.has(halfTwo.value)
      ) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          "Half and Half contains an invalid pizza choice."
        );
      }

      for (const option of working) {
        if (!allowed.includes(option)) {
          addIssue(
            issues,
            clientLineKey,
            "INVALID_OPTION",
            `Unsupported option: ${option}`
          );
        }
      }

      return { issues, extraPricePence };
    }

    const buildOptions = working.filter((option) =>
      option.startsWith("Chosen toppings: ")
    );
    const extraOptions = working.filter((option) => option.startsWith("Extra: "));
    const allowed = [...buildOptions, ...extraOptions];

    const requiredBuildCount =
      product.name === "DIY Pizza" ? 4 : product.name === "DIY Calzone" ? 3 : 0;

    if (requiredBuildCount > 0) {
      if (buildOptions.length !== 1) {
        addIssue(
          issues,
          clientLineKey,
          "MISSING_REQUIRED_OPTION",
          `${product.name} requires exactly ${requiredBuildCount} included toppings.`
        );
      } else {
        const labels = buildOptions[0]
          .slice("Chosen toppings: ".length)
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean);

        if (
          labels.length !== requiredBuildCount ||
          new Set(labels).size !== labels.length ||
          labels.some((label) => !buildYourOwnToppings.includes(label))
        ) {
          addIssue(
            issues,
            clientLineKey,
            "INVALID_OPTION",
            `${product.name} contains an invalid included-topping selection.`
          );
        }
      }
    } else if (buildOptions.length > 0) {
      addIssue(
        issues,
        clientLineKey,
        "INVALID_OPTION",
        "Included build-your-own toppings are not valid for this product."
      );
    }

    if (extraOptions.length > 6) {
      addIssue(
        issues,
        clientLineKey,
        "INVALID_OPTION",
        "A maximum of 6 extra toppings is allowed."
      );
    }

    const extraLabels = extraOptions.map((option) =>
      stripDisplayedPrice(option.slice("Extra: ".length))
    );
    validateUniqueLabels(extraLabels, clientLineKey, issues);

    for (const label of extraLabels) {
      const topping = optionPriceByLabel(label, pizzaExtraToppings);
      if (!topping) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Invalid extra topping: ${label}`
        );
      } else {
        extraPricePence += Math.round(topping.price * 100);
      }
    }

    for (const option of working) {
      if (!allowed.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (product.category === "Kebabs") {
    const dipOptions = working.filter((option) => option.startsWith("Dip: "));
    const noSaladOptions = working.filter((option) => option === "No salad");
    const allowed = [...dipOptions, ...noSaladOptions];

    if (noSaladOptions.length > 1) {
      addIssue(
        issues,
        clientLineKey,
        "DUPLICATE_OPTION",
        "Salad choice is duplicated."
      );
    }

    const canRemoveSalad =
      product.description.toLowerCase().includes("salad") ||
      product.description.toLowerCase().includes("lettuce");

    if (noSaladOptions.length && !canRemoveSalad) {
      addIssue(
        issues,
        clientLineKey,
        "INVALID_OPTION",
        "This product does not include a removable salad."
      );
    }

    const dipLabels = dipOptions.map((option) =>
      stripDisplayedPrice(option.slice("Dip: ".length))
    );
    validateUniqueLabels(dipLabels, clientLineKey, issues);

    for (const label of dipLabels) {
      const dip = optionPriceByLabel(label, kebabDips);
      if (!dip) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Invalid dip: ${label}`
        );
      } else {
        extraPricePence += Math.round(dip.price * 100);
      }
    }

    for (const option of working) {
      if (!allowed.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (product.category === "Burgers") {
    const included = burgerIncludedToppings[product.legacyId] ?? [];
    const noOptions = working.filter((option) => option.startsWith("No "));
    const doubleOptions = working.filter((option) => option.startsWith("Double "));
    const addOptions = working.filter((option) => option.startsWith("Add "));
    const allowed = [...noOptions, ...doubleOptions, ...addOptions];

    const removed = noOptions.map((option) => option.slice("No ".length).trim());
    const doubled = doubleOptions.map((option) =>
      stripDisplayedPrice(option.slice("Double ".length))
    );
    const added = addOptions.map((option) =>
      stripDisplayedPrice(option.slice("Add ".length))
    );

    validateUniqueLabels(removed, clientLineKey, issues);
    validateUniqueLabels(doubled, clientLineKey, issues);
    validateUniqueLabels(added, clientLineKey, issues);

    for (const label of removed) {
      if (!included.includes(label)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Cannot remove a topping that is not included: ${label}`
        );
      }
    }

    for (const label of doubled) {
      if (!included.includes(label)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Cannot double a topping that is not included: ${label}`
        );
        continue;
      }
      const topping = optionPriceByLabel(label, burgerToppingOptions);
      if (!topping) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Invalid burger topping: ${label}`
        );
      } else {
        extraPricePence += Math.round(topping.price * 100);
      }
    }

    for (const label of added) {
      const topping = burgerToppingOptions.find(
        (option) =>
          option.label === label &&
          option.standard !== false &&
          !included.includes(option.label)
      );
      if (!topping) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Invalid burger extra: ${label}`
        );
      } else {
        extraPricePence += Math.round(topping.price * 100);
      }
    }

    for (const option of working) {
      if (!allowed.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (product.category === "Loaded Fries") {
    const includedOptions = working.filter((option) =>
      option.startsWith("Included topping: ")
    );
    const extraOptions = working.filter((option) =>
      option.startsWith("Extra topping: ")
    );
    const allowed = [...includedOptions, ...extraOptions];

    if (includedOptions.length !== 1) {
      addIssue(
        issues,
        clientLineKey,
        "MISSING_REQUIRED_OPTION",
        "Loaded Fries requires exactly one included topping."
      );
    }

    const includedLabels = includedOptions.map((option) =>
      option.slice("Included topping: ".length).trim()
    );
    const extraLabels = extraOptions.map((option) =>
      stripDisplayedPrice(option.slice("Extra topping: ".length))
    );
    const allLabels = [...includedLabels, ...extraLabels];

    validateUniqueLabels(allLabels, clientLineKey, issues);

    if (allLabels.some((label) => !buildYourOwnToppings.includes(label))) {
      addIssue(
        issues,
        clientLineKey,
        "INVALID_OPTION",
        "Loaded Fries contains an invalid topping."
      );
    }

    extraPricePence += extraLabels.length * 285;

    for (const option of working) {
      if (!allowed.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (product.category === "Wraps") {
    const removable = new Set([
      "Crispy lettuce",
      "Red onions",
      "Mayonnaise"
    ]);
    const noOptions = working.filter((option) => option.startsWith("No "));
    const friesOptions = working.filter(
      (option) => option === "Add French fries (+£1.50)"
    );
    const allowed = [...noOptions, ...friesOptions];

    const removed = noOptions.map((option) => option.slice("No ".length).trim());
    validateUniqueLabels(removed, clientLineKey, issues);

    if (removed.some((label) => !removable.has(label))) {
      addIssue(
        issues,
        clientLineKey,
        "INVALID_OPTION",
        "Wrap contains an invalid removal."
      );
    }

    if (friesOptions.length > 1) {
      addIssue(
        issues,
        clientLineKey,
        "DUPLICATE_OPTION",
        "French fries can only be added once."
      );
    }

    if (friesOptions.length === 1) extraPricePence += 150;

    for (const option of working) {
      if (!allowed.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (["Cookie Dough", "Brownies", "Fondue"].includes(product.category)) {
    const extraOptions = working.filter((option) => option.startsWith("Extra: "));
    const labels = extraOptions.map((option) =>
      stripDisplayedPrice(option.slice("Extra: ".length))
    );
    validateUniqueLabels(labels, clientLineKey, issues);

    for (const label of labels) {
      const extra = optionPriceByLabel(label, dessertExtraOptions);
      if (!extra) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Invalid dessert extra: ${label}`
        );
      } else {
        extraPricePence += Math.round(extra.price * 100);
      }
    }

    for (const option of working) {
      if (!extraOptions.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (product.legacyId === 406) {
    const includedDipOptions = working.filter((option) =>
      option.startsWith("Included dip: ")
    );

    if (includedDipOptions.length !== 1) {
      addIssue(
        issues,
        clientLineKey,
        "MISSING_REQUIRED_OPTION",
        "Chicken Strip Dippers requires one included dip."
      );
    } else {
      const label = includedDipOptions[0]
        .slice("Included dip: ".length)
        .trim();
      if (!kebabDips.some((dip) => dip.label === label)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          "Chicken Strip Dippers contains an invalid dip."
        );
      }
    }

    for (const option of working) {
      if (!includedDipOptions.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  if (product.legacyId === 604 || product.legacyId === 605) {
    const servingOptions = working.filter((option) =>
      option.startsWith("Serve with: ")
    );

    if (servingOptions.length !== 1) {
      addIssue(
        issues,
        clientLineKey,
        "MISSING_REQUIRED_OPTION",
        "This dessert requires one serving choice."
      );
    } else {
      const choice = servingOptions[0].slice("Serve with: ".length).trim();
      if (!dessertServingChoices.has(choice)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          "This dessert contains an invalid serving choice."
        );
      }
    }

    for (const option of working) {
      if (!servingOptions.includes(option)) {
        addIssue(
          issues,
          clientLineKey,
          "INVALID_OPTION",
          `Unsupported option: ${option}`
        );
      }
    }

    return { issues, extraPricePence };
  }

  for (const option of working) {
    addIssue(
      issues,
      clientLineKey,
      "INVALID_OPTION",
      `This product does not support option: ${option}`
    );
  }

  return { issues, extraPricePence };
}

export async function validateBasket(
  inputLines: BasketValidationInputLine[]
): Promise<BasketValidationResult> {
  const issues: BasketValidationIssue[] = [];
  const validatedLines: ValidatedBasketLine[] = [];

  if (inputLines.length === 0) {
    return { valid: true, subtotalPence: 0, lines: [], issues: [] };
  }

  const db = getDb();
  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(and(eq(restaurants.slug, RESTAURANT_SLUG), eq(restaurants.active, true)))
    .limit(1);

  if (!restaurant) {
    throw new Error("Star Pizza restaurant record is not available.");
  }

  const requested = inputLines.map((line) => {
    const alias = quickUpsellAliases[line.itemId];
    return {
      ...line,
      canonicalItemId: alias?.canonicalItemId ?? line.itemId,
      defaultVariant: alias?.defaultVariant
    };
  });

  const canonicalIds = Array.from(
    new Set(requested.map((line) => line.canonicalItemId))
  );

  const productRows = await db
    .select({
      productId: products.id,
      legacyId: products.legacyId,
      name: products.name,
      description: products.description,
      basePricePence: products.basePricePence,
      soldOut: products.soldOut,
      active: products.active,
      visible: products.visible,
      category: categories.name
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.restaurantId, restaurant.id),
        inArray(products.legacyId, canonicalIds)
      )
    );

  const productByLegacyId = new Map(
    productRows.map((product) => [product.legacyId, product])
  );

  const productIds = productRows.map((product) => product.productId);
  const variantRows: VariantRow[] = productIds.length
    ? await db
        .select({
          id: productVariants.id,
          productId: productVariants.productId,
          label: productVariants.label,
          pricePence: productVariants.pricePence
        })
        .from(productVariants)
        .where(
          and(
            inArray(productVariants.productId, productIds),
            eq(productVariants.active, true)
          )
        )
    : [];

  const variantsByProduct = new Map<string, VariantRow[]>();
  for (const variant of variantRows) {
    const current = variantsByProduct.get(variant.productId) ?? [];
    current.push(variant);
    variantsByProduct.set(variant.productId, current);
  }

  for (const requestedLine of requested) {
    const lineIssuesStart = issues.length;

    if (
      !Number.isInteger(requestedLine.quantity) ||
      requestedLine.quantity < 1 ||
      requestedLine.quantity > 99
    ) {
      addIssue(
        issues,
        requestedLine.clientLineKey,
        "INVALID_QUANTITY",
        "Quantity must be between 1 and 99."
      );
      continue;
    }

    const product = productByLegacyId.get(requestedLine.canonicalItemId);

    if (!product) {
      addIssue(
        issues,
        requestedLine.clientLineKey,
        "PRODUCT_NOT_FOUND",
        "This product no longer exists."
      );
      continue;
    }

    if (!product.active || !product.visible || product.soldOut) {
      addIssue(
        issues,
        requestedLine.clientLineKey,
        "PRODUCT_UNAVAILABLE",
        `${product.name} is currently unavailable.`
      );
      continue;
    }

    const rawOptions = requestedLine.options.map((option) => option.trim());
    if (
      rawOptions.some((option) => !option || option.length > 180) ||
      rawOptions.length > 40
    ) {
      addIssue(
        issues,
        requestedLine.clientLineKey,
        "INVALID_OPTION",
        "One or more product options are invalid."
      );
      continue;
    }

    const variants = variantsByProduct.get(product.productId) ?? [];
    let unitPricePence = product.basePricePence;
    let configOptions = [...rawOptions];

    if (variants.length > 0) {
      const variantMatches = configOptions.filter((option) =>
        variants.some((variant) => variant.label === option)
      );

      let selectedVariant: VariantRow | undefined;

      if (variantMatches.length === 1) {
        selectedVariant = variants.find(
          (variant) => variant.label === variantMatches[0]
        );
        configOptions = configOptions.filter(
          (option) => option !== variantMatches[0]
        );
      } else if (
        variantMatches.length === 0 &&
        requestedLine.defaultVariant
      ) {
        selectedVariant = variants.find(
          (variant) => variant.label === requestedLine.defaultVariant
        );
      }

      if (!selectedVariant || variantMatches.length > 1) {
        addIssue(
          issues,
          requestedLine.clientLineKey,
          "INVALID_VARIANT",
          `${product.name} requires one valid size or variant.`
        );
        continue;
      }

      unitPricePence = selectedVariant.pricePence;
    }

    const configured = validateConfiguredOptions({
      product,
      options: configOptions,
      clientLineKey: requestedLine.clientLineKey
    });

    issues.push(...configured.issues);

    if (issues.length !== lineIssuesStart) {
      continue;
    }

    unitPricePence += configured.extraPricePence;

    validatedLines.push({
      clientLineKey: requestedLine.clientLineKey,
      requestedItemId: requestedLine.itemId,
      canonicalItemId: requestedLine.canonicalItemId,
      productId: product.productId,
      name: product.name,
      quantity: requestedLine.quantity,
      unitPricePence,
      lineTotalPence: unitPricePence * requestedLine.quantity,
      options: rawOptions
    });
  }

  const subtotalPence = validatedLines.reduce(
    (sum, line) => sum + line.lineTotalPence,
    0
  );

  return {
    valid: issues.length === 0 && validatedLines.length === inputLines.length,
    subtotalPence,
    lines: validatedLines,
    issues
  };
}
