// src/pages/admin/Analytics.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/api/admin/events").then(res => setEvents(res.data.data));
    api.get("/api/admin/orders").then(res => setOrders(res.data.data));
    api.get("/api/admin/order-stats").then(res => setStats(res.data.data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg">Platform Analytics</h2>

      <section>
        <h3 className="font-medium">Events</h3>
        <p>Total events: {events.length}</p>
      </section>

      <section>
        <h3 className="font-medium">Orders</h3>
        <p>Total orders: {orders.length}</p>
      </section>

      <section>
        <h3 className="font-medium">Order Status Breakdown</h3>
        {stats?.statusBreakdown?.map(s => (
          <p key={s.status}>
            {s.status}: {s._count}
          </p>
        ))}
      </section>
    </div>
  );
}
