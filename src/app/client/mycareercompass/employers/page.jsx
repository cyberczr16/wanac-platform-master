"use client";

import React, { useState, useCallback, useMemo } from "react";
import { FaBuilding, FaPlus, FaTimes, FaEdit, FaGlobe, FaLinkedin } from "react-icons/fa";
import { Search } from "lucide-react";
import CareerCompassModal from "../../../../../components/dashboardcomponents/CareerCompassModal";

const INITIAL_EMPLOYERS = [
  { id: 1, name: "Tech Corp", industry: "Technology", status: "Applied", dateAdded: "Jan 15, 2025", website: "", notes: "" },
  { id: 2, name: "StartupXYZ", industry: "SaaS", status: "Interview", dateAdded: "Jan 10, 2025", website: "", notes: "Strong culture fit" },
  { id: 3, name: "Acme Industries", industry: "Manufacturing", status: "Saved", dateAdded: "Jan 5, 2025", website: "", notes: "" },
  { id: 4, name: "Global Solutions Inc", industry: "Consulting", status: "Contacted", dateAdded: "Dec 28, 2024", website: "", notes: "Spoke with recruiter" },
];

const STATUS_OPTIONS = ["Saved", "Applied", "Contacted", "Interview"];

const STATUS_STYLE = {
  Saved:     "bg-gray-100 text-gray-700",
  Applied:   "bg-blue-100 text-blue-700",
  Contacted: "bg-green-100 text-green-700",
  Interview: "bg-orange-100 text-orange-700",
};

const FILTER_TABS = ["All", ...STATUS_OPTIONS];

const EMPTY_FORM = {
  name: "",
  industry: "",
  status: "Saved",
  dateAdded: new Date().toISOString().slice(0, 10),
  website: "",
  notes: "",
};

function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return isNaN(d.getTime()) ? isoDate : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CompanyInitial({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const colors = [
    "bg-blue-100 text-blue-700", "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700", "bg-orange-100 text-orange-700",
    "bg-[#002147]/10 text-[#002147]",
  ];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${color}`}>
      {initial}
    </div>
  );
}

export default function EmployersPage() {
  const [employers, setEmployers] = useState(INITIAL_EMPLOYERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);

  const counts = useMemo(() => {
    const base = { All: employers.length };
    STATUS_OPTIONS.forEach((s) => { base[s] = employers.filter((e) => e.status === s).length; });
    return base;
  }, [employers]);

  const filtered = useMemo(() => {
    return employers.filter((e) => {
      const matchesFilter = activeFilter === "All" || e.status === activeFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || (e.industry || "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [employers, activeFilter, search]);

  const handleOpenAdd = useCallback(() => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, dateAdded: new Date().toISOString().slice(0, 10) });
    setFormError("");
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((emp) => {
    setEditingId(emp.id);
    setForm({ name: emp.name, industry: emp.industry || "", status: emp.status, dateAdded: emp.dateAdded, website: emp.website || "", notes: emp.notes || "" });
    setFormError("");
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => { setDialogOpen(false); setFormError(""); setEditingId(null); }, []);
  const handleChange = useCallback((e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }, []);

  const handleSubmit = useCallback(() => {
    if (!form.name?.trim()) { setFormError("Company name is required."); return; }
    if (editingId !== null) {
      setEmployers((prev) => prev.map((e) => e.id === editingId
        ? { ...e, name: form.name.trim(), industry: form.industry?.trim() || "—", status: form.status, dateAdded: formatDisplayDate(form.dateAdded), website: form.website?.trim() || "", notes: form.notes?.trim() || "" }
        : e
      ));
    } else {
      setEmployers((prev) => [...prev, {
        id: Date.now(), name: form.name.trim(), industry: form.industry?.trim() || "—",
        status: form.status, dateAdded: formatDisplayDate(form.dateAdded),
        website: form.website?.trim() || "", notes: form.notes?.trim() || "",
      }]);
    }
    handleClose();
  }, [form, editingId, handleClose]);

  const handleDelete = useCallback((id) => {
    setEmployers((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <FaBuilding className="text-[#002147]" />
            Employers
          </h2>
          <button onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm">
            <FaPlus size={10} /> Add Employer
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-5">Companies you&apos;ve saved, applied to, or contacted.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: counts.All, color: "text-[#002147]", bg: "bg-[#002147]/5 border-[#002147]/10" },
            { label: "Applied", value: counts.Applied, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
            { label: "Interview", value: counts.Interview, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
            { label: "Contacted", value: counts.Contacted, color: "text-green-600", bg: "bg-green-50 border-green-200" },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company or industry…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeFilter === tab ? "bg-[#002147] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {tab} <span className="opacity-70">({counts[tab] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards / Table */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-colors">
                <CompanyInitial name={emp.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{emp.name}</span>
                    {emp.industry && emp.industry !== "—" && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{emp.industry}</span>
                    )}
                  </div>
                  {emp.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{emp.notes}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">Added {emp.dateAdded}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLE[emp.status] || "bg-gray-100 text-gray-700"}`}>
                  {emp.status}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleOpenEdit(emp)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => setDeleteId(emp.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <FaBuilding className="mx-auto text-gray-300 mb-3 text-3xl" />
            <p className="text-sm font-medium text-gray-500">
              {search || activeFilter !== "All" ? "No employers match your filters" : "No employers added yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {search || activeFilter !== "All" ? "Try adjusting your search or filter" : "Save companies you want to apply to"}
            </p>
            {!search && activeFilter === "All" && (
              <button onClick={handleOpenAdd} className="mt-4 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
                Add First Employer
              </button>
            )}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">Showing {filtered.length} of {employers.length} employers</p>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Remove employer?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will remove <strong>{employers.find((e) => e.id === deleteId)?.name}</strong> from your list.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <CareerCompassModal
        open={dialogOpen}
        onClose={handleClose}
        title={editingId ? "Edit Employer" : "Add Employer"}
        icon={<FaBuilding size={14} />}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Save Changes" : "Add Employer"}
      >
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Company name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Company or organization"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
            <input type="text" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology, Healthcare"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
              {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date added</label>
            <input type="date" name="dateAdded" value={form.dateAdded} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
            <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" rows={2}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none resize-none" />
        </div>
        {formError && <p className="text-red-600 text-xs">⚠ {formError}</p>}
      </CareerCompassModal>
    </div>
  );
}
