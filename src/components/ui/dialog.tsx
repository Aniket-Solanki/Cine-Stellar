// Custom glassmorphic Modal/Dialog component featuring Framer Motion spring fade-in and scale transitions.
"use client";

import React, { createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface DialogContextProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a Dialog provider");
  }
  return context;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <DialogContext.Provider value={{ isOpen, onClose }}>
      <AnimatePresence>{isOpen && children}</AnimatePresence>
    </DialogContext.Provider>
  );
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function DialogContent({ children, className, showCloseButton = true }: DialogContentProps) {
  const { onClose } = useDialog();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
      />

      {/* Dialog container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.45 }}
        className={twMerge(
          clsx(
            "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel text-left shadow-2xl z-10 p-6 md:p-8 no-scrollbar",
            className
          )
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={twMerge(clsx("mb-4", className))}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={twMerge(clsx("text-xl md:text-2xl font-bold text-white tracking-tight", className))}>
      {children}
    </h3>
  );
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={twMerge(clsx("text-sm text-zinc-400 mt-1", className))}>{children}</p>;
}
