import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function StatsCard({ title, value, change, trend = 'up', icon: Icon, subtitle, className = '' }) {
  const isPositive = trend === 'up';
  const isAlert = trend === 'alert';

  return (
    <div
      className={cn(
        'bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 group relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            {value}
          </h2>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
        {isAlert ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px] bg-rose-50 text-rose-700 border border-rose-200/60">
            <AlertCircle className="w-3 h-3 mr-1 text-rose-500" />
            {change}
          </span>
        ) : isPositive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
            {change}
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
            <TrendingDown className="w-3 h-3 mr-1 text-slate-400" />
            {change}
          </span>
        )}
        <span className="text-[11px] text-slate-400">{subtitle || 'vs last month'}</span>
      </div>
    </div>
  );
}

export default StatsCard;
