import { and, eq } from "drizzle-orm";
import { getDb } from "../../db/client";
import { restaurants } from "../../db/schema";

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export type OpeningHoursSlot = {
  enabled: boolean;
  open: string;
  close: string;
};

export type WeeklyOpeningHours = Record<DayKey, OpeningHoursSlot>;

export type StoreSettings = {
  schemaReady: boolean;
  orderingPaused: boolean;
  collectionEnabled: boolean;
  deliveryEnabled: boolean;
  prepTimeMinutes: number | null;
  openingHoursEnabled: boolean;
  openingHours: WeeklyOpeningHours;
};

export type OrderingAvailability = {
  available: boolean;
  reason: string | null;
};

export class StoreSettingsError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

const RESTAURANT_SLUG = "star-pizza-birstall";
const TIMEZONE = "Europe/London";

export const DEFAULT_OPENING_HOURS: WeeklyOpeningHours = {
  mon: { enabled: true, open: "00:00", close: "23:59" },
  tue: { enabled: true, open: "00:00", close: "23:59" },
  wed: { enabled: true, open: "00:00", close: "23:59" },
  thu: { enabled: true, open: "00:00", close: "23:59" },
  fri: { enabled: true, open: "00:00", close: "23:59" },
  sat: { enabled: true, open: "00:00", close: "23:59" },
  sun: { enabled: true, open: "00:00", close: "23:59" }
};

const DEFAULT_SETTINGS: StoreSettings = {
  schemaReady: false,
  orderingPaused: false,
  collectionEnabled: true,
  deliveryEnabled: false,
  prepTimeMinutes: null,
  openingHoursEnabled: false,
  openingHours: DEFAULT_OPENING_HOURS
};

function isMissingSettingsSchema(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: string; message?: string };
  return (
    candidate.code === "42703" ||
    candidate.message?.includes("ordering_paused") === true ||
    candidate.message?.includes("opening_hours_enabled") === true
  );
}

function normaliseOpeningHours(value: unknown): WeeklyOpeningHours {
  if (!value || typeof value !== "object") return DEFAULT_OPENING_HOURS;

  const input = value as Record<string, Partial<OpeningHoursSlot>>;
  const result = { ...DEFAULT_OPENING_HOURS };

  for (const day of DAY_KEYS) {
    const slot = input[day];
    if (!slot) continue;

    result[day] = {
      enabled: typeof slot.enabled === "boolean" ? slot.enabled : true,
      open: typeof slot.open === "string" ? slot.open : "00:00",
      close: typeof slot.close === "string" ? slot.close : "23:59"
    };
  }

  return result;
}

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const db = getDb();

  try {
    const [restaurant] = await db
      .select({
        orderingPaused: restaurants.orderingPaused,
        collectionEnabled: restaurants.collectionEnabled,
        deliveryEnabled: restaurants.deliveryEnabled,
        prepTimeMinutes: restaurants.prepTimeMinutes,
        openingHoursEnabled: restaurants.openingHoursEnabled,
        openingHours: restaurants.openingHours
      })
      .from(restaurants)
      .where(and(eq(restaurants.slug, RESTAURANT_SLUG), eq(restaurants.active, true)))
      .limit(1);

    if (!restaurant) return null;

    return {
      schemaReady: true,
      orderingPaused: restaurant.orderingPaused,
      collectionEnabled: restaurant.collectionEnabled,
      deliveryEnabled: restaurant.deliveryEnabled,
      prepTimeMinutes: restaurant.prepTimeMinutes,
      openingHoursEnabled: restaurant.openingHoursEnabled,
      openingHours: normaliseOpeningHours(restaurant.openingHours)
    };
  } catch (error) {
    if (!isMissingSettingsSchema(error)) throw error;

    const [restaurant] = await db
      .select({ id: restaurants.id })
      .from(restaurants)
      .where(and(eq(restaurants.slug, RESTAURANT_SLUG), eq(restaurants.active, true)))
      .limit(1);

    return restaurant ? DEFAULT_SETTINGS : null;
  }
}

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function localClock(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value.toLowerCase();
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const day = DAY_KEYS.find((key) => weekday?.startsWith(key)) ?? "mon";

  return { day, minutes: hour * 60 + minute };
}

