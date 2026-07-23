import { useState } from "react";
import { usePartner, PartnerServiceType, SERVICE_LABELS, TariffZone, ZONE_LABELS, Currency, OrderStatus } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const inputCls = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60";
const labelCls = "text-xs font-medium text-rzd-muted block mb-1.5";

const statusCfg: Record<OrderStatus, { label: string; cls: string }> = {
  active: { label: "В работе", cls: "bg-amber-100 text-amber-700" },
  completed: { label: "Выполнен", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Отменён", cls: "bg-red-100 text-red-600" },
};

const emptyForm = {
  clientId: "",
  service: "meet" as PartnerServiceType,
  city: "",
  location: "",
  date: "",
  time: "",
  bags: 1,
  passengerName: "",
  fromAddress: "",
  toAddress: "",
  payer: "partner" as "client" | "partner",
  email: "",
  zone: "zone1" as TariffZone,
  currency: "RUB" as Currency,
  price: 0,
};

export default function PartnerOrders() {
  const { orders, clients, currentPartner, createOrder } = usePartner();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [serviceFilter, setServiceFilter] = useState<"all" | PartnerServiceType>("all");

  const partnerClients = clients.filter((c) => c.partnerId === currentPartner?.id);
  const partnerOrders = orders.filter((o) => o.partnerId === currentPartner?.id);

  const filtered = partnerOrders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (serviceFilter !== "all" && o.service !== serviceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const client = clients.find((c) => c.id === o.clientId);
      return (
        o.id.toLowerCase().includes(q) ||
        client?.lastName.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = () => {
    if (!form.clientId || !form.city.trim() || !form.location.trim() || !form.date || !form.time || !form.passengerName.trim() || !form.email.trim()) {
      setError("Заполните все обязательные поля, включая e-mail");
      return;
    }
    createOrder({
      clientId: form.clientId,
      service: form.service,
      city: form.city,
      location: form.location,
      date: form.date,
      time: form.time,
      bags: form.bags,
      passengerName: form.passengerName,
      fromAddress: form.fromAddress || undefined,
      toAddress: form.toAddress || undefined,
      payer: form.payer,
      price: form.price || 1000,
      currency: form.currency,
      zone: form.zone,
      email: form.email,
    });
    toast.success("Заказ создан");
    setForm(emptyForm);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark mb-1">Заказы</h1>
          <p className="text-rzd-muted text-sm">{partnerOrders.length} заказов клиентов {currentPartner?.name}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors self-start"
        >
          <Icon name={showForm ? "X" : "Plus"} size={14} />
          {showForm ? "Отмена" : "Создать заказ"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5 space-y-4">
          <h3 className="font-bold text-rzd-dark">Новый заказ</h3>

          <div>
            <label className={labelCls}>1. Клиент <span className="text-rzd-red">*</span></label>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className={`${inputCls} bg-white`}>
              <option value="">Выберите клиента</option>
              {partnerClients.map((c) => <option key={c.id} value={c.id}>{c.lastName} {c.firstName} · {c.phone}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>2. Услуга <span className="text-rzd-red">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SERVICE_LABELS) as PartnerServiceType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, service: s })}
                  className={`flex flex-col items-center gap-1.5 border rounded-xl px-2 py-3 transition-colors ${
                    form.service === s ? "border-rzd-red bg-rzd-red/5" : "border-rzd-gray-mid hover:border-rzd-red/50"
                  }`}
                >
                  <Icon name={SERVICE_LABELS[s].icon} fallback="Circle" size={16} className="text-rzd-red" />
                  <span className="text-xs font-semibold text-rzd-dark text-center">{SERVICE_LABELS[s].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>3. Город <span className="text-rzd-red">*</span></label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} placeholder="Москва" />
            </div>
            <div>
              <label className={labelCls}>Вокзал / аэропорт <span className="text-rzd-red">*</span></label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Шереметьево (SVO)" />
            </div>
          </div>

          {form.service === "delivery" && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Забрать откуда</label>
                <input value={form.fromAddress} onChange={(e) => setForm({ ...form, fromAddress: e.target.value })} className={inputCls} placeholder="Адрес отправления" />
              </div>
              <div>
                <label className={labelCls}>Доставить куда</label>
                <input value={form.toAddress} onChange={(e) => setForm({ ...form, toAddress: e.target.value })} className={inputCls} placeholder="Адрес назначения" />
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>4. Дата <span className="text-rzd-red">*</span></label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Время <span className="text-rzd-red">*</span></label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Мест багажа</label>
              <div className="flex items-center border border-rzd-gray-mid rounded-lg overflow-hidden bg-white">
                <button type="button" onClick={() => setForm({ ...form, bags: Math.max(1, form.bags - 1) })} className="px-2.5 py-2 text-rzd-red font-bold hover:bg-rzd-gray">−</button>
                <div className="flex-1 text-center text-sm font-bold text-rzd-dark border-x border-rzd-gray-mid py-2">{form.bags}</div>
                <button type="button" onClick={() => setForm({ ...form, bags: form.bags + 1 })} className="px-2.5 py-2 text-rzd-red font-bold hover:bg-rzd-gray">+</button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Пассажир <span className="text-rzd-red">*</span></label>
              <input value={form.passengerName} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} className={inputCls} placeholder="ФИО пассажира" />
            </div>
            <div>
              <label className={labelCls}>Электронная почта <span className="text-rzd-red">*</span></label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="Для отправки чека" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Тарифная зона</label>
              <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value as TariffZone })} className={`${inputCls} bg-white`}>
                {(Object.keys(ZONE_LABELS) as TariffZone[]).map((z) => <option key={z} value={z}>{ZONE_LABELS[z]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Валюта</label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })} className={`${inputCls} bg-white`}>
                <option value="RUB">Рубли ₽</option>
                <option value="EUR">Евро €</option>
                <option value="USD">Доллары $</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Стоимость</label>
              <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} placeholder="1000" />
            </div>
          </div>

          <div>
            <label className={labelCls}>5. Плательщик <span className="text-rzd-red">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, payer: "partner" })}
                className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  form.payer === "partner" ? "border-rzd-red bg-rzd-red/5 text-rzd-red" : "border-rzd-gray-mid text-rzd-muted"
                }`}
              >
                <Icon name="Building2" size={14} />{currentPartner?.name ?? "Партнёр"}
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, payer: "client" })}
                className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  form.payer === "client" ? "border-rzd-red bg-rzd-red/5 text-rzd-red" : "border-rzd-gray-mid text-rzd-muted"
                }`}
              >
                <Icon name="User" size={14} />Сам клиент
              </button>
            </div>
          </div>

          {error && <p className="text-rzd-red text-xs">{error}</p>}

          <button onClick={handleCreate} className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors">
            <Icon name="Check" size={15} />
            Создать заказ
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rzd-muted" />
          <input
            type="text"
            placeholder="Номер заказа, фамилия, локация..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-rzd-gray-mid rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-rzd-red transition-colors"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={`${inputCls} sm:w-44`}>
          <option value="all">Все статусы</option>
          <option value="active">В работе</option>
          <option value="completed">Выполнен</option>
          <option value="cancelled">Отменён</option>
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value as typeof serviceFilter)} className={`${inputCls} sm:w-44`}>
          <option value="all">Все услуги</option>
          {(Object.keys(SERVICE_LABELS) as PartnerServiceType[]).map((s) => <option key={s} value={s}>{SERVICE_LABELS[s].label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-8">Заказы не найдены</p>
        ) : (
          <div className="divide-y divide-rzd-gray-mid">
            {filtered.map((o) => {
              const client = clients.find((c) => c.id === o.clientId);
              const { label, cls } = statusCfg[o.status];
              return (
                <div key={o.id} className="flex items-center gap-3 px-5 py-4 hover:bg-rzd-gray/20 transition-colors">
                  <div className="w-9 h-9 bg-rzd-gray rounded-xl flex items-center justify-center shrink-0">
                    <Icon name={SERVICE_LABELS[o.service].icon} fallback="Package" size={16} className="text-rzd-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-rzd-dark text-sm">{o.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                    </div>
                    <p className="text-xs text-rzd-muted mt-0.5 truncate">
                      {client ? `${client.lastName} ${client.firstName}` : "—"} · {o.date} {o.time} · {o.city}, {o.location}
                    </p>
                  </div>
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
