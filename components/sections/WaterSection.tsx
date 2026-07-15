"use client";
import { InputField, SectionCard } from "../elements";
import { useCalculatorStore } from "@/store/useCalculatorStore";

const fmt = new Intl.NumberFormat("vi-VN");

export function WaterSection() {
  const { currentRoom, setWaterField, calcWaterTotal } = useCalculatorStore();
  const { water } = currentRoom;
  const waterTotal = calcWaterTotal();
  const hasError = water.end !== 0 && water.start !== 0 && water.end < water.start;

  return (
    <SectionCard title="Tiền nước">
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Chỉ số đầu (m³)"
          value={water.start}
          onChange={(v) => setWaterField("start", v)}
        />
        <InputField
          label="Chỉ số cuối (m³)"
          value={water.end}
          onChange={(v) => setWaterField("end", v)}
          error={hasError}
        />
        <InputField
          label="Tiêu thụ (m³)"
          value={water.used}
          disabled
        />
        <InputField
          label="Đơn giá (₫/m³)"
          value={water.price}
          onChange={(v) => setWaterField("price", v)}
        />
      </div>
      {hasError && (
        <p className="text-xs text-brand-error font-medium">
          Chỉ số cuối phải lớn hơn chỉ số đầu.
        </p>
      )}
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs text-brand-muted">Thành tiền</span>
        <span className="text-sm font-semibold text-brand-accent tabular-nums">
          {fmt.format(waterTotal)} ₫
        </span>
      </div>
    </SectionCard>
  );
}
