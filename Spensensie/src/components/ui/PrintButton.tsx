"use client";

import { Printer } from "lucide-react";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({ label = "Print / Save PDF", className = "" }: PrintButtonProps) {
  return (
    <button
      onClick={() => window.print()}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
        bg-white dark:bg-darkbg-800 hover:bg-slate-50 dark:hover:bg-slate-700/60
        text-sm font-semibold text-slate-700 dark:text-slate-200
        shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${className}`}
      title="Print or save as PDF"
    >
      <Printer className="w-4 h-4 text-emerald-500" />
      <span>{label}</span>
    </button>
  );
}
