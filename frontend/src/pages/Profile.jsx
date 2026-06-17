import { useEffect, useState } from "react";
import {
  RiUserLine, RiMailLine, RiFlashlightLine,
  RiTrophyLine, RiFireLine, RiMedalLine, RiRefreshLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import XPBar from "../components/XPBar";

const BADGE_META = {
  "First Launch":  { emoji: "🚀", desc: "Complete your first task",     color: "text-blue-400",   bg: "bg-blue-500/10   border-blue-500/30" },
  "Half Century":  { emoji: "⭐", desc: "Complete 50 tasks",             color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  "Century":       { emoji: "💯", desc: "Complete 100 tasks",            color: "text-amber-400",  bg: "bg-amber-500/10  border-amber-500/30" },
  "On Fire":       { emoji: "🔥", desc: "Maintain a 7-day streak",       color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  "Proof Master":  { emoji: "📸", desc: "Upload 10 proof images",        color: "text-cyan-400",   bg: "bg-cyan-500/10   border-cyan-500/30" },
  "Legend":        { emoji: "👑", desc: "Reach Level 10",                color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
};

export default function Profile() {
  const { user, updateUserStats } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/me");
      setProfile(data);
      updateUserStats({
        xp: data.xp, level: data.level,
        streak: data.streak, badges: data.badges,
      });
    } catch {
      toast.error("Could not load profile. Showing cached data.");
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const p = profile ?? user;
  if (!p) return null;

  const xp     = p.xp     ?? 0;
  const level  = p.level  ?? 1;
  const streak = p.streak ?? 0;
  const badges = p.badges ?? [];

  const earnedBadges  = Object.entries(BADGE_META).filter(([name]) =>  badges.includes(name));
  const lockedBadges  = Object.entries(BADGE_META).filter(([name]) => !badges.includes(name));

  return (
    <>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <button
            onClick={loadProfile}
            disabled={loading}
            className="btn-ghost flex items-center gap-2 text-xs py-2"
          >
            <RiRefreshLine className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <svg className="animate-spin h-8 w-8 text-primary mx-auto" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <>
            {/* Identity card */}
            <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-3xl font-bold text-purple-400 shrink-0">
                {p.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">{p.name}</h2>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                  <RiMailLine className="shrink-0" />
                  <span className="truncate">{p.email}</span>
                </div>
              </div>
              {/* Level badge */}
              <div className="flex flex-col items-center bg-primary/10 border border-primary/20 rounded-2xl px-6 py-3 shrink-0">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Level</span>
                <span className="font-mono font-bold text-3xl text-purple-400">{level}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card text-center">
                <RiFlashlightLine className="text-cyan-400 text-xl mx-auto mb-1" />
                <p className="font-mono font-bold text-2xl text-cyan-400">{xp}</p>
                <p className="text-xs text-slate-500 mt-0.5">Total XP</p>
              </div>
              <div className="card text-center">
                <RiFireLine className="text-orange-400 text-xl mx-auto mb-1" />
                <p className="font-mono font-bold text-2xl text-orange-400">{streak}</p>
                <p className="text-xs text-slate-500 mt-0.5">Day Streak</p>
              </div>
              <div className="card text-center">
                <RiMedalLine className="text-yellow-400 text-xl mx-auto mb-1" />
                <p className="font-mono font-bold text-2xl text-yellow-400">{badges.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Badges</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <RiTrophyLine className="text-purple-400" />
                <h2 className="font-semibold text-white">XP Progress</h2>
              </div>
              <XPBar xp={xp} level={level} />
            </div>

            {/* Badges */}
            <div className="card">
              <div className="flex items-center gap-2 mb-5">
                <RiMedalLine className="text-yellow-400 text-lg" />
                <h2 className="font-semibold text-white">Badges</h2>
                <span className="ml-auto text-xs text-slate-500 font-mono">
                  {earnedBadges.length} / {Object.keys(BADGE_META).length} earned
                </span>
              </div>

              {earnedBadges.length === 0 && (
                <p className="text-slate-600 text-sm text-center py-4">
                  No badges yet — complete tasks to unlock them!
                </p>
              )}

              {earnedBadges.length > 0 && (
                <div className="space-y-2 mb-5">
                  {earnedBadges.map(([name, meta]) => (
                    <div
                      key={name}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${meta.bg}`}
                    >
                      <span className="text-2xl">{meta.emoji}</span>
                      <div>
                        <p className={`font-semibold text-sm ${meta.color}`}>{name}</p>
                        <p className="text-xs text-slate-500">{meta.desc}</p>
                      </div>
                      <span className="ml-auto text-xs text-emerald-500 font-medium">✓ Earned</span>
                    </div>
                  ))}
                </div>
              )}

              {lockedBadges.length > 0 && (
                <>
                  <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-3">
                    Locked — Keep going!
                  </p>
                  <div className="space-y-2">
                    {lockedBadges.map(([name, meta]) => (
                      <div
                        key={name}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#2D3748] bg-[#1E2535] opacity-50"
                      >
                        <span className="text-2xl grayscale">{meta.emoji}</span>
                        <div>
                          <p className="font-semibold text-sm text-slate-400">{name}</p>
                          <p className="text-xs text-slate-600">{meta.desc}</p>
                        </div>
                        <span className="ml-auto text-xs text-slate-600">🔒 Locked</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
