import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const inputCls = "w-full border border-white/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white/5 text-white placeholder:text-white/30";

export default function SuperAdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 1) { setError("Введите пароль"); return; }
    sessionStorage.setItem("superadmin_auth", "1");
    navigate("/superadmin/partners");
  };

  return (
    <div className="font-golos min-h-screen bg-rzd-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
          <span className="font-semibold text-white">Super Admin</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="w-11 h-11 bg-rzd-red/20 rounded-xl flex items-center justify-center mb-4">
            <Icon name="ShieldAlert" size={20} className="text-rzd-red-light" />
          </div>
          <h1 className="text-lg font-black text-white mb-1">Панель управления платформой</h1>
          <p className="text-white/40 text-sm mb-6">Доступ только для владельца сервиса</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                autoFocus
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
              {error && <p className="text-rzd-red-light text-xs mt-1.5">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-rzd-red hover:bg-rzd-red-dark text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              Войти <Icon name="ArrowRight" size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
