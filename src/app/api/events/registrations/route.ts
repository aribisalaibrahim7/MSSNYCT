import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
