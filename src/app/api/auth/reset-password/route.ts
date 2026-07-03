import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return new NextResponse(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record || record.identifier !== email) {
      return new NextResponse(JSON.stringify({ error: "Invalid or expired reset link" }), { status: 400 });
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return new NextResponse(JSON.stringify({ error: "Reset link has expired" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("RESET_PASSWORD_ERROR", error);
    return new NextResponse(JSON.stringify({ error: error.message || "Failed to reset password" }), { status: 500 });
  }
}
