import React, { useState } from 'react';
import { 
  Zap, Package, Layers, Repeat, Receipt, FileText, UserCheck, 
  ArrowLeft, ArrowRight, Sparkles, Building, ShoppingBag, ShieldCheck, 
  LogOut, ChevronDown 
} from 'lucide-react';
import { ProductCatalog } from './ProductCatalog';
import { CustomerSubscriptions } from './CustomerSubscriptions';
import { CustomerInvoices } from './CustomerInvoices';
import { CustomerQuotations } from './CustomerQuotations';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export function CustomerPortalPage({
  products = [],
  plans = [],
  subscriptions = [],
  invoices = [],
  payments = [],
  discounts = [],
  customers = [],
  quotations = [],
  onSwitchToAdmin,
  onAddSubscription,
  onToggleAutoRenew,
  onCancelSubscription,
  onPayInvoice,
  onAcceptQuotation,
}) {
  const [activeCustomerTab, setActiveCustomerTab] = useState('catalog'); // 'catalog', 'subscriptions', 'invoices', 'quotes'
  const [currentCustomerId, setCurrentCustomerId] = useState(customers[0]?.id || 'CUST-001');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [checkoutItemType, setCheckoutItemType] = useState('product'); // 'product' or 'plan'

  const currentCustomer = customers.find((c) => c.id === currentCustomerId) || customers[0];

  // Open checkout for a product
  const handleSelectProduct = (product) => {
    setCheckoutItem(product);
    setCheckoutItemType('product');
    setCheckoutModalOpen(true);
  };

  // Open checkout for a plan
  const handleSelectPlan = (plan, cadence) => {
    setCheckoutItem({ ...plan, billingFrequency: cadence || plan.billingFrequency });
    setCheckoutItemType('plan');
    setCheckoutModalOpen(true);
  };

  const handleSubscribeSuccess = ({ subscription, invoice, payment }) => {
    if (onAddSubscription) {
      onAddSubscription(subscription, invoice, payment);
    }
  };

  // Calculate customer badge metrics
  const customerSubCount = subscriptions.filter(
    (s) => s.customerId === currentCustomerId && s.status === 'Active'
  ).length;

  const customerInvoicePending = invoices.filter(
    (i) => i.customerId === currentCustomerId && (i.status === 'Pending' || i.status === 'Overdue')
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* Top Customer Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        
        {/* Upper Announcement / Switcher Bar */}
        <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200 hidden sm:inline">
              Customer Self-Service & Storefront Portal
            </span>
            <span className="text-[11px] bg-slate-800 text-blue-300 px-2 py-0.5 rounded font-mono">
              Live Client Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Customer Profile Switcher dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 hidden md:inline">Viewing as:</span>
              <select
                value={currentCustomerId}
                onChange={(e) => setCurrentCustomerId(e.target.value)}
                className="bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ? `${c.company} (${c.name})` : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Back to Admin Portal Switcher */}
            <button
              onClick={onSwitchToAdmin}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs"
              title="Switch back to Admin Operations & Billing"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Main Header / Brand / Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  Brightloop
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                  Client Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentCustomer?.company || currentCustomer?.name}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveCustomerTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCustomerTab === 'catalog'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products & Plans</span>
            </button>

            <button
              onClick={() => setActiveCustomerTab('subscriptions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCustomerTab === 'subscriptions'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>My Subscriptions</span>
              {customerSubCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {customerSubCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCustomerTab('invoices')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCustomerTab === 'invoices'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Invoices & Billing</span>
              {customerInvoicePending > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {customerInvoicePending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCustomerTab('quotes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCustomerTab === 'quotes'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Proposals & Quotes</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {activeCustomerTab === 'catalog' && (
          <ProductCatalog
            products={products}
            plans={plans}
            onSelectProduct={handleSelectProduct}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {activeCustomerTab === 'subscriptions' && (
          <CustomerSubscriptions
            subscriptions={subscriptions}
            currentCustomer={currentCustomer}
            onToggleAutoRenew={onToggleAutoRenew}
            onCancelSubscription={onCancelSubscription}
            onExplorePlans={() => setActiveCustomerTab('catalog')}
          />
        )}

        {activeCustomerTab === 'invoices' && (
          <CustomerInvoices
            invoices={invoices}
            currentCustomer={currentCustomer}
            onPayInvoice={onPayInvoice}
          />
        )}

        {activeCustomerTab === 'quotes' && (
          <CustomerQuotations
            quotations={quotations}
            currentCustomer={currentCustomer}
            onAcceptQuotation={onAcceptQuotation}
          />
        )}

      </main>

      {/* Subscription Checkout Modal */}
      <SubscriptionCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        selectedItem={checkoutItem}
        itemType={checkoutItemType}
        products={products}
        plans={plans}
        discounts={discounts}
        currentCustomer={currentCustomer}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      {/* Customer Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Brightloop Software Inc. • All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
