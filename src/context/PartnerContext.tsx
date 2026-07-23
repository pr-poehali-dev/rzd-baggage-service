import { createContext, useContext, useState, ReactNode } from "react";

// ─── Типы ────────────────────────────────────────────────────────────────

export type PartnerType = "bank" | "travel" | "concierge";
export type PartnerRole = "operator" | "admin";
export type LoyaltyType = "money" | "services" | "combined" | "unlimited";
export type PartnerServiceType = "meet" | "see_off" | "on_site" | "delivery";
export type OrderStatus = "active" | "completed" | "cancelled";
export type TariffZone = "zone1" | "zone2" | "zone3";
export type Currency = "RUB" | "EUR" | "USD";

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  bank: "Банк",
  travel: "Турфирма",
  concierge: "Консьерж-сервис",
};

export const SERVICE_LABELS: Record<PartnerServiceType, { label: string; icon: string }> = {
  meet: { label: "Встретить", icon: "PlaneLanding" },
  see_off: { label: "Проводить", icon: "PlaneTakeoff" },
  on_site: { label: "По территории", icon: "MapPin" },
  delivery: { label: "Доставка багажа", icon: "Package" },
};

export const ZONE_LABELS: Record<TariffZone, string> = {
  zone1: "Зона 1 · Москва, СПб, Сочи",
  zone2: "Зона 2 · Регионы РФ",
  zone3: "Зона 3 · Зарубежные страны",
};

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  createdAt: string;
}

export interface PartnerUser {
  id: string;
  partnerId: string;
  name: string;
  role: PartnerRole;
  phone: string;
  pinSet: boolean;
}

export interface LoyaltyLevel {
  id: string;
  partnerId: string;
  name: string;
  type: LoyaltyType;
  monthlyMoneyLimit?: number;
  yearlyMoneyLimit?: number;
  monthlyServicesLimit?: number;
  yearlyServicesLimit?: number;
}

export interface PartnerClient {
  id: string;
  partnerId: string;
  lastName: string;
  firstName: string;
  phone: string;
  loyaltyLevelId?: string;
  moneyUsedMonth: number;
  moneyUsedYear: number;
  servicesUsedMonth: number;
  servicesUsedYear: number;
  createdAt: string;
}

export interface PartnerOrder {
  id: string;
  partnerId: string;
  clientId: string;
  service: PartnerServiceType;
  city: string;
  location: string;
  date: string;
  time: string;
  bags: number;
  passengerName: string;
  fromAddress?: string;
  toAddress?: string;
  payer: "client" | "partner";
  status: OrderStatus;
  price: number;
  currency: Currency;
  zone: TariffZone;
  email: string;
  createdAt: string;
}

interface PartnerContextType {
  partners: Partner[];
  partnerUsers: PartnerUser[];
  loyaltyLevels: LoyaltyLevel[];
  clients: PartnerClient[];
  orders: PartnerOrder[];

  currentUser: PartnerUser | null;
  currentPartner: Partner | null;
  isLoading: boolean;

  sendCode: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<boolean>;
  setPin: (pin: string) => void;
  loginWithPin: (phone: string, pin: string) => Promise<boolean>;
  logout: () => void;

  addClient: (c: Omit<PartnerClient, "id" | "partnerId" | "moneyUsedMonth" | "moneyUsedYear" | "servicesUsedMonth" | "servicesUsedYear" | "createdAt">) => void;
  updateClientLevel: (clientId: string, levelId: string) => void;
  uploadClientsFile: (fileName: string) => Promise<number>;

  createOrder: (o: Omit<PartnerOrder, "id" | "partnerId" | "status" | "createdAt">) => void;

  // Super admin
  addPartner: (name: string, type: PartnerType, adminName: string, adminPhone: string) => void;
  addOperator: (partnerId: string, name: string, phone: string) => void;
  addLoyaltyLevel: (level: Omit<LoyaltyLevel, "id">) => void;
  deleteLoyaltyLevel: (id: string) => void;
}

// ─── Мок-данные ──────────────────────────────────────────────────────────

const mockPartners: Partner[] = [
  { id: "p1", name: "Тинькофф Банк", type: "bank", createdAt: "12.01.2026" },
  { id: "p2", name: "TUI Россия", type: "travel", createdAt: "03.02.2026" },
  { id: "p3", name: "VIP Consierge", type: "concierge", createdAt: "20.03.2026" },
];

