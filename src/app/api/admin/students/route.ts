import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
