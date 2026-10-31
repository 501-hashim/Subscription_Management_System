import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function StatsCard({ title, value, change, trend = 'up', icon: Icon, subtitle }) {
  const isPositive = trend === 'up';
  const isAlert = trend === 'alert';

  return (
    <Card className="p-5 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h2>
          </div>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center text-xs space-x-1.5">
        {isAlert ? (
          <span className="inline-flex items-center text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            {change}
          </span>
        ) : isPositive ? (
          <span className="inline-flex items-center text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            {change}
          </span>
        ) : (
          <span className="inline-flex items-center text-slate-500 font-medium">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            {change}
          </span>
        )}
        <span className="text-slate-400">{subtitle || 'vs last month'}</span>
      </div>
    </Card>
  );
}
