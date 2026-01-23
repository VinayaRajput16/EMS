import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerVenueCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [templates, setTemplates] = useState([]);
  const [layoutTemplateId, setLayoutTemplateId] = useState("");
  const [layoutConfig, setLayoutConfig] = useState({});

  useEffect(() => {
    organizerApi.getLayoutTemplates().then((res) => {
      setTemplates(res.data?.data ?? res.data);
    });
  }, []);

  const selectedTemplate = templates.find(
    (t) => t.id === layoutTemplateId
  );

  // IMPORTANT: schema.fields (not schema directly)
  const schemaFields = selectedTemplate?.schema?.fields;
  console.log("schemaFields", schemaFields);

  async function handleSubmit(e) {
    e.preventDefault();

    await organizerApi.createVenue({
      name,
      location,
      capacity: Number(capacity),
      layoutTemplateId,
      layoutConfig, // { rows: x, columns: y }
    });

    navigate("/organizer/venues");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg">Create Venue</h2>

      <input
        className="border p-2 w-full"
        placeholder="Venue Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full"
        value={layoutTemplateId}
        onChange={(e) => {
          setLayoutTemplateId(e.target.value);
          setLayoutConfig({});
        }}
        required
      >
        <option value="">Select Layout Template</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.layoutType})
          </option>
        ))}
      </select>

      {/* DYNAMIC FIELDS: rows, columns */}

      {schemaFields &&
        schemaFields.map((field) => (
          <input
            key={field.key}
            type="number"
            className="border p-2 w-full"
            placeholder={`${field.key} (${field.min} - ${field.max})`}
            value={layoutConfig[field.key] ?? ""}
            onChange={(e) =>
              setLayoutConfig((prev) => ({
                ...prev,
                [field.key]: Number(e.target.value),
              }))
            }
            required
          />
        ))}

      <button className="border px-4 py-2">Create Venue</button>
    </form>
  );
}
