// src/components/SectionCard.tsx
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
    <div className="bg-white border-t border-gray-200 pt-3 mb-3">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-black">{title}</h3>
      )}
      {children}
    </div>
  );
}
