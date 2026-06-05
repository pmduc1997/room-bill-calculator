import defaultConfig from "./apartment-info.json";

export type ApartmentConfig = {
  bank: {
    name: string;
    accountNumber: string;
    accountName: string;
  };
  elecPrice: number;
  waterPrice: number;
  cleaning: number;
  washing: number;
  internet: number;
  rooms: Array<{ id: string; price: number }>;
};

export const DEFAULT_CONFIG: ApartmentConfig = defaultConfig;

// Derived constants kept for backward compatibility
export const ROOM_NUMBERS = defaultConfig.rooms.map((r) => r.id);

export const DEFAULT_ROOM_INFO = {
  price: defaultConfig.rooms[0]?.price ?? 4000000,
  elec: { start: 0, end: 0, used: 0, price: defaultConfig.elecPrice },
  water: { start: 0, end: 0, used: 0, price: defaultConfig.waterPrice },
  services: {
    cleaning: defaultConfig.cleaning,
    person: 1,
    washing: defaultConfig.washing,
    internet: defaultConfig.internet,
  },
};

export const BANK_INFO = {
  bankName: defaultConfig.bank.name,
  accountNumber: defaultConfig.bank.accountNumber,
  accountName: defaultConfig.bank.accountName,
};
