"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30-15-30z' fill='%23047857' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Empowering the Muslim Student
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6">
            Connecting Faith, <br />
            <span className="text-gradient">Academics & Tech</span>
          </h1>
          
          <p className="text-lg text-foreground/60 mb-8 max-w-lg leading-relaxed">
            The MSSN Yabatech Digital Hub is your centralized platform for spiritual growth, academic resources, and community engagement. Built for the modern student.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/auth/register"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center gap-2 group shadow-xl shadow-primary/20"
            >
              Get Started
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/resources"
              className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-border px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/80 dark:hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Explore Vault
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:block"
        >
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/5">
             <div className="aspect-square bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center">
                {/* Visual placeholder for the hero image generated earlier */}
                <div className="text-center p-12">
                   <div className="w-24 h-24 bg-primary/20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                      <BookOpen size={48} className="text-primary" />
                   </div>
                   <h3 className="text-2xl font-heading font-bold text-white mb-2">Knowledge is Light</h3>
                   <p className="text-white/60">Integrating traditional values with digital innovation.</p>
                </div>
             </div>
          </div>
          
          {/* Floating Cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Calendar className="text-secondary-foreground" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next Event</p>
              <p className="font-bold text-sm">Dawah Camp</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Hub</p>
              <p className="font-bold text-sm">247 Registered Today</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
