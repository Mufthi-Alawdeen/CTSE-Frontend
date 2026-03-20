import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight, Music, Heart, Star, Sparkles, Smile, Ticket, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Event } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get('/api/events').then(res => setEvents(res.data.events || [])).catch(() => {});
  }, []);

  const topEvents = events.slice(0, 4);
  const forYouEvents = events.slice(1, 4); 
  const nearByEvents = events.slice(2, 6);
  const upcomingEventsList = events.slice(0, 4);

  return (
    <div className="bg-trip-bg min-h-screen">
      {/* Yellow Hero Section */}
      <section className="bg-trip-yellow pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decorative elements representing the background pattern */}
        <div className="absolute left-10 top-24 w-16 h-16 opacity-80 animate-bounce" style={{animationDuration: '3s'}}>
          <div className="w-full h-full bg-white/20 rounded-lg rotate-12 flex items-center justify-center">
            <Ticket className="text-white w-8 h-8" />
          </div>
        </div>
        <div className="absolute right-20 top-32 w-24 h-24 opacity-80 animate-pulse" style={{animationDuration: '4s'}}>
          <div className="w-full h-full bg-trip-teal/20 rounded-full flex items-center justify-center">
            <Sparkles className="text-trip-teal w-12 h-12" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAiPjxwYXRoIGQ9Ik0wIDEwYzEwIDAgMjAgMTAgNDAgMTBzMzAtMTAgNDAtMTBTOTAgMjAgMTEwIDIwczMwLTEwIDQwLTEwIDMwIDEwIDUwIDEwdjEwSDB6IiBmaWxsPSIjRkFGQUZBIi8+PC9zdmc+')] bg-repeat-x bg-bottom" style={{backgroundSize: '200px 20px'}} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-trip-text tracking-tight mb-4 leading-tight">
            Your Ultimate Event Destination<br />
            Find, Book & Enjoy!
          </h1>
          <p className="text-trip-text/80 font-medium mb-10 max-w-lg mx-auto">
            Discover thousands of events: from concerts to conferences, we have what you're looking for.
          </p>

          <div className="relative max-w-2xl mx-auto flex items-center">
            <Search className="absolute left-6 text-trip-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search event, category..." 
              className="w-full pl-14 pr-32 py-4 rounded-full bg-white shadow-lg shadow-black/5 text-trip-text focus:outline-none focus:ring-2 focus:ring-trip-teal/50"
            />
            <button 
              onClick={() => navigate('/events')}
              className="absolute right-2 bg-trip-teal hover:bg-trip-teal-hover text-white px-8 py-2.5 rounded-full font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Discover Categories */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-trip-text mb-8">Discover Events You'll Love</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {['Music Concerts', 'Technology', 'Sports', 'Food & Drink', 'Workshops', 'Arts'].map((cat, i) => {
            const icons = [Music, Sparkles, Star, Heart, Smile, Ticket];
            const Icon = icons[i % icons.length];
            return (
              <div key={cat} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-20 h-20 rounded-full bg-white border border-trip-border shadow-sm flex items-center justify-center group-hover:border-trip-yellow group-hover:shadow-md transition-all">
                  <Icon className="w-8 h-8 text-trip-text-muted group-hover:text-trip-yellow transition-colors" />
                </div>
                <span className="text-sm font-semibold text-trip-text">{cat}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Events */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-trip-text">Top events</h2>
          <Link to="/events" className="text-trip-teal font-semibold text-sm hover:underline flex items-center gap-1">
            See All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topEvents.map(event => <EventCard key={event._id} event={event} />)}
          {!topEvents.length && <PlaceholderCards count={4} />}
        </div>
      </section>

      {/* Events For You (Mint Green Section) */}
      <section className="bg-trip-mint py-16 px-6 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-trip-text mb-6">Events For You</h2>
            <div className="flex justify-center gap-3 flex-wrap">
              {['All', 'Today', 'This Weekend', 'Free'].map((tag, i) => (
                <button key={tag} className={`px-6 py-2 rounded-full border ${i === 0 ? 'bg-trip-teal text-white border-trip-teal' : 'bg-transparent border-trip-text text-trip-text hover:bg-black/5'} font-semibold text-sm transition-colors`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forYouEvents.map(event => <ForYouCard key={event._id} event={event} />)}
            {!forYouEvents.length && <PlaceholderForYouCards count={3} />}
          </div>
        </div>
      </section>

      {/* Near By */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-trip-text">Events Near By Your City</h2>
          <Link to="/events" className="text-trip-teal font-semibold text-sm hover:underline flex items-center gap-1">
            See All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nearByEvents.map(event => <EventCard key={event._id} event={event} />)}
           {!nearByEvents.length && <PlaceholderCards count={4} />}
        </div>
      </section>

      {/* Upcoming Events List (Light Yellowish bg) */}
      <section className="bg-[#FAF7F0] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-trip-text">Upcoming Events</h2>
            <Link to="/events" className="text-trip-text font-semibold text-sm hover:underline flex items-center gap-1">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEventsList.map(event => (
              <div key={event._id} className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm border border-trip-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                   <div className="text-center w-16">
                      <div className="text-2xl font-black text-trip-text">{new Date(event.date).getDate()}</div>
                      <div className="text-sm font-semibold text-trip-text-muted uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-trip-text mb-2 line-clamp-1">{event.title}</h3>
                     <div className="flex gap-4 text-xs text-trip-text-muted font-medium">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Bookings open</span>
                     </div>
                   </div>
                </div>
                <Link to="/events" className="px-6 py-2.5 rounded-full border border-trip-teal text-trip-teal text-sm font-bold hover:bg-trip-teal hover:text-white transition-colors whitespace-nowrap">
                  Get Tickets
                </Link>
              </div>
            ))}
             {!upcomingEventsList.length && (
               <div className="text-center py-8 text-trip-text-muted">No upcoming events found.</div>
             )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-trip-text">Everything You Need To Know<br/>About Booking Events</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { q: "How do I book an event online with you?", a: "Booking is easy! Just find an event you like, click the 'Get Tickets' or 'Book' button, select the number of tickets, and complete the process. If you don't have an account, you'll need to sign in or create one first." },
            { q: "Can I cancel my tickets taking place tomorrow?", a: "" },
            { q: "How is the venue layout configured?", a: "" },
            { q: "Are group discounts available for bulk ticket purchases?", a: "" },
            { q: "What should I do if I didn't receive my email ticket confirmation?", a: "" },
          ].map((faq, i) => (
            <div key={i} className="bg-white border text-left border-trip-border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center cursor-pointer">
                <h4 className="font-bold text-trip-text">{faq.q}</h4>
                <ChevronDown className={`w-5 h-5 text-trip-text-muted ${i === 0 ? 'rotate-180' : ''}`} />
              </div>
              {i === 0 && <p className="text-sm text-trip-text-muted mt-4 leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Teal Banner CTA */}
      <section className="pb-20 px-6 max-w-6xl mx-auto">
        <div className="bg-trip-teal rounded-[2rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl" />
           
           <div className="relative z-10 max-w-md">
             <h2 className="text-3xl md:text-4xl font-black text-trip-text mb-4">Get Your First Ticket</h2>
             <p className="text-trip-text/80 font-medium mb-8">Sign up today to start discovering the best events in your city and secure your spot instantly.</p>
             <div className="flex bg-white rounded-full p-1 shadow-lg">
               <input type="email" placeholder="Enter your email" className="bg-transparent pl-4 flex-1 focus:outline-none text-sm text-trip-text" />
               <button onClick={() => navigate('/signup')} className="bg-trip-text text-white px-6 py-2.5 rounded-full text-sm font-bold">Subscribe</button>
             </div>
           </div>

           <div className="relative z-10 mt-10 md:mt-0 right-0 md:bg-white/10 p-6 rounded-3xl">
              <div className="w-48 h-32 bg-white rounded-xl shadow-xl transform rotate-12 flex items-center justify-center border-4 border-[#ff6b6b]">
                 <span className="text-2xl font-black text-[#ff6b6b] tracking-widest uppercase">TICKET</span>
              </div>
              <div className="absolute top-4 -left-4 w-48 h-32 bg-trip-teal rounded-xl shadow-xl transform -rotate-6 flex items-center justify-center border-4 border-white backdrop-blur-sm">
                 <span className="text-2xl font-black text-white tracking-widest uppercase">TICKET</span>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}

// Components
function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white border border-trip-border rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-trip-bg relative overflow-hidden flex justify-center items-center">
        <span className="text-8xl font-black text-trip-border mix-blend-multiply opacity-50">{event.title.charAt(0)}</span>
        <div className="absolute top-3 left-3 bg-trip-yellow text-trip-text text-xs font-bold px-3 py-1 rounded-md">
          {new Date(event.date).getDate()} {new Date(event.date).toLocaleString('default', { month: 'short' })}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-trip-text mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-xs text-trip-text-muted flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</p>
        <p className="text-xs text-trip-text-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(event.date).toLocaleTimeString(undefined, {timeStyle: 'short'})}</p>
      </div>
    </div>
  );
}

function ForYouCard({ event }: { event: Event }) {
  return (
     <div className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform shadow-sm hover:shadow-xl">
      <div className="h-40 bg-trip-text relative overflow-hidden flex justify-center items-center">
        <span className="text-8xl font-black text-white/10 uppercase">{event.title.charAt(0)}</span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-trip-text mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-trip-text-muted mb-6 line-clamp-2 min-h-[40px]">{event.description}</p>
        <div className="bg-[#f8f9fa] rounded-2xl p-4 flex justify-between items-center border border-trip-border">
          <div>
            <div className="text-xs text-trip-text-muted font-medium mb-1">Time Remaining</div>
            <div className="flex gap-4">
               <div><span className="font-bold text-trip-text">07</span><span className="text-xs text-trip-text-muted ml-0.5">m</span></div>
               <div><span className="font-bold text-trip-text">14</span><span className="text-xs text-trip-text-muted ml-0.5">d</span></div>
               <div><span className="font-bold text-trip-text">25</span><span className="text-xs text-trip-text-muted ml-0.5">s</span></div>
            </div>
          </div>
          <div className="bg-trip-yellow text-trip-text p-2 rounded-lg"><Ticket className="w-5 h-5"/></div>
        </div>
      </div>
    </div>
  );
}

// Fallbacks for empty state
function PlaceholderCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({length: count}).map((_, i) => (
        <div key={i} className="bg-white border border-trip-border rounded-2xl overflow-hidden opacity-50">
          <div className="aspect-[4/3] bg-trip-bg"></div>
          <div className="p-5 space-y-3">
             <div className="h-4 bg-trip-bg rounded w-3/4"></div>
             <div className="h-3 bg-trip-bg rounded w-1/2"></div>
             <div className="h-3 bg-trip-bg rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </>
  );
}

function PlaceholderForYouCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({length: count}).map((_, i) => (
         <div key={i} className="bg-white rounded-3xl overflow-hidden opacity-50">
          <div className="h-40 bg-trip-bg"></div>
          <div className="p-6 space-y-4">
             <div className="h-5 bg-trip-bg rounded w-3/4"></div>
             <div className="h-10 bg-trip-bg rounded"></div>
             <div className="h-16 bg-trip-border/50 rounded-2xl"></div>
          </div>
        </div>
      ))}
    </>
  );
}
