// src/pages/admin/Events/Details.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminEventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api.get(`/api/admin/events/${id}`).then(res => setEvent(res.data.data));
  }, [id]);

  if (!event) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-600 font-medium">Loading event details...</p>
      </div>
    </div>
  );

  const statusConfig = {
    draft: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: 'Draft' },
    published: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Published' },
    ongoing: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Ongoing' },
    completed: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled' }
  };

  const currentStatus = statusConfig[event.status] || statusConfig.draft;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-slate-900">{event.title}</h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
              <span className={`w-2 h-2 rounded-full ${currentStatus.text.replace('text-', 'bg-')}`}></span>
              {currentStatus.label}
            </span>
          </div>
          <p className="text-slate-600">Event ID: #{id}</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
            Edit Event
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow-md transition-all font-medium text-sm">
            Publish
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Organizer Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-0.5">Organizer</p>
              <p className="text-lg font-semibold text-slate-900">
                {event.organizer?.name || 'Not assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Tickets Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-0.5">Ticket Types</p>
              <p className="text-lg font-semibold text-slate-900">
                {event.tickets?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Active
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-0.5">Total Orders</p>
              <p className="text-lg font-semibold text-slate-900">
                {event.orders?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-slate-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            View details
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-indigo-100 mb-0.5">Revenue</p>
              <p className="text-lg font-semibold">
                $0.00
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-indigo-100">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Track performance
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Event Information
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className="text-base font-medium text-slate-900 capitalize">{event.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Event ID</p>
                <p className="text-base font-medium text-slate-900">#{id}</p>
              </div>
            </div>

            {event.organizer && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-2">Organized By</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-indigo-700">
                      {event.organizer.name?.charAt(0) || 'O'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{event.organizer.name}</p>
                    <p className="text-sm text-slate-600">Event Organizer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3 group">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Public Page
            </button>
            
            <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3 group">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Details
            </button>
            
            <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3 group">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Duplicate Event
            </button>
            
            <div className="border-t border-slate-200 my-3"></div>
            
            <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3 group">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}