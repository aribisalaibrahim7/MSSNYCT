import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, category } = await req.json();

    console.log("SUPPORT_REQUEST_RECEIVED", { name, email, phone, message, category });

    // Save to Database so support tickets are never lost
    const savedRequest = await prisma.supportRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        category,
        message,
      },
    });

    let emailSent = false;
    let emailError = "";

    // Send email using Nodemailer
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
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
        emailSent = true;
      } catch (err: any) {
        console.error("SUPPORT_EMAIL_ERROR", err);
        emailError = err.message || String(err);
      }
    } else {
      console.log("[EMAIL SIMULATION] To: mssnyabatech4@gmail.com | Sub: New Support Request");
    }

    return NextResponse.json({
      success: true,
      requestId: savedRequest.id,
      emailSent,
      warning: emailError ? `Failed to send notification email: ${emailError}` : undefined,
    });
  } catch (error: any) {
    console.error("SUPPORT_API_ERROR", error);
    return NextResponse.json({ error: error.message || "Failed to submit request" }, { status: 500 });
  }
}
