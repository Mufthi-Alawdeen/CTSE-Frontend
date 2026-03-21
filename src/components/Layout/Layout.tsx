import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Ticket } from "lucide-react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // Do not render the Layout shell for Auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-trip-bg flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

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
            <Link to="/" className="hover:text-trip-teal transition-colors">
              Home
            </Link>
            <Link
              to="/events"
              className="hover:text-trip-teal transition-colors"
            >
              Events
            </Link>
            <Link
              to="/login"
              className="hover:text-trip-teal transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-trip-text-muted">
          © 2026 TicketGo. All rights reserved. Your ultimate event destination.
        </p>
      </footer>
    </div>
  );
}

