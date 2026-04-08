"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  FaUserPlus,
  FaUserEdit,
  FaUserTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { X, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { cohortService } from "../../../services/api/cohort.service";

const STATUS_OPTIONS = ["Active", "Inactive", "Suspended"];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

/* ------------------------------------------------------------------ */
/*  Add / Edit Coach Modal                                            */
/* ------------------------------------------------------------------ */
function CoachFormModal({ coach, onClose, onSuccess }) {
  const isEditing = Boolean(coach);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState("Active");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!coach) return;
    setName(coach.name === "—" ? "" : coach.name);
    setEmail(coach.email === "—" ? "" : coach.email);
    setPhone(coach.phone === "—" ? "" : coach.phone);
    setSpecialty(coach.specialty || "");
    setStatus(STATUS_OPTIONS.includes(coach.status) ? coach.status : "Active");
  }, [coach]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      status,
    };
    if (!trimmed.name || !trimmed.email) {
      toast.error("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await cohortService.updateCoach(coach.id, trimmed);
        toast.success("Coach updated successfully.");
      } else {
        await cohortService.createCoach(trimmed);
        toast.success("Coach added successfully.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (isEditing ? "Failed to update coach." : "Failed to add coach.");
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <h2 className="text-lg font-bold text-[#002147]">
            {isEditing ? "Edit Coach" : "Add New Coach"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Name" id="coach-name" required>
            <input
              id="coach-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              autoComplete="name"
              placeholder="Full name"
            />
          </Field>
          <Field label="Email" id="coach-email" required>
            <input
              id="coach-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
              placeholder="email@example.com"
            />
          </Field>
          <Field label="Phone" id="coach-phone">
            <input
              id="coach-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field label="Specialty" id="coach-specialty">
            <input
              id="coach-specialty"
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="form-input"
              placeholder="e.g. Career Coaching"
            />
          </Field>
          <Field label="Status" id="coach-status">
            <select
              id="coach-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-input bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add Coach"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirm Delete Modal                                              */
/* ------------------------------------------------------------------ */
function ConfirmDeleteModal({ coach, onClose, onConfirm, deleting }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!coach) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Coach</h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to remove <strong>{coach.name}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium disabled:opacity-60 flex items-center gap-2"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable form field wrapper                                       */
/* ------------------------------------------------------------------ */
function Field({ label, id, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      <style jsx global>{`
        .form-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                      */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
  const colors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-200 text-gray-600",
    Suspended: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status || "—"}
    </span>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                         */
/* ================================================================== */
export default function ManageCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sort
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [deletingCoach, setDeletingCoach] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ---- Fetch ---- */
  const fetchCoaches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await cohortService.getCoaches();
      setCoaches(data);
    } catch {
      setError("Failed to load coaches. Please try again.");
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  /* ---- Filter + Sort + Paginate ---- */
  const filtered = useMemo(() => {
    let list = [...coaches];
    // Status filter
    if (statusFilter !== "All") {
      list = list.filter((c) => c.status === statusFilter);
    }
    // Search
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          String(c.name).toLowerCase().includes(q) ||
          String(c.email).toLowerCase().includes(q) ||
          String(c.specialty || "").toLowerCase().includes(q)
      );
    }
    // Sort
    list.sort((a, b) => {
      const aVal = String(a[sortField] || "").toLowerCase();
      const bVal = String(b[sortField] || "").toLowerCase();
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return list;
  }, [coaches, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize]);

  /* ---- Sort toggle ---- */
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <FaSortUp className="inline ml-1 -mb-0.5" size={12} />
    ) : (
      <FaSortDown className="inline ml-1 -mt-0.5" size={12} />
    );
  };

  /* ---- Delete handler ---- */
  const handleDelete = async () => {
    if (!deletingCoach) return;
    setDeleteLoading(true);
    try {
      await cohortService.deleteCoach(deletingCoach.id);
      toast.success("Coach removed successfully.");
      setCoaches((prev) => prev.filter((c) => String(c.id) !== String(deletingCoach.id)));
      setDeletingCoach(null);
    } catch {
      toast.error("Failed to remove coach.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-10 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002147] tracking-tight">
                  Coach Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {filtered.length} coach{filtered.length !== 1 && "es"} found
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCoach(null);
                  setFormOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
              >
                <FaUserPlus size={14} /> Add Coach
              </button>
            </div>

            {/* Toolbar: search + status filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by name, email, or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-blue-600" />
                <span className="ml-3 text-gray-500">Loading coaches...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500 mb-3">{error}</p>
                <button
                  onClick={fetchCoaches}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            { key: "name", label: "Name" },
                            { key: "email", label: "Email" },
                            { key: "phone", label: "Phone" },
                            { key: "specialty", label: "Specialty" },
                            { key: "status", label: "Status" },
                          ].map((col) => (
                            <th
                              key={col.key}
                              onClick={() => toggleSort(col.key)}
                              className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none"
                            >
                              {col.label}
                              <SortIcon field={col.key} />
                            </th>
                          ))}
                          <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paged.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                              No coaches match your search.
                            </td>
                          </tr>
                        ) : (
                          paged.map((coach) => (
                            <tr key={coach.id} className="hover:bg-gray-50/60 transition">
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">
                                {coach.name}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
                                {coach.email}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
                                {coach.phone || "—"}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
                                {coach.specialty || "—"}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <StatusBadge status={coach.status} />
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-right">
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={() => {
                                      setEditingCoach(coach);
                                      setFormOpen(true);
                                    }}
                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                    title="Edit Coach"
                                  >
                                    <FaUserEdit size={15} />
                                  </button>
                                  <button
                                    onClick={() => setDeletingCoach(coach)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                                    title="Remove Coach"
                                  >
                                    <FaUserTimes size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {PAGE_SIZE_OPTIONS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {(safePage - 1) * pageSize + 1}–
                        {Math.min(safePage * pageSize, filtered.length)} of{" "}
                        {filtered.length}
                      </span>
                      <button
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <FaChevronLeft size={12} />
                      </button>
                      <button
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {formOpen && (
        <CoachFormModal
          coach={editingCoach}
          onClose={() => {
            setFormOpen(false);
            setEditingCoach(null);
          }}
          onSuccess={fetchCoaches}
        />
      )}
      {deletingCoach && (
        <ConfirmDeleteModal
          coach={deletingCoach}
          onClose={() => setDeletingCoach(null)}
          onConfirm={handleDelete}
          deleting={deleteLoading}
        />
      )}
    </div>
  );
}
