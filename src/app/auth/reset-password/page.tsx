"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  useEffect(() => {
    if (!token || !email) {
      setError("This reset link is invalid or expired.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/reset-password", { email, token, password });
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-heading font-bold mb-2">Reset Password</h1>
      <p className="text-muted-foreground mb-8">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type={showConfirm ? "text" : "password"}
              required
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" /> : "Save Password"}
          {!loading && <ArrowRight size={20} />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/auth/login" className="text-sm text-primary font-semibold hover:underline">Back to login</Link>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading reset form…</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
