// src/pages/organizer/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function OrganizerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    navigate("/organizer/dashboard");
  }

  return (
    <form onSubmit={submit} className="p-8 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Organizer Login</h1>
      <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-4" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button className="border px-4 py-2">Login</button>
    </form>
  );
}
