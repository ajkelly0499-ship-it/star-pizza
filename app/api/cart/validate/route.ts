import { NextResponse } from "next/server";
import { z } from "zod";
import { validateBasket } from "../../../../server/cart/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const basketLineSchema = z.object({
  clientLineKey: z.string().min(1).max(500),
  itemId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
  options: z.array(z.string().max(180)).max(40)
});

const requestSchema = z.object({
  lines: z.array(basketLineSchema).max(100)
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const result = await validateBasket(body.lines);

    return NextResponse.json(result, {
      status: result.valid ? 200 : 422,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          valid: false,
          subtotalPence: 0,
          lines: [],
          issues: [
            {
              clientLineKey: "",
              code: "INVALID_OPTION",
              message: "Basket payload is invalid."
            }
          ]
        },
        { status: 400 }
      );
    }

    console.error("Basket validation failed", error);
    return NextResponse.json(
      {
        valid: false,
        subtotalPence: 0,
        lines: [],
        issues: [
          {
            clientLineKey: "",
            code: "PRODUCT_UNAVAILABLE",
            message: "Basket validation is temporarily unavailable."
          }
        ]
      },
      { status: 500 }
    );
  }
}
