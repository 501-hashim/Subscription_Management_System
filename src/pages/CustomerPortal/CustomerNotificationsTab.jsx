import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, AlertTriangle, RefreshCw, XCircle, 
  Sparkles, Check, Clock, Loader2 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { customerApi } from '../../services/customerApi';
import { formatDate } from '../../utils/formatters';

export function CustomerNotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('[Notifications Error]:', err);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await customerApi.markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await customerApi.markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Icon selector based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'renewal':
        return <RefreshCw className="w-4 h-4 text-indigo-600" />;
      case 'expiry':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'cancellation':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Notifications & Activity Feed</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Live operational alerts, billing milestones, and expiration notifications.</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs">
            <Check className="w-3.5 h-3.5 mr-1" /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Fetching notifications...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">All caught up!</h4>
          <p className="text-xs text-slate-400">You have no active notifications at this time.</p>
        </div>
      )}

      {/* Notifications List */}
      {!loading && notifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.read ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !notif.read ? 'bg-white shadow-xs border border-blue-200' : 'bg-slate-100'
                }`}>
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {formatDate(notif.created_at)}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0 hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
export default CustomerNotificationsTab;
