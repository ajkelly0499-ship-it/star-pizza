import { NextResponse } from "next/server";
import {
  getOrderingAvailability,
  getStoreSettings
} from "../../../../server/store/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getStoreSettings();

    if (!settings) {
      return NextResponse.json({ error: "Restaurant unavailable." }, { status: 503 });
    }

    const collection = getOrderingAvailability(settings, "collection");
    const delivery = getOrderingAvailability(settings, "delivery");

    return NextResponse.json(
      {
        orderingPaused: settings.orderingPaused,
        collectionEnabled: settings.collectionEnabled,
        deliveryEnabled: settings.deliveryEnabled,
        prepTimeMinutes: settings.prepTimeMinutes,
        openingHoursEnabled: settings.openingHoursEnabled,
        collectionAccepting: collection.available,
        deliveryAccepting: delivery.available,
        collectionMessage: collection.reason,
        deliveryMessage: delivery.reason
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Store status failed", error);
    return NextResponse.json({ error: "Store status unavailable." }, { status: 500 });
  }
}
