// src/store/useCalculatorStore.ts
import { create } from "zustand";

type Services = {
  cleaning: number;
  washing: number;
  internet: number;
};

type Electricity = {
  start: number;
  end: number;
  used: number;
  price: number;
};

type Water = {
  start: number;
  end: number;
  used: number;
  price: number;
};

type State = {
  // Rent
  rentMonths: number;
  rentPerMonth: number;

  // Electricity
  elec: Electricity;

  // Water
  water: Water;

  // Services
  services: Services;

  // Setters
  setRentMonths: (v: number) => void;
  setRentPerMonth: (v: number) => void;

  setElecField: (k: keyof Electricity, v: number) => void;
  setWaterField: (k: keyof Water, v: number) => void;

  setServiceField: (k: keyof Services, v: number) => void;

  // Derived helpers (optional to call)
  calcElecTotal: () => number;
  calcWaterTotal: () => number;
  calcServiceTotal: () => number;
  calcRentTotal: () => number;
  calcTotal: () => number;
};

export const useCalculatorStore = create<State>((set, get) => ({
  // defaults inspired by your excel screenshot
  rentMonths: 0,
  rentPerMonth: 0,

  elec: {
    start: 0,
    end: 0,
    used: 0,
    price: 0,
  },

  water: {
    start: 0,
    end: 0,
    used: 0,
    price: 0,
  },

  services: {
    cleaning: 0,
    washing: 0,
    internet: 0,
  },

  // setters
  setRentMonths: (v) => set({ rentMonths: v }),
  setRentPerMonth: (v) => set({ rentPerMonth: v }),

  setElecField: (k, v) =>
    set((s) => {
      const next = { ...s.elec } as Electricity;
      (next as any)[k] = v;

      // keep consistency:
      if (k === "used") {
        next.end = next.start + v;
      } else if (k === "start") {
        next.used = next.end - v;
      } else if (k === "end") {
        next.used = next.end - next.start;
      }
      return { elec: next };
    }),

  setWaterField: (k, v) =>
    set((s) => {
      const next = { ...s.water } as Water;
      (next as any)[k] = v;

      // consistency:
      if (k === "used") {
        next.end = next.start + v;
      } else if (k === "start") {
        next.used = next.end - v;
      } else if (k === "end") {
        next.used = next.end - next.start;
      }
      return { water: next };
    }),

  setServiceField: (k, v) =>
    set((s) => ({ services: { ...s.services, [k]: v } })),

  // calculators
  calcElecTotal: () => {
    const { elec } = get();
    return Math.max(0, elec.used) * elec.price;
  },

  calcWaterTotal: () => {
    const { water } = get();
    return Math.max(0, water.used) * water.price;
  },

  calcServiceTotal: () => {
    const { services } = get();
    return services.cleaning + services.washing + services.internet;
  },

  calcRentTotal: () => {
    const { rentMonths, rentPerMonth } = get();
    return Math.max(0, rentMonths) * rentPerMonth;
  },

  calcTotal: () => {
    return (
      get().calcRentTotal() +
      get().calcElecTotal() +
      get().calcWaterTotal() +
      get().calcServiceTotal()
    );
  },
}));
