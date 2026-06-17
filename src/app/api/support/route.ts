import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, category } = await req.json();

    console.log("SUPPORT_REQUEST_RECEIVED", { name, email, phone, message, category });

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'MSSN Hub Support <support@xauxenae.resend.app>',
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
