import React, { useState } from 'react';
import {
  Zap,
  LogOut,
  Layers,
  ShieldCheck,
  User,
  Mail,
  Building2,
  Sparkles,
  Clock,
  ArrowRight,
  Hammer,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  FileText,
  Shield,
  CreditCard,
  Briefcase,
} from 'lucide-react';

export function UserBlankPortal({
  currentUser,
  onLogout,
  onSwitchToAdmin,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const displayName = currentUser?.name || 'Standard User';
  const displayEmail = currentUser?.email || 'user@brightloop.io';
  const displayRole = currentUser?.roleTitle || currentUser?.role || 'Standard Member';
  const displayOrg = currentUser?.organization || 'Brightloop Technologies Inc.';
  const displayDept = currentUser?.department || 'Operations';
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Ambience Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white block leading-none">
                  Brightloop
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  User Workspace
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Subscription & Self-Service Portal
              </span>
            </div>
          </div>

          {/* User Account Controls */}
          <div className="flex items-center gap-3">
            {/* User Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/20">
                {initialLetter}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight truncate max-w-36">
                  {displayEmail}
                </div>
              </div>
              <span className="hidden md:inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {displayRole}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-xs text-slate-300 hover:text-rose-200 transition-all cursor-pointer"
              title="Sign out of your session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Construction Notice Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>User Interface In Development</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {displayName}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Your user account is registered and authenticated. The dedicated self-service
                user interface is currently being created by our frontend team. Full operational controls,
                invoicing systems, customer records, and product plans are restricted to administrative accounts.
              </p>
            </div>

            {/* Status Visual Widget */}
            <div className="shrink-0 p-5 rounded-2xl bg-slate-950/70 border border-white/10 text-center w-full md:w-56 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Hammer className="w-6 h-6 animate-bounce" />
              </div>
              <div className="text-xs font-bold text-white">Interface Status</div>
              <div className="text-[11px] text-amber-300 font-mono">Work in Progress</div>
              <div className="text-[10px] text-slate-400">Scheduled for Portal v2.1</div>
            </div>
          </div>
        </div>

        {/* User Account Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-blue-400">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                User Profile
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-white">{displayName}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{displayEmail}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Account
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Organization & Team
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-white truncate">{displayOrg}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Department: {displayDept}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Role</span>
              <span className="text-blue-300 font-medium">{displayRole}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-purple-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Access Level
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-white">Standard Member</div>
              <div className="text-xs text-slate-400">
                Admin dashboard restricted to Super Admins.
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Portal Tier</span>
              <span className="text-purple-300 font-medium">End-User Space</span>
            </div>
          </div>
        </div>

        {/* Blank Option Preview Cards (Wireframes in Progress) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Modules Under Construction
            </h2>
            <span className="text-xs text-slate-500">Upcoming Self-Service Capabilities</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blank Wireframe Card 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-dashed border-white/15 hover:border-white/30 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                  In Progress
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">My Subscriptions</h3>
                <p className="text-xs text-slate-400 mt-1">
                  View your active recurring plans, renewal dates, and payment methods.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 rounded-full bg-white/5 animate-pulse w-3/4" />
                <div className="h-2 rounded-full bg-white/5 animate-pulse w-1/2" />
              </div>
            </div>

            {/* Blank Wireframe Card 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-dashed border-white/15 hover:border-white/30 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                  In Progress
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Invoices & Receipts</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Download official tax invoices, billing receipts, and statement history.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 rounded-full bg-white/5 animate-pulse w-4/5" />
                <div className="h-2 rounded-full bg-white/5 animate-pulse w-2/3" />
              </div>
            </div>

            {/* Blank Wireframe Card 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-dashed border-white/15 hover:border-white/30 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                  Coming Soon
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Helpdesk & Support</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Open support tickets and chat directly with Brightloop engineering.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 rounded-full bg-white/5 animate-pulse w-2/3" />
                <div className="h-2 rounded-full bg-white/5 animate-pulse w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Switcher Convenience Banner */}
        <div className="p-6 rounded-2xl bg-linear-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Testing & Evaluation Notice</span>
            </div>
            <p className="text-xs text-slate-300">
              Need to test the 11 Admin Operations modules (Dashboard, Customers, Plans, Quotations, Invoices, Payments, Discounts, Reports, Settings)? Switch to the Super Admin account anytime.
            </p>
          </div>

          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Switch to Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 py-4 text-center text-xs text-slate-500">
        Brightloop Subscription Platform • Production Relational Architecture • Need support? Email{' '}
        <a href="mailto:billing-support@brightloop.io" className="text-blue-400 hover:underline">
          billing-support@brightloop.io
        </a>
      </footer>
    </div>
  );
}

export default UserBlankPortal;
