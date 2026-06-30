import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Демо-данные ────────────────────────────────────────────────────────────

const demoUser = {
  id: "CLT-00142",
  lastName: "Петрова",
  firstName: "Анна",
  middleName: "Сергеевна",
  phone: "+7 (916) 234-56-78",
  email: "anna.petrova@mail.ru",
};

const demoOrders = [
  {
    id: "ОРД-2841",
    status: "assigned" as const,
    service: "Из города / дома — до вагона",
    serviceIcon: "Home",
    date: "14.06.2026",
    time: "14:30",
    station: "Москва — Казанский вокзал",
    train: "020А",
    wagon: "5",
    bags: 3,
    price: 1500,
    paid: true,
    sign: "Петрова А.С.",
    porter: { name: "Соколов Алексей", phone: "+7 (916) 234-56-78" },
  },
  {
    id: "ОРД-2790",
    status: "completed" as const,
    service: "С вокзала — до такси или выхода",
    serviceIcon: "Car",
    date: "28.05.2026",
    time: "09:15",
    station: "Санкт-Петербург — Московский вокзал",
    train: "004А",
    wagon: "2",
    bags: 2,
    price: 1000,
    paid: true,
    sign: undefined as string | undefined,
    porter: { name: "Иванов Михаил", phone: "+7 (916) 111-22-33" },
  },
  {
    id: "ОРД-2744",
    status: "completed" as const,
    service: "С вокзала — по территории",
    serviceIcon: "MapPin",
    date: "10.05.2026",
    time: "18:45",
    station: "Москва — Ленинградский вокзал",
    train: "002А",
    wagon: "7",
    bags: 1,
    price: 500,
    paid: true,
    sign: undefined as string | undefined,
    porter: { name: "Козлов Дмитрий", phone: "+7 (916) 333-44-55" },
  },
];

const services = [
  { icon: "Car",        short: "До такси",       desc: "Доставим вещи с перрона до вашего такси или выхода с вокзала" },
  { icon: "MapPin",     short: "По территории",  desc: "Поможем добраться с вещами до любой точки на территории вокзала" },
  { icon: "Home",       short: "До вагона",      desc: "Встретим у входа или дома и доставим вещи прямо до вагона" },
  { icon: "Navigation", short: "В нужное место", desc: "Доставим вещи из любой точки города до нужного места на вокзале" },
];

