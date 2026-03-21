import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../types';
import { Ticket, Calendar, MapPin, Trash2, Loader2, ArrowRight, CheckCircle2, TicketX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await api.get(`/api/bookings/${user?.id}`);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    const result = await Swal.fire({
      title: 'Cancel booking?',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No',
    });
    if (!result.isConfirmed) return;
    setCancellingId(bookingId);
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (error: any) {
      await Swal.fire({
        title: 'Failed to cancel booking',
        text: error.response?.data?.error || 'Failed to cancel booking',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-trip-teal animate-spin mb-4" />
        <p className="text-trip-text-muted font-medium">Fetching your tickets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trip-bg pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-trip-text">My Tickets</h1>
          <p className="mt-2 text-trip-text-muted font-medium text-lg">Manage your upcoming event reservations.</p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm border overflow-hidden relative ${
                booking.status === 'cancelled'
                  ? 'border-trip-border bg-trip-bg/50'
                  : 'border-trip-border hover:shadow-md hover:border-trip-teal/30 transition-all'
              }`}
            >
              {/* Ticket Edge Decoration */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-trip-bg border-r border-trip-border"></div>
              <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-trip-bg border-l border-trip-border"></div>

              <div className="flex items-start gap-6 w-full pl-2">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0 ${
                  booking.status === 'cancelled'
                    ? 'bg-trip-border/50'
                    : 'bg-trip-yellow'
                }`}>
                  <Ticket className={`w-8 h-8 sm:w-10 sm:h-10 ${booking.status === 'cancelled' ? 'text-trip-text-muted' : 'text-trip-text'}`} />
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                     <h3 className={`text-xl sm:text-2xl font-bold tracking-tight line-clamp-1 ${booking.status === 'cancelled' ? 'text-trip-text-muted line-through' : 'text-trip-text'}`}>
                       {booking.eventTitle}
                     </h3>
                     <div className="flex flex-col items-end">
                       <span className={`text-sm font-black tracking-wider ${booking.status === 'cancelled' ? 'text-trip-text-muted' : 'text-trip-teal'}`}>
                         x{booking.ticketCount}
                       </span>
                       <span className="text-[10px] font-bold text-trip-text-muted uppercase">Tickets</span>
                     </div>
                  </div>
                 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center gap-2 text-trip-text-muted text-sm font-medium">
                      <Calendar className="w-4 h-4 text-trip-teal" />
                      {new Date(booking.eventDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                    <div className="flex items-center gap-2 text-trip-text-muted text-sm font-medium">
                      <MapPin className="w-4 h-4 text-trip-teal" />
                      <span className="truncate">{booking.eventLocation}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-dashed border-trip-border flex items-center justify-between">
                     <p className="text-xs font-semibold text-trip-text-muted uppercase tracking-wider">
                       Booking ID: <span className="font-mono text-trip-text">{booking._id.substring(0, 8)}</span>
                     </p>
                     
                     {booking.status === 'confirmed' ? (
                       <span className="flex items-center gap-1.5 text-xs font-bold text-trip-teal uppercase px-3 py-1 bg-trip-teal/10 rounded-full">
                         <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                       </span>
                     ) : (
                       <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase px-3 py-1 bg-red-500/10 rounded-full">
                         <TicketX className="w-3.5 h-3.5" /> Cancelled
                       </span>
                     )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="w-full sm:w-auto flex justify-end shrink-0 sm:border-l sm:border-dashed sm:border-trip-border sm:pl-6">
                {booking.status === 'confirmed' && (
                  <button
                    id={`cancel-booking-${booking._id}`}
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                    className="w-full sm:w-[120px] py-3 rounded-xl bg-white border border-trip-border text-red-500 font-bold text-sm tracking-wide hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-1.5"
                    title="Cancel Booking"
                  >
                    {cancellingId === booking._id ? (
                      <div className="w-5 h-5 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Cancel
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="bg-white rounded-[2rem] border border-trip-border p-16 text-center flex flex-col items-center shadow-sm">
            <div className="w-24 h-24 bg-trip-bg rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-10 h-10 text-trip-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-trip-text mb-2">No Tickets Yet</h3>
            <p className="text-trip-text-muted mb-8 max-w-sm">You haven't booked any events yet. Explore our huge catalog of events and save your spot today!</p>
            <Link to="/events" className="px-8 py-3.5 rounded-full bg-trip-teal text-white font-bold tracking-wide hover:bg-trip-teal-hover transition-colors shadow-lg shadow-trip-teal/20 flex items-center gap-2">
              Explore Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
