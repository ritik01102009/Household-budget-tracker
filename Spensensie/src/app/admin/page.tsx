"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import {
  LayoutDashboard, Users, FileText, MessageSquare, HelpCircle,
  Settings, Plus, Trash2, Check, Edit2, X, Eye, EyeOff
} from "lucide-react";

type AdminTab = "overview" | "blogs" | "messages" | "faqs" | "settings";

export default function AdminPanel() {
  const {
    user, transactions, goals, blogPosts, addBlogPost, deleteBlogPost,
    contactMessages, markMessageRead, faqs, addFAQ, deleteFAQ
  } = useAppState();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Blog form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Budgeting");
  const [blogAuthor, setBlogAuthor] = useState(user?.name || "Admin");
  const [blogSaved, setBlogSaved] = useState(false);

  // FAQ form state
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [faqCat, setFaqCat] = useState("General");

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    addBlogPost({
      slug: blogTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: blogTitle,
      excerpt: blogExcerpt || blogContent.slice(0, 100) + "...",
      content: blogContent,
      category: blogCategory,
      author: blogAuthor,
      readTime: `${Math.max(1, Math.ceil(blogContent.split(" ").length / 200))} min read`,
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    });
    setBlogTitle(""); setBlogExcerpt(""); setBlogContent("");
    setBlogSaved(true);
    setTimeout(() => setBlogSaved(false), 3000);
  };

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ || !faqA) return;
    addFAQ({ question: faqQ, answer: faqA, category: faqCat });
    setFaqQ(""); setFaqA("");
  };

  // KPIs
  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const unreadCount = contactMessages.filter(m => !m.isRead).length;

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "blogs", label: "Blog Manager", icon: <FileText className="w-4 h-4" /> },
    { id: "messages", label: `Messages (${unreadCount})`, icon: <MessageSquare className="w-4 h-4" /> },
    { id: "faqs", label: "FAQ Manager", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "settings", label: "Site Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-darkbg-950">
          <div className="text-center max-w-md bg-white dark:bg-darkbg-800 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <Settings className="w-12 h-12 text-slate-300 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Admin Access Required</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              This panel is restricted to administrators. Visit your Dashboard Profile Settings and switch your role to <strong>Administrator</strong> to access this area.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center space-x-2">
              <Settings className="w-8 h-8 text-brand-500" />
              <span>Admin Console</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage blog content, contact queries, FAQs, and platform analytics.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-darkbg-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Transactions", value: transactions.length, color: "text-brand-600 dark:text-brand-400" },
                  { label: "Total Income", value: `$${totalIncome.toLocaleString()}`, color: "text-emerald-600" },
                  { label: "Total Expenses", value: `$${totalExpense.toLocaleString()}`, color: "text-rose-500" },
                  { label: "Active Goals", value: goals.length, color: "text-lime-600" },
                  { label: "Blog Posts", value: blogPosts.length, color: "text-brand-600 dark:text-brand-400" },
                  { label: "Unread Messages", value: unreadCount, color: "text-amber-600" },
                  { label: "FAQs", value: faqs.length, color: "text-emerald-600" },
                  { label: "Net Balance", value: `$${(totalIncome - totalExpense).toLocaleString()}`, color: "text-brand-600 dark:text-brand-400" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{kpi.label}</p>
                    <p className={`text-2xl font-extrabold mt-1 ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Messages preview */}
              <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white font-display mb-4">Recent Contact Queries</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {contactMessages.slice(0, 3).map((m) => (
                    <div key={m.id} className="py-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.subject}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.name} · {m.email}</p>
                      </div>
                      {!m.isRead && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded-full">Unread</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BLOG MANAGER TAB */}
          {activeTab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* New Post Form */}
              <div className="lg:col-span-6 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white font-display mb-5">Publish New Article</h3>

                {blogSaved && (
                  <div className="mb-4 p-3 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs flex items-center space-x-1.5">
                    <Check className="w-4 h-4" />
                    <span>Article published successfully!</span>
                  </div>
                )}

                <form onSubmit={handlePublishPost} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Title</label>
                    <input type="text" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} placeholder="Article headline" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Category</label>
                      <select value={blogCategory} onChange={e => setBlogCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none">
                        <option>Budgeting</option>
                        <option>Debt Payoff</option>
                        <option>Investing</option>
                        <option>Saving</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Author</label>
                      <input type="text" value={blogAuthor} onChange={e => setBlogAuthor(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Short Excerpt</label>
                    <input type="text" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} placeholder="One-sentence summary (optional)" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Article Body</label>
                    <textarea value={blogContent} onChange={e => setBlogContent(e.target.value)} placeholder="Write your article content here..." rows={8} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none resize-none" required />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-brand-500/15 flex items-center justify-center space-x-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Publish Article</span>
                  </button>
                </form>
              </div>

              {/* Published Posts List */}
              <div className="lg:col-span-6 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white font-display mb-5">Published Articles ({blogPosts.length})</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-xl">
                      <div className="max-w-[80%]">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{post.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{post.category} · {post.author} · {post.readTime}</p>
                      </div>
                      <button onClick={() => deleteBlogPost(post.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/20 text-rose-500 rounded-lg flex-shrink-0" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white font-display mb-5">Contact Message Inbox ({contactMessages.length})</h3>
              <div className="space-y-4">
                {contactMessages.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-8">No messages received yet.</p>
                )}
                {contactMessages.map((msg) => (
                  <details key={msg.id} className={`group rounded-xl border p-4 transition-colors ${msg.isRead ? "border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/30" : "border-amber-400/30 bg-amber-500/5"}`}>
                    <summary className="flex items-start justify-between cursor-pointer list-none">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{msg.subject}</p>
                          {!msg.isRead && <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full">NEW</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{msg.name} &lt;{msg.email}&gt; · {new Date(msg.createdAt).toLocaleDateString()}</p>
                      </div>
                      {!msg.isRead && (
                        <button onClick={() => markMessageRead(msg.id)} className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex-shrink-0 ml-2" title="Mark as read">
                          Mark Read
                        </button>
                      )}
                    </summary>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">{msg.message}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === "faqs" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Add FAQ */}
              <div className="lg:col-span-5 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white font-display mb-5">Add New FAQ Entry</h3>
                <form onSubmit={handleAddFAQ} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Category</label>
                    <select value={faqCat} onChange={e => setFaqCat(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none">
                      <option>General</option>
                      <option>Calculators</option>
                      <option>Features</option>
                      <option>Billing</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Question</label>
                    <input type="text" value={faqQ} onChange={e => setFaqQ(e.target.value)} placeholder="Enter the FAQ question" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Answer</label>
                    <textarea value={faqA} onChange={e => setFaqA(e.target.value)} placeholder="Enter the detailed answer" rows={4} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none resize-none" required />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-brand-500/15 flex items-center justify-center space-x-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                </form>
              </div>

              {/* FAQ List */}
              <div className="lg:col-span-7 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white font-display mb-5">All FAQs ({faqs.length})</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {faqs.map((f) => (
                    <div key={f.id} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-xl gap-4">
                      <div className="flex-grow">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{f.question}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{f.answer}</p>
                        <span className="text-[9px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">{f.category}</span>
                      </div>
                      <button onClick={() => deleteFAQ(f.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/20 text-rose-500 rounded-lg flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-lg">
              <h3 className="font-bold text-slate-900 dark:text-white font-display mb-6">Platform Configuration</h3>
              <div className="space-y-5">
                {[
                  { label: "Maintenance Mode", desc: "Take the platform offline for updates", checked: false },
                  { label: "New User Registrations", desc: "Allow new accounts to be created", checked: true },
                  { label: "Blog Comments", desc: "Enable public commenting on articles", checked: true },
                  { label: "Analytics Tracking", desc: "Collect anonymized usage metrics", checked: true },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{setting.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{setting.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={setting.checked} className="w-4 h-4 accent-emerald-500 rounded" />
                  </div>
                ))}
                <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm">
                  Save Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
