"use client";

import { useMemo, useState } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  ClipboardList,
  Search,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Circle,
  Archive,
  Eye,
  X,
} from "lucide-react";

const INITIAL_ITEMS = [
  {
    id: 1,
    submittedAt: "2026-04-04T14:22:00",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    role: "Coach",
    message:
      "It would help to bulk-export session notes for compliance reviews. Happy to join a beta if available.",
    status: "new",
  },
  {
    id: 2,
    submittedAt: "2026-04-03T09:15:00",
    name: "Sam Rivera",
    email: "sam.r@example.com",
    role: "Client",
    message:
      "Love the dashboard. Small bug: calendar sometimes shows the wrong timezone for group sessions.",
    status: "reviewed",
  },
  {
    id: 3,
    submittedAt: "2026-03-28T16:40:00",
    name: "Taylor Chen",
    email: "t.chen@example.com",
    role: "Coach",
    message:
      "Request for a short FAQ on how fireteam rosters sync with cohort assignments.",
    status: "archived",
  },
];

function statusBadge(status) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (status === "new") return `${base} bg-blue-100 text-blue-800`;
  if (status === "reviewed") return `${base} bg-emerald-100 text-emerald-800`;
  return `${base} bg-gray-200 text-gray-700`;
}

export default function AdminFeedbackPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    return items.filter((row) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.message.toLowerCase().includes(q);
      const matchesFilter = filter === "all" || row.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  const counts = useMemo(() => {
    return {
      total: items.length,
      new: items.filter((i) => i.status === "new").length,
      reviewed: items.filter((i) => i.status === "reviewed").length,
      archived: items.filter((i) => i.status === "archived").length,
    };
  }, [items]);

  const setStatus = (id, status) => {
    setItems((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
    setDetail((d) => (d && d.id === id ? { ...d, status } : d));
  };

  return (
    <div className="h-screen flex bg-white font-body overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white px-8 py-6 shadow-sm shrink-0">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="h-8 w-8 opacity-90" />
            Feedback inbox
          </h1>
          <p className="text-blue-100 mt-1">
            Review submissions from coaches and clients. Connect an API later to replace sample data.
          </p>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-[#002147]">{counts.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-500">New</div>
              <div className="text-2xl font-bold text-blue-700">{counts.new}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-500">Reviewed</div>
              <div className="text-2xl font-bold text-emerald-700">{counts.reviewed}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-500">Archived</div>
              <div className="text-2xl font-bold text-gray-700">{counts.archived}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search name, email, or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] outline-none text-sm"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm min-w-[140px]"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">From</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Preview</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        No feedback matches your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/80">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {new Date(row.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#002147]">{row.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" />
                            {row.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{row.role}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-md truncate">{row.message}</td>
                        <td className="px-4 py-3">
                          <span className={statusBadge(row.status)}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setDetail(row)}
                            className="inline-flex items-center gap-1 text-[#002147] hover:underline text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-detail-title"
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
              <div>
                <h2 id="feedback-detail-title" className="text-lg font-semibold text-[#002147]">
                  Feedback detail
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(detail.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-gray-800">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{detail.name}</span>
                <span className="text-gray-400">·</span>
                <span className="text-sm text-gray-600">{detail.role}</span>
              </div>
              <div className="text-sm text-gray-600 break-all">{detail.email}</div>
              <div className="text-gray-800 whitespace-pre-wrap border border-gray-100 rounded-lg p-4 bg-gray-50">
                {detail.message}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatus(detail.id, "new")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                >
                  <Circle className="h-4 w-4" />
                  Mark new
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(detail.id, "reviewed")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark reviewed
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(detail.id, "archived")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
