import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

// System layout types (must match Prisma enum)
const LAYOUT_TYPES = {
  GALLERY: "GALLERY",
  ROW_COLUMN: "ROW_COLUMN",
  ROUND_TABLE: "ROUND_TABLE",
  OPEN_CROWD: "OPEN_CROWD",
};

export default function OrganizerVenueCreate() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  // Basic venue info
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [layoutType, setLayoutType] = useState(LAYOUT_TYPES.ROW_COLUMN);

  // Layout configs
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(20);

  const [tables, setTables] = useState(10);
  const [seatsPerTable, setSeatsPerTable] = useState(8);

  const [capacity, setCapacity] = useState(200); // OPEN_CROWD

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let layoutConfig;

    switch (layoutType) {
      case LAYOUT_TYPES.ROW_COLUMN:
      case LAYOUT_TYPES.GALLERY:
        layoutConfig = {
          rows: Number(rows),
          columns: Number(columns),
        };
        break;

      case LAYOUT_TYPES.ROUND_TABLE:
        layoutConfig = {
          tables: Number(tables),
          seatsPerTable: Number(seatsPerTable),
        };
        break;

      case LAYOUT_TYPES.OPEN_CROWD:
        layoutConfig = {
          capacity: Number(capacity),
        };
        break;

      default:
        setError("Invalid layout type");
        setLoading(false);
        return;
    }

    try {
      await organizerApi.createVenueForEvent(eventId, {
        name,
        location,
        layoutType,
        layoutConfig,
      });

      // NEXT STEP: Seat categories
      navigate(`/organizer/events/${eventId}/seat-categories/create`);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to create venue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Create Venue</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Venue name */}
          <div>
            <label className="block font-medium mb-1">Venue Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Layout type */}
          <div>
            <label className="block font-medium mb-1">Layout Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value)}
              disabled={loading}
            >
              <option value={LAYOUT_TYPES.ROW_COLUMN}>
                Row / Column (Theater)
              </option>
              <option value={LAYOUT_TYPES.GALLERY}>Gallery</option>
              <option value={LAYOUT_TYPES.ROUND_TABLE}>
                Round Tables (Banquet)
              </option>
              <option value={LAYOUT_TYPES.OPEN_CROWD}>
                Open Crowd (Standing)
              </option>
            </select>
          </div>

          {/* ROW / GALLERY */}
          {(layoutType === LAYOUT_TYPES.ROW_COLUMN ||
            layoutType === LAYOUT_TYPES.GALLERY) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Rows</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">Columns</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ROUND TABLE */}
          {layoutType === LAYOUT_TYPES.ROUND_TABLE && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Tables</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  value={tables}
                  onChange={(e) => setTables(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">Seats per Table</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  value={seatsPerTable}
                  onChange={(e) => setSeatsPerTable(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* OPEN CROWD */}
          {layoutType === LAYOUT_TYPES.OPEN_CROWD && (
            <div>
              <label className="text-sm">Capacity</label>
              <input
                type="number"
                min="1"
                className="w-full border rounded px-3 py-2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          )}

          {/* PREVIEW */}
          <div>
            <h3 className="font-semibold mb-2">Preview</h3>

            {(layoutType === LAYOUT_TYPES.ROW_COLUMN ||
              layoutType === LAYOUT_TYPES.GALLERY) && (
              <div
                className="inline-grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 16px)`,
                }}
              >
                {Array.from({ length: rows * columns }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gray-400 rounded-sm"
                  />
                ))}
              </div>
            )}

            {layoutType === LAYOUT_TYPES.ROUND_TABLE && (
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: tables }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-xs"
                  >
                    {seatsPerTable}
                  </div>
                ))}
              </div>
            )}

            {layoutType === LAYOUT_TYPES.OPEN_CROWD && (
              <div className="border rounded p-6 text-center text-gray-600">
                Open standing crowd — capacity {capacity}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate(`/organizer/events/${eventId}`)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Saving..." : "Next: Seat Categories"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
