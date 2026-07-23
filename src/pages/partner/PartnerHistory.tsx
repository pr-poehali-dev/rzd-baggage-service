import { useState, useMemo } from "react";
import { usePartner, SERVICE_LABELS, PartnerServiceType } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";

const inputCls = "border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white";

type Period = "today" | "yesterday" | "week" | "month" | "prev_month" | "year" | "custom";
const PERIOD_LABELS: Record<Period, string> = {
  today: "Сегодня",
  yesterday: "Вчера",
  week: "Неделя",
  month: "Месяц",
  prev_month: "Предыдущий месяц",
  year: "Год",
  custom: "Произвольный период",
};

type Direction = "all" | "airport" | "station" | "abroad";

export default function PartnerHistory() {
  const { orders, clients, currentPartner } = usePartner();
  const [period, setPeriod] = useState<Period>("week");
  const [location, setLocation] = useState("all");
  const [clientQuery, setClientQuery] = useState("");
  const [direction, setDirection] = useState<Direction>("all");

  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner?.id && o.status === "completed");

  const locations = useMemo(
    () => Array.from(new Set(partnerOrders.map((o) => o.location))),
    [partnerOrders]
  );

  const filtered = partnerOrders.filter((o) => {
    if (location !== "all" && o.location !== location) return false;
    if (direction === "airport" && !/аэропорт|международный|\(([A-Z]{3})\)/i.test(o.location)) {
      if (!/[A-Z]{3}\)/.test(o.location)) return false;
    }
    if (direction === "station" && !/вокзал/i.test(o.location)) return false;
    if (direction === "abroad" && o.zone !== "zone3") return false;
    if (clientQuery) {
      const q = clientQuery.toLowerCase();
      const client = clients.find((c) => c.id === o.clientId);
      return client?.lastName.toLowerCase().includes(q) || client?.firstName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    }
    return true;
  });

  const countByService = (service: PartnerServiceType) => filtered.filter((o) => o.service === service).length;
  const baggageCount = countByService("meet") + countByService("see_off") + countByService("on_site");
  const deliveryCount = countByService("delivery");

  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-2xl font-black text-rzd-dark mb-1">История</h1>
        <p className="text-rzd-muted text-sm">Статистика выполненных заказов {currentPartner?.name}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={inputCls}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => <option key={p} value={p}>{PERIOD_LABELS[p]}</option>)}
        </select>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls}>
          <option value="all">Все локации</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={direction} onChange={(e) => setDirection(e.target.value as Direction)} className={inputCls}>
          <option value="all">Все направления</option>
          <option value="airport">Аэропорт</option>
          <option value="station">ЖД вокзал</option>
          <option value="abroad">Зарубежные</option>
        </select>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rzd-muted" />
          <input
            type="text"
            placeholder="Клиент или номер заказа..."
            value={clientQuery}
            onChange={(e) => setClientQuery(e.target.value)}
            className={`${inputCls} w-full pl-9`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-6 text-center">
          <div className="w-11 h-11 bg-rzd-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="Luggage" size={20} className="text-rzd-red" />
          </div>
          <p className="text-3xl font-black text-rzd-dark">{baggageCount}</p>
          <p className="text-sm text-rzd-muted mt-1">Услуг багажа</p>
        </div>
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-6 text-center">
          <div className="w-11 h-11 bg-rzd-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Icon name="Truck" size={20} className="text-rzd-red" />
          </div>
          <p className="text-3xl font-black text-rzd-dark">{deliveryCount}</p>
          <p className="text-sm text-rzd-muted mt-1">Услуг доставки</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <h3 className="font-bold text-rzd-dark mb-4">Разбивка по услугам</h3>
        <div className="space-y-3">
          {(Object.keys(SERVICE_LABELS) as PartnerServiceType[]).map((s) => {
            const count = countByService(s);
            const max = Math.max(1, ...(Object.keys(SERVICE_LABELS) as PartnerServiceType[]).map(countByService));
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={SERVICE_LABELS[s].icon} fallback="Circle" size={14} className="text-rzd-red" />
                </div>
                <span className="text-sm text-rzd-dark w-36 shrink-0">{SERVICE_LABELS[s].label}</span>
                <div className="flex-1 h-2 bg-rzd-gray-mid rounded-full overflow-hidden">
                  <div className="h-full bg-rzd-red rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-rzd-dark w-8 text-right shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
        <div className="px-5 py-4 border-b border-rzd-gray-mid">
          <h3 className="font-bold text-rzd-dark">Список заказов ({filtered.length})</h3>
        </div>
        {filtered.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-8">Заказов не найдено</p>
        ) : (
          <div className="divide-y divide-rzd-gray-mid">
            {filtered.slice(0, 10).map((o) => {
              const client = clients.find((c) => c.id === o.clientId);
              return (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                  <Icon name={SERVICE_LABELS[o.service].icon} fallback="Package" size={14} className="text-rzd-muted shrink-0" />
                  <span className="font-semibold text-sm text-rzd-dark shrink-0">{o.id}</span>
                  <span className="text-xs text-rzd-muted truncate flex-1">
                    {client ? `${client.lastName} ${client.firstName}` : "—"} · {o.date} · {o.location}
                  </span>
                  <span className="font-black text-rzd-red text-sm shrink-0">
                    {o.price.toLocaleString("ru-RU")} {o.currency === "RUB" ? "₽" : o.currency === "EUR" ? "€" : "$"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
