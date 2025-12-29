const API_BASE = "http://localhost:3000";

async function testCreateEvent(accessToken) {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      title: "Frontend Test Event",
      description: "Testing event module",
      startDateTime: "2025-06-10T10:00:00.000Z",
      endDateTime: "2025-06-10T18:00:00.000Z"
    })
  });

  const data = await res.json();
  console.log(res.status, data);
}

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMzc0MWJjNi00MGY5LTQ3YmYtYmJmZS01NzBlNjIzODE2NmIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjY5Mjk0OTYsImV4cCI6MTc2NjkzMDM5Nn0.hH9WlcG3X3RfnM1EqR_Mmv6IfCZafiS_BHq6z8n7Hp8";
testCreateEvent(accessToken);
