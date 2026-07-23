import { useState, useMemo } from "react";
import { usePartner, SERVICE_LABELS, PartnerServiceType, ZONE_LABELS, TariffZone, Currency } from "@/context/PartnerContext";
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

const CURRENCY_SIGN: Record<Currency, string> = { RUB: "₽", EUR: "€", USD: "$" };

export default function PartnerReports() {
  const { orders, clients, currentPartner } = usePartner();
  const [period, setPeriod] = useState<Period>("month");
  const [location, setLocation] = useState("all");
  const [clientQuery, setClientQuery] = useState("");

  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner?.id && o.status === "completed");

  const locations = useMemo(() => Array.from(new Set(partnerOrders.map((o) => o.location))), [partnerOrders]);

  const filtered = partnerOrders.filter((o) => {
    if (location !== "all" && o.location !== location) return false;
    if (clientQuery) {
      const q = clientQuery.toLowerCase();
      const client = clients.find((c) => c.id === o.clientId);
      return client?.lastName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    }
    return true;
  });

  const byCurrency = (currency: Currency) => filtered.filter((o) => o.currency === currency);
  const sumByCurrency = (currency: Currency) => byCurrency(currency).reduce((s, o) => s + o.price, 0);

  const byZone = (zone: TariffZone) => filtered.filter((o) => o.zone === zone);

  const handleExport = () => {
    const rows = [
      ["Номер заказа", "Клиент", "Услуга", "Дата", "Зона", "Стоимость", "Валюта"],
      ...filtered.map((o) => {
        const client = clients.find((c) => c.id === o.clientId);
        return [o.id, client ? `${client.lastName} ${client.firstName}` : "", SERVICE_LABELS[o.service].label, o.date, ZONE_LABELS[o.zone], String(o.price), o.currency];
      }),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${currentPartner?.name}-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark mb-1">Отчёты</h1>
          <p className="text-rzd-muted text-sm">Финансовая информация по выполненным заказам</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark text-xs font-semibold px-3 py-2.5 rounded-lg hover:border-rzd-red transition-colors self-start"
        >
          <Icon name="Download" size={14} />
          Экспорт в CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={inputCls}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => <option key={p} value={p}>{PERIOD_LABELS[p]}</option>)}
        </select>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls}>
          <option value="all">Все локации</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
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

      {/* Валюты */}
      <div className="grid sm:grid-cols-3 gap-4">
        {(["RUB", "EUR", "USD"] as Currency[]).map((cur) => (
          <div key={cur} className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-rzd-red/10 rounded-lg flex items-center justify-center">
                <span className="font-black text-rzd-red">{CURRENCY_SIGN[cur]}</span>
              </div>
              <span className="text-sm font-semibold text-rzd-dark">
                {cur === "RUB" ? "Рубли · РФ" : cur === "EUR" ? "Евро · Зарубеж" : "Доллары · Зарубеж"}
              </span>
            </div>
            <p className="text-2xl font-black text-rzd-dark">{sumByCurrency(cur).toLocaleString("ru-RU")} {CURRENCY_SIGN[cur]}</p>
            <p className="text-xs text-rzd-muted mt-1">{byCurrency(cur).length} заказов</p>
          </div>
        ))}
      </div>

      {/* Тарифные зоны */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <h3 className="font-bold text-rzd-dark mb-4">По тарифным зонам</h3>
        <div className="space-y-3">
          {(Object.keys(ZONE_LABELS) as TariffZone[]).map((zone) => {
            const zoneOrders = byZone(zone);
            const totalRub = zoneOrders.filter((o) => o.currency === "RUB").reduce((s, o) => s + o.price, 0);
            return (
              <div key={zone} className="flex items-center justify-between border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-sm text-rzd-dark">{ZONE_LABELS[zone]}</p>
                  <p className="text-xs text-rzd-muted mt-0.5">{zoneOrders.length} заказов</p>
                </div>
                <p className="font-black text-rzd-red text-sm">{totalRub.toLocaleString("ru-RU")} ₽</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Разбивка по услугам */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <h3 className="font-bold text-rzd-dark mb-4">Стоимость услуг по типам</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(SERVICE_LABELS) as PartnerServiceType[]).map((s) => {
            const svcOrders = filtered.filter((o) => o.service === s);
            const totalRub = svcOrders.filter((o) => o.currency === "RUB").reduce((sum, o) => sum + o.price, 0);
            return (
              <div key={s} className="border border-rzd-gray-mid rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={SERVICE_LABELS[s].icon} fallback="Circle" size={14} className="text-rzd-red" />
                  <span className="text-xs font-semibold text-rzd-dark">{SERVICE_LABELS[s].label}</span>
                </div>
                <p className="text-lg font-black text-rzd-dark">{totalRub.toLocaleString("ru-RU")} ₽</p>
                <p className="text-xs text-rzd-muted">{svcOrders.length} заказов</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
        <div className="px-5 py-4 border-b border-rzd-gray-mid">
          <h3 className="font-bold text-rzd-dark">Детализация ({filtered.length})</h3>
        </div>
        {filtered.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-8">Нет данных за выбранный период</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rzd-gray-mid bg-rzd-gray/40 text-xs text-rzd-muted">
                  <th className="text-left font-semibold px-4 py-2.5">Заказ</th>
                  <th className="text-left font-semibold px-4 py-2.5">Клиент</th>
                  <th className="text-left font-semibold px-4 py-2.5">Услуга</th>
                  <th className="text-left font-semibold px-4 py-2.5">Зона</th>
                  <th className="text-right font-semibold px-4 py-2.5">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const client = clients.find((c) => c.id === o.clientId);
                  return (
                    <tr key={o.id} className="border-b border-rzd-gray-mid last:border-0">
                      <td className="px-4 py-2.5 font-semibold text-rzd-dark whitespace-nowrap">{o.id}</td>
                      <td className="px-4 py-2.5 text-rzd-muted whitespace-nowrap">{client ? `${client.lastName} ${client.firstName}` : "—"}</td>
                      <td className="px-4 py-2.5 text-rzd-muted whitespace-nowrap">{SERVICE_LABELS[o.service].label}</td>
                      <td className="px-4 py-2.5 text-rzd-muted whitespace-nowrap">{ZONE_LABELS[o.zone]}</td>
                      <td className="px-4 py-2.5 text-right font-black text-rzd-red whitespace-nowrap">{o.price.toLocaleString("ru-RU")} {CURRENCY_SIGN[o.currency]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
