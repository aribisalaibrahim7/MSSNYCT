"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import OfficialsSlider from "@/components/home/OfficialsSlider";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, ArrowRight, BookOpen, Calendar, Users, Headphones, GraduationCap, Handshake, Mail, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useAlert } from "@/components/providers/AlertProvider";

/* ------------------------------------------------------------------ */
/* Newsletter Form */
/* ------------------------------------------------------------------ */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/newsletter", { email, sendSms: true });
      setIsSubscribed(true);
      showAlert("Subscribed!", "You have successfully subscribed to our newsletter.", "success");
    } catch {
      showAlert("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-white/15 p-6 rounded-2xl backdrop-blur-md border border-white/20 text-white font-bold text-center">
        🎉 Thank you for subscribing!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="bg-white/10 text-white placeholder:text-white/50 px-5 py-4 rounded-2xl outline-none flex-1 border border-white/20 focus:border-white/50 focus:bg-white/15 transition-all"
      />
      <button
        disabled={isLoading}
        className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20 hover:scale-105 active:scale-95"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Subscribe <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Animated counter */
/* ------------------------------------------------------------------ */
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/* FadeInUp wrapper */
/* ------------------------------------------------------------------ */
function FadeInUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature Card */
/* ------------------------------------------------------------------ */
const features = [
  {
    title: "Resource Vault",
    desc: "Access past questions, textbooks, and spiritual lectures — available 24/7.",
    icon: BookOpen,
    href: "/resources",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Digital ID",
    desc: "Generate your membership QR profile and track your academic journey.",
    icon: GraduationCap,
    href: "/profile",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Smart Calendar",
    desc: "Never miss Jumah, orientation, or programme reminders again.",
    icon: Calendar,
    href: "/calendar",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Support Desk",
    desc: "Request academic help or welfare assistance with ease, anytime.",
    icon: Handshake,
    href: "/support",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    title: "Media Archive",
    desc: "Stream 'Scholar in the House' and all recorded public lectures.",
    icon: Headphones,
    href: "/resources?category=Lectures",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    title: "Events Hub",
    desc: "Register for programmes, pay securely, and get instant email confirmation.",
    icon: Users,
    href: "/events",
    gradient: "from-primary to-emerald-600",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <FadeInUp delay={index * 0.07}>
      <Link
        href={feature.href}
        className="group relative flex flex-col p-7 rounded-[2rem] border border-border bg-background hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 h-full overflow-hidden"
      >
        {/* Hover glow */}
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-all duration-500 pointer-events-none`} />

        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={26} className="text-white" />
        </div>
        <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm flex-1">{feature.desc}</p>
        <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
          Explore <ChevronRight size={16} />
        </div>
      </Link>
    </FadeInUp>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Main Page */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({
    membersCount: 500,
    activeCommittees: 12,
    annualProgrammes: 30,
    yearsOfExcellence: 5
  });

  useEffect(() => {
    axios.get("/api/gallery")
      .then((res) => setImages(res.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    axios.get("/api/stats")
      .then((res) => {
        if (res.data) {
          setLiveStats({
            membersCount: res.data.membersCount || 500,
            activeCommittees: res.data.activeCommittees || 12,
            annualProgrammes: res.data.annualProgrammes || 30,
            yearsOfExcellence: res.data.yearsOfExcellence || 5
          });
        }
      })
      .catch((err) => console.error("Failed to load stats", err));
  }, []);

  const statsItems = [
    { value: liveStats.membersCount, suffix: "+", label: "Members Registered" },
    { value: liveStats.activeCommittees, suffix: "", label: "Active Committees" },
    { value: liveStats.annualProgrammes, suffix: "+", label: "Annual Programmes" },
    { value: liveStats.yearsOfExcellence, suffix: "★", label: "Years of Excellence" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* ===== Stats Strip ===== */}
      <section className="py-16 bg-primary relative overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:gap-0 lg:divide-x divide-white/20">
            {statsItems.map((stat, i) => (
              <FadeInUp key={stat.label} delay={i * 0.1} className="text-center px-4">
                <p className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/70 text-xs lg:text-sm font-medium tracking-wide uppercase">{stat.label}</p>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5">
              <Sparkles size={12} /> Everything You Need
            </span>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-4">
              Centralizing the Community
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive digital suite designed to support your spiritual and academic journey at Yabatech.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Officials Slider ===== */}
      <OfficialsSlider />

      {/* ===== Gallery Preview ===== */}
      <section className="py-28 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                📸 Media
              </span>
              <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-3">Life at MSSN Yabatech</h2>
              <p className="text-muted-foreground leading-relaxed">
                Documented moments of spiritual growth, academic excellence, and community bonding.
              </p>
            </div>
            <Link
              href="/gallery"
              className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap"
            >
              View Full Gallery <ArrowRight size={18} />
            </Link>
          </FadeInUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center rounded-[3rem] border border-border border-dashed bg-white/50">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : images.length > 0 ? (
              <>
                <div className="col-span-2 row-span-2 bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative group shadow-xl">
                  <img src={images[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Gallery" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="absolute bottom-6 left-6 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">Latest Activity</p>
                </div>
                {images.slice(1, 4).map((img, i) => (
                  <div key={i} className={`bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative group shadow-xl ${i === 2 ? "col-span-2" : ""}`}>
                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Gallery" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border border-border border-dashed bg-white/50 gap-3">
                <span className="text-4xl">📷</span>
                <p className="text-muted-foreground text-sm font-medium italic">No memories captured yet — check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInUp>
            <div className="bg-gradient-to-br from-primary via-emerald-700 to-slate-900 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="text-white flex-1 text-center md:text-left">
                  <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                    <Mail size={12} /> Newsletter
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-heading font-extrabold mb-3">Stay Enlightened</h2>
                  <p className="text-white/75 leading-relaxed">
                    Subscribe to our monthly newsletter for spiritual reminders, programme updates, and community news.
                  </p>
                </div>
                <div className="w-full md:w-[420px]">
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-14 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                <Image src="/mssn-logo.png" alt="MSSN Logo" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm">MSSN Yabatech</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Digital Hub</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-medium">
              <Link href="/about/excos" className="hover:text-primary transition-colors">Our Officials</Link>
              <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
              <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
              <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
              <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              © 2026 MSSN Yabatech Digital Hub.<br className="hidden sm:block" /> Built with Excellence & Sincerity.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
