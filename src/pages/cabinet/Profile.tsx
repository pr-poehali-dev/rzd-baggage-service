import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emergency, setEmergency] = useState(user?.emergencyContact || "");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateUser({ name, email, emergencyContact: emergency });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePref = (key: keyof typeof user.preferences) => {
    updateUser({ preferences: { ...user.preferences, [key]: !user.preferences[key] } });
  };

  const inputCls = "w-full border border-rzd-gray-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white disabled:bg-rzd-gray disabled:text-rzd-muted";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark mb-1">Профиль</h1>
          <p className="text-rzd-muted text-sm">Личные данные и настройки</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-2 rounded-xl">
            <Icon name="Check" size={13} />
            Сохранено
          </div>
        )}
      </div>

      {/* Аватар и базовая инфо */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-rzd-red rounded-2xl flex items-center justify-center text-white font-black text-2xl shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-rzd-dark text-lg">{user.name}</div>
          <div className="text-rzd-muted text-sm">{user.phone}</div>
          {user.email && <div className="text-rzd-muted text-sm">{user.email}</div>}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1.5 text-xs font-semibold text-rzd-red border border-rzd-red/30 bg-rzd-red/5 px-3 py-2 rounded-lg hover:bg-rzd-red/10 transition-colors"
        >
          <Icon name={editing ? "X" : "Pencil"} size={13} />
          {editing ? "Отмена" : "Изменить"}
        </button>
      </div>

      {/* Редактирование */}
      {editing && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-6 space-y-4">
          <h3 className="font-bold text-rzd-dark">Личные данные</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-rzd-muted uppercase tracking-wide block mb-2">Имя и фамилия</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-rzd-muted uppercase tracking-wide block mb-2">Телефон</label>
              <input value={user.phone} disabled className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-rzd-muted uppercase tracking-wide block mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.ru" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-rzd-muted uppercase tracking-wide block mb-2">
                Контакт для экстренной связи
              </label>
              <input value={emergency} onChange={(e) => setEmergency(e.target.value)} placeholder="+7 (999) 000-00-00" className={inputCls} />
              <p className="text-xs text-rzd-muted mt-1.5 leading-relaxed">
                Уведомим этого человека, если вы опаздываете на поезд
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-rzd-red text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-rzd-red-dark transition-colors"
          >
            <Icon name="Check" size={15} />
            Сохранить изменения
          </button>
        </div>
      )}

      {/* Особые потребности */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-6">
        <h3 className="font-bold text-rzd-dark mb-4">Особые потребности</h3>
        <div className="space-y-3">
          {[
            { key: "stroller" as const, icon: "Baby", label: "Помощь с коляской", desc: "Носильщик поможет с детской коляской" },
            { key: "signBoard" as const, icon: "FileText", label: "Встреча с табличкой", desc: "Носильщик будет держать табличку с вашим именем" },
            { key: "pet" as const, icon: "Heart", label: "Животное в переноске", desc: "Учтём питомца при подборе носильщика" },
          ].map((pref) => (
            <div
              key={pref.key}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                user.preferences[pref.key]
                  ? "border-rzd-red bg-rzd-red/5"
                  : "border-rzd-gray-mid hover:border-rzd-red/30"
              }`}
              onClick={() => togglePref(pref.key)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${user.preferences[pref.key] ? "bg-rzd-red/10" : "bg-rzd-gray"}`}>
                  <Icon name={pref.icon} fallback="Star" size={16} className={user.preferences[pref.key] ? "text-rzd-red" : "text-rzd-muted"} />
                </div>
                <div>
                  <div className="font-semibold text-rzd-dark text-sm">{pref.label}</div>
                  <div className="text-xs text-rzd-muted">{pref.desc}</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${user.preferences[pref.key] ? "border-rzd-red bg-rzd-red" : "border-rzd-gray-mid"}`}>
                {user.preferences[pref.key] && <Icon name="Check" size={11} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Бонусная программа */}
      <div className="bg-gradient-to-br from-rzd-dark to-[#2a2a2a] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Бонусная программа</div>
            <div className="text-3xl font-black">{user.bonusPoints} баллов</div>
          </div>
          <div className="w-12 h-12 bg-rzd-red rounded-2xl flex items-center justify-center">
            <Icon name="Star" size={22} className="text-white" />
          </div>
        </div>
        <div className="bg-white/10 rounded-xl h-2 mb-3">
          <div
            className="bg-rzd-red h-2 rounded-xl transition-all"
            style={{ width: `${Math.min((user.bonusPoints / 1000) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">1 заказ = 50 баллов · 1 балл = 1 ₽</span>
          <span className="text-white/70">{user.bonusPoints} / 1000 до след. уровня</span>
        </div>
      </div>

      {/* Способы оплаты */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-rzd-dark">Способы оплаты</h3>
          <button className="flex items-center gap-1.5 text-xs text-rzd-red font-semibold hover:underline">
            <Icon name="Plus" size={13} />
            Добавить карту
          </button>
        </div>
        <div className="space-y-2">
          {user.savedCards.map((card) => (
            <div key={card.id} className="flex items-center justify-between border border-rzd-gray-mid rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-rzd-gray rounded-lg flex items-center justify-center">
                  <Icon name="CreditCard" size={16} className="text-rzd-muted" />
                </div>
                <div>
                  <div className="font-semibold text-rzd-dark text-sm">{card.brand} •••• {card.last4}</div>
                  <div className="text-xs text-rzd-muted">Сохранённая карта</div>
                </div>
              </div>
              <button className="text-rzd-muted hover:text-rzd-red transition-colors">
                <Icon name="Trash2" size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Выход */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm py-3.5 rounded-2xl transition-colors"
      >
        <Icon name="LogOut" size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
}
