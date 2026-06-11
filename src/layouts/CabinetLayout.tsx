import { useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

const navItems = [
  { path: "/cabinet", label: "Главная", icon: "LayoutDashboard" },
  { path: "/cabinet/orders", label: "Заказы", icon: "History" },
  { path: "/cabinet/profile", label: "Профиль", icon: "User" },
];

export default function CabinetLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) navigate("/cabinet/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-rzd-gray font-golos">

      {/* Топбар */}
      <header className="bg-white border-b border-rzd-gray-mid sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-rzd-red text-white font-black text-xs px-2.5 py-1.5 rounded tracking-widest">РЖД</div>
            <span className="font-bold text-sm text-rzd-dark hidden sm:block">MyPorter</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-rzd-gray rounded-xl p-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active ? "bg-white shadow-sm text-rzd-dark" : "text-rzd-muted hover:text-rzd-dark"
                  }`}
                >
                  <Icon name={item.icon} fallback="Circle" size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-rzd-muted">
              <div className="w-7 h-7 bg-rzd-red rounded-lg flex items-center justify-center text-white font-black text-xs">
                {user.name.charAt(0)}
              </div>
              <span className="font-semibold text-rzd-dark">{user.name.split(" ")[0]}</span>
            </div>
            <a
              href="/#order"
              className="flex items-center gap-1.5 bg-rzd-red text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-rzd-red-dark transition-colors"
            >
              <Icon name="Plus" size={13} />
              Новый заказ
            </a>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Мобильный таббар */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rzd-gray-mid z-40">
        <div className="flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                  active ? "text-rzd-red" : "text-rzd-muted"
                }`}
              >
                <Icon name={item.icon} fallback="Circle" size={20} />
                {item.label}
              </Link>
            );
          })}
          <a
            href="/#order"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold text-rzd-red"
          >
            <div className="w-6 h-6 bg-rzd-red rounded-full flex items-center justify-center -mt-0.5">
              <Icon name="Plus" size={14} className="text-white" />
            </div>
            Заказ
          </a>
        </div>
      </nav>
    </div>
  );
}
