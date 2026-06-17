const challenges = [
  "Complete 3 tasks today",
  "Earn 50 XP today",
  "Maintain your streak",
  "Finish a Hard task",
];

export default function DailyChallenge() {

  const challenge =
    challenges[new Date().getDate() % challenges.length];

  return (

    <div className="card">

      <p className="text-cyan-400 text-xs uppercase mb-2">

        Daily Challenge

      </p>

      <h2 className="text-white font-bold text-xl">

        🎯 {challenge}

      </h2>

    </div>

  );
}