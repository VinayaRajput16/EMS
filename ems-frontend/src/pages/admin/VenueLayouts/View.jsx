// src/pages/admin/VenueLayouts/View.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function LayoutView() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    adminApi.getLayout(id).then(res => setItem(res.data.data));
  }, [id]);

  if (!item) return null;

  return (
    <div>
      <h2>{item.name}</h2>
      <pre className="bg-gray-100 p-2">{JSON.stringify(item.schema, null, 2)}</pre>
    </div>
  );
}
