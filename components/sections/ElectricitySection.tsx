"use client";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { InputField, SectionCard } from "../elements";

const fmt = new Intl.NumberFormat("vi-VN");

export function ElectricitySection() {
  const { currentRoom, setElecField, calcElecTotal } = useCalculatorStore();
  const { elec } = currentRoom;
  const elecTotal = calcElecTotal();
  const hasError = elec.end !== 0 && elec.start !== 0 && elec.end < elec.start;

  return (
    <SectionCard title="Tiền điện">
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Chỉ số đầu (kWh)"
          value={elec.start}
          onChange={(v) => setElecField("start", v)}
        />
        <InputField
          label="Chỉ số cuối (kWh)"
          value={elec.end}
          onChange={(v) => setElecField("end", v)}
          error={hasError}
        />
        <InputField
          label="Tiêu thụ (kWh)"
          value={elec.used}
          disabled
        />
        <InputField
          label="Đơn giá (₫/kWh)"
          value={elec.price}
          onChange={(v) => setElecField("price", v)}
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
          {fmt.format(elecTotal)} ₫
        </span>
      </div>
    </SectionCard>
  );
}
