import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Event } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, Ticket, Loader2, Search, Minus, Plus, X } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [bookingModal, setBookingModal] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (event: Event) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setTicketCount(1);
    setBookingModal(event);
  };

  const confirmBooking = async () => {
    if (!bookingModal) return;
    setBookingId(bookingModal._id);
    try {
      await api.post('/api/bookings', {
        eventId: bookingModal._id,
        ticketCount,
      });
      alert(`🎉 Successfully booked ${ticketCount} ticket${ticketCount > 1 ? 's' : ''}! Check "My Bookings" to see your reservation.`);
      setBookingModal(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    } finally {
      setBookingId(null);
    }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-trip-bg min-h-screen">
      {/* Page Header */}
      <section className="bg-trip-yellow pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight text-trip-text mb-2">Explore Events</h1>
            <p className="text-trip-text/80 font-medium max-w-md">Find the perfect event for you and your friends. Book tickets in seconds.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trip-text-muted" />
            <input
              id="event-search"
              type="text"
              placeholder="Search by title or location..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white shadow-sm border border-trip-border text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-trip-teal animate-spin" />
            <p className="text-trip-text-muted font-medium">Loading amazing events...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((event) => (
                <div key={event._id} className="bg-white border border-trip-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-trip-bg relative overflow-hidden flex flex-col justify-center items-center cursor-pointer" onClick={() => openBookingModal(event)}>
                    <span className="text-8xl font-black text-trip-border mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform duration-500">{event.title.charAt(0)}</span>
                    <div className="absolute top-3 left-3 bg-trip-yellow text-trip-text text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                      {new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-trip-text mb-2 line-clamp-1 text-lg flex-1" title={event.title}>{event.title}</h3>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-medium text-trip-text-muted flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-trip-teal" /> <span className="truncate">{event.location}</span>
                      </p>
                      <p className="text-xs font-medium text-trip-text-muted flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-trip-teal" /> {new Date(event.date).toLocaleTimeString(undefined, {timeStyle: 'short'})}
                      </p>
                       <p className="text-xs font-medium text-trip-text-muted flex items-center gap-2">
                         <Users className="w-4 h-4 text-trip-teal" /> {event.maxAttendees} capacity
                      </p>
                    </div>

                    <button
                      id={`book-event-${event._id}`}
                      onClick={() => openBookingModal(event)}
                      className="w-full py-2.5 rounded-full bg-trip-teal/10 text-trip-teal font-bold text-sm hover:bg-trip-teal hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      {user ? 'Get Tickets' : 'Sign in to Book'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="p-16 text-center rounded-3xl border border-trip-border bg-white flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-trip-bg flex items-center justify-center mb-2">
                  <Search className="w-8 h-8 text-trip-text-muted" />
                </div>
                <h3 className="text-xl font-bold text-trip-text">No Events Found</h3>
                <p className="text-trip-text-muted">{search ? 'Try adjusting your search terms.' : 'Check back later for exciting new events!'}</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-trip-text/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-trip-yellow p-6 relative text-center">
              <button
                onClick={() => setBookingModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/30 text-trip-text hover:bg-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <Ticket className="w-6 h-6 text-trip-teal" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-trip-text line-clamp-1">{bookingModal.title}</h3>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="bg-trip-bg rounded-2xl p-4 border border-trip-border mb-8 space-y-3">
                <div className="flex items-center gap-3 text-trip-text-muted text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Calendar className="w-4 h-4 text-trip-teal" />
                  </div>
                  {new Date(bookingModal.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                </div>
                <div className="flex items-center gap-3 text-trip-text-muted text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <MapPin className="w-4 h-4 text-trip-teal" />
                  </div>
                  {bookingModal.location}
                </div>
              </div>

              <div className="mb-8 text-center">
                <label className="block text-sm font-bold text-trip-text mb-4">
                  How many tickets?
                </label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-12 h-12 rounded-full bg-trip-bg border border-trip-border text-trip-text hover:bg-white hover:border-trip-teal hover:text-trip-teal transition-all flex items-center justify-center shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-4xl font-black text-trip-text w-12">{ticketCount}</span>
                  <button
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                    className="w-12 h-12 rounded-full bg-trip-bg border border-trip-border text-trip-text hover:bg-white hover:border-trip-teal hover:text-trip-teal transition-all flex items-center justify-center shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                id="confirm-booking"
                onClick={confirmBooking}
                disabled={bookingId === bookingModal._id}
                className="w-full py-4 rounded-full bg-trip-teal text-white font-bold tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {bookingId === bookingModal._id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  `Confirm ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
