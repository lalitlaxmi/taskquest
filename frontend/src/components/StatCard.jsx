export default function StatCard({ title, value, icon, color = "text-white" }) {
  return (
    <div className="card-hover flex flex-col gap-2">

      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span className={color}>{icon}</span>
        <span>{title}</span>
      </div>

      <p className={`font-mono font-bold text-3xl ${color}`}>
        {value}
      </p>

    </div>
  );
}