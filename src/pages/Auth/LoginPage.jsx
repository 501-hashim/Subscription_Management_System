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
  X,
  AlertCircle,
  Briefcase,
  Globe,
  Users,
} from 'lucide-react';

export function LoginPage({
  onLogin,
  availableUsers = [],
  availableCustomers = [],
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  
  // User Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Super Admin (Owner)');
  const [department, setDepartment] = useState('Executive');
  
  // Organization State (for Registration)
  const [organizationName, setOrganizationName] = useState('');
  const [organizationSize, setOrganizationSize] = useState('11-50 employees');
  const [organizationIndustry, setOrganizationIndustry] = useState('SaaS & Software');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSentInfo, setResetSentInfo] = useState(null);

  // Real-time password criteria checklist
  const hasMinLength = password.length > 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar;

  // Preset demo personas for quick testing
  const demoPersonas = [
    {
      id: 'USR-01',
      name: 'Hashim (Lead)',
      email: 'hashim@brightloop.io',
      role: 'Super Admin',
      department: 'Engineering',
      organization: 'Brightloop Technologies Inc.',
      badge: 'Admin',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    {
      id: 'USR-02',
      name: 'Sarah Connor',
      email: 'sarah.c@brightloop.io',
      role: 'Billing Manager',
      department: 'Finance',
      organization: 'Brightloop Technologies Inc.',
      badge: 'Billing Lead',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
    {
      id: 'USR-03',
      name: 'Liam Vance',
      email: 'liam.v@brightloop.io',
      role: 'Sales Representative',
      department: 'Sales',
      organization: 'Brightloop Technologies Inc.',
      badge: 'Sales Rep',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
  ];

  const handleSelectPersona = (persona) => {
    setEmail(persona.email);
    setPassword('SecurePass2025!');
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(persona);
    }, 400);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    const mockToken = Math.random().toString(36).substring(2, 12);
    setResetSentInfo({
      email: forgotEmail.trim(),
      link: `https://brightloop.io/auth/reset-password?token=${mockToken}`,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your business email.');
      return;
    }

    if (mode === 'signup') {
      if (!organizationName.trim()) {
        setErrorMessage('Please enter your organization or company name.');
        return;
      }

      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      if (!isPasswordStrong) {
        setErrorMessage(
          'Password must be more than 8 characters and include at least one uppercase letter, one lowercase letter, and one special character.'
        );
        return;
      }

      const userExists = availableUsers.some((u) => u.email?.toLowerCase() === cleanEmail);
      if (userExists) {
        setErrorMessage('An account with this email address already exists.');
        return;
      }
    } else {
      if (!password.trim()) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'signin') {
        const matched = availableUsers.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (matched) {
          onLogin(matched);
        } else {
          const defaultUser = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            name: fullName || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Demo User',
            email: cleanEmail,
            role: 'Super Admin',
            department: 'Operations',
            organization: organizationName || 'Brightloop Workspace',
            status: 'Active',
            lastActive: 'Just now',
          };
          onLogin(defaultUser);
        }
      } else {
        const newUser = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: fullName.trim(),
          email: cleanEmail,
          role: role.split(' ')[0] === 'Super' ? 'Super Admin' : role,
          department: department,
          organization: organizationName.trim(),
          organizationSize: organizationSize,
          organizationIndustry: organizationIndustry,
          status: 'Active',
          lastActive: 'Just now',
        };
        onLogin(newUser, true);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white py-6">
      {/* Background Mesh Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-none">Brightloop</span>
            <span className="text-[11px] text-blue-400 font-medium">Subscription Platform</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Platform Status: Operational</span>
        </div>
      </header>

      {/* Main Centered Floating Card */}
      <main className={`relative z-10 w-full ${mode === 'signup' ? 'max-w-xl' : 'max-w-md'} mx-auto px-4 py-4 transition-all duration-300`}>
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/70 relative">
          
          {/* Card Header */}
          <div className="text-center space-y-1.5 mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Organization Workspace'}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === 'signin'
                ? 'Sign in to access your recurring subscription workspace'
                : 'Register your organization and administrative user account'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-950/60 border border-white/5 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
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
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (User & Org)
            </button>
          </div>

          {/* 1-Click Persona Quick Testing Pill Tray (Sign-in mode) */}
          {mode === 'signin' && (
            <div className="mb-6 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  1-Click Demo Login
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Quick switch</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {demoPersonas.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                  >
                    <span className="text-[11px] font-semibold text-slate-200 block truncate group-hover:text-blue-400">
                      {p.name.split(' ')[0]}
                    </span>
                    <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-mono font-medium border mt-1 ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inline Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER MODE: SECTION 1 - ORGANIZATION DETAILS */}
            {mode === 'signup' && (
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Organization Profile
                  </span>
                  <span className="text-[10px] text-slate-400">Workspace Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Organization / Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. Acme Cloud Corp"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Team Size
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={organizationSize}
                        onChange={(e) => setOrganizationSize(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="1-10 employees">1 - 10 employees (Startup)</option>
                        <option value="11-50 employees">11 - 50 employees (Growth)</option>
                        <option value="51-200 employees">51 - 200 employees (Mid-Market)</option>
                        <option value="200+ employees">200+ employees (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Industry
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={organizationIndustry}
                        onChange={(e) => setOrganizationIndustry(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="SaaS & Software">SaaS & Software</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Digital Agency">Digital Agency</option>
                        <option value="Consulting & Ops">Consulting & Ops</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REGISTER MODE: SECTION 2 - USER CREDENTIALS */}
            {mode === 'signup' && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  User Administrator Profile
                </span>
                <span className="text-[10px] text-slate-400">Account Owner</span>
              </div>
            )}

            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="Super Admin (Owner)">Super Admin (Owner)</option>
                    <option value="Billing Manager">Billing Manager</option>
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Sales Representative">Sales Representative</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email Field (Shared in both Sign In and Register) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'signup' ? 'alex@company.com' : 'hashim@brightloop.io'}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field (Shared in both Sign In and Register) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setResetSentInfo(null);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Checklist for Signup Mode */}
              {mode === 'signup' && (
                <div className="mt-3 p-3 bg-slate-950/60 border border-white/5 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Password Requirements:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>&gt; 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpperCase ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>1 Uppercase (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasLowerCase ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>1 Lowercase (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecialChar ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>1 Special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span>Keep me signed in</span>
              </label>
              <span className="text-[11px] text-slate-500">256-bit SSL</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Organization & Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-500">
        <p>Brightloop Subscription Management Platform • Secure Operations Portal</p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSentInfo ? (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs">
                  <div className="flex items-center gap-2 font-bold mb-1 text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Reset Link Dispatched
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                    A password reset link has been simulated for{' '}
                    <strong className="text-white font-semibold">{resetSentInfo.email}</strong>. The link expires in 15 minutes.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Simulated Email Link:
                  </span>
                  <div className="font-mono text-[11px] text-blue-400 break-all select-all">
                    {resetSentInfo.link}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your business email and we will generate a simulated secure link to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registered Business Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="hashim@brightloop.io"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
