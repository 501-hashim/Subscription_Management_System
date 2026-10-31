import React, { useState, useEffect } from 'react';
import { 
  Repeat, Calendar, ShieldCheck, AlertCircle, RefreshCw, 
  ArrowUpRight, PauseCircle, XCircle, CheckCircle2, ChevronRight,
  Zap, CreditCard, Sparkles, Clock, AlertTriangle, Eye, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { customerApi } from '../../services/customerApi';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerSubscriptions({
  onExplorePlans,
}) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState('');

  // Modals state
  const [selectedSub, setSelectedSub] = useState(null);
  const [renewModalSub, setRenewModalSub] = useState(null);
  const [cancelModalSub, setCancelModalSub] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch subscriptions from backend
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerApi.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error('[Subscriptions Error]:', err);
      setError('Failed to fetch subscriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // 1. Toggle Auto-Renew
  const handleToggleAutoRenew = async (sub) => {
    try {
      const updated = await customerApi.toggleAutoRenew(sub.id, !sub.autoRenew);
      setFeedbackNotice(`Auto-renewal preference for ${sub.planName} updated to: ${!sub.autoRenew ? 'ENABLED' : 'DISABLED'}`);
      fetchSubscriptions();
      setTimeout(() => setFeedbackNotice(''), 4000);
    } catch (err) {
      alert(`Failed to update auto-renewal: ${err.message}`);
    }
  };

  // 2. Confirm Manual Renewal
  const handleConfirmRenew = async () => {
    if (!renewModalSub) return;
    try {
      setProcessingAction(true);
      const res = await customerApi.renewSubscription(renewModalSub.id);
      setFeedbackNotice(`Subscription ${renewModalSub.id} successfully renewed until ${formatDate(res.data?.subscription?.expiry_date || '')}!`);
      setRenewModalSub(null);
      fetchSubscriptions();
      setTimeout(() => setFeedbackNotice(''), 5000);
    } catch (err) {
      alert(`Renewal failed: ${err.message}`);
    } finally {
      setProcessingAction(false);
    }
  };

  // 3. Confirm Cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModalSub) return;
    try {
      setProcessingAction(true);
      await customerApi.cancelSubscription(cancelModalSub.id);
      setFeedbackNotice(`Subscription ${cancelModalSub.id} has been cancelled.`);
      setCancelModalSub(null);
      fetchSubscriptions();
      setTimeout(() => setFeedbackNotice(''), 4000);
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    } finally {
      setProcessingAction(false);
    }
  };

  const activeCount = subscriptions.filter((s) => s.status === 'Active' || s.status === 'Expiring Soon').length;
  const expiringSoonCount = subscriptions.filter((s) => s.status === 'Expiring Soon').length;
  const totalMonthlySpend = subscriptions
    .filter((s) => s.status === 'Active' || s.status === 'Expiring Soon')
    .reduce((sum, s) => {
      const amt = s.amount || 0;
      return sum + (s.billingCycle === 'Annual' ? amt / 12 : amt);
    }, 0);

  return (
    <div className="space-y-6">
      
      {/* Feedback Banner */}
      {feedbackNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
          <button onClick={() => setFeedbackNotice('')} className="text-emerald-700 hover:text-emerald-900 font-bold text-sm">
            ×
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Active Plans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">All active service contracts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Run-rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(totalMonthlySpend)}</p>
          <span className="text-[11px] text-slate-400">Effective monthly recurring cost</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Renewal Attention</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${expiringSoonCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {expiringSoonCount} Expiring Soon
          </p>
          <span className="text-[11px] text-slate-400">
            {expiringSoonCount > 0 ? 'Manual renewal suggested' : 'All subscriptions healthy'}
          </span>
        </div>
      </div>

      {/* Main Subscriptions Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">My Subscription Contracts</h3>
          <p className="text-xs text-slate-500">Manage billing cadence, auto-renew preferences, and renewal cycles.</p>
        </div>
        <Button variant="primary" size="sm" onClick={onExplorePlans}>
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Add New Service
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading your subscription contracts...</p>
        </div>
      )}

      {/* Subscriptions List */}
      {!loading && subscriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <Repeat className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">No subscriptions found for your account</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose a solution from the product catalog to activate your first recurring software subscription.
          </p>
          <Button variant="primary" size="sm" onClick={onExplorePlans} className="mt-2">
            Explore Product Catalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subscriptions.map((sub) => {
            const isCancelled = sub.status === 'Cancelled' || sub.status === 'Expired';
            const isExpiringSoon = sub.status === 'Expiring Soon';

            return (
              <div
                key={sub.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-xs ${
                  isExpiringSoon
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : isCancelled
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  
                  {/* Left: Product & Plan Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {sub.id}
                      </span>
                      <Badge status={sub.status} />
                      <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                        sub.autoRenew ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        <RefreshCw className="w-3 h-3" />
                        {sub.autoRenew ? 'Auto-Renewal Enabled' : 'Auto-Renewal Off'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{sub.productName || sub.planName}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Plan: <strong className="text-slate-800">{sub.planName}</strong></span>
                      <span>•</span>
                      <span>Started: {formatDate(sub.startDate)}</span>
                      <span>•</span>
                      <span>Expires: <strong className={isExpiringSoon ? 'text-amber-700 font-bold' : 'text-slate-800'}>{formatDate(sub.expiryDate)}</strong></span>
                      <span>•</span>
                      <span className="font-semibold text-blue-600">
                        {sub.remainingDays > 0 ? `${sub.remainingDays} days remaining` : 'Expired'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Pricing & Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xl font-black text-slate-900 block">
                        {formatCurrency(sub.amount)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        Billed {sub.billingCycle}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* View Details */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedSub(sub)}
                        className="text-xs text-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Details
                      </Button>

                      {/* Auto-renew Toggle */}
                      {!isCancelled && (
                        <button
                          onClick={() => handleToggleAutoRenew(sub)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            sub.autoRenew
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Toggle automatic recurring renewals"
                        >
                          Auto-Renew: {sub.autoRenew ? 'ON' : 'OFF'}
                        </button>
                      )}

                      {/* Renew Button */}
                      {!isCancelled && (
                        <Button
                          variant={isExpiringSoon ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setRenewModalSub(sub)}
                          className="text-xs font-bold"
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Renew Now
                        </Button>
                      )}

                      {/* Cancel Button */}
                      {!isCancelled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelModalSub(sub)}
                          className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscription Details Modal */}
      <Modal isOpen={!!selectedSub} onClose={() => setSelectedSub(null)} title="Subscription Contract Details" size="md">
        {selectedSub && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Contract ID</span>
                <span className="font-mono font-bold text-slate-800">{selectedSub.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Current Status</span>
                <Badge status={selectedSub.status} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Product Name</span>
                <span className="font-bold text-slate-900">{selectedSub.productName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Enrolled Plan</span>
                <span className="font-medium text-slate-800">{selectedSub.planName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cycle Amount</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedSub.amount)} / {selectedSub.billingCycle}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Remaining Days</span>
                <span className="font-bold text-blue-600">{selectedSub.remainingDays} days</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Activation Date</span>
                <span className="text-slate-700">{formatDate(selectedSub.startDate)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Expiry Date</span>
                <span className="text-slate-700">{formatDate(selectedSub.expiryDate)}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Automatic renewal is currently <strong>{selectedSub.autoRenew ? 'ENABLED' : 'DISABLED'}</strong>. 
                When enabled, your default card will be charged on {formatDate(selectedSub.expiryDate)} to prevent service interruption.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedSub(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Renewal Modal */}
      <Modal isOpen={!!renewModalSub} onClose={() => setRenewModalSub(null)} title="Confirm Subscription Renewal" size="md">
        {renewModalSub && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              You are renewing subscription <strong>{renewModalSub.id}</strong> ({renewModalSub.productName}).
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan & Cadence:</span>
                <span className="font-bold text-slate-800">{renewModalSub.planName} ({renewModalSub.billingCycle})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Expiry:</span>
                <span className="text-slate-700">{formatDate(renewModalSub.expiryDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renewal Amount:</span>
                <span className="text-base font-black text-slate-900">{formatCurrency(renewModalSub.amount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="text-emerald-700 font-semibold">Test Sandbox Gateway (Verified Settlement)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Upon clicking "Confirm & Process Renewal", payment will be verified on the backend, extending the expiration date automatically and logging a payment receipt.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setRenewModalSub(null)} disabled={processingAction}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmRenew}
                disabled={processingAction}
                className="font-bold"
              >
                {processingAction ? 'Processing Payment...' : `Confirm & Pay ${formatCurrency(renewModalSub.amount)}`}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancellation Modal */}
      <Modal isOpen={!!cancelModalSub} onClose={() => setCancelModalSub(null)} title="Cancel Subscription" size="md">
        {cancelModalSub && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to cancel this contract?</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Subscription {cancelModalSub.id} ({cancelModalSub.planName}) will be terminated. 
                  Automatic recurring billing will be stopped immediately.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setCancelModalSub(null)} disabled={processingAction}>
                Keep Subscription
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmCancel}
                disabled={processingAction}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {processingAction ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
export default CustomerSubscriptions;
