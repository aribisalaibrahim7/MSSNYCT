"use client";

import Navbar from "@/components/layout/Navbar";
import { User, ShieldCheck, Mail, Loader2, CheckCircle2, AlertCircle, X, ChevronRight, Heart } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAlert } from "@/components/providers/AlertProvider";
import Image from "next/image";

interface ExcoMember {
  name: string;
  role: string;
  dept: string;
  image?: string;
  category: "presidency" | "secretariat" | "officers";
}

const excos: ExcoMember[] = [
  // Presidency
  {
    name: "Br. Abdulhafeez Oladipupo",
    role: "Ameer (President)",
    dept: "Computer Science",
    image: "/officials/ameer.png",
    category: "presidency",
  },
  {
    name: "Sr. Halimah Mogaji",
    role: "Ameerah (Female President)",
    dept: "Food Science and Technology",
    image: "/officials/ameerah.png",
    category: "presidency",
  },
  {
    name: "Br. Abdulsobur Aderohunmu",
    role: "Naibul Ameer (Vice President)",
    dept: "Computer Science",
    category: "presidency",
  },
  {
    name: "Sr. Khadijah Abduljaleel",
    role: "Naibatul Ameerah (Female Vice President)",
    dept: "Nutrition and Dietetics",
    category: "presidency",
  },
  
  // Secretariat & Finance
  {
    name: "Br. Uthman Hussein",
    role: "General Secretary",
    dept: "Electrical and Electronics Engineering",
    category: "secretariat",
  },
  {
    name: "Sr. Rogeebatul-Khayr Koleoso",
    role: "Secretary Sister Circle",
    dept: "Quantity Surveying",
    category: "secretariat",
  },
  {
    name: "Br. Abdulmuiz Ashiru",
    role: "Financial Secretary",
    dept: "Accounting",
    category: "secretariat",
  },
  {
    name: "Br. Suliamon Bashorun",
    role: "Public Relations Officer",
    dept: "Graphics",
    category: "secretariat",
  },
  {
    name: "Br. Ibrahim Aribisala",
    role: "Assistant Public Relations Officer",
    dept: "Mechatronics Engineering",
    category: "secretariat",
  },
  {
    name: "Sr. Naimoh Gazali",
    role: "Female Public Relations Officer",
    dept: "Public Administration",
    category: "secretariat",
  },

  // Officers
  {
    name: "Br. Suliamon Abdulkareem",
    role: "Director of Studies",
    dept: "Civil Engineering",
    category: "officers",
  },
  {
    name: "Br. Lukmon Adenle",
    role: "Welfare Officer",
    dept: "Business Administration",
    category: "officers",
  },
  {
    name: "Br. Awwal Bello",
    role: "Assistant Welfare Officer",
    dept: "Welding and Fabrication",
    category: "officers",
  },
  {
    name: "Sr. Mujeedah Mustapha",
    role: "Female Welfare Officer",
    dept: "Welding and Fabrication",
    category: "officers",
  },
  {
    name: "Sr. Mariam Bello",
    role: "Assistant Female Welfare Officer",
    dept: "Business Administration",
    category: "officers",
  },
  {
    name: "Br. Habeeb Abdulhakeem",
    role: "Asset Maintenance Officer",
    dept: "Electrical and Electronics Engineering",
    category: "officers",
  },
  {
    name: "Br. Nurudeen Obitayo",
    role: "Assistant Asset Maintenance Officer",
    dept: "Electrical and Electronics Engineering",
    category: "officers",
  },
  {
    name: "Br. Yahya",
    role: "Librarian",
    dept: "Marketing",
    category: "officers",
  },
  {
    name: "Sr. Zainab Abidoye",
    role: "Female Librarian",
    dept: "Civil Engineering",
    category: "officers",
  },
  {
    name: "Sr. Rosheedah Abdul-jaleel",
    role: "Female Editor",
    dept: "Statistics",
    category: "officers",
  },
  {
    name: "Sr. Jelilah Akorede",
    role: "Business Chairperson",
    dept: "Food Science and Technology",
    category: "officers",
  },
  {
    name: "Sr. Faidah Popoola",
    role: "Business Chairperson",
    dept: "Photography",
    category: "officers",
  },
];

const committees = [
  "Welfare Committee",
  "Academic Committee",
  "Media & Publicity",
  "Secretariat",
  "Dawah Committee",
  "Organizing Committee"
];

function getInitials(name: string) {
  // strip titles like "Br." or "Sr."
  const cleanName = name.replace(/^(Br\.|Sr\.)\s+/, "");
  const parts = cleanName.split(" ");
  return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function ExcoCard({ exco }: { exco: ExcoMember }) {
  const isSister = exco.name.startsWith("Sr.") || exco.role.toLowerCase().includes("female") || exco.role.toLowerCase().includes("ameerah");
  const fallbackGradient = isSister 
    ? "from-indigo-600 to-purple-500 text-white" 
    : "from-emerald-700 to-teal-500 text-white";

  return (
    <div className="group relative">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-border shadow-sm group-hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
        <div>
          {/* Portrait Container */}
          <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 rounded-2xl mb-5 overflow-hidden relative shadow-inner">
            {exco.image ? (
              <Image 
                src={exco.image} 
                alt={exco.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} flex flex-col items-center justify-center p-4`}>
                <span className="text-4xl font-extrabold tracking-wider opacity-90 mb-2">{getInitials(exco.name)}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">MSSN Executive</span>
              </div>
            )}
            
            {/* Soft overlay tag */}
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-[10px] text-white font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              {isSister ? "Sister" : "Brother"}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary dark:text-emerald-400 uppercase tracking-widest">
              <ShieldCheck size={12} />
              {exco.role}
            </span>
            <h3 className="text-lg font-heading font-extrabold text-foreground leading-snug group-hover:text-primary transition-colors">
              {exco.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {exco.dept || "Yaba College of Technology"}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/50 flex gap-2">
          <a 
            href={`mailto:${exco.name.toLowerCase().replace(/[^a-z]/g, "")}@mssnyabatech.org`}
            className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300"
            title={`Contact ${exco.name}`}
          >
            <Mail size={15} />
          </a>
        </div>
      </div>
      {/* Glow effect on hover */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/10 to-teal-500/10 rounded-[2.2rem] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
}

export default function ExcosPage() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { showAlert } = useAlert();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      showAlert("Authentication Required", "Please log in to apply for committees.", "info");
      return;
    }
    
    setIsSubmitting(true);
    setStatus("idle");
    
    try {
      await axios.post("/api/committees/apply", {
        committeeName: selectedCommittee,
        reason
      });
      setStatus("success");
      setTimeout(() => {
        setShowModal(false);
        setStatus("idle");
        setSelectedCommittee("");
        setReason("");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.response?.data || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presidencyExcos = excos.filter(e => e.category === "presidency");
  const secretariatExcos = excos.filter(e => e.category === "secretariat");
  const officerExcos = excos.filter(e => e.category === "officers");

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        
        {/* Elegant Wording / Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Heart size={12} className="fill-current text-primary animate-pulse" /> Servants of the Community
          </span>
          <h1 className="text-4xl lg:text-6xl font-heading font-black tracking-tight text-foreground mb-6">
            The Executive Council
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
            The Prophet Muhammad (peace be upon him) said: <span className="italic font-medium text-foreground">"Each of you is a shepherd and each of you is responsible for his flock."</span> (Al-Bukhari).
          </p>
          <p className="text-sm md:text-base text-muted-foreground/85 leading-relaxed">
            Leadership in Islam is a sacred trust (Amanah) and a call to service (Khidmah). Meet the dedicated team of brothers and sisters volunteering their time, skills, and energy to support the spiritual growth and academic success of all Muslim students at Yaba College of Technology.
          </p>
        </div>

        {/* presidency section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8 border-b border-border/80 pb-4">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground">The Presidency</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {presidencyExcos.map((exco, index) => (
              <ExcoCard key={exco.name + index} exco={exco} />
            ))}
          </div>
        </section>

        {/* secretariat section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8 border-b border-border/80 pb-4">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground">Secretariat & Finance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secretariatExcos.map((exco, index) => (
              <ExcoCard key={exco.name + index} exco={exco} />
            ))}
          </div>
        </section>

        {/* officers section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8 border-b border-border/80 pb-4">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground">Operational & Welfare Officers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officerExcos.map((exco, index) => (
              <ExcoCard key={exco.name + index} exco={exco} />
            ))}
          </div>
        </section>

        {/* Volunteer/Committee Banner */}
        <div className="mt-24 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="bg-white/10 border border-white/20 text-white py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
                Join Us
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Serve Allah, Build Skills</h2>
              <p className="text-white/80 text-base leading-relaxed">
                Volunteering with the executive council is a fantastic opportunity to earn rewards while gaining valuable team coordination, leadership, and digital skills. Apply to join our committees today!
              </p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-white text-emerald-950 px-10 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl shadow-black/25 text-lg hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              Volunteer Now
            </button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-border">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-muted-foreground hover:text-black dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
             
            <h2 className="text-2xl md:text-3xl font-heading font-black mb-2">Committee Application</h2>
            <p className="text-muted-foreground text-sm mb-6">Tell us why you'd like to join and which committee fits you best.</p>
             
            {status === "success" ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                <p className="text-muted-foreground">Jazakumullahu Khayran. The Secretariat will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Committee</label>
                  <select 
                    required
                    className="w-full p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    value={selectedCommittee}
                    onChange={(e) => setSelectedCommittee(e.target.value)}
                  >
                    <option value="">Choose a committee...</option>
                    {committees.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why do you want to join? (Optional)</label>
                  <textarea 
                    className="w-full p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
                    placeholder="Tell us about your skills and motivation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                
                {status === "error" && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={18} />
                    {errorMessage}
                  </div>
                )}
                
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
