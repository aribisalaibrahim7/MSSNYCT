import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent." });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"MSSN Hub" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset your MSSN password",
        html: `<p>Use the link below to reset your password.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    }

    return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent.", resetUrl });
  } catch (error: any) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return new NextResponse(JSON.stringify({ error: error.message || "Failed to reset password" }), { status: 500 });
  }
}
