"use client";
import React from "react";
import SectionCard from "../elements/SectionCard";
import InputField from "../elements/InputField";
import { useCalculatorStore } from "@/store/useCalculatorStore";

export default function ServiceSection() {
  const { services, setServiceField, calcServiceTotal } = useCalculatorStore();
  const svcTotal = calcServiceTotal();

  return (
    <SectionCard title="Dịch vụ">
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InputField
            label="Vệ sinh (₫)"
            value={services.cleaning}
            onChange={(v) => setServiceField("cleaning", v)}
          />
          <InputField
            label="Máy giặt (₫)"
            value={services.washing}
            onChange={(v) => setServiceField("washing", v)}
          />
          <InputField
            label="Mạng (₫)"
            value={services.internet}
            onChange={(v) => setServiceField("internet", v)}
          />
        </div>

        <div className="flex justify-between items-center border-t pt-3 text-sm sm:text-base">
          <span className="font-medium text-gray-700">Thành tiền</span>
          <span className="font-semibold text-blue-600 text-right">
            {svcTotal.toLocaleString()} ₫
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
