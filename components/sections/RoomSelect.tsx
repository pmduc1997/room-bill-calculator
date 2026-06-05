"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";
import { DEFAULT_ROOM_ID } from "@/constant";
import { useEffect, useRef } from "react";

export function RoomInput() {
  const { currentRoom, setCurrentRoom } = useCalculatorStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !currentRoom?.id) {
      setCurrentRoom(DEFAULT_ROOM_ID);
      initialized.current = true;
    }
  }, []);

  const value = currentRoom?.id ?? DEFAULT_ROOM_ID;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-brand-muted font-medium">Phòng</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setCurrentRoom(e.target.value)}
        className="w-16 rounded-lg border border-brand-border bg-white px-2 py-1 text-sm font-semibold text-brand-ink text-center focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        placeholder={DEFAULT_ROOM_ID}
      />
    </div>
  );
}

// Keep old export name for backward compat
export { RoomInput as RoomSelect };
