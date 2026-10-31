import React, { useState } from 'react';
import {
  Zap,
  LogOut,
  Layers,
  Receipt,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  FileText,
  AlertCircle,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerPortal({
  customerUser,
  subscriptions = [],
  invoices = [],
  payments = [],
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'invoices' | 'payments'
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Filter subscriptions and invoices strictly for this customer
  const customerSubs = subscriptions.filter(
    (s) =>
      s.customerId === customerUser.customerId ||
      s.customer?.toLowerCase() === customerUser.company?.toLowerCase() ||
      s.customer?.toLowerCase() === customerUser.name?.toLowerCase()
  );

  const customerInvoices = invoices.filter(
    (inv) =>
      inv.customerId === customerUser.customerId ||
      inv.customer?.toLowerCase() === customerUser.company?.toLowerCase() ||
      inv.customer?.toLowerCase() === customerUser.name?.toLowerCase()
  );

  const customerPayments = payments.filter(
    (p) =>
      p.customer?.toLowerCase() === customerUser.company?.toLowerCase() ||
      p.customer?.toLowerCase() === customerUser.name?.toLowerCase()
  );

  // Financial overview
  const totalMonthlySpend = customerSubs.reduce((acc, sub) => acc + (sub.amount || 0), 0);
  const activeSubsCount = customerSubs.filter((s) => s.status === 'Active').length;
  const pendingInvoices = customerInvoices.filter((i) => i.status !== 'Paid');
  const outstandingAmount = pendingInvoices.reduce((acc, i) => acc + (i.amount || 0), 0);

  const handleSimulateDownload = (invoiceNumber) => {
    setDownloadSuccess(`Invoice ${invoiceNumber} downloaded successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Customer Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-none">Brightloop</h1>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                Customer Self-Service Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Manage your organization's subscriptions & billing</p>
          </div>
        </div>

        {/* Customer Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 text-right">
            <div>
              <p className="text-xs font-semibold text-slate-900">{customerUser.name}</p>
              <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                {customerUser.company || 'Customer Account'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">
              {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Banner with Greeting */}
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-blue-200 text-xs font-medium mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Client Account
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Welcome, {customerUser.name}</h2>
            <p className="text-sm text-blue-100 mt-1 leading-relaxed">
              Review your recurring software subscriptions, monitor renewals, inspect invoices, and track billing history for{' '}
              <strong className="text-white font-semibold">{customerUser.company || 'your organization'}</strong>.
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {downloadSuccess}
            </span>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Subscriptions</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{activeSubsCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Automatic recurring renewal</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Commitment</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totalMonthlySpend)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Billed per active cycle</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Outstanding Invoices</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {formatCurrency(outstandingAmount)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {pendingInvoices.length > 0 ? `${pendingInvoices.length} pending payment` : 'All invoices settled'}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'subscriptions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Subscriptions ({customerSubs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Invoices ({customerInvoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment History ({customerPayments.length})</span>
          </button>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Active Plans & Subscriptions</h3>
                <p className="text-[11px] text-slate-400">Plans currently licensed to {customerUser.company || customerUser.name}</p>
              </div>
            </div>

            {customerSubs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active subscriptions found for this account.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {customerSubs.map((sub) => (
                  <div key={sub.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {sub.id}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-900">{sub.plan}</h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Billing Frequency: <strong className="text-slate-700">{sub.billingCycle}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-base font-bold text-slate-900">
                          {formatCurrency(sub.amount)}
                          <span className="text-xs font-normal text-slate-400"> / {sub.billingCycle?.toLowerCase() || 'cycle'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center sm:justify-end gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          Renews: {formatDate(sub.expiryDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                      <div className="flex items-center gap-4">
                        <span>Started: <strong className="text-slate-700">{formatDate(sub.startDate)}</strong></span>
                        <span>Auto-renew: <strong className="text-emerald-600">Enabled</strong></span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Self-service cancellation available prior to renewal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Your Invoices</h3>
              <p className="text-[11px] text-slate-400">Review detailed statements and download PDF receipts</p>
            </div>

            {customerInvoices.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No invoices found for this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {customerInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{inv.id}</td>
                        <td className="py-3.5 px-4">{formatDate(inv.invoiceDate)}</td>
                        <td className="py-3.5 px-4">{formatDate(inv.dueDate)}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{formatCurrency(inv.amount)}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'Overdue'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleSimulateDownload(inv.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Download invoice receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payments History Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Payment History</h3>
              <p className="text-[11px] text-slate-400">Reconciled payments and card transactions</p>
            </div>

            {customerPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {customerPayments.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Payment for {p.invoiceNumber}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Method: {p.paymentMethod} • Date: {p.paymentDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        +{formatCurrency(p.amount)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default CustomerPortal;
