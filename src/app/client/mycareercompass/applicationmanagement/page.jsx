"use client";

import React, { useState, useCallback, useMemo } from "react";
import { FaClipboardList, FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import { Search } from "lucide-react";
import CareerCompassModal from "../../../../../components/dashboardcomponents/CareerCompassModal";

const INITIAL_APPLICATIONS = [
  { id: 1, company: "Tech Corp", role: "Software Engineer", status: "Pending", dateApplied: "Jan 20, 2025", notes: "" },
  { id: 2, company: "StartupXYZ", role: "Full Stack Developer", status: "Interview", dateApplied: "Jan 12, 2025", notes: "Second round scheduled for Feb 3" },
  { id: 3, company: "DataFlow Inc", role: "Backend Developer", status: "Rejected", dateApplied: "Jan 5, 2025", notes: "" },
  { id: 4, company: "CloudNine", role: "DevOps Engineer", status: "Offered", dateApplied: "Dec 28, 2024", notes: "Offer letter received" },
];

const STATUS_OPTIONS = ["Pending", "Interview", "Rejected", "Offered"];

const STATUS_STYLE = {
  Pending:   "bg-amber-100 text-amber-700",
  Interview: "bg-orange-100 text-orange-700",
  Rejected:  "bg-red-100 text-red-700",
  Offered:   "bg-green-100 text-green-700",
};

const FILTER_TABS = ["All", ...STATUS_OPTIONS];

const EMPTY_FORM = {
  company: "",
  role: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  status: "Pending",
  notes: "",
};

function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return isNaN(d.getTime()) ? isoDate : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ApplicationManagementPage() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);

  // Derived counts
  const counts = useMemo(() => {
    const base = { All: applications.length };
    STATUS_OPTIONS.forEach((s) => { base[s] = applications.filter((a) => a.status === s).length; });
    return base;
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchesFilter = activeFilter === "All" || a.status === activeFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [applications, activeFilter, search]);

  const handleOpenAdd = useCallback(() => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((app) => {
    setEditingId(app.id);
    setForm({
      company: app.company,
      role: app.role,
      dateApplied: app.dateApplied,
      status: app.status,
      notes: app.notes || "",
    });
    setFormError("");
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setFormError("");
    setEditingId(null);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.company?.trim()) { setFormError("Company is required."); return; }
    if (!form.role?.trim()) { setFormError("Role is required."); return; }

    if (editingId !== null) {
      setApplications((prev) =>
        prev.map((a) => a.id === editingId
          ? { ...a, company: form.company.trim(), role: form.role.trim(), status: form.status, dateApplied: formatDisplayDate(form.dateApplied), notes: form.notes?.trim() || "" }
          : a
        )
      );
    } else {
      setApplications((prev) => [
        ...prev,
        {
          id: Date.now(),
          company: form.company.trim(),
          role: form.role.trim(),
          status: form.status,
          dateApplied: formatDisplayDate(form.dateApplied),
          notes: form.notes?.trim() || "",
        },
      ]);
    }
    handleClose();
  }, [form, editingId, handleClose]);

  const handleDelete = useCallback((id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <FaClipboardList className="text-[#002147]" />
            Application Management
          </h2>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm"
          >
            <FaPlus size={10} /> Add Application
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-5">Track all your job applications and their status in one place.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: counts.All, color: "text-[#002147]", bg: "bg-[#002147]/5 border-[#002147]/10" },
            { label: "Pending", value: counts.Pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
            { label: "Interview", value: counts.Interview, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
            { label: "Offered", value: counts.Offered, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          ].map((s) => (
            <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeFilter === tab
                    ? "bg-[#002147] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab} {counts[tab] !== undefined && <span className="opacity-70">({counts[tab]})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 gap-3 px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-2">Company / Role</div>
              <div>Status</div>
              <div>Date Applied</div>
              <div>Actions</div>
            </div>
            {filtered.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-5 gap-3 px-4 py-3 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2">
                  <div className="font-semibold text-gray-900 text-sm">{app.company}</div>
                  <div className="text-xs text-gray-500">{app.role}</div>
                  {app.notes && <div className="text-xs text-gray-400 mt-0.5 truncate">{app.notes}</div>}
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[app.status] || "bg-gray-100 text-gray-700"}`}>
                    {app.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{app.dateApplied}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenEdit(app)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => setDeleteId(app.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <FaClipboardList className="mx-auto text-gray-300 mb-3 text-3xl" />
            <p className="text-sm font-medium text-gray-500">
              {search || activeFilter !== "All" ? "No applications match your filters" : "No applications yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {search || activeFilter !== "All" ? "Try adjusting your search or filter" : "Start tracking your job applications"}
            </p>
            {!search && activeFilter === "All" && (
              <button onClick={handleOpenAdd} className="mt-4 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
                Add First Application
              </button>
            )}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">Showing {filtered.length} of {applications.length} applications</p>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Delete application?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove <strong>{applications.find((a) => a.id === deleteId)?.company}</strong> from your list.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <CareerCompassModal
        open={dialogOpen}
        onClose={handleClose}
        title={editingId ? "Edit Application" : "Add Application"}
        icon={<FaClipboardList size={14} />}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Save Changes" : "Add Application"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company name"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
            <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Job title"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date applied</label>
            <input type="date" name="dateApplied" value={form.dateApplied} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
              {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none resize-none" />
        </div>
        {formError && <p className="text-red-600 text-xs">⚠ {formError}</p>}
      </CareerCompassModal>
    </div>
  );
}
