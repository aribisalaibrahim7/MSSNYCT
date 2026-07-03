import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendReceiptEmail } from "@/lib/receipt";

export async function GET() {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, isPaid, amountPaid, paymentReference } = await req.json();

    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Registration id is required" }), { status: 400 });
    }

    const registration = await prisma.eventRegistration.update({
      where: { id },
      data: {
        isPaid: Boolean(isPaid),
        amountPaid: amountPaid ?? undefined,
        paymentReference: paymentReference ?? undefined,
      },
    });

    // If marked as paid with a CASH reference, send the receipt email
    if (registration.isPaid && registration.paymentReference?.startsWith("CASH")) {
      try {
        await sendReceiptEmail({
          to: registration.email,
          name: registration.name,
          eventTitle: registration.eventTitle,
          amountPaid: registration.amountPaid,
          paymentReference: registration.paymentReference,
          paymentMethod: "cash",
          paymentStatus: "paid",
          createdAt: registration.createdAt,
        });
      } catch (err) {
        console.error("Failed to send cash receipt email:", err);
      }
    }

    return NextResponse.json(registration);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to update registration" }),
      { status: 500 }
    );
  }
}
