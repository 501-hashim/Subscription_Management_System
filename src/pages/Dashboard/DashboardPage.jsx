import React from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight,
  PlusCircle,
  Receipt,
  ArrowRight
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
  onNavigate,
}) {
  const { kpis, revenueChart } = dashboardData;

  const overdueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === 'overdue');
  const recentSubscriptions = subscriptions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of active subscriptions, monthly revenue, and receivables.
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Slim Overdue Invoices Alert (Only shows if there are overdue items) */}
      {overdueInvoices.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-amber-900">
              {overdueInvoices.length} overdue invoices totaling{' '}
              <strong className="font-semibold">
                {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
              </strong>
            </span>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-amber-900 font-semibold hover:underline flex items-center gap-1 text-xs"
          >
            <span>Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Core KPIs */}
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
          subtitle="total active"
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
          title="Overdue Invoices"
          value={overdueInvoices.length}
          change={formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
          trend="alert"
          subtitle="past due"
          icon={AlertTriangle}
        />
      </div>

      {/* Revenue Velocity Chart */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-semibold">Monthly Recurring Revenue (MRR)</CardTitle>
            <CardDescription className="text-xs">7-month billing trend</CardDescription>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            +14.2% YoY
          </span>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradientClean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
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
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#mrrGradientClean)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions Registry */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Recent Subscriptions</CardTitle>
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
                <th className="py-2.5 px-4 font-semibold">Renewal Date</th>
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
  );
}

export default DashboardPage;
