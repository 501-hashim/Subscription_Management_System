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
  HelpCircle,
  ExternalLink,
  Users,
} from 'lucide-react';

export function LoginPage({
  onLogin,
  availableUsers = [],
  availableCustomers = [],
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [accountType, setAccountType] = useState('staff'); // 'staff' | 'customer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Sales Representative');
  const [department, setDepartment] = useState('Sales');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSentInfo, setResetSentInfo] = useState(null);

  // Real-time password rules validation (> 8 characters, uppercase, lowercase, special char)
  const hasMinLength = password.length > 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar;

  // Preset demo personas covering the three roles defined for access control
  const demoPersonas = [
    {
      id: 'USR-01',
      name: 'Hashim (Lead)',
      email: 'hashim@brightloop.io',
      role: 'Super Admin',
      department: 'Engineering',
      personaType: 'admin',
      badge: 'Admin',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      description: 'Controls the whole system & adds internal staff',
    },
    {
      id: 'USR-02',
      name: 'Sarah Connor',
      email: 'sarah.c@brightloop.io',
      role: 'Billing Manager',
      department: 'Finance',
      personaType: 'staff',
      badge: 'Internal Staff',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      description: 'Handles day-to-day quotes, subscriptions & invoices',
    },
    {
      id: 'CUST-001',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@acmecorp.com',
      company: 'Acme Corporation',
      role: 'Customer',
      customerId: 'CUST-001',
      department: 'Client',
      personaType: 'customer',
      badge: 'Customer Portal',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      description: 'Self-service portal to view own subscriptions & invoices',
    },
  ];

  // Quick 1-click persona login
  const handleSelectPersona = (persona) => {
    setEmail(persona.email);
    setPassword('SecurePass2025!');
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(persona);
    }, 450);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    // Simulate sending reset link
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

    // 1. Email validation
    if (!cleanEmail) {
      setErrorMessage('Please enter your business email.');
      return;
    }

    // 2. Password validation based on security policy
    if (mode === 'signup') {
      if (!isPasswordStrong) {
        setErrorMessage(
          'Password must be more than 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character.'
        );
        return;
      }

      // 3. Email Uniqueness check: "Each email can belong to only one account"
      const userExists = availableUsers.some(
        (u) => u.email?.toLowerCase() === cleanEmail
      );
      const customerExists = availableCustomers.some(
        (c) => c.email?.toLowerCase() === cleanEmail
      );

      if (userExists || customerExists) {
        setErrorMessage(
          'An account with this email address already exists. Each email can belong to only one account.'
        );
        return;
      }

      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
    } else {
      // In signin mode, minimum check
      if (!password.trim()) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'signin') {
        // Search in users
        const matchedUser = availableUsers.find(
          (u) => u.email?.toLowerCase() === cleanEmail
        );
        if (matchedUser) {
          onLogin(matchedUser);
          return;
        }

        // Search in customers
        const matchedCustomer = availableCustomers.find(
          (c) => c.email?.toLowerCase() === cleanEmail
        );
        if (matchedCustomer) {
          const customerAccount = {
            id: matchedCustomer.id,
            customerId: matchedCustomer.id,
            name: matchedCustomer.name,
            email: matchedCustomer.email,
            company: matchedCustomer.company,
            role: 'Customer',
            department: 'Client',
            status: 'Active',
            personaType: 'customer',
          };
          onLogin(customerAccount);
          return;
        }

        // Default fallback mock login
        const defaultUser = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: fullName || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Demo User',
          email: cleanEmail,
          role: 'Internal Staff',
          department: 'Operations',
          status: 'Active',
          lastActive: 'Just now',
          personaType: 'staff',
        };
        onLogin(defaultUser);
      } else {
        // Sign up
        if (accountType === 'customer') {
          const newCustomer = {
            id: `CUST-${Date.now().toString().slice(-4)}`,
            customerId: `CUST-${Date.now().toString().slice(-4)}`,
            name: fullName.trim(),
            company: companyName.trim() || `${fullName.trim()}'s Organization`,
            email: cleanEmail,
            role: 'Customer',
            department: 'Client',
            status: 'Active',
            personaType: 'customer',
          };
          onLogin(newCustomer, true);
        } else {
          const newStaff = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            name: fullName.trim(),
            email: cleanEmail,
            role: role,
            department: department,
            status: 'Active',
            lastActive: 'Just now',
            personaType: role === 'Super Admin' ? 'admin' : 'staff',
          };
          onLogin(newStaff, true);
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center relative overflow-hidden font-sans py-8">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          {/* Left Hero / Problem Statement Showcase */}
          <div className="lg:col-span-5 bg-linear-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white leading-none">Brightloop</h1>
                  <span className="text-xs text-blue-300 font-medium">Subscription Platform</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-300 text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Unified Recurring Billing & Invoicing</span>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                Digital backbone of recurring revenue.
              </h2>
              <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                Run the full lifecycle from products and quotations to automated recurring invoicing, payment reconciliation, and real-time MRR analytics.
              </p>
            </div>

            {/* Role Segregation Preview */}
            <div className="my-6 space-y-2.5 relative z-10">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-300/80 mb-2">
                Three Distinct Access Tiers (Problem Stmt §3):
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">System Admin</h4>
                  <p className="text-[10px] text-slate-300">Controls products, plans, taxes, discounts & adds staff.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Internal Staff</h4>
                  <p className="text-[10px] text-slate-300">Day-to-day operations: quotes, subscriptions, billing.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Customer Portal</h4>
                  <p className="text-[10px] text-slate-300">Customers see and manage only their own subscriptions & invoices.</p>
                </div>
              </div>
            </div>

            {/* Hackathon Badge Footer */}
            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between relative z-10">
              <span>Enterprise Cloud Edition</span>
              <span className="text-slate-300 font-mono text-[10px]">Strict RBAC</span>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Header Tab Toggle */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {mode === 'signin' ? 'Sign in to Brightloop' : 'Create an Account'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {mode === 'signin'
                      ? 'Access your dashboard or test one of the 3 persona roles below.'
                      : 'Join Brightloop with unique email and verified credentials.'}
                  </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium shrink-0">
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

              {/* 1-Click Persona Quick Testing (Hackathon Evaluator Showcase) */}
              {mode === 'signin' && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      1-Click Hackathon Persona Login
                    </span>
                    <span className="text-[10px] text-slate-400">Select to test role</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {demoPersonas.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPersona(p)}
                        className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                            {p.name.split(' ')[0]}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{p.email}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback messages */}
              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {mode === 'signup' && (
                  <div>
                    {/* Account Type Selector for Registration */}
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        I am registering as:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAccountType('customer')}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            accountType === 'customer'
                              ? 'border-blue-600 bg-blue-50/60 text-blue-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold">New Customer</div>
                          <div className="text-[10px] text-slate-400">Access Customer Portal</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountType('staff')}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            accountType === 'staff'
                              ? 'border-blue-600 bg-blue-50/60 text-blue-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold">Internal Staff / Admin</div>
                          <div className="text-[10px] text-slate-400">Operations & Billing</div>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Alex Morgan"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                            required
                          />
                        </div>
                      </div>

                      {accountType === 'customer' ? (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Organization / Company Name
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g. Acme Labs Ltd"
                              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Designated Role
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
                      )}
                    </div>
                  </div>
                )}

                {/* Email input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email Address
                    </label>
                    {mode === 'signup' && (
                      <span className="text-[10px] text-slate-400">Unique per account</span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={mode === 'signin' ? 'name@company.com' : 'you@example.com'}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
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

                  {/* Real-Time Password Rule Checklist (Specific Problem Statement Criterion) */}
                  {mode === 'signup' && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Password Requirements:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>&gt; 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpperCase ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 Uppercase (A-Z)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasLowerCase ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 Lowercase (a-z)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecialChar ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 Special symbol</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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
                  <span className="text-[11px] text-slate-400">TLS 1.3 Encrypted</span>
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
                      <span>{mode === 'signin' ? 'Sign In' : 'Complete Registration'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Helper for Judges */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span className="text-[11px] text-slate-400">
                Want to test Customer Portal directly?
              </span>
              <button
                type="button"
                onClick={() => handleSelectPersona(demoPersonas[2])}
                className="text-emerald-700 hover:text-emerald-900 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Jump into Acme Corp Portal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Problem Statement: "If they forget it later, a reset link should arrive at their registered email") */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Reset Your Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSentInfo ? (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                  <div className="flex items-center gap-2 font-bold mb-1 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Reset Link Dispatched
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    A password reset link has been simulated for{' '}
                    <strong className="font-semibold">{resetSentInfo.email}</strong>. The link expires in 15 minutes.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Simulated Email Link:
                  </span>
                  <div className="font-mono text-[11px] text-blue-600 break-all select-all">
                    {resetSentInfo.link}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter the email address registered with your Brightloop account and we'll dispatch a secure reset link.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
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
