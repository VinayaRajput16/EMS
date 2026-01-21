import { useState } from "react";
import { venueApi } from "../../../api/venueApi";
import { useNavigate } from "react-router-dom";

const VenueCreate = () => {
  const [form, setForm] = useState({ name: "", location: "", capacity: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await venueApi.create({
      ...form,
      capacity: Number(form.capacity),
    });
    navigate("/admin/venues");
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Location" onChange={e => setForm({ ...form, location: e.target.value })} />
      <input type="number" placeholder="Capacity" onChange={e => setForm({ ...form, capacity: e.target.value })} />
      <button>Create Venue</button>
    </form>
  );
};

export default VenueCreate;
