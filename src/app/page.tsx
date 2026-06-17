"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useAlert } from "@/components/providers/AlertProvider";

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
      showAlert("Subscribed!", "You have successfully subscribed to our newsletter and broadcast updates.", "success");
    } catch (err) {
      showAlert("Error", "Something went wrong. Please check your network connection and try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 text-white font-bold">
        🎉 Thank you for subscribing!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
      <input 
        type="email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address" 
        className="bg-transparent text-white placeholder:text-white/60 px-4 py-3 outline-none flex-1 min-w-[250px]"
      />
      <button 
        disabled={isLoading}
        className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Subscribe"}
      </button>
    </form>
  );
}

export default function Home() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("/api/gallery");
        setImages(res.data.slice(0, 4)); // Get first 4 images
      } catch (err) {
        console.error("Gallery preview fetch failed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">Centralizing the Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive suite of tools designed to support your spiritual and academic journey at Yabatech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Resource Vault" 
              desc="Access past questions, textbooks, and spiritual lectures 24/7." 
              icon="📚"
              href="/resources"
            />
            <FeatureCard 
              title="Digital ID" 
              desc="Generate your membership profile and track your growth." 
              icon="🆔"
              href="/auth/register"
            />
            <FeatureCard 
              title="Smart Calendar" 
              desc="Never miss an event with automated Jumah and orientation alerts." 
              icon="📅"
              href="/calendar"
            />
            <FeatureCard 
              title="Support Desk" 
              desc="Request academic help or welfare assistance with ease." 
              icon="🤝"
              href="/support"
            />
            <FeatureCard 
              title="Media Archive" 
              desc="Stream 'Scholar in the House' and other public lectures." 
              icon="🎥"
              href="/resources?category=Lectures"
            />
            <FeatureCard 
              title="Academic Hub" 
              desc="Collaborate with peers and access department-specific study groups." 
              icon="🎓"
              href="/resources?category=Textbooks"
            />
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">Life at MSSN Yabatech</h2>
              <p className="text-muted-foreground">
                Documented moments of spiritual growth, academic excellence, and community bonding.
              </p>
            </div>
            <Link href="/gallery" className="text-primary font-bold flex items-center gap-2 hover:underline">
              View Full Gallery <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
             {isLoading ? (
               <div className="col-span-full flex items-center justify-center bg-white/50 rounded-[3rem] border border-border border-dashed">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
               </div>
             ) : images.length > 0 ? (
               <>
                 <div className="col-span-2 row-span-2 bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative group shadow-xl">
                    <img src={images[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Gallery" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="absolute bottom-6 left-6 text-white font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">Latest Activity</p>
                 </div>
                 {images.slice(1, 4).map((img, i) => (
                    <div key={i} className={`bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative group shadow-xl ${i === 2 ? 'col-span-2' : ''}`}>
                       <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Gallery" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                 ))}
               </>
             ) : (
               <div className="col-span-full flex items-center justify-center bg-white/50 rounded-[3rem] border border-border border-dashed">
                  <p className="text-muted-foreground italic">No memories captured yet.</p>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="text-white flex-1 text-center md:text-left">
                   <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Stay Enlightened</h2>
                   <p className="text-white/80">Subscribe to our monthly newsletter for spiritual reminders and hub updates.</p>
                </div>
                <div className="w-full md:w-auto">
                   <NewsletterForm />
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
               </div>
               <span className="font-heading font-bold">MSSN Yabatech</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
               <Link href="/about/excos" className="hover:text-primary">Our Officials</Link>
               <Link href="/resources" className="hover:text-primary">Resources</Link>
               <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 MSSN Yabatech Digital Hub. Built with Excellence.</p>
         </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, desc, icon, href }: { title: string, desc: string, icon: string, href: string }) {
  return (
    <Link href={href} className="block p-8 rounded-3xl border border-border bg-background hover:border-primary/50 transition-all group hover:shadow-xl hover:shadow-primary/5">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-heading font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </Link>
  );
}
