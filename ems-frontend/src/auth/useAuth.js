// src/auth/useAuth.js
// No external libraries used (exam-safe, minimal)

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getUserFromToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return decodeJwt(token);
}
