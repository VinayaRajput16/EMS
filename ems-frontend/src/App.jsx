import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Home from './pages/public/Home.jsx';
import OrganizerDashboard from './pages/organizer/Dashboard.jsx';
import EventList from './pages/organizer/event/EventList.jsx';
import EventCreate from './pages/organizer/event/EventCreate.jsx';
import TicketSetup from './pages/organizer/ticket/TicketSetup.jsx';
import EventTickets from './pages/public/EventTickets.jsx';
import Bookings from './pages/user/Bookings.jsx';
import SeatManagement from './pages/organizer/seat/SeatManagement.jsx';
import EventEditor from './pages/organizer/event/EventEditor.jsx';
import EventVenueEditor from './pages/organizer/event/EventVenueEditor.jsx';
import EventPublish from './pages/organizer/event/EventPublish.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminVenueList from './pages/admin/venue/VenueList.jsx';
import AdminVenueCreate from './pages/admin/venue/VenueCreate.jsx';


function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

function AppContent() {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ✅ User Routes */}
      <Route path="/user/*" element={
        <ProtectedRoute allowedRoles={['USER', 'ORGANIZER']}>
          <Routes>
            <Route path="bookings" element={<Bookings />} />
            <Route index element={<Navigate to="bookings" replace />} />
          </Routes>
        </ProtectedRoute>
      } />

      {/* ✅ Public Event Tickets */}
      <Route path="/event/:eventId/tickets" element={<EventTickets />} />
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Venues */}
            <Route path="venues" element={<AdminVenueList />} />
            <Route path="venues/create" element={<AdminVenueCreate />} />
          </Routes>
        </ProtectedRoute>
      } />

      {/* ✅ Organizer Routes */}
      <Route path="/organizer/*" element={
        <ProtectedRoute allowedRoles={['ORGANIZER']}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OrganizerDashboard />} />

            {/* ✅ Events - CLEAN STRUCTURE */}
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventCreate />} />
            <Route path="events/:eventId" element={<EventEditor />} />
            <Route path="events/:eventId/venue" element={<EventVenueEditor />} />
            <Route path="events/:eventId/seats" element={<SeatManagement />} />
            <Route path="events/:eventId/tickets" element={<TicketSetup />} />
            <Route path="events/:eventId/publish" element={<EventPublish />} />

            {/* ✅ Venues */}

          </Routes>
        </ProtectedRoute>
      } />

      {/* ✅ 404 Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
