import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ isAdmin: false });
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const adminStatus = isAdmin(userEmail);

  return NextResponse.json({ isAdmin: adminStatus });
}