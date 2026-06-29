import { DEFAULT_CONFIG, DEFAULT_ROOM_INFO, ROOM_NUMBERS, type ApartmentConfig } from "@/constant";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomInfo = {
  id: string;
  price: number;
  elec: {
    start: number;
    end: number;
    used: number;
    price: number;
  };
  water: {
    start: number;
    end: number;
    used: number;
    price: number;
  };
  services: {
    cleaning: number;
    person: number;
    washing: number;
    internet: number;
  };
};

type BankInfo = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

type State = {
  rooms: Record<string, RoomInfo>;
  currentRoom: RoomInfo;
  bankInfo: BankInfo;

  setCurrentRoom: (roomId: string) => void;
  ensureRoom: (roomId: string) => void;
  loadConfig: (config: ApartmentConfig) => void;

  setRoomField: (k: keyof RoomInfo, v: any) => void;
  setElecField: (k: keyof RoomInfo["elec"], v: number) => void;
  setWaterField: (k: keyof RoomInfo["water"], v: number) => void;
  setServiceField: (k: keyof RoomInfo["services"], v: number) => void;

  calcElecTotal: () => number;
  calcWaterTotal: () => number;
  calcServiceTotal: () => number;
  calcTotal: () => number;

  resetRoom: () => void;
};

const createDefaultRoom = (id: string): RoomInfo => ({
  id,
  ...DEFAULT_ROOM_INFO,
});

const defaultBankInfo: BankInfo = {
  bankName: DEFAULT_CONFIG.bank.name,
  accountNumber: DEFAULT_CONFIG.bank.accountNumber,
  accountName: DEFAULT_CONFIG.bank.accountName,
};

export const useCalculatorStore = create<State>()(
  persist(
    (set, get) => ({
      rooms: ROOM_NUMBERS.reduce(
        (acc, id) => ({ ...acc, [id]: createDefaultRoom(id) }),
        {} as Record<string, RoomInfo>
      ),
      currentRoom: createDefaultRoom(ROOM_NUMBERS[0]),
      bankInfo: defaultBankInfo,

      loadConfig: (config: ApartmentConfig) =>
        set((state) => {
          const newRooms: Record<string, RoomInfo> = {};
          for (const roomDef of config.rooms) {
            const existing = state.rooms[roomDef.id];
            newRooms[roomDef.id] = {
              id: roomDef.id,
              price: roomDef.price,
              elec: {
                start: existing?.elec.start ?? 0,
                end: existing?.elec.end ?? 0,
                used: existing?.elec.used ?? 0,
                price: config.elecPrice,
              },
              water: {
                start: existing?.water.start ?? 0,
                end: existing?.water.end ?? 0,
                used: existing?.water.used ?? 0,
                price: config.waterPrice,
              },
              services: {
                cleaning: config.cleaning,
                washing: config.washing,
                internet: config.internet,
                person: existing?.services.person ?? 1,
              },
            };
          }

          const newCurrentId = newRooms[state.currentRoom.id]
            ? state.currentRoom.id
            : config.rooms[0]?.id ?? state.currentRoom.id;

          return {
            rooms: newRooms,
            currentRoom: newRooms[newCurrentId] ?? state.currentRoom,
            bankInfo: {
              bankName: config.bank.name,
              accountNumber: config.bank.accountNumber,
              accountName: config.bank.accountName,
            },
          };
        }),

      ensureRoom: (roomId) =>
        set((state) => {
          if (!state.rooms[roomId]) {
            return { rooms: { ...state.rooms, [roomId]: createDefaultRoom(roomId) } };
          }
          return state;
        }),

      setCurrentRoom: (roomId) => {
        get().ensureRoom(roomId);
        const r = get().rooms[roomId];
        if (r) set({ currentRoom: { ...r, id: roomId } });
      },

      resetRoom: () =>
        set((state) => {
          const id = state.currentRoom?.id || ROOM_NUMBERS[0];
          const defaultRoomData = createDefaultRoom(id);
          return {
            rooms: { ...state.rooms, [id]: defaultRoomData },
            currentRoom: defaultRoomData,
          };
        }),

      setRoomField: (k, v) =>
        set((state) => {
          const id = state.currentRoom?.id || ROOM_NUMBERS[0];
          const existingRoom = state.rooms[id] || createDefaultRoom(id);
          const room = { ...existingRoom, [k]: v };
          return { rooms: { ...state.rooms, [id]: room }, currentRoom: { ...room } };
        }),

      setElecField: (k, v) =>
        set((state) => {
          const id = state.currentRoom?.id || ROOM_NUMBERS[0];
          const existingRoom = state.rooms[id] || createDefaultRoom(id);
          const elec = { ...existingRoom.elec, [k]: v };
          elec.used = Math.max(0, elec.end - elec.start);
          const updated = { ...existingRoom, elec };
          return { rooms: { ...state.rooms, [id]: updated }, currentRoom: { ...updated } };
        }),

      setWaterField: (k, v) =>
        set((state) => {
          const id = state.currentRoom?.id || ROOM_NUMBERS[0];
          const existingRoom = state.rooms[id] || createDefaultRoom(id);
          const water = { ...existingRoom.water, [k]: v };
          water.used = Math.max(0, water.end - water.start);
          const updated = { ...existingRoom, water };
          return { rooms: { ...state.rooms, [id]: updated }, currentRoom: { ...updated } };
        }),

      setServiceField: (k, v) =>
        set((state) => {
          const id = state.currentRoom?.id || ROOM_NUMBERS[0];
          const existingRoom = state.rooms[id] || createDefaultRoom(id);
          const services = { ...existingRoom.services, [k]: v };
          const updated = { ...existingRoom, services };
          return { rooms: { ...state.rooms, [id]: updated }, currentRoom: { ...updated } };
        }),

      calcElecTotal: () => {
        const { currentRoom } = get();
        if (!currentRoom) return 0;
        return Math.max(0, currentRoom.elec.used) * currentRoom.elec.price;
      },

      calcWaterTotal: () => {
        const { currentRoom } = get();
        if (!currentRoom) return 0;
        return Math.max(0, currentRoom.water.used) * currentRoom.water.price;
      },

      calcServiceTotal: () => {
        const { currentRoom } = get();
        if (!currentRoom) return 0;
        const { services } = currentRoom;
        return services.washing * services.person + services.cleaning * services.person + services.internet;
      },

      calcTotal: () => {
        const { currentRoom } = get();
        if (!currentRoom) return 0;
        return currentRoom.price + get().calcElecTotal() + get().calcWaterTotal() + get().calcServiceTotal();
      },
    }),
    { name: "room-bill-v1" }
  )
);
