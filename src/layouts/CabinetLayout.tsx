import { useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";
import SupportButton from "@/components/cabinet/SupportButton";

const navItems = [
  { path: "/cabinet", label: "Главная", icon: "LayoutDashboard" },
  { path: "/cabinet/orders", label: "Заказы", icon: "History" },
  { path: "/cabinet/partners", label: "Партнёрам", icon: "Gift" },
  { path: "/cabinet/profile", label: "Профиль", icon: "User" },
];

export default function CabinetLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user) navigate("/cabinet/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const initials = `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`;

  return (
    <div className="font-golos min-h-screen bg-rzd-gray text-rzd-dark">

      {/* Шапка */}
      <header className="bg-white border-b border-rzd-gray-mid sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">РЖД</div>
            <div className="hidden sm:block">
              <div className="font-semibold text-sm leading-tight text-rzd-dark">Личный кабинет</div>
              <div className="text-xs text-rzd-muted leading-tight">MyPorter</div>
            </div>
          </Link>

          {/* Навигация — десктоп */}
          <nav className="hidden md:flex items-center gap-1 bg-rzd-gray rounded-xl p-1">
            {navItems.map(({ path, label, icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active ? "bg-white shadow-sm text-rzd-dark" : "text-rzd-muted hover:text-rzd-dark"
                  }`}
                >
                  <Icon name={icon} fallback="Circle" size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/#order"
              className="hidden sm:flex items-center gap-1.5 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <Icon name="Plus" size={13} />
              Новый заказ
            </a>
            <div className="flex items-center gap-2">
              {user.photo ? (
                <img src={user.photo} className="w-8 h-8 rounded-lg object-cover" alt="фото" />
              ) : (
                <div className="w-8 h-8 bg-rzd-red rounded-lg flex items-center justify-center text-white font-black text-xs">
                  {initials}
                </div>
              )}
              <span className="hidden sm:block text-sm font-semibold text-rzd-dark">{user.firstName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Мобильный таббар */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rzd-gray-mid z-40">
        <div className="flex">
          {navItems.map(({ path, label, icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                  active ? "text-rzd-red" : "text-rzd-muted"
                }`}
              >
                <Icon name={icon} fallback="Circle" size={20} />
                {label}
              </Link>
            );
          })}
          <a
            href="/#order"
            className="flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-semibold text-rzd-red"
          >
            <div className="w-7 h-7 bg-rzd-red rounded-full flex items-center justify-center">
              <Icon name="Plus" size={15} className="text-white" />
            </div>
            Заказ
          </a>
        </div>
      </nav>

      <SupportButton />
    </div>
  );
}