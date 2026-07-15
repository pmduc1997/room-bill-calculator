"use client";
import React from "react";

export function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-surface rounded-xl p-4 space-y-4">
      {title && (
        <h3 className="text-sm font-semibold text-brand-ink">{title}</h3>
      )}
      {children}
    </div>
  );
}
