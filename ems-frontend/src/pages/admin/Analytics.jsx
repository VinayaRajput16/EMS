// src/pages/admin/Analytics.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventsRes, ordersRes, statsRes] = await Promise.all([
          api.get("/api/admin/events"),
          api.get("/api/admin/orders"),
          api.get("/api/admin/order-stats")
        ]);
        setEvents(eventsRes.data.data);
        setOrders(ordersRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const totalOrders = stats?.statusBreakdown?.reduce((sum, s) => sum + s._count, 0) || 0;
  const maxCount = stats?.statusBreakdown?.length > 0 ? Math.max(...stats.statusBreakdown.map(s => s._count)) : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mr-6 flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Platform Analytics</h1>
              <p className="mt-2 text-lg text-gray-600">Key metrics and insights at a glance</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white shadow-xl rounded-2xl border border-gray-200 animate-pulse overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="p-8 space-y-4">
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Events Card */}
              <div className="group bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500 focus-within:ring-opacity-25">
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md" role="img" aria-label="Events icon">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" id="events-label">Total Events</p>
                      <span className="sr-only">events count</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-4xl font-bold text-gray-900 mb-2" aria-labelledby="events-label">
                    {events.length.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Live events across all organizers
                  </p>
                </div>
              </div>

              {/* Orders Card */}
              <div className="group bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-emerald-500 focus-within:ring-opacity-25">
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md" role="img" aria-label="Orders icon">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" id="orders-label">Total Orders</p>
                      <span className="sr-only">orders count</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-4xl font-bold text-gray-900 mb-2" aria-labelledby="orders-label">
                    {orders.length.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed transactions
                  </p>
                </div>
              </div>

              {/* Total Stats Card */}
              <div className="group bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-purple-500 focus-within:ring-opacity-25">
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md" role="img" aria-label="Platform stats icon">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 0v6m0-6l-2 2m2-2l2 2M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" id="stats-label">Total Processed</p>
                      <span className="sr-only">total orders processed</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-4xl font-bold text-gray-900 mb-2" aria-labelledby="stats-label">
                    {totalOrders.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Across all order statuses</p>
                </div>
              </div>
            </div>

            {/* Order Status Breakdown */}
            {stats?.statusBreakdown?.length > 0 && (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Order Status Distribution
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full" role="table" aria-label="Order status breakdown">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Count</th>
                        <th scope="col" className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.statusBreakdown.map((s) => {
                        const percentage = maxCount > 0 ? ((s._count / maxCount) * 100).toFixed(1) : 0;
                        return (
                          <tr key={s.status} className="hover:bg-gray-50 focus-within:bg-gray-50">
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span 
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold shadow-sm border capitalize ${
                                  s.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                  s.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  s.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-right">
                              <span className="text-2xl font-bold text-gray-900">{s._count.toLocaleString()}</span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-right">
                              <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {(!isLoading && (!stats || stats.statusBreakdown?.length === 0)) && (
          <div className="text-center py-24 max-w-md mx-auto" role="alert" aria-live="polite">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No analytics data yet</h3>
            <p className="text-lg text-gray-600 mb-8">Platform activity will appear here as events and orders are created</p>
          </div>
        )}
      </div>
    </div>
  );
}
