import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "green" | "blue" | "purple" | "amber";
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "blue",
}) => {
  const badgeStyles = {
    green: "bg-emerald-50 text-[#006c4a] border-emerald-200",
    blue: "bg-blue-50 text-[#004ac6] border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </span>
        {badge && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500 font-medium">{subtitle}</p>
    </div>
  );
};
