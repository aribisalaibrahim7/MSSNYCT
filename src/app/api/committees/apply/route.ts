import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { committeeName, reason } = await req.json();

    // Check count for this committee
    const count = await prisma.committeeApplication.count({
      where: { committeeName }
    });

    if (count >= 20) {
      return new NextResponse("Committee is full (Max 20 members)", { status: 400 });
    }

    // Check if user already applied
    const existing = await prisma.committeeApplication.findUnique({
      where: {
        userId_committeeName: {
          userId: (session.user as any).id,
          committeeName
        }
      }
    });

    if (existing) {
      return new NextResponse("You have already applied for this committee", { status: 400 });
    }

    const application = await prisma.committeeApplication.create({
      data: {
        userId: (session.user as any).id,
        committeeName,
        reason
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("COMMITTEE_APPLY_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
