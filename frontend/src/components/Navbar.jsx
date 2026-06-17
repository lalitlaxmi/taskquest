import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  RiDashboardLine,
  RiTaskLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiGamepadLine,
} from "react-icons/ri";

import toast from "react-hot-toast";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { to: "/tasks", label: "Tasks", icon: RiTaskLine },
  { to: "/profile", label: "Profile", icon: RiUserLine },
];

const linkBase =
  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";

const linkActive =
  "bg-primary/20 text-purple-300 border border-primary/30";

const linkInactive =
  "text-slate-400 hover:text-white hover:bg-white/5";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#111827]/90 backdrop-blur-md border-b border-[#2D3748]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <RiGamepadLine className="text-purple-400 text-lg" />
          </div>
          <span className="font-bold text-white hidden sm:block">
            Task<span className="text-purple-400">Quest</span>
          </span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <Icon className="text-base" />
              <span className="hidden sm:block">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* 🌙 Theme Toggle (NEW) */}
          <ThemeToggle />

          {/* 🔔 Notifications */}
          <NotificationBell />

          {/* User */}
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center text-xs font-bold text-purple-300">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm text-slate-300 font-medium max-w-[90px] truncate">
                {user.name}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                       text-slate-400 hover:text-red-400 hover:bg-red-500/10
                       border border-transparent hover:border-red-500/20
                       transition-all duration-200"
          >
            <RiLogoutBoxLine className="text-base" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}