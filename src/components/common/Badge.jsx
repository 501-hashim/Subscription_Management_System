import React from 'react';
import { cn } from '../../utils/formatters';

export function Badge({ status, label, className = '' }) {
  const displayLabel = label || status || 'Unknown';
  const s = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['active', 'paid', 'completed', 'available', 'accepted'].includes(s)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['pending', 'processing', 'sent', 'pending renewal'].includes(s)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['overdue', 'failed', 'cancelled', 'expired', 'suspended'].includes(s)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['draft', 'inactive', 'archived'].includes(s)) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (['trial', 'promotional'].includes(s)) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClasses,
        className
      )}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70" />
      {displayLabel}
    </span>
  );
}
