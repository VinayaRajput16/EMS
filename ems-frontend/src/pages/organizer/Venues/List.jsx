import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerVenueList() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    organizerApi.getVenues().then(res => {
      setVenues(res.data.data);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg">My Venues</h2>
        <Link to="create" className="border px-3 py-1">
          Create Venue
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.map(v => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.location}</td>
              <td>{v.capacity}</td>
              <td>
                <Link to={v.id}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
