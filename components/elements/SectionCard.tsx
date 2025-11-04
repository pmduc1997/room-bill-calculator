// src/components/SectionCard.tsx
"use client";
import React from "react";

export default function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-4">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-black">{title}</h3>
      )}
      {children}
    </div>
  );
}
