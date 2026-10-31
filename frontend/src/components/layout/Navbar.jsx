import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export function Navbar({
  onToggleSidebar,
  activeTitle,
  globalSearch,
  setGlobalSearch,
  currentUser = { name: 'Hashim', role: 'Super Admin', email: 'hashim@brightloop.io', department: 'Engineering' },
  onLogout,
  onSelectTab,
  users,
  onSwitchUser,
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
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left section: toggle + current route breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 leading-none">{activeTitle}</h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              Live Workspace
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Brightloop • Subscription Management Platform</p>
        </div>
      </div>

      {/* Center/Right section: Search, notifications, user info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscriptions, customers, invoices..."
            value={globalSearch || ''}
            onChange={(e) => setGlobalSearch && setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-12 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="text-[9px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  2 unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                      item.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-800 leading-snug font-medium">{item.title}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 inline-block">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
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
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-all cursor-pointer text-left focus:outline-none border border-transparent hover:border-slate-200"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-xs">
                {initialLetter}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate max-w-28">
                  {currentUser?.name || 'User'}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                  {currentUser?.role?.includes('Admin') ? 'Admin' : currentUser?.role || 'Staff'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate max-w-32 leading-tight">
                {currentUser?.department || 'Operations'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>

              <div className="py-2 px-2 text-xs text-slate-600 space-y-1">
                <div className="px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Assigned Role</span>
                  <span className="font-semibold text-slate-800">{currentUser?.role}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Department</span>
                  <span className="font-semibold text-slate-800">{currentUser?.department}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1 px-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
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

export default Navbar;
