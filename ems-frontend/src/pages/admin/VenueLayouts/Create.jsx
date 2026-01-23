// src/pages/admin/VenueLayouts/Create.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function LayoutCreate() {
  const [name, setName] = useState("");
  const [layoutType, setLayoutType] = useState("ROW");
  const [schema, setSchema] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    await adminApi.createLayout({ name, layoutType, schema: JSON.parse(schema) });
    nav("/admin/venue-layouts");
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <h2>Create Layout</h2>
      <input className="border p-2 w-full" placeholder="Name" onChange={e=>setName(e.target.value)} />
      <select className="border p-2 w-full" onChange={e=>setLayoutType(e.target.value)}>
        <option value="ROW">Row-Column</option>
        <option value="ROUND">Round Table</option>
      </select>
      <textarea className="border p-2 w-full" placeholder='Schema JSON' onChange={e=>setSchema(e.target.value)} />
      <button className="border px-4 py-2">Save</button>
    </form>
  );
}
