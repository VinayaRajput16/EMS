// src/pages/admin/VenueLayouts/Edit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function LayoutEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [schema, setSchema] = useState("");

  useEffect(() => {
    adminApi.getLayout(id).then(res => setSchema(JSON.stringify(res.data.data.schema)));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    await adminApi.updateLayout(id, { schema: JSON.parse(schema) });
    nav("/admin/venue-layouts");
  }

  return (
    <form onSubmit={submit}>
      <h2>Edit Layout</h2>
      <textarea className="border p-2 w-full" value={schema} onChange={e=>setSchema(e.target.value)} />
      <button className="border px-4 py-2">Update</button>
    </form>
  );
}