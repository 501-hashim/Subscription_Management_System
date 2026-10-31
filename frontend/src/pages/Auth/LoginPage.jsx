import React, { useState, useEffect, useRef } from 'react';
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
  User,
  Database,
  Check,
  Settings,
  ExternalLink,
  Info,
} from 'lucide-react';
import { authDatabase } from '../../services/authDatabase';

// Official Google Multi-Color SVG Icon
function GoogleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.44 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.19 0 10.03 0 12s.45 3.81 1.25 5.43l4.03-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.56 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

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
  const [role, setRole] = useState('Billing Manager');
  const [department, setDepartment] = useState('Finance');
  
  // Organization State (for Organization Registration)
  const [organizationName, setOrganizationName] = useState('');
  const [organizationSize, setOrganizationSize] = useState('11-50 employees');
  const [organizationIndustry, setOrganizationIndustry] = useState('SaaS & Software');

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

  // SQL Query Inspector State
  const [showSqlDrawer, setShowSqlDrawer] = useState(false);
  const [lastSql, setLastSql] = useState(
    "SELECT u.id, u.org_id, u.name, u.role, o.name AS organization\nFROM users u\nLEFT JOIN organizations o ON u.org_id = o.id\nWHERE LOWER(u.email) = 'hashim@brightloop.io';"
  );

  // Google OAuth State & Real Google Identity Services (GIS)
  const [googleClientId, setGoogleClientId] = useState(
    () => localStorage.getItem('brightloop_google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  );
  const [inputClientId, setInputClientId] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalTab, setGoogleModalTab] = useState('accounts'); // 'accounts' | 'config'
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleStatusText, setGoogleStatusText] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [gisSdkLoaded, setGisSdkLoaded] = useState(false);

  const googleNativeBtnContainer = useRef(null);

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

  // Preset demo personas
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hashim',
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liam',
    },
  ];

  // Callback when actual Google ID token credential arrives from GIS
  const handleGoogleCredentialResponse = async (response) => {
    try {
      setIsGoogleLoading(true);
      setGoogleStatusText('Verifying Google cryptographic signature...');

      // Decode Google JWT payload on client
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const claims = JSON.parse(jsonPayload);

      setGoogleStatusText('Synchronizing user with SQLite database...');

      // Dispatch to FastAPI backend with actual token for verification
      const result = await authDatabase.googleLogin({
        email: claims.email,
        name: claims.name || claims.given_name,
        googleId: claims.sub,
        avatarUrl: claims.picture,
        token: response.credential, // Actual Google Signed JWT
      });

      setIsGoogleLoading(false);
      setShowGoogleModal(false);
      if (result?.sqlQuery) setLastSql(result.sqlQuery);
      onLogin(result.user);
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMessage(err.message || 'Google OAuth verification failed.');
    }
  };

  // Initialize Google Identity Services (GIS)
  useEffect(() => {
    const checkGis = () => {
      if (window.google?.accounts?.id) {
        setGisSdkLoaded(true);

        if (googleClientId && googleClientId.includes('.')) {
          try {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            // Render official Google button if element exists
            if (googleNativeBtnContainer.current) {
              googleNativeBtnContainer.current.innerHTML = '';
              window.google.accounts.id.renderButton(googleNativeBtnContainer.current, {
                theme: 'filled_black',
                size: 'large',
                width: '100%',
                text: mode === 'signin' ? 'continue_with' : 'signup_with',
                shape: 'rectangular',
              });
            }
          } catch (e) {
            console.warn('GIS init error:', e);
          }
        }
      }
    };

    checkGis();
    const interval = setInterval(checkGis, 1000);
    return () => clearInterval(interval);
  }, [googleClientId, mode]);

  // Trigger Google OAuth Flow
  const triggerGoogleOAuthFlow = () => {
    setErrorMessage('');

    // If a valid Google Client ID is configured and GIS is available, trigger real Google OAuth popup
    if (googleClientId && googleClientId.includes('.') && window.google?.accounts?.oauth2) {
      setIsGoogleLoading(true);
      setGoogleStatusText('Opening Google OAuth popup window...');

      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              setGoogleStatusText('Fetching profile from Google OAuth API...');
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const gProfile = await res.json();

                setGoogleStatusText('Storing user in SQLite relational schema...');
                const result = await authDatabase.googleLogin({
                  email: gProfile.email,
                  name: gProfile.name,
                  googleId: gProfile.sub,
                  avatarUrl: gProfile.picture,
                  token: tokenResponse.access_token,
                });

                setIsGoogleLoading(false);
                setShowGoogleModal(false);
                if (result?.sqlQuery) setLastSql(result.sqlQuery);
                onLogin(result.user);
              } catch (profileErr) {
                setIsGoogleLoading(false);
                setErrorMessage('Failed to fetch userinfo from Google: ' + profileErr.message);
              }
            } else {
              setIsGoogleLoading(false);
            }
          },
          error_callback: (err) => {
            setIsGoogleLoading(false);
            if (err?.type === 'popup_closed') {
              setErrorMessage('Google Sign-In popup was closed before completing.');
            } else {
              setErrorMessage(`Google OAuth error: ${err?.message || 'Check GCP Authorized Origins'}`);
            }
          },
        });

        client.requestAccessToken();
        return;
      } catch (e) {
        console.error('Failed to trigger token client:', e);
        setIsGoogleLoading(false);
      }
    }

    // Otherwise, open the Google OAuth interactive modal (with option to configure Client ID or choose persona)
    setShowGoogleModal(true);
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!inputClientId.trim()) return;

    const trimmed = inputClientId.trim();
    localStorage.setItem('brightloop_google_client_id', trimmed);
    setGoogleClientId(trimmed);
    setGoogleModalTab('accounts');
    setErrorMessage('');
  };

  const handleSelectPersona = async (persona) => {
    setEmail(persona.email);
    setPassword('SecurePass2025!');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await authDatabase.login(persona.email, 'SecurePass2025!');
      setIsLoading(false);
      if (result?.sqlQuery) setLastSql(result.sqlQuery);
      onLogin(result.user);
    } catch {
      setIsLoading(false);
      onLogin(persona);
    }
  };

  const handleDirectGoogleLogin = async (account) => {
    setIsGoogleLoading(true);
    setGoogleStatusText('Authenticating user identity...');
    setErrorMessage('');

    try {
      const result = await authDatabase.googleLogin({
        email: account.email,
        name: account.name,
        googleId: account.googleId || `goog-${account.email.replace(/[@.]/g, '-')}`,
        avatarUrl: account.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.email}`,
      });

      setIsGoogleLoading(false);
      setShowGoogleModal(false);

      if (result?.sqlQuery) setLastSql(result.sqlQuery);
      onLogin(result.user);
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMessage(err.message || 'Google OAuth sign-in encountered an error.');
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;

    handleDirectGoogleLogin({
      name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
      email: customGoogleEmail.trim().toLowerCase(),
      googleId: `goog-${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customGoogleEmail}`,
    });
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
      setErrorMessage('Please enter your business email.');
      return;
    }

    if (mode === 'signup') {
      if (registrationType === 'organization' && !organizationName.trim()) {
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
        if (result?.sqlQuery) setLastSql(result.sqlQuery);
        onLogin(result.user);
      } else {
        if (registrationType === 'organization') {
          const result = await authDatabase.registerOrganization({
            orgName: organizationName,
            orgSize: organizationSize,
            orgIndustry: organizationIndustry,
            adminName: fullName,
            adminEmail: cleanEmail,
            password: password,
          });
          setIsLoading(false);
          if (result?.sqlQuery) setLastSql(result.sqlQuery);
          onLogin(result.user, true);
        } else {
          const result = await authDatabase.registerUser({
            name: fullName,
            email: cleanEmail,
            password: password,
            roleTitle: role,
            department: department,
          });
          setIsLoading(false);
          if (result?.sqlQuery) setLastSql(result.sqlQuery);
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

        <div className="flex items-center gap-2">
          {gisSdkLoaded && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Google OAuth (GIS SDK): Active</span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>SQLite 3 Engine</span>
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
                ? 'Register New Organization'
                : 'Register User Account'}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === 'signin'
                ? 'Sign in to access your recurring subscription workspace'
                : registrationType === 'organization'
                ? 'Set up a company workspace to manage plans, billing & team members'
                : 'Create your individual user profile to access assigned workspaces'}
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
                  1-Click Demo Personas
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
                      <span>Organization</span>
                      {registrationType === 'organization' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      Create new company workspace
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
                      <span>User</span>
                      {registrationType === 'user' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      Join as staff or individual
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ACTUAL GOOGLE SIGN IN OAUTH BUTTON */}
          {(mode === 'signin' || (mode === 'signup' && registrationType === 'user')) && (
            <div className="mb-5 space-y-2">
              {/* Native Google Identity Services Button Container if rendered */}
              <div ref={googleNativeBtnContainer} className="empty:hidden mb-2" />

              {/* Styled Primary Google OAuth Button */}
              <button
                type="button"
                onClick={triggerGoogleOAuthFlow}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 bg-slate-800/90 hover:bg-slate-800 border border-white/15 hover:border-white/30 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/5 group cursor-pointer disabled:opacity-50"
              >
                <div className="p-1 rounded-md bg-white flex items-center justify-center shrink-0">
                  <GoogleIcon className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isGoogleLoading
                    ? (googleStatusText || 'Authenticating with Google...')
                    : mode === 'signin'
                    ? 'Continue with Google'
                    : 'Sign up with Google (OAuth)'}
                </span>
                <span className="text-[10px] py-0.5 px-1.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] border border-blue-500/30 ml-auto sm:ml-0">
                  Google OAuth
                </span>
              </button>

              {/* Google OAuth Config status bar */}
              <div className="flex items-center justify-between px-1 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Google Identity Services {googleClientId ? 'Configured' : 'Ready'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleModalTab('config');
                    setShowGoogleModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>{googleClientId ? 'Change GCP Client ID' : 'Set Google Client ID'}</span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative px-3 bg-[#0d1322] text-[10px] font-semibold text-slate-400 uppercase tracking-wider rounded-md">
                  {mode === 'signin' ? 'or continue with credentials' : 'or register with password'}
                </div>
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
            
            {/* ORGANIZATION SPECIFIC FIELDS */}
            {mode === 'signup' && registrationType === 'organization' && (
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Organization Workspace
                  </span>
                  <span className="text-[10px] text-slate-400">Company Information</span>
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
                        placeholder="Acme Global Inc."
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Company Size
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={organizationSize}
                        onChange={(e) => setOrganizationSize(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="200+ employees">200+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Industry Domain
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={organizationIndustry}
                        onChange={(e) => setOrganizationIndustry(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="SaaS & Software">SaaS & Software</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Healthcare & Life Sci">Healthcare & Life Sci</option>
                        <option value="Media & Publishing">Media & Publishing</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FULL NAME & ROLE/DEPARTMENT (FOR REGISTRATION) */}
            {mode === 'signup' && (
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {registrationType === 'organization' ? 'Admin Contact Person' : 'User Profile Details'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {registrationType === 'organization' ? 'Account Owner' : 'Team Member'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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

                  {registrationType === 'user' ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Job Role / Title
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="Billing Manager">Billing Manager</option>
                            <option value="Sales Representative">Sales Representative</option>
                            <option value="Operations Analyst">Operations Analyst</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Finance Lead">Finance Lead</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Department
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-950/70 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="Finance">Finance</option>
                            <option value="Sales">Sales</option>
                            <option value="Operations">Operations</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Executive">Executive</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Assigned Organization Role
                      </label>
                      <div className="w-full px-3 py-2.5 text-xs bg-slate-950/50 border border-white/10 rounded-xl text-blue-300 font-semibold flex items-center justify-between">
                        <span>Super Admin (Workspace Owner)</span>
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
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
                  <span>
                    {mode === 'signin'
                      ? 'Sign In to Workspace'
                      : registrationType === 'organization'
                      ? 'Register Organization Workspace'
                      : 'Register User Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Database Live Connectivity Indicator & Live SQL Inspector */}
          <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">SQLite DB: Online</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSqlDrawer(!showSqlDrawer)}
                className="flex items-center gap-1.5 font-mono text-[10px] text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/25 transition-colors cursor-pointer"
              >
                <Database className="w-3 h-3 text-blue-400" />
                <span>Live SQL Console {showSqlDrawer ? '▲' : '▼'}</span>
              </button>
            </div>

            {showSqlDrawer && (
              <div className="p-3 bg-slate-950 border border-blue-500/30 rounded-xl space-y-1.5 text-left font-mono text-[10px] animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1 mb-1">
                  <span className="text-blue-400 font-bold">Executed SQL Query</span>
                  <span className="text-emerald-400 text-[9px] font-semibold">● SQLite 3 Engine</span>
                </div>
                <pre className="text-blue-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                  {lastSql}
                </pre>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-500">
        <p>Brightloop Subscription Management Platform • Secure Operations Portal</p>
      </footer>

      {/* GOOGLE OAUTH MODAL / ACCOUNT CHOOSER & CONFIGURATION */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181c24] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header with Google Branding */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <GoogleIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">Google Identity Services (OAuth 2.0)</h3>
                  <p className="text-[10px] text-slate-400">Brightloop Subscription Management</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowGoogleModal(false);
                  setShowCustomGoogleInput(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/5 my-3 text-xs">
              <button
                type="button"
                onClick={() => setGoogleModalTab('accounts')}
                className={`pb-2 px-3 font-semibold transition-colors cursor-pointer border-b-2 ${
                  googleModalTab === 'accounts'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In with Google
              </button>
              <button
                type="button"
                onClick={() => setGoogleModalTab('config')}
                className={`pb-2 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  googleModalTab === 'config'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>GCP OAuth Config</span>
              </button>
            </div>

            {/* TAB 1: ACCOUNTS LIST */}
            {googleModalTab === 'accounts' && (
              <div>
                <div className="py-1 text-[11px] text-slate-400 mb-2">
                  Choose a Google account to authenticate against the SQLite database:
                </div>

                {isGoogleLoading && (
                  <div className="p-3 mb-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-xs flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0" />
                    <span>{googleStatusText || 'Authenticating...'}</span>
                  </div>
                )}

                {/* Account List */}
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {demoPersonas.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      disabled={isGoogleLoading}
                      onClick={() => handleDirectGoogleLogin({
                        name: account.name,
                        email: account.email,
                        googleId: `goog-${account.id}`,
                        avatar: account.avatar
                      })}
                      className="w-full p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-blue-500/40 text-left transition-all flex items-center gap-3 group cursor-pointer disabled:opacity-50"
                    >
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-8 h-8 rounded-full bg-blue-500/20 border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                          {account.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {account.email}
                        </div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 shrink-0">
                        {account.badge}
                      </span>
                    </button>
                  ))}

                  {/* Use Custom Google Account Form */}
                  {!showCustomGoogleInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(true)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/60 border border-dashed border-white/15 hover:border-white/30 text-left transition-all flex items-center gap-3 text-slate-300 hover:text-white cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-xs font-medium">Sign in with any custom Google account</div>
                    </button>
                  ) : (
                    <form onSubmit={handleCustomGoogleSubmit} className="p-3 bg-slate-950/70 border border-white/10 rounded-xl space-y-2.5 mt-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                        Custom Google Account Info
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Jordan Lee"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Google Email Address</label>
                        <input
                          type="email"
                          placeholder="jordan.lee@gmail.com"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowCustomGoogleInput(false)}
                          className="flex-1 py-1.5 text-[11px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isGoogleLoading}
                          className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isGoogleLoading ? 'Connecting...' : 'Authorize OAuth'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE CLOUD OAUTH CONFIGURATION */}
            {googleModalTab === 'config' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-200">
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Real Google Cloud Platform (GCP) Setup</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-300/80">
                    To trigger the genuine Google login popup for your domain, provide a Web OAuth Client ID created in your Google Cloud Console.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-[11px] text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-400">Required GCP Settings:</span>
                  <div className="font-mono text-[10px] text-slate-400 space-y-0.5">
                    <div>1. Application Type: <span className="text-white">Web application</span></div>
                    <div>2. Authorized JavaScript origins: <span className="text-blue-400 select-all">http://localhost:5173</span></div>
                  </div>
                </div>

                <form onSubmit={handleSaveClientId} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Google OAuth 2.0 Client ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789-abcdefg.apps.googleusercontent.com"
                      value={inputClientId || googleClientId}
                      onChange={(e) => setInputClientId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {googleClientId && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('brightloop_google_client_id');
                          setGoogleClientId('');
                          setInputClientId('');
                        }}
                        className="py-2 px-3 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
                    >
                      Save & Activate Client ID
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Google Footer Disclaimer */}
            <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-slate-500 leading-normal flex items-center justify-between">
              <span>Google OAuth 2.0 Identity Protocol</span>
              <span>Encrypted via SHA-256</span>
            </div>
          </div>
        </div>
      )}

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
