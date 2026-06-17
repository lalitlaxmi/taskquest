export default function ProductivitySummary({
  xp,
  streak,
  badges,
}) {

  let status = "Beginner";

  if (xp >= 100) status = "Focused";

  if (xp >= 300) status = "Productive";

  if (xp >= 600) status = "Elite";

  return (

    <div className="card">

      <p className="text-purple-400 text-xs uppercase mb-2">

        Productivity Rank

      </p>

      <h2 className="text-2xl font-bold text-white">

        {status}

      </h2>

      <div className="mt-4 space-y-2 text-sm">

        <p className="text-slate-400">

          🔥 Streak: {streak}

        </p>

        <p className="text-slate-400">

          🏅 Badges: {badges.length}

        </p>

        <p className="text-slate-400">

          ⚡ XP: {xp}

        </p>

      </div>

    </div>

  );
}