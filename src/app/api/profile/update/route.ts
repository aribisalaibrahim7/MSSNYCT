import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const data = await req.json();
    const userId = (session.user as any).id;

    // Update User Name if provided
    if (data.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name }
      });
    }

    // Update Profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        phoneNumber: data.phoneNumber,
        department: data.department,
        level: data.level,
        matricNo: data.matricNo,
        skills: data.skills
      },
      update: {
        phoneNumber: data.phoneNumber,
        department: data.department,
        level: data.level,
        matricNo: data.matricNo,
        skills: data.skills
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
