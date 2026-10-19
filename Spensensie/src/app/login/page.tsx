"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { 
  Lock, Mail, ArrowRight, Shield, Check, Info, Sparkles, 
  Chrome, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const { loginUser } = useAppState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password reset state
  const [resetEmail, setResetEmail] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Email verification state
  const [verifyOpen, setVerifyOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Simulate database login
      loginUser(email);
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginUser("google.user@spendsensie.com");
      setLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail) {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setResetOpen(false);
        setResetEmail("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-b from-brand-50/20 to-white dark:from-darkbg-950 dark:to-darkbg-900 transition-colors duration-200">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white dark:bg-darkbg-800 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl p-8 relative overflow-hidden">
            {/* Top Green Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-lime-500" />
            
            <div className="text-center mb-8">
              <span className="inline-flex p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-3">
                <Lock className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Welcome Back</h1>
              <p className="text-slate-400 text-xs mt-1">Log in to manage your budgets and debt schedule</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-450 text-xs flex items-center space-x-2 animate-fade-in-up">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => setResetOpen(true)}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 border-t border-slate-200 dark:border-slate-800 -translate-y-1/2 pointer-events-none" />
              <span className="relative bg-white dark:bg-darkbg-800 px-3 text-xs text-slate-400 font-medium">Or continue with</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-semibold text-sm transition-all flex items-center justify-center space-x-2 text-slate-700 dark:text-slate-350"
            >
              <Chrome className="w-4 h-4 text-emerald-500" />
              <span>Continue with Google</span>
            </button>

            <p className="mt-8 text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-brand-500" />
            <span>Local security sandbox. No data leaves your machine.</span>
          </div>
        </div>
      </main>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {resetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">Reset Password</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your email and we'll send a password recovery token.</p>

              <form onSubmit={handleResetSubmit} className="mt-4 space-y-4">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 text-sm"
                  required
                />
                
                {resetSent ? (
                  <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs flex items-center space-x-1.5">
                    <Check className="w-4 h-4" />
                    <span>Recovery instructions sent successfully!</span>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2 text-sm pt-2">
                    <button
                      type="button"
                      onClick={() => setResetOpen(false)}
                      className="px-4 py-2 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium shadow-md shadow-brand-500/10"
                    >
                      Send Token
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
