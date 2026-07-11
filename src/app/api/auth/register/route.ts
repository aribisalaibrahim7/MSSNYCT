import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/notifications";
import getSupabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, phoneNumber, course, level, sex } = await req.json();

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
            course: course || null,
            level: level || null,
            sex: sex || null,
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Sync with Supabase Auth for password recovery capabilities
    const supabase = getSupabase();
    if (supabase) {
      try {
        console.log(`Syncing user ${email} with Supabase Auth...`);
        const { error: signUpError } = await supabase.auth.admin.createUser({
          email,
          password, // Store same password in Supabase Auth so it is in sync
          email_confirm: true,
          user_metadata: { name }
        });
        
        if (signUpError) {
          console.error("SUPABASE_SYNC_ERROR during registration", signUpError);
        } else {
          console.log("SUPABASE_SYNC_SUCCESSFUL for", email);
        }
      } catch (supabaseError) {
        console.error("SUPABASE_SYNC_EXCEPTION", supabaseError);
      }
    }

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
