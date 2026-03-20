import type { ReactNode } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-trip-bg flex flex-col">
      {/* Top Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-trip-teal flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-trip-text">
              Ticket<span className="font-medium">Go</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <NavBtn to="/" label="Home" end />
              <NavBtn to="/events" label="Events" />
              {user && <NavBtn to="/events/mine" label="My Events" />}
              {user && <NavBtn to="/bookings" label="My Bookings" />}
            </nav>

            <div className="flex items-center gap-3 border-l border-trip-border/30 pl-6">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-trip-border">
                    <UserIcon className="w-4 h-4 text-trip-teal" />
                    <span className="text-sm font-bold text-trip-text">{user.username}</span>
                  </div>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="p-2 rounded-full text-trip-text-muted hover:text-red-500 hover:bg-white transition-all shadow-sm bg-white/50"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-white text-trip-text text-sm font-bold hover:shadow-md transition-all border border-trip-border"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-trip-text bg-white/50 rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-xl px-6 py-4 space-y-2 absolute top-20 left-0 right-0 border-b border-trip-border animate-in slide-in-from-top-2">
            <MobileNavBtn to="/" label="Home" onClick={() => setMobileOpen(false)} end />
            <MobileNavBtn to="/events" label="Events" onClick={() => setMobileOpen(false)} />
            {user && <MobileNavBtn to="/events/mine" label="My Events" onClick={() => setMobileOpen(false)} />}
            {user && <MobileNavBtn to="/bookings" label="My Bookings" onClick={() => setMobileOpen(false)} />}
            <div className="pt-3 border-t border-trip-border mt-3">
              {user ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-red-500 text-sm font-bold">
                  Sign Out ({user.username})
                </button>
              ) : (
                <div className="flex gap-3 px-4 py-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-6 py-2 rounded-full bg-trip-teal text-white text-sm font-bold w-full text-center">Log In</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-6 py-2 rounded-full bg-white border border-trip-border text-trip-text text-sm font-bold w-full text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-trip-bg pt-16 pb-8 border-t border-trip-border mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between border-b border-trip-border pb-8 mb-8">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-trip-teal flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-trip-text">
              Ticket<span className="font-medium">Go</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-trip-text-muted">
            <Link to="/" className="hover:text-trip-teal transition-colors">Home</Link>
            <Link to="/events" className="hover:text-trip-teal transition-colors">Events</Link>
            <Link to="/login" className="hover:text-trip-teal transition-colors">Sign In</Link>
          </div>
        </div>
        <p className="text-center text-xs text-trip-text-muted">
          © 2026 TicketGo. All rights reserved. Your ultimate event destination.
        </p>
      </footer>
    </div>
  );
}

function NavBtn({ to, label, end = false }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `text-sm font-semibold transition-colors ${
          isActive
            ? 'text-trip-text'
            : 'text-trip-text-muted hover:text-trip-teal'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function MobileNavBtn({ to, label, onClick, end = false }: { to: string; label: string; onClick: () => void; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-trip-bg text-trip-text'
            : 'text-trip-text-muted hover:text-trip-teal hover:bg-trip-bg/50'
        }`
      }
    >
      {label}
    </NavLink>
  );
}
