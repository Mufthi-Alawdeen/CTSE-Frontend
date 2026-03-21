import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Event } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, Ticket, Loader2, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setEvents((res.data.events || []).filter((e: Event) => e.createdBy === user?.id));
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event: Event) => {
    const result = await Swal.fire({
      title: 'Delete this event?',
      text: `"${event.title}" will be removed permanently.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;

    setDeletingId(event._id);
    try {
      await api.delete(`/api/events/${event._id}`);
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
      await Swal.fire({
        title: 'Deleted',
        text: 'The event was removed.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      await Swal.fire({
        title: 'Could not delete',
        text: err.response?.data?.error || 'Failed to delete event',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-trip-teal animate-spin mb-4" />
        <p className="text-trip-text-muted font-medium">Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-trip-text">My Hosted Events</h1>
            <p className="mt-2 text-trip-text-muted font-medium text-lg">Manage the events you have created.</p>
          </div>
          <Link
            to="/events/create"
            className="px-6 py-3 rounded-full bg-trip-teal text-white font-bold tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Event
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
             <div key={event._id} className="bg-white border border-trip-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="aspect-[4/3] bg-trip-mint/20 relative overflow-hidden flex flex-col justify-center items-center">
                <span className="text-8xl font-black text-trip-teal opacity-20 group-hover:scale-110 transition-transform duration-500">{event.title.charAt(0)}</span>
                <div className="absolute top-3 left-3 bg-white text-trip-text text-xs font-bold px-3 py-1.5 rounded-md shadow-sm border border-trip-border">
                  {new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </div>
                 <div className="absolute top-3 right-3 bg-trip-text text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                  Hosted by You
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-trip-text mb-3 line-clamp-1 text-xl" title={event.title}>{event.title}</h3>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="text-sm font-medium text-trip-text-muted flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-trip-bg flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-trip-teal" />
                    </div>
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="text-sm font-medium text-trip-text-muted flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-trip-bg flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-trip-teal" />
                     </div>
                     {new Date(event.date).toLocaleTimeString(undefined, {timeStyle: 'short'})}
                  </div>
                   <div className="text-sm font-medium text-trip-text-muted flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-trip-bg flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-trip-teal" />
                     </div>
                     {event.maxAttendees} capacity
                  </div>
                </div>
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/events/${event._id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 py-2.5 rounded-full bg-trip-teal/10 text-trip-teal font-bold text-sm hover:bg-trip-teal hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === event._id}
                    onClick={() => handleDelete(event)}
                    className="inline-flex flex-1 items-center justify-center gap-2 py-2.5 rounded-full border border-red-200 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deletingId === event._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="bg-white rounded-[2rem] border border-trip-border p-16 text-center flex flex-col items-center shadow-sm">
            <div className="w-24 h-24 bg-trip-bg rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-10 h-10 text-trip-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-trip-text mb-2">No Hosted Events</h3>
            <p className="text-trip-text-muted mb-8 max-w-sm">You haven't created any events yet. Host your first experience right now!</p>
            <Link to="/events/create" className="px-8 py-3.5 rounded-full bg-trip-yellow text-trip-text font-bold tracking-wide hover:bg-[#ebbb38] transition-colors flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Host an Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
