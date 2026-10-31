import React, { useState, useEffect } from 'react';
import { 
  Zap, Package, Layers, Repeat, Receipt, FileText, UserCheck, 
  ArrowLeft, ArrowRight, Sparkles, Building, ShoppingBag, ShieldCheck, 
  LogOut, ChevronDown, User, Mail, Phone, MapPin, CheckCircle2, 
  CreditCard, Clock, Bell, LayoutDashboard
} from 'lucide-react';
import { UserDashboardTab } from './UserDashboardTab';
import { ProductCatalog } from './ProductCatalog';
import { UserSubscriptions } from './UserSubscriptions';
import { UserPayments } from './UserPayments';
import { UserNotificationsTab } from './UserNotificationsTab';
import { UserProfileTab } from './UserProfileTab';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { setActiveUserId, userApi } from '../../services/userApi';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function UserPortalPage({
  products = [],
  plans = [],
  subscriptions = [],
  invoices = [],
  payments = [],
  discounts = [],
  customers = [],
  currentUser = null,
  onLogout,
  onSwitchToAdmin,
  onAddSubscription,
  onToggleAutoRenew,
  onCancelSubscription,
}) {
  const [activeUserTab, setActiveUserTab] = useState('catalog'); // 'dashboard', 'catalog', 'subscriptions', 'payments', 'notifications', 'profile'
  
  // Use logged in user if provided, or default to first user ID
  const initialUserId = currentUser?.id || customers[0]?.id || 'CUST-001';
  const [currentUserId, setCurrentUserId] = useState(initialUserId);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Modals
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [checkoutItemType, setCheckoutItemType] = useState('product'); // 'product' or 'plan'

  const currentActiveUser = customers.find((c) => c.id === currentUserId) || currentUser || customers[0];

  // Sync active user ID with API service layer
  useEffect(() => {
    setActiveUserId(currentUserId);
    fetchUnreadNotifications();
  }, [currentUserId]);

  const fetchUnreadNotifications = async () => {
    try {
      const notifs = await userApi.getNotifications();
      setUnreadNotifCount(notifs.filter((n) => !n.read).length);
    } catch (err) {
      // ignore
    }
  };

  // Open checkout for a product
  const handleSelectProduct = (product) => {
    setCheckoutItem(product);
    setCheckoutItemType('product');
    setCheckoutModalOpen(true);
  };

  // Open checkout for a plan
  const handleSelectPlan = (product, plan) => {
    setCheckoutItem({
      ...plan,
      productId: product?.id,
      productName: product?.name,
    });
    setCheckoutItemType('plan');
    setCheckoutModalOpen(true);
  };

  const handleSubscribeSuccess = ({ subscription, invoice, payment }) => {
    if (onAddSubscription) {
      onAddSubscription(subscription, invoice, payment);
    }
    fetchUnreadNotifications();
  };

  const userInitial = currentActiveUser?.name ? currentActiveUser.name[0] : 'U';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* Top User Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        
        {/* Upper Announcement / Switcher Bar */}
        <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200 hidden sm:inline">
              Brightloop User Portal & Subscription Hub
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
              Live PostgreSQL Connected
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active User Account Indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-slate-400">Active User:</span>
              <span className="font-semibold text-white">
                {currentActiveUser?.name} {currentActiveUser?.company ? `(${currentActiveUser.company})` : ''}
              </span>
            </div>

            {/* Back to Admin Switcher if role is admin */}
            {onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-1 rounded-lg text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
                title="Switch to Admin Operations Console"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Explicit Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border border-rose-500/30 cursor-pointer"
                title="Sign out of user portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Header / Brand / Navigation Tabs & User Profile */}
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
                  User Portal
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate max-w-[200px]">
                {currentActiveUser?.company || currentActiveUser?.name}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveUserTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUserTab === 'catalog'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveUserTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUserTab === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveUserTab('subscriptions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUserTab === 'subscriptions'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>My Subscriptions</span>
            </button>

            <button
              onClick={() => setActiveUserTab('payments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUserTab === 'payments'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment History</span>
            </button>

            <button
              onClick={() => setActiveUserTab('notifications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUserTab === 'notifications'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadNotifCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveUserTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUserTab === 'profile'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userInitial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {currentActiveUser?.name || 'User'}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[120px]">
                  {currentActiveUser?.company || 'Account'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Popover / Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{currentActiveUser?.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{currentActiveUser?.company}</p>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{currentActiveUser?.email}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">User ID:</span>
                    <span className="font-mono font-medium text-slate-800">{currentActiveUser?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Status:</span>
                    <span className="font-semibold text-emerald-600">Verified User</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setActiveUserTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
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
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
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
        
        {/* 1. User Dashboard Tab */}
        {activeUserTab === 'dashboard' && (
          <UserDashboardTab
            onNavigateTab={setActiveUserTab}
            onOpenRenewModal={() => setActiveUserTab('subscriptions')}
          />
        )}

        {/* 2. Product Catalog Tab */}
        {activeUserTab === 'catalog' && (
          <ProductCatalog
            onSelectProduct={handleSelectProduct}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {/* 3. My Subscriptions Tab */}
        {activeUserTab === 'subscriptions' && (
          <UserSubscriptions
            onExplorePlans={() => setActiveUserTab('catalog')}
          />
        )}

        {/* 4. Payment History Tab */}
        {activeUserTab === 'payments' && (
          <UserPayments />
        )}

        {/* 5. Notifications Tab */}
        {activeUserTab === 'notifications' && (
          <UserNotificationsTab />
        )}

        {/* 6. Profile Tab */}
        {activeUserTab === 'profile' && (
          <UserProfileTab />
        )}

      </main>

      {/* Subscription Checkout & Sandbox Payment Modal */}
      <SubscriptionCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        selectedItem={checkoutItem}
        itemType={checkoutItemType}
        products={products}
        plans={plans}
        discounts={discounts}
        currentCustomer={currentActiveUser}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      {/* User Portal Footer */}
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

export default UserPortalPage;