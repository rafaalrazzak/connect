"use client";

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  children: React.ReactNode;
  className?: string;
  closeable?: boolean;
}

export function Modal({
  showModal,
  setShowModal,
  className,
  children,
  closeable = true,
}: ModalProps) {
  // Close on escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeable) {
        setShowModal(false);
      }
    },
    [setShowModal, closeable]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  return (
    <AnimatePresence>
      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
          <DialogContent
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-0 shadow-lg",
              className
            )}
          >
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
