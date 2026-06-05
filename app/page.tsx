"use client";

import { useRouter } from "next/navigation";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import {
  ElectricitySection,
  RoomPriceSection,
  RoomSelect,
  ServiceSection,
  WaterSection,
} from "@/components/sections";
import { ImportButton } from "@/components/ImportButton";

const fmt = new Intl.NumberFormat("vi-VN");

export default function Page() {
  const router = useRouter();
  const { currentRoom, calcTotal } = useCalculatorStore();
  const total = calcTotal();

  const month = new Date().toLocaleString("en-US", { month: "2-digit" });
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-brand-border">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-brand-ink leading-tight">
              Hóa đơn thu tiền
            </h1>
            <p className="text-xs text-brand-muted">
              Phòng {currentRoom.id} · Tháng {month}/{year}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ImportButton />
            <RoomSelect />
          </div>
        </div>
      </header>

      {/* Form body */}
      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-5 space-y-3 pb-36">
        <RoomPriceSection />
        <ElectricitySection />
        <WaterSection />
        <ServiceSection />
      </main>

      {/* Sticky footer: total + CTA */}
      <footer className="sticky bottom-0 z-50 bg-white border-t border-brand-border">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-brand-muted leading-tight">
              Tổng thanh toán
            </p>
            <p className="text-2xl font-bold text-brand-accent tabular-nums leading-tight">
              {fmt.format(total)} ₫
            </p>
          </div>
          <button
            onClick={() => router.push("/invoice")}
            className="shrink-0 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          >
            Xuất hóa đơn
          </button>
        </div>
      </footer>
    </div>
  );
}
