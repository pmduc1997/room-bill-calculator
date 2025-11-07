"use client";
import React from "react";
import { InputField, SectionCard } from "../elements";
import { useCalculatorStore } from "@/store/useCalculatorStore";

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function WaterSection() {
  const { currentRoom, setWaterField, calcWaterTotal } = useCalculatorStore();
  const { water } = currentRoom;
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
            {numberFormatter.format(waterTotal)} ₫
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
