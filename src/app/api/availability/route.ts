import { NextResponse, type NextRequest } from "next/server";

import { STAY_ERRORS } from "@/lib/booking/pricing";
import { parseAvailabilityQuery, searchAvailability } from "@/lib/booking/search";

/**
 * GET /api/availability?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&guests=2&promo=DIRECT5
 * Direct rates + inventory for every room type. Used by the home and rooms pages.
 */
export async function GET(request: NextRequest) {
  const query = parseAvailabilityQuery(request.nextUrl.searchParams);
  if (!query) {
    return NextResponse.json({ ok: false, error: STAY_ERRORS.order }, { status: 400 });
  }
  const result = await searchAvailability(query);
  return NextResponse.json(result, {
    status: result.ok ? 200 : 422,
    headers: { "Cache-Control": "no-store" },
  });
}
