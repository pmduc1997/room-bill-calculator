"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useMemo, useState } from "react";

export function RoomSelect() {
  const [open, setOpen] = useState(false);
  const { rooms, currentRoom, setCurrentRoom } = useCalculatorStore();

  const roomIds = useMemo(() => Object.keys(rooms), [rooms]);
  const selectedId = currentRoom?.id ?? roomIds[0] ?? "201";

  const handleSelect = (roomId: string) => {
    setCurrentRoom(roomId);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between w-40"
      >
        {`Phòng ${selectedId}`}
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-40 origin-top-right rounded-lg bg-white border border-gray-200 shadow-lg">
          {roomIds.map((roomId) => (
            <button
              key={roomId}
              onClick={() => handleSelect(roomId)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                selectedId === roomId
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              Phòng {roomId}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
