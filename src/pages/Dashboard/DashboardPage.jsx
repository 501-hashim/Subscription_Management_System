import React from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight,
  TrendingUp,
  PlusCircle,
  Receipt,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
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
  payments = [],
  onNavigate,
}) {
  const { kpis, revenueChart } = dashboardData;

  const overdueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === 'overdue');
  const recentSubscriptions = subscriptions.slice(0, 6);
  const pendingInvoices = invoices.filter((inv) => inv.status.toLowerCase() === 'pending');

  return (
    <div className="space-y-6">
      {/* Admin Top Header: Clean, Executive, No Clutter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key subscription metrics, recurring revenue, and items requiring administrative attention.
          </p>
        </div>

        {/* Quick Admin Actions */}
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

      {/* 4 Essential Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(kpis.totalRevenue.value / 10)}
          change={kpis.totalRevenue.change}
          trend="up"
          subtitle="vs last month"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Subscriptions"
          value={kpis.activeSubscriptions.value.toLocaleString()}
          change={kpis.activeSubscriptions.change}
          trend="up"
          subtitle="active contracts"
          icon={Users}
        />
        <StatsCard
          title="Outstanding Receivables"
          value={formatCurrency(kpis.outstandingPayments.value)}
          change={kpis.outstandingPayments.change}
          trend="down"
          subtitle="pending payment"
          icon={CreditCard}
        />
        <StatsCard
          title="Overdue Accounts"
          value={`${overdueInvoices.length} Invoices`}
          change={formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
          trend="alert"
          subtitle="action required"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Grid: 2/3 Revenue & Subscriptions | 1/3 Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): MRR Chart + Recent Subscriptions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Velocity Chart */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">Recurring Revenue Growth (MRR)</CardTitle>
                <CardDescription className="text-xs">Past 7 months subscription billing performance</CardDescription>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                +14.2% YoY
              </span>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminMrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val) => [formatCurrency(val), 'Monthly Revenue']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mrr"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#adminMrrGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Active Subscriptions */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Live Subscription Registry</CardTitle>
                <CardDescription className="text-xs">Latest customer renewals and ongoing contracts</CardDescription>
              </div>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="text-xs text-blue-600 font-medium hover:underline flex items-center"
              >
                View all ({subscriptions.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Customer</th>
                    <th className="py-2.5 px-4 font-semibold">Plan</th>
                    <th className="py-2.5 px-4 font-semibold">Next Renewal</th>
                    <th className="py-2.5 px-4 font-semibold">Amount</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">{sub.customer}</td>
                      <td className="py-3 px-4 text-slate-600">{sub.plan}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(sub.nextBillingDate)}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
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

        {/* Right Column (1 Col wide): Admin Action Center & Health */}
        <div className="space-y-6">
          {/* Action Center: Items Requiring Admin Intervention */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Action Required
                </CardTitle>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  {overdueInvoices.length} Urgent
                </span>
              </div>
              <CardDescription className="text-xs">Overdue invoices and pending billing</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-3">
              {overdueInvoices.length > 0 ? (
                overdueInvoices.slice(0, 3).map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-lg border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{inv.customer}</p>
                      <p className="text-[11px] text-rose-700 font-medium">
                        {inv.id} • Due {formatDate(inv.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatCurrency(inv.amount)}</p>
                      <button
                        onClick={() => onNavigate('invoices')}
                        className="text-[11px] text-blue-600 hover:underline font-medium"
                      >
                        Follow up →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>All invoices are settled. No overdue alerts.</span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between mt-2"
                onClick={() => onNavigate('invoices')}
              >
                <span>View All Invoices ({invoices.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>

          {/* Quick Module Shortcuts for Admin */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Administrative Shortcuts</CardTitle>
              <CardDescription className="text-xs">Quick jump to core platform modules</CardDescription>
            </CardHeader>
            <div className="p-3 space-y-1.5">
              {[
                { label: 'Customers Directory', count: 'Active clients', tab: 'customers', icon: Users },
                { label: 'Pricing & Plans', count: 'Tier definitions', tab: 'plans', icon: Layers },
                { label: 'Payment Settlements', count: 'Gateway logs', tab: 'payments', icon: CreditCard },
                { label: 'Workspace Settings', count: 'RBAC & Profile', tab: 'settings', icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => onNavigate(item.tab)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors text-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800 block group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.count}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </Card>

          {/* System Performance Health Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5">
            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span>Platform Health</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 99.98% SLA
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block">Collection Rate</span>
                <span className="font-bold text-slate-800">97.8%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Churn Rate</span>
                <span className="font-bold text-slate-800">1.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
