import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiTaskLine,
  RiUserLine,
} from "react-icons/ri";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { to: "/tasks", label: "Tasks", icon: RiTaskLine },
  { to: "/profile", label: "Profile", icon: RiUserLine },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#0F172A] border-r border-[#1F2937] p-4">

      <h1 className="text-xl font-bold text-white mb-6">
        Task<span className="text-primary">Quest</span>
      </h1>

      <nav className="flex flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-primary/20 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}