import { useEffect, useState } from "react";

const quotes = [
  "Small steps every day lead to big results.",
  "Discipline beats motivation.",
  "Your future is created by what you do today.",
  "Consistency is a superpower.",
];

export default function QuoteCard() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random = () =>
      quotes[Math.floor(Math.random() * quotes.length)];

    setQuote(random());

    const interval = setInterval(() => {
      setQuote(random());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <p className="text-purple-400 text-xs uppercase mb-2">
        Motivation
      </p>

      <h2 className="text-white font-semibold text-lg">
        {quote}
      </h2>
    </div>
  );
}