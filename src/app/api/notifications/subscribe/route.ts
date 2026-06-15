import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { eventId, type } = await req.json(); // type can be 'GENERAL' or 'SPECIFIC_EVENT'

    if (type === 'GENERAL') {
      // Logic for general notifications (maybe update a flag on profile)
      await prisma.profile.update({
        where: { userId: (session.user as any).id },
        data: { skills: "NOTIFICATIONS_ENABLED" } // Using skills as a temp flag if no boolean exists
      });
    } else {
      await prisma.eventNotification.create({
        data: {
          userId: (session.user as any).id,
          eventId: eventId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTIFICATION_SUBSCRIBE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