function isWithinOpeningHours(schedule: WeeklyOpeningHours, now = new Date()) {
  const { day, minutes } = localClock(now);
  const dayIndex = DAY_KEYS.indexOf(day);
  const today = schedule[day];

  if (today.enabled) {
    const open = minutesFromTime(today.open);
    const close = minutesFromTime(today.close);

    if (close > open && minutes >= open && minutes < close) return true;
    if (close <= open && minutes >= open) return true;
  }

  const previousDay = DAY_KEYS[(dayIndex + DAY_KEYS.length - 1) % DAY_KEYS.length];
  const previous = schedule[previousDay];

  if (previous.enabled) {
    const open = minutesFromTime(previous.open);
    const close = minutesFromTime(previous.close);

    if (close <= open && minutes < close) return true;
  }

  return false;
}

export function getOrderingAvailability(
  settings: StoreSettings,
  orderType: "collection" | "delivery",
  now = new Date()
): OrderingAvailability {
  if (settings.orderingPaused) {
    return { available: false, reason: "Online ordering is temporarily paused." };
  }

  if (orderType === "collection" && !settings.collectionEnabled) {
    return { available: false, reason: "Collection ordering is currently unavailable." };
  }

  if (orderType === "delivery" && !settings.deliveryEnabled) {
    return { available: false, reason: "Delivery ordering is currently unavailable." };
  }

  if (settings.openingHoursEnabled && !isWithinOpeningHours(settings.openingHours, now)) {
    return { available: false, reason: "Online ordering is currently closed." };
  }

  return { available: true, reason: null };
}

export async function updateStoreSettings(
  patch: Partial<Omit<StoreSettings, "schemaReady">>
): Promise<StoreSettings> {
  const db = getDb();
  const updateValues: {
    updatedAt: Date;
    orderingPaused?: boolean;
    collectionEnabled?: boolean;
    deliveryEnabled?: boolean;
    prepTimeMinutes?: number | null;
    openingHoursEnabled?: boolean;
    openingHours?: WeeklyOpeningHours;
  } = { updatedAt: new Date() };

  if (patch.orderingPaused !== undefined) updateValues.orderingPaused = patch.orderingPaused;
  if (patch.collectionEnabled !== undefined) updateValues.collectionEnabled = patch.collectionEnabled;
  if (patch.deliveryEnabled !== undefined) updateValues.deliveryEnabled = patch.deliveryEnabled;
  if (patch.prepTimeMinutes !== undefined) updateValues.prepTimeMinutes = patch.prepTimeMinutes;
  if (patch.openingHoursEnabled !== undefined) updateValues.openingHoursEnabled = patch.openingHoursEnabled;
  if (patch.openingHours !== undefined) updateValues.openingHours = patch.openingHours;

  try {
    const [updated] = await db
      .update(restaurants)
      .set(updateValues)
      .where(and(eq(restaurants.slug, RESTAURANT_SLUG), eq(restaurants.active, true)))
      .returning({
        orderingPaused: restaurants.orderingPaused,
        collectionEnabled: restaurants.collectionEnabled,
        deliveryEnabled: restaurants.deliveryEnabled,
        prepTimeMinutes: restaurants.prepTimeMinutes,
        openingHoursEnabled: restaurants.openingHoursEnabled,
        openingHours: restaurants.openingHours
      });

    if (!updated) {
      throw new StoreSettingsError("Restaurant is unavailable.", 404);
    }

    return {
      schemaReady: true,
      orderingPaused: updated.orderingPaused,
      collectionEnabled: updated.collectionEnabled,
      deliveryEnabled: updated.deliveryEnabled,
      prepTimeMinutes: updated.prepTimeMinutes,
      openingHoursEnabled: updated.openingHoursEnabled,
      openingHours: normaliseOpeningHours(updated.openingHours)
    };
  } catch (error) {
    if (error instanceof StoreSettingsError) throw error;

    if (isMissingSettingsSchema(error)) {
      throw new StoreSettingsError(
        "Store settings need the database migration before they can be changed.",
        503
      );
    }

    throw error;
  }
}
