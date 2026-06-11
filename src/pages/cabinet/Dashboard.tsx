import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, SERVICE_LABELS, ServiceType } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

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
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Icon key={s} name="Star" size={16}
            className={s <= current ? "text-amber-400" : "text-rzd-gray-mid"} />
        ))}
        <span className="text-xs text-rzd-muted ml-1">Ваша оценка</span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-rzd-muted mb-2">Оцените качество услуги:</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => rateOrder(orderId, s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Icon name="Star" size={26}
              className={s <= val ? "text-amber-400" : "text-rzd-gray-mid"} />
          </button>
        ))}
        <span className="text-xs text-rzd-muted ml-2">
          {val === 1 ? "Плохо" : val === 2 ? "Удовлетворительно" : val === 3 ? "Нормально" : val === 4 ? "Хорошо" : val === 5 ? "Отлично" : ""}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, orders, savedRoutes } = useAuth();
  if (!user) return null;

  const activeOrders = orders.filter((o) => o.status === "active" || o.status === "assigned");
  const nextOrder = activeOrders[0];
  const recentDone = orders.filter((o) => o.status === "completed").slice(0, 3);
  const unrated = orders.filter((o) => o.status === "completed" && !o.rating)[0];

  const services: { type: ServiceType; desc: string }[] = [
    { type: "station_to_taxi",  desc: "Доставим вещи с перрона до вашего такси или выхода с вокзала" },
    { type: "station_to_point", desc: "Поможем добраться с вещами до любой точки на территории вокзала" },
    { type: "city_to_wagon",    desc: "Встретим у входа или дома и доставим вещи прямо до вагона" },
    { type: "city_to_point",    desc: "Доставим вещи из любой точки города до нужного места на вокзале" },
  ];

  return (
    <div className="space-y-5">

      {/* Заголовок */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark">
            Здравствуйте, {user.firstName}!
          </h1>
          <p className="text-rzd-muted text-sm mt-0.5">Личный кабинет MyPorter</p>
        </div>
        <a
          href="/#order"
          className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Icon name="Plus" size={16} />
          <span className="hidden sm:inline">Новый заказ</span>
        </a>
      </div>

      {/* Кнопка нового заказа — мобиль */}
      <a
        href="/#order"
        className="sm:hidden w-full flex items-center justify-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-base py-4 rounded-2xl transition-colors"
      >
        <Icon name="Plus" size={18} />
        Заказать носильщика
      </a>

      {/* Запрос оценки */}
      {unrated && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Icon name="Star" size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-rzd-dark text-sm">Оцените выполненный заказ</p>
              <p className="text-rzd-muted text-xs">{unrated.id} · {unrated.station.split("—").pop()?.trim()} · {unrated.date}</p>
            </div>
          </div>
          <StarRating orderId={unrated.id} current={unrated.rating} />
        </div>
      )}

      {/* Активный заказ */}
      {nextOrder && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
          <div className="bg-rzd-dark px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs mb-0.5">Активный заказ</p>
              <p className="text-white font-black text-base">{nextOrder.id}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              nextOrder.status === "assigned" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}>
              {nextOrder.status === "assigned" ? "Носильщик назначен" : "Ожидает носильщика"}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {/* Услуга */}
            <div className="flex items-center gap-2 text-xs text-rzd-muted">
              <Icon name={SERVICE_LABELS[nextOrder.serviceType].icon} fallback="Circle" size={13} />
              <span>{SERVICE_LABELS[nextOrder.serviceType].full}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                { icon: "MapPin",  label: "Вокзал",       val: nextOrder.station.split("—").pop()?.trim() ?? nextOrder.station },
                { icon: "Clock",   label: "Время встречи", val: `${nextOrder.date}, ${nextOrder.time}` },
                { icon: "Train",   label: "Поезд / вагон", val: `${nextOrder.train} / ${nextOrder.wagon}` },
                { icon: "Package", label: "Мест багажа",   val: bagsWord(nextOrder.bags) },
              ].map((item, i) => (
                <div key={i} className="bg-rzd-gray rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-rzd-muted mb-1">
                    <Icon name={item.icon} fallback="Circle" size={12} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <p className="font-semibold text-rzd-dark text-sm leading-tight">{item.val}</p>
                </div>
              ))}
            </div>

            {nextOrder.porter && (
              <div className="flex items-center justify-between bg-rzd-gray rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rzd-red/10 rounded-lg flex items-center justify-center">
                    <Icon name="User" size={15} className="text-rzd-red" />
                  </div>
                  <div>
                    <p className="text-xs text-rzd-muted">Носильщик</p>
                    <p className="font-semibold text-rzd-dark text-sm">{nextOrder.porter.name}</p>
                  </div>
                </div>
                <a
                  href={`tel:${nextOrder.porter.phone}`}
                  className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Icon name="Phone" size={13} />
                  Позвонить
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Выбор услуги */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-rzd-dark">Выберите услугу</h2>
          <a href="/#order" className="text-rzd-red text-xs font-medium hover:underline">Заказать →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {services.map(({ type, desc }) => {
            const { short, icon } = SERVICE_LABELS[type];
            return (
              <a
                key={type}
                href="/#order"
                className="flex items-start gap-3 border border-rzd-gray-mid rounded-xl p-3.5 hover:border-rzd-red hover:shadow-sm transition-all group"
              >
                <div className="w-9 h-9 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0 group-hover:bg-rzd-red/10 transition-colors">
                  <Icon name={icon} fallback="MapPin" size={16} className="text-rzd-red" />
                </div>
                <div>
                  <p className="font-semibold text-rzd-dark text-sm">{short}</p>
                  <p className="text-xs text-rzd-muted leading-relaxed mt-0.5">{desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Мои маршруты */}
      {savedRoutes.length > 0 && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-rzd-dark">Мои маршруты</h2>
            <Link to="/cabinet/profile" className="text-rzd-red text-xs font-medium hover:underline">
              Все маршруты
            </Link>
          </div>
          <div className="space-y-2">
            {savedRoutes.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                  <Icon name="MapPin" size={14} className="text-rzd-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-rzd-dark truncate">{r.name}</p>
                  <p className="text-xs text-rzd-muted truncate">
                    {r.station.split("—").pop()?.trim()} · поезд {r.train}, вагон {r.wagon} · {bagsWord(r.bags)}
                  </p>
                </div>
                <a
                  href="/#order"
                  className="shrink-0 flex items-center gap-1 bg-rzd-red/10 hover:bg-rzd-red/20 text-rzd-red text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Icon name="Play" size={11} />
                  Заказать
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Последние заказы */}
      {recentDone.length > 0 && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-rzd-dark">Последние заказы</h2>
            <Link to="/cabinet/orders" className="text-rzd-red text-xs font-medium hover:underline">
              Все заказы
            </Link>
          </div>
          <div className="space-y-2">
            {recentDone.map((o) => (
              <div key={o.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={SERVICE_LABELS[o.serviceType].icon} fallback="Package" size={14} className="text-rzd-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-rzd-dark">{o.id}</p>
                  <p className="text-xs text-rzd-muted truncate">
                    {o.date} · {o.station.split("—").pop()?.trim()}
                  </p>
                  {o.rating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Icon key={s} name="Star" size={11}
                          className={s <= o.rating! ? "text-amber-400" : "text-rzd-gray-mid"} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-rzd-red text-sm">{o.price.toLocaleString("ru-RU")} ₽</p>
                  {!o.rating && (
                    <StarRating orderId={o.id} current={o.rating} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
