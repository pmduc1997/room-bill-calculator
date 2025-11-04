"use client";
import React from "react";
import ElectricitySection from "@/components/sections/ElectricitySection";
import WaterSection from "@/components/sections/WaterSection";
import ServiceSection from "@/components/sections/ServiceSection";
import TotalSection from "@/components/sections/TotalSection";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center md:py-10 md:px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700">
            🧾 HÓA ĐƠN THU TIỀN
          </h1>
        </header>

        {/* Sections */}
        <div className="space-y-5">
          <ElectricitySection />
          <WaterSection />
          <ServiceSection />
          <TotalSection />
        </div>
      </div>
    </main>
  );
}
