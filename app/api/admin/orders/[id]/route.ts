import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  verifyAdminSessionToken
} from "../../../../../server/admin/auth";
import {
  AdminOrderError,
  updateAdminOrderStatus
} from "../../../../../server/admin/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "NEW",
    "ACCEPTED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED"
  ])
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
    const payload = statusSchema.parse(await request.json());
    const updated = await updateAdminOrderStatus(id, payload.status);

    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "INVALID_STATUS", message: "Invalid order status." },
        { status: 400 }
      );
    }

    if (error instanceof AdminOrderError) {
      return NextResponse.json(
        { error: "ORDER_STATUS_ERROR", message: error.message },
        { status: error.status }
      );
    }

    console.error("Admin order update failed", error);
    return NextResponse.json(
      { error: "ORDER_STATUS_FAILED", message: "Could not update this order." },
      { status: 500 }
    );
  }
}
