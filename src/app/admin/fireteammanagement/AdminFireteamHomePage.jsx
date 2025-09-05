import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function AdminFireteamHomePage({ fireteams = [], onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Fireteams");

  const filteredFireteams = useMemo(() => {
    return fireteams.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "All Fireteams" ||
        (filter === "Client" && f.type === "client") ||
        (filter === "Coach" && f.type === "coach");
      return matchesSearch && matchesFilter;
    });
  }, [fireteams, search, filter]);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Fireteam Management</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={onAdd}
          >
            <FaPlus /> Add Fireteam
          </button>
        </div>
        {/* Search and Filter */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search Fireteams"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white"
            >
              <option>All Fireteams</option>
              <option>Client</option>
              <option>Coach</option>
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="text-xs text-gray-400 border-b">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="px-4 font-medium">Description</th>
                <th className="px-4 font-medium">Type</th>
                <th className="px-4 font-medium">Members</th>
                <th className="px-4 font-medium">Admin</th>
                <th className="px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFireteams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No fireteams found.</td>
                </tr>
              ) : (
                filteredFireteams.map((f) => (
                  <tr key={f.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors group">
                    <td className="py-4 px-4 font-semibold align-middle">{f.name}</td>
                    <td className="px-4 align-middle">{f.description}</td>
                    <td className="px-4 align-middle">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${f.type === 'coach' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{f.type.charAt(0).toUpperCase() + f.type.slice(1)}</span>
                    </td>
                    <td className="px-4 align-middle">
                      {f.members.map((m, i) => (
                        <span key={i} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs mr-1 mb-1">{m}</span>
                      ))}
                    </td>
                    <td className="px-4 align-middle">{f.admin}</td>
                    <td className="px-4 align-middle">
                      <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => onEdit(f)} title="Edit"><FaEdit /></button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(f)} title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
