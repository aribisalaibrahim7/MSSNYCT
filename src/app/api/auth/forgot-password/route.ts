import { NextResponse } from "next/server";
import getSupabase from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Verify user exists in our local Prisma database
    const localUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!localUser) {
      // Return success to prevent email enumeration/discovery attacks
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent." });
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password`;

    const supabase = getSupabase();
    if (!supabase) {
      console.warn("Supabase client not configured; skipping reset send");
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent." });
    }

    // 2. Double check if user is already in Supabase Auth, otherwise create them on-the-fly
    try {
      console.log(`Checking if ${email} exists in Supabase Auth...`);
      // We list users using the admin API to check existence
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        throw listError;
      }

      const existsInSupabase = listData?.users?.some(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!existsInSupabase) {
        console.log(`User ${email} not found in Supabase Auth. Creating on-the-fly...`);
        const tempPassword = Math.random().toString(36).slice(-12) + "A1!";
        const { error: createError } = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { name: localUser.name || "Member" }
        });

        if (createError) {
          console.error("Failed to create user on-the-fly in Supabase:", createError);
        } else {
          console.log(`User ${email} created successfully on-the-fly in Supabase Auth.`);
        }
      }
    } catch (checkError) {
      console.error("Error verifying/creating user in Supabase Auth:", checkError);
      // Continue anyway, as Supabase will throw its own error if resetPasswordForEmail fails
    }

    // 3. Trigger password reset link send via Supabase Auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(String(email), { redirectTo });

    if (error) {
      console.error("SUPABASE_RESET_ERROR", error);
      return NextResponse.json({ error: error.message || "Failed to trigger reset email" }, { status: 400 });
    }

    console.log(`[SUPABASE_RESET_REQUEST] Email: ${email} | Supabase response:`, data);

    return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent." });
  } catch (err: any) {
    console.error("FORGOT_PASSWORD_ERROR", err);
    return NextResponse.json({ error: err.message || "Failed to reset password" }, { status: 500 });
  }
}
