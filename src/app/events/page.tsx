"use client";

import Navbar from "@/components/layout/Navbar";
import { 
  Calendar, MapPin, Clock, Tag, Search, Filter, 
  ChevronRight, Users, Sparkles, AlertCircle, CheckCircle2,
  X, Loader2, CreditCard, Mail, Phone, User, BookOpen, GraduationCap,
  CalendarX, Banknote, Star, Zap
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAlert } from "@/components/providers/AlertProvider";
import { usePaystackPayment } from "react-paystack";

/* ------------------------------------------------------------------ */
/*  Event data                                                          */
/* ------------------------------------------------------------------ */
const now = new Date();
const dawahCampClosed = now > new Date("2026-07-20T23:59:59+01:00");
const dawahCampPrice = now <= new Date("2026-07-05T23:59:59+01:00") ? 3500 : 4000;

const EVENTS = [
  {
    id: "evt_dawah",
    year: 2026, month: "JUL", day: "20", dateObj: new Date("2026-07-20T23:59:59+01:00"),
    title: "Da'wah Camp",
    time: "Day & Night", location: "Yabatech Mosque",
    category: "Retreat",
    summary: "A complete Islamic lifestyle experience retreat.",
    desc: "A much-anticipated spiritual retreat traditionally organized immediately after the first-semester examinations. It is designed to provide complete Islamic lifestyle experiences through day and night sessions.",
    registrationRequired: true, isPaid: true, price: dawahCampPrice,
    hideDate: false, hidePrice: false,
  },
  {
    id: "evt_weekly",
    year: "All", month: "Year", day: "Round", dateObj: new Date("2030-01-01"), // future date so it's open
    title: "Weekly/Monthly Programmes",
    time: "Various", location: "Yabatech Mosque & Open Air",
    category: "Spiritual",
    summary: "Regular classes and open-air lectures.",
    desc: "Regular gatherings include Madrasah and Tahfeedh classes, Fajr Bayan, Fiqh classes, and Open Air Lectures.",
    registrationRequired: false, isPaid: false, price: 0,
    hideDate: true, hidePrice: true,
  },
  {
    id: "evt_freshers",
    year: "—", month: "—", day: "—", dateObj: new Date("2025-01-01"), // past date to auto-close
    title: "Freshers' Orientation Week",
    time: "TBD", location: "Yabatech Campus",
    category: "Academic",
    summary: "Navigating campus life and balancing faith.",
    desc: "Designed to help new students navigate campus life, balance faith with academics, and develop leadership and innovation skills.",
    registrationRequired: true, isPaid: false, price: 0,
    hideDate: true, hidePrice: true,
  },
  {
    id: "evt_ipw",
    year: "—", month: "—", day: "—", dateObj: new Date("2025-01-01"),
    title: "Islamic Propagation Week (IPW)",
    time: "TBD", location: "Yabatech Campus",
    category: "Spiritual",
    summary: "A week-long series of Islamic seminars.",
    desc: "A week-long series of Islamic seminars and lectures. It concludes with an annual conference used to nominate the chapter's new executives.",
    registrationRequired: true, isPaid: false, price: 0,
    hideDate: true, hidePrice: true,
  },
  {
    id: "evt_ccs",
    year: "—", month: "—", day: "—", dateObj: new Date("2025-01-01"),
    title: "Career Counselling Seminar (CCS)",
    time: "TBD", location: "Yabatech Campus",
    category: "Academic",
    summary: "Empowering students with skills and networking.",
    desc: "An annual event focused on empowering students with skills, networking, and professional development.",
    registrationRequired: true, isPaid: false, price: 0,
    hideDate: true, hidePrice: true,
  },
  {
    id: "evt_awards",
    year: "—", month: "—", day: "—", dateObj: new Date("2025-01-01"),
    title: "Academic Awards & Celebrations",
    time: "TBD", location: "Yabatech Campus",
    category: "Social",
    summary: "Celebrating Muslim graduates and executives.",
    desc: "The chapter also hosts events to celebrate Muslim graduates and recognize ex-executives who bag distinctions, encouraging healthy networking.",
    registrationRequired: true, isPaid: false, price: 0,
    hideDate: true, hidePrice: true,
  },
];

/* helpers */
const isClosed = (evt: typeof EVENTS[0]) => evt.dateObj < new Date();
const CATEGORIES = ["All", "Upcoming", "Past", "Academic", "Spiritual", "Social", "Retreat"];

