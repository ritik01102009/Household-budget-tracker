"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideWrapperProps {
  children: React.ReactNode;
  activeKey: string;
  direction?: "left" | "right" | "up";
  className?: string;
}

const variants = {
  enter: (direction: string) => ({
    x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    y: direction === "up" ? 30 : 0,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1], // Custom smooth cubic bezier
    },
  },
  exit: (direction: string) => ({
    x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
    y: direction === "up" ? -30 : 0,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  }),
};

export function SlideWrapper({ children, activeKey, direction = "left", className = "" }: SlideWrapperProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={activeKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function FadeInStagger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
