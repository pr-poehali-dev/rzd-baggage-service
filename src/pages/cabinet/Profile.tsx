import { useState, useRef } from "react";
import { useAuth, SavedRoute, SERVICE_LABELS, ServiceType } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const inputCls = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60 disabled:bg-rzd-gray disabled:text-rzd-muted";
const labelCls = "text-xs font-medium text-rzd-muted block mb-1.5";

const stations = [
  "Москва — Ленинградский вокзал",
  "Москва — Казанский вокзал",
  "Москва — Ярославский вокзал",
  "Москва — Павелецкий вокзал",
  "Москва — Киевский вокзал",
  "Москва — Курский вокзал",
  "Санкт-Петербург — Московский вокзал",
  "Санкт-Петербург — Витебский вокзал",
  "Санкт-Петербург — Финляндский вокзал",
  "Сочи — Главный вокзал",
  "Другой вокзал",
];

function bagsWord(n: number) {
  if (n === 1) return "1 место";
  if (n < 5) return `${n} места`;
  return `${n} мест`;
}

export default function Profile() {
  const { user, orders, savedRoutes, updateUser, addRoute, deleteRoute, logout } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    lastName:   user?.lastName   ?? "",
    firstName:  user?.firstName  ?? "",
    middleName: user?.middleName ?? "",
    email:      user?.email      ?? "",
  });
  const [saved, setSaved] = useState(false);

  const [showRouteForm, setShowRouteForm] = useState(false);
  const [newRoute, setNewRoute] = useState<Omit<SavedRoute, "id">>({
    name: "", station: "", train: "", wagon: "", bags: 1, serviceType: "city_to_wagon",
  });
  const [routeError, setRouteError] = useState("");

  if (!user) return null;

  const initials = `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`;

  const handleSave = () => {
    if (!form.lastName.trim() || !form.firstName.trim()) return;
    updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUser({ photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleAddRoute = () => {
    if (!newRoute.name.trim() || !newRoute.station || !newRoute.train.trim() || !newRoute.wagon.trim()) {
      setRouteError("Заполните все обязательные поля");
      return;
    }
    addRoute(newRoute);
    setNewRoute({ name: "", station: "", train: "", wagon: "", bags: 1, serviceType: "city_to_wagon" });
    setShowRouteForm(false);
    setRouteError("");
  };

  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalSpent = completedOrders.reduce((s, o) => s + o.price, 0);

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark mb-1">Профиль</h1>
          <p className="text-rzd-muted text-sm">Личные данные и настройки</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl">
            <Icon name="Check" size={13} />
            Данные сохранены
          </div>
        )}
      </div>

      {/* Аватар */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {user.photo ? (
              <img src={user.photo} className="w-16 h-16 rounded-2xl object-cover" alt="Фото профиля" />
            ) : (
              <div className="w-16 h-16 bg-rzd-red rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-rzd-dark rounded-lg flex items-center justify-center hover:bg-rzd-red transition-colors"
              title="Изменить фото"
            >
              <Icon name="Camera" size={12} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-black text-rzd-dark text-lg leading-tight">
              {user.lastName} {user.firstName} {user.middleName}
            </p>
            <p className="text-rzd-muted text-sm">{user.phone}</p>
            {user.email && <p className="text-rzd-muted text-sm">{user.email}</p>}
          </div>

          <button
            onClick={() => {
              setEditing(!editing);
              if (editing) setForm({ lastName: user.lastName, firstName: user.firstName, middleName: user.middleName, email: user.email });
            }}
            className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark text-xs font-semibold px-3 py-2 rounded-lg hover:border-rzd-red transition-colors shrink-0"
          >
            <Icon name={editing ? "X" : "Pencil"} size={13} />
            {editing ? "Отмена" : "Изменить"}
          </button>
        </div>
      </div>

      {/* Форма редактирования */}
      {editing && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5 space-y-4">
          <h3 className="font-bold text-rzd-dark">Личные данные</h3>
          <div>
            <label className={labelCls}>Фамилия <span className="text-rzd-red">*</span></label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} placeholder="Петров" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Имя <span className="text-rzd-red">*</span></label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} placeholder="Иван" />
            </div>
            <div>
              <label className={labelCls}>Отчество</label>
              <input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} className={inputCls} placeholder="Сергеевич" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Телефон</label>
              <input value={user.phone} disabled className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Электронная почта</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="example@mail.ru" />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!form.lastName.trim() || !form.firstName.trim()}
            className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <Icon name="Check" size={15} />
            Сохранить
          </button>
        </div>
      )}

      {/* История заказов */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-rzd-dark">История заказов</h3>
          <p className="text-xs text-rzd-muted">{completedOrders.length} поездок · {totalSpent.toLocaleString("ru-RU")} ₽</p>
        </div>

        {completedOrders.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-4">Заказов пока нет</p>
        ) : (
          <div className="space-y-2">
            {completedOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={SERVICE_LABELS[o.serviceType].icon} fallback="Package" size={14} className="text-rzd-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-rzd-dark">{o.id}</p>
                  <p className="text-xs text-rzd-muted truncate">
                    {o.date} · {o.station.split("—").pop()?.trim()} · {bagsWord(o.bags)}
                  </p>
                  {o.rating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Icon key={s} name="Star" size={11} className={s <= o.rating! ? "text-amber-400" : "text-rzd-gray-mid"} />
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-black text-rzd-red text-sm shrink-0">{o.price.toLocaleString("ru-RU")} ₽</p>
              </div>
            ))}
            {completedOrders.length > 4 && (
              <p className="text-center text-xs text-rzd-muted pt-1">
                Ещё {completedOrders.length - 4} {completedOrders.length - 4 === 1 ? "заказ" : "заказа"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Мои маршруты */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-rzd-dark">Мои маршруты</h3>
            <p className="text-xs text-rzd-muted mt-0.5">Сохранённые шаблоны для быстрого заказа</p>
          </div>
          <button
            onClick={() => setShowRouteForm(!showRouteForm)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rzd-red border border-rzd-red/30 bg-rzd-red/5 hover:bg-rzd-red/10 px-3 py-2 rounded-lg transition-colors"
          >
            <Icon name={showRouteForm ? "X" : "Plus"} size={13} />
            {showRouteForm ? "Отмена" : "Добавить"}
          </button>
        </div>

        {showRouteForm && (
          <div className="border border-rzd-gray-mid rounded-xl p-4 mb-4 space-y-3 bg-rzd-gray/30">
            <h4 className="font-semibold text-rzd-dark text-sm">Новый маршрут</h4>
            <div>
              <label className={labelCls}>Название <span className="text-rzd-red">*</span></label>
              <input
                placeholder='Например: "Домой в Казань"'
                value={newRoute.name}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Вокзал <span className="text-rzd-red">*</span></label>
              <select
                value={newRoute.station}
                onChange={(e) => setNewRoute({ ...newRoute, station: e.target.value })}
                className={`${inputCls} bg-white`}
              >
                <option value="">Выберите вокзал</option>
                {stations.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Тип услуги <span className="text-rzd-red">*</span></label>
              <select
                value={newRoute.serviceType}
                onChange={(e) => setNewRoute({ ...newRoute, serviceType: e.target.value as ServiceType })}
                className={`${inputCls} bg-white`}
              >
                {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((t) => (
                  <option key={t} value={t}>{SERVICE_LABELS[t].full}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Поезд <span className="text-rzd-red">*</span></label>
                <input
                  placeholder="020А"
                  value={newRoute.train}
                  onChange={(e) => setNewRoute({ ...newRoute, train: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Вагон <span className="text-rzd-red">*</span></label>
                <input
                  placeholder="5"
                  value={newRoute.wagon}
                  onChange={(e) => setNewRoute({ ...newRoute, wagon: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Мест</label>
                <div className="flex items-center border border-rzd-gray-mid rounded-lg overflow-hidden bg-white">
                  <button type="button" onClick={() => setNewRoute({ ...newRoute, bags: Math.max(1, newRoute.bags - 1) })} className="px-2.5 py-2 text-rzd-red font-bold hover:bg-rzd-gray transition-colors">−</button>
                  <div className="flex-1 text-center text-sm font-bold text-rzd-dark border-x border-rzd-gray-mid py-2">{newRoute.bags}</div>
                  <button type="button" onClick={() => setNewRoute({ ...newRoute, bags: newRoute.bags + 1 })} className="px-2.5 py-2 text-rzd-red font-bold hover:bg-rzd-gray transition-colors">+</button>
                </div>
              </div>
            </div>
            {routeError && <p className="text-rzd-red text-xs">{routeError}</p>}
            <button
              onClick={handleAddRoute}
              className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              <Icon name="Check" size={14} />
              Сохранить маршрут
            </button>
          </div>
        )}

        {savedRoutes.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-4">Нет сохранённых маршрутов</p>
        ) : (
          <div className="space-y-2">
            {savedRoutes.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={r.serviceType ? SERVICE_LABELS[r.serviceType].icon : "MapPin"} fallback="MapPin" size={14} className="text-rzd-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-rzd-dark truncate">{r.name}</p>
                  <p className="text-xs text-rzd-muted truncate">
                    {r.station.split("—").pop()?.trim()} · поезд {r.train}, вагон {r.wagon} · {bagsWord(r.bags)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="/#order"
                    className="flex items-center gap-1 bg-rzd-red/10 text-rzd-red text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rzd-red/20 transition-colors"
                  >
                    <Icon name="Play" size={11} />
                    Заказать
                  </a>
                  <button
                    onClick={() => deleteRoute(r.id)}
                    className="w-7 h-7 flex items-center justify-center text-rzd-muted hover:text-rzd-red transition-colors"
                    title="Удалить маршрут"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Выход */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 border border-rzd-gray-mid text-rzd-muted hover:border-red-300 hover:text-red-500 font-semibold text-sm py-3.5 rounded-2xl transition-colors"
      >
        <Icon name="LogOut" size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
}
