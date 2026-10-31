import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  PieChart as PieIcon,
  CreditCard
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function ReportsPage({ invoices, subscriptions, payments }) {
  const [dateRange, setDateRange] = useState('YTD');

  // Computed metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status.toLowerCase() === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status.toLowerCase() === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices
    .filter((inv) => inv.status.toLowerCase() === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Status breakdown data for Pie Chart
  const invoiceBreakdown = [
    { name: 'Paid', value: totalPaid, color: '#10b981' },
    { name: 'Pending', value: totalPending, color: '#f59e0b' },
    { name: 'Overdue', value: totalOverdue, color: '#f43f5e' },
  ];

  // Plan distribution data
  const planDistribution = [
    { name: 'Starter', count: 420, revenue: 20580 },
    { name: 'Growth Monthly', count: 780, revenue: 139620 },
    { name: 'Growth Annual', count: 195, revenue: 29087 },
    { name: 'Enterprise', count: 33, revenue: 16467 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Financial & Operational Reports</h1>
          <p className="text-xs text-slate-500">Aggregate ledger metrics, collection ratios, and billing analytics.</p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <span className="text-slate-400 text-[11px] mr-1">Period:</span>
            {['Last 30 Days', 'Last Quarter', 'YTD', 'All Time'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  dateRange === range
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" icon={Download}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Gross Invoiced</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalInvoiced)}</h3>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all active contracts</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase">Total Settled (Paid)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalPaid)}</h3>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {((totalPaid / (totalInvoiced || 1)) * 100).toFixed(1)}% recovery rate
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-amber-600 uppercase">Pending Invoices</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalPending)}</h3>
          <span className="text-[11px] text-slate-400 mt-1 block">Due in current billing cycle</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-rose-500">
          <p className="text-[11px] font-semibold text-rose-600 uppercase">Total Past Due / Overdue</p>
          <h3 className="text-2xl font-bold text-rose-700 mt-1">{formatCurrency(totalOverdue)}</h3>
          <span className="text-[11px] text-rose-600 mt-1 block font-medium">Flagged for dunning</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Revenue Contribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>MRR by Subscription Plan</CardTitle>
              <CardDescription>Monthly revenue contribution across product tiers</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Collections Status Breakdown */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Invoice Collections Distribution</CardTitle>
              <CardDescription>Status breakdown of generated receivables</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {invoiceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Receivables Ledger Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Overdue Receivables Audit</CardTitle>
            <CardDescription>Accounts flagged for automated email reminders and suspension</CardDescription>
          </div>
          <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-1 rounded-md border border-rose-200">
            {invoices.filter((i) => i.status.toLowerCase() === 'overdue').length} Delinquent Invoices
          </span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium">
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Invoice Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices
                .filter((i) => i.status.toLowerCase() === 'overdue')
                .map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono text-blue-600 font-semibold">{row.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.customer}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(row.invoiceDate)}</td>
                    <td className="px-4 py-3 text-rose-600 font-medium">{formatDate(row.dueDate)}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{row.paymentMethod}</td>
                    <td className="px-4 py-3"><Badge status={row.status} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
