import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Live count of registered users (students)
    const membersCount = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    // We have 6 committees in the system (or 12 including sub-groups, so we can return a baseline of 12 or make it live)
    // Let's make it live by counting distinct committeeName from applications, or return 12 as baseline
    const distinctApps = await prisma.committeeApplication.groupBy({
      by: ["committeeName"],
    });
    const activeCommittees = Math.max(12, distinctApps.length); // Baseline 12 as requested

    // Live count of events/programmes in database + baseline of 30 standard annual ones
    const dbEventsCount = await prisma.eventRegistration.groupBy({
      by: ["eventId"],
    });
    const annualProgrammes = Math.max(30, 30 + dbEventsCount.length); // Baseline 30+ as requested

    return NextResponse.json({
      membersCount: Math.max(500, 500 + membersCount), // Starts at 500+ and increments as new users register
      activeCommittees,
      annualProgrammes,
      yearsOfExcellence: 5,
    });
  } catch (error: any) {
    console.error("PUBLIC_STATS_ERROR", error);
    // Return baseline if DB query fails to keep UI functional
    return NextResponse.json({
      membersCount: 500,
      activeCommittees: 12,
      annualProgrammes: 30,
      yearsOfExcellence: 5,
    });
  }
}