const mockLoyaltyLevels: LoyaltyLevel[] = [
  { id: "l1", partnerId: "p1", name: "ТБ1", type: "money", monthlyMoneyLimit: 4000, yearlyMoneyLimit: 20000 },
  { id: "l2", partnerId: "p1", name: "ТБ2", type: "services", monthlyServicesLimit: 2, yearlyServicesLimit: 10 },
  { id: "l3", partnerId: "p1", name: "ТБ3", type: "unlimited" },
  { id: "l4", partnerId: "p2", name: "TUI Стандарт", type: "combined", monthlyMoneyLimit: 3000, yearlyMoneyLimit: 15000, monthlyServicesLimit: 1, yearlyServicesLimit: 6 },
];

const mockPartnerUsers: PartnerUser[] = [
  { id: "u1", partnerId: "p1", name: "Елена Смирнова", role: "admin", phone: "+7 (916) 500-10-01", pinSet: true },
  { id: "u2", partnerId: "p1", name: "Дмитрий Волков", role: "operator", phone: "+7 (916) 500-10-02", pinSet: false },
];

const mockClients: PartnerClient[] = [
  { id: "c1", partnerId: "p1", lastName: "Петров", firstName: "Алексей", phone: "+7 (916) 234-56-78", loyaltyLevelId: "l1", moneyUsedMonth: 1500, moneyUsedYear: 8000, servicesUsedMonth: 0, servicesUsedYear: 0, createdAt: "15.02.2026" },
  { id: "c2", partnerId: "p1", lastName: "Кузнецова", firstName: "Марина", phone: "+7 (916) 345-67-89", loyaltyLevelId: "l2", moneyUsedMonth: 0, moneyUsedYear: 0, servicesUsedMonth: 1, servicesUsedYear: 5, createdAt: "20.02.2026" },
  { id: "c3", partnerId: "p1", lastName: "Иванов", firstName: "Сергей", phone: "+7 (916) 456-78-90", loyaltyLevelId: "l3", moneyUsedMonth: 0, moneyUsedYear: 0, servicesUsedMonth: 0, servicesUsedYear: 0, createdAt: "01.03.2026" },
  { id: "c4", partnerId: "p1", lastName: "Соколова", firstName: "Виктория", phone: "+7 (916) 567-89-01", loyaltyLevelId: "l1", moneyUsedMonth: 4000, moneyUsedYear: 20000, servicesUsedMonth: 0, servicesUsedYear: 0, createdAt: "05.03.2026" },
];

const mockOrders: PartnerOrder[] = [
  { id: "PO-1001", partnerId: "p1", clientId: "c1", service: "meet", city: "Москва", location: "Шереметьево (SVO)", date: "10.06.2026", time: "14:20", bags: 2, passengerName: "Петров Алексей", payer: "partner", status: "completed", price: 1500, currency: "RUB", zone: "zone1", email: "petrov@mail.ru", createdAt: "08.06.2026" },
  { id: "PO-1002", partnerId: "p1", clientId: "c2", service: "delivery", city: "Санкт-Петербург", location: "Московский вокзал", date: "12.06.2026", time: "09:00", bags: 1, passengerName: "Кузнецова Марина", fromAddress: "Невский пр-т, 45", toAddress: "Вагон 5", payer: "client", status: "completed", price: 800, currency: "RUB", zone: "zone1", email: "kuz@mail.ru", createdAt: "10.06.2026" },
  { id: "PO-1003", partnerId: "p1", clientId: "c3", service: "on_site", city: "Сочи", location: "Аэропорт Сочи (AER)", date: "20.06.2026", time: "18:45", bags: 3, passengerName: "Иванов Сергей", payer: "partner", status: "active", price: 1200, currency: "RUB", zone: "zone1", email: "ivanov@mail.ru", createdAt: "18.06.2026" },
  { id: "PO-1004", partnerId: "p1", clientId: "c4", service: "see_off", city: "Екатеринбург", location: "Кольцово (SVX)", date: "22.06.2026", time: "07:30", bags: 2, passengerName: "Соколова Виктория", payer: "partner", status: "completed", price: 900, currency: "RUB", zone: "zone2", email: "sokolova@mail.ru", createdAt: "20.06.2026" },
  { id: "PO-1005", partnerId: "p1", clientId: "c1", service: "meet", city: "Дубай", location: "DXB", date: "25.06.2026", time: "22:00", bags: 4, passengerName: "Петров Алексей", payer: "partner", status: "active", price: 60, currency: "EUR", zone: "zone3", email: "petrov@mail.ru", createdAt: "23.06.2026" },
];

