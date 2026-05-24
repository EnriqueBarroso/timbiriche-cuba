import { getProducts } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const products = await getProducts({
      query: q,
      type: "MARKETPLACE",
      limit: 5,
    });

    const results = products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      images: p.images.slice(0, 1).map((img) => ({ url: img.url })),
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
