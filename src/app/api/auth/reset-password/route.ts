import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import getSupabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const { password, email: reqEmail, token: reqToken } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    let email = "";

    // ── CASE A: Reset via Supabase Auth session (Bearer Token) ─────────────────
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const supabase = getSupabase();
      if (!supabase) {
        return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user || !user.email) {
        return NextResponse.json({ error: "Invalid or expired session. Please try again." }, { status: 401 });
      }

      email = user.email;
    }
    // ── CASE B: Reset via traditional database Token (Fallback) ────────────────
    else {
      if (!reqEmail || !reqToken) {
        return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
      }

      const record = await prisma.verificationToken.findUnique({ where: { token: reqToken } });
      if (!record || record.identifier !== reqEmail) {
        return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
      }

      if (record.expires < new Date()) {
        await prisma.verificationToken.delete({ where: { token: reqToken } });
        return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
      }

      email = reqEmail;
      
      // Cleanup token
      await prisma.verificationToken.delete({ where: { token: reqToken } }).catch(() => {});
    }

    // ── Update Password in Prisma ───────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 500 });
  }
}
