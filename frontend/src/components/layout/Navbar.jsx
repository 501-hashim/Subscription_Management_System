import React, { useState } from 'react';
import { Search, Bell, Menu, ShieldCheck, CheckCircle2, LogOut, ChevronDown, User } from 'lucide-react';

export function Navbar({
  onToggleSidebar,
  activeTitle,
  globalSearch,
  setGlobalSearch,
  currentUser = { name: 'Hashim', role: 'Super Admin', email: 'hashim@brightloop.io', department: 'Engineering' },
  onLogout,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Invoice INV-2025-1084 is overdue', time: '10m ago', unread: true },
    { id: 2, title: 'Quotation QT-2025-089 accepted by Acme Corp', time: '1h ago', unread: true },
    { id: 3, title: 'New subscription SUB-8407 created', time: '3h ago', unread: false },
  ];

  const initialLetter = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

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
          <p className="text-[11px] text-slate-400">Brightloop Software • Subscription Management Hub</p>
        </div>
      </div>

      {/* Center/Right section: Search, notifications, user info */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscriptions, customers, invoices..."
            value={globalSearch || ''}
            onChange={(e) => setGlobalSearch && setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
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

        {/* User Profile & Role Indicator with Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 -m-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left focus:outline-none"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-xs">
                {initialLetter}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-28">
                  {currentUser?.name || 'User'}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  {currentUser?.role?.includes('Admin') ? 'Admin' : currentUser?.role || 'Staff'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate max-w-32">
                {currentUser?.department || 'Operations'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile Popover / Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>

              <div className="py-1">
                <div className="px-4 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Role</span>
                  <span className="font-semibold text-slate-700">{currentUser?.role}</span>
                </div>
                <div className="px-4 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Department</span>
                  <span className="font-semibold text-slate-700">{currentUser?.department}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
