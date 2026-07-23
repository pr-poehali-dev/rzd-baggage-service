import { useState } from "react";
import { usePartner, LoyaltyType } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const inputCls = "w-full border border-white/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white/5 text-white placeholder:text-white/30";
const labelCls = "text-xs font-medium text-white/50 block mb-1.5";

const TYPE_LABELS: Record<LoyaltyType, string> = {
  money: "Денежный кошелёк",
  services: "Количество услуг",
  combined: "Комбинированный (деньги + услуги)",
  unlimited: "Безлимитный тариф",
};

const emptyForm = {
  partnerId: "",
  name: "",
  type: "money" as LoyaltyType,
  monthlyMoneyLimit: "",
  yearlyMoneyLimit: "",
  monthlyServicesLimit: "",
  yearlyServicesLimit: "",
};

export default function SuperAdminLoyalty() {
  const { partners, loyaltyLevels, addLoyaltyLevel, deleteLoyaltyLevel } = usePartner();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterPartner, setFilterPartner] = useState("all");

  const handleCreate = () => {
    if (!form.partnerId || !form.name.trim()) {
      toast.error("Выберите партнёра и укажите название уровня");
      return;
    }
    addLoyaltyLevel({
      partnerId: form.partnerId,
      name: form.name,
      type: form.type,
      monthlyMoneyLimit: form.monthlyMoneyLimit ? Number(form.monthlyMoneyLimit) : undefined,
      yearlyMoneyLimit: form.yearlyMoneyLimit ? Number(form.yearlyMoneyLimit) : undefined,
      monthlyServicesLimit: form.monthlyServicesLimit ? Number(form.monthlyServicesLimit) : undefined,
      yearlyServicesLimit: form.yearlyServicesLimit ? Number(form.yearlyServicesLimit) : undefined,
    });
    toast.success("Уровень лояльности создан");
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleExport = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    const levels = loyaltyLevels.filter((l) => l.partnerId === partnerId);
    const rows = [
      ["Фамилия", "Имя", "Телефон", "Уровень лояльности"],
      ...levels.map(() => ["", "", "", ""]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loyalty-template-${partner?.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Шаблон файла скачан");
  };

  const filtered = filterPartner === "all" ? loyaltyLevels : loyaltyLevels.filter((l) => l.partnerId === filterPartner);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black mb-1">Конструктор лояльности</h1>
          <p className="text-white/40 text-sm">Создавайте неограниченное количество уровней лояльности для партнёров</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors self-start"
        >
          <Icon name={showForm ? "X" : "Plus"} size={14} />
          {showForm ? "Отмена" : "Создать уровень"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Новый уровень лояльности</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Партнёр</label>
              <select value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value })} className={`${inputCls} bg-rzd-dark`}>
                <option value="">Выберите партнёра</option>
                {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Название уровня</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Например: ТБ1" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Тип лимита</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {(Object.keys(TYPE_LABELS) as LoyaltyType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`text-left border rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    form.type === t ? "border-rzd-red bg-rzd-red/10 text-rzd-red-light" : "border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {(form.type === "money" || form.type === "combined") && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Лимит в месяц, ₽</label>
                <input type="number" value={form.monthlyMoneyLimit} onChange={(e) => setForm({ ...form, monthlyMoneyLimit: e.target.value })} className={inputCls} placeholder="4000" />
              </div>
              <div>
                <label className={labelCls}>Лимит в год, ₽</label>
                <input type="number" value={form.yearlyMoneyLimit} onChange={(e) => setForm({ ...form, yearlyMoneyLimit: e.target.value })} className={inputCls} placeholder="20000" />
              </div>
            </div>
          )}

          {(form.type === "services" || form.type === "combined") && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Услуг в месяц</label>
                <input type="number" value={form.monthlyServicesLimit} onChange={(e) => setForm({ ...form, monthlyServicesLimit: e.target.value })} className={inputCls} placeholder="2" />
              </div>
              <div>
                <label className={labelCls}>Услуг в год</label>
                <input type="number" value={form.yearlyServicesLimit} onChange={(e) => setForm({ ...form, yearlyServicesLimit: e.target.value })} className={inputCls} placeholder="10" />
              </div>
            </div>
          )}

          {form.type === "unlimited" && (
            <p className="text-xs text-white/40 bg-white/5 rounded-lg px-3 py-2.5">Клиенты с этим уровнем не будут иметь ограничений по количеству и стоимости услуг</p>
          )}

          <button onClick={handleCreate} className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
            <Icon name="Check" size={14} />
            Создать уровень
          </button>
        </div>
      )}

      <select value={filterPartner} onChange={(e) => setFilterPartner(e.target.value)} className={`${inputCls} sm:w-64`}>
        <option value="all">Все партнёры</option>
        {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <div className="space-y-3">
        {partners
          .filter((p) => filterPartner === "all" || p.id === filterPartner)
          .map((p) => {
            const levels = filtered.filter((l) => l.partnerId === p.id);
            if (levels.length === 0) return null;
            return (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">{p.name}</h3>
                  <button
                    onClick={() => handleExport(p.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white border border-white/15 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Icon name="Download" size={12} />
                    Скачать файл для проставления
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {levels.map((l) => (
                    <div key={l.id} className="border border-white/10 rounded-xl p-4 relative">
                      <button
                        onClick={() => { deleteLoyaltyLevel(l.id); toast.success("Уровень удалён"); }}
                        className="absolute top-3 right-3 text-white/30 hover:text-rzd-red-light transition-colors"
                      >
                        <Icon name="Trash2" size={13} />
                      </button>
                      <p className="font-bold text-sm mb-1 pr-6">{l.name}</p>
                      <p className="text-xs text-white/40 mb-2">{TYPE_LABELS[l.type]}</p>
                      {l.type === "unlimited" ? (
                        <p className="text-xs font-semibold text-green-400 flex items-center gap-1"><Icon name="Infinity" size={12} />Без ограничений</p>
                      ) : (
                        <div className="space-y-1">
                          {l.monthlyMoneyLimit != null && <p className="text-xs text-white/60">До {l.monthlyMoneyLimit.toLocaleString("ru-RU")} ₽/мес, {l.yearlyMoneyLimit?.toLocaleString("ru-RU")} ₽/год</p>}
                          {l.monthlyServicesLimit != null && <p className="text-xs text-white/60">До {l.monthlyServicesLimit} услуг/мес, {l.yearlyServicesLimit} услуг/год</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
