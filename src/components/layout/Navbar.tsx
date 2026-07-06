"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Officials", href: "/about/excos" },
  { name: "Resource Vault", href: "/resources" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Support", href: "/support" },
];

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-lg py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-primary/20">
            <Image src="/mssn-logo.jpg" alt="MSSN Logo" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-foreground font-heading font-bold text-lg leading-tight">
              MSSN <span className="text-primary">Yabatech</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Digital Hub</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-border"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">
                  {session.user?.name?.[0]}
                </div>
                Profile
              </Link>
              { (session.user as any)?.role === "ADMIN" && (
                <Link href="/admin" className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all">
                  <ShieldCheck size={20} />
                </Link>
              ) }
              <button 
                onClick={() => signOut()}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all"
                title="Log Out"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
            >
              <User size={16} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-foreground/80 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  className="bg-slate-100 dark:bg-slate-800 py-3 rounded-xl text-center font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-red-500 font-bold py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary text-white py-3 rounded-xl text-center font-bold"
                onClick={() => setIsOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
