// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import AdminEventList from "./pages/admin/Events/List";
import AdminEventDetails from "./pages/admin/Events/Details";
import OrganizerList from "./pages/admin/Organizers/List";
import OrganizerProfile from "./pages/admin/Organizers/Profile";
import AdminAnalytics from "./pages/admin/Analytics";
import OrganizerLogin from "./pages/organizer/Login";
import OrganizerLayout from "./layouts/OrganizerLayout";
import OrganizerDashboard from "./pages/organizer/Dashboard";
import OrganizerVenueCreate from "./pages/organizer/Venues/Create";
import OrganizerEventList from "./pages/organizer/Events/List";
import OrganizerEventView from "./pages/organizer/Events/View";
import SeatCategoryList from "./pages/organizer/SeatCategories/List";
import SeatCategoryCreate from "./pages/organizer/SeatCategories/Create";
import OrganizerTicketManage from "./pages/organizer/Tickets/Manage";
import Home from "./pages/Home.jsx";
import OrganizerEventCreate from "./pages/organizer/Events/Create.jsx";
import OrganizerEventPublish from "./pages/organizer/Events/Publish.jsx";
import OrganizerVenueView from "./pages/organizer/Venues/View.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
          <Route path="events" element={<AdminEventList />} />
          <Route path="events/:id" element={<AdminEventDetails />} />
          <Route path="organizers" element={<OrganizerList />} />
          <Route path="organizers/:id" element={<OrganizerProfile />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        
        <Route path="/organizer/login" element={<OrganizerLogin />} />
        {/* Organizer Routes */}
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<OrganizerDashboard />} />
          <Route path="dashboard" element={<OrganizerDashboard />} />

          <Route path="events">
            <Route index element={<OrganizerEventList />} />
            <Route path="create" element={<OrganizerEventCreate />} />
            <Route path=":id" element={<OrganizerEventView />} />
            <Route path=":id/venue/create" element={<OrganizerVenueCreate />} />
            <Route path=":id/venue/view" element={<OrganizerVenueView />} />
            <Route path=":id/seat-categories" element={<SeatCategoryList />} />
            <Route path=":id/seat-categories/create" element={<SeatCategoryCreate />} />
            <Route path=":id/tickets" element={<OrganizerTicketManage />} />
            <Route path=":id/publish" element={<OrganizerEventPublish />} />
          </Route>
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
