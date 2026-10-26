"use client";
import { useFormStatus } from "react-dom";
export default function SubmitButton({ label, pending, className = "btn" }: { label: string; pending?: string; className?: string }) {
  const { pending: p } = useFormStatus();
  return <button className={className} disabled={p} style={{ width: "100%" }}>{p ? pending || "送信中…" : label}</button>;
}
