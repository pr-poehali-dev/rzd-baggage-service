import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

export default function Partners() {
  const { partnerStats } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `myporter.ru/r/${partnerStats.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${referralLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-2xl font-black text-rzd-dark mb-1">Партнёрам</h1>
        <p className="text-rzd-muted text-sm">Приглашайте друзей и получайте бонусы за их заказы</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Приглашено друзей", val: partnerStats.invitedCount, icon: "Users" },
          { label: "Заработано всего", val: `${partnerStats.totalEarned.toLocaleString("ru-RU")} ₽`, icon: "Wallet" },
          { label: "Доступно к выводу", val: `${partnerStats.availableBalance.toLocaleString("ru-RU")} ₽`, icon: "PiggyBank" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-rzd-gray-mid p-4 text-center">
            <div className="w-8 h-8 bg-rzd-red/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name={s.icon} fallback="Circle" size={15} className="text-rzd-red" />
            </div>
            <p className="text-lg font-black text-rzd-dark">{s.val}</p>
            <p className="text-xs text-rzd-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Реферальная ссылка */}
      <div className="bg-rzd-dark rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Gift" size={16} className="text-rzd-red-light" />
          <span className="font-bold text-sm">Приглашайте друзей — получайте 500 ₽</span>
        </div>
        <p className="text-white/50 text-xs mb-4">За каждого друга, который сделает первый заказ по вашей ссылке</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-sm font-mono truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-1.5 font-bold text-sm px-4 py-3 rounded-lg transition-colors shrink-0 ${
              copied ? "bg-green-600 text-white" : "bg-rzd-red hover:bg-rzd-red-dark text-white"
            }`}
          >
            <Icon name={copied ? "Check" : "Copy"} size={15} />
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>

      {/* Приглашённые друзья */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <h3 className="font-bold text-rzd-dark mb-4">Приглашённые друзья</h3>
        {partnerStats.referrals.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-4">Вы ещё никого не пригласили</p>
        ) : (
          <div className="space-y-2">
            {partnerStats.referrals.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3">
                <div className="w-9 h-9 bg-rzd-gray rounded-lg flex items-center justify-center shrink-0 font-bold text-xs text-rzd-muted">
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-rzd-dark truncate">{r.name}</p>
                  <p className="text-xs text-rzd-muted">{r.date}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    r.status === "ordered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {r.status === "ordered" ? "Сделал заказ" : "Зарегистрирован"}
                </span>
                <span className="font-black text-rzd-red text-sm shrink-0">
                  {r.status === "ordered" ? `+${r.bonus} ₽` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* История операций */}
      <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5">
        <h3 className="font-bold text-rzd-dark mb-4">История бонусного счёта</h3>
        <div className="space-y-2">
          {partnerStats.transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  t.type === "accrual" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Icon
                  name={t.type === "accrual" ? "ArrowDownLeft" : "ArrowUpRight"}
                  size={15}
                  className={t.type === "accrual" ? "text-green-600" : "text-red-500"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-rzd-dark truncate">{t.description}</p>
                <p className="text-xs text-rzd-muted">{t.date}</p>
              </div>
              <span className={`font-black text-sm shrink-0 ${t.type === "accrual" ? "text-green-600" : "text-red-500"}`}>
                {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
