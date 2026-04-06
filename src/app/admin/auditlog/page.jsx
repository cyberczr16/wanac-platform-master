"use client";

import React, { useState, useMemo } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";

// Icons as inline SVGs
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// Mock admin data
const ADMIN_NAMES = ["Sarah Chen", "Marcus Rodriguez", "Emily Thompson", "David Kumar", "Lisa Wong"];

// Mock audit log data
const generateMockAuditLog = () => {
  const now = new Date();
  const actions = [
    { type: "User Created", color: "green", description: "Created new user account" },
    { type: "User Updated", color: "blue", description: "Updated user profile information" },
    { type: "User Deleted", color: "red", description: "Deleted user account" },
    { type: "Role Changed", color: "purple", description: "Modified user role" },
    { type: "Session Modified", color: "indigo", description: "Updated session details" },
    { type: "Program Updated", color: "teal", description: "Modified program settings" },
    { type: "Settings Changed", color: "orange", description: "Updated system settings" },
    { type: "Login", color: "gray", description: "Admin login event" },
    { type: "Password Reset", color: "yellow", description: "User password reset" },
    { type: "Permission Granted", color: "blue", description: "Granted user permission" },
  ];

  const entities = ["User #2041", "User #2089", "Session #445", "Program A", "Settings", "User #1923", "Session #501", "Role Definition", "User #2150", "Batch Update"];

  const logs = [];
  for (let i = 0; i < 28; i++) {
    const daysAgo = Math.floor(i / 4);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000);
    const action = actions[Math.floor(Math.random() * actions.length)];

    logs.push({
      id: i + 1,
      timestamp,
      admin: ADMIN_NAMES[Math.floor(Math.random() * ADMIN_NAMES.length)],
      actionType: action.type,
      actionColor: action.color,
      description: action.description,
      entity: entities[Math.floor(Math.random() * entities.length)],
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      details: {
        before: { status: "inactive", role: "user" },
        after: { status: "active", role: "coach" },
      },
    });
  }

  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

// Detail Modal Component
const DetailModal = ({ log, onClose }) => {
  if (!log) return null;

  const admin = log.admin || "Unknown Admin";
  const initials = admin.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#002147]">Action Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Timestamp</label>
            <p className="text-gray-600">{log.timestamp.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Admin</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <p className="text-gray-600">{admin}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Action Type</label>
            <p className="text-gray-600">{log.actionType}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Entity</label>
            <p className="text-gray-600">{log.entity}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">IP Address</label>
            <p className="text-gray-600 font-mono">{log.ipAddress}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Changes</label>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Before:</p>
                <div className="text-xs text-gray-600 font-mono bg-white rounded p-2">
                  {JSON.stringify(log.details.before, null, 2)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">After:</p>
                <div className="text-xs text-gray-600 font-mono bg-white rounded p-2">
                  {JSON.stringify(log.details.after, null, 2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button className="flex-1 px-4 py-2 bg-[#002147] text-white rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2">
            Export <ExternalLinkIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#002147]">{value}</p>
      </div>
    </div>
  </div>
);

const StatIconBriefcase = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 6h-2.18c.11-.31.18-.645.18-1a2.996 2.996 0 0 0-5.364-1.818L12 4.118l-2.646-1.936A2.992 2.992 0 0 0 4 5c0 .355.07.69.18 1H4c-1.1 0-1.99.9-1.99 2L2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
  </svg>
);

const StatIconClock = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.99 5C6.47 5 2 9.48 2 15s4.47 10 9.99 10C17.52 25 22 20.52 22 15S17.52 5 11.99 5zM15.5 15.5h-4V9h1.5v4.5h2.5v1.5z" />
  </svg>
);

const StatIconAlert = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const StatIconUser = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

// Action Badge Component
const ActionBadge = ({ type, color }) => {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
    indigo: "bg-indigo-100 text-indigo-800",
    teal: "bg-teal-100 text-teal-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.gray}`}>
      {type}
    </span>
  );
};

export default function AuditLogPage() {
  const [logs] = useState(generateMockAuditLog());
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionType, setActionType] = useState("All");
  const [performedBy, setPerformedBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique admin names and action types from logs
  const uniqueAdmins = [...new Set(logs.map(log => log.admin))].sort();
  const uniqueActionTypes = ["All", ...new Set(logs.map(log => log.actionType))].sort();

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Date range filter
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (log.timestamp < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (log.timestamp > to) return false;
      }

      // Action type filter
      if (actionType !== "All" && log.actionType !== actionType) {
        return false;
      }

      // Performed by filter
      if (performedBy !== "all" && log.admin !== performedBy) {
        return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.admin.toLowerCase().includes(query) ||
          log.actionType.toLowerCase().includes(query) ||
          log.entity.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.ipAddress.includes(query)
        );
      }

      return true;
    });
  }, [logs, dateFrom, dateTo, actionType, performedBy, searchQuery]);

  // Calculate stats
  const totalEvents = logs.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEvents = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  }).length;

  const criticalEvents = logs.filter(log =>
    ["User Deleted", "Role Changed", "Settings Changed"].includes(log.actionType)
  ).length;

  const activeAdmins = new Set(logs.map(log => log.admin)).size;

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setActionType("All");
    setPerformedBy("all");
    setSearchQuery("");
  };

  return (
    <div className="h-screen flex bg-white font-sans overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-8 sticky top-0 z-10">
          <h1 className="text-3xl font-bold text-[#002147] mb-2">Audit Log</h1>
          <p className="text-gray-600">Track all administrative actions and system changes</p>
        </div>

        {/* Stats Strip */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={StatIconBriefcase}
            label="Total Events"
            value={totalEvents}
            color="bg-[#002147]"
          />
          <StatCard
            icon={StatIconClock}
            label="Today's Events"
            value={todayEvents}
            color="bg-[#f97316]"
          />
          <StatCard
            icon={StatIconAlert}
            label="Critical Events"
            value={criticalEvents}
            color="bg-red-500"
          />
          <StatCard
            icon={StatIconUser}
            label="Active Admins"
            value={activeAdmins}
            color="bg-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#002147] flex items-center gap-2">
              <FilterIcon />
              Filters
            </h2>
            {(dateFrom || dateTo || actionType !== "All" || performedBy !== "all" || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-sm text-[#f97316] font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>
            </div>

            {/* Action Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] appearance-none bg-white"
              >
                {uniqueActionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Performed By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performed By</label>
              <select
                value={performedBy}
                onChange={(e) => setPerformedBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] appearance-none bg-white"
              >
                <option value="all">All Admins</option>
                {uniqueAdmins.map(admin => (
                  <option key={admin} value={admin}>{admin}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="flex-1 overflow-y-auto p-8">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-lg font-medium">No audit logs found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const admin = log.admin || "Unknown Admin";
                const initials = admin.split(" ").map(n => n[0]).join("").toUpperCase();

                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#f97316] transition cursor-pointer p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <ActionBadge type={log.actionType} color={log.actionColor} />
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {log.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium text-sm mb-1">{admin}</p>
                          <p className="text-gray-600 text-sm mb-2">{log.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            <span>Entity: <span className="font-medium text-gray-700">{log.entity}</span></span>
                            <span>IP: <span className="font-mono text-gray-700">{log.ipAddress}</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="text-gray-400 flex-shrink-0 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
