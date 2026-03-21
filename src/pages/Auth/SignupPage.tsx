import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, ArrowRight, Loader2, User, Mail, Lock, ShieldCheck, Phone } from 'lucide-react';
import api from '../../services/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', phoneNumber: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/auth/register', formData);
      setSuccess(true);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-trip-bg flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-trip-mint/20 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-trip-yellow/10 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 transition-all duration-500">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-full bg-trip-yellow flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-trip-yellow/20">
            <Ticket className="w-5 h-5 text-trip-text" />
          </div>
          <span className="text-2xl font-black tracking-tight text-trip-text">
            Ticket<span className="font-medium">Go</span>
          </span>
        </Link>
        
        {success ? (
          <div className="bg-white py-12 px-6 shadow-xl shadow-black/5 rounded-[2rem] sm:px-10 border border-trip-border text-center animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
               <ShieldCheck className="w-10 h-10 text-green-500" />
             </div>
             <h2 className="text-3xl font-black text-trip-text mb-4">Account created!</h2>
             <p className="text-trip-text-muted font-medium mb-8">You can now book tickets and manage events. Redirecting you to login...</p>
             <Link to="/login" className="inline-block py-3 px-8 rounded-full bg-trip-teal text-white font-bold hover:bg-trip-teal-hover transition-colors">
               Go to Login
             </Link>
          </div>
        ) : (
          <>
            <h2 className="text-center text-3xl font-black tracking-tight text-trip-text mb-2">Create an account</h2>
            <p className="mt-2 text-center text-sm text-trip-text-muted font-medium mb-8">Join the ultimate event platform</p>
            
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
                      <User className="h-5 w-5 text-trip-text-muted/70" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
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

                <div>
                  <label className="block text-sm font-bold text-trip-text mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-trip-text-muted/70" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
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
                    className="w-full py-4 rounded-full bg-trip-yellow text-trip-text font-black tracking-wide hover:bg-[#ebbb38] transition-colors shadow-lg shadow-trip-yellow/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-trip-text" />
                    ) : (
                      <>
                        Create Account <ArrowRight className="w-4 h-4 relative top-px" />
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
                    <span className="px-4 bg-white text-trip-text-muted font-medium">Already have an account?</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="font-bold text-trip-teal hover:text-trip-teal-hover transition-colors"
                  >
                    Sign in to your account
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
