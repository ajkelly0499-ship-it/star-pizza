import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createOrder,
  OrderCreationError
} from "../../../server/orders/create";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lineSchema = z.object({
  clientLineKey: z.string().min(1).max(500),
  itemId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
  options: z.array(z.string().max(180)).max(40)
});

const orderSchema = z.object({
  idempotencyKey: z.string().uuid(),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(7).max(30),
  customerEmail: z
    .string()
    .trim()
    .email()
    .max(200)
    .optional()
    .or(z.literal("")),
  orderType: z.enum(["delivery", "collection"]),
  requestedTimeLabel: z.string().trim().min(1).max(40),
  paymentMethod: z.enum(["ONLINE", "COLLECTION"]),
  delivery: z
    .object({
      postcode: z.string().trim().max(20).optional(),
      addressLine1: z.string().trim().max(150).optional(),
      instructions: z.string().trim().max(500).optional()
    })
    .optional(),
  customerNotes: z.string().trim().max(500).optional(),
  lines: z.array(lineSchema).min(1).max(100)
});

export async function POST(request: Request) {
  try {
    const payload = orderSchema.parse(await request.json());
    const created = await createOrder({
      ...payload,
      customerEmail: payload.customerEmail || null
    });

    return NextResponse.json(created, {
      status: created.replayed ? 200 : 201,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "CHECKOUT_INVALID",
          message:
            error.issues[0]?.message ??
            "Please check your checkout details and try again."
        },
        { status: 400 }
      );
    }

    if (error instanceof OrderCreationError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message
        },
        { status: error.status }
      );
    }

    console.error("Order creation failed", error);
    return NextResponse.json(
      {
        error: "ORDER_CREATE_FAILED",
        message: "We could not create the order. Please try again."
      },
      { status: 500 }
    );
  }
}
