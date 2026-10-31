import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  TrendingUp,
  CreditCard,
  Fingerprint,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  Shield,
  Laptop
} from 'lucide-react';

export function LoginPage({ onLogin, users = [] }) {
  // Form State
  const [email, setEmail] = useState('hashim@brightloop.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2FA / MFA state
  const [step, setStep] = useState('credentials'); // 'credentials' | 'mfa'
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [mfaError, setMfaError] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Quick Demo Account Selection
  const handleSelectDemoUser = (user) => {
    setEmail(user.email);
    setPassword('AdminSecurePass2025!');
    setErrorMessage('');
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);

    // Simulate network authentication & security check
    setTimeout(() => {
      setIsLoading(false);
      // Find matching user or fallback to first user or create admin profile
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      ) || {
        id: 'USR-ADMIN',
        name: email.split('@')[0].toUpperCase(),
        email: email.trim(),
        role: 'Super Admin',
        department: 'Operations',
        status: 'Active',
        lastActive: 'Just now',
      };

      setPendingUser(matchedUser);
      // Move to 2FA verification step
      setStep('mfa');
    }, 600);
  };

  // Step 2: Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Step 2: Submit 2FA
  const handleMfaSubmit = (e) => {
    e.preventDefault();
    setMfaError('');
    const code = otp.join('');

    if (code.length < 6) {
      setMfaError('Please enter all 6 digits of your authenticator token.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (pendingUser) {
        if (rememberMe) {
          try {
            localStorage.setItem('brightloop_admin_session', JSON.stringify(pendingUser));
          } catch (err) {
            console.error('Failed to save session', err);
          }
        }
        onLogin(pendingUser);
      }
    }, 500);
  };

  // One-click Bypass 2FA for convenience in Demo
  const handleQuickBypass2FA = () => {
    if (pendingUser) {
      if (rememberMe) {
        try {
          localStorage.setItem('brightloop_admin_session', JSON.stringify(pendingUser));
        } catch (err) {
          console.error('Failed to save session', err);
        }
      }
      onLogin(pendingUser);
    }
  };

  // Forgot password submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2200);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* LEFT PANEL: Enterprise Branding & Live Intelligence Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-linear-to-br from-slate-900 via-slate-950 to-blue-950/60 border-r border-slate-800/80 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Brightloop <span className="text-blue-400 font-medium">Software</span>
              </span>
              <span className="text-xs text-slate-400 tracking-wide block">
                Subscription & Recurring Revenue Management Hub
              </span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Odoo X Make-A-Ton Hackathon Edition
          </div>
        </div>

        {/* Center Presentation: Key Admin Metrics & Capabilities */}
        <div className="relative z-10 my-auto py-8 space-y-8">
          <div>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Mission Control for <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-cyan-300">
                SaaS Revenue & Subscriptions
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 max-w-lg leading-relaxed">
              Unified administrative portal for automated billing cycles, multi-tier pricing plans, contract renewal lifecycles, and audit-grade financial reporting.
            </p>
          </div>

          {/* Quick Realtime KPI Metric Teasers */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Active MRR</span>
              </div>
              <p className="text-xl font-bold text-white mt-1">$124,500</p>
              <span className="text-[11px] text-emerald-400 font-medium">+14.2% YoY</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Contracts</span>
              </div>
              <p className="text-xl font-bold text-white mt-1">1,248</p>
              <span className="text-[11px] text-slate-400 font-medium">99.2% Retention</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Audit SLA</span>
              </div>
              <p className="text-xl font-bold text-white mt-1">99.99%</p>
              <span className="text-[11px] text-indigo-400 font-medium">SOC2 Compliant</span>
            </div>
          </div>

          {/* Live System Health Tag */}
          <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl max-w-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>All 11 Core Micro-Services Operational • Zero Unresolved Security Incidents</span>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-400" />
            <span>256-Bit End-to-End TLS Encryption</span>
          </div>
          <span>v0.1.0 • Stable Build</span>
        </div>
      </div>

      {/* RIGHT PANEL: Administrative Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Brightloop Software</span>
              <span className="text-xs text-slate-400 block">Subscription Management</span>
            </div>
          </div>

          {/* Card Wrapper */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            {/* Header Titles */}
            <div className="space-y-1 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Admin Sign In
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Secure SSO / RBAC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {step === 'credentials'
                  ? 'Enter your administrative credentials to manage subscriptions.'
                  : 'Enter the 6-digit TOTP verification code from your authenticator app.'}
              </p>
            </div>

            {/* Error Message Display */}
            {(errorMessage || mfaError) && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage || mfaError}</span>
              </div>
            )}

            {/* STEP 1: CREDENTIALS FORM */}
            {step === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Administrative Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@brightloop.io"
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-9 pr-10 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Session Duration */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-xs text-slate-300">Keep session active (30 days)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Auto-lock on idle</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Multi-Factor Auth</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: MULTI-FACTOR AUTHENTICATION (2FA / MFA) */}
            {step === 'mfa' && (
              <form onSubmit={handleMfaSubmit} className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {pendingUser?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{pendingUser?.name}</p>
                      <p className="text-[11px] text-slate-400">{pendingUser?.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    {pendingUser?.role}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 text-center mb-3">
                    Enter 6-Digit Authenticator Token
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-bold bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg text-white"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
                    <span>Code auto-refreshes in 24s</span>
                    <button
                      type="button"
                      onClick={() => setOtp(['1', '2', '3', '4', '5', '6'])}
                      className="text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Token...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Enter Admin Console</span>
                      </>
                    )}
                  </button>

                  {/* Demo Convenience Quick-Bypass */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="text-slate-400 hover:text-slate-200 hover:underline"
                    >
                      ← Back to credentials
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickBypass2FA}
                      className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline flex items-center gap-1"
                    >
                      <span>Demo Instant Access</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* QUICK PRESET ADMIN ROLES (Crucial for Reviewers & Hackathon Demo) */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Demo Admin Profiles
                </span>
                <span className="text-[10px] text-slate-500">Click to autofill</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {users.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectDemoUser(u)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      email.toLowerCase() === u.email.toLowerCase()
                        ? 'bg-blue-600/10 border-blue-500/40 text-blue-200'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-blue-400">
                        {u.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-white block truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{u.email}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enterprise SSO Options */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <p className="text-[11px] text-center text-slate-500 mb-3">Or sign in with corporate credentials</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const admin = users[0];
                    if (admin) onLogin(admin);
                  }}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const admin = users[0];
                    if (admin) onLogin(admin);
                  }}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Okta SAML</span>
                </button>
              </div>
            </div>
          </div>

          {/* Legal / Security Footer */}
          <div className="text-center space-y-1 text-xs text-slate-500">
            <p>
              Protected by Enterprise Shield & Multi-Factor Access Policy.
            </p>
            <p className="text-[11px] text-slate-600">
              Brightloop Software Systems • All access logged with IP 192.168.1.104
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Reset Admin Password</h3>
                <p className="text-xs text-slate-400">Receive a secure token link</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Reset token sent! Check your administrative inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter your registered work email and an emergency recovery link will be dispatched to your authorized inbox.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="hashim@brightloop.io"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Send Recovery Token
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
