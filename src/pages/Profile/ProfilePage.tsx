import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Loader2, Save, CheckCircle2, Shield } from 'lucide-react';
import api from '../../services/api';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.put('/api/auth/profile', formData);
      const token = localStorage.getItem('token');
      if (token) {
        await login(token); // Re-validates user and updates context
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-trip-teal/10 flex items-center justify-center">
          <User className="w-8 h-8 text-trip-teal" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-trip-text tracking-tight">My Profile</h1>
          <p className="text-trip-text-muted font-medium mt-1">Manage your account information securely.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-black/5 border border-trip-border relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-trip-yellow/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium flex items-center gap-3">
              <Shield className="w-5 h-5" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 font-medium flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Profile updated successfully!
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-trip-text mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-trip-text-muted/50" />
              </div>
              <input
                type="text"
                disabled
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-trip-border text-trip-text-muted focus:outline-none font-medium cursor-not-allowed"
                value={user.username}
              />
            </div>
            <p className="text-xs text-trip-text-muted mt-2 font-medium ml-1">Username cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-trip-text mb-2">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-trip-text-muted/70" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-trip-text mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-trip-text-muted/70" />
              </div>
              <input
                type="tel"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-full bg-trip-teal text-white font-black tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
