import React, { useState } from 'react';
import { 
  Zap, ShieldCheck, User, Building, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, UserPlus, LogIn, KeyRound,
  Shield, CreditCard, RefreshCw
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export function LoginPage({ 
  customers = [], 
  users = [], 
  onLogin, 
  onRegisterCustomer 
}) {
  const [authRole, setAuthRole] = useState('customer'); // 'customer' or 'admin'
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Form states for customer registration
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  // Handle customer login submit
  const handleCustomerLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your account email address.');
      return;
    }

    const matched = customers.find(
      (c) => c.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (matched) {
      onLogin(matched, 'customer');
    } else {
      // Allow fallback login even if non-preseeded email entered
      const fallbackCustomer = {
        id: `CUST-GUEST-${Math.floor(100 + Math.random() * 900)}`,
        name: loginEmail.split('@')[0] || 'Customer User',
        company: loginEmail.split('@')[0].toUpperCase() + ' Corp',
        email: loginEmail.trim(),
        status: 'Active',
        totalSubscriptions: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      onLogin(fallbackCustomer, 'customer');
    }
  };

  // Handle admin login submit
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your administrator email address.');
      return;
    }

    const matched = users.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (matched) {
      onLogin(matched, 'admin');
    } else {
      // Default to lead super admin
      onLogin(users[0] || { id: 'USR-01', name: 'Hashim (Lead)', email: loginEmail, role: 'Super Admin' }, 'admin');
    }
  };

  // Quick 1-click login helper
  const handleQuickCustomerLogin = (customer) => {
    onLogin(customer, 'customer');
  };

  const handleQuickAdminLogin = (user) => {
    onLogin(user, 'admin');
  };

  // Registration handler
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setLoginError('Please fill in your name and email.');
      return;
    }

    const newCustomer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: regName.trim(),
      company: regCompany.trim() || `${regName.trim()}'s Team`,
      email: regEmail.trim(),
      phone: regPhone.trim() || '+1 (555) 000-0000',
      address: regAddress.trim() || 'Headquarters Office',
      status: 'Active',
      totalSubscriptions: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    if (onRegisterCustomer) {
      onRegisterCustomer(newCustomer);
    }
    onLogin(newCustomer, 'customer');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background ambient lighting effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                Brightloop
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Auth Gate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Enterprise Subscription Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Production Network Online</span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Header Title inside Card */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isRegistering ? 'Create Customer Account' : 'Sign in to Brightloop'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRegistering
                ? 'Join Brightloop to order subscriptions, configure licenses, and manage billing.'
                : 'Select your portal role to access personalized subscriptions and operations.'}
            </p>
          </div>

          {!isRegistering ? (
            <>
              {/* Role Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthRole('customer');
                    setLoginError('');
                    setLoginEmail(customers[0]?.email || 'sarah.jenkins@acmecorp.com');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    authRole === 'customer'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Customer Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthRole('admin');
                    setLoginError('');
                    setLoginEmail(users[0]?.email || 'hashim@brightloop.io');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    authRole === 'admin'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin / Staff</span>
                </button>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={authRole === 'customer' ? handleCustomerLoginSubmit : handleAdminLoginSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {authRole === 'customer' ? 'Business / Account Email' : 'Staff Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={authRole === 'customer' ? 'name@company.com' : 'admin@brightloop.io'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center text-xs font-bold py-2.5 shadow-md shadow-blue-600/30 mt-2"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to {authRole === 'customer' ? 'Customer Hub' : 'Admin Operations'}
                </Button>
              </form>

              {/* Quick 1-Click Demo Profiles */}
              <div className="mt-6 pt-5 border-t border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ⚡ Instant Demo Sign-In
                  </span>
                  <span className="text-[10px] text-slate-500">1-click login</span>
                </div>

                {authRole === 'customer' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customers.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleQuickCustomerLogin(c)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 hover:border-blue-500/50 text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {c.company ? c.company[0] : c.name[0]}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-blue-300">
                            {c.company || c.name}
                          </p>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {c.name} • {c.totalSubscriptions} plans
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {users.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickAdminLogin(u)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 hover:border-blue-500/50 text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {u.name[0]}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300">
                            {u.name}
                          </p>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {u.role}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom toggle to register */}
              {authRole === 'customer' && (
                <div className="mt-5 text-center text-xs text-slate-400">
                  <span>Don't have a business account yet? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setLoginError('');
                    }}
                    className="text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Register new customer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 mb-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="e.g. CloudScale Innovations"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@cloudscale.io"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Suite 500, Seattle, WA"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegistering(false)}
                  className="text-slate-300 border-slate-700"
                >
                  Back to Sign In
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="font-bold shadow-md shadow-blue-600/30"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Complete Registration & Log In
                </Button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Trust & Compliance Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>256-Bit TLS Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>PCI-DSS Level 1 Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Automated Cycle Proration</span>
          </div>
        </div>

        <div>
          <span>© 2026 Brightloop Subscription Platform</span>
        </div>
      </footer>

    </div>
  );
}
export default LoginPage;
