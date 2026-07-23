import { useState, useRef } from "react";
import { usePartner, PartnerClient } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

const inputCls = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60";
const labelCls = "text-xs font-medium text-rzd-muted block mb-1.5";

function levelProgress(client: PartnerClient, levels: ReturnType<typeof usePartner>["loyaltyLevels"]) {
  const level = levels.find((l) => l.id === client.loyaltyLevelId);
  if (!level) return null;
  if (level.type === "unlimited") return { label: "Безлимит", pct: 0, unlimited: true };
  if (level.type === "money" || level.type === "combined") {
    const limit = level.monthlyMoneyLimit ?? 0;
    const used = client.moneyUsedMonth;
    return { label: `${(limit - used).toLocaleString("ru-RU")} ₽ из ${limit.toLocaleString("ru-RU")} ₽/мес`, pct: limit ? (used / limit) * 100 : 0 };
  }
  const limit = level.monthlyServicesLimit ?? 0;
  const used = client.servicesUsedMonth;
  return { label: `${limit - used} из ${limit} услуг/мес`, pct: limit ? (used / limit) * 100 : 0 };
}

export default function Clients() {
  const { clients, loyaltyLevels, currentUser, currentPartner, addClient, updateClientLevel, uploadClientsFile, isLoading } = usePartner();
  const fileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const [form, setForm] = useState({ lastName: "", firstName: "", phone: "", loyaltyLevelId: "" });
  const [error, setError] = useState("");

  const isAdmin = currentUser?.role === "admin";
  const partnerLevels = loyaltyLevels.filter((l) => l.partnerId === currentPartner?.id);
  const partnerClients = clients.filter((c) => c.partnerId === currentPartner?.id);

  const filtered = partnerClients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.lastName.toLowerCase().includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
    );
  });

  const handleAdd = () => {
    if (!form.lastName.trim() || !form.firstName.trim() || form.phone.replace(/\D/g, "").length < 11) {
      setError("Заполните фамилию, имя и корректный телефон");
      return;
    }
    addClient({ lastName: form.lastName, firstName: form.firstName, phone: form.phone, loyaltyLevelId: form.loyaltyLevelId || undefined });
    toast.success("Клиент добавлен");
    setForm({ lastName: "", firstName: "", phone: "", loyaltyLevelId: "" });
    setShowAddForm(false);
    setError("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const count = await uploadClientsFile(file.name);
    toast.success(`Файл обработан: добавлено/обновлено ${count} клиентов`);
    if (fileRef.current) fileRef.current.value = "";
  };

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 1) return d ? "+7" : "";
    if (d.length <= 4) return `+7 (${d.slice(1)}`;
    if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`;
    if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  };

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-rzd-dark mb-1">Клиенты</h1>
          <p className="text-rzd-muted text-sm">{partnerClients.length} клиентов в базе {currentPartner?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark text-xs font-semibold px-3 py-2.5 rounded-lg hover:border-rzd-red transition-colors disabled:opacity-60"
          >
            <Icon name={isLoading ? "Loader2" : "Upload"} size={14} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Загружаем..." : "Загрузить файл"}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white text-xs font-bold px-3 py-2.5 rounded-lg transition-colors"
          >
            <Icon name={showAddForm ? "X" : "Plus"} size={14} />
            {showAddForm ? "Отмена" : "Создать клиента"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl border border-rzd-gray-mid p-5 space-y-3">
          <h3 className="font-bold text-rzd-dark text-sm">Новый клиент</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Фамилия <span className="text-rzd-red">*</span></label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} placeholder="Петров" />
            </div>
            <div>
              <label className={labelCls}>Имя <span className="text-rzd-red">*</span></label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} placeholder="Алексей" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Телефон <span className="text-rzd-red">*</span></label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} className={inputCls} placeholder="+7 (999) 000-00-00" />
            </div>
            <div>
              <label className={labelCls}>Уровень лояльности</label>
              <select value={form.loyaltyLevelId} onChange={(e) => setForm({ ...form, loyaltyLevelId: e.target.value })} className={`${inputCls} bg-white`}>
                <option value="">Без уровня</option>
                {partnerLevels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="text-rzd-red text-xs">{error}</p>}
          <button onClick={handleAdd} className="flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
            <Icon name="Check" size={14} />
            Сохранить клиента
          </button>
        </div>
      )}

      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rzd-muted" />
        <input
          type="text"
          placeholder="Поиск по фамилии, имени или телефону..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-rzd-gray-mid rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-rzd-red transition-colors"
        />
      </div>

      <div className="bg-white rounded-2xl border border-rzd-gray-mid overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-rzd-muted text-sm text-center py-8">Клиенты не найдены</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rzd-gray-mid bg-rzd-gray/40 text-xs text-rzd-muted">
                  <th className="text-left font-semibold px-4 py-3">Клиент</th>
                  <th className="text-left font-semibold px-4 py-3">Телефон</th>
                  <th className="text-left font-semibold px-4 py-3">Уровень лояльности</th>
                  <th className="text-left font-semibold px-4 py-3">Остаток лимита</th>
                  {isAdmin && <th className="text-right font-semibold px-4 py-3">Действия</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const level = partnerLevels.find((l) => l.id === c.loyaltyLevelId);
                  const progress = levelProgress(c, partnerLevels);
                  return (
                    <tr key={c.id} className="border-b border-rzd-gray-mid last:border-0 hover:bg-rzd-gray/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-rzd-gray rounded-lg flex items-center justify-center text-xs font-bold text-rzd-muted shrink-0">
                            {c.lastName.charAt(0)}{c.firstName.charAt(0)}
                          </div>
                          <span className="font-semibold text-rzd-dark whitespace-nowrap">{c.lastName} {c.firstName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-rzd-muted whitespace-nowrap">{c.phone}</td>
                      <td className="px-4 py-3">
                        {editingClientId === c.id ? (
                          <select
                            autoFocus
                            defaultValue={c.loyaltyLevelId ?? ""}
                            onChange={(e) => { updateClientLevel(c.id, e.target.value); setEditingClientId(null); toast.success("Уровень обновлён"); }}
                            onBlur={() => setEditingClientId(null)}
                            className="border border-rzd-gray-mid rounded-lg px-2 py-1.5 text-xs bg-white"
                          >
                            <option value="">Без уровня</option>
                            {partnerLevels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                        ) : level ? (
                          <span className="text-xs font-semibold bg-rzd-red/10 text-rzd-red px-2.5 py-1 rounded-full whitespace-nowrap">{level.name}</span>
                        ) : (
                          <span className="text-xs text-rzd-muted">Не назначен</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {progress ? (
                          progress.unlimited ? (
                            <span className="text-xs font-semibold text-green-600 flex items-center gap-1"><Icon name="Infinity" size={13} />Безлимит</span>
                          ) : (
                            <div className="w-32">
                              <p className="text-xs text-rzd-dark font-medium">{progress.label}</p>
                              <div className="h-1.5 bg-rzd-gray-mid rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-rzd-red rounded-full" style={{ width: `${Math.min(100, progress.pct)}%` }} />
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-xs text-rzd-muted">—</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setEditingClientId(c.id)}
                            className="text-xs font-semibold text-rzd-red hover:underline"
                          >
                            Изменить уровень
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