const PartnerContext = createContext<PartnerContextType | null>(null);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [partnerUsers, setPartnerUsers] = useState<PartnerUser[]>(mockPartnerUsers);
  const [loyaltyLevels, setLoyaltyLevels] = useState<LoyaltyLevel[]>(mockLoyaltyLevels);
  const [clients, setClients] = useState<PartnerClient[]>(mockClients);
  const [orders, setOrders] = useState<PartnerOrder[]>(mockOrders);

  const [currentUser, setCurrentUser] = useState<PartnerUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentPartner = currentUser ? partners.find((p) => p.id === currentUser.partnerId) ?? null : null;

  const sendCode = async (_phone: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);
  };

  const verifyCode = async (phone: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);
    if (code.length !== 4) return false;
    const found = partnerUsers.find((u) => u.phone.replace(/\D/g, "") === phone.replace(/\D/g, ""));
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const setPin = (_pin: string) => {
    if (!currentUser) return;
    setPartnerUsers((p) => p.map((u) => (u.id === currentUser.id ? { ...u, pinSet: true } : u)));
    setCurrentUser({ ...currentUser, pinSet: true });
  };

  const loginWithPin = async (phone: string, _pin: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);
    const found = partnerUsers.find((u) => u.phone.replace(/\D/g, "") === phone.replace(/\D/g, "") && u.pinSet);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addClient: PartnerContextType["addClient"] = (c) => {
    if (!currentUser) return;
    setClients((p) => [
      ...p,
      { ...c, id: `c${Date.now()}`, partnerId: currentUser.partnerId, moneyUsedMonth: 0, moneyUsedYear: 0, servicesUsedMonth: 0, servicesUsedYear: 0, createdAt: new Date().toLocaleDateString("ru-RU") },
    ]);
  };

  const updateClientLevel = (clientId: string, levelId: string) => {
    setClients((p) => p.map((c) => (c.id === clientId ? { ...c, loyaltyLevelId: levelId } : c)));
  };

  const uploadClientsFile = async (_fileName: string): Promise<number> => {
    if (!currentUser) return 0;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const added = Math.floor(Math.random() * 4) + 2;
    const newClients: PartnerClient[] = Array.from({ length: added }, (_, i) => ({
      id: `c${Date.now()}${i}`,
      partnerId: currentUser.partnerId,
      lastName: ["Новиков", "Морозова", "Егоров", "Волкова"][i % 4],
      firstName: ["Артём", "Ольга", "Павел", "Анна"][i % 4],
      phone: `+7 (916) 9${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}`,
      loyaltyLevelId: loyaltyLevels.find((l) => l.partnerId === currentUser.partnerId)?.id,
      moneyUsedMonth: 0,
      moneyUsedYear: 0,
      servicesUsedMonth: 0,
      servicesUsedYear: 0,
      createdAt: new Date().toLocaleDateString("ru-RU"),
    }));
    setClients((p) => [...p, ...newClients]);
    setIsLoading(false);
    return added;
  };

  const createOrder: PartnerContextType["createOrder"] = (o) => {
    if (!currentUser) return;
    setOrders((p) => [
      { ...o, id: `PO-${1000 + p.length + 1}`, partnerId: currentUser.partnerId, status: "active", createdAt: new Date().toLocaleDateString("ru-RU") },
      ...p,
    ]);
  };

  // Super admin actions
  const addPartner: PartnerContextType["addPartner"] = (name, type, adminName, adminPhone) => {
    const id = `p${Date.now()}`;
    setPartners((p) => [...p, { id, name, type, createdAt: new Date().toLocaleDateString("ru-RU") }]);
    setPartnerUsers((p) => [...p, { id: `u${Date.now()}`, partnerId: id, name: adminName, role: "admin", phone: adminPhone, pinSet: false }]);
  };

  const addOperator: PartnerContextType["addOperator"] = (partnerId, name, phone) => {
    setPartnerUsers((p) => [...p, { id: `u${Date.now()}`, partnerId, name, role: "operator", phone, pinSet: false }]);
  };

  const addLoyaltyLevel: PartnerContextType["addLoyaltyLevel"] = (level) => {
    setLoyaltyLevels((p) => [...p, { ...level, id: `l${Date.now()}` }]);
  };

  const deleteLoyaltyLevel = (id: string) => {
    setLoyaltyLevels((p) => p.filter((l) => l.id !== id));
  };

  return (
    <PartnerContext.Provider
      value={{
        partners, partnerUsers, loyaltyLevels, clients, orders,
        currentUser, currentPartner, isLoading,
        sendCode, verifyCode, setPin, loginWithPin, logout,
        addClient, updateClientLevel, uploadClientsFile,
        createOrder,
        addPartner, addOperator, addLoyaltyLevel, deleteLoyaltyLevel,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error("usePartner must be used within PartnerProvider");
  return ctx;
}