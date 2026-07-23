import { useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navItems = [
  { path: "/superadmin/partners", label: "Партнёры", icon: "Building2" },
  { path: "/superadmin/loyalty", label: "Конструктор лояльности", icon: "Layers" },
];

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem("superadmin_auth") !== "1") {
      navigate("/superadmin/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("superadmin_auth");
    navigate("/superadmin/login", { replace: true });
  };

  return (
    <div className="font-golos min-h-screen bg-rzd-dark text-white">
      <header className="bg-black/20 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
            <span className="font-semibold text-sm hidden sm:inline">Super Admin</span>
          </div>
          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1 overflow-x-auto">
            {navItems.map(({ path, label, icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    active ? "bg-rzd-red text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  <Icon name={icon} fallback="Circle" size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
          <button onClick={handleLogout} className="text-white/50 hover:text-rzd-red-light transition-colors shrink-0" title="Выйти">
            <Icon name="LogOut" size={17} />
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
