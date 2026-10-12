"use client";

import React, { useRef, useEffect, useState } from "react";

interface SlideWrapperProps {
  activeKey: string;
  direction: "left" | "right";
  children: React.ReactNode;
}

export function SlideWrapper({ activeKey, direction, children }: SlideWrapperProps) {
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    const enter = direction === "left" ? "slide-in-left" : "slide-in-right";
    setAnimClass(enter);
    const t = setTimeout(() => setAnimClass(""), 350);
    return () => clearTimeout(t);
  }, [activeKey, direction]);

  return (
    <div
      key={activeKey}
      className={`w-full ${animClass}`}
      style={{
        animation: animClass
          ? `${animClass === "slide-in-left" ? "slideInFromRight" : "slideInFromLeft"} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
