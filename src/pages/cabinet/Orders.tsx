import { useState } from "react";
import { useAuth, Order } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const statusConfig = {
  active: { label: "Ожидает", color: "bg-amber-100 text-amber-700" },
  assigned: { label: "Назначен", color: "bg-green-100 text-green-700" },
  completed: { label: "Выполнен", color: "bg-rzd-gray text-rzd-muted" },
  cancelled: { label: "Отменён", color: "bg-red-100 text-red-600" },
};

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const st = statusConfig[order.status];

  return (
    <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-rzd-gray/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 bg-rzd-gray rounded-xl flex items-center justify-center shrink-0">
            <Icon name="Luggage" fallback="Package" size={18} className="text-rzd-red" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-rzd-dark text-sm">{order.id}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
            </div>
            <div className="text-xs text-rzd-muted mt-0.5 truncate">
              {order.date} · {order.station.split("—")[1]?.trim() || order.station}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-rzd-red font-black text-sm">{order.price.toLocaleString("ru-RU")} ₽</div>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} className="text-rzd-muted" />
        </div>
      </div>

      {open && (
        <div className="border-t border-rzd-gray-mid p-5 bg-rzd-gray/20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { icon: "MapPin", label: "Вокзал", value: order.station },
              { icon: "Clock", label: "Время", value: `${order.date} в ${order.time}` },
              { icon: "Train", label: "Поезд", value: `${order.train}, вагон ${order.wagon}` },
              { icon: "Package", label: "Багаж", value: `${order.bags} ${order.bags === 1 ? "место" : order.bags < 5 ? "места" : "мест"}` },
              { icon: "CreditCard", label: "Стоимость", value: `${order.price.toLocaleString("ru-RU")} ₽` },
              ...(order.porter ? [{ icon: "User", label: "Носильщик", value: order.porter.name }] : []),
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-rzd-gray-mid">
                <div className="flex items-center gap-1.5 text-rzd-muted mb-1">
                  <Icon name={item.icon} fallback="Circle" size={12} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <div className="font-semibold text-rzd-dark text-xs leading-tight">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {order.status === "completed" && (
              <button className="flex items-center gap-1.5 text-xs font-semibold text-rzd-dark bg-white border border-rzd-gray-mid px-3 py-2 rounded-lg hover:border-rzd-red transition-colors">
                <Icon name="Download" size={13} />
                Скачать чек
              </button>
            )}
            <a
              href="/#order"
              className="flex items-center gap-1.5 text-xs font-semibold text-rzd-red bg-rzd-red/10 px-3 py-2 rounded-lg hover:bg-rzd-red/20 transition-colors"
            >
              <Icon name="RefreshCcw" size={13} />
              Повторить заказ
            </a>
            {order.porter && (
              <a
                href={`tel:${order.porter.phone}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-rzd-muted bg-white border border-rzd-gray-mid px-3 py-2 rounded-lg hover:border-rzd-red transition-colors"
              >
                <Icon name="Phone" size={13} />
                {order.porter.phone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { orders } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    if (filter === "active" && o.status !== "active" && o.status !== "assigned") return false;
    if (filter === "completed" && o.status !== "completed") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.station.toLowerCase().includes(q) ||
        o.train.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpent = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.price, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-rzd-dark mb-1">История заказов</h1>
        <p className="text-rzd-muted text-sm">Все ваши поездки с MyPorter</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Всего заказов", value: orders.length },
          { label: "Выполнено", value: orders.filter((o) => o.status === "completed").length },
          { label: "Потрачено", value: `${totalSpent.toLocaleString("ru-RU")} ₽` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-rzd-gray-mid p-4 text-center">
            <div className="text-xl font-black text-rzd-red">{s.value}</div>
            <div className="text-xs text-rzd-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rzd-muted" />
          <input
            type="text"
            placeholder="Поиск по номеру, вокзалу, поезду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-rzd-gray-mid rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white"
          />
        </div>
        <div className="flex gap-1.5 bg-rzd-gray rounded-xl p-1">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f ? "bg-white shadow-sm text-rzd-dark" : "text-rzd-muted hover:text-rzd-dark"
              }`}
            >
              {f === "all" ? "Все" : f === "active" ? "Активные" : "Выполненные"}
            </button>
          ))}
        </div>
      </div>

      {/* Список */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-10 text-center">
          <Icon name="Search" size={28} className="text-rzd-muted mx-auto mb-3" />
          <p className="font-semibold text-rzd-dark mb-1">Ничего не найдено</p>
          <p className="text-rzd-muted text-sm">Попробуйте изменить фильтр или поисковый запрос</p>
        </div>
      )}
    </div>
  );
}
