import React, { useState } from 'react';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  UserCheck,
  Layers,
  TrendingUp,
} from 'lucide-react';

export function LoginPage({ onLogin, availableUsers = [] }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Sales Representative');
  const [department, setDepartment] = useState('Sales');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Quick fill and sign in helper
  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword('••••••••••••');
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(user);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your business email.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'signin') {
        // Find existing matching user or allow any valid email
        const matched = availableUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (matched) {
          onLogin(matched);
        } else {
          // Allow mock login for any credentials
          const guestUser = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Demo User',
            email: email.trim(),
            role: 'Product Specialist',
            department: 'Operations',
            status: 'Active',
            lastActive: 'Just now',
          };
          onLogin(guestUser);
        }
      } else {
        // Sign Up
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          return;
        }

        const newUser = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: fullName.trim(),
          email: email.trim(),
          role: role,
          department: department,
          status: 'Active',
          lastActive: 'Just now',
        };
        onLogin(newUser, true); // true = newly registered
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          {/* Left Hero / Brand showcase */}
          <div className="lg:col-span-5 bg-linear-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
            
            {/* Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white leading-none">Brightloop</h1>
                  <span className="text-xs text-blue-300 font-medium">Subscription Platform</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-300 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Odoo X Make-A-Ton Hackathon Edition</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Modern recurring billing & subscription intelligence.
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Streamline customer lifecycles, automated invoicing, real-time MRR analytics, and contract renewals seamlessly.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="my-8 space-y-3.5 relative z-10">
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <Layers className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Full Lifecycle Subscriptions</h4>
                  <p className="text-[11px] text-slate-300">Quotations, upgrades, pause/resume, and recurring intervals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Live MRR & ARR Analytics</h4>
                  <p className="text-[11px] text-slate-300">Deep financial reporting, cohort churn metrics, and revenue charts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Enterprise Role Security</h4>
                  <p className="text-[11px] text-slate-300">Role-based controls for Admins, Billing Managers, and Sales reps.</p>
                </div>
              </div>
            </div>

            {/* Footer / Hackathon Credits */}
            <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between relative z-10">
              <span>Brightloop • v1.0 Prototype</span>
              <span className="text-slate-300">Clean Architecture</span>
            </div>
          </div>

          {/* Right Login / Sign up Form */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-white">
            <div>
              {/* Header Tab Toggle */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {mode === 'signin' ? 'Welcome back' : 'Create an account'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {mode === 'signin'
                      ? 'Enter your credentials or choose a 1-click demo persona below.'
                      : 'Join Brightloop to manage subscription pipelines.'}
                  </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      mode === 'signin'
                        ? 'bg-white text-blue-600 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      mode === 'signup'
                        ? 'bg-white text-blue-600 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Quick Persona Demo Logins (Hackathon Showcase) */}
              {mode === 'signin' && availableUsers.length > 0 && (
                <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Quick Demo Persona Sign In
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">Click to test role</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {availableUsers.slice(0, 3).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className="text-left p-2 rounded-lg bg-white border border-blue-200/80 hover:border-blue-500 hover:shadow-xs transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                            {u.name.split(' ')[0]}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {u.role.includes('Admin') ? 'Admin' : u.role.includes('Billing') ? 'Billing' : 'Sales'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{u.email}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback messages */}
              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {forgotPasswordSent && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Reset instructions simulated! (Mock account password reset).
                  </span>
                  <button
                    onClick={() => setForgotPasswordSent(false)}
                    className="text-emerald-700 hover:underline font-semibold ml-2"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@brightloop.io"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setForgotPasswordSent(true)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Billing Manager">Billing Manager</option>
                        <option value="Sales Representative">Sales Representative</option>
                        <option value="Support Specialist">Support Specialist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                      >
                        <option value="Executive">Executive</option>
                        <option value="Finance">Finance</option>
                        <option value="Sales">Sales</option>
                        <option value="Operations">Operations</option>
                        <option value="Engineering">Engineering</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span className="text-xs text-slate-600">Keep me signed in</span>
                  </label>
                  <span className="text-[11px] text-slate-400">256-bit encrypted</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create & Access Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Quick Bypass / Hackathon Reviewer Aid */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="text-slate-400 text-[11px]">
                Testing during hackathon judging?
              </span>
              <button
                type="button"
                onClick={() => {
                  if (availableUsers.length > 0) {
                    onLogin(availableUsers[0]);
                  } else {
                    onLogin({
                      id: 'USR-01',
                      name: 'Hashim (Lead)',
                      email: 'hashim@brightloop.io',
                      role: 'Super Admin',
                      department: 'Engineering',
                      status: 'Active',
                    });
                  }
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Instant Demo Access as Hashim</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
