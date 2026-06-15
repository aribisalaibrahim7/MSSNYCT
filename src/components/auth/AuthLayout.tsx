"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full -ml-40 -mb-40 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-heading font-bold">MSSN <span className="text-primary">Yabatech</span></span>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-border shadow-2xl">
          {children}
        </div>
      </motion.div>
    </main>
  );
}
