export default function AnalyticsCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="card-hover">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>

          <p className="text-xs text-slate-600 mt-2">
            {subtitle}
          </p>

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>

    </div>
  );
}