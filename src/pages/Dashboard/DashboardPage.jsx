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
  Receipt
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
  BarChart,
  Bar,
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
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-blue-200 border border-blue-400/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Recurring Engine
          </div>
          <h1 className="text-xl font-bold tracking-tight">Brightloop Subscription Workspace</h1>
          <p className="text-xs text-blue-200">
            Welcome back, Hashim. Track recurring MRR/ARR, monitor billing cycles, and manage invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            onClick={() => onNavigate('reports')}
          >
            Financial Reports
          </Button>
          <Button
            variant="primary"
            className="bg-blue-500 hover:bg-blue-400 text-white text-xs"
            onClick={() => onNavigate('subscriptions')}
          >
            Manage Subscriptions
          </Button>
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
          title="Total Revenue (MRR)"
          value={formatCurrency(kpis.totalRevenue.value)}
          change={kpis.totalRevenue.change}
          trend={kpis.totalRevenue.trend}
          icon={DollarSign}
        />
        <StatsCard
          title="Outstanding Payments"
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
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly Recurring Revenue (MRR)</CardTitle>
              <CardDescription>MRR trend over the past 7 months</CardDescription>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +14.2% YoY
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
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
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMrr)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Growth Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Subscription Growth & Retention</CardTitle>
              <CardDescription>Active vs churned subscriptions</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Active
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Churned
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
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2563eb' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="churned"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Invoices Alert Summary */}
      {overdueInvoices.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-amber-900">
                  {overdueInvoices.length} Overdue Invoices Require Immediate Follow-up
                </h4>
                <p className="text-[11px] text-amber-700">
                  Total past due: {formatCurrency(overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0))} across {overdueInvoices.length} clients.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('invoices')}
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-xs"
            >
              Review Overdue Invoices <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* Two Column Section: Recent Subscriptions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Subscriptions</CardTitle>
              <CardDescription>Latest customer subscriptions initiated</CardDescription>
            </div>
            <button
              onClick={() => onNavigate('subscriptions')}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <div className="divide-y divide-slate-100">
            {recentSubscriptions.map((sub) => (
              <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">{sub.customer}</span>
                    <Badge status={sub.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {sub.plan} • {sub.billingCycle} • Renew: {formatDate(sub.nextBillingDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{formatCurrency(sub.amount)}</span>
                  <span className="block text-[10px] text-slate-400">/{sub.billingCycle.toLowerCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments / Transactions */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Settled and attempted billing payments</CardDescription>
            </div>
            <button
              onClick={() => onNavigate('payments')}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <div className="divide-y divide-slate-100">
            {recentPayments.map((pay) => (
              <div key={pay.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">{pay.customer}</span>
                    <Badge status={pay.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {pay.paymentMethod} • Ref: {pay.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{formatCurrency(pay.amount)}</span>
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
