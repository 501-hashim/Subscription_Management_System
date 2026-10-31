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
  User,
  Check,
} from 'lucide-react';
import { authDatabase } from '../../services/authDatabase';

export function LoginPage({
  onLogin,
  availableUsers = [],
  availableCustomers = [],
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  
  // Registration Type Selector: 'user' vs 'organization'
  const [registrationType, setRegistrationType] = useState('organization'); // 'user' | 'organization'

  // User Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Member');
  const [department, setDepartment] = useState('General');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 3D Card Tilt on Mouse Move
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 6; // Max 6 degrees tilt
    const rotateY = (x / rect.width) * 6;
    setCardTilt({ x: rotateX, y: rotateY });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

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

  // Preset demo personas: Includes User (Client) and Admin/Staff accounts
  const demoPersonas = [
    {
      id: 'CUST-001',
      name: 'Sarah (User)',
      email: 'sarah.jenkins@acmecorp.com',
      role: 'User',
      userType: 'customer',
      department: 'Procurement',
      organization: 'Acme Corporation',
      company: 'Acme Corporation',
      badge: 'User',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahj',
    },
    {
      id: 'USR-01',
      name: 'Admin User',
      email: 'admin@brightloop.io',
      role: 'Super Admin',
      userType: 'admin',
      department: 'Engineering',
      organization: 'Brightloop Technologies Inc.',
      badge: 'Admin',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
    {
      id: 'USR-02',
      name: 'Sarah C. (Staff)',
      email: 'sarah.c@brightloop.io',
      role: 'Billing Manager',
      userType: 'staff',
      department: 'Finance',
      organization: 'Brightloop Technologies Inc.',
      badge: 'Staff',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
  ];

  const handleSelectPersona = async (persona) => {
    setEmail(persona.email);
    setPassword('SecurePass2025!');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await authDatabase.login(persona.email, 'SecurePass2025!');
      setIsLoading(false);
      onLogin(result.user);
    } catch {
      setIsLoading(false);
      onLogin(persona);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email.');
      return;
    }

    if (mode === 'signup') {
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
    } else {
      if (!password.trim()) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const result = await authDatabase.login(cleanEmail, password);
        setIsLoading(false);
        onLogin(result.user);
      } else {
        if (registrationType === 'organization') {
          const result = await authDatabase.registerOrganization({
            orgName: organizationName.trim() || `${fullName.trim()}'s Workspace`,
            orgSize: '11-50 employees',
            orgIndustry: 'SaaS & Software',
            adminName: fullName.trim(),
            adminEmail: cleanEmail,
            password: password,
          });
          setIsLoading(false);
          onLogin(result.user, true);
        } else {
          const result = await authDatabase.registerUser({
            name: fullName.trim(),
            email: cleanEmail,
            password: password,
            roleTitle: 'User',
            department: 'Client',
            company: companyName.trim() || `${fullName.trim()}'s Company`,
          });
          setIsLoading(false);
          onLogin(result.user, true);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white py-6">
      {/* Background Radial Glows */}
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
      </header>

      {/* Main Centered Floating Card with Cursor 3D Tilt */}
      <main className={`relative z-10 w-full ${mode === 'signup' ? 'max-w-xl' : 'max-w-md'} mx-auto px-4 py-4 transition-all duration-300`}>
        <div
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/70 relative will-change-transform"
        >
          {/* Card Header */}
          <div className="text-center space-y-1.5 mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {mode === 'signin'
                ? 'Welcome Back'
                : registrationType === 'organization'
                ? 'Register Admin Workspace'
                : 'Register Client User'}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === 'signin'
                ? 'Sign in to access your recurring subscription workspace'
                : registrationType === 'organization'
                ? 'Set up administrator credentials to access the full Operations Console'
                : 'Create your subscriber profile to browse products and checkout plans'}
            </p>
          </div>

          {/* Mode Tabs (Sign In vs Register) */}
          <div className="flex p-1 rounded-xl bg-slate-950/60 border border-white/5 mb-5 text-xs font-semibold">
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
              Register
            </button>
          </div>

          {/* 1-Click Persona Quick Testing Pill Tray (Sign-in mode) */}
          {mode === 'signin' && (
            <div className="mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Quick Sign-In Accounts
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Predefined Roles</span>
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

          {/* SELECTOR ELEMENT: REGISTER AS USER vs ORGANIZATION */}
          {mode === 'signup' && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Registration Type:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Option 1: Organization */}
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationType('organization');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    registrationType === 'organization'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      registrationType === 'organization'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Admin Setup</span>
                      {registrationType === 'organization' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      Admin Console • Full management operations
                    </div>
                  </div>
                </button>

                {/* Option 2: Individual User */}
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationType('user');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    registrationType === 'user'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      registrationType === 'user'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>User Setup</span>
                      {registrationType === 'user' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      User Portal • Product catalog & billing
                    </div>
                  </div>
                </button>
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
            
            {/* PREDEFINED INTERFACE FORM FIELDS (Admin-specific vs User-specific) */}
            {mode === 'signup' && (
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    {registrationType === 'organization' ? 'Admin Registration Interface' : 'Client User Registration Interface'}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    registrationType === 'organization'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {registrationType === 'organization' ? 'Predefined: Admin Console' : 'Predefined: User Portal'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name Field */}
                  <div className={registrationType === 'organization' ? 'sm:col-span-1' : 'sm:col-span-1'}>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {registrationType === 'organization' ? 'Admin Full Name' : 'User Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={registrationType === 'organization' ? 'e.g. Alex Morgan' : 'e.g. Sarah Jenkins'}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Company/Organization Name */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {registrationType === 'organization' ? 'Organization Name' : 'Company Name (Optional)'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={registrationType === 'organization' ? organizationName : companyName}
                        onChange={(e) =>
                          registrationType === 'organization'
                            ? setOrganizationName(e.target.value)
                            : setCompanyName(e.target.value)
                        }
                        placeholder={registrationType === 'organization' ? 'e.g. Acme Corp Inc.' : 'e.g. Apex Logistics'}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Predefined Interface Indicator & Role Badge */}
                  <div className="sm:col-span-2">
                    {registrationType === 'organization' ? (
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px] text-purple-300">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                            Admin Console Role: Super Admin (Executive)
                          </span>
                          <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">11 Modules</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Grants administrative access to Executive Dashboard, Customers, Products, Plans, Quotations, Subscriptions, Invoices, Payments, Discounts, Reports, and System Settings.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px] text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            User Portal Role: Client User (Subscriber)
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">Client Portal</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Grants self-service access to Product Software Catalog (CRM, Accounting, Cloud Storage), Plan Checkout, Active Subscriptions, and client-side PDF Tax Invoices.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Password"
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

              {/* Real-time Password Rules Checklist (in signup mode) */}
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
                  <span>
                    {mode === 'signin'
                      ? 'Sign In to Workspace'
                      : registrationType === 'organization'
                      ? 'Register Admin & Open Operations Console'
                      : 'Register User & Open Client Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>


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
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
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
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your email and we will generate a simulated secure link to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm cursor-pointer"
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
