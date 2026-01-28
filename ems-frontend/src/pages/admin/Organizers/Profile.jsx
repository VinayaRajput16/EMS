// src/pages/admin/Organizers/Profile.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api/axios";

export default function OrganizerProfile() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    api.get("/users").then(res => {
      const user = res.data.find(u => u.id === id);
      setOrganizer(user);
    });
  }, [id]);

  if (!organizer) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header with Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link 
              to="/admin/organizers" 
              className="flex items-center hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Organizers
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-900">{organizer.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
            {/* Profile Header */}
            <div className="flex flex-col items-center lg:flex-row lg:items-start lg:space-x-6 w-full">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-center lg:text-left flex-1 mt-6 lg:mt-0">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {organizer.name}
                </h1>
                <p className="mt-2 text-sm text-gray-500 flex items-center justify-center lg:justify-start">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 7.27c.883.883 2.317.883 3.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Organizer Account • ID: {organizer.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Details Card */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Profile Information
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-2 block">Full Name</label>
                  <div className="text-2xl font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {organizer.name}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-2 block">Email Address</label>
                  <div className="text-lg font-mono text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 rounded-xl border-2 border-gray-200 shadow-sm">
                    {organizer.email}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-2 block">Account Status</label>
                  <div className={`inline-flex px-6 py-3 rounded-xl text-lg font-semibold shadow-lg ${
                    organizer.is_active
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
                      : 'bg-red-100 text-red-800 border-2 border-red-200'
                  }`}>
                    {organizer.is_active ? "Active" : "Blocked"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Quick Actions
              </h2>
            </div>
            <div className="p-8 space-y-4">
              <Link
                to="../"
                className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ← Back to Organizers
              </Link>
              
              {/* Note: Block/Unblock moved to list view for better UX */}
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-900">
                      Account Status Management
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Use the <strong>Block/Unblock</strong> actions from the organizers list to manage account status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
