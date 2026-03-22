import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: {
      isSold: false,
      type: "MARKETPLACE",
      title: { contains: q, mode: "insensitive" },
    },
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      images: { take: 1, select: { url: true } },
    },
    take: 5,
    orderBy: { views: "desc" },
  });

  return NextResponse.json(products);
}