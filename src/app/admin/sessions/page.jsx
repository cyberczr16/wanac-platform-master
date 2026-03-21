"use client";
import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  Plus, Search, Edit, Trash2, Calendar, X, Loader2,
  CheckCircle2, AlertCircle, Clock, BarChart3
} from "lucide-react";
import { sessionsService } from "../../../services/api/sessions.service";
import { normalizeSessions } from "../../../lib/sessions";

const emptyForm = { title: "", description: "", date: "", time: "" };

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in transition-all ${
      toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
    }`}>
      {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-red-100 rounded-full">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Delete Session?</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          This action cannot be undone. The session and all its data will be permanently removed.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Delete Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState(emptyForm);
  const [editSessionId, setEditSessionId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setFetchError("");
      try {
        const response = await sessionsService.getSessions();
        setSessions(normalizeSessions(response));
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        setFetchError("Could not load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!Array.isArray(sessions)) { setFilteredSessions([]); return; }
    const q = search.toLowerCase().trim();
    let result = q
      ? sessions.filter(
          (s) =>
            (s.title && s.title.toLowerCase().includes(q)) ||
            (s.description && (s.description + "").toLowerCase().includes(q))
        )
      : sessions;
    if (statusFilter !== "All") result = result.filter(s => s.status === statusFilter);
    setFilteredSessions(result);
  }, [search, sessions, statusFilter]);

  const handleInputChange = (e) => setNewSession({ ...newSession, [e.target.name]: e.target.value });

  const handleEditClick = (session) => {
    setEditSessionId(session.id);
    setNewSession({
      title: session.title || "",
      description: session.description || "",
      date: session.date || "",
      time: session.time || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSession.title.trim() || !newSession.date || !newSession.time) return;
    const scheduled_at = new Date(`${newSession.date}T${newSession.time}`).toISOString();
    const payload = {
      title: newSession.title.trim(),
      description: (newSession.description || "").trim(),
      scheduled_at,
    };
    setSubmitLoading(true);
    try {
      if (editSessionId) {
        const updated = await sessionsService.updateSession(editSessionId, payload);
        setSessions((prev) =>
          prev.map((s) => (s.id === editSessionId ? normalizeSessions([updated])[0] : s))
        );
        showToast("Session updated successfully.");
      } else {
        const created = await sessionsService.addSession(payload);
        setSessions((prev) => [normalizeSessions([created])[0], ...prev]);
        showToast("Session created successfully.");
      }
      setShowModal(false);
      setNewSession(emptyForm);
      setEditSessionId(null);
    } catch (err) {
      console.error("Failed to save session:", err);
      showToast("Failed to save session. Please try again.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoadingId(id);
    try {
      await sessionsService.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast("Session deleted.");
    } catch (err) {
      console.error("Failed to delete session:", err);
      showToast("Failed to delete session. Please try again.", "error");
    } finally {
      setDeleteLoadingId(null);
      setDeleteConfirmId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditSessionId(null);
    setNewSession(emptyForm);
  };

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === "Scheduled").length,
    completed: sessions.filter(s => s.status === "Completed").length,
  };

  const statusFilters = ["All", "Scheduled", "Completed"];

  return (
    <div className="h-screen flex bg-[#f8f9fb] font-serif">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-10 py-8 bg-[#f8f9fb]">
          <div className="max-w-6xl mx-auto">

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002147] tracking-tight">Session Management</h1>
                <p className="text-sm text-gray-500 mt-1">Schedule, manage, and track all coaching sessions</p>
              </div>
              <button
                className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2.5 rounded-xl hover:bg-[#003875] transition shadow-sm text-sm font-semibold"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} /> New Session
              </button>
            </div>

            {/* Stats Row */}
            {!loading && !fetchError && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Sessions", value: stats.total, icon: BarChart3, iconColor: "text-[#002147]", bg: "bg-blue-50" },
                  { label: "Upcoming", value: stats.scheduled, icon: Clock, iconColor: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Completed", value: stats.completed, icon: CheckCircle2, iconColor: "text-green-600", bg: "bg-green-50" },
                ].map(({ label, value, icon: Icon, iconColor, bg }) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${bg}`}>
                      <Icon size={18} className={iconColor} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#002147]">{value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-100">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition"
                    onClick={closeModal}
                  >
                    <X size={16} />
                  </button>
                  <h2 className="text-lg font-bold mb-1 text-[#002147]">
                    {editSessionId ? "Edit Session" : "Create New Session"}
                  </h2>
                  <p className="text-xs text-gray-500 mb-5">
                    {editSessionId ? "Update the session details below." : "Fill in the details to schedule a new session."}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={newSession.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition bg-gray-50 focus:bg-white"
                        required
                        placeholder="e.g. Career Strategy Session"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea
                        name="description"
                        value={newSession.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition resize-none bg-gray-50 focus:bg-white"
                        rows={3}
                        placeholder="Optional: describe what this session covers..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={newSession.date}
                          onChange={handleInputChange}
                          className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition bg-gray-50 focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Time *</label>
                        <input
                          type="time"
                          name="time"
                          value={newSession.time}
                          onChange={handleInputChange}
                          className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition bg-gray-50 focus:bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm transition font-medium"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="px-5 py-2 rounded-xl bg-[#002147] text-white font-semibold hover:bg-[#003875] disabled:opacity-60 flex items-center gap-2 text-sm transition shadow-sm"
                      >
                        {submitLoading && <Loader2 size={14} className="animate-spin" />}
                        {editSessionId ? "Save Changes" : "Create Session"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
              <DeleteConfirmModal
                loading={deleteLoadingId === deleteConfirmId}
                onConfirm={() => handleDelete(deleteConfirmId)}
                onCancel={() => setDeleteConfirmId(null)}
              />
            )}

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 size={22} className="animate-spin mr-2" />
                <span className="text-sm">Loading sessions…</span>
              </div>
            ) : fetchError ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                {fetchError}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="Search sessions…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition bg-gray-50 focus:bg-white"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
                  </div>
                  <div className="flex gap-1.5">
                    {statusFilters.map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          statusFilter === f
                            ? "bg-[#002147] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-gray-50/70">
                    <tr>
                      {["Title", "Date & Time", "Description", "Status", "Actions"].map(h => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                            h === "Actions" ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-14 text-center">
                          <Calendar size={36} className="mx-auto text-gray-200 mb-3" />
                          <p className="text-gray-500 text-sm font-semibold">No sessions found</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {search || statusFilter !== "All"
                              ? "Try adjusting your search or filter."
                              : "Create your first session to get started."}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((session) => (
                        <tr key={session.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-5 py-4 text-sm font-semibold text-gray-900 max-w-[180px] truncate">
                            {session.title || "—"}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{session.date}</div>
                            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <Clock size={10} /> {session.time || "—"}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 max-w-[220px] truncate">
                            {session.description || <span className="text-gray-300">No description</span>}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              session.status === "Scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : session.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}>
                              {session.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <div className="flex gap-1 justify-end">
                              <button
                                type="button"
                                onClick={() => handleEditClick(session)}
                                className="p-2 rounded-lg hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition"
                                title="Edit session"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(session.id)}
                                className="p-2 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition disabled:opacity-40"
                                title="Delete session"
                                disabled={deleteLoadingId === session.id}
                              >
                                {deleteLoadingId === session.id
                                  ? <Loader2 size={15} className="animate-spin" />
                                  : <Trash2 size={15} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Footer */}
                {filteredSessions.length > 0 && (
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
                    Showing {filteredSessions.length} of {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
