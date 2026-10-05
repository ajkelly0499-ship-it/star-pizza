import { NextResponse } from "next/server";
import { validateBasket } from "../../../../server/cart/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !== "backend-phase-2"
  ) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const validPizza = await validateBasket([
    {
      clientLineKey: "phase2-valid-pizza",
      itemId: 1,
      quantity: 1,
      options: ['11" Thin']
    }
  ]);

  const forgedExtra = await validateBasket([
    {
      clientLineKey: "phase2-forged-extra",
      itemId: 1,
      quantity: 1,
      options: ['11" Thin', "Extra: Fake topping (+£0.01)"]
    }
  ]);

  const quickUpsell = await validateBasket([
    {
      clientLineKey: "phase2-upsell-fries",
      itemId: 202,
      quantity: 1,
      options: []
    }
  ]);

  return NextResponse.json({
    ok:
      validPizza.valid &&
      validPizza.subtotalPence === 980 &&
      !forgedExtra.valid &&
      quickUpsell.valid &&
      quickUpsell.subtotalPence === 350,
    validPizza,
    forgedExtra,
    quickUpsell
  });
}
