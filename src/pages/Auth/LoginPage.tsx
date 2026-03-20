import { useState, type FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import api from '../../services/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        username: formData.username,
        password: formData.password,
      });
      await login(res.data.token);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-trip-bg flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-trip-yellow/20 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-trip-teal/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-full bg-trip-teal flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-trip-teal/20">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-trip-text">
            Ticket<span className="font-medium">Go</span>
          </span>
        </Link>
        <h2 className="text-center text-3xl font-black tracking-tight text-trip-text">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-trip-text-muted font-medium">
          Sign in to book tickets and manage your events
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl shadow-black/5 rounded-[2rem] sm:px-10 border border-trip-border">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-trip-text mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-trip-text-muted/70" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-trip-text mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-trip-text-muted/70" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-trip-teal text-white font-bold tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 relative top-px" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-trip-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-trip-text-muted font-medium">New to TicketGo?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full py-3.5 rounded-full bg-trip-bg text-trip-text border border-trip-border font-bold hover:bg-white hover:border-trip-teal hover:text-trip-teal transition-all flex justify-center items-center"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
