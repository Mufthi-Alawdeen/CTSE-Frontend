import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import HomePage from './pages/HomePage';
import EventsPage from './pages/Events/EventsPage';
import CreateEventPage from './pages/Events/CreateEventPage';
import MyEventsPage from './pages/Events/MyEventsPage';
import BookingsPage from './pages/Booking/BookingsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />

        {/* Protected routes */}
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/events/create" element={user ? <CreateEventPage /> : <Navigate to="/login" />} />
        <Route path="/events/mine" element={user ? <MyEventsPage /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={user ? <BookingsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Layout>
  );
}
