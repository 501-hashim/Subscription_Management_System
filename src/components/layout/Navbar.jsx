import React, { useState } from 'react';
import { Search, Bell, Menu, ShieldCheck, CheckCircle2, ShoppingBag, LogOut } from 'lucide-react';
import { Button } from '../common/Button';

export function Navbar({ 
  onToggleSidebar, 
  activeTitle, 
  globalSearch, 
  setGlobalSearch, 
  onSwitchToCustomer,
  currentUser,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Invoice INV-2025-1084 is overdue', time: '10m ago', unread: true },
    { id: 2, title: 'Quotation QT-2025-089 accepted by Acme Corp', time: '1h ago', unread: true },
    { id: 3, title: 'New subscription SUB-8407 created', time: '3h ago', unread: false },
  ];

  const adminName = currentUser?.name || 'Hashim (Lead)';
  const adminRole = currentUser?.role || 'Super Admin';
  const adminInitial = adminName[0] || 'A';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left section: toggle + current route breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{activeTitle}</h2>
          <p className="text-[11px] text-slate-400">Brightloop Software • Subscription Operations</p>
        </div>
      </div>

      {/* Center/Right section: Search, notifications, switch to customer, user info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-60 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscriptions, customers, invoices..."
            value={globalSearch || ''}
            onChange={(e) => setGlobalSearch && setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Switch to Customer Portal CTA */}
        {onSwitchToCustomer && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchToCustomer}
            className="border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/70 font-semibold text-xs whitespace-nowrap"
            title="Preview customer self-service portal"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            <span className="hidden sm:inline">Customer</span> Storefront
          </Button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  2 new
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className={`px-4 py-3 hover:bg-slate-50 transition-colors ${item.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-800 leading-snug">{item.title}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 inline-block">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-blue-600 font-medium hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile & Role Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">
              {adminInitial}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900">{adminName}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> {adminRole}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">{currentUser?.email || 'admin@brightloop.io'}</span>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              title="Sign Out of Operations Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
