import React, { useState, useEffect } from 'react';
import { 
  Building, User, Mail, Phone, MapPin, CheckCircle2, 
  ShieldCheck, CreditCard, Save, Loader2 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { userApi } from '../../services/userApi';
import { formatDate } from '../../utils/formatters';

export function UserProfileTab({ onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Editable form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
    } catch (err) {
      console.error('[UserProfile Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback('');
      const updated = await userApi.updateProfile({ name, phone, address });
      setProfile((prev) => ({ ...prev, ...updated }));
      setFeedback('User profile details successfully updated in database!');
      if (onProfileUpdated) onProfileUpdated(updated);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Feedback banner */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">User Account & Profile</h2>
          <p className="text-xs text-slate-500">Manage contact information and billing destination details.</p>
        </div>
        <Badge status={profile?.status || 'Active'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Read-only Account Snapshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
              {profile?.company ? profile.company[0] : profile?.name?.[0] || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{profile?.company || profile?.name}</h3>
              <span className="text-[11px] font-mono text-slate-400">User ID: {profile?.id}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Account Status
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4" /> Verified User Account
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Registration Date
              </span>
              <span className="text-slate-800 font-medium">{formatDate(profile?.joinedDate)}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Registered Contact Email
              </span>
              <span className="text-slate-800 font-mono">{profile?.email}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Standard</span>
            <p className="text-[11px] text-slate-600">
              Passkeys and passwords are fully isolated and managed via backend secure authentication tokens.
            </p>
          </div>
        </div>

        {/* Right Card: Editable Profile Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Edit Account Information</h3>
          <p className="text-xs text-slate-500 mb-6">Update contact representation and legal billing location.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Full Name / Representative
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Primary Account Email (System Linked)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email is linked to your account ID and cannot be modified directly without re-verification.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Billing & Office Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street, city, state, postal code, and country..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saving}
                className="font-bold shadow-md shadow-blue-600/20 text-xs cursor-pointer"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}

export default UserProfileTab;
