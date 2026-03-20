import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, MapPin, AlignLeft, Users, Type, Loader2, Plus, ArrowLeft } from 'lucide-react';

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/events', {
        ...formData,
        maxAttendees: parseInt(formData.maxAttendees)
      });
      navigate('/events/mine');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create event');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/events" className="inline-flex items-center gap-2 text-trip-text-muted hover:text-trip-teal transition-colors font-medium text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-trip-border relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-trip-mint/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-trip-yellow/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-trip-teal/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-trip-teal" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-trip-text">Create an Event</h1>
            </div>
            <p className="text-trip-text-muted font-medium mb-10 ml-16">Host your own experience and share it with the world.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute top-3.5 left-4">
                    <Type className="w-5 h-5 text-trip-text-muted" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Event Title"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium placeholder:text-trip-text-muted/70"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <div className="absolute top-4 left-4">
                    <AlignLeft className="w-5 h-5 text-trip-text-muted" />
                  </div>
                  <textarea
                    required
                    placeholder="Event Description"
                    rows={4}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium resize-none placeholder:text-trip-text-muted/70"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute top-3.5 left-4">
                      <Calendar className="w-5 h-5 text-trip-text-muted" />
                    </div>
                    <input
                      type="datetime-local"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute top-3.5 left-4">
                      <MapPin className="w-5 h-5 text-trip-text-muted" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Location"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium placeholder:text-trip-text-muted/70"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-3.5 left-4">
                    <Users className="w-5 h-5 text-trip-text-muted" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Maximum Attendees"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-trip-bg border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 focus:border-trip-teal/50 transition-all font-medium placeholder:text-trip-text-muted/70"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-trip-teal text-white font-bold tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Creating Event...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Publish Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
