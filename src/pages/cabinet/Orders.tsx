import { useState } from "react";
import { useAuth, Order, SERVICE_LABELS } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const statusCfg: Record<string, { label: string; cls: string }> = {
  active:    { label: "Ожидает носильщика", cls: "bg-amber-100 text-amber-700" },
  assigned:  { label: "Носильщик назначен", cls: "bg-green-100 text-green-700" },
  completed: { label: "Выполнен",           cls: "bg-rzd-gray text-rzd-muted" },
  cancelled: { label: "Отменён",            cls: "bg-red-100 text-red-600" },
};

function bagsWord(n: number) {
  if (n === 1) return "1 место";
  if (n < 5) return `${n} места`;
  return `${n} мест`;
}

function StarRating({ orderId, current }: { orderId: string; current?: number }) {
  const { rateOrder } = useAuth();
  const [hover, setHover] = useState(0);
  const val = hover || current || 0;

  if (current) {
    return (
      <div className="flex items-center gap-0.5 mt-1">
        {[1,2,3,4,5].map((s) => (
          <Icon key={s} name="Star" size={14} className={s <= current ? "text-amber-400" : "text-rzd-gray-mid"} />
        ))}
        <span className="text-xs text-rzd-muted ml-1">Оценка поставлена</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-xs text-rzd-muted mb-1.5">Оцените качество услуги:</p>
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => rateOrder(orderId, s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Icon name="Star" size={22} className={s <= val ? "text-amber-400" : "text-rzd-gray-mid"} />
          </button>
        ))}
        {val > 0 && (
          <span className="text-xs text-rzd-muted ml-2">
            {["", "Плохо", "Удовлетворительно", "Нормально", "Хорошо", "Отлично"][val]}
          </span>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const { label, cls } = statusCfg[order.status];

  return (
    <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-rzd-gray/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-rzd-gray rounded-xl flex items-center justify-center shrink-0">
            <Icon name={SERVICE_LABELS[order.serviceType].icon} fallback="Package" size={16} className="text-rzd-red" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-rzd-dark text-sm">{order.id}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
            </div>
            <p className="text-xs text-rzd-muted mt-0.5 truncate">
              {order.date} · {order.station.split("—").pop()?.trim()} · {SERVICE_LABELS[order.serviceType].short}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="font-black text-rzd-red text-sm">{order.price.toLocaleString("ru-RU")} ₽</span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} className="text-rzd-muted" />
        </div>
      </button>

      {open && (
        <div className="border-t border-rzd-gray-mid px-5 py-4 bg-rzd-gray/20 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              { icon: "MapPin",     label: "Вокзал",       val: order.station },
              { icon: "Clock",      label: "Дата и время",  val: `${order.date} в ${order.time}` },
              { icon: "Train",      label: "Поезд",         val: `${order.train}, вагон ${order.wagon}` },
              { icon: "Package",    label: "Багаж",         val: bagsWord(order.bags) },
              { icon: "CreditCard", label: "Стоимость",     val: `${order.price.toLocaleString("ru-RU")} ₽` },
              { icon: SERVICE_LABELS[order.serviceType].icon, label: "Услуга", val: SERVICE_LABELS[order.serviceType].short },
              ...(order.sign ? [{ icon: "FileText", label: "Табличка", val: order.sign }] : []),
              ...(order.porter ? [{ icon: "User",   label: "Носильщик", val: order.porter.name }] : []),
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-rzd-gray-mid">
                <div className="flex items-center gap-1.5 text-rzd-muted mb-1">
                  <Icon name={item.icon} fallback="Circle" size={11} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="font-semibold text-rzd-dark text-xs leading-snug">{item.val}</p>
              </div>
            ))}
          </div>

          {order.status === "completed" && (
            <StarRating orderId={order.id} current={order.rating} />
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {order.status === "completed" && (
              <button className="flex items-center gap-1.5 text-xs font-semibold text-rzd-dark bg-white border border-rzd-gray-mid px-3 py-2 rounded-lg hover:border-rzd-red transition-colors">
                <Icon name="Download" size={13} />
                Скачать чек
              </button>
            )}
            <a
              href="/#order"
              className="flex items-center gap-1.5 text-xs font-semibold text-rzd-red bg-rzd-red/10 hover:bg-rzd-red/20 px-3 py-2 rounded-lg transition-colors"
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
    <div className="space-y-5">

      <div>
        <h1 className="text-2xl font-black text-rzd-dark mb-1">История заказов</h1>
        <p className="text-rzd-muted text-sm">Все ваши поездки с MyPorter</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Всего заказов", val: orders.length },
          { label: "Выполнено",     val: orders.filter((o) => o.status === "completed").length },
          { label: "Потрачено",     val: `${totalSpent.toLocaleString("ru-RU")} ₽` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-rzd-gray-mid p-4 text-center">
            <p className="text-xl font-black text-rzd-red">{s.val}</p>
            <p className="text-xs text-rzd-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rzd-muted" />
          <input
            type="text"
            placeholder="Номер заказа, вокзал, поезд..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-rzd-gray-mid rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white"
          />
        </div>
        <div className="flex gap-1 bg-rzd-gray rounded-xl p-1 shrink-0">
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
