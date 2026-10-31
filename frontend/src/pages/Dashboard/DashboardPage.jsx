import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight, 
  PlusCircle, 
  Receipt, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Zap, 
  Calendar, 
  GitBranch, 
  Network, 
  Package, 
  Flame, 
  Award, 
  CheckCircle2,
  Globe,
  Radio,
  RefreshCw,
  Server,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Building,
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { isAuthorizedForDashboard } from '../../utils/authPermissions';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function DashboardPage({
  dashboardData,
  subscriptions = [],
  invoices = [],
  currentUser,
  companySettings = {},
  onNavigate,
}) {
  const isAuthorized = isAuthorizedForDashboard(currentUser);
  const { kpis } = dashboardData;

  // Interactive Graph Controls
  const [activeMetric, setActiveMetric] = useState('mrr'); // 'mrr' | 'arr' | 'newSubscriptions'
  const [timeRange, setTimeRange] = useState('6M'); // '3M' | '6M'
  const [hoveredBox, setHoveredBox] = useState(null);

  // 6-month historical & forecast dataset
  const chartDatasets = {
    '6M': [
      { month: 'Feb', mrr: 19800, arr: 237600, newSubscriptions: 51, growth: '+7.6%' },
      { month: 'Mar', mrr: 21500, arr: 258000, newSubscriptions: 63, growth: '+8.5%' },
      { month: 'Apr', mrr: 22900, arr: 274800, newSubscriptions: 58, growth: '+6.5%' },
      { month: 'May', mrr: 24700, arr: 296400, newSubscriptions: 74, growth: '+7.8%' },
      { month: 'Jun', mrr: 26200, arr: 314400, newSubscriptions: 82, growth: '+6.1%' },
      { month: 'Jul', mrr: 28450, arr: 341400, newSubscriptions: 95, growth: '+8.6%' },
    ],
    '3M': [
      { month: 'May', mrr: 24700, arr: 296400, newSubscriptions: 74, growth: '+7.8%' },
      { month: 'Jun', mrr: 26200, arr: 314400, newSubscriptions: 82, growth: '+6.1%' },
      { month: 'Jul', mrr: 28450, arr: 341400, newSubscriptions: 95, growth: '+8.6%' },
    ],
  };

  const currentChartData = chartDatasets[timeRange];
  const overdueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === 'overdue');
  const recentSubscriptions = subscriptions.slice(0, 3);

  const currentMrr = 28450;
  const targetMrr = 35000;
  const progressPercent = Math.min(100, Math.round((currentMrr / targetMrr) * 100));

  // Vertical Box Dendrogram Data
  const verticalBoxDendro = [
    {
      id: 'box-core',
      rank: '#1 Best Seller',
      name: 'CRM Software',
      code: 'BL-CRM',
      category: 'Customer CRM Suite',
      shareNum: 65,
      share: '65%',
      sales: 18492,
      units: '780 active',
      growth: '+14.2% YoY',
      color: '#2563eb', // blue
      bgGlow: 'bg-blue-600',
      borderColor: 'border-blue-500',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      status: 'Top Revenue Generator',
      metricPill: 'Core CRM',
    },
    {
      id: 'box-anly',
      rank: '#2 High Velocity',
      name: 'Accounting Software',
      code: 'BL-ACCT',
      category: 'Financial Ledger',
      shareNum: 20,
      share: '20%',
      sales: 5690,
      units: '420 active',
      growth: '+24.8% YoY',
      color: '#8b5cf6', // purple
      bgGlow: 'bg-purple-600',
      borderColor: 'border-purple-500',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      status: 'Fastest MoM Growth',
      metricPill: 'High Margin',
    },
    {
      id: 'box-gate',
      rank: '#3 Retention',
      name: 'Cloud Storage',
      code: 'BL-STOR',
      category: 'Encrypted Cloud VPC',
      shareNum: 15,
      share: '15%',
      sales: 4268,
      units: '33 scale',
      growth: '+18.5% YoY',
      color: '#06b6d4', // cyan
      bgGlow: 'bg-cyan-500',
      borderColor: 'border-cyan-500',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      status: '99.9% Retention SLA',
      metricPill: 'Cloud Storage',
    },
  ];

  // Tooltip for Revenue Graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-white min-w-[170px] animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-xs text-slate-200">{label} 2025</span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {data.growth}
            </span>
          </div>
          <div className="space-y-1.5 pt-2 text-xs">
            {activeMetric === 'mrr' && (
              <div>
                <span className="text-slate-400 block text-[10px]">Monthly Recurring (MRR)</span>
                <span className="font-extrabold text-base text-blue-400">{formatCurrency(data.mrr)}</span>
              </div>
            )}
            {activeMetric === 'arr' && (
              <div>
                <span className="text-slate-400 block text-[10px]">Annual Run Rate (ARR)</span>
                <span className="font-extrabold text-base text-indigo-400">{formatCurrency(data.arr)}</span>
              </div>
            )}
            {activeMetric === 'newSubscriptions' && (
              <div>
                <span className="text-slate-400 block text-[10px]">New Contracts Added</span>
                <span className="font-extrabold text-base text-emerald-400">+{data.newSubscriptions} accounts</span>
              </div>
            )}
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              Annualized: {formatCurrency(data.mrr * 12)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Access Control Guard: Dashboard is strictly restricted to Admin or Organization accounts
  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-600 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100/80 text-amber-900 border border-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              Restricted Dashboard Clearance
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-3">Admin or Organization Only</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This operational executive dashboard, revenue velocity telemetry, and product sales dendrogram are reserved for <strong>System Administrators</strong> and verified <strong>Organization accounts</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Account:</span>
              <span className="font-semibold text-slate-800">{currentUser?.name || 'Standard Account'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Role:</span>
              <span className="font-semibold text-rose-600">{currentUser?.role || 'User / Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Access Status:</span>
              <span className="font-semibold text-amber-600">Restricted (Non-Org)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => onNavigate('products')}>
              Browse Products
            </Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate('invoices')}>
              View Invoices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization & Admin Access Active Clearance Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 px-4 rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                {currentUser?.organization
                  ? `Organization Workspace: ${currentUser.organization}`
                  : 'Enterprise Admin & Organization Workspace'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> Authorized
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Restricted executive view: MRR/ARR velocity telemetry, financial forecasts & product sales dendrogram
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Active Persona:</span>
          <span className="font-bold text-blue-400 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px]">
            {currentUser?.role?.includes('Admin') ? '🛡️ Admin Role' : '🏢 Organization'}
          </span>
        </div>
      </div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Zap className="w-3 h-3 text-blue-600 fill-current" />
              SaaS Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dendrogram product sales clustering, global geographic telemetry, and recurring revenue velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('invoices')}
            className="text-xs"
          >
            <Receipt className="w-3.5 h-3.5 mr-1 text-slate-500" />
            + New Invoice
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('subscriptions')}
            className="text-xs shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            + New Subscription
          </Button>
        </div>
      </div>

      {/* Overdue Invoices Alert Banner */}
      {overdueInvoices.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-amber-900">
              {overdueInvoices.length} past-due invoice totaling{' '}
              <strong className="font-bold">
                {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
              </strong>{' '}
              requires follow-up.
            </span>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-amber-900 font-bold hover:underline flex items-center gap-1 text-xs"
          >
            <span>Review Overdue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Recurring (MRR)"
          value={formatCurrency(currentMrr)}
          change="+8.6%"
          trend="up"
          subtitle="vs last month"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Subscriptions"
          value={kpis.activeSubscriptions.value.toLocaleString()}
          change="+12.4%"
          trend="up"
          subtitle="active contracts"
          icon={Users}
        />
        <StatsCard
          title="Outstanding Receivables"
          value={formatCurrency(kpis.outstandingPayments.value)}
          change="-4.1%"
          trend="down"
          subtitle="pending payment"
          icon={CreditCard}
        />
        <StatsCard
          title="Overdue Invoices"
          value={overdueInvoices.length}
          change={formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
          trend="alert"
          subtitle="past due"
          icon={AlertTriangle}
        />
      </div>

      {/* SPLIT SECTION: LEFT = VERTICAL BOX DENDROGRAM | RIGHT = REVENUE GRAPH */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (6 of 12): VERTICAL BOX DENDROGRAM */}
        <Card className="xl:col-span-6 border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
          <CardHeader className="p-4 pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-600" />
                Product Sales Dendrogram (Vertical Box Tree)
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-500">
                Top-down hierarchical box tree showing product sales contribution
              </CardDescription>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Vertical Hierarchy
            </span>
          </CardHeader>

          <CardContent className="p-4 flex-1 space-y-3">
            {/* 1. TOP ROOT BOX: Catalog Total */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/40 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-400/30">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-blue-300 block">
                      Catalog Root Node
                    </span>
                    <h3 className="font-black text-sm text-white">
                      Total Monthly Sales: {formatCurrency(currentMrr)}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  100% Volume
                </span>
              </div>
            </div>

            {/* 2. DENDROGRAM BRANCHING CONNECTOR SVG */}
            <div className="relative h-9 w-full flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 36">
                {/* Central vertical stem from root */}
                <line x1="150" y1="0" x2="150" y2="18" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Horizontal branching rail */}
                <line x1="50" y1="18" x2="250" y2="18" stroke="#cbd5e1" strokeWidth="2" />

                {/* 3 Downward branch connectors into the 3 vertical boxes */}
                <line 
                  x1="50" y1="18" x2="50" y2="36" 
                  stroke={hoveredBox === 'box-core' ? '#2563eb' : '#cbd5e1'} 
                  strokeWidth={hoveredBox === 'box-core' ? '2.5' : '2'} 
                />
                <circle cx="50" cy="36" r="3" fill="#2563eb" />

                <line 
                  x1="150" y1="18" x2="150" y2="36" 
                  stroke={hoveredBox === 'box-anly' ? '#8b5cf6' : '#cbd5e1'} 
                  strokeWidth={hoveredBox === 'box-anly' ? '2.5' : '2'} 
                />
                <circle cx="150" cy="36" r="3" fill="#8b5cf6" />

                <line 
                  x1="250" y1="18" x2="250" y2="36" 
                  stroke={hoveredBox === 'box-gate' ? '#06b6d4' : '#cbd5e1'} 
                  strokeWidth={hoveredBox === 'box-gate' ? '2.5' : '2'} 
                />
                <circle cx="250" cy="36" r="3" fill="#06b6d4" />
              </svg>
            </div>

            {/* 3. 3 VERTICAL BOXES (PILLARS) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {verticalBoxDendro.map((box) => {
                const isHovered = hoveredBox === box.id;

                return (
                  <div
                    key={box.id}
                    onMouseEnter={() => setHoveredBox(box.id)}
                    onMouseLeave={() => setHoveredBox(null)}
                    className={`relative rounded-xl border p-3.5 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isHovered
                        ? `bg-white shadow-lg -translate-y-1 ring-2 ring-offset-1 ${box.borderColor}`
                        : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                    style={{ minHeight: '275px' }}
                  >
                    {/* Top Rank Badge */}
                    <div className="space-y-1 mb-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border ${box.badgeColor}`}>
                        {box.rank}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {box.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {box.code} • {box.category}
                      </span>
                    </div>

                    {/* Sales Value Callout */}
                    <div className="my-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">Monthly Sales</span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        {formatCurrency(box.sales)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 block">
                        {box.growth}
                      </span>
                    </div>

                    {/* Vertical Volume Gauge Bar */}
                    <div className="my-2">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500 font-medium">Catalog Share</span>
                        <span className="font-extrabold text-slate-900">{box.share}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${box.shareNum}%`,
                            backgroundColor: box.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Bottom Status & Units */}
                    <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Contracts</span>
                        <span className="font-semibold text-slate-700">{box.units}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{box.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dendrogram Summary Footnote */}
            <div className="p-2.5 px-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>CRM Software</strong> anchors <strong>65% of sales</strong>, while Accounting Software drives <strong>+24.8% growth</strong>.
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                Active Catalog
              </span>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN (6 of 12): REVENUE VELOCITY GRAPH (SHIFTED RIGHT) */}
        <Card className="xl:col-span-6 border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
          {/* Graph Header: Title, Metric Switchers, and Period Selectors */}
          <div className="p-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-b from-slate-50/50 to-white">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Recurring Revenue Velocity
                </CardTitle>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  +14.2% YoY
                </span>
              </div>
              <CardDescription className="text-[11px] text-slate-500 mt-0.5">
                Monthly revenue trajectory & subscriber velocity
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Metric Switcher */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                <button
                  onClick={() => setActiveMetric('mrr')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeMetric === 'mrr'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MRR
                </button>
                <button
                  onClick={() => setActiveMetric('arr')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeMetric === 'arr'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ARR
                </button>
                <button
                  onClick={() => setActiveMetric('newSubscriptions')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeMetric === 'newSubscriptions'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Volume
                </button>
              </div>

              {/* Time Range Selector */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                <button
                  onClick={() => setTimeRange('3M')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                    timeRange === '3M'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3M
                </button>
                <button
                  onClick={() => setTimeRange('6M')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                    timeRange === '6M'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  6M
                </button>
              </div>
            </div>
          </div>

          {/* 3 Telemetry Metrics */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/30 text-xs">
            <div className="p-2.5 px-4">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                ARPU (Avg / User)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">$199.20</span>
                <span className="text-[10px] text-emerald-600 font-bold">+4.2%</span>
              </div>
            </div>
            <div className="p-2.5 px-4">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Net Retention (NRR)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">108.5%</span>
                <span className="text-[10px] text-emerald-600 font-bold">Tier 1</span>
              </div>
            </div>
            <div className="p-2.5 px-4">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Collection Rate
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">97.8%</span>
                <span className="text-[10px] text-blue-600 font-bold">Healthy</span>
              </div>
            </div>
          </div>

          {/* The Visual Chart Canvas */}
          <CardContent className="pt-4 pb-2 flex-1 min-h-[260px]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="auroraRevenueGradient4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="60%" stopColor="#6366f1" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    fontWeight={500}
                    tickLine={false} 
                    axisLine={{ stroke: '#e2e8f0' }} 
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => 
                      activeMetric === 'newSubscriptions' ? `${val}` : `$${val >= 1000 ? `${val / 1000}k` : val}`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 5, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 2 }}
                    fillOpacity={1}
                    fill="url(#auroraRevenueGradient4)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          {/* Milestone Goal Progress Bar */}
          <div className="p-3 px-5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800 text-[11px]">
                Q4 Target: $35,000 MRR ({progressPercent}% achieved)
              </span>
            </div>
            <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-linear-to-r from-blue-600 to-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* LIVE SUBSCRIPTION REGISTRY */}
      <Card>
        <CardHeader className="flex items-center justify-between p-4 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-slate-900">Active Subscription Contracts</CardTitle>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {subscriptions.length} Live
              </span>
            </div>
            <CardDescription className="text-xs">
              Live recurring contracts, automated billing cadence, and renewal schedules.
            </CardDescription>
          </div>
          <button
            onClick={() => onNavigate('subscriptions')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Manage All Contracts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Subscriber / Account</th>
                <th className="py-2.5 px-4 font-semibold">Tier Plan</th>
                <th className="py-2.5 px-4 font-semibold">Billing Schedule</th>
                <th className="py-2.5 px-4 font-semibold">Contract Value</th>
                <th className="py-2.5 px-4 font-semibold text-right">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.customer.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{sub.customer}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{sub.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Renews {formatDate(sub.nextBillingDate)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {formatCurrency(sub.amount)}
                    <span className="text-[10px] font-normal text-slate-400">/{sub.billingCycle.toLowerCase()}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge status={sub.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
