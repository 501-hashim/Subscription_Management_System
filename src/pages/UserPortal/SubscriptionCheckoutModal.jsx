import React, { useState, useEffect } from 'react';
import { 
  X, Check, Shield, Tag, CreditCard, CheckCircle2, ArrowRight, 
  Sparkles, AlertCircle, Building, User, Mail, DollarSign, Calendar
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { userApi } from '../../services/userApi';

export function SubscriptionCheckoutModal({
  isOpen,
  onClose,
  selectedItem, // Can be a product or a plan
  itemType = 'product', // 'product' or 'plan'
  products = [],
  plans = [],
  discounts = [],
  currentCustomer,
  onSubscribeSuccess,
}) {
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // User contact form fields
  const [userName, setUserName] = useState(currentCustomer?.name || 'Jane Doe');
  const [userEmail, setUserEmail] = useState(currentCustomer?.email || 'jane@example.com');
  const [userCompany, setUserCompany] = useState(currentCustomer?.company || 'Acme Solutions');

  // Sync user fields when currentCustomer changes or modal opens
  useEffect(() => {
    if (currentCustomer) {
      setUserName(currentCustomer.name);
      setUserEmail(currentCustomer.email);
      setUserCompany(currentCustomer.company);
    }
  }, [currentCustomer, isOpen]);

  // Sync default variant and billing cycle when item changes
  useEffect(() => {
    if (selectedItem) {
      if (itemType === 'product') {
        setSelectedVariant(selectedItem.variants?.[0] || 'Default');
        setBillingCycle('Monthly');
      } else {
        setBillingCycle(selectedItem.billingFrequency || 'Monthly');
        setQuantity(selectedItem.minimumQuantity || 1);
      }
      setCouponCode('');
      setAppliedDiscount(null);
      setDiscountError('');
      setIsSuccess(false);
      setSuccessData(null);
    }
  }, [selectedItem, itemType, isOpen]);

  if (!isOpen || !selectedItem) return null;

  // Calculate pricing
  const basePrice = itemType === 'product' 
    ? (selectedItem.salesPrice || 0)
    : (selectedItem.price || 0);

  // If plan is annual or product variant is Annual, apply multiplier if needed
  let effectiveUnitPrice = basePrice;
  if (itemType === 'product') {
    if (selectedVariant.toLowerCase().includes('annual')) {
      effectiveUnitPrice = basePrice * 10; // e.g. 10 months price for annual
    }
  }

  const subtotal = effectiveUnitPrice * quantity;

  // Calculate discount
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'Percentage') {
      const pct = parseFloat(appliedDiscount.value.replace('%', '')) || 0;
      discountAmount = (subtotal * pct) / 100;
    } else {
      const fixedVal = parseFloat(appliedDiscount.value.replace(/[^0-9.]/g, '')) || 0;
      discountAmount = Math.min(subtotal, fixedVal);
    }
  }

  const tax = (subtotal - discountAmount) * 0.08; // 8% standard tax
  const totalDue = Math.max(0, subtotal - discountAmount + tax);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setDiscountError('');
    if (!couponCode.trim()) {
      setDiscountError('Please enter a coupon code.');
      return;
    }

    const matched = discounts.find(
      (d) => d.name.toUpperCase() === couponCode.trim().toUpperCase() && d.status === 'Active'
    );

    if (matched) {
      setAppliedDiscount(matched);
      setDiscountError('');
    } else {
      setAppliedDiscount(null);
      setDiscountError('Invalid or expired coupon code. Try EARLYBIRD20 or HACKATHON50.');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const productId = itemType === 'product' ? selectedItem.id : (selectedItem.productId || selectedItem.product_id);
      const planId = itemType === 'plan' ? selectedItem.id : null;

      // Verified purchase via Express + PostgreSQL API
      const res = await userApi.purchaseSubscription({
        productId,
        planId,
        billingCycle,
        quantity,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (Sandbox Verified)' : paymentMethod === 'ach' ? 'Direct Debit (ACH)' : 'Bank Wire Transfer',
        couponCode: appliedDiscount?.name || couponCode,
      });

      const sub = res.subscription;
      const inv = res.invoice;
      const pay = res.payment;

      if (onSubscribeSuccess) {
        onSubscribeSuccess({
          subscription: {
            ...sub,
            customer: userCompany || userName,
            plan: sub.plan_name,
            billingCycle: sub.billing_cycle,
            startDate: sub.start_date,
            expiryDate: sub.expiry_date,
            nextBillingDate: sub.next_billing_date,
            autoRenew: sub.auto_renew,
          },
          invoice: inv,
          payment: pay,
        });
      }

      setSuccessData({
        subscriptionId: sub.id,
        invoiceId: inv?.id,
        planName: sub.plan_name,
        amount: sub.amount,
        billingCycle: sub.billing_cycle,
        nextBillingDate: sub.expiry_date,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('[Purchase Error]:', err);
      alert(`Purchase could not be verified on backend: ${err.message}`);
    }
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
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isSuccess ? 'Subscription Activated!' : 'Complete Your Subscription'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isSuccess ? 'Your service is ready for immediate access' : 'Review your plan details and confirm billing setup'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {isSuccess && successData ? (
              /* Success confirmation state */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900">Subscription Confirmed!</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Thank you for subscribing to <span className="font-semibold text-blue-600">{successData.planName}</span>.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Subscription ID:</span>
                    <span className="font-mono font-bold text-blue-700">{successData.subscriptionId}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Invoice Reference:</span>
                    <span className="font-mono text-slate-800">{successData.invoiceId}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Billing Cadence:</span>
                    <span className="font-medium text-slate-800">{successData.billingCycle}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Next Scheduled Renewal:</span>
                    <span className="font-medium text-slate-800">{successData.nextBillingDate}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1">
                    <span>Amount Charged:</span>
                    <span className="text-emerald-600 text-sm">{formatCurrency(successData.amount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={onClose}
                    className="px-6 cursor-pointer"
                  >
                    Go to My Subscriptions
                  </Button>
                </div>
              </div>
            ) : (
              /* Checkout form state */
              <div className="space-y-6">
                
                {/* Product/Plan Hero banner */}
                <div className="bg-linear-to-r from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        {itemType === 'plan' ? 'Subscription Tier' : selectedItem.type || 'Catalog Product'}
                      </span>
                      <Badge status="Active" label="Available" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">{selectedItem.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {selectedItem.description || 'Full recurring access with enterprise grade support and SLA compliance.'}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(effectiveUnitPrice)}</span>
                    <span className="text-[11px] text-slate-500 block">/{billingCycle.toLowerCase()}</span>
                  </div>
                </div>

                {/* Configurations: Variants / Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {itemType === 'product' && selectedItem.variants && selectedItem.variants.length > 0 && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Product Variant</label>
                      <select
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {selectedItem.variants.map((v, i) => (
                          <option key={i} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Billing Interval</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBillingCycle('Monthly')}
                        className={`py-2 px-3 rounded-lg border font-medium text-xs transition-all cursor-pointer ${
                          billingCycle === 'Monthly'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle('Annual')}
                        className={`py-2 px-3 rounded-lg border font-medium text-xs transition-all relative cursor-pointer ${
                          billingCycle === 'Annual'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Annual
                        <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          -15%
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      {itemType === 'plan' ? 'Users / Seats' : 'Quantity / Licenses'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={selectedItem.minimumQuantity || 1}
                        max={100}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(selectedItem.minimumQuantity || 1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {selectedItem.minimumQuantity > 1 && (
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          Min: {selectedItem.minimumQuantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Account Details */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" /> User & Billing Contact Details
                    </span>
                    <span className="text-[11px] text-slate-400">Pre-filled from your profile</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={userCompany}
                        onChange={(e) => setUserCompany(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">User Full Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">User Email</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-amber-500" /> Have a Promo Code?
                    </span>
                    <span className="text-[11px] text-slate-400">Try EARLYBIRD20 or HACKATHON50</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g. EARLYBIRD20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyCoupon}
                      className="cursor-pointer"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountError && (
                    <p className="text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {discountError}
                    </p>
                  )}
                  {appliedDiscount && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Code <strong>{appliedDiscount.name}</strong> applied ({appliedDiscount.value} off)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedDiscount(null);
                          setCouponCode('');
                        }}
                        className="text-emerald-700 hover:text-emerald-900 underline text-[11px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="sr-only"
                      />
                      <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                      <span className="text-xs">Credit Card</span>
                      <span className="text-[10px] text-slate-400 font-normal">Instant setup</span>
                    </label>

                    <label className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'ach' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        value="ach"
                        checked={paymentMethod === 'ach'}
                        onChange={() => setPaymentMethod('ach')}
                        className="sr-only"
                      />
                      <Building className="w-5 h-5 mb-1 text-slate-700" />
                      <span className="text-xs">ACH Debit</span>
                      <span className="text-[10px] text-slate-400 font-normal">US Bank wire</span>
                    </label>

                    <label className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'wire' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        value="wire"
                        checked={paymentMethod === 'wire'}
                        onChange={() => setPaymentMethod('wire')}
                        className="sr-only"
                      />
                      <Shield className="w-5 h-5 mb-1 text-emerald-600" />
                      <span className="text-xs">Net 30 Invoice</span>
                      <span className="text-[10px] text-slate-400 font-normal">Enterprise PO</span>
                    </label>
                  </div>
                </div>

                {/* Order Summary Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({quantity} {quantity > 1 ? 'units' : 'unit'} × {formatCurrency(effectiveUnitPrice)}):</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedDiscount?.name}):</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Tax (8%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-bold text-sm">
                    <span>Total Due Today:</span>
                    <span className="text-blue-700 text-base">{formatCurrency(totalDue)}</span>
                  </div>
                </div>

                {/* Terms and Confirm Button */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2 text-[11px] text-slate-500">
                    <Shield className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span>
                      By subscribing, you agree to automatic recurring billing at the cadence selected. You can pause or cancel at any time from your user dashboard.
                    </span>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} className="cursor-pointer">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmOrder} className="px-6 cursor-pointer">
                      Confirm & Start Subscription <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SubscriptionCheckoutModal;
