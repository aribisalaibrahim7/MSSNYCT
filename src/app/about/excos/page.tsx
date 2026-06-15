"use client";

import Navbar from "@/components/layout/Navbar";
import { User, ShieldCheck, Mail, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const excos = [
  {
    name: "Br. Abdul-Lateef",
    role: "Ameer (President)",
    dept: "Computer Technology",
  },
  {
    name: "Sr. Zainab",
    role: "Ameerah (Female President)",
    dept: "Food Technology",
  },
  {
    name: "Br. Yusuf",
    role: "General Secretary",
    dept: "Electrical Engineering",
  },
  {
    name: "Br. Ibrahim",
    role: "Public Relations Officer",
    dept: "Mass Communication",
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

export default function ExcosPage() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
       alert("Please login to apply");
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-4">The Leadership Team</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated brothers and sisters serving the MSSN Yabatech branch for the current session.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {excos.map((exco, index) => (
            <div key={index} className="group relative">
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-border shadow-sm group-hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-[2rem] mb-6 overflow-hidden relative">
                     <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <User size={80} strokeWidth={1} />
                     </div>
                  </div>
                  
                  <div className="relative z-10">
                     <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        <ShieldCheck size={14} />
                        {exco.role}
                     </div>
                     <h3 className="text-xl font-heading font-bold mb-1">{exco.name}</h3>
                     <p className="text-sm text-muted-foreground mb-6">{exco.dept}</p>
                     
                     <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                           <Mail size={18} />
                        </button>
                     </div>
                  </div>
               </div>
               <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-emerald-900 to-slate-900 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center md:text-left">
                 <h2 className="text-4xl font-heading font-bold mb-4">Serve Allah, Build Skills</h2>
                 <p className="text-white/70 text-lg">Our committees are looking for 20 dedicated volunteers each to help drive branch activities. Join us today!</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 text-lg hover:-translate-y-1"
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
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border border-border">
             <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-muted-foreground hover:text-black dark:hover:text-white">
                <X size={24} />
             </button>
             
             <h2 className="text-3xl font-heading font-bold mb-2">Committee Application</h2>
             <p className="text-muted-foreground mb-8">Tell us why you'd like to join and which committee fits you best.</p>
             
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
                     <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Committee</label>
                     <select 
                       required
                       className="w-full p-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                       value={selectedCommittee}
                       onChange={(e) => setSelectedCommittee(e.target.value)}
                     >
                        <option value="">Choose a committee...</option>
                        {committees.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Why do you want to join? (Optional)</label>
                     <textarea 
                       className="w-full p-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
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
                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70"
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
