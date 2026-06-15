import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, phoneNumber } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        profile: {
          create: {
            phoneNumber: phoneNumber || null,
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Send Welcome SMS if phone number is provided
    if (phoneNumber) {
      try {
        await sendSMS(
          phoneNumber,
          `Salaam ${name.split(' ')[0]}, welcome to MSSN Yabatech Digital Hub! Your account has been successfully created. Explore resources at mssnyabatech.org`
        );
      } catch (smsError) {
        console.error("SMS_SENDING_FAILED_BUT_REGISTRATION_CONTINUES:", smsError);
      }
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("REGISTRATION_FULL_ERROR:", error);
    // If it's a Prisma error, log the code
    if (error.code) {
      console.error("PRISMA_ERROR_CODE:", error.code);
    }
    return new NextResponse(JSON.stringify({ error: error.message || "Internal Error" }), { status: 500 });
  }
}
