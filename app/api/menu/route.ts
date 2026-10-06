import { NextResponse } from "next/server";
import { getPublicMenu } from "../../../server/menu/service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const menu = await getPublicMenu("star-pizza-birstall");

    if (!menu) {
      return NextResponse.json(
        { error: "Restaurant menu not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(menu, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60"
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    if (message.includes("DATABASE_URL")) {
      return NextResponse.json(
        { error: "Database is not configured." },
        { status: 503 }
      );
    }

    console.error("Failed to load public menu.");
    return NextResponse.json(
      { error: "Unable to load menu." },
      { status: 500 }
    );
  }
}
