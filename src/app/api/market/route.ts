import { NextResponse } from "next/server";
import type { TokenResponseData } from "@/features/market/market.type";
import { api } from "@/lib/api-server";

export async function GET() {
  const response = await api.get<{ data: TokenResponseData }>(
    "/defi/v3/token/list",
  );
  return NextResponse.json(response.data);
}
