import React, { useState } from 'react';
import { 
  Receipt, Download, Eye, CheckCircle2, Clock, AlertTriangle, 
  CreditCard, FileText, ArrowRight, DollarSign 
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerInvoices({
  invoices = [],
  currentCustomer,
  onPayInvoice,
}) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  // Filter invoices for current customer
  const customerInvoices = invoices.filter((inv) => {
    if (!currentCustomer) return true;
    return (
      inv.customerId === currentCustomer.id ||
      inv.customer?.toLowerCase() === currentCustomer.company?.toLowerCase() ||
      inv.customer?.toLowerCase() === currentCustomer.name?.toLowerCase()
    );
  });

  const totalPaid = customerInvoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalPending = customerInvoices
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const handlePay = (invId) => {
    if (onPayInvoice) {
      onPayInvoice(invId);
      setFeedbackNotice(`Invoice ${invId} marked as successfully paid!`);
      setTimeout(() => setFeedbackNotice(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Feedback banner */}
      {feedbackNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackNotice}</span>
          </div>
          <button onClick={() => setFeedbackNotice('')} className="text-emerald-600 hover:text-emerald-900 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Billed Invoices</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{customerInvoices.length}</p>
          <span className="text-[11px] text-slate-400">Lifetime invoice statements</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Settled Payments</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{formatCurrency(totalPaid)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Successfully processed</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Outstanding Balance</span>
          <p className={`text-2xl font-black mt-2 ${totalPending > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {formatCurrency(totalPending)}
          </p>
          <span className="text-[11px] text-slate-400">
            {totalPending > 0 ? 'Pending payment settlement' : 'Account in good standing'}
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Billing History & Receipts</h3>
            <p className="text-xs text-slate-500">View, download, or settle all recurring cycle invoices.</p>
          </div>
        </div>

        {customerInvoices.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            No billing records found for this account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">Invoice Reference</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Due Date</th>
                  <th className="py-3 px-5">Payment Method</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-blue-600">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {formatDate(inv.invoiceDate)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {inv.paymentMethod || 'Credit Card'}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900 text-sm">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      {inv.status !== 'Paid' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePay(inv.id)}
                          className="h-7 text-xs"
                        >
                          Pay Now
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedInvoice(inv)}
                        className="h-7 text-xs text-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        onPayNow={handlePay}
      />

    </div>
  );
}
