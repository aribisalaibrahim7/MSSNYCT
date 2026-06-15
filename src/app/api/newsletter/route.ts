import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/notifications";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("NEWSLETTER_SUBSCRIPTION", email);

    // Try to find if the subscriber is an existing member to send SMS
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (user?.profile?.phoneNumber) {
      await sendSMS(
        user.profile.phoneNumber,
        `Salaam ${user.name}, thank you for subscribing to the MSSN Yabatech Newsletter! You'll now receive updates on branch activities and resources.`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
