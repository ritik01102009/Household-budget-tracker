"use client";

import React from "react";
import { Download, Printer, X, ShieldCheck, TrendingUp, CheckCircle, FileText } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export interface MetricItem {
  label: string;
  value: string;
  sub?: string;
}

export interface DataRow {
  col1: string;
  col2: string;
  col3?: string;
  col4?: string;
}

export interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  metrics: MetricItem[];
  tableHeaders?: string[];
  tableRows?: DataRow[];
  summaryNotes?: string[];
}

export function PdfReportModal({
  isOpen,
  onClose,
  title,
  subtitle,
  metrics,
  tableHeaders,
  tableRows,
  summaryNotes,
}: PdfReportModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportId = `KK-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:block">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                {language === "ja" ? "公式レポート プレビュー" : "Official Report Preview"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === "ja" ? "印刷またはPDFとして保存できます" : "Preview before exporting to PDF or printing"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handlePrintOrDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{language === "ja" ? "PDFダウンロード" : "Download PDF"}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrintOrDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === "ja" ? "印刷する" : "Print"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-white text-slate-900 print:overflow-visible print:p-0 print:bg-white">
          
          {/* Document Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-emerald-500/30 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  <TrendingUp className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">家計管理</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {language === "ja" ? "スマート資産・債務マネジメント システム" : "Wealth & Debt Management Engine"}
              </p>
            </div>

            <div className="text-right space-y-1 text-xs">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>VERIFIED REPORT</span>
              </div>
              <p className="font-bold text-slate-800">{todayStr}</p>
              <p className="text-slate-400 font-mono text-[11px]">ID: {reportId}</p>
            </div>
          </div>

          {/* Title Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Key Metrics Grid */}
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {m.label}
                  </span>
                  <span className="text-xl font-black text-emerald-700 block">
                    {m.value}
                  </span>
                  {m.sub && <span className="text-[10px] text-slate-400 block">{m.sub}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Table Breakdown Section */}
          {tableHeaders && tableRows && tableRows.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                {language === "ja" ? "詳細ブレイクダウン 明細表" : "Detailed Statement & Breakdown"}
              </h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      {tableHeaders.map((h, idx) => (
                        <th key={idx} className="p-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        <td className="p-3 font-semibold text-slate-800">{row.col1}</td>
                        <td className="p-3 text-slate-700">{row.col2}</td>
                        {row.col3 && <td className="p-3 text-slate-700 font-mono">{row.col3}</td>}
                        {row.col4 && <td className="p-3 text-slate-900 font-bold font-mono">{row.col4}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Insights & Action Plan */}
          {summaryNotes && summaryNotes.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <h4 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === "ja" ? "アドバイザー提言 & アクションプラン" : "Strategic Advice & Action Plan"}</span>
              </h4>
              <ul className="space-y-1.5">
                {summaryNotes.map((note, nIdx) => (
                  <li key={nIdx} className="text-xs text-slate-700 font-medium leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Disclaimer & Verification */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© {new Date().getFullYear()} 家計管理 (Kakei Kanri). All rights reserved.</span>
            <span>{language === "ja" ? "暗号化処理済み・データ自己完結型" : "Private & Client-Side Encryption Enabled"}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
