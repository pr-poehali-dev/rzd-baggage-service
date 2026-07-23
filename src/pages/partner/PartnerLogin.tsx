import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePartner } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";

type Step = "choice" | "phone" | "code" | "pin-set" | "pin-login";

const inputCls = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60";
const labelCls = "text-xs font-medium text-rzd-muted block mb-1.5";

export default function PartnerLogin() {
  const [step, setStep] = useState<Step>("choice");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPinInput] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [error, setError] = useState("");
  const { sendCode, verifyCode, setPin, loginWithPin, isLoading, partnerUsers } = usePartner();
  const navigate = useNavigate();

  const hasPinUsers = partnerUsers.some((u) => u.pinSet);

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 1) return d ? "+7" : "";
    if (d.length <= 4) return `+7 (${d.slice(1)}`;
    if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`;
    if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  const handlePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 11) { setError("Введите корректный номер телефона"); return; }
    setError("");
    await sendCode(phone);
    setStep("code");
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await verifyCode(phone, code);
    if (!ok) { setError("Неверный код или пользователь не найден. Обратитесь к администратору"); setCode(""); return; }
    setStep("pin-set");
  };

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) { setError("PIN-код должен содержать 4 цифры"); return; }
    if (pin !== pinConfirm) { setError("PIN-коды не совпадают"); return; }
    setPin(pin);
    navigate("/partner");
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await loginWithPin(phone, pin);
    if (!ok) { setError("Неверный номер или PIN-код"); return; }
    navigate("/partner");
  };

  return (
    <div className="font-golos min-h-screen bg-rzd-dark flex flex-col items-center justify-center px-4 py-12">

      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
        <span className="font-semibold text-white">Кабинет партнёра</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {step === "choice" && (
          <>
            <h1 className="text-xl font-black text-rzd-dark mb-1">Вход в кабинет партнёра</h1>
            <p className="text-rzd-muted text-sm mb-6">Выберите способ входа</p>
            <div className="space-y-3">
              <button
                onClick={() => setStep("phone")}
                className="w-full flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3.5 hover:border-rzd-red transition-colors text-left"
              >
                <div className="w-10 h-10 bg-rzd-red/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name="MessageSquare" size={18} className="text-rzd-red" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-rzd-dark">По номеру телефона</p>
                  <p className="text-xs text-rzd-muted">Получите код по SMS</p>
                </div>
              </button>
              {hasPinUsers && (
                <button
                  onClick={() => setStep("pin-login")}
                  className="w-full flex items-center gap-3 border border-rzd-gray-mid rounded-xl px-4 py-3.5 hover:border-rzd-red transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-rzd-red/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="KeyRound" size={18} className="text-rzd-red" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-rzd-dark">По PIN-коду</p>
                    <p className="text-xs text-rzd-muted">Быстрый вход без SMS</p>
                  </div>
                </button>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { name: "SberID", icon: "CircleDollarSign" },
                  { name: "Тинькофф ID", icon: "CreditCard" },
                  { name: "Яндекс ID", icon: "Circle" },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    disabled
                    className="flex flex-col items-center gap-1.5 border border-rzd-gray-mid rounded-xl px-2 py-3 opacity-40 cursor-not-allowed"
                  >
                    <Icon name={s.icon} fallback="Circle" size={16} className="text-rzd-muted" />
                    <span className="text-[10px] text-rzd-muted text-center leading-tight">{s.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-rzd-muted text-center">Внешние ID появятся в следующих итерациях</p>
            </div>
          </>
        )}

        {step === "phone" && (
          <>
            <button onClick={() => { setStep("choice"); setError(""); }} className="flex items-center gap-1.5 text-rzd-muted text-xs hover:text-rzd-red transition-colors mb-5">
              <Icon name="ArrowLeft" size={14} />Назад
            </button>
            <h1 className="text-xl font-black text-rzd-dark mb-1">Вход по SMS</h1>
            <p className="text-rzd-muted text-sm mb-6">Введите номер телефона, зарегистрированный администратором</p>
            <form onSubmit={handlePhone} className="space-y-4">
              <div>
                <label className={labelCls}>Номер телефона</label>
                <input
                  type="tel"
                  autoFocus
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className={inputCls}
                />
                {error && <p className="text-rzd-red text-xs mt-1.5">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? <><Spinner />Отправляем код...</> : <>Получить код <Icon name="ArrowRight" size={16} /></>}
              </button>
            </form>
            <p className="text-[11px] text-rzd-muted text-center mt-4">
              Для теста используйте: +7 (916) 500-10-01 (администратор) или +7 (916) 500-10-02 (оператор)
            </p>
          </>
        )}

        {step === "code" && (
          <>
            <button onClick={() => { setStep("phone"); setCode(""); setError(""); }} className="flex items-center gap-1.5 text-rzd-muted text-xs hover:text-rzd-red transition-colors mb-5">
              <Icon name="ArrowLeft" size={14} />Изменить номер
            </button>
            <h1 className="text-xl font-black text-rzd-dark mb-1">Введите код из SMS</h1>
            <p className="text-rzd-muted text-sm mb-6">
              Отправили на номер <span className="font-semibold text-rzd-dark">{phone}</span>
            </p>
            <form onSubmit={handleCode} className="space-y-4">
              <div>
                <label className={labelCls}>Код подтверждения</label>
                <input
                  type="text"
                  autoFocus
                  maxLength={4}
                  placeholder="• • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={`${inputCls} text-center text-2xl font-black tracking-[0.6em]`}
                />
                {error && <p className="text-rzd-red text-xs mt-1.5 text-center">{error}</p>}
                <p className="text-xs text-rzd-muted mt-1.5 text-center">Для теста введите любые 4 цифры</p>
              </div>
              <button
                type="submit"
                disabled={isLoading || code.length < 4}
                className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? <><Spinner />Проверяем...</> : <>Продолжить <Icon name="ArrowRight" size={16} /></>}
              </button>
            </form>
          </>
        )}

        {step === "pin-set" && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <h1 className="text-xl font-black text-rzd-dark mb-1">Создайте PIN-код</h1>
            <p className="text-rzd-muted text-sm mb-6">Для быстрого входа в следующий раз без SMS</p>
            <form onSubmit={handleSetPin} className="space-y-4">
              <div>
                <label className={labelCls}>Новый PIN-код (4 цифры)</label>
                <input
                  type="text"
                  autoFocus
                  maxLength={4}
                  placeholder="• • • •"
                  value={pin}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={`${inputCls} text-center text-2xl font-black tracking-[0.6em]`}
                />
              </div>
              <div>
                <label className={labelCls}>Повторите PIN-код</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  value={pinConfirm}
                  onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={`${inputCls} text-center text-2xl font-black tracking-[0.6em]`}
                />
                {error && <p className="text-rzd-red text-xs mt-1.5 text-center">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-rzd-red hover:bg-rzd-red-dark text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                Сохранить и войти <Icon name="ArrowRight" size={16} />
              </button>
              <button type="button" onClick={() => navigate("/partner")} className="w-full text-rzd-muted text-sm py-1 hover:text-rzd-red transition-colors">
                Пропустить пока
              </button>
            </form>
          </>
        )}

        {step === "pin-login" && (
          <>
            <button onClick={() => { setStep("choice"); setError(""); }} className="flex items-center gap-1.5 text-rzd-muted text-xs hover:text-rzd-red transition-colors mb-5">
              <Icon name="ArrowLeft" size={14} />Назад
            </button>
            <h1 className="text-xl font-black text-rzd-dark mb-1">Вход по PIN-коду</h1>
            <p className="text-rzd-muted text-sm mb-6">Введите номер телефона и PIN-код</p>
            <form onSubmit={handlePinLogin} className="space-y-4">
              <div>
                <label className={labelCls}>Номер телефона</label>
                <input
                  type="tel"
                  autoFocus
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>PIN-код</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  value={pin}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={`${inputCls} text-center text-2xl font-black tracking-[0.6em]`}
                />
                {error && <p className="text-rzd-red text-xs mt-1.5 text-center">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? <><Spinner />Входим...</> : <>Войти <Icon name="ArrowRight" size={16} /></>}
              </button>
            </form>
          </>
        )}
      </div>

      <Link to="/" className="flex items-center gap-1.5 text-white/50 text-sm font-medium mt-6 py-2 px-3 hover:text-white transition-colors">
        <Icon name="House" size={16} />
        Вернуться на главную
      </Link>
    </div>
  );
}
