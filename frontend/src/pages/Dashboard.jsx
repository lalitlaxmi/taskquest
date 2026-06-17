import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  RiFlashlightLine,
  RiFireLine,
  RiMedalLine,
  RiTaskLine,
  RiArrowRightLine,
  RiStarLine,
  RiTrophyLine,
} from "react-icons/ri";

import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import Navbar from "../components/Navbar";
import XPBar from "../components/XPBar";
import MotivationalQuote from "../components/MotivationalQuote";
import DailyChallenge from "../components/DailyChallenge";
import AnalyticsCard from "../components/AnalyticsCard";
import ProductivitySummary from "../components/ProductivitySummary";
import FocusTimer from "../components/FocusTimer";
import WeeklyXPChart from "../components/WeeklyXPChart";

export default function Dashboard() {
  const { user, updateUserStats } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/users/me");

        setStats(data);

        updateUserStats({
          xp: data?.xp ?? 0,
          level: data?.level ?? 1,
          streak: data?.streak ?? 0,
          badges: data?.badges ?? [],
        });
      } catch {
        toast.error("Could not load your profile stats");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const displayUser = stats ?? user;

  const xp = displayUser?.xp ?? 0;
  const level = displayUser?.level ?? 1;
  const streak = displayUser?.streak ?? 0;
  const badges = displayUser?.badges ?? [];
  const completedTasks =
    displayUser?.completedTasks ?? displayUser?.tasksCompleted ?? 0;

  const xpIntoLevel = xp % 100;
  const isMaxLevel = level >= 10;

  const getStreakText = () => {
    if (streak === 0) return "Complete a task today!";
    if (streak === 1) return "Good start!";
    if (streak < 3) return "Building momentum!";
    if (streak < 7) return "Keep it going!";
    return "On fire! 🔥";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-slate-500 text-sm">Loading your quest data…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />


      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-slate-500 dark:text-slate-500 light:text-gray-600 text-sm font-medium">
  Welcome back,
</p>
            
            <h1 className="text-3xl font-bold dark:text-white light:text-gray-900 mt-0.5">
              {user?.name} <span className="wave inline-block">👋</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/tasks")}
            className="btn-primary flex items-center gap-2"
          >
            <RiTaskLine />
            Go to Tasks
            <RiArrowRightLine />
          </button>
        </div>

        {/* Motivation */}
        <div className="grid md:grid-cols-2 gap-4">
          <MotivationalQuote user={displayUser} />
          <DailyChallenge />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="card-hover flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <RiTrophyLine className="text-purple-400" />
              <span>Level</span>
            </div>
            <p className="font-mono font-bold text-4xl text-purple-400">
              {level}
            </p>
            <p className="text-xs dark:text-slate-500 light:text-gray-600">
              {isMaxLevel
                ? "MAX LEVEL reached!"
                : `${xpIntoLevel} / 100 XP`}
            </p>
          </div>

          <div className="card-hover flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <RiFlashlightLine className="text-cyan-400" />
              <span>Total XP</span>
            </div>
            <p className="font-mono font-bold text-4xl text-cyan-400">
              {xp}
            </p>
            <p className="text-xs dark:text-slate-500 light:text-gray-600">
              Keep completing tasks!
            </p>
          </div>

          <div className="card-hover flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <RiFireLine className="text-orange-400" />
              <span>Day Streak</span>
            </div>
            <p className="font-mono font-bold text-4xl text-orange-400">
              {streak} 🔥
            </p>
            <p className="text-xs dark:text-slate-500 light:text-gray-600">
  {getStreakText()}
</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid md:grid-cols-3 gap-4">
          <AnalyticsCard
            title="Tasks Completed"
            value={completedTasks}
            subtitle="Real completed tasks"
            icon="✅"
          />

          <AnalyticsCard
            title="Current Streak"
            value={`${streak} 🔥`}
            subtitle="Keep consistency"
            icon="🔥"
          />

          <ProductivitySummary
            xp={xp}
            streak={streak}
            badges={badges}
          />
        </div>

        {/* XP */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <RiStarLine className="text-purple-400 text-lg" />
            <h2 className="font-semibold dark:text-white light:text-gray-900">XP Progress</h2>
          </div>
          <XPBar xp={xp} level={level} />
        </div>

        {/* 📊 WEEKLY CHART FIXED HERE */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="text-cyan-400 text-lg" />
            <h2 className="font-semibold dark:text-white light:text-gray-900">
              Weekly XP Chart
            </h2>
          </div>

          <WeeklyXPChart />
        </div>

        {/* Focus Timer */}
        <FocusTimer />

      </main>
    </>
  );
}