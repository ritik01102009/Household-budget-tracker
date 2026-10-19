"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppState } from "@/lib/store";
import { ArrowLeft, Clock, User, Calendar, BookOpen, AlertCircle } from "lucide-react";

export default function BlogPostClient({ initialSlug }: { initialSlug?: string }) {
  const params = useParams();
  const router = useRouter();
  const { blogPosts } = useAppState();

  const slug = (params?.slug as string) || initialSlug;

  // Find current post
  const post = blogPosts.find((p) => p.slug === slug);

  // Find related posts (same category, excluding current post)
  const relatedPosts = React.useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter((p) => p.category === post.category && p.id !== post.id)
      .slice(0, 2);
  }, [blogPosts, post]);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-darkbg-950">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border shadow-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900 font-display">Article Not Found</h1>
            <p className="text-xs text-slate-500">The personal finance article you are looking for does not exist or has been deleted.</p>
            <Link href="/blog" className="inline-flex items-center space-x-2 text-brand-600 font-semibold text-sm hover:underline pt-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog Academy</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-darkbg-950 transition-colors duration-200">
        <article className="max-w-3xl mx-auto bg-white dark:bg-darkbg-800 border border-slate-205 dark:border-slate-805 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Article Banner Image */}
          <div className="h-64 sm:h-96 w-full relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            
            {/* Breadcrumb back */}
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 px-3.5 py-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Article Body Container */}
          <div className="p-6 sm:p-10 space-y-6">
            <span className="text-[10px] text-brand-655 font-bold uppercase tracking-wider bg-brand-500/10 px-2.5 py-1 rounded-full">{post.category}</span>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
              {post.title}
            </h1>

            {/* Meta Attributes */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Published by: {post.author}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Reading Time: {post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Date: {new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Full text markup renderer */}
            <div className="text-slate-655 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {post.content}
            </div>

          </div>
        </article>

        {/* Related Articles Drawer Panel */}
        {relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <span>Related Articles</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div key={rel.id} className="bg-white dark:bg-darkbg-800 border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-[9px] text-brand-655 font-bold uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded-full">{rel.category}</span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 font-display line-clamp-1">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{rel.excerpt}</p>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="inline-flex items-center space-x-1 text-brand-655 font-semibold text-[11px] mt-3 hover:underline"
                  >
                    <span>Read post</span>
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
