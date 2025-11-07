"use client";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { InputField, SectionCard } from "../elements";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

export function RoomPriceSection() {
  const { currentRoom, setRoomField } = useCalculatorStore();
  return (
    <SectionCard title="Tiền phòng">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InputField
            label="Tiền phòng"
            value={currentRoom.price}
            onChange={(v) => setRoomField("price", v)}
          />
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
          <span className="text-sm text-gray-600 font-medium">Thành tiền</span>
          <span className="text-lg font-semibold text-blue-600">
            {currencyFormatter.format(currentRoom.price)} ₫
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
