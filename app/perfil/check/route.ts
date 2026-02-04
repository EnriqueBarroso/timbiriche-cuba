// app/perfil/check/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const email = user.emailAddresses[0].emailAddress;

  try {
    const seller = await prisma.seller.upsert({
      where: { email: email },
      update: {},
      create: {
        id: userId,
        email: email,
        storeName: user.firstName || "Mi Tienda",
        avatar: user.imageUrl,
        phoneNumber: "",
        isVerified: false,
      },
      select: {
        id: true,
        email: true,
        storeName: true,
        phoneNumber: true,  // 👈 Devolver el número
        avatar: true,
        isVerified: true,
      }
    });

    return NextResponse.json(seller);  // 👈 Devolver el objeto completo

  } catch (error) {
    console.error("Error en profile check:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}