import { createContext, useContext, useState, ReactNode } from "react";

export type ServiceType =
  | "station_to_taxi"      // с вокзала до такси / выхода
  | "station_to_point"     // с вокзала до любой точки на привокзальной территории
  | "city_to_wagon"        // из города / дома до вагона
  | "city_to_point";       // из города / дома до точки на привокзальной территории

export const SERVICE_LABELS: Record<ServiceType, { short: string; full: string; icon: string }> = {
  station_to_taxi:  { short: "До такси",         full: "С вокзала до такси или выхода",                icon: "Car" },
  station_to_point: { short: "По территории",    full: "С вокзала до любой точки на территории",        icon: "MapPin" },
  city_to_wagon:    { short: "До вагона",         full: "Из города / дома до вагона",                   icon: "Home" },
  city_to_point:    { short: "В нужное место",   full: "Из города / дома до точки на территории",       icon: "Navigation" },
};

export interface SavedRoute {
  id: string;
  name: string;
  station: string;
  train: string;
  wagon: string;
  bags: number;
  serviceType?: ServiceType;
}

export interface Order {
  id: string;
  status: "active" | "assigned" | "completed" | "cancelled";
  serviceType: ServiceType;
  date: string;
  time: string;
  station: string;
  train: string;
  wagon: string;
  bags: number;
  price: number;
  sign?: string;
  porter?: { name: string; phone: string };
  rating?: number;
}

export interface User {
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  savedRoutes: SavedRoute[];
  isLoading: boolean;
  sendCode: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<boolean>;
  register: (data: User) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addRoute: (route: Omit<SavedRoute, "id">) => void;
  deleteRoute: (id: string) => void;
  rateOrder: (id: string, rating: number) => void;
}

const mockOrders: Order[] = [
  {
    id: "ОРД-2841",
    status: "assigned",
    serviceType: "city_to_wagon",
    date: "14.06.2026",
    time: "14:30",
    station: "Москва — Казанский вокзал",
    train: "020А",
    wagon: "5",
    bags: 3,
    price: 1500,
    sign: "Петров И.С.",
    porter: { name: "Соколов Алексей", phone: "+7 (916) 234-56-78" },
  },
  {
    id: "ОРД-2790",
    status: "completed",
    serviceType: "station_to_taxi",
    date: "28.05.2026",
    time: "09:15",
    station: "Санкт-Петербург — Московский вокзал",
    train: "004А",
    wagon: "2",
    bags: 2,
    price: 1000,
    porter: { name: "Иванов Михаил", phone: "+7 (916) 111-22-33" },
  },
  {
    id: "ОРД-2744",
    status: "completed",
    serviceType: "station_to_point",
    date: "10.05.2026",
    time: "18:45",
    station: "Москва — Ленинградский вокзал",
    train: "002А",
    wagon: "7",
    bags: 1,
    price: 500,
    porter: { name: "Козлов Дмитрий", phone: "+7 (916) 333-44-55" },
    rating: 5,
  },
  {
    id: "ОРД-2700",
    status: "completed",
    serviceType: "city_to_point",
    date: "22.04.2026",
    time: "11:00",
    station: "Москва — Казанский вокзал",
    train: "010А",
    wagon: "3",
    bags: 4,
    price: 2000,
    porter: { name: "Соколов Алексей", phone: "+7 (916) 234-56-78" },
    rating: 4,
  },
];

const mockRoutes: SavedRoute[] = [
  { id: "r1", name: "Домой в Казань", station: "Москва — Казанский вокзал", train: "020А", wagon: "5", bags: 2, serviceType: "city_to_wagon" },
  { id: "r2", name: "В Питер на выходные", station: "Москва — Ленинградский вокзал", train: "002А", wagon: "3", bags: 1, serviceType: "station_to_taxi" },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>(mockRoutes);
  const [isLoading, setIsLoading] = useState(false);

  const sendCode = async (_phone: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);
  };

  const verifyCode = async (_phone: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);
    return code.length === 4;
  };

  const register = async (data: User) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser(data);
    setIsLoading(false);
  };

  const logout = () => setUser(null);
  const updateUser = (data: Partial<User>) => { if (user) setUser({ ...user, ...data }); };
  const addRoute = (route: Omit<SavedRoute, "id">) => setSavedRoutes((p) => [...p, { ...route, id: `r${Date.now()}` }]);
  const deleteRoute = (id: string) => setSavedRoutes((p) => p.filter((r) => r.id !== id));
  const rateOrder = (id: string, rating: number) =>
    setOrders((p) => p.map((o) => o.id === id ? { ...o, rating } : o));

  return (
    <AuthContext.Provider value={{ user, orders, savedRoutes, isLoading, sendCode, verifyCode, register, logout, updateUser, addRoute, deleteRoute, rateOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
