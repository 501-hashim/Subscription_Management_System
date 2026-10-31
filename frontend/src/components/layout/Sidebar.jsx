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
    <aside
      className={`bg-[#0b0f19] text-slate-300 border-r border-slate-800/80 transition-all duration-300 flex flex-col shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0 z-30 select-none`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0 ring-1 ring-white/10">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">Brightloop</h1>
            <span className="text-[10px] text-blue-400 font-medium">Subscription Platform</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 m-2 rounded-xl">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Subscription Hub</span>
            <span className="inline-block px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[9px] font-bold">
              v1.0-live
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
