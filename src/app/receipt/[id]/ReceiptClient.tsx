"use client";

import { useRef } from "react";
import { format } from "date-fns";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  isPaid: boolean;
  amountPaid: number | null;
  paymentReference: string | null;
  createdAt: Date;
}

export function ReceiptClient({ registration }: { registration: Registration }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Back to Profile
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-border rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Printer size={16} /> Print
            </button>
            {/* NOTE: html2pdf needs to be installed, or we can just stick to window.print(). Let's use window.print() for simplicity if html2pdf is missing, but we installed it? We didn't. I'll omit html2pdf if not installed. Let's just use window.print which inherently allows downloading as PDF */}
          </div>
        </div>

        {/* Receipt Card */}
        <div 
          ref={receiptRef}
          className="bg-white dark:bg-slate-900 border border-border shadow-sm rounded-3xl overflow-hidden print:shadow-none print:border-none"
        >
          {/* Header */}
          <div className="bg-primary p-8 text-center text-white">
            <h1 className="text-3xl font-heading font-bold mb-2">Payment Receipt</h1>
            <p className="text-primary-foreground/80 font-medium">MSSN Yabatech Digital Hub</p>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-border/50">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Billed To</p>
                <p className="font-bold text-lg">{registration.name}</p>
                <p className="text-muted-foreground">{registration.email}</p>
              </div>
              <div className="md:text-right">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Receipt Number</p>
                <p className="font-mono font-bold">{registration.id.toUpperCase()}</p>
                <p className="text-muted-foreground text-sm">{format(new Date(registration.createdAt), "MMM do, yyyy")}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Event</p>
                <p className="font-bold text-xl">{registration.eventTitle}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Payment Status</p>
                  {registration.isPaid ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">PAID</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">PENDING CASH</span>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Reference</p>
                  <p className="font-mono text-sm font-bold break-all">{registration.paymentReference || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border/50">
              <p className="text-lg font-bold text-muted-foreground">Total Amount</p>
              <p className="text-4xl font-heading font-black text-primary">
                {registration.amountPaid ? `₦${registration.amountPaid.toLocaleString()}` : "FREE"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
