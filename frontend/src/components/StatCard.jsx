import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan', trend }) {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      badge: 'bg-blue-950/60 text-blue-300 border-blue-800/40'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-800/40'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-5 rounded-xl bg-slate-900/80 border ${scheme.border} transition-all duration-200 shadow-sm relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 italic">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Status Komposisi</span>
          <span className={`px-2 py-0.5 rounded border ${scheme.badge} font-semibold font-mono`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
