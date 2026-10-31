import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  RefreshCw,
  Receipt,
  CreditCard,
  Percent,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'plans', label: 'Subscription Plans', icon: Layers },
  { id: 'quotations', label: 'Quotations', icon: FileText },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'discounts', label: 'Discounts', icon: Percent },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onSelectTab, isCollapsed }) {
  return (
    <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shrink-0 ${isCollapsed ? 'w-18' : 'w-64'} h-screen sticky top-0 z-30`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">Brightloop</h1>
            <span className="text-[10px] text-blue-600 font-medium">Subscription Platform</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2">
          {!isCollapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Operations & Billing
            </p>
          )}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 m-2 rounded-xl">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Odoo X Make-A-Ton</span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono text-[9px] font-bold">
              v1.0-proto
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
