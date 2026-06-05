"use client";
import { InputField, SectionCard } from "../elements";
import { useCalculatorStore } from "@/store/useCalculatorStore";

const fmt = new Intl.NumberFormat("vi-VN");

export function ServiceSection() {
  const { currentRoom, setServiceField, calcServiceTotal } = useCalculatorStore();
  const { services } = currentRoom;
  const svcTotal = calcServiceTotal();

  return (
    <SectionCard title="Dịch vụ">
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Internet (₫/tháng)"
          value={services.internet}
          onChange={(v) => setServiceField("internet", v)}
        />
        <InputField
          label="Vệ sinh + thang máy / người (₫)"
          value={services.cleaning}
          onChange={(v) => setServiceField("cleaning", v)}
        />
        <InputField
          label="Máy giặt / người (₫)"
          value={services.washing}
          onChange={(v) => setServiceField("washing", v)}
        />
        <InputField
          label="Số người"
          value={services.person}
          onChange={(v) => setServiceField("person", v)}
        />
      </div>
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs text-brand-muted">Thành tiền</span>
        <span className="text-sm font-semibold text-brand-accent tabular-nums">
          {fmt.format(svcTotal)} ₫
        </span>
      </div>
    </SectionCard>
  );
}
