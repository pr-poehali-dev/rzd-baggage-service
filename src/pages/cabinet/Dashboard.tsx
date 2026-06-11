import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const statusConfig = {
  active: { label: "Ожидает носильщика", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  assigned: { label: "Носильщик назначен", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  completed: { label: "Выполнен", color: "bg-rzd-gray text-rzd-muted", dot: "bg-rzd-muted" },
  cancelled: { label: "Отменён", color: "bg-red-100 text-red-600", dot: "bg-red-500" },
};

export default function Dashboard() {
  const { user, orders } = useAuth();
  const navigate = useNavigate();

  const activeOrders = orders.filter((o) => o.status === "active" || o.status === "assigned");
  const lastCompleted = orders.find((o) => o.status === "completed");
  const nextOrder = activeOrders[0];

  if (!user) return null;

  return (
    <div className="space-y-6">

      {/* Приветствие */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark">
            Привет, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-rzd-muted text-sm mt-0.5">Ваш личный кабинет MyPorter</p>
        </div>
        <div className="bg-rzd-red/10 border border-rzd-red/20 rounded-xl px-4 py-2.5 text-center">
          <div className="text-rzd-red font-black text-lg leading-tight">{user.bonusPoints}</div>
          <div className="text-xs text-rzd-muted">баллов</div>
        </div>
      </div>

      {/* Уведомление об активном заказе */}
      {nextOrder && nextOrder.status === "assigned" && nextOrder.porter && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <Icon name="Bell" size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-green-800 text-sm mb-1">
              Носильщик назначен на ваш заказ {nextOrder.id}
            </div>
            <p className="text-green-700 text-xs">
              {nextOrder.porter.name} встретит вас у вагона {nextOrder.wagon} в {nextOrder.time}
            </p>
          </div>
          <a
            href={`tel:${nextOrder.porter.phone}`}
            className="shrink-0 flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="Phone" size={13} />
            Позвонить
          </a>
        </div>
      )}

      {/* Активный заказ */}
      {nextOrder ? (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid shadow-sm overflow-hidden">
          <div className="bg-rzd-dark px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide mb-0.5">Ближайший заказ</div>
              <div className="text-white font-black text-lg">{nextOrder.id}</div>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[nextOrder.status].color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[nextOrder.status].dot}`} />
              {statusConfig[nextOrder.status].label}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { icon: "MapPin", label: "Вокзал", value: nextOrder.station.split("—")[1]?.trim() || nextOrder.station },
                { icon: "Clock", label: "Время встречи", value: nextOrder.time },
                { icon: "Train", label: "Поезд / Вагон", value: `${nextOrder.train} / ${nextOrder.wagon}` },
                { icon: "Package", label: "Мест багажа", value: `${nextOrder.bags} ${nextOrder.bags === 1 ? "место" : "места"}` },
              ].map((item, i) => (
                <div key={i} className="bg-rzd-gray rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-rzd-muted mb-1.5">
                    <Icon name={item.icon} fallback="Circle" size={13} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <div className="font-bold text-rzd-dark text-sm leading-tight">{item.value}</div>
                </div>
              ))}
            </div>

            {nextOrder.porter && (
              <div className="flex items-center justify-between bg-rzd-gray rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-rzd-red/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-rzd-red" />
                  </div>
                  <div>
                    <div className="text-xs text-rzd-muted">Ваш носильщик</div>
                    <div className="font-bold text-rzd-dark text-sm">{nextOrder.porter.name}</div>
                  </div>
                </div>
                <a
                  href={`tel:${nextOrder.porter.phone}`}
                  className="flex items-center gap-1.5 bg-rzd-red text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-rzd-red-dark transition-colors"
                >
                  <Icon name="Phone" size={13} />
                  {nextOrder.porter.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-8 text-center">
          <div className="w-14 h-14 bg-rzd-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={24} className="text-rzd-muted" />
          </div>
          <p className="font-semibold text-rzd-dark mb-1">Нет активных заказов</p>
          <p className="text-rzd-muted text-sm mb-5">Оформите заказ на носильщика прямо сейчас</p>
          <a
            href="/#order"
            className="inline-flex items-center gap-2 bg-rzd-red text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-rzd-red-dark transition-colors"
          >
            <Icon name="Plus" size={16} />
            Заказать носильщика
          </a>
        </div>
      )}

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "Plus", label: "Новый заказ", href: "/#order", primary: true },
          { icon: "History", label: "История", onClick: () => navigate("/cabinet/orders") },
          { icon: "User", label: "Профиль", onClick: () => navigate("/cabinet/profile") },
          { icon: "Phone", label: "Поддержка", href: "tel:+78001000888" },
        ].map((btn, i) => {
          const cls = `flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all cursor-pointer text-center ${
            btn.primary
              ? "bg-rzd-red border-rzd-red text-white hover:bg-rzd-red-dark"
              : "bg-white border-rzd-gray-mid text-rzd-dark hover:border-rzd-red hover:shadow-sm"
          }`;
          const inner = (
            <>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${btn.primary ? "bg-white/20" : "bg-rzd-gray"}`}>
                <Icon name={btn.icon} fallback="Circle" size={20} className={btn.primary ? "text-white" : "text-rzd-red"} />
              </div>
              <span className="text-xs font-semibold">{btn.label}</span>
            </>
          );
          if (btn.href) return <a key={i} href={btn.href} className={cls}>{inner}</a>;
          return <div key={i} className={cls} onClick={btn.onClick}>{inner}</div>;
        })}
      </div>

      {/* Быстрый повтор последнего заказа */}
      {lastCompleted && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-rzd-dark">Повторить последний заказ</div>
            <Icon name="RefreshCcw" size={16} className="text-rzd-muted" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-rzd-muted mb-0.5">{lastCompleted.date}</div>
              <div className="font-semibold text-rzd-dark text-sm truncate">{lastCompleted.station}</div>
              <div className="text-xs text-rzd-muted">
                {lastCompleted.train}, вагон {lastCompleted.wagon} · {lastCompleted.bags} {lastCompleted.bags === 1 ? "место" : "места"}
              </div>
            </div>
            <div className="text-rzd-red font-black">{lastCompleted.price.toLocaleString("ru-RU")} ₽</div>
          </div>
          <a
            href="/#order"
            className="w-full flex items-center justify-center gap-2 bg-rzd-gray hover:bg-rzd-gray-mid text-rzd-dark font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <Icon name="RefreshCcw" size={15} />
            Повторить заказ
          </a>
        </div>
      )}

      {/* Финансовая сводка */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: "Receipt",
            label: "Потрачено всего",
            value: `${orders.filter(o => o.status === "completed").reduce((s, o) => s + o.price, 0).toLocaleString("ru-RU")} ₽`,
            sub: `${orders.filter(o => o.status === "completed").length} поездок`,
          },
          {
            icon: "Star",
            label: "Бонусные баллы",
            value: user.bonusPoints.toLocaleString("ru-RU"),
            sub: `≈ ${Math.floor(user.bonusPoints / 500) * 500} ₽ к списанию`,
          },
          {
            icon: "TrendingUp",
            label: "Средний чек",
            value: `${Math.round(orders.filter(o => o.status === "completed").reduce((s, o) => s + o.price, 0) / Math.max(orders.filter(o => o.status === "completed").length, 1)).toLocaleString("ru-RU")} ₽`,
            sub: "за поездку",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
            <div className="flex items-center gap-2 text-rzd-muted mb-3">
              <Icon name={card.icon} fallback="Circle" size={15} />
              <span className="text-xs">{card.label}</span>
            </div>
            <div className="text-2xl font-black text-rzd-dark mb-0.5">{card.value}</div>
            <div className="text-xs text-rzd-muted">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
