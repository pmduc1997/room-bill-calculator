"use client";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { InputField, SectionCard } from "../elements";

const fmt = new Intl.NumberFormat("vi-VN");

export function RoomPriceSection() {
  const { currentRoom, setRoomField } = useCalculatorStore();
  return (
    <SectionCard title="Tiền phòng">
      <InputField
        label="Giá thuê (₫/tháng)"
        value={currentRoom.price}
        onChange={(v) => setRoomField("price", v)}
      />
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs text-brand-muted">Thành tiền</span>
        <span className="text-sm font-semibold text-brand-accent tabular-nums">
          {fmt.format(currentRoom.price)} ₫
        </span>
      </div>
    </SectionCard>
  );
}
