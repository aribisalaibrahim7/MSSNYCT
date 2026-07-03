import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    return NextResponse.json(registration);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to update registration" }),
      { status: 500 }
    );
  }
}
