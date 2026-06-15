"use client";

import Navbar from "@/components/layout/Navbar";
import { HelpCircle, Book, Heart, Send, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function SupportPage() {
  const [category, setCategory] = useState("Academic Help");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        category,
      };
      
      await axios.post("/api/support", data);
      setIsSubmitted(true);
    } catch (err) {
      alert("Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Info */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6">Support Desk</h1>
            <p className="text-muted-foreground text-lg mb-12">
              The MSSN Yabatech branch is here to support you. Whether it's academic struggles or welfare needs, don't hesitate to reach out.
            </p>

            <div className="space-y-6">
              <div className="flex gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <Book size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Academic Assistance</h3>
                  <p className="text-sm text-muted-foreground">Get linked with tutors, study groups, or access specific department resources.</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                  <Heart size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Welfare Support</h3>
                  <p className="text-sm text-muted-foreground">Financial aid requests, food support, or counseling in times of difficulty.</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">General Inquiries</h3>
                  <p className="text-sm text-muted-foreground">Questions about branch activities, masjid programs, or membership.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 flex gap-4">
               <AlertCircle className="text-amber-600 shrink-0" size={24} />
               <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  Privacy Notice: All welfare requests are handled with the utmost confidentiality by the Welfare Committee.
               </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-border shadow-2xl relative z-10">
              {isSubmitted ? (
                <div className="text-center py-12">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                      <Send size={40} />
                   </div>
                   <h2 className="text-3xl font-heading font-bold mb-4">Request Sent!</h2>
                   <p className="text-muted-foreground mb-8">Your request has been received. A representative will contact you within 24-48 hours via email or phone.</p>
                   <button 
                     onClick={() => setIsSubmitted(false)}
                     className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
                   >
                     Send Another Request
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-heading font-bold mb-8">Submit a Request</h2>
                  
                  <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    {["Academic Help", "Welfare Aid"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setCategory(opt)}
                        className={cn(
                          "py-3 rounded-xl text-sm font-bold transition-all",
                          category === opt ? "bg-white dark:bg-slate-700 shadow-md text-primary" : "text-muted-foreground"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="e.g. Abdullah Yusuf"
                        className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold mb-2 block">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          placeholder="abdullah@example.com"
                          className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-2 block">Phone Number</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          placeholder="08012345678"
                          className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block">Description of Need</label>
                      <textarea 
                        name="message"
                        required
                        rows={4}
                        placeholder="Please provide details about how we can help you..."
                        className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Submit Request"}
                    {!isLoading && <Send size={20} />}
                  </button>
                </form>
              )}
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </main>
  );
}
