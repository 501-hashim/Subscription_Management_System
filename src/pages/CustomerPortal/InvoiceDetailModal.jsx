import React from 'react';
import { X, Download, Printer, CheckCircle2, Clock, AlertTriangle, FileText, Building, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function InvoiceDetailModal({ isOpen, onClose, invoice, onPayNow }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-left">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tax Invoice & Receipt</h3>
                <span className="text-[11px] font-mono text-slate-500">{invoice.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Print Invoice"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="p-6 space-y-6 text-xs text-slate-700">
            
            {/* Top Company & Bill-To header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-base font-extrabold text-blue-700 tracking-tight block">Brightloop Software Inc.</span>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                  100 SaaS Boulevard, Suite 500<br />
                  San Francisco, CA 94107, USA<br />
                  billing@brightloop.io • +1 (800) 555-0199
                </p>
              </div>
              <div className="sm:text-right">
                <Badge status={invoice.status} className="mb-2" />
                <div className="text-slate-500 text-[11px] space-y-0.5">
                  <p><strong>Invoice Date:</strong> {formatDate(invoice.invoiceDate)}</p>
                  <p><strong>Payment Due:</strong> {formatDate(invoice.dueDate)}</p>
                  <p><strong>Payment Method:</strong> {invoice.paymentMethod || 'Credit Card'}</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Billed To
                </span>
                <h4 className="text-sm font-bold text-slate-900">{invoice.customer}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Customer ID: {invoice.customerId}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Total Amount
                </span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-medium text-slate-800">{item.desc}</td>
                      <td className="py-2.5 px-4 text-center text-slate-600">{item.qty}</td>
                      <td className="py-2.5 px-4 text-right text-slate-600">{formatCurrency(item.unit)}</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(item.total)}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-800">Recurring Subscription Service</td>
                      <td className="py-2.5 px-4 text-center text-slate-600">1</td>
                      <td className="py-2.5 px-4 text-right text-slate-600">{formatCurrency(invoice.amount)}</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(invoice.amount)}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total calculations */}
              <div className="bg-slate-50/60 p-4 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.amount * 0.92)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Tax (8%):</span>
                  <span>{formatCurrency(invoice.amount * 0.08)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount Paid / Due:</span>
                  <span className="text-blue-700">{formatCurrency(invoice.amount)}</span>
                </div>
              </div>
            </div>

            {/* Footer Notice & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-slate-400">
                Payment processed securely via Brightloop Billing Infrastructure.
              </p>
              <div className="flex items-center gap-2">
                {invoice.status !== 'Paid' && onPayNow && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onPayNow(invoice.id);
                      onClose();
                    }}
                  >
                    Pay Invoice Now
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
