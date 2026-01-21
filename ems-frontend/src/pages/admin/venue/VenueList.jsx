import { useEffect, useState } from "react";
import { venueApi } from "../../../api/venueApi";

const VenueList = ({ onSelect }) => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    venueApi.getAll().then(res => setVenues(res.data.data));
  }, []);

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Choose venue</option>
      {venues.map(v => (
        <option key={v.id} value={v.id}>
          {v.name} ({v.location})
        </option>
      ))}
    </select>
  );
};

export default VenueList;
