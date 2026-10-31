import React from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Receipt,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function DashboardPage({
  dashboardData,
  subscriptions,
  invoices,
  payments,
  onNavigate,
}) {
  const { kpis, revenueChart, subscriptionGrowth } = dashboardData;

  const overdueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === 'overdue');
  const recentSubscriptions = subscriptions.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner with Dark Mesh Gradient */}
      <div className="relative overflow-hidden bg-linear-to-r from-slate-950 via-indigo-950 to-blue-900 text-white p-7 sm:p-8 rounded-3xl shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Subscription Operations Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Recurring Revenue & Billing Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitor real-time monthly recurring revenue (MRR), track renewals, manage customer invoicing pipelines, and reconcile incoming transactions.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs rounded-xl backdrop-blur-xs cursor-pointer"
              onClick={() => onNavigate('reports')}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Financial Reports
            </Button>
            <Button
              variant="primary"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
              onClick={() => onNavigate('subscriptions')}
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Manage Subscriptions
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Subscriptions"
          value={kpis.activeSubscriptions.value.toLocaleString()}
          change={kpis.activeSubscriptions.change}
          trend={kpis.activeSubscriptions.trend}
          icon={Users}
        />
        <StatsCard
          title="Monthly Revenue (MRR)"
          value={formatCurrency(kpis.totalRevenue.value)}
          change={kpis.totalRevenue.change}
          trend={kpis.totalRevenue.trend}
          icon={DollarSign}
        />
        <StatsCard
          title="Outstanding Receivables"
          value={formatCurrency(kpis.outstandingPayments.value)}
          change={kpis.outstandingPayments.change}
          trend={kpis.outstandingPayments.trend}
          icon={CreditCard}
        />
        <StatsCard
          title="Overdue Invoices"
          value={`${kpis.overdueInvoices.value} invoices`}
          change={`${formatCurrency(kpis.overdueInvoices.amount)}`}
          trend={kpis.overdueInvoices.trend}
          subtitle="requires action"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Monthly Recurring Revenue (MRR)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                MRR progression over the last 7 months
              </CardDescription>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
              +14.2% YoY
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Monthly Revenue']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMrr)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Growth Chart */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Subscription Growth & Retention
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Active customer contracts vs monthly churned
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Active
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Churned
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subscriptionGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2563eb' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="churned"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Invoices Alert Summary */}
      {overdueInvoices.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 bg-linear-to-r from-amber-50/70 to-orange-50/40 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  {overdueInvoices.length} Overdue Invoices Require Immediate Follow-up
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Total past due: <strong className="font-semibold">{formatCurrency(overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0))}</strong> across {overdueInvoices.length} business accounts.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('invoices')}
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
            >
              Review Overdue Invoices <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Subscriptions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
          <CardHeader className="py-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Recent Subscriptions</CardTitle>
              <CardDescription className="text-xs text-slate-500">Latest recurring customer subscriptions</CardDescription>
            </div>
            <button
              onClick={() => onNavigate('subscriptions')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <div className="divide-y divide-slate-100">
            {recentSubscriptions.map((sub) => (
              <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{sub.customer}</span>
                    <Badge status={sub.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {sub.plan} • {sub.billingCycle} • Renew: {formatDate(sub.nextBillingDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{formatCurrency(sub.amount)}</span>
                  <span className="block text-[10px] text-slate-400 font-medium">/{sub.billingCycle.toLowerCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments / Transactions */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
          <CardHeader className="py-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Recent Transactions</CardTitle>
              <CardDescription className="text-xs text-slate-500">Settled and processed payment records</CardDescription>
            </div>
            <button
              onClick={() => onNavigate('payments')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <div className="divide-y divide-slate-100">
            {recentPayments.map((pay) => (
              <div key={pay.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{pay.customer}</span>
                    <Badge status={pay.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {pay.paymentMethod} • Ref: {pay.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 font-mono">+{formatCurrency(pay.amount)}</span>
                  <span className="block text-[10px] text-slate-400">{pay.paymentDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
