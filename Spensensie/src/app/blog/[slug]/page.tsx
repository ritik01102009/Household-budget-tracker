import React from "react";
import BlogPostClient from "./blog-post-client";

export function generateStaticParams() {
  return [
    { slug: "5-steps-first-budget" },
    { slug: "snowball-vs-avalanche-debt" },
    { slug: "power-of-compound-interest" },
  ];
}

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  return <BlogPostClient initialSlug={params?.slug} />;
}
