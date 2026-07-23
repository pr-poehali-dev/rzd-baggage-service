import { useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { usePartner, PARTNER_TYPE_LABELS } from "@/context/PartnerContext";
import Icon from "@/components/ui/icon";

const navItems = [
  { path: "/partner", label: "Клиенты", icon: "Users", roles: ["operator", "admin"] },
  { path: "/partner/orders", label: "Заказы", icon: "Package", roles: ["operator", "admin"] },
  { path: "/partner/history", label: "История", icon: "History", roles: ["operator", "admin"] },
  { path: "/partner/reports", label: "Отчёты", icon: "FileBarChart", roles: ["admin"] },
];

export default function PartnerLayout() {
  const { currentUser, currentPartner, logout } = usePartner();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!currentUser) navigate("/partner/login", { replace: true });
  }, [currentUser, navigate]);

  if (!currentUser || !currentPartner) return null;

  const items = navItems.filter((i) => i.roles.includes(currentUser.role));
  const initials = currentUser.name.split(" ").map((w) => w.charAt(0)).slice(0, 2).join("");

  return (
    <div className="font-golos min-h-screen bg-rzd-gray text-rzd-dark">

      <header className="bg-white border-b border-rzd-gray-mid sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-rzd-dark text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
            <div className="hidden sm:block">
              <div className="font-semibold text-sm leading-tight text-rzd-dark">{currentPartner.name}</div>
              <div className="text-xs text-rzd-muted leading-tight">{PARTNER_TYPE_LABELS[currentPartner.type]} · Кабинет партнёра</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-rzd-gray rounded-xl p-1 overflow-x-auto">
            {items.map(({ path, label, icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    active ? "bg-white shadow-sm text-rzd-dark" : "text-rzd-muted hover:text-rzd-dark"
                  }`}
                >
                  <Icon name={icon} fallback="Circle" size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`hidden lg:inline text-xs font-semibold px-2.5 py-1 rounded-full ${
              currentUser.role === "admin" ? "bg-rzd-red/10 text-rzd-red" : "bg-rzd-gray text-rzd-muted"
            }`}>
              {currentUser.role === "admin" ? "Администратор" : "Оператор"}
            </span>
            <div className="w-8 h-8 bg-rzd-dark rounded-lg flex items-center justify-center text-white font-black text-xs">
              {initials}
            </div>
            <button onClick={logout} className="text-rzd-muted hover:text-rzd-red transition-colors" title="Выйти">
              <Icon name="LogOut" size={17} />
            </button>
          </div>
        </div>

        {/* Мобильная навигация */}
        <div className="md:hidden flex overflow-x-auto border-t border-rzd-gray-mid px-2">
          {items.map(({ path, label, icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  active ? "border-rzd-red text-rzd-red" : "border-transparent text-rzd-muted"
                }`}
              >
                <Icon name={icon} fallback="Circle" size={13} />
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
