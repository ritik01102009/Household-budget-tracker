"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { Mail, Phone, MapPin, Clock, Check, Send } from "lucide-react";

export default function Contact() {
  const { addContactMessage } = useAppState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    addContactMessage({ name, email, subject, message });
    setSent(true);
    setName(""); setEmail(""); setSubject(""); setMessage("");
    setTimeout(() => setSent(false), 5000);
  };

  const details = [
    { icon: <Mail className="w-5 h-5 text-emerald-500" />, label: "Email Us", value: "hello@spendsensie.com" },
    { icon: <Phone className="w-5 h-5 text-lime-500" />, label: "Call Us", value: "+1 (888) 555-0199" },
    { icon: <MapPin className="w-5 h-5 text-emerald-500" />, label: "Headquarters", value: "123 Finance Ave, San Francisco, CA 94105" },
    { icon: <Clock className="w-5 h-5 text-lime-500" />, label: "Support Hours", value: "Mon–Fri, 9 AM – 6 PM PST" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">Get in Touch</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
              Have a question, partnership inquiry, or feedback? We would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Contact Details Column */}
            <div className="lg:col-span-4 space-y-6">
              {details.map((d, i) => (
                <div key={i} className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 flex items-start space-x-4 shadow-sm">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex-shrink-0">{d.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{d.label}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{d.value}</p>
                  </div>
                </div>
              ))}

              {/* Simulated Map Embed */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/30 dark:to-brand-900/20 flex items-center justify-center">
                  <div className="text-center text-brand-600 dark:text-brand-400">
                    <MapPin className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-xs font-semibold">San Francisco, CA</p>
                    <p className="text-[10px] text-slate-400 mt-1">123 Finance Avenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-8 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-6">Send Us a Message</h2>

              {sent && (
                <div className="mb-6 p-4 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-2xl text-sm flex items-center space-x-2">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Your message has been sent! We will get back to you within 24 hours.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Partnership Inquiry, Feature Request"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
