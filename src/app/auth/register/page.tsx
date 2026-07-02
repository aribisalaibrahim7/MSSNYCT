"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2, Shield, Phone, BookOpen, GraduationCap, Users } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [sex, setSex] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        phoneNumber,
        course,
        level,
        sex,
        password,
        role,
      });

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 
                     (typeof err.response?.data === 'string' ? err.response?.data : null) || 
                     "Something went wrong";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-heading font-bold mb-2">Create Account</h1>
      <p className="text-muted-foreground mb-8">Join the MSSN Yabatech community.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Abdullah Yusuf"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number (WhatsApp Preferred)</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="tel"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="+2348000000000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course / Department</label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Computer Science"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <select
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="" disabled>Select Level</option>
                <option value="ND I (100L)">ND I (100L)</option>
                <option value="ND II (200L)">ND II (200L)</option>
                <option value="HND I (300L)">HND I (300L)</option>
                <option value="HND II (400L)">HND II (400L)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sex</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <select
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                role === "STUDENT" ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("LECTURER")}
              className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                role === "LECTURER" ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"
              }`}
            >
              Lecturer
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          disabled={isLoading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
          {!isLoading && <ArrowRight size={20} />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
