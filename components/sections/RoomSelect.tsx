"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useMemo, useState, useRef, useEffect } from "react";

export function RoomSelect() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { rooms, currentRoom, setCurrentRoom } = useCalculatorStore();

  const roomIds = useMemo(() => Object.keys(rooms), [rooms]);
  const selectedId = currentRoom?.id ?? roomIds[0] ?? "201";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (roomId: string) => {
    setCurrentRoom(roomId);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-1.5 text-sm font-medium text-brand-ink hover:bg-brand-primary-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        P{selectedId}
        <svg
          className={`h-3.5 w-3.5 text-brand-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-brand-border bg-white shadow-lg overflow-hidden"
          role="listbox"
        >
          <div className="max-h-64 overflow-y-auto py-1">
            {roomIds.map((roomId) => (
              <button
                key={roomId}
                role="option"
                aria-selected={selectedId === roomId}
                onClick={() => handleSelect(roomId)}
                className={[
                  "block w-full text-left px-4 py-2 text-sm transition-colors",
                  selectedId === roomId
                    ? "bg-brand-primary text-white font-medium"
                    : "text-brand-ink hover:bg-brand-primary-subtle",
                ].join(" ")}
              >
                Phòng {roomId}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
