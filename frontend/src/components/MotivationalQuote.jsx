import { useEffect, useState } from "react";

const morningQuotes = [
  "☀️ Small steps every day build big futures.",
  "🚀 Today is another opportunity to level up.",
  "🔥 Consistency beats motivation.",
];

const eveningQuotes = [
  "🌙 Finish one more task before resting.",
  "🏆 Greatness is built after everyone quits.",
  "⚡ Your future self is watching.",
];

export default function MotivationalQuote({ user }) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    let quotes =
      hour < 12 ? [...morningQuotes] : [...eveningQuotes];

    if (user?.streak >= 7) {
      quotes.push("🔥 You're unstoppable. Keep the streak alive.");
    }

    if (user?.level >= 5) {
      quotes.push("👑 Veteran player detected.");
    }

    const randomQuote = () =>
      quotes[Math.floor(Math.random() * quotes.length)];

    setQuote(randomQuote());

    const interval = setInterval(() => {
      setQuote(randomQuote());
    }, 10000);

    return () => clearInterval(interval);

  }, [user]);

  return (
    <div className="card">

      <p className="text-purple-400 text-xs uppercase mb-2">

        Daily Motivation

      </p>

      <h2 className="text-white text-xl font-bold">

        {quote}

      </h2>

    </div>
  );
}