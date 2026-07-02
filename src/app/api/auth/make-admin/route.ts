import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/auth/make-admin  { email: "your@email.com", secret: "MSSN_ADMIN_2026" }
export async function POST(req: Request) {
  try {
    const { email, secret } = await req.json();

    if (secret !== "MSSN_ADMIN_2026") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
