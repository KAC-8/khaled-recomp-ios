import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApp } from "../lib/store";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className={`arrow ${className}`}
      size={19}
    />
  );
}
export function Action({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "secondary" : ""}`} to={to}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="signal" />
      {children}
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 tabIndex={-1}>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Modal({
  children,
  title,
  onClose,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useApp();
  useEffect(() => {
    const dialog = ref.current!;
    const last = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = original;
      last?.focus();
    };
  }, []);
  return (
    <dialog
      className="modal"
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label={t("إغلاق", "Close")}
        >
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
