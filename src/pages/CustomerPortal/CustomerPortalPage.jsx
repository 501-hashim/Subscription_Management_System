import React, { useState } from 'react';
import { 
  Zap, Package, Layers, Repeat, Receipt, FileText, UserCheck, 
  ArrowLeft, ArrowRight, Sparkles, Building, ShoppingBag, ShieldCheck, 
  LogOut, ChevronDown, User, Mail, Phone, MapPin, CheckCircle2, 
  CreditCard, Clock, ExternalLink
} from 'lucide-react';
import { ProductCatalog } from './ProductCatalog';
import { CustomerSubscriptions } from './CustomerSubscriptions';
import { CustomerInvoices } from './CustomerInvoices';
import { CustomerQuotations } from './CustomerQuotations';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function CustomerPortalPage({
  products = [],
  plans = [],
  subscriptions = [],
  invoices = [],
  payments = [],
  discounts = [],
  customers = [],
  quotations = [],
  currentUser = null,
  onLogout,
  onSwitchToAdmin,
  onAddSubscription,
  onToggleAutoRenew,
  onCancelSubscription,
  onPayInvoice,
  onAcceptQuotation,
}) {
  const [activeCustomerTab, setActiveCustomerTab] = useState('catalog'); // 'catalog', 'subscriptions', 'invoices', 'quotes', 'profile'
  
  // Use logged in customer if provided, or default to first customer
  const initialCustId = currentUser?.id || customers[0]?.id || 'CUST-001';
  const [currentCustomerId, setCurrentCustomerId] = useState(initialCustId);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [checkoutItemType, setCheckoutItemType] = useState('product'); // 'product' or 'plan'

  const currentCustomer = customers.find((c) => c.id === currentCustomerId) || currentUser || customers[0];

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
  const customerSubs = subscriptions.filter(
    (s) => s.customerId === currentCustomerId || s.customer?.toLowerCase() === currentCustomer?.company?.toLowerCase()
  );
  const activeSubs = customerSubs.filter((s) => s.status === 'Active');
  
  const customerInvoices = invoices.filter(
    (i) => i.customerId === currentCustomerId || i.customer?.toLowerCase() === currentCustomer?.company?.toLowerCase()
  );
  const pendingInvoices = customerInvoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Overdue'
  );

  const totalMonthlySpend = activeSubs.reduce((sum, s) => {
    const amt = s.amount || 0;
    return sum + (s.billingCycle === 'Annual' ? amt / 12 : amt);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* Top Customer Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        
        {/* Upper Announcement / Switcher Bar */}
        <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200 hidden sm:inline">
              Brightloop Customer Self-Service & Billing Portal
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
              Authenticated Session
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick switcher to view other customer accounts (for demo/testing) */}
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Switch Account:</span>
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
            {onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-1 rounded-lg text-xs font-semibold transition-all border border-slate-700"
                title="Switch to Admin Operations & Billing"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Explicit Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border border-rose-500/30"
                title="Sign out of customer portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Header / Brand / Tabs & User Profile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Organization */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  Brightloop
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  Client Hub
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
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
              {activeSubs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {activeSubs.length}
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
              {pendingInvoices.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {pendingInvoices.length}
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

            <button
              onClick={() => setActiveCustomerTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCustomerTab === 'profile'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Company Profile</span>
            </button>
          </nav>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentCustomer?.name ? currentCustomer.name[0] : 'C'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {currentCustomer?.name || 'Customer'}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[120px]">
                  {currentCustomer?.company || 'Organization'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Popover / Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{currentCustomer?.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{currentCustomer?.company}</p>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{currentCustomer?.email}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Customer ID:</span>
                    <span className="font-mono font-medium text-slate-800">{currentCustomer?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Plans:</span>
                    <span className="font-bold text-blue-600">{activeSubs.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monthly Run-rate:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(totalMonthlySpend)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setActiveCustomerTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span>View Account Settings</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out of Portal</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Personalized Welcome Banner (shown on catalog or overview) */}
        {activeCustomerTab === 'catalog' && (
          <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-xs font-semibold text-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client Self-Service Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {currentCustomer?.name?.split(' ')[0] || 'Partner'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Viewing services and subscriptions for <strong>{currentCustomer?.company || 'Your Organization'}</strong>. 
                Explore products listed by Brightloop administrators, manage automated renewals, settle cycle invoices, or configure add-on seats.
              </p>

              {/* Quick Jump Bar */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => setActiveCustomerTab('subscriptions')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <Repeat className="w-3.5 h-3.5 text-blue-300" />
                  <span>My Subscriptions ({activeSubs.length})</span>
                </button>
                <button
                  onClick={() => setActiveCustomerTab('invoices')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <Receipt className="w-3.5 h-3.5 text-amber-300" />
                  <span>Billing & Invoices ({pendingInvoices.length > 0 ? `${pendingInvoices.length} due` : 'Settled'})</span>
                </button>
                <button
                  onClick={() => setActiveCustomerTab('quotes')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Custom Proposals</span>
                </button>
              </div>
            </div>

            {/* Glowing background shapes */}
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="absolute right-40 bottom-0 -mb-10 w-60 h-60 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
          </div>
        )}

        {/* Tab 1: Product & Plan Catalog */}
        {activeCustomerTab === 'catalog' && (
          <ProductCatalog
            products={products}
            plans={plans}
            onSelectProduct={handleSelectProduct}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {/* Tab 2: Customer Subscriptions */}
        {activeCustomerTab === 'subscriptions' && (
          <CustomerSubscriptions
            subscriptions={subscriptions}
            currentCustomer={currentCustomer}
            onToggleAutoRenew={onToggleAutoRenew}
            onCancelSubscription={onCancelSubscription}
            onExplorePlans={() => setActiveCustomerTab('catalog')}
          />
        )}

        {/* Tab 3: Customer Invoices */}
        {activeCustomerTab === 'invoices' && (
          <CustomerInvoices
            invoices={invoices}
            currentCustomer={currentCustomer}
            onPayInvoice={onPayInvoice}
          />
        )}

        {/* Tab 4: Customer Quotations */}
        {activeCustomerTab === 'quotes' && (
          <CustomerQuotations
            quotations={quotations}
            currentCustomer={currentCustomer}
            onAcceptQuotation={onAcceptQuotation}
          />
        )}

        {/* Tab 5: Customer Company & Billing Profile */}
        {activeCustomerTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Organization & Account Settings</h2>
                <p className="text-xs text-slate-500">View and review your verified customer account details.</p>
              </div>
              <Badge status={currentCustomer?.status || 'Active'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{currentCustomer?.company}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Account ID: {currentCustomer?.id}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium uppercase text-[10px] tracking-wider">
                      Primary Contact
                    </span>
                    <span className="text-slate-800 font-semibold text-sm">{currentCustomer?.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium uppercase text-[10px] tracking-wider">
                      Billing Email Address
                    </span>
                    <span className="text-slate-800 font-mono">{currentCustomer?.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium uppercase text-[10px] tracking-wider">
                      Direct Phone
                    </span>
                    <span className="text-slate-800">{currentCustomer?.phone || '+1 (555) 234-5678'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium uppercase text-[10px] tracking-wider">
                      Registered Address
                    </span>
                    <span className="text-slate-800">{currentCustomer?.address || 'Headquarters'}</span>
                  </div>
                </div>
              </div>

              {/* Billing Run-Rate & Security Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Subscription Overview</h3>
                    <span className="text-[11px] text-slate-400">Automated cycle status</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Active Services</span>
                    <span className="font-bold text-slate-900">{activeSubs.length} Contracts</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Effective Monthly Run-rate</span>
                    <span className="font-bold text-blue-600">{formatCurrency(totalMonthlySpend)} / mo</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Member Since</span>
                    <span className="font-medium text-slate-800">{formatDate(currentCustomer?.joinedDate)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {onLogout && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onLogout}
                      className="w-full justify-center text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out of This Account
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
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
