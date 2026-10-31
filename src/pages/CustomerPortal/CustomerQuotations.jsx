import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerQuotations({
  quotations = [],
  currentCustomer,
  onAcceptQuotation,
}) {
  const [feedbackNotice, setFeedbackNotice] = useState('');

  // Filter quotations for current customer
  const customerQuotes = quotations.filter((q) => {
    if (!currentCustomer) return true;
    return (
      q.customerId === currentCustomer.id ||
      q.customer?.toLowerCase() === currentCustomer.company?.toLowerCase() ||
      q.customer?.toLowerCase() === currentCustomer.name?.toLowerCase()
    );
  });

  const handleAccept = (quoteId) => {
    if (onAcceptQuotation) {
      onAcceptQuotation(quoteId);
      setFeedbackNotice(`Proposal ${quoteId} accepted! Subscription created and activated.`);
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

      <div>
        <h3 className="text-base font-bold text-slate-900">Commercial Quotations & Custom Proposals</h3>
        <p className="text-xs text-slate-500">
          Review tailored subscription packages prepared by your Brightloop account executive.
        </p>
      </div>

      {customerQuotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-xs text-slate-400">
          <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          No custom quotations are currently pending for this account.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {customerQuotes.map((quote) => {
            const isSent = quote.status === 'Sent';
            const isAccepted = quote.status === 'Accepted';

            return (
              <div
                key={quote.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-xs ${
                  isSent ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {quote.id}
                      </span>
                      <Badge status={quote.status} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{quote.products}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Created: {formatDate(quote.createdAt)}</span>
                      <span>•</span>
                      <span>Valid Until: <strong className="text-slate-800">{formatDate(quote.validityDate)}</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Quoted Price
                      </span>
                      <span className="text-xl font-black text-slate-900">
                        {formatCurrency(quote.totalAmount)}
                      </span>
                    </div>

                    {isSent && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAccept(quote.id)}
                        className="font-bold whitespace-nowrap"
                      >
                        Accept & Activate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    )}

                    {isAccepted && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Activated in Account
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
