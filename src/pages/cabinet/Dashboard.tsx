import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const statusLabel: Record<string, { text: string; cls: string }> = {
  active:    { text: "Ожидает носильщика", cls: "bg-amber-100 text-amber-700" },
  assigned:  { text: "Носильщик назначен",  cls: "bg-green-100 text-green-700" },
  completed: { text: "Выполнен",            cls: "bg-rzd-gray text-rzd-muted" },
  cancelled: { text: "Отменён",             cls: "bg-red-100 text-red-600" },
};

export default function Dashboard() {
  const { user, orders, savedRoutes } = useAuth();
  if (!user) return null;

  const active = orders.filter((o) => o.status === "active" || o.status === "assigned");
  const next = active[0];
  const lastDone = orders.find((o) => o.status === "completed");
  const totalSpent = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.price, 0);

  return (
    <div className="space-y-5">

      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-black text-rzd-dark">
          Здравствуйте, {user.firstName}!
        </h1>
        <p className="text-rzd-muted text-sm mt-0.5">Добро пожаловать в личный кабинет</p>
      </div>

      {/* Уведомление о назначенном носильщике */}
      {next?.status === "assigned" && next.porter && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <Icon name="Bell" size={18} className="text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-green-800 text-sm">
              Носильщик назначен на заказ {next.id}
            </p>
            <p className="text-green-700 text-xs mt-0.5">
              {next.porter.name} встретит вас у вагона {next.wagon} в {next.time}
            </p>
          </div>
          <a
            href={`tel:${next.porter.phone}`}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <Icon name="Phone" size={13} />
            Позвонить
          </a>
        </div>
      )}

      {/* Ближайший заказ */}
      {next ? (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid shadow-sm overflow-hidden">
          <div className="bg-rzd-dark px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white/50 text-xs mb-0.5">Ближайший заказ</div>
              <div className="text-white font-black text-lg">{next.id}</div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusLabel[next.status].cls}`}>
              {statusLabel[next.status].text}
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { icon: "MapPin",  label: "Вокзал",        val: next.station.split("—").pop()?.trim() ?? next.station },
                { icon: "Clock",   label: "Время встречи", val: next.time },
                { icon: "Train",   label: "Поезд / вагон", val: `${next.train} / ${next.wagon}` },
                { icon: "Package", label: "Мест багажа",   val: `${next.bags} ${next.bags === 1 ? "место" : next.bags < 5 ? "места" : "мест"}` },
              ].map((item, i) => (
                <div key={i} className="bg-rzd-gray rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-rzd-muted mb-1">
                    <Icon name={item.icon} fallback="Circle" size={12} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <div className="font-semibold text-rzd-dark text-sm">{item.val}</div>
                </div>
              ))}
            </div>
            {next.porter && (
              <div className="flex items-center justify-between bg-rzd-gray rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rzd-red/10 rounded-lg flex items-center justify-center">
                    <Icon name="User" size={15} className="text-rzd-red" />
                  </div>
                  <div>
                    <div className="text-xs text-rzd-muted">Носильщик</div>
                    <div className="font-semibold text-rzd-dark text-sm">{next.porter.name}</div>
                  </div>
                </div>
                <a
                  href={`tel:${next.porter.phone}`}
                  className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Icon name="Phone" size={13} />
                  {next.porter.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-8 text-center">
          <div className="w-12 h-12 bg-rzd-gray rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Package" size={22} className="text-rzd-muted" />
          </div>
          <p className="font-semibold text-rzd-dark mb-1">Нет активных заказов</p>
          <p className="text-rzd-muted text-sm mb-4">Оформите заказ на носильщика прямо сейчас</p>
          <a
            href="/#order"
            className="inline-flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <Icon name="Plus" size={15} />
            Заказать носильщика
          </a>
        </div>
      )}

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "Plus",    label: "Новый заказ",  href: "/#order",         red: true },
          { icon: "History", label: "История",      to: "/cabinet/orders",   red: false },
          { icon: "User",    label: "Профиль",      to: "/cabinet/profile",  red: false },
          { icon: "Phone",   label: "Поддержка",    href: "tel:+78001000888",red: false },
        ].map((btn, i) => {
          const cls = `flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer ${
            btn.red
              ? "bg-rzd-red border-rzd-red text-white hover:bg-rzd-red-dark"
              : "bg-white border-rzd-gray-mid text-rzd-dark hover:border-rzd-red hover:shadow-sm"
          }`;
          const inner = (
            <>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${btn.red ? "bg-white/20" : "bg-rzd-gray"}`}>
                <Icon name={btn.icon} fallback="Circle" size={20} className={btn.red ? "text-white" : "text-rzd-red"} />
              </div>
              <span className="text-xs font-semibold">{btn.label}</span>
            </>
          );
          if (btn.href) return <a key={i} href={btn.href} className={cls}>{inner}</a>;
          return <Link key={i} to={btn.to!} className={cls}>{inner}</Link>;
        })}
      </div>

      {/* Мои маршруты */}
      {savedRoutes.length > 0 && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-rzd-dark">Мои маршруты</h2>
            <Link to="/cabinet/profile" className="text-rzd-red text-xs font-medium hover:underline">
              Управлять
            </Link>
          </div>
          <div className="space-y-2">
            {savedRoutes.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="MapPin" size={14} className="text-rzd-muted" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-rzd-dark truncate">{r.name}</div>
                    <div className="text-xs text-rzd-muted truncate">
                      {r.station.split("—").pop()?.trim()} · поезд {r.train} · {r.bags} {r.bags === 1 ? "место" : "места"}
                    </div>
                  </div>
                </div>
                <a
                  href="/#order"
                  className="shrink-0 flex items-center gap-1 bg-rzd-red/10 text-rzd-red text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-rzd-red/20 transition-colors ml-3"
                >
                  <Icon name="Play" size={12} />
                  Заказать
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Повтор последнего + статистика */}
      <div className="grid md:grid-cols-2 gap-4">
        {lastDone && (
          <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-rzd-dark text-sm">Последний заказ</h3>
              <Icon name="RefreshCcw" size={15} className="text-rzd-muted" />
            </div>
            <div className="text-xs text-rzd-muted mb-0.5">{lastDone.date}</div>
            <div className="font-semibold text-rzd-dark text-sm mb-0.5">{lastDone.station}</div>
            <div className="text-xs text-rzd-muted mb-4">
              Поезд {lastDone.train}, вагон {lastDone.wagon} · {lastDone.bags} {lastDone.bags === 1 ? "место" : "места"}
            </div>
            <a
              href="/#order"
              className="flex items-center justify-center gap-2 bg-rzd-gray hover:bg-rzd-gray-mid text-rzd-dark font-semibold text-xs py-2.5 rounded-lg transition-colors"
            >
              <Icon name="RefreshCcw" size={13} />
              Повторить заказ
            </a>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
          <h3 className="font-bold text-rzd-dark text-sm mb-4">Статистика</h3>
          <div className="space-y-3">
            {[
              { label: "Всего заказов",   val: `${orders.length}` },
              { label: "Выполнено",       val: `${orders.filter((o) => o.status === "completed").length}` },
              { label: "Потрачено",       val: `${totalSpent.toLocaleString("ru-RU")} ₽` },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-rzd-muted">{s.label}</span>
                <span className="font-bold text-rzd-dark text-sm">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
