import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

type Step = "phone" | "code" | "register";

const inputCls = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60";
const labelCls = "text-xs font-medium text-rzd-muted block mb-1.5";

export default function Login() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [reg, setReg] = useState({ lastName: "", firstName: "", middleName: "", email: "" });
  const [error, setError] = useState("");
  const { sendCode, verifyCode, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 1) return d ? "+7" : "";
    if (d.length <= 4) return `+7 (${d.slice(1)}`;
    if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`;
    if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  };

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
    if (!ok) { setError("Неверный код. Попробуйте ещё раз"); setCode(""); return; }
    if (isNew) { setStep("register"); } else { navigate("/cabinet"); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.lastName.trim() || !reg.firstName.trim()) { setError("Заполните имя и фамилию"); return; }
    setError("");
    await register({ ...reg, phone, photo: undefined });
    navigate("/cabinet");
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  return (
    <div className="font-golos min-h-screen bg-rzd-gray flex flex-col items-center justify-center px-4 py-12">

      {/* Логотип */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">РЖД</div>
        <span className="font-semibold text-rzd-dark">Личный кабинет</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* ШАГ 1: телефон */}
        {step === "phone" && (
          <>
            {/* Вкладки Вход / Регистрация */}
            <div className="flex bg-rzd-gray rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsNew(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  !isNew ? "bg-white text-rzd-dark shadow-sm" : "text-rzd-muted"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setIsNew(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  isNew ? "bg-white text-rzd-dark shadow-sm" : "text-rzd-muted"
                }`}
              >
                Регистрация
              </button>
            </div>

            <h1 className="text-xl font-black text-rzd-dark mb-1">
              {isNew ? "Создать личный кабинет" : "Вход в личный кабинет"}
            </h1>
            <p className="text-rzd-muted text-sm mb-6">Введите номер телефона — пришлём код</p>

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

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-rzd-red shrink-0"
                />
                <span className="text-xs text-rzd-muted leading-snug">
                  Я принимаю условия{" "}
                  <span className="text-rzd-red hover:underline">политики обработки персональных данных</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading || !agreed}
                className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? <><Spinner />Отправляем код...</> : <>Получить код <Icon name="ArrowRight" size={16} /></>}
              </button>
            </form>
          </>
        )}

        {/* ШАГ 2: код */}
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

              <button type="button" className="w-full text-rzd-muted text-sm py-1 hover:text-rzd-red transition-colors">
                Отправить код повторно
              </button>
            </form>
          </>
        )}

        {/* ШАГ 3: регистрация */}
        {step === "register" && (
          <>
            <h1 className="text-xl font-black text-rzd-dark mb-1">Заполните данные</h1>
            <p className="text-rzd-muted text-sm mb-6">Это займёт меньше минуты</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={labelCls}>Фамилия <span className="text-rzd-red">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Петров"
                  value={reg.lastName}
                  onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Имя <span className="text-rzd-red">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Иван"
                    value={reg.firstName}
                    onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Отчество</label>
                  <input
                    type="text"
                    placeholder="Сергеевич"
                    value={reg.middleName}
                    onChange={(e) => setReg({ ...reg, middleName: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Электронная почта</label>
                <input
                  type="email"
                  placeholder="example@mail.ru"
                  value={reg.email}
                  onChange={(e) => setReg({ ...reg, email: e.target.value })}
                  className={inputCls}
                />
              </div>

              {error && <p className="text-rzd-red text-xs">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? <><Spinner />Сохраняем...</> : <>Создать личный кабинет <Icon name="ArrowRight" size={16} /></>}
              </button>
            </form>
          </>
        )}
      </div>

      <Link
        to="/"
        className="flex items-center gap-1.5 text-rzd-muted text-sm font-medium mt-6 py-2 px-3 hover:text-rzd-red transition-colors"
      >
        <Icon name="House" size={16} />
        Вернуться на главную
      </Link>
    </div>
  );
}