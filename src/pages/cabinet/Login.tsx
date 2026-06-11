import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

type Step = "phone" | "code";

export default function Login() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { login, verifyCode, isLoading } = useAuth();
  const navigate = useNavigate();

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 1) return digits ? "+7" : "";
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 11) {
      setError("Введите корректный номер телефона");
      return;
    }
    setError("");
    await login(phone);
    setStep("code");
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await verifyCode(code);
    if (ok) {
      navigate("/cabinet");
    } else {
      setError("Неверный код. Попробуйте ещё раз");
      setCode("");
    }
  };

  const inputCls =
    "w-full border border-rzd-gray-mid rounded-xl px-4 py-3.5 text-sm text-rzd-dark focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-rzd-muted/60";

  return (
    <div className="min-h-screen bg-rzd-gray flex items-center justify-center px-4 font-golos">
      <div className="w-full max-w-md">

        {/* Логотип */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">РЖД</div>
          <span className="font-semibold text-rzd-dark">Личный кабинет</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-rzd-gray-mid p-8">
          {step === "phone" ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-rzd-dark mb-1">Войти или зарегистрироваться</h1>
                <p className="text-rzd-muted text-sm">Введите номер телефона — пришлём код для входа</p>
              </div>

              <form onSubmit={handlePhone} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-rzd-muted uppercase tracking-wide block mb-2">
                    Номер телефона
                  </label>
                  <div className="relative">
                    <Icon name="Phone" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rzd-muted" />
                    <input
                      type="tel"
                      autoFocus
                      placeholder="+7 (999) 000-00-00"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                  {error && <p className="text-rzd-red text-xs mt-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Отправляем код...
                    </span>
                  ) : (
                    <>Получить код<Icon name="ArrowRight" size={16} /></>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-rzd-muted mt-6 leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <span className="text-rzd-red cursor-pointer hover:underline">политикой обработки персональных данных</span>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("phone"); setCode(""); setError(""); }}
                className="flex items-center gap-1.5 text-rzd-muted text-xs hover:text-rzd-red transition-colors mb-6"
              >
                <Icon name="ArrowLeft" size={14} />
                Изменить номер
              </button>

              <div className="mb-6">
                <h1 className="text-2xl font-black text-rzd-dark mb-1">Введите код</h1>
                <p className="text-rzd-muted text-sm">
                  Отправили SMS на номер{" "}
                  <span className="font-semibold text-rzd-dark">{phone}</span>
                </p>
                <p className="text-xs text-rzd-muted mt-1">Для теста введите любой 4-значный код</p>
              </div>

              <form onSubmit={handleCode} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-rzd-muted uppercase tracking-wide block mb-2">
                    Код из SMS
                  </label>
                  <input
                    type="text"
                    autoFocus
                    maxLength={4}
                    placeholder="• • • •"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className={`${inputCls} text-center text-2xl font-black tracking-[0.5em]`}
                  />
                  {error && <p className="text-rzd-red text-xs mt-2 text-center">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || code.length < 4}
                  className="w-full bg-rzd-red hover:bg-rzd-red-dark disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Проверяем...
                    </span>
                  ) : (
                    <>Войти<Icon name="ArrowRight" size={16} /></>
                  )}
                </button>

                <button
                  type="button"
                  className="w-full text-rzd-muted text-sm py-2 hover:text-rzd-red transition-colors"
                >
                  Отправить код повторно
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-rzd-muted mt-6">
          <a href="/" className="hover:text-rzd-red transition-colors">← Вернуться на главную</a>
        </p>
      </div>
    </div>
  );
}