const LEVELS = [
  "ND I (100L)", "ND II (200L)", "HND I (300L)", "HND II (400L)"
];

const DEPARTMENTS = [
  "Computer Science", "Mass Communication", "Business Admin",
  "Accountancy", "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Estate Management", "Architecture",
  "Food Technology", "Library Science", "Statistics",
  "Urban & Regional Planning", "Banking & Finance",
  "Office Technology & Management", "Science Laboratory Technology",
  "Hospitality Management", "Printing Technology", "Other"
];

/* category accent colours */
const categoryColour: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
  Spiritual: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
  Social: "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400",
  Retreat: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
};

/* ------------------------------------------------------------------ */
/*  Floating particle background                                         */
/* ------------------------------------------------------------------ */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.04] dark:opacity-[0.07]"
          style={{
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)",
            left: `${(i * 18) % 90}%`,
            top: `${(i * 23 + 10) % 80}%`,
          }}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 20 * (i % 3 === 0 ? 1 : -1), 0],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated section wrapper                                             */
/* ------------------------------------------------------------------ */
function FadeInUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */
export default function EventsHubPage() {
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const [activeCategory, setActiveCategory] = useState("All");
  const [loadingId, setLoadingId] = useState("");
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState<{ title: string; email: string } | null>(null);
  const [paymentMode, setPaymentMode] = useState<"paystack" | "cash">("paystack");

  /* registration form state */
  const [regForm, setRegForm] = useState({
    fullName: "", department: "", level: "", sex: "", phone: "", email: ""
  });
  const [regLoading, setRegLoading] = useState(false);

  /* Paystack / payment */
  const [paystackEvent, setPaystackEvent] = useState<typeof EVENTS[0] | null>(null);

  const now = new Date();

  const filteredEvents = EVENTS.filter((evt) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Upcoming") return !isClosed(evt);
    if (activeCategory === "Past") return isClosed(evt);
    if (activeCategory === "Paid") return evt.isPaid;
    if (activeCategory === "Free") return !evt.isPaid;
    return evt.category === activeCategory;
  });

  const openCount = EVENTS.filter((e) => !isClosed(e)).length;
  const paidCount = EVENTS.filter((e) => e.isPaid && !isClosed(e)).length;

  /* -------- open registration flow -------- */
  const handleRegisterClick = (evt: typeof EVENTS[0]) => {
    if (isClosed(evt)) return;
    if (!session) {
      showAlert("Login Required", "Please log in to register for events.", "info");
      return;
    }
    if (registeredIds.includes(evt.id)) {
      showAlert("Already Registered", `You are already registered for "${evt.title}".`, "success");
      return;
    }
    // pre-fill email from session
    setRegForm({ fullName: "", department: "", level: "", sex: "", phone: "", email: session.user?.email || "" });
    setSelectedEvent(evt);
    setShowRegForm(true);
  };

  /* -------- submit registration -------- */
  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const { fullName, department, level, sex, phone, email } = regForm;
    if (!fullName || !department || !level || !sex || !phone || !email) {
      showAlert("Incomplete Form", "Please fill in all fields before proceeding.", "error");
      return;
    }

    if (selectedEvent.isPaid && paymentMode === "paystack") {
      setShowRegForm(false);
      setPaystackEvent(selectedEvent);
    } else {
      await processRegistration(selectedEvent, paymentMode === "cash" ? "CASH_PENDING" : "FREE_REG");
    }
  };

  /* -------- core API call -------- */
  const processRegistration = async (evt: typeof EVENTS[0], payRef: string) => {
    setRegLoading(true);
    setLoadingId(evt.id);
    try {
      const res = await axios.post("/api/events/register", {
        eventId: evt.id,
        eventTitle: evt.title,
        eventDate: `${evt.month} ${evt.day}, ${evt.year}`,
        eventLocation: evt.location,
        eventPrice: evt.price,
        isPaid: evt.isPaid,
        paymentReference: payRef,
        paymentMethod: paymentMode,
        paymentStatus: paymentMode === "cash" ? "pending" : "paid",
        customerEmail: regForm.email || session?.user?.email,
        customerName: regForm.fullName || session?.user?.name || "Member",
        department: regForm.department,
        level: regForm.level,
        sex: regForm.sex,
        phone: regForm.phone,
      });

      if (res.status === 200 || res.data?.success !== false) {
        setRegisteredIds((prev) => [...prev, evt.id]);
        setShowRegForm(false);
        setSelectedEvent(null);
        setPaystackEvent(null);
        // Show unique success popup
        setShowSuccess({ title: evt.title, email: regForm.email || session?.user?.email || "" });
      }
    } catch {
      showAlert("Registration Failed", "Something went wrong. Please try again or contact support.", "error");
    } finally {
      setRegLoading(false);
      setLoadingId("");
    }
  };

  /* -------- Paystack Payment Integration -------- */
  const paystackConfig = {
    reference: "MSSN_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    email: regForm.email || session?.user?.email || "student@mssnyabatech.com",
    amount: (paystackEvent?.price || 0) * 100, // Paystack calculates in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_c31f49d32b5f7cf8cf59600e0084c7b80cba000d",
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Event Title",
          variable_name: "event_title",
          value: paystackEvent?.title || "",
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  useEffect(() => {
    if (paystackEvent) {
      initializePayment({
        onSuccess: (res: any) => {
          (async () => {
            if (res.status === "success" || res.message === "Approved") {
              try {
                await axios.post("/api/events/verify-payment", {
                  reference: res.reference,
                  email: regForm.email || session?.user?.email,
                });
              } catch (verifyError) {
                console.error("PAYMENT_VERIFICATION_FAILED", verifyError);
              }
              processRegistration(paystackEvent, res.reference);
            } else {
              showAlert("Payment Failed", "Payment could not be confirmed.", "error");
              setPaystackEvent(null);
            }
          })();
        },
        onClose: () => {
          setPaystackEvent(null);
        }
      });
    }
  }, [paystackEvent]);

  /* ------------------------------------------------------------------ */
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      <FloatingOrbs />
      <Navbar />

      {/* ======================== HERO ======================== */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* gradient accent */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-b-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <FadeInUp>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2 rounded-full text-xs font-bold mb-8 uppercase tracking-widest"
            >
              <Sparkles size={13} className="animate-pulse" />
              MSSN Events Hub — 2026
            </motion.div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 tracking-tight leading-[1.05]">
              Grow, Connect &{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent animate-gradient">
                Elevate
              </span>
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.18}>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              Browse all MSSN Yabatech events, register in seconds, and receive your confirmation instantly via email.
            </p>
          </FadeInUp>

          {/* Stats row */}
          <FadeInUp delay={0.25}>
            <div className="flex flex-wrap justify-center gap-4 mb-14">
              {[
                { icon: Zap, label: "Total Events", value: EVENTS.length },
                { icon: CheckCircle2, label: "Open for Reg.", value: openCount },
                { icon: Banknote, label: "Paid Events", value: paidCount },
                { icon: Star, label: "Year", value: "2026" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-border/60 px-5 py-3 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</p>
                    <p className="font-extrabold text-lg leading-none">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>

          {/* Filter tabs */}
          <FadeInUp delay={0.32}>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer",
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white dark:bg-slate-900 border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ======================== GRID ======================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((evt, i) => {
              const closed = isClosed(evt);
              const registered = registeredIds.includes(evt.id);
              const catCls = categoryColour[evt.category] || "bg-slate-100 text-slate-700";

              return (
                <FadeInUp key={evt.id} delay={i * 0.08}>
                  <motion.div
                    whileHover={!closed ? { y: -6, scale: 1.01 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "relative flex flex-col bg-white dark:bg-slate-900 border rounded-[2.5rem] overflow-hidden shadow-sm h-full",
                      closed
                        ? "border-slate-200 dark:border-slate-800 opacity-70"
                        : "border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300"
                    )}
                  >
                    {/* Decorative top accent */}
                    <div className={cn(
                      "h-1.5 w-full",
                      closed ? "bg-slate-300 dark:bg-slate-700" : "bg-gradient-to-r from-primary via-violet-500 to-primary"
                    )} />

                    {/* Closed banner */}
                    {closed && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/80 dark:bg-slate-950/90 text-slate-300 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm border border-slate-700">
                        <CalendarX size={11} />
                        Closed
                      </div>
                    )}

                    <div className="p-7 flex flex-col flex-1">
                      {/* Date badge */}
                      {!evt.hideDate && (
                        <div className={cn(
                          "self-start flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold mb-5",
                          closed
                            ? "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        )}>
                          <Clock size={12} />
                          {evt.month} {evt.day}, {evt.year} · {evt.time}
                        </div>
                      )}

                      {/* Category & price badges */}
                      <div className={cn("flex flex-wrap gap-2 mb-4", evt.hideDate && "mt-2")}>
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", catCls)}>
                          {evt.category}
                        </span>
                        {!evt.hidePrice && (evt.isPaid ? (
                          <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            ₦{evt.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Free
                          </span>
                        ))}
                      </div>

                      <h3 className={cn(
                        "text-xl font-heading font-bold mb-2 leading-snug",
                        closed ? "text-muted-foreground" : "group-hover:text-primary transition-colors"
                      )}>
                        {evt.title}
                      </h3>

                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        {evt.summary}
                      </p>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                        {evt.desc.slice(0, 110)}…
                      </p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 rounded-2xl border border-border/30">
                        <MapPin size={13} className="text-primary flex-shrink-0" />
                        {evt.location}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => { setSelectedEvent(evt); setShowRegForm(false); }}
                          className="text-primary font-bold flex items-center gap-1 text-sm hover:underline cursor-pointer"
                        >
                          Details <ChevronRight size={15} />
                        </button>

                        <div className="flex gap-2 ml-auto">
                          {closed ? (
                            <span className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-border/40 flex items-center gap-1.5 cursor-not-allowed">
                              <CalendarX size={13} /> Closed
                            </span>
                          ) : !evt.registrationRequired ? (
                            <span className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                              Open Access
                            </span>
                          ) : registered ? (
                            <span className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 size={13} /> Registered
                            </span>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.94 }}
                              onClick={() => handleRegisterClick(evt)}
                              disabled={loadingId === evt.id}
                              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                            >
                              {loadingId === evt.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : evt.isPaid ? (
                                <>Register</>
                              ) : (
                                "Register"
                              )}
                            </motion.button>
                          )}

                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={async () => {
                              const shareData = { title: evt.title, text: `${evt.summary} — ${evt.month} ${evt.day}`, url: window.location.href };
                              if (navigator.share) { await navigator.share(shareData); }
                              else { await navigator.clipboard.writeText(shareData.text + " " + shareData.url); showAlert("Copied!", "Event link copied to clipboard.", "success"); }
                            }}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <Share2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </FadeInUp>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ======================== EVENT DETAIL MODAL ======================== */}
      <AnimatePresence>
        {selectedEvent && !showRegForm && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setSelectedEvent(null); } }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white dark:bg-slate-900 border border-border rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden relative"
            >
              {/* gradient top strip */}
              <div className="h-2 bg-gradient-to-r from-primary via-violet-500 to-primary" />

              <div className="p-8">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground cursor-pointer transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Closed overlay badge */}
                {isClosed(selectedEvent) && (
                  <div className="mb-4 flex items-center gap-2 bg-slate-900 text-slate-300 px-4 py-2.5 rounded-2xl text-xs font-bold w-fit border border-slate-700">
                    <CalendarX size={14} />
                    This programme has concluded
                  </div>
                )}

                {/* Category + price */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className={cn("px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", categoryColour[selectedEvent.category] || "bg-slate-100 text-slate-700")}>
                    {selectedEvent.category}
                  </span>
                  {!selectedEvent.hidePrice && (selectedEvent.isPaid ? (
                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      ₦{selectedEvent.price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Free
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl font-heading font-bold mb-2 leading-tight">{selectedEvent.title}</h2>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{selectedEvent.summary}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{selectedEvent.desc}</p>

                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-border/40 mb-7">
                  {!selectedEvent.hideDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={16} className="text-primary flex-shrink-0" />
                      <span>{selectedEvent.year} {selectedEvent.month} {selectedEvent.day} — {selectedEvent.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-primary flex-shrink-0" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                    <span>Registration: {selectedEvent.registrationRequired ? "Required" : "Open Access"}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isClosed(selectedEvent) ? (
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 text-muted-foreground py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 border border-border">
                      <CalendarX size={16} /> Programme Closed
                    </div>
                  ) : !selectedEvent.registrationRequired ? (
                    <div className="flex-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Open Access
                    </div>
                  ) : registeredIds.includes(selectedEvent.id) ? (
                    <div className="flex-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Already Registered
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleRegisterClick(selectedEvent)}
                      className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {selectedEvent.isPaid && !selectedEvent.hidePrice ? `Register` : "Register Now"}
                    </motion.button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 py-3.5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-border cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================== REGISTRATION FORM MODAL ======================== */}
      <AnimatePresence>
        {showRegForm && selectedEvent && (
          <motion.div
            key="regform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="bg-white dark:bg-slate-900 border border-border rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-violet-600 p-6 relative flex-shrink-0">
                <button
                  onClick={() => { setShowRegForm(false); setSelectedEvent(null); }}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Event Registration</p>
                <h3 className="text-white font-heading font-bold text-xl leading-tight pr-8">{selectedEvent.title}</h3>
                <div className="flex items-center gap-3 mt-3 text-white/80 text-xs">
                  <span className="flex items-center gap-1"><Clock size={11} /> {selectedEvent.month} {selectedEvent.day} · {selectedEvent.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {selectedEvent.location}</span>
                </div>
                {selectedEvent.isPaid && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-200/50 dark:border-amber-900/50 mt-2">
                    ₦{selectedEvent.price.toLocaleString()} — Payment required after this form
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="p-7 overflow-y-auto flex-1">
                <form id="reg-form" onSubmit={handleRegSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <User size={11} /> Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Abdullahi Musa"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground/60"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Mail size={11} /> Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground/60"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Phone size={11} /> Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="08XXXXXXXXX"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, "") })}
                      maxLength={11}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground/60"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <BookOpen size={11} /> Department
                    </label>
                    <select
                      required
                      value={regForm.department}
                      onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    >
                      <option value="">-- Select Department --</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Level */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <GraduationCap size={11} /> Level
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LEVELS.map((l) => (
                        <button
                          type="button"
                          key={l}
                          onClick={() => setRegForm({ ...regForm, level: l })}
                          className={cn(
                            "py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer",
                            regForm.level === l
                              ? "bg-primary/10 border-primary text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-slate-50 dark:bg-slate-800"
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sex */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Users size={11} /> Sex
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Male", "Female"].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRegForm({ ...regForm, sex: s })}
                          className={cn(
                            "py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer",
                            regForm.sex === s
                              ? "bg-primary/10 border-primary text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-slate-50 dark:bg-slate-800"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer CTA */}
              <div className="px-7 pb-7 flex-shrink-0">
                <motion.button
                  type="submit"
                  form="reg-form"
                  whileTap={{ scale: 0.97 }}
                  disabled={regLoading}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {regLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing…</>
                  ) : selectedEvent.isPaid && paymentMode === "paystack" ? (
                    `Continue to Payment · ₦${selectedEvent.price.toLocaleString()}`
                  ) : (
                    "Complete Registration"
                  )}
                </motion.button>
                <p className="text-center text-[11px] text-muted-foreground mt-3">
                  A confirmation summary will be sent to your email address.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ======================== SUCCESS POPUP ======================== */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 w-full max-w-sm text-center shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden"
            >
              {/* Animated top gradient bar */}
              <motion.div
                className="h-2 bg-gradient-to-r from-emerald-400 via-primary to-violet-500"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />

              <div className="p-10">
                {/* Animated checkmark */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                    className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30"
                  >
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                  {/* sparkle ring */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                      style={{ top: "50%", left: "50%", transform: `rotate(${deg}deg) translateY(-42px)` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: "easeOut" }}
                    />
                  ))}
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="text-3xl font-heading font-extrabold mb-2 text-emerald-600 dark:text-emerald-400"
                >
                  You&apos;re In! 🎉
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="text-muted-foreground text-sm leading-relaxed mb-6"
                >
                  Successfully registered for{" "}
                  <span className="font-bold text-foreground">"{showSuccess.title}"</span>.
                </motion.p>

                {/* Email notice block */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="bg-slate-50 dark:bg-slate-800 border border-border/50 rounded-2xl p-4 mb-7 flex items-start gap-3 text-left"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-0.5">Check your inbox</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      A full registration summary has been sent to{" "}
                      <span className="font-semibold text-foreground break-all">{showSuccess.email}</span>
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowSuccess(null)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-primary text-white py-4 rounded-2xl font-bold text-base cursor-pointer hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                >
                  Awesome, Let&apos;s Go!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
