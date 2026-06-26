import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, category } = await req.json();

    console.log("SUPPORT_REQUEST_RECEIVED", { name, email, phone, message, category });

    // Send email using Nodemailer
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
        from: '"MSSN Hub Support" <' + process.env.SMTP_USER + '>',
        to: 'mssnyabatech4@gmail.com',
        subject: `New Support Request: ${category}`,
        html: `
          <h1>New Support Request</h1>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } else {
      console.log("[EMAIL SIMULATION] To: mssnyabatech4@gmail.com | Sub: New Support Request");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SUPPORT_API_ERROR", error);
    return new NextResponse("Error", { status: 500 });
  }
}
