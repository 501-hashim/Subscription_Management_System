import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight,
  PlusCircle,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  AreaChart,
  Area,
  Bar,
  ComposedChart,
  Line,
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
  onNavigate,
}) {
  const { kpis } = dashboardData;

  // Interactive Graph Controls
  const [activeMetric, setActiveMetric] = useState('mrr'); // 'mrr' | 'arr' | 'newSubscriptions'
  const [timeRange, setTimeRange] = useState('6M'); // '3M' | '6M'

  // Comprehensive 6-month historical & forecast dataset for dynamic switching
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

  // Target Goal Calculation
  const currentMrr = 28450;
  const targetMrr = 35000;
  const progressPercent = Math.min(100, Math.round((currentMrr / targetMrr) * 100));

  // Custom Glassmorphic Tooltip
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Revenue Control</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Zap className="w-3 h-3 text-blue-600 fill-current" />
              SaaS Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monthly revenue velocity, subscription contracts, and cashflow health.
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

      {/* Overdue Invoices Alert Banner (if any) */}
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

      {/* 4 Core KPIs with Micro-Indicators */}
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

      {/* UNIQUE INTERACTIVE REVENUE COMMAND GRAPH */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        {/* Graph Header: Title, Metric Switchers, and Period Selectors */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-b from-slate-50/50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Revenue Trajectory & Billing Velocity
              </CardTitle>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                +14.2% YoY Run Rate
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Interactive revenue telemetry comparing recurring collections, annualized projections, and subscriber velocity.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Switcher: MRR / ARR / Net Subscribers */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
              <button
                onClick={() => setActiveMetric('mrr')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeMetric === 'mrr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MRR ($)
              </button>
              <button
                onClick={() => setActiveMetric('arr')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeMetric === 'arr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ARR ($)
              </button>
              <button
                onClick={() => setActiveMetric('newSubscriptions')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeMetric === 'newSubscriptions'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Subscribers
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
              <button
                onClick={() => setTimeRange('3M')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeRange === '3M'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                3M
              </button>
              <button
                onClick={() => setTimeRange('6M')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
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

        {/* 3 Executive Health Telemetry Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/30 text-xs">
          <div className="p-3.5 px-6">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Average Revenue / Customer (ARPU)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-900">$199.20</span>
              <span className="text-[11px] text-emerald-600 font-semibold">+4.2%</span>
            </div>
          </div>
          <div className="p-3.5 px-6">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Net Revenue Retention (NRR)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-900">108.5%</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Tier 1 SaaS</span>
            </div>
          </div>
          <div className="p-3.5 px-6">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Cash Collection Efficiency
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-900">97.8%</span>
              <span className="text-[11px] text-blue-600 font-semibold">Healthy</span>
            </div>
          </div>
        </div>

        {/* The Visual Chart Canvas with Aurora Gradient */}
        <CardContent className="pt-6 pb-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                <defs>
                  {/* Glowing Aurora Multi-Stop Gradient */}
                  <linearGradient id="auroraRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="60%" stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={500}
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
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
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 3 }}
                  fillOpacity={1}
                  fill="url(#auroraRevenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>

        {/* Milestone Goal Progress Bar */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800">Q4 Target Milestone: $35,000 MRR</span>
              <p className="text-[11px] text-slate-500">
                Currently at <strong className="text-slate-800 font-semibold">{formatCurrency(currentMrr)}</strong> ({progressPercent}% achieved). Need $6,550 to reach target.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-linear-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-right block text-slate-500 mt-1 font-semibold">{progressPercent}% of Goal</span>
          </div>
        </div>
      </Card>

      {/* LIVE SUBSCRIPTION REGISTRY (Streamlined & Visually Polished) */}
      <Card>
        <CardHeader className="flex items-center justify-between">
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
