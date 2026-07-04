"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const officials = [
  { name: "Br. Abdulhafeez Oladipupo", role: "Ameer (President)", dept: "Computer Science", initials: "AO", tier: "executive" },
  { name: "Sr. Halimah Mogaji", role: "Ameerah (Female President)", dept: "Food Science & Technology", initials: "HM", tier: "executive" },
  { name: "Br. Abdulsobur Aderohunmu", role: "Naibul Ameer (Vice President)", dept: "Computer Science", initials: "AA", tier: "executive" },
  { name: "Sr. Khadijah Abduljaleel", role: "Naibatul Ameerah (Female VP)", dept: "Nutrition & Dietetics", initials: "KA", tier: "executive" },
  { name: "Br. Uthman Hussein", role: "General Secretary", dept: "Electrical & Electronics Engineering", initials: "UH", tier: "senior" },
  { name: "Sr. Rogeebatul-Khayr Koleoso", role: "Secretary (Sister Circle)", dept: "Quantity Surveying", initials: "RK", tier: "senior" },
  { name: "Br. Abdulmuiz Ashiru", role: "Financial Secretary", dept: "Accounting", initials: "AA", tier: "senior" },
  { name: "Br. Suliamon Abdulkareem", role: "Director of Studies", dept: "Civil Engineering", initials: "SA", tier: "senior" },
  { name: "Br. Suliamon Bashorun", role: "Public Relations Officer", dept: "Graphics", initials: "SB", tier: "officer" },
  { name: "Br. Ibrahim Aribisala", role: "Asst. PRO", dept: "Mechatronics Engineering", initials: "IA", tier: "officer" },
  { name: "Sr. Naimoh Gazali", role: "Female PRO", dept: "Public Administration", initials: "NG", tier: "officer" },
  { name: "Br. Lukmon Adenle", role: "Welfare Officer", dept: "Business Administration", initials: "LA", tier: "officer" },
  { name: "Br. Habeeb Abdulhakeem", role: "Asset Maintenance Officer", dept: "Electrical Engineering", initials: "HA", tier: "officer" },
  { name: "Br. Nurudeen Obitayo", role: "Asst. Asset Maintenance Officer", dept: "Electrical Engineering", initials: "NO", tier: "officer" },
  { name: "Sr. Jelilah Akorede", role: "Business Chairperson", dept: "Food Science & Technology", initials: "JA", tier: "officer" },
  { name: "Br. Yahya", role: "Librarian", dept: "Marketing", initials: "YA", tier: "officer" },
  { name: "Sr. Zainab Abidoye", role: "Female Librarian", dept: "Civil Engineering", initials: "ZA", tier: "officer" },
  { name: "Sr. Rosheedah Abdul-jaleel", role: "Female Editor", dept: "Statistics", initials: "RA", tier: "officer" },
];

const SLIDE_DURATION = 4000;

const tierColors: Record<string, { bg: string; text: string; badge: string }> = {
  executive: { bg: "from-emerald-700 to-emerald-500", text: "text-white", badge: "bg-amber-400 text-amber-900" },
  senior:    { bg: "from-slate-700 to-slate-500",   text: "text-white", badge: "bg-emerald-400 text-emerald-900" },
  officer:   { bg: "from-primary/80 to-primary",    text: "text-white", badge: "bg-white/20 text-white" },
};

function OfficialCard({ official, index }: { official: typeof officials[0]; index: number }) {
  const colors = tierColors[official.tier];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative flex flex-col items-center bg-white dark:bg-slate-900 rounded-[2rem] border border-border shadow-xl hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      {/* Gradient top bar */}
      <div className={`w-full h-1.5 bg-gradient-to-r ${colors.bg}`} />

      {/* Avatar */}
      <div className="mt-6 mb-3">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-2xl font-black text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          {official.initials}
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-6 text-center flex-1 flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${colors.badge} mb-2 self-center`}>
          {official.tier === "executive" ? "⭐ Executive" : official.tier === "senior" ? "Senior" : "Officer"}
        </span>
        <p className="font-heading font-bold text-sm text-foreground leading-snug mb-1">{official.name}</p>
        <p className="text-[11px] font-semibold text-primary leading-tight mb-1.5">{official.role}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">{official.dept}</p>
      </div>
    </motion.div>
  );
}

export default function OfficialsSlider() {
  const CARDS_PER_VIEW = 4; // desktop
  const totalGroups = Math.ceil(officials.length / CARDS_PER_VIEW);
  const [groupIndex, setGroupIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback((dir: number) => {
    setDirection(dir);
    setGroupIndex((prev) => (prev + dir + totalGroups) % totalGroups);
  }, [totalGroups]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => advance(1), SLIDE_DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, advance]);

  const visibleOfficials = officials.slice(
    groupIndex * CARDS_PER_VIEW,
    groupIndex * CARDS_PER_VIEW + CARDS_PER_VIEW,
  );

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section
      className="py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 text-primary px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5">
            ⭐ Leadership 2025/2026
          </span>
          <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4">
            Meet Our Officials
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Serving the MSSN Yabatech community with dedication, knowledge, and Islamic values.
          </p>
        </div>

        {/* Slide area */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={groupIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-5"
            >
              {visibleOfficials.map((official, i) => (
                <OfficialCard key={official.name + i} official={official} index={i} />
              ))}
              {/* Filler cards to keep grid even */}
              {visibleOfficials.length < CARDS_PER_VIEW &&
                Array.from({ length: CARDS_PER_VIEW - visibleOfficials.length }).map((_, i) => (
                  <div key={`filler-${i}`} className="hidden md:block" />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => advance(-1)}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalGroups }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > groupIndex ? 1 : -1); setGroupIndex(i); }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === groupIndex
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => advance(1)}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Counter */}
        <p className="text-center text-slate-500 text-xs mt-5 font-medium">
          {groupIndex * CARDS_PER_VIEW + 1}–{Math.min((groupIndex + 1) * CARDS_PER_VIEW, officials.length)} of {officials.length} officials
        </p>
      </div>
    </section>
  );
}
