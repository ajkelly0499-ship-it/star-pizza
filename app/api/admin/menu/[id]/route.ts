import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../../../server/admin/auth";
import {
  AdminMenuError,
  updateAdminProductAvailability
} from "../../../../../server/admin/menu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const availabilitySchema = z.object({
  soldOut: z.boolean()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json(
      { error: "UNAUTHORISED", message: "Admin sign-in required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const payload = availabilitySchema.parse(await request.json());
    const updated = await updateAdminProductAvailability(id, payload.soldOut);

    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "INVALID_AVAILABILITY", message: "Invalid availability update." },
        { status: 400 }
      );
    }

    if (error instanceof AdminMenuError) {
      return NextResponse.json(
        { error: "MENU_UPDATE_ERROR", message: error.message },
        { status: error.status }
      );
    }

    console.error("Admin menu update failed", error);
    return NextResponse.json(
      { error: "MENU_UPDATE_FAILED", message: "Could not update this menu item." },
      { status: 500 }
    );
  }
}
