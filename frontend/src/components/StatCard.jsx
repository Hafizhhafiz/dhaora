import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'teal', trend }) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-[#0E6E7E]',
      badge: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    cyan: {
      bg: 'bg-teal-50',
      text: 'text-[#0E6E7E]',
      badge: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      badge: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group transition-all duration-200 hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] mt-1.5 tracking-tight tabular-nums">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} group-hover:scale-105 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Status Komposisi</span>
          <span className={`px-2 py-0.5 rounded-full border ${scheme.badge} font-medium tabular-nums`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
