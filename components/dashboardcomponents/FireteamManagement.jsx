import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cohortService } from "../../src/services/api/cohort.service";
import { fireteamService } from "../../src/services/api/fireteam.service";
import { generateFireteamMeetingLink } from "../../src/lib/livekit.utils";

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-gray-400">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-gray-300">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────────────── */
function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div ref={ref} className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Form field ─────────────────────────────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors";

/* ── Toast ──────────────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
      ${type === "success" ? "bg-gray-900 text-white" : "bg-red-500 text-white"}`}>
      {message}
      <button onClick={onClose} className="opacity-70 hover:opacity-100"><XIcon /></button>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function FireteamManagement({ sidebar: SidebarComponent, basePath = "/admin/fireteammanagement" }) {
  const router = useRouter();
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedFireteam, setSelectedFireteam] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fireteams, setFireteams] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { message, type }
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cohortsData = await cohortService.getCohorts();
        setCohorts(cohortsData);
      } catch {}
      try {
        const fireteamsData = await fireteamService.getFireteams();
        setFireteams(fireteamsData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication required. Please log in.");
        } else {
          setError("Failed to load fireteams.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  const resetForm = () => {
    setName(""); setDescription(""); setCohortId(""); setDate(""); setTime(""); setError("");
  };

  const handleAdd = () => { setSelectedFireteam(null); resetForm(); setShowAddEdit(true); };
  const handleEdit = (e, ft) => {
    e.stopPropagation();
    setSelectedFireteam(ft);
    setName(ft?.title || ft?.name || "");
    setDescription(ft?.description || "");
    setCohortId(String(ft?.cohort_id || ""));
    setDate(ft?.date || "");
    setTime(ft?.time || "");
    setError("");
    setShowAddEdit(true);
  };
  const handleDelete = (e, ft) => { e.stopPropagation(); setSelectedFireteam(ft); setShowDelete(true); };
  const handleClose = () => { setShowAddEdit(false); setShowDelete(false); setSelectedFireteam(null); resetForm(); };

  const handleSave = async () => {
    const errs = [];
    if (!name.trim()) errs.push("Name is required");
    if (!cohortId) errs.push("Cohort is required");
    if (!date.trim()) errs.push("Date is required");
    if (!time.trim()) errs.push("Time is required");
    if (errs.length) { setError(errs.join(" · ")); return; }
    setError(""); setSaving(true);
    try {
      const dateTime = `${date}T${time}:00`;
      if (selectedFireteam) {
        await fireteamService.updateFireteam(selectedFireteam.id, { cohort_id: cohortId, title: name, description, date: dateTime, time });
        showToast("Fireteam updated successfully");
      } else {
        const roomName = `wanac-fireteam-${cohortId}-${Date.now()}`;
        const link = generateFireteamMeetingLink(roomName);
        const created = await fireteamService.addFireteam({ cohort_id: cohortId, title: name, description, date: dateTime, time, link });
        if (created?.id) await fireteamService.updateFireteam(created.id, { cohort_id: cohortId, title: name, description, date: dateTime, time });
        showToast("Fireteam created successfully");
      }
      const refreshed = await fireteamService.getFireteams();
      setFireteams(refreshed);
      handleClose();
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.message) msg = err.message;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFireteam) return;
    try {
      await fireteamService.deleteFireteam(selectedFireteam.id);
      setFireteams((prev) => prev.filter((f) => f.id !== selectedFireteam.id));
      showToast("Fireteam deleted");
      handleClose();
    } catch {
      showToast("Failed to delete fireteam", "error");
    }
  };

  const filtered = fireteams.filter((f) => {
    const n = (f.title || f.name || "").toLowerCase();
    const d = (f.description || "").toLowerCase();
    const q = search.toLowerCase();
    return n.includes(q) || d.includes(q);
  });

  const getCohortName = (ft) => {
    const c = cohorts.find((c) => c.id === ft.cohort_id);
    return c ? (c.name || c.title || `Cohort ${c.id}`) : (ft.cohort_id ? `Cohort ${ft.cohort_id}` : "—");
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      {SidebarComponent && <SidebarComponent />}

      <main className="flex-1 min-w-0 overflow-y-auto px-10 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[2.1rem] font-bold text-gray-900 tracking-tight leading-none">
            Fireteam Management
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            <PlusIcon /> New Fireteam
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search fireteams…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors"
            />
          </div>
          {search && (
            <span className="text-xs text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Auth error */}
        {error && error.includes("Authentication") && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center mb-6">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button onClick={() => window.location.href = "/login"}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">
              Go to Login
            </button>
          </div>
        )}

        {/* Table card */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading fireteams…</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fireteam</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Cohort</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Time</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <p className="text-sm font-medium text-gray-400">
                        {search ? `No fireteams matching "${search}"` : "No fireteams yet"}
                      </p>
                      {!search && (
                        <button onClick={handleAdd}
                          className="mt-3 text-sm text-gray-900 font-semibold hover:underline">
                          Create your first fireteam →
                        </button>
                      )}
                    </td>
                  </tr>
                ) : filtered.map((ft) => (
                  <tr
                    key={ft.id}
                    onClick={() => router.push(`${basePath}/${ft.id}`)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-black text-blue-500 flex-shrink-0">
                          {(ft.title || ft.name || "F")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{ft.title || ft.name}</p>
                          {ft.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs">{ft.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{getCohortName(ft)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{formatDate(ft.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{ft.time || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEdit(e, ft)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, ft)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                        <ChevronRight />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer count */}
            {filtered.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400">
                  {filtered.length} fireteam{filtered.length !== 1 ? "s" : ""}
                  {search && ` matching "${search}"`}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={showAddEdit}
        onClose={handleClose}
        title={selectedFireteam ? "Edit Fireteam" : "New Fireteam"}
        footer={
          <>
            <button onClick={handleClose} disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 disabled:opacity-40 transition-colors">
              {saving ? "Saving…" : selectedFireteam ? "Save Changes" : "Create Fireteam"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Cohort" required>
            <select
              value={cohortId}
              onChange={(e) => setCohortId(e.target.value)}
              className={inputCls}
            >
              <option value="">Select a cohort…</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.name || c.title || `Cohort ${c.id}`}</option>
              ))}
            </select>
          </Field>
          <Field label="Name" required>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alpha Team" className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this fireteam about?" rows={3}
              className={`${inputCls} resize-none`} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" required>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Time" required>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
            </Field>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        open={showDelete}
        onClose={handleClose}
        title="Delete Fireteam"
        footer={
          <>
            <button onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button onClick={handleConfirmDelete}
              className="px-5 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">
            {selectedFireteam?.title || selectedFireteam?.name}
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>

      {/* ── Toast ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
