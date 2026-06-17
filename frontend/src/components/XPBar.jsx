/**
 * XPBar — shows current XP, level, and progress toward next level.
 *
 * Level formula (mirrors backend levelCalculator.js):
 *   level = Math.floor(xp / 100) + 1  (capped at 10)
 * So XP within the current level = xp % 100  (out of 100)
 */
export default function XPBar({ xp = 0, level = 1 }) {
  const XP_PER_LEVEL = 100;
  const currentLevelXP = xp % XP_PER_LEVEL;
  const pct = Math.min((currentLevelXP / XP_PER_LEVEL) * 100, 100);
  const isMaxLevel = level >= 10;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Level</span>
          <span className="font-mono font-bold text-purple-400 text-sm">{level}</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {isMaxLevel ? "MAX LEVEL" : `${currentLevelXP} / ${XP_PER_LEVEL} XP`}
        </span>
      </div>

      {/* Track */}
      <div className="h-2.5 w-full bg-[#1E2535] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${isMaxLevel ? 100 : pct}%`,
            background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
          }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600">Total XP: {xp}</span>
        {!isMaxLevel && (
          <span className="text-xs text-slate-600">
            Next: {(level) * XP_PER_LEVEL - currentLevelXP} XP away
          </span>
        )}
      </div>
    </div>
  );
}