const statusCfg = {
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

// ─── Шапка кабинета ─────────────────────────────────────────────────────────
function CabinetHeader({ active }: { active: string }) {
  const nav = [
    { label: "Главная", key: "dashboard" },
    { label: "Заказы",  key: "orders" },
    { label: "Профиль", key: "profile" },
  ];
  return (
    <div className="bg-white border-b border-rzd-gray-mid rounded-t-2xl px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-rzd-red text-white font-black text-xs px-2.5 py-1 rounded tracking-widest">РЖД</div>
        <span className="font-bold text-sm text-rzd-dark hidden sm:block">MyPorter</span>
      </div>
      <div className="flex items-center gap-1 bg-rzd-gray rounded-xl p-1">
        {nav.map((n) => (
          <div key={n.key} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active === n.key ? "bg-white shadow-sm text-rzd-dark" : "text-rzd-muted"}`}>
            {n.label}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-rzd-red rounded-lg flex items-center justify-center text-white font-black text-xs">АП</div>
        <span className="text-sm font-semibold text-rzd-dark hidden sm:block">Анна</span>
      </div>
    </div>
  );
}

// ─── Экран: Дашборд ──────────────────────────────────────────────────────────
function ScreenDashboard() {
  const next = demoOrders[0]; // активный заказ (assigned)
  const isCompleted = next.status === "completed";

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-black text-rzd-dark">Здравствуйте, Анна!</h2>
          <p className="text-rzd-muted text-sm">Личный кабинет MyPorter</p>
        </div>
        <a href="/#order" className="flex items-center gap-1.5 bg-rzd-red text-white font-bold text-xs px-3 py-2 rounded-xl">
          <Icon name="Plus" size={14} />Новый заказ
        </a>
      </div>

      {/* Активный заказ */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
        <div className="bg-rzd-dark px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs mb-0.5">Активный заказ</p>
            <p className="text-white font-black text-base">{next.id}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg[next.status].cls}`}>
            {statusCfg[next.status].label}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-rzd-muted">
            <Icon name={next.serviceIcon} fallback="Package" size={12} />
            <span>{next.service}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "MapPin",  label: "Вокзал",        val: next.station.split("—").pop()?.trim() ?? next.station },
              { icon: "Clock",   label: "Время встречи", val: `${next.date}, ${next.time}` },
              { icon: "Train",   label: "Поезд / вагон", val: `${next.train} / ${next.wagon}` },
              { icon: "Package", label: "Мест багажа",   val: bagsWord(next.bags) },
            ].map((item, i) => (
              <div key={i} className="bg-rzd-gray rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-rzd-muted mb-1">
                  <Icon name={item.icon} fallback="Circle" size={11} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="font-semibold text-rzd-dark text-sm">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Носильщик — телефон только пока заказ не выполнен */}
          {next.porter && !isCompleted && (
            <div className="flex items-center justify-between bg-rzd-gray rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rzd-red/10 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={14} className="text-rzd-red" />
                </div>
                <div>
                  <p className="text-xs text-rzd-muted">Носильщик</p>
                  <p className="font-semibold text-rzd-dark text-sm">{next.porter.name}</p>
                </div>
              </div>
              <a href={`tel:${next.porter.phone}`} className="flex items-center gap-1.5 bg-rzd-red text-white text-xs font-semibold px-3 py-2 rounded-lg">
                <Icon name="Phone" size={12} />Позвонить
              </a>
            </div>
          )}

          {/* Если выполнен — имя без телефона */}
          {next.porter && isCompleted && (
            <div className="flex items-center gap-3 bg-rzd-gray rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-rzd-red/10 rounded-lg flex items-center justify-center">
                <Icon name="User" size={14} className="text-rzd-red" />
              </div>
              <div>
                <p className="text-xs text-rzd-muted">Носильщик</p>
                <p className="font-semibold text-rzd-dark text-sm">{next.porter.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Выбор услуги */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-rzd-dark">Выберите услугу</h3>
          <a href="/#order" className="text-rzd-red text-xs font-medium">Заказать →</a>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {services.map((s) => (
            <div key={s.icon} className="flex items-start gap-2.5 border border-rzd-gray-mid rounded-xl p-3 hover:border-rzd-red transition-colors cursor-pointer group">
              <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0 group-hover:bg-rzd-red/10 transition-colors">
                <Icon name={s.icon} fallback="MapPin" size={14} className="text-rzd-red" />
              </div>
              <div>
                <p className="font-semibold text-rzd-dark text-xs">{s.short}</p>
                <p className="text-xs text-rzd-muted leading-relaxed mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Последние заказы */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-rzd-dark">Последние заказы</h3>
          <span className="text-rzd-red text-xs font-medium cursor-pointer">Все заказы</span>
        </div>
        <div className="space-y-2">
          {demoOrders.filter(o => o.status === "completed").slice(0, 2).map((o) => (
            <div key={o.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                <Icon name={o.serviceIcon} fallback="Package" size={13} className="text-rzd-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-rzd-dark">{o.id}</p>
                <p className="text-xs text-rzd-muted">{o.date} · {o.station.split("—").pop()?.trim()}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-rzd-red text-sm">{o.price.toLocaleString("ru-RU")} ₽</p>
                <p className="text-xs text-green-600 font-medium">Оплачено</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Экран: История заказов ──────────────────────────────────────────────────
function ScreenOrders() {
  const [openId, setOpenId] = useState<string | null>(null);

  const totalSpent = demoOrders
    .filter(o => o.status === "completed")
    .reduce((s, o) => s + o.price, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-rzd-dark mb-1">История заказов</h2>
        <p className="text-rzd-muted text-sm">Все ваши поездки с MyPorter</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Всего",     val: demoOrders.length },
          { label: "Выполнено", val: demoOrders.filter(o => o.status === "completed").length },
          { label: "Потрачено", val: `${totalSpent.toLocaleString("ru-RU")} ₽` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-rzd-gray-mid p-3 text-center">
            <p className="text-lg font-black text-rzd-red">{s.val}</p>
            <p className="text-xs text-rzd-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Список заказов */}
      <div className="space-y-2">
        {demoOrders.map((o) => {
          const cfg = statusCfg[o.status];
          const isOpen = openId === o.id;
          const isCompleted = o.status === "completed";

          return (
            <div key={o.id} className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
              {/* Строка-заголовок */}
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : o.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-rzd-gray/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-rzd-gray rounded-xl flex items-center justify-center shrink-0">
                    <Icon name={o.serviceIcon} fallback="Package" size={15} className="text-rzd-red" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-rzd-dark text-sm">{o.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-rzd-muted mt-0.5 truncate">
                      {o.date} · {o.station.split("—").pop()?.trim()} · {bagsWord(o.bags)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <div className="text-right">
                    <p className="font-black text-rzd-red text-sm">{o.price.toLocaleString("ru-RU")} ₽</p>
                    {o.paid && <p className="text-xs text-green-600 font-medium">Оплачено</p>}
                  </div>
                  <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={15} className="text-rzd-muted" />
                </div>
              </button>

              {/* Детали */}
              {isOpen && (
                <div className="border-t border-rzd-gray-mid px-4 py-4 bg-rzd-gray/20 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: "MapPin",     label: "Вокзал / аэропорт", val: o.station },
                      { icon: "Clock",      label: "Дата и время",       val: `${o.date} в ${o.time}` },
                      { icon: "Train",      label: "Поезд",              val: `${o.train}, вагон ${o.wagon}` },
                      { icon: "Package",    label: "Количество мест",    val: bagsWord(o.bags) },
                      { icon: o.serviceIcon, label: "Услуга",            val: o.service },
                      { icon: "CreditCard", label: "Оплата",             val: o.paid ? `${o.price.toLocaleString("ru-RU")} ₽ · Оплачено` : "Не оплачено" },
                      ...(o.sign ? [{ icon: "FileText", label: "Табличка", val: o.sign }] : []),
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-xl p-2.5 border border-rzd-gray-mid">
                        <div className="flex items-center gap-1 text-rzd-muted mb-0.5">
                          <Icon name={item.icon} fallback="Circle" size={10} />
                          <span className="text-xs">{item.label}</span>
                        </div>
                        <p className="font-semibold text-rzd-dark text-xs leading-snug">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Носильщик — телефон только для активных */}
                  {o.porter && (
                    <div className="flex items-center justify-between bg-white border border-rzd-gray-mid rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-rzd-red/10 rounded-lg flex items-center justify-center">
                          <Icon name="User" size={14} className="text-rzd-red" />
                        </div>
                        <div>
                          <p className="text-xs text-rzd-muted">Носильщик</p>
                          <p className="font-semibold text-rzd-dark text-sm">{o.porter.name}</p>
                        </div>
                      </div>
                      {!isCompleted && (
                        <a href={`tel:${o.porter.phone}`} className="flex items-center gap-1.5 bg-rzd-red text-white text-xs font-semibold px-3 py-2 rounded-lg">
                          <Icon name="Phone" size={12} />Позвонить
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Экран: Профиль ──────────────────────────────────────────────────────────
function ScreenProfile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    lastName:   demoUser.lastName,
    firstName:  demoUser.firstName,
    middleName: demoUser.middleName,
    email:      demoUser.email,
  });
  const [saved, setSaved] = useState(false);

  const inp = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60 disabled:bg-rzd-gray disabled:text-rzd-muted";
  const lbl = "text-xs font-medium text-rzd-muted block mb-1.5";

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const completedOrders = demoOrders.filter(o => o.status === "completed");
  const totalSpent = completedOrders.reduce((s, o) => s + o.price, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-rzd-dark mb-1">Профиль</h2>
          <p className="text-rzd-muted text-sm">Личные данные и настройки</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
            <Icon name="Check" size={12} />Сохранено
          </div>
        )}
      </div>

      {/* Аватар + персональные данные */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 bg-rzd-red rounded-2xl flex items-center justify-center text-white font-black text-2xl">
              АП
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-rzd-dark rounded-lg flex items-center justify-center cursor-pointer hover:bg-rzd-red transition-colors">
              <Icon name="Camera" size={12} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-rzd-dark text-lg leading-tight">
              {form.lastName} {form.firstName} {form.middleName}
            </p>
            <p className="text-rzd-muted text-sm">{demoUser.phone}</p>
          </div>
          <button
            onClick={() => { setEditing(!editing); }}
            className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark text-xs font-semibold px-3 py-2 rounded-lg hover:border-rzd-red transition-colors shrink-0"
          >
            <Icon name={editing ? "X" : "Pencil"} size={13} />
            {editing ? "Отмена" : "Изменить"}
          </button>
        </div>

        {/* Персональные данные — таблица */}
        {!editing && (
          <div className="border border-rzd-gray-mid rounded-xl overflow-hidden">
            {[
              { label: "ID клиента",  val: demoUser.id,    icon: "Hash" },
              { label: "Фамилия",     val: form.lastName,  icon: "User" },
              { label: "Имя",         val: form.firstName, icon: "User" },
              { label: "Отчество",    val: form.middleName,icon: "User" },
              { label: "Телефон",     val: demoUser.phone, icon: "Phone" },
              { label: "Эл. почта",   val: form.email || "—", icon: "Mail" },
            ].map((row, i, arr) => (
              <div key={i} className={`flex items-center px-4 py-3 ${i < arr.length - 1 ? "border-b border-rzd-gray-mid" : ""}`}>
                <div className="flex items-center gap-2 w-36 shrink-0">
                  <Icon name={row.icon} fallback="Circle" size={13} className="text-rzd-muted" />
                  <span className="text-xs text-rzd-muted">{row.label}</span>
                </div>
                <span className={`text-sm font-semibold text-rzd-dark ${row.label === "ID клиента" ? "font-mono text-rzd-red" : ""}`}>{row.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Форма редактирования */}
      {editing && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5 space-y-3">
          <h3 className="font-bold text-rzd-dark text-sm">Редактировать данные</h3>
          <div>
            <label className={lbl}>Фамилия <span className="text-rzd-red">*</span></label>
            <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Имя <span className="text-rzd-red">*</span></label>
              <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={inp} />
            </div>
            <div>
              <label className={lbl}>Отчество</label>
              <input value={form.middleName} onChange={e => setForm({ ...form, middleName: e.target.value })} className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Телефон</label>
              <input value={demoUser.phone} disabled className={inp} />
            </div>
            <div>
              <label className={lbl}>Электронная почта</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inp} placeholder="example@mail.ru" />
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors">
            <Icon name="Check" size={14} />Сохранить
          </button>
        </div>
      )}

      {/* История заказов */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-rzd-dark">История заказов</h3>
          <p className="text-xs text-rzd-muted">{completedOrders.length} поездки · {totalSpent.toLocaleString("ru-RU")} ₽</p>
        </div>
        <div className="space-y-2">
          {completedOrders.map(o => (
            <div key={o.id} className="border border-rzd-gray-mid rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                    <Icon name={o.serviceIcon} fallback="Package" size={13} className="text-rzd-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-rzd-dark">{o.id}</p>
                    <p className="text-xs text-rzd-muted truncate">{o.station.split("—").pop()?.trim()}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-rzd-red text-sm">{o.price.toLocaleString("ru-RU")} ₽</p>
                  <p className="text-xs text-green-600 font-medium">Оплачено</p>
                </div>
              </div>
              {/* Детали строкой */}
              <div className="border-t border-rzd-gray-mid bg-rzd-gray/30 px-4 py-2 flex flex-wrap gap-x-4 gap-y-1">
                {[
                  { label: "Дата",    val: o.date },
                  { label: "Мест",    val: bagsWord(o.bags) },
                  { label: "Статус",  val: statusCfg[o.status].label },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-xs text-rzd-muted">{d.label}:</span>
                    <span className="text-xs font-semibold text-rzd-dark">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Выход */}
      <button className="w-full flex items-center justify-center gap-2 border border-rzd-gray-mid text-rzd-muted hover:border-red-300 hover:text-red-500 font-semibold text-sm py-3 rounded-2xl transition-colors">
        <Icon name="LogOut" size={15} />Выйти из аккаунта
      </button>
    </div>
  );
}

// ─── Главная страница превью ─────────────────────────────────────────────────
type Tab = "dashboard" | "orders" | "profile";

export default function CabinetPreview() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "Главная",  icon: "LayoutDashboard" },
    { key: "orders",    label: "Заказы",   icon: "History" },
    { key: "profile",   label: "Профиль",  icon: "User" },
  ];

  return (
    <div className="font-golos min-h-screen bg-rzd-gray">
      {/* Баннер */}
      <div className="bg-rzd-dark border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <Icon name="Eye" size={14} className="text-rzd-red" />
            <span>Предварительный просмотр — данные тестовые</span>
          </div>
          <Link to="/cabinet/login" className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            Войти в кабинет →
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-24">
        <div className="bg-white rounded-2xl border border-rzd-gray-mid shadow-sm overflow-hidden">
          <CabinetHeader active={tab} />
          <div className="p-4">
            {tab === "dashboard" && <ScreenDashboard />}
            {tab === "orders"    && <ScreenOrders />}
            {tab === "profile"   && <ScreenProfile />}
          </div>
        </div>
      </div>

      {/* Таббар */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-rzd-gray-mid z-40">
        <div className="flex max-w-2xl mx-auto">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition-colors ${tab === key ? "text-rzd-red" : "text-rzd-muted"}`}
            >
              <Icon name={icon} fallback="Circle" size={20} />
              {label}
            </button>
          ))}
          <Link to="/" className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-rzd-muted hover:text-rzd-dark transition-colors">
            <Icon name="Home" size={20} />
            На сайт
          </Link>
        </div>
      </nav>
    </div>
  );
}
