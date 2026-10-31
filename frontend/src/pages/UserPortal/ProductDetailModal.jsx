import React from 'react';
import { 
  X, Check, ShieldCheck, Layers, Sparkles, ArrowRight, 
  Calendar, RefreshCw, Zap, Tag, CheckCircle2 
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onSelectPlan,
}) {
  if (!isOpen || !product) return null;

  const plans = product.plans || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        
        {/* Product Header Banner */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full sm:w-44 h-36 object-cover rounded-2xl shadow-sm border border-slate-200"
            />
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {product.category || product.type}
              </span>
              <span className="text-xs font-mono text-slate-400">{product.code}</span>
              <Badge status={product.status || 'Available'} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{product.name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Starting From</span>
              <span className="text-2xl font-black text-slate-900">
                {formatCurrency(product.startingPrice || product.salesPrice)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/month</span>
            </div>
          </div>
        </div>

        {/* Features Checklist */}
        {product.features && product.features.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Key Features & Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Subscription Plans */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Available Subscription Plans</h3>
              <p className="text-xs text-slate-500">Compare tiers and choose the plan that best fits your workflow.</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              {plans.length} Tier{plans.length !== 1 ? 's' : ''} Available
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Standard Single-Tier Offering</p>
              <p className="text-[11px] text-slate-400">This service is billed at a flat rate of {formatCurrency(product.salesPrice)} / month.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSelectPlan(product, {
                    id: `CUSTOM-${product.id}`,
                    name: product.name,
                    price: product.salesPrice,
                    billingFrequency: 'Monthly',
                  });
                  onClose();
                }}
                className="mt-2 cursor-pointer"
              >
                Proceed with Flat Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isPro = plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('growth');
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                      isPro
                        ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {isPro && (
                      <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        Popular Tier
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{plan.code}</span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">{formatCurrency(plan.price)}</span>
                        <span className="text-[11px] text-slate-500 font-medium">/{plan.billingFrequency.toLowerCase()}</span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                          <span>Renewal Price: <strong>{formatCurrency(plan.renewalPrice)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Auto-Renew: <strong>{plan.autoRenewalSupported ? 'Supported' : 'Manual'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Min Seats: <strong>{plan.minimumQuantity} user(s)</strong></span>
                        </div>
                      </div>

                      {/* Included features list */}
                      {plan.features && plan.features.length > 0 && (
                        <ul className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100">
                      <Button
                        variant={isPro ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full justify-center text-xs font-bold cursor-pointer"
                        onClick={() => {
                          onSelectPlan(product, plan);
                          onClose();
                        }}
                      >
                        Select {plan.name} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}

export default ProductDetailModal;
