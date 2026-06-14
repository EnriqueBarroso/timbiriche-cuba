"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface AnimateOnScrollProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const OFFSET = 24;

function getInitialOffset(direction: Direction) {
  switch (direction) {
    case "up":
      return { y: OFFSET, x: 0 };
    case "down":
      return { y: -OFFSET, x: 0 };
    case "left":
      return { x: OFFSET, y: 0 };
    case "right":
      return { x: -OFFSET, y: 0 };
  }
}

export function AnimateOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  once = true,
  className,
}: AnimateOnScrollProps) {
  const offset = getInitialOffset(direction);

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
