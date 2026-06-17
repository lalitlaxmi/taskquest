import { RiSunLine, RiMoonLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border transition hover:bg-white/10 dark:border-[#2D3748] light:border-gray-300"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <RiSunLine className="text-yellow-400 text-xl" />
      ) : (
        <RiMoonLine className="text-gray-700 text-xl" />
      )}
    </button>
  );
}