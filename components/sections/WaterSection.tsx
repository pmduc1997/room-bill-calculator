"use client";
import React from "react";
import SectionCard from "../elements/SectionCard";
import InputField from "../elements/InputField";
import { useCalculatorStore } from "@/store/useCalculatorStore";

export default function WaterSection() {
  const { water, setWaterField, calcWaterTotal } = useCalculatorStore();
  const waterTotal = calcWaterTotal();

  return (
    <SectionCard title="Nước">
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InputField
            label="Chỉ số đầu (m³)"
            value={water.start}
            onChange={(v) => setWaterField("start", v)}
          />
          <InputField
            label="Chỉ số cuối (m³)"
            value={water.end}
            onChange={(v) => setWaterField("end", v)}
          />
          <InputField label="Tiêu thụ (m³)" value={water.used} disabled />
          <InputField
            label="Đơn giá (₫)"
            value={water.price}
            onChange={(v) => setWaterField("price", v)}
          />
        </div>

        <div className="flex justify-between items-center border-t pt-3 text-sm sm:text-base">
          <span className="font-medium text-gray-700">Thành tiền</span>
          <span className="font-semibold text-blue-600 text-right">
            {waterTotal.toLocaleString()} ₫
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
