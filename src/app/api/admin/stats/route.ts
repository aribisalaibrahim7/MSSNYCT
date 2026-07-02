import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    const totalResources = await prisma.resource.count();

    const activeEvents = await prisma.event.count({
      where: { date: { gte: new Date() } },
    });

    const pendingSupport = await prisma.committeeApplication.count({
      where: { status: "PENDING" },
    });

    return NextResponse.json({
      totalStudents,
      totalResources,
      activeEvents,
      pendingSupport,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
