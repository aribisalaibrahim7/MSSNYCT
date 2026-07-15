import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, email } = await req.json();

    if (!reference) {
      return new NextResponse(JSON.stringify({ error: "Reference is required" }), { status: 400 });
    }

    // ── Verify with Paystack API ─────────────────────────────────────────────
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || "sk_test_replace_me_with_your_actual_key";
    
    console.log("VERIFYING_PAYMENT_WITH_PAYSTACK:", { reference, email });

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
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
      console.error("Paystack API call failed:", paystackRes.status, errText);
      return NextResponse.json(
        { success: false, message: "Paystack API returned an error" },
        { status: 400 }
      );
    }

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json({
        success: false,
        message: paystackData.message || "Transaction was not successful on Paystack",
      });
    }

    // ── Check if registration exists and update it ───────────────────────────
    const registration = await prisma.eventRegistration.findFirst({
      where: { paymentReference: reference },
    });

    if (registration) {
      if (registration.email !== email && email) {
        return NextResponse.json({ success: false, message: "Email mismatch" });
      }

      const updated = await prisma.eventRegistration.update({
        where: { id: registration.id },
        data: {
          isPaid: true,
          amountPaid: registration.amountPaid ?? (paystackData.data.amount / 100),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment verified and updated in database",
        registration: updated,
      });
    }

    // If registration is not created yet (normal in current client workflow),
    // return success. The client will immediately call the registration endpoint.
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully on Paystack",
    });
  } catch (error: any) {
    console.error("VERIFY_PAYMENT_ERROR:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to verify payment" }),
      { status: 500 }
    );
  }
}

