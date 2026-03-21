import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, AlignLeft, Users, Type, Loader2, Save, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';
import type { Event } from '../../types';

function toDateTimeLocal(value: string) {
  if (!value) return '';
  const date = new Date(value);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        const event: Event | undefined = res.data?.event;
        if (!event) {
          throw new Error('Event not found');
        }
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: toDateTimeLocal(event.date),
          location: event.location || '',
          maxAttendees: String(event.maxAttendees ?? ''),
        });
      } catch (error: any) {
        await Swal.fire({
          title: 'Unable to load event',
          text: error?.response?.data?.error || 'Could not load event details',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        navigate('/events/mine');
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await api.put(`/api/events/${id}`, {
        ...formData,
        maxAttendees: parseInt(formData.maxAttendees, 10),
      });
      await Swal.fire({
        title: 'Event updated',
        text: 'Your event details were saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/events/mine');
    } catch (error: any) {
      await Swal.fire({
        title: 'Failed to update event',
        text: error?.response?.data?.error || 'Failed to update event',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setSaving(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-trip-teal animate-spin mb-4" />
        <p className="text-trip-text-muted font-medium">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/events/mine" className="inline-flex items-center gap-2 text-trip-text-muted hover:text-trip-teal transition-colors font-medium text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to My Events
        </Link>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-trip-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-trip-mint/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-trip-yellow/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-trip-teal/10 flex items-center justify-center">
                <Save className="w-6 h-6 text-trip-teal" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-trip-text">Edit Event</h1>
            </div>
            <p className="text-trip-text-muted font-medium mb-10 ml-16">Update your event details and keep attendees informed.</p>

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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 rounded-full bg-trip-teal text-white font-bold tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Event
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
