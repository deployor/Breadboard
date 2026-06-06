"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "2xl";
  tone?: "red" | "light";
};

const widthClass = {
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
};

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  maxWidth = "lg",
  tone = "light",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousActive =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";
    window.setTimeout(() => panelRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousActive?.focus();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] isolate flex h-[100dvh] w-[100dvw] items-center justify-center bg-black/75 px-6 py-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative z-10 flex max-h-[calc(100dvh-48px)] w-full ${widthClass[maxWidth]} flex-col overflow-hidden rounded-[18px] border-2 border-black bg-white shadow-[10px_10px_0_#BD0F32] outline-none`}
      >
        <div
          className={`border-b-2 border-black p-6 ${
            tone === "red"
              ? "bg-[#BD0F32] text-white"
              : "bg-[#f4f4f4] text-black"
          }`}
        >
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-65">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={titleId} className="mt-2 text-5xl font-black leading-none">
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
          {children}
        </div>
        {footer ? (
          <div className="border-t-2 border-black bg-[#f4f4f4] p-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
