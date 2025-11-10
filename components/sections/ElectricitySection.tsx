"use client";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { InputField, SectionCard } from "../elements";

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function ElectricitySection() {
  const { currentRoom, setElecField, calcElecTotal } = useCalculatorStore();
  const { elec } = currentRoom;
  const elecTotal = calcElecTotal();

  return (
    <SectionCard title="Tiền điện">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InputField
            label="Chỉ số đầu (kWh)"
            value={elec.start}
            onChange={(v) => setElecField("start", v)}
          />
          <InputField
            label="Chỉ số cuối (kWh)"
            value={elec.end}
            onChange={(v) => setElecField("end", v)}
          />
          <InputField label="Tiêu thụ" value={elec.used} disabled />
          <InputField
            label="Đơn giá (₫/kWh)"
            value={elec.price}
            onChange={(v) => setElecField("price", v)}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">Thành tiền</span>
          <span className="text-lg font-semibold text-blue-600">
            {numberFormatter.format(elecTotal)} ₫
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
