import { NextRequest, NextResponse } from "next/server";
import { getVIPWithPagination } from "@/services/vip/vipService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";

    const result = getVIPWithPagination({
      page,
      pageSize,
      search,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching VIP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch VIP data" },
      { status: 500 }
    );
  }
}
