import React, { useState, useEffect } from 'react';
import { 
  Zap, Package, Repeat, AlertTriangle, Clock, RefreshCw, 
  ArrowRight, ShieldCheck, ShoppingBag, Receipt, CreditCard, 
  Bell, CheckCircle2, AlertCircle, Sparkles, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { userApi } from '../../services/userApi';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function UserDashboardTab({
  onNavigateTab,
  onOpenRenewModal,
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userApi.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('[UserDashboardTab Error]:', err);
      setError('Failed to load user dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleMarkNotifRead = async (id) => {
    try {
      await userApi.markNotificationRead(id);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading personalized user dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
        <p className="text-xs text-rose-700 font-semibold">{error || 'Unable to retrieve dashboard'}</p>
        <Button variant="secondary" size="sm" onClick={fetchDashboard}>
          Retry
        </Button>
      </div>
    );
  }

  const { welcomeMessage, customer, user, metrics, expiringSoonSubscriptions, recentlyPurchased, recentNotifications } = dashboardData;
  const currentUserObj = user || customer || {};
  const displayName = currentUserObj.name || 'User';

  return (
    <div className="space-y-8">
      
      {/* 1. Hero Personalized Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-7 sm:p-9 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>User Portal & Subscription Overview</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {welcomeMessage || `Welcome back, ${displayName}!`}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Welcome to your self-service subscription hub. Monitor your active subscriptions, review upcoming renewals, inspect transaction receipts, and discover new products published by our administrators.
          </p>

          {/* Quick Navigation Shortcuts */}
          <div className="flex flex-wrap gap-2.5 pt-3">
            <button
              onClick={() => onNavigateTab('catalog')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Products</span>
            </button>

            <button
              onClick={() => onNavigateTab('subscriptions')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5 text-blue-300" />
              <span>My Subscriptions</span>
            </button>

            <button
              onClick={() => onNavigateTab('payments')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
              <span>Payment History</span>
            </button>

            <button
              onClick={() => onNavigateTab('notifications')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Notifications ({metrics.unreadNotificationsCount})</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Products */}
        <div 
          onClick={() => onNavigateTab('catalog')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{metrics.totalAvailableProducts}</p>
          <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
            Browse Catalog <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Active Subscriptions */}
        <div 
          onClick={() => onNavigateTab('subscriptions')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{metrics.totalActiveSubscriptions}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Live recurring services</span>
        </div>

        {/* Expiring Soon */}
        <div 
          onClick={() => onNavigateTab('subscriptions')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
            metrics.expiringSoonCount > 0 
              ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20' 
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Expiring Soon</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              metrics.expiringSoonCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${metrics.expiringSoonCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {metrics.expiringSoonCount}
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {metrics.expiringSoonCount > 0 ? 'Renewal recommended' : 'None expiring within 14 days'}
          </span>
        </div>

        {/* Expired Contracts */}
        <div 
          onClick={() => onNavigateTab('subscriptions')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expired Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{metrics.expiredCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Terminated / Inactive</span>
        </div>
      </div>

      {/* 3. Expiring Soon Attention Banner */}
      {expiringSoonSubscriptions && expiringSoonSubscriptions.length > 0 && (
        <div className="p-5 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Attention: Subscription Renewal Needed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expiringSoonSubscriptions.map((sub) => (
              <div 
                key={sub.id} 
                className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{sub.product_name || sub.plan_name}</h4>
                  <span className="text-[11px] text-amber-700 font-semibold block">
                    Expires in {sub.remaining_days} days ({formatDate(sub.expiry_date)})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Subscription ID: {sub.id}</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                  onClick={() => onOpenRenewModal && onOpenRenewModal(sub)}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Renew Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Split Section: Recently Purchased Subscriptions & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Recently Purchased Subscriptions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recently Purchased Subscriptions</h3>
              <p className="text-xs text-slate-500">Your recent service contracts and active plans.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('subscriptions')}
              className="text-xs cursor-pointer"
            >
              View All ({recentlyPurchased.length})
            </Button>
          </div>

          {recentlyPurchased.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Repeat className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              No subscriptions found. Explore the catalog to start!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentlyPurchased.map((sub) => (
                <div key={sub.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sub.product_name || sub.plan_name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-mono">{sub.id}</span>
                        <span>•</span>
                        <span>Expiry: {formatDate(sub.expiry_date)}</span>
                        <span>•</span>
                        <span>{sub.remaining_days} days left</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">{formatCurrency(sub.amount)}</span>
                      <span className="text-[10px] text-slate-400">{sub.billing_cycle}</span>
                    </div>
                    <Badge status={sub.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 col): Recent Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Notifications</h3>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                {metrics.unreadNotificationsCount} unread
              </span>
            </div>

            {recentNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No recent notifications.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3.5 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{notif.message}</p>
                        <span className="text-[9px] text-slate-400 block">{formatDate(notif.created_at)}</span>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkNotifRead(notif.id)}
                          className="text-[10px] text-blue-600 hover:underline shrink-0 font-medium cursor-pointer"
                          title="Mark as read"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <button
              onClick={() => onNavigateTab('notifications')}
              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Notifications</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default UserDashboardTab;
