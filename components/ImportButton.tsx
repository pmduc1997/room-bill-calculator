"use client";

import { useRef, useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import type { ApartmentConfig } from "@/constant";

type Status = "idle" | "success" | "error";

function validateConfig(data: unknown): data is ApartmentConfig {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (!d.bank || typeof d.bank !== "object") return false;
  const bank = d.bank as Record<string, unknown>;
  if (typeof bank.name !== "string") return false;
  if (typeof bank.accountNumber !== "string") return false;
  if (typeof bank.accountName !== "string") return false;
  if (typeof d.elecPrice !== "number") return false;
  if (typeof d.waterPrice !== "number") return false;
  if (typeof d.roomPrice !== "number") return false;
  if (typeof d.cleaning !== "number") return false;
  if (typeof d.washing !== "number") return false;
  if (typeof d.internet !== "number") return false;
  return true;
}

export function ImportButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const loadConfig = useCalculatorStore((s) => s.loadConfig);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!validateConfig(parsed)) throw new Error("Invalid format");
        loadConfig(parsed);
        setStatus("success");
      } catch {
        setStatus("error");
      } finally {
        // reset so the same file can be re-imported
        if (inputRef.current) inputRef.current.value = "";
        setTimeout(() => setStatus("idle"), 2500);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFile}
        aria-label="Nhập file cấu hình JSON"
      />
      <button
        onClick={() => inputRef.current?.click()}
        title="Nhập file cấu hình"
        className={[
          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30",
          status === "success"
            ? "border-green-300 bg-green-50 text-green-700"
            : status === "error"
            ? "border-brand-error/40 bg-brand-error-bg text-brand-error"
            : "border-brand-border bg-white text-brand-muted hover:text-brand-ink hover:bg-brand-primary-subtle",
        ].join(" ")}
      >
        {status === "success" ? (
          <>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Đã nhập
          </>
        ) : status === "error" ? (
          <>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Lỗi file
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Nhập cấu hình
          </>
        )}
      </button>
    </>
  );
}
