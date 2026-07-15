import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sendReceiptEmail } from "@/lib/receipt";

export async function POST(req: Request) {
  try {
    const {
      eventId, eventTitle, eventPrice, isPaid, paymentReference,
      customerEmail, customerName, phone, department, level, sex,
      paymentMethod = "paystack", paymentStatus = "paid"
    } = await req.json();

    const normalizedMethod = String(paymentMethod || "paystack").toLowerCase();
    const isCashPending = normalizedMethod === "cash";
    let isPaidRegistration = !!isPaid && !isCashPending;
    const normalizedStatus = isCashPending ? "pending" : (paymentStatus || "paid");

    if (!eventId || !eventTitle) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const email = customerEmail || "student@example.com";
    const name   = customerName  || "Guest User";

    console.log("EVENT_REGISTRATION_RECEIVED:", { eventId, eventTitle, isPaid, paymentReference, email });

    // ── Paystack Server-side Verification ────────────────────────────────────
    if (isPaidRegistration && normalizedMethod === "paystack") {
      if (!paymentReference) {
        return new NextResponse(
          JSON.stringify({ error: "Payment reference is required for paid events." }),
          { status: 400 }
        );
      }

      // Check for replay attacks / duplicate reference use
      const existingRef = await prisma.eventRegistration.findFirst({
        where: { paymentReference },
      });
      if (existingRef) {
        return new NextResponse(
          JSON.stringify({ error: "This payment reference has already been used." }),
          { status: 400 }
        );
      }

      const paystackSecret = process.env.PAYSTACK_SECRET_KEY || "sk_test_replace_me_with_your_actual_key";
      try {
        const paystackRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentReference)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!paystackRes.ok) {
          const errText = await paystackRes.text();
          console.error("Paystack registration verify failed:", paystackRes.status, errText);
          return new NextResponse(
            JSON.stringify({ error: "Failed to verify payment with Paystack." }),
            { status: 400 }
          );
        }

        const paystackData = await paystackRes.json();

        if (!paystackData.status || paystackData.data?.status !== "success") {
          return new NextResponse(
            JSON.stringify({ error: "Payment was not successful according to Paystack." }),
            { status: 400 }
          );
        }

        // Verify currency and amount
        const expectedAmountKobo = Number(eventPrice) * 100;
        const actualAmountKobo = paystackData.data.amount;
        const actualCurrency = paystackData.data.currency;

        if (actualCurrency !== "NGN") {
          return new NextResponse(
            JSON.stringify({ error: `Invalid currency: ${actualCurrency}. Expected NGN.` }),
            { status: 400 }
          );
        }

        if (actualAmountKobo < expectedAmountKobo) {
          return new NextResponse(
            JSON.stringify({
              error: `Insufficient amount paid. Paid ₦${(actualAmountKobo / 100).toFixed(2)}, expected ₦${Number(eventPrice).toFixed(2)}.`
            }),
            { status: 400 }
          );
        }

        // Verification succeeded!
        isPaidRegistration = true;
      } catch (verifyError: any) {
        console.error("Paystack transaction verify API error during registration:", verifyError);
        return new NextResponse(
          JSON.stringify({ error: "An error occurred while verifying your payment." }),
          { status: 500 }
        );
      }
    }


    // ── Save to EventRegistration table ──────────────────────────────────────
    let receiptInfo: any = null;
    try {
      const existing = await prisma.eventRegistration.findFirst({
        where: { eventId, email },
      });

      if (!existing) {
        const linkedUser = await prisma.user.findUnique({ where: { email } });

        const created = await prisma.eventRegistration.create({
          data: {
            eventId,
            eventTitle,
            name,
            email,
            phone:            phone            || null,
            department:       department       || null,
            level:            level            || null,
            sex:              sex              || null,
            isPaid:           isPaidRegistration,
            amountPaid:       (isPaidRegistration || isCashPending) && eventPrice ? Number(eventPrice) : null,
            paymentReference: paymentReference || null,
            userId:           linkedUser?.id   ?? null,
          },
        });
        receiptInfo = created;
      } else {
        receiptInfo = existing;
      }
    } catch (dbError) {
      console.error("EventRegistration DB save failed:", dbError);
    }

    // ── Send confirmation emails ─────────────────────────────────────────────
    let emailStatus = "simulated";
    try {
      const emailContent = `
        <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; background-color: #ffffff; border-radius: 16px;">
          <div style="background-color: #047857; color: white; padding: 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Event Registration Confirmed!</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">MSSN Yabatech Digital Hub</p>
          </div>
          <div style="padding: 24px;">
            <p>Salaam <strong>${name}</strong>,</p>
            <p>Your registration for <strong>${eventTitle}</strong> is successfully confirmed!</p>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9;">
              <h3 style="margin: 0 0 12px 0; color: #0f172a;">Event Details:</h3>
              <p style="margin: 6px 0;"><strong>Event:</strong> ${eventTitle}</p>
              <p style="margin: 6px 0;"><strong>Type:</strong> ${isPaid ? "Paid Ticket" : "Free Entry"}</p>
              ${isPaid ? `<p style="margin: 6px 0;"><strong>Amount Paid:</strong> ₦${Number(eventPrice).toLocaleString()}</p>` : ""}
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

        // Email to student
        await transporter.sendMail({
          from: '"MSSN Hub Events" <' + process.env.SMTP_USER + '>',
          to: email,
          subject: `Registration Confirmed: ${eventTitle}`,
          html: emailContent,
        });

        await sendReceiptEmail({
          to: email,
          name,
          eventTitle,
          amountPaid: isPaidRegistration && eventPrice ? Number(eventPrice) : null,
          paymentReference: paymentReference || null,
          paymentMethod: normalizedMethod,
          paymentStatus: isPaidRegistration ? normalizedStatus : "free",
          createdAt: receiptInfo?.createdAt || new Date(),
        });

        // Email to organisation
        await transporter.sendMail({
          from: '"MSSN Hub Events" <' + process.env.SMTP_USER + '>',
          to: "mssnyabatech4@gmail.com",
          subject: `New Event Registration: ${eventTitle}`,
          html: `
            <h3>New Event Registration</h3>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone ?? "N/A"}</p>
            <p><strong>Department:</strong> ${department ?? "N/A"} | <strong>Level:</strong> ${level ?? "N/A"} | <strong>Sex:</strong> ${sex ?? "N/A"}</p>
            <p><strong>Paid/Free:</strong> ${isPaid ? "Paid (₦" + eventPrice + ")" : "Free"}</p>
            <p><strong>Reference:</strong> ${paymentReference ?? "N/A"}</p>
          `,
        });

        emailStatus = "sent";
      } else {
        console.warn("SMTP credentials not configured — emails skipped.");
      }
    } catch (mailError) {
      console.error("Email delivery failed:", mailError);
      emailStatus = "failed";
    }

    return NextResponse.json({ success: true, emailStatus });
  } catch (error: any) {
    console.error("EVENT_REGISTRATION_API_ERROR:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to process registration" }),
      { status: 500 }
    );
  }
}
