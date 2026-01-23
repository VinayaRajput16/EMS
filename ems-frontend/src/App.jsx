// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import LayoutList from "./pages/admin/VenueLayouts/List";
import LayoutCreate from "./pages/admin/VenueLayouts/Create";
import LayoutView from "./pages/admin/VenueLayouts/View";
import LayoutEdit from "./pages/admin/VenueLayouts/Edit";
import AdminEventList from "./pages/admin/Events/List";
import AdminEventDetails from "./pages/admin/Events/Details";
import OrganizerList from "./pages/admin/Organizers/List";
import OrganizerProfile from "./pages/admin/Organizers/Profile";
import AdminAnalytics from "./pages/admin/Analytics";
import OrganizerLogin from "./pages/organizer/Login";
import OrganizerLayout from "./layouts/OrganizerLayout";
import OrganizerDashboard from "./pages/organizer/Dashboard";
import OrganizerVenueList from "./pages/organizer/Venues/List";
import OrganizerVenueCreate from "./pages/organizer/Venues/Create";
import OrganizerVenueView from "./pages/organizer/Venues/View";
import OrganizerEventList from "./pages/organizer/Events/List";
import OrganizerEventCreate from "./pages/organizer/Events/Create";
import OrganizerEventView from "./pages/organizer/Events/View";
import OrganizerAssignVenue from "./pages/organizer/Events/AssignVenue";
import OrganizerEventEdit from "./pages/organizer/Events/Edit";
import SeatCategoryList from "./pages/organizer/SeatCategories/List";
import SeatCategoryCreate from "./pages/organizer/SeatCategories/Create";
import OrganizerTicketManage from "./pages/organizer/Tickets/Manage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole role="ADMIN">
                <AdminLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="venue-layouts" element={<LayoutList />} />
          <Route path="venue-layouts/create" element={<LayoutCreate />} />
          <Route path="venue-layouts/:id" element={<LayoutView />} />
          <Route path="venue-layouts/:id/edit" element={<LayoutEdit />} />
          <Route path="events" element={<AdminEventList />} />
          <Route path="events/:id" element={<AdminEventDetails />} />
          <Route path="organizers" element={<OrganizerList />} />
          <Route path="organizers/:id" element={<OrganizerProfile />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="/organizer/login" element={<OrganizerLogin />} />
        <Route
          path="/organizer"
          element={
            <RequireAuth>
              <RequireRole role="ORGANIZER">
                <OrganizerLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<OrganizerDashboard />} />
          <Route path="venues" element={<OrganizerVenueList />} />
          <Route path="venues/create" element={<OrganizerVenueCreate />} />
          <Route path="venues/:id" element={<OrganizerVenueView />} />
          <Route path="events" element={<OrganizerEventList />} />
          <Route path="events/create" element={<OrganizerEventCreate />} />
          <Route path="events/:id" element={<OrganizerEventView />} />
          <Route path="/organizer/events/:id/assign-venue" element={<OrganizerAssignVenue />} />
          <Route path="/organizer/events/:id/edit" element={<OrganizerEventEdit />} />
          <Route
            path="/organizer/events/:id/seat-categories"
            element={<SeatCategoryList />}
          />
          <Route path="/organizer/venues/:venueId/seat-categories/create" element={<SeatCategoryCreate />} />
          <Route path="events/:id/tickets" element={<OrganizerTicketManage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
