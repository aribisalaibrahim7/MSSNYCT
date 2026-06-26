import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { eventId, eventTitle, eventPrice, isPaid, paymentReference, customerEmail, customerName, phone, department, level, sex } = await req.json();

    if (!eventId || !eventTitle) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const email = customerEmail || "student@example.com";
    const name = customerName || "Guest User";

    console.log("EVENT_REGISTRATION_RECEIVED:", { eventId, eventTitle, isPaid, paymentReference, email });

    // Try to save to database if database is connected, otherwise proceed gracefully
    try {
      // Find or create a user in the database to link the registration to (or just log it)
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Create an Event in the DB if it doesn't exist
        let event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          event = await prisma.event.create({
            data: {
              id: eventId,
              title: eventTitle,
              date: new Date(),
              description: `Registration for ${eventTitle}`,
            }
          });
        }

        // Link user to event using EventNotification or implicit relation
        await prisma.eventNotification.upsert({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId: event.id,
            }
          },
          update: {},
          create: {
            userId: user.id,
            eventId: event.id,
          }
        });
      }
    } catch (dbError) {
      console.error("Database registration save skipped (Database offline):", dbError);
    }

    // Send emails using Nodemailer
    let emailStatus = "simulated";
    try {
      const emailContent = `
        <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded-2xl; background-color: #ffffff;">
          <div style="background-color: #047857; color: white; padding: 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Event Registration Confirmed!</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">MSSN Yabatech Digital Hub</p>
          </div>
          <div style="padding: 24px;">
            <p>Salaam <strong>${name}</strong>,</p>
            <p>Your registration for the event <strong>${eventTitle}</strong> is successfully confirmed!</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9;">
              <h3 style="margin: 0 0 12px 0; color: #0f172a;">Event Details:</h3>
              <p style="margin: 6px 0;"><strong>Event:</strong> ${eventTitle}</p>
              <p style="margin: 6px 0;"><strong>Type:</strong> ${isPaid ? "Paid Ticket" : "Free Entry"}</p>
              ${isPaid ? `<p style="margin: 6px 0;"><strong>Amount Paid:</strong> ₦${eventPrice.toLocaleString()}</p>` : ""}
              ${paymentReference ? `<p style="margin: 6px 0;"><strong>Ref:</strong> ${paymentReference}</p>` : ""}
              <p style="margin: 6px 0;"><strong>Status:</strong> Completed</p>
            </div>
            
            <p>Please check the Events Hub page inside your account dashboard for any further schedule updates or reminders.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated email from MSSN Yabatech Digital Hub.</p>
          </div>
        </div>
      `;

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

        // Send to student
        await transporter.sendMail({
          from: '"MSSN Hub Events" <' + process.env.SMTP_USER + '>',
          to: email,
          subject: `Registration Confirmed: ${eventTitle}`,
          html: emailContent,
        });

        // Send to organization
        await transporter.sendMail({
          from: '"MSSN Hub Events" <' + process.env.SMTP_USER + '>',
          to: 'mssnyabatech4@gmail.com',
          subject: `New Event Registration: ${eventTitle}`,
          html: `
            <h3>New Event Registration</h3>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Department:</strong> ${department} | <strong>Level:</strong> ${level} | <strong>Sex:</strong> ${sex}</p>
            <p><strong>Paid/Free:</strong> ${isPaid ? "Paid (₦" + eventPrice + ")" : "Free"}</p>
            <p><strong>Reference:</strong> ${paymentReference}</p>
          `,
        });

        emailStatus = "sent";
      } else {
        console.warn("SMTP credentials not found. Emails not sent.");
      }
    } catch (mailError) {
      console.error("Email delivery failed:", mailError);
      emailStatus = "failed";
    }

    return NextResponse.json({ success: true, emailStatus });
  } catch (error: any) {
    console.error("EVENT_REGISTRATION_API_ERROR:", error);
    return new NextResponse(JSON.stringify({ error: error.message || "Failed to process registration" }), { status: 500 });
  }
}
