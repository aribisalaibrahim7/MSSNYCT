"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import getSupabaseClient from "@/lib/supabaseClient";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setSupabaseSession(session);
            console.log("Supabase Auth session found on load.");
          }
        }
      } catch (err) {
        console.error("Failed to check Supabase session on client", err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // CASE A: Reset via Supabase Auth Session
      if (supabaseSession) {
        const supabase = getSupabaseClient();
        if (!supabase) {
          throw new Error("Supabase Client configuration error");
        }

        console.log("Updating password in Supabase Auth...");
        const { error: supabaseError } = await supabase.auth.updateUser({ password });
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        console.log("Syncing password update to local database...");
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseSession.access_token}`
          },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to sync password to local database.");
        }

        setSuccess(true);
        // Log user out of Supabase Auth to clean up
        await supabase.auth.signOut().catch(() => {});
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } 
      // CASE B: Reset via Traditional Token (Fallback)
      else {
        if (!token || !email) {
          throw new Error("Missing reset parameters");
        }

        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email, password }),
        });
        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        } else {
          setError(data.error || "Something went wrong.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary mb-3" size={24} />
        <p className="text-sm text-muted-foreground">Verifying link authenticity...</p>
      </div>
    );
  }

  if (!supabaseSession && (!token || !email)) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Invalid Link</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This password reset link is invalid, expired, or missing required parameters.
        </p>
        <Link href="/auth/forgot-password" className="text-sm font-semibold text-primary hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Password reset successful</h3>
        <p className="text-sm text-muted-foreground mb-6">
          You can now log in with your new password. Redirecting you to login...
        </p>
        <Link href="/auth/login" className="text-sm font-semibold text-primary hover:underline">
          Go to login now
        </Link>
      </motion.div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          New password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full pl-10 pr-10 px-3 py-2.5 border border-border rounded-xl shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-slate-50 dark:bg-slate-950"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 font-medium text-center bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset password"}
        </button>
      </div>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-primary mb-8 hover:underline">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <h2 className="text-center text-3xl font-heading font-bold text-foreground">Set new password</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-border">
          <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
