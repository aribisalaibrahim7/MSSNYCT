"use client";

import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface AlertConfig {
  title: string;
  message: string;
  type: "success" | "error" | "info";
  onConfirm?: () => void;
}

interface AlertContextType {
  showAlert: (title: string, message: string, type?: "success" | "error" | "info", onConfirm?: () => void) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = (title: string, message: string, type: "success" | "error" | "info" = "info", onConfirm?: () => void) => {
    setAlertConfig({ title, message, type, onConfirm });
  };

  const hideAlert = () => {
    setAlertConfig(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertConfig && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={hideAlert}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              alertConfig.type === "success" 
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-450" 
                : alertConfig.type === "error"
                  ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-450"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-450"
            }`}>
              {alertConfig.type === "success" ? (
                <CheckCircle2 size={32} />
              ) : (
                <AlertCircle size={32} />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{alertConfig.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{alertConfig.message}</p>
            <button 
              onClick={() => {
                if (alertConfig.onConfirm) alertConfig.onConfirm();
                hideAlert();
              }}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
