import { createContext, useContext, useState, ReactNode } from "react";

export interface Order {
  id: string;
  status: "active" | "assigned" | "completed" | "cancelled";
  date: string;
  time: string;
  station: string;
  train: string;
  wagon: string;
  bags: number;
  price: number;
  porter?: { name: string; phone: string };
  sign?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  bonusPoints: number;
  emergencyContact?: string;
  savedCards: { id: string; last4: string; brand: string }[];
  preferences: {
    stroller: boolean;
    signBoard: boolean;
    pet: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const mockUser: User = {
  id: "u1",
  name: "Иван Петров",
  phone: "+7 (999) 123-45-67",
  email: "ivan@example.com",
  bonusPoints: 750,
  emergencyContact: "+7 (999) 765-43-21",
  savedCards: [
    { id: "c1", last4: "4242", brand: "Visa" },
    { id: "c2", last4: "5100", brand: "MasterCard" },
  ],
  preferences: { stroller: false, signBoard: true, pet: false },
};

const mockOrders: Order[] = [
  {
    id: "ORD-2841",
    status: "assigned",
    date: "2026-06-14",
    time: "14:30",
    station: "Москва — Казанский вокзал",
    train: "№ 020А",
    wagon: "5",
    bags: 3,
    price: 1500,
    porter: { name: "Алексей Соколов", phone: "+7 (916) 234-56-78" },
    sign: "Иван П.",
  },
  {
    id: "ORD-2790",
    status: "completed",
    date: "2026-05-28",
    time: "09:15",
    station: "Санкт-Петербург — Московский вокзал",
    train: "№ 004А",
    wagon: "2",
    bags: 2,
    price: 1000,
    porter: { name: "Михаил Иванов", phone: "+7 (916) 111-22-33" },
  },
  {
    id: "ORD-2744",
    status: "completed",
    date: "2026-05-10",
    time: "18:45",
    station: "Москва — Ленинградский вокзал",
    train: "№ 002А",
    wagon: "7",
    bags: 1,
    price: 500,
    porter: { name: "Дмитрий Козлов", phone: "+7 (916) 333-44-55" },
  },
  {
    id: "ORD-2700",
    status: "completed",
    date: "2026-04-22",
    time: "11:00",
    station: "Москва — Казанский вокзал",
    train: "№ 010А",
    wagon: "3",
    bags: 4,
    price: 2000,
    porter: { name: "Алексей Соколов", phone: "+7 (916) 234-56-78" },
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (_phone: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    if (code === "1234" || code.length === 4) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, orders, isLoading, login, verifyCode, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
