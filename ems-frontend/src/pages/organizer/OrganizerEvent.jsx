import { Link } from "react-router-dom";

const OrganizerDashboard = () => {
  return (
    <div>
      <h1>Organizer Dashboard</h1>

      <div style={{ marginTop: 20 }}>
        <Link to="/organizer/events">
          <button>Manage Events</button>
        </Link>

        <Link to="/organizer/events/create">
          <button>Create Event</button>
        </Link>

        <Link to="/organizer/venues">
          <button>Manage Venues</button>
        </Link>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
