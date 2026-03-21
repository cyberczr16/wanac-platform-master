"use client";

import React, { useState, useCallback, useMemo } from "react";
import { FaBullseye, FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import { Search, Target } from "lucide-react";
import CareerCompassModal from "../../../../../components/dashboardcomponents/CareerCompassModal";

const INITIAL_TARGETS = [
  { id: 1, name: "Tech Corp", industry: "Technology", priority: "High", nextStep: "Apply", notes: "" },
  { id: 2, name: "StartupXYZ", industry: "SaaS", priority: "High", nextStep: "Follow up", notes: "Already spoke with recruiter" },
  { id: 3, name: "Acme Industries", industry: "Manufacturing", priority: "Medium", nextStep: "Research", notes: "" },
  { id: 4, name: "Global Solutions Inc", industry: "Consulting", priority: "Medium", nextStep: "Connect on LinkedIn", notes: "" },
  { id: 5, name: "BioHealth Partners", industry: "Healthcare", priority: "Low", nextStep: "Research", notes: "" },
];

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const NEXT_STEP_SUGGESTIONS = ["Apply", "Research", "Follow up", "Connect on LinkedIn", "Request informational interview", "Other"];

const PRIORITY_STYLE = {
  High:   "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
  Low:    "bg-gray-100 text-gray-600 border-gray-200",
};

const FILTER_TABS = ["All", "High", "Medium", "Low"];

const EMPTY_FORM = { name: "", industry: "", priority: "Medium", nextStep: "", notes: "" };

function CompanyInitial({ name, priority }) {
  const colors = {
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-blue-100 text-blue-700",
    Low: "bg-gray-100 text-gray-600",
  };
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${colors[priority] || colors.Medium}`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function TargetEmployersPage() {
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);

  const counts = useMemo(() => {
    const base = { All: targets.length };
    PRIORITY_OPTIONS.forEach((p) => { base[p] = targets.filter((t) => t.priority === p).length; });
    return base;
  }, [targets]);

  const filtered = useMemo(() => {
    return targets.filter((t) => {
      const matchesFilter = activeFilter === "All" || t.priority === activeFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || (t.industry || "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [targets, activeFilter, search]);

  const handleOpenAdd = useCallback(() => { setEditingId(null); setForm(EMPTY_FORM); setFormError(""); setDialogOpen(true); }, []);
  const handleOpenEdit = useCallback((t) => {
    setEditingId(t.id);
    setForm({ name: t.name, industry: t.industry || "", priority: t.priority, nextStep: t.nextStep || "", notes: t.notes || "" });
    setFormError(""); setDialogOpen(true);
  }, []);
  const handleClose = useCallback(() => { setDialogOpen(false); setFormError(""); setEditingId(null); }, []);
  const handleChange = useCallback((e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }, []);

  const handleSubmit = useCallback(() => {
    if (!form.name?.trim()) { setFormError("Company name is required."); return; }
    if (editingId !== null) {
      setTargets((prev) => prev.map((t) => t.id === editingId
        ? { ...t, name: form.name.trim(), industry: form.industry?.trim() || "—", priority: form.priority, nextStep: form.nextStep?.trim() || "—", notes: form.notes?.trim() || "" }
        : t
      ));
    } else {
      setTargets((prev) => [...prev, {
        id: Date.now(), name: form.name.trim(), industry: form.industry?.trim() || "—",
        priority: form.priority, nextStep: form.nextStep?.trim() || "—", notes: form.notes?.trim() || "",
      }]);
    }
    handleClose();
  }, [form, editingId, handleClose]);

  const handleDelete = useCallback((id) => { setTargets((prev) => prev.filter((t) => t.id !== id)); setDeleteId(null); }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <FaBullseye className="text-[#002147]" />
            Target Employers
          </h2>
          <button onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm">
            <FaPlus size={10} /> Add Target
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-5">Companies you&apos;re targeting. Track research and next steps.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "On List", value: counts.All, color: "text-[#002147]", bg: "bg-[#002147]/5 border-[#002147]/10" },
            { label: "High Priority", value: counts.High, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
            { label: "Medium Priority", value: counts.Medium, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
            { label: "Low Priority", value: counts.Low, color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
          ].map((s) => (
            <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Priority Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company or industry…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none" />
          </div>
          <div className="flex gap-1.5">
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

        {/* Target Cards */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-colors">
                <CompanyInitial name={t.name} priority={t.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                    {t.industry && t.industry !== "—" && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{t.industry}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {t.nextStep && t.nextStep !== "—" && (
                      <span className="text-xs text-gray-500">
                        Next: <span className="font-medium text-gray-700">{t.nextStep}</span>
                      </span>
                    )}
                  </div>
                  {t.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{t.notes}</p>}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.Medium}`}>
                  {t.priority}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleOpenEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <Target className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-medium text-gray-500">
              {search || activeFilter !== "All" ? "No targets match your filters" : "No target employers yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {search || activeFilter !== "All" ? "Try adjusting your search or priority filter" : "Add companies you want to pursue"}
            </p>
            {!search && activeFilter === "All" && (
              <button onClick={handleOpenAdd} className="mt-4 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
                Add First Target
              </button>
            )}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">Showing {filtered.length} of {targets.length} targets</p>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Remove target employer?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will remove <strong>{targets.find((t) => t.id === deleteId)?.name}</strong> from your targets.
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
        title={editingId ? "Edit Target Employer" : "Add Target Employer"}
        icon={<FaBullseye size={14} />}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Save Changes" : "Add Target"}
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
              {PRIORITY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Next step</label>
          <input type="text" name="nextStep" value={form.nextStep} onChange={handleChange}
            placeholder="e.g. Apply, Research, Connect on LinkedIn"
            list="nextStepSuggestions"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          <datalist id="nextStepSuggestions">
            {NEXT_STEP_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
          </datalist>
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
