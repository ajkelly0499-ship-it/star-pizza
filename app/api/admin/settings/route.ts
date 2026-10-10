import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../../server/admin/auth";
import {
  StoreSettingsError,
  updateStoreSettings
} from "../../../../server/store/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const slotSchema = z.object({
  enabled: z.boolean(),
  open: timeSchema,
  close: timeSchema
});

const openingHoursSchema = z.object({
  mon: slotSchema,
  tue: slotSchema,
  wed: slotSchema,
  thu: slotSchema,
  fri: slotSchema,
  sat: slotSchema,
  sun: slotSchema
});

const patchSchema = z
  .object({
    orderingPaused: z.boolean().optional(),
    collectionEnabled: z.boolean().optional(),
    deliveryEnabled: z.boolean().optional(),
    prepTimeMinutes: z.number().int().min(5).max(180).nullable().optional(),
    openingHoursEnabled: z.boolean().optional(),
    openingHours: openingHoursSchema.optional()
  })
  .refine((value) => Object.keys(value).length > 0, "No settings supplied.");

export async function PATCH(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json(
      { error: "UNAUTHORISED", message: "Admin sign-in required." },
      { status: 401 }
    );
  }

  try {
    const payload = patchSchema.parse(await request.json());
    const updated = await updateStoreSettings(payload);

    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "INVALID_SETTINGS", message: "Please check the store settings." },
        { status: 400 }
      );
    }

    if (error instanceof StoreSettingsError) {
      return NextResponse.json(
        { error: "STORE_SETTINGS_ERROR", message: error.message },
        { status: error.status }
      );
    }

    console.error("Store settings update failed", error);
    return NextResponse.json(
      { error: "STORE_SETTINGS_FAILED", message: "Could not update store settings." },
      { status: 500 }
    );
  }
}
