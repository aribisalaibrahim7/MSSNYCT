import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, email } = await req.json();

    if (!reference) {
      return new NextResponse(JSON.stringify({ error: "Reference is required" }), { status: 400 });
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: { paymentReference: reference },
    });

    if (!registration) {
      return NextResponse.json({ success: false, message: "Registration not found" });
    }

    if (registration.email !== email && email) {
      return NextResponse.json({ success: false, message: "Email mismatch" });
    }

    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { isPaid: true, amountPaid: registration.amountPaid ?? 0 },
    });

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message || "Failed to verify payment" }), { status: 500 });
  }
}
