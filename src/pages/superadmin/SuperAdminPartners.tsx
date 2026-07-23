import { useState } from "react";
import { usePartner, PartnerType, PARTNER_TYPE_LABELS } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const inputCls = "w-full border border-white/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white/5 text-white placeholder:text-white/30";
const labelCls = "text-xs font-medium text-white/50 block mb-1.5";

export default function SuperAdminPartners() {
  const { partners, partnerUsers, loyaltyLevels, addPartner, addOperator } = usePartner();
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(null);
  const [opForm, setOpForm] = useState({ name: "", phone: "" });

  const [form, setForm] = useState({ name: "", type: "bank" as PartnerType, adminName: "", adminPhone: "" });

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 1) return d ? "+7" : "";
    if (d.length <= 4) return `+7 (${d.slice(1)}`;
    if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`;
    if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  };

  const handleAddPartner = () => {
    if (!form.name.trim() || !form.adminName.trim() || form.adminPhone.replace(/\D/g, "").length < 11) {
      toast.error("Заполните название, ФИО и телефон администратора");
      return;
    }
    addPartner(form.name, form.type, form.adminName, form.adminPhone);
    toast.success("Партнёр создан");
    setForm({ name: "", type: "bank", adminName: "", adminPhone: "" });
    setShowAddPartner(false);
  };

  const handleAddOperator = (partnerId: string) => {
    if (!opForm.name.trim() || opForm.phone.replace(/\D/g, "").length < 11) {
      toast.error("Заполните ФИО и телефон оператора");
      return;
    }
    addOperator(partnerId, opForm.name, opForm.phone);
    toast.success("Оператор добавлен");
    setOpForm({ name: "", phone: "" });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black mb-1">Партнёры</h1>
          <p className="text-white/40 text-sm">{partners.length} организаций на платформе</p>
        </div>
        <button
          onClick={() => setShowAddPartner(!showAddPartner)}
          className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors self-start"
        >
          <Icon name={showAddPartner ? "X" : "Plus"} size={14} />
          {showAddPartner ? "Отмена" : "Создать партнёра"}
        </button>
      </div>

      {showAddPartner && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm">Новый партнёр</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Название организации</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Тинькофф Банк" />
            </div>
            <div>
              <label className={labelCls}>Тип партнёра</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PartnerType })} className={`${inputCls} bg-rzd-dark`}>
                {(Object.keys(PARTNER_TYPE_LABELS) as PartnerType[]).map((t) => <option key={t} value={t}>{PARTNER_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>ФИО администратора</label>
              <input value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} className={inputCls} placeholder="Елена Смирнова" />
            </div>
            <div>
              <label className={labelCls}>Телефон администратора</label>
              <input value={form.adminPhone} onChange={(e) => setForm({ ...form, adminPhone: formatPhone(e.target.value) })} className={inputCls} placeholder="+7 (999) 000-00-00" />
            </div>
          </div>
          <button onClick={handleAddPartner} className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
            <Icon name="Check" size={14} />
            Создать партнёра и администратора
          </button>
        </div>
      )}

      <div className="space-y-3">
        {partners.map((p) => {
          const users = partnerUsers.filter((u) => u.partnerId === p.id);
          const levels = loyaltyLevels.filter((l) => l.partnerId === p.id);
          const expanded = expandedPartnerId === p.id;
          return (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedPartnerId(expanded ? null : p.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rzd-red/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="Building2" size={18} className="text-rzd-red-light" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs text-white/40">{PARTNER_TYPE_LABELS[p.type]} · {users.length} сотрудников · {levels.length} уровней лояльности</p>
                  </div>
                </div>
                <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={16} className="text-white/40" />
              </button>

              {expanded && (
                <div className="border-t border-white/10 px-5 py-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-white/50 mb-2">Сотрудники</p>
                    <div className="space-y-1.5">
                      {users.map((u) => (
                        <div key={u.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{u.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${u.role === "admin" ? "bg-rzd-red/20 text-rzd-red-light" : "bg-white/10 text-white/50"}`}>
                              {u.role === "admin" ? "Администратор" : "Оператор"}
                            </span>
                          </div>
                          <span className="text-xs text-white/40">{u.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white/50 mb-2">Добавить оператора</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input value={opForm.name} onChange={(e) => setOpForm({ ...opForm, name: e.target.value })} className={inputCls} placeholder="ФИО оператора" />
                      <input value={opForm.phone} onChange={(e) => setOpForm({ ...opForm, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="+7 (999) 000-00-00" />
                      <button
                        onClick={() => handleAddOperator(p.id)}
                        className="bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white/50 mb-2">Уровни лояльности</p>
                    <div className="flex flex-wrap gap-1.5">
                      {levels.length === 0 ? (
                        <span className="text-xs text-white/30">Не созданы — перейдите в Конструктор лояльности</span>
                      ) : (
                        levels.map((l) => (
                          <span key={l.id} className="text-xs font-semibold bg-rzd-red/10 text-rzd-red-light px-2.5 py-1 rounded-full">{l.name}</span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
