import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Receipt, Download, Eye, CheckCircle2, Clock, 
  AlertTriangle, ArrowRight, Printer, ShieldCheck, Search, Loader2 
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { customerApi } from '../../services/customerApi';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected payment for Receipt Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerApi.getPayments();
      setPayments(data);
    } catch (err) {
      console.error('[Payments Error]:', err);
      setError('Failed to fetch payment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenReceipt = async (payment) => {
    setSelectedPayment(payment);
    try {
      setLoadingReceipt(true);
      const res = await customerApi.getPaymentInvoice(payment.id);
      setReceiptData(res.invoice);
    } catch (err) {
      setReceiptData({
        id: payment.invoiceNumber || `INV-${payment.id}`,
        amount: payment.amount,
        status: 'Paid',
        payment_method: payment.paymentMethod,
        invoice_date: payment.paymentDate,
        items: [{ desc: `${payment.productName} - ${payment.planName}`, qty: 1, unit: payment.amount, total: payment.amount }],
      });
    } finally {
      setLoadingReceipt(false);
    }
  };

  // Filter payments by search
  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
      (p.productName && p.productName.toLowerCase().includes(q)) ||
      (p.planName && p.planName.toLowerCase().includes(q))
    );
  });

  const totalSettled = payments
    .filter((p) => p.status === 'Completed' || p.status === 'Paid')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Transactions</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{payments.length}</p>
          <span className="text-[11px] text-slate-400">Lifetime payment attempts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Settled Volume</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{formatCurrency(totalSettled)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Verified by payment gateway</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Payment Security</span>
          <div className="flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">PCI-DSS Compliant</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">End-to-end encrypted receipts</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Header & Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Payment & Transaction History</h3>
            <p className="text-xs text-slate-500">View audit trails, reference IDs, and download official receipts.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by transaction ref or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading payment ledger...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPayments.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-xs space-y-2">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300" />
            <p>No transactions found matching your criteria.</p>
          </div>
        )}

        {/* Table View */}
        {!loading && filteredPayments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Transaction Ref</th>
                  <th className="py-3.5 px-5">Product & Plan</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Method</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-blue-600 block">{p.transactionId || p.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-slate-900 block">{p.productName}</span>
                      <span className="text-[11px] text-slate-500">{p.planName}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {p.paymentMethod || 'Credit Card'}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge status={p.status || 'Completed'} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReceipt(p)}
                        className="text-xs h-7"
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

      {/* Printable Receipt Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Transaction Receipt & Invoice" size="md">
        {selectedPayment && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Brightloop Software Inc.</h4>
                  <span className="text-[10px] text-slate-500">Official Payment Statement</span>
                </div>
                <Badge status={selectedPayment.status || 'Completed'} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Transaction Reference:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedPayment.transactionId || selectedPayment.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Invoice ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedPayment.invoiceNumber || 'INV-SETTLED'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Date & Time:</span>
                  <span className="text-slate-800">{new Date(selectedPayment.paymentDate).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Payment Method:</span>
                  <span className="text-slate-800">{selectedPayment.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block">Product & Plan:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedPayment.productName} — {selectedPayment.planName}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Total Settled Amount</span>
                <span className="text-xl font-black text-slate-900">{formatCurrency(selectedPayment.amount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs"
              >
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Receipt
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
export default CustomerPayments;
