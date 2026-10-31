import React, { useState } from 'react';
import { 
  Repeat, Calendar, ShieldCheck, AlertCircle, RefreshCw, 
  ArrowUpRight, PauseCircle, XCircle, CheckCircle2, ChevronRight,
  Zap, CreditCard, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerSubscriptions({
  subscriptions = [],
  currentCustomer,
  onToggleAutoRenew,
  onCancelSubscription,
  onExplorePlans,
}) {
  const [cancelModalSub, setCancelModalSub] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  // Filter subscriptions belonging to current customer
  const customerSubs = subscriptions.filter((sub) => {
    if (!currentCustomer) return true;
    return (
      sub.customerId === currentCustomer.id ||
      sub.customer?.toLowerCase() === currentCustomer.company?.toLowerCase() ||
      sub.customer?.toLowerCase() === currentCustomer.name?.toLowerCase()
    );
  });

  const activeCount = customerSubs.filter((s) => s.status === 'Active').length;
  const totalMonthlySpend = customerSubs
    .filter((s) => s.status === 'Active')
    .reduce((sum, s) => {
      const amt = s.amount || 0;
      return sum + (s.billingCycle === 'Annual' ? amt / 12 : amt);
    }, 0);

  const handleToggle = (subId) => {
    if (onToggleAutoRenew) {
      onToggleAutoRenew(subId);
      setFeedbackNotice(`Auto-renewal preference updated for subscription ${subId}`);
      setTimeout(() => setFeedbackNotice(''), 3000);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelModalSub && onCancelSubscription) {
      onCancelSubscription(cancelModalSub.id);
      setFeedbackNotice(`Subscription ${cancelModalSub.id} has been cancelled.`);
      setCancelModalSub(null);
      setTimeout(() => setFeedbackNotice(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
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

      {/* Account Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">All systems operational</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Recurring Cost</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(totalMonthlySpend)}</p>
          <span className="text-[11px] text-slate-400">Effective monthly run-rate</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Subscriber Identity</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2 truncate">
            {currentCustomer?.company || currentCustomer?.name || 'Verified Customer'}
          </p>
          <span className="text-[11px] font-mono text-slate-400">{currentCustomer?.id || 'ID: CUST-DEFAULT'}</span>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Subscription Contracts</h3>
            <p className="text-xs text-slate-500">Manage billing cadence, renewal rules, and plan modifications.</p>
          </div>
          <Button variant="primary" size="sm" onClick={onExplorePlans}>
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Add New Service
          </Button>
        </div>

        {customerSubs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
            <Repeat className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No active subscriptions found for this account</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Explore the product catalog to activate your first SaaS plan or custom add-on module.
            </p>
            <Button variant="primary" size="sm" onClick={onExplorePlans} className="mt-2">
              Browse Available Plans
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {customerSubs.map((sub) => {
              const isCancelled = sub.status === 'Cancelled' || sub.status === 'Expired';
              return (
                <div
                  key={sub.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                    isCancelled ? 'border-slate-200 opacity-60 bg-slate-50/50' : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    
                    {/* Left: Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {sub.id}
                        </span>
                        <Badge status={sub.status} />
                        {sub.autoRenew && !isCancelled && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <RefreshCw className="w-3 h-3 animate-spin-slow" /> Auto-Renew Enabled
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-bold text-slate-900">{sub.plan}</h4>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Started: <strong>{formatDate(sub.startDate)}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Next Renewal: <strong className="text-slate-800">{formatDate(sub.expiryDate || sub.nextBillingDate)}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Cycle: <strong className="text-slate-800">{sub.billingCycle}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Recurring Price */}
                    <div className="text-left lg:text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Recurring Charge
                      </span>
                      <span className="text-2xl font-black text-slate-900">
                        {formatCurrency(sub.amount)}
                      </span>
                      <span className="text-xs text-slate-500 block">/{sub.billingCycle.toLowerCase()}</span>
                    </div>

                    {/* Right: Actions */}
                    {!isCancelled && (
                      <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5">
                        <Button
                          variant={sub.autoRenew ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggle(sub.id)}
                          className="text-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1" />
                          {sub.autoRenew ? 'Turn Off Auto-Renew' : 'Turn On Auto-Renew'}
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={onExplorePlans}
                            className="flex-1 text-xs text-blue-600 hover:text-blue-700"
                          >
                            Upgrade Tier
                          </Button>
                          <button
                            onClick={() => setCancelModalSub(sub)}
                            className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelModalSub}
        onClose={() => setCancelModalSub(null)}
        title="Cancel Subscription Contract?"
        description="Please confirm if you want to deactivate your recurring subscription."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Service Access Warning</p>
              <p className="mt-0.5 text-rose-700">
                Cancelling will disable auto-renewal for <strong>{cancelModalSub?.plan}</strong> ({cancelModalSub?.id}).
                Your service will remain active until the end of the current billing cycle on <strong>{formatDate(cancelModalSub?.expiryDate)}</strong>.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setCancelModalSub(null)}>
              Keep Subscription
            </Button>
            <Button variant="danger" onClick={handleConfirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
