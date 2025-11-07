import { create } from "zustand";

const ROOM_NUMBERS = ["201", "202", "203", "204"];

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
    washing: number;
    internet: number;
  };
};

type State = {
  rooms: Record<string, RoomInfo>;
  currentRoom: RoomInfo;

  setCurrentRoom: (roomId: string) => void;
  ensureRoom: (roomId: string) => void;

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

// Helper function to create a default room with a specific ID
const createDefaultRoom = (id: string): RoomInfo => ({
  id,
  price: 0,
  elec: { start: 0, end: 0, used: 0, price: 0 },
  water: { start: 0, end: 0, used: 0, price: 0 },
  services: { cleaning: 0, washing: 0, internet: 0 },
});

export const useCalculatorStore = create<State>((set, get) => ({
  rooms: ROOM_NUMBERS.reduce(
    (acc, id) => ({ ...acc, [id]: createDefaultRoom(id) }),
    {}
  ),
  currentRoom: createDefaultRoom(ROOM_NUMBERS[0]),

  ensureRoom: (roomId) =>
    set((state) => {
      if (!state.rooms[roomId]) {
        const newRooms = {
          ...state.rooms,
          [roomId]: createDefaultRoom(roomId),
        };
        return { rooms: newRooms };
      }
      return state;
    }),

  setCurrentRoom: (roomId) => {
    get().ensureRoom(roomId);
    const r = get().rooms[roomId];
    if (r) {
      set({ currentRoom: { ...r, id: roomId } });
    }
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
      let id = state.currentRoom?.id;
      if (!id) {
        // If no current room, initialize with first room
        id = ROOM_NUMBERS[0];
      }
      // Ensure room exists in current state
      const existingRoom = state.rooms[id] || createDefaultRoom(id);
      const room = { ...existingRoom, [k]: v };
      return {
        rooms: { ...state.rooms, [id]: room },
        currentRoom: { ...room },
      };
    }),

  setElecField: (k, v) =>
    set((state) => {
      let id = state.currentRoom?.id;
      if (!id) {
        id = ROOM_NUMBERS[0];
      }
      // Ensure room exists in current state
      const existingRoom = state.rooms[id] || createDefaultRoom(id);
      const elec = { ...existingRoom.elec, [k]: v };
      // Always recalculate used based on current start and end values
      elec.used = Math.max(0, elec.end - elec.start);
      const updated = { ...existingRoom, elec };
      return {
        rooms: { ...state.rooms, [id]: updated },
        currentRoom: { ...updated },
      };
    }),

  setWaterField: (k, v) =>
    set((state) => {
      let id = state.currentRoom?.id;
      if (!id) {
        id = ROOM_NUMBERS[0];
      }
      // Ensure room exists in current state
      const existingRoom = state.rooms[id] || createDefaultRoom(id);
      const water = { ...existingRoom.water, [k]: v };
      // Always recalculate used based on current start and end values
      water.used = Math.max(0, water.end - water.start);
      const updated = { ...existingRoom, water };
      return {
        rooms: { ...state.rooms, [id]: updated },
        currentRoom: { ...updated },
      };
    }),

  setServiceField: (k, v) =>
    set((state) => {
      let id = state.currentRoom?.id;
      if (!id) {
        id = ROOM_NUMBERS[0];
      }
      // Ensure room exists in current state
      const existingRoom = state.rooms[id] || createDefaultRoom(id);
      const services = { ...existingRoom.services, [k]: v };
      const updated = { ...existingRoom, services };
      return {
        rooms: { ...state.rooms, [id]: updated },
        currentRoom: { ...updated },
      };
    }),

  calcElecTotal: () => {
    const { currentRoom } = get();
    if (!currentRoom) return 0;
    const { elec } = currentRoom;
    return Math.max(0, elec.used) * elec.price;
  },

  calcWaterTotal: () => {
    const { currentRoom } = get();
    if (!currentRoom) return 0;
    const { water } = currentRoom;
    return Math.max(0, water.used) * water.price;
  },

  calcServiceTotal: () => {
    const { currentRoom } = get();
    if (!currentRoom) return 0;
    const { services } = currentRoom;
    return services.cleaning + services.washing + services.internet;
  },

  calcTotal: () => {
    const { currentRoom } = get();
    if (!currentRoom) return 0;
    return (
      currentRoom.price +
      get().calcElecTotal() +
      get().calcWaterTotal() +
      get().calcServiceTotal()
    );
  },
}));
