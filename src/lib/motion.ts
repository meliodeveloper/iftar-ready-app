// Shared motion presets for consistent animations
import type { Variants, Transition } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const pageTransitionProps = {
  initial: "initial" as const,
  animate: "animate" as const,
  exit: "exit" as const,
  variants: pageTransition,
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export const pressable = {
  whileTap: { scale: 0.98 },
  transition: spring,
};

export const cardHover = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.985 },
  transition: spring,
};
