"use client";
import { InputField, SectionCard } from "../elements";
import { useCalculatorStore } from "@/store/useCalculatorStore";

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function ServiceSection() {
  const { currentRoom, setServiceField, calcServiceTotal } =
    useCalculatorStore();
  const { services } = currentRoom;
  const svcTotal = calcServiceTotal();

  return (
    <SectionCard title="Dịch vụ">
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InputField
            label="Vệ sinh - Thang máy (₫)"
            value={services.cleaning}
            onChange={(v) => setServiceField("cleaning", v)}
          />
          <InputField
            label="Số người"
            value={services.person}
            onChange={(v) => setServiceField("person", v)}
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
            {numberFormatter.format(svcTotal)} ₫
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
