"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { Search, BookOpen, Clock, User, ArrowRight, Star } from "lucide-react";

export default function BlogGrid() {
  const { blogPosts } = useAppState();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "Budgeting", "Debt Payoff", "Investing", "Saving"];

  // Filter logic
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "ALL" ? true : post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured Post is the first element
  const featuredPost = blogPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id || activeCategory !== "ALL");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              SpendSensie Finance Academy
            </h1>
            <p className="text-sm text-slate-500 mt-1">Master your money. Practical lessons on debt elimination, wealth compounding, and savings hacks.</p>
          </div>

          {/* Search & Categories Bar */}
          <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? "bg-brand-500 text-white font-bold"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Featured Post Highlights */}
          {activeCategory === "ALL" && !search && featuredPost && (
            <div className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 h-64 lg:h-96 relative">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-limebrand-500 text-darkbg-950 font-bold text-[10px] rounded-lg uppercase tracking-wider flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-darkbg-950" />
                  <span>Featured Post</span>
                </span>
              </div>
              <div className="lg:col-span-6 p-6 sm:p-8 space-y-4">
                <span className="text-[10px] text-brand-655 font-bold uppercase tracking-wider bg-brand-500/10 px-2.5 py-1 rounded-full">{featuredPost.category}</span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display leading-snug">{featuredPost.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{featuredPost.excerpt}</p>
                
                <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-semibold pt-2">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-bold text-xs hover:underline"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid list of other articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.length === 0 && !featuredPost && (
              <div className="col-span-full py-12 text-center text-slate-400 italic">No posts found matching search parameters.</div>
            )}
            
            {gridPosts.map((post) => (
              <div 
                key={post.id}
                className="bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 font-bold text-[10px] rounded-lg shadow-sm">{post.category}</span>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-display leading-snug hover:text-brand-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Read
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
