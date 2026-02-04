// app/api/profile/check/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const seller = await prisma.seller.findUnique({
    where: { email: (await currentUser())?.emailAddresses[0].emailAddress },
    select: { phoneNumber: true }
  });

  return NextResponse.json({ 
    hasPhone: !!(seller?.phoneNumber && seller.phoneNumber.length >= 8) 
  });
}