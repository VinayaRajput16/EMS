import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p className="text-gray-500">
            System configuration & platform management
          </p>
        </div>
      </div>

      {/* Core Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Venue Management */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Venues</h2>
          <p className="text-sm text-gray-500 mb-4">
            Create venues and define seating layouts
          </p>

          <div className="space-y-3">
            <Link
              to="/admin/venues"
              className="block w-full text-center px-4 py-2 rounded bg-indigo-600 text-white"
            >
              View Venues
            </Link>

            <Link
              to="/admin/venues/create"
              className="block w-full text-center px-4 py-2 rounded border"
            >
              Create Venue
            </Link>
          </div>
        </div>

        {/* Seat Layouts */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Seat Layouts</h2>
          <p className="text-sm text-gray-500 mb-4">
            Define seat categories and layouts
          </p>

          <div className="space-y-3">
            <Link
              to="/admin/venues"
              className="block w-full text-center px-4 py-2 rounded bg-green-600 text-white"
            >
              Manage Seat Layouts
            </Link>
          </div>
        </div>

        {/* Analytics */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-sm text-gray-500 mb-4">
            Platform-wide metrics & usage
          </p>

          <div className="space-y-3">
            <Link
              to="/admin/analytics"
              className="block w-full text-center px-4 py-2 rounded bg-gray-900 text-white"
            >
              View Analytics
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
