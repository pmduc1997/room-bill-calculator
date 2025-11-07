"use client";

import { useRouter } from "next/navigation";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { SectionCard } from "../elements";

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function TotalSection() {
  const router = useRouter();
  const { calcTotal } = useCalculatorStore();
  const total = calcTotal();

  const formattedTotal = numberFormatter.format(total);

  return (
    <SectionCard title="Tổng thanh toán">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="text-3xl font-extrabold text-red-600 tracking-wide">
          {formattedTotal} ₫
        </div>

        <button
          onClick={() => router.push("/invoice")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          Xuất hóa đơn
        </button>

        <p className="text-xs text-gray-500">
          Kiểm tra kỹ số liệu trước khi xuất hóa đơn.
        </p>
      </div>
    </SectionCard>
  );
}
