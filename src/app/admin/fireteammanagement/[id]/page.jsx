"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";
import { fireteamService } from "../../../../services/api/fireteam.service";
import { experienceService } from "../../../../services/api/experience.service";
import { clientsService } from "../../../../services/api/clients.service";
import { generateFireteamMeetingLink } from "../../../../lib/jitsi.utils";
import ExperienceVideoModal from "../../../../../components/ExperienceVideoModal";
import EditExperienceModal from "../../../../../components/EditExperienceModal";

/* ── Icons ──────────────────────────────────────────────────────────────────── */
function ArrowLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
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
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  );
}
function UserMinusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
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

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
      ${type === "error" ? "bg-red-500 text-white" : "bg-gray-900 text-white"}`}>
      {message}
      <button onClick={onClose} className="opacity-70 hover:opacity-100"><XIcon /></button>
    </div>
  );
}

function StatCard({ value, label, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    green: "bg-green-50 border-green-100 text-green-600",
  };
  return (
    <div className={`rounded-2xl border px-5 py-4 ${colors[color] || colors.blue}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold opacity-70 mt-0.5">{label}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────────── */
export default function FireteamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [fireteam, setFireteam] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [members, setMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showVideoMeeting, setShowVideoMeeting] = useState(false);
  const [showEditExperience, setShowEditExperience] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedExperienceToEdit, setSelectedExperienceToEdit] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [editData, setEditData] = useState({ title: "", description: "", date: "", time: "" });
  const [experienceData, setExperienceData] = useState({ title: "", experience: "" });
  const [editExperienceData, setEditExperienceData] = useState({
    title: "", experience: "", agenda: [], exhibits: [], videoAdminId: "", meetingLink: "", link: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  useEffect(() => { if (id) fetchDetails(); }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await fireteamService.getFireteam(id);
      const ft = data.fireTeam;
      setFireteam(ft);
      setMembers(Array.isArray(ft.members) ? ft.members : []);
      setExperiences(Array.isArray(ft.experiences) ? ft.experiences : []);
      setCohort(ft.cohort);
      setEditData({ title: ft.title || "", description: ft.description || "", date: ft.date || "", time: ft.time || "" });
      try {
        const cr = await clientsService.getClients();
        const arr = Array.isArray(cr?.clients) ? cr.clients : [];
        setClients(arr.map(c => ({ id: c.id, name: c.user?.name || "Unknown", email: c.user?.email || "" })));
      } catch { setClients([]); }
    } catch {
      showToast("Failed to load fireteam", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await fireteamService.updateFireteam(id, editData);
      showToast("Fireteam updated");
      setShowEdit(false);
      fetchDetails();
    } catch { showToast("Failed to update fireteam", "error"); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this fireteam? This cannot be undone.")) return;
    try {
      await fireteamService.deleteFireteam(id);
      router.push("/admin/fireteammanagement");
    } catch { showToast("Failed to delete fireteam", "error"); }
  };

  const handleAddMember = async () => {
    if (!selectedClient) return;
    try {
      await fireteamService.addFireteamMember({ client_id: selectedClient, fire_team_id: id });
      showToast("Member added");
      setShowAddMember(false);
      setSelectedClient("");
      fetchDetails();
    } catch { showToast("Failed to add member", "error"); }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the fireteam?")) return;
    try {
      await fireteamService.deleteFireteamMember(memberId);
      showToast("Member removed");
      fetchDetails();
    } catch { showToast("Failed to remove member", "error"); }
  };

  const handleSaveExperience = async () => {
    try {
      const created = await experienceService.addExperience({ fire_team_id: id, ...experienceData });
      setExperiences((p) => [...p, {
        id: created?.id ?? created?.fire_team_experience_id,
        title: created?.title ?? experienceData.title,
        experience: created?.experience ?? experienceData.experience,
        agenda: created?.agenda ?? [],
        exhibits: created?.exhibits ?? [],
      }]);
      showToast("Experience created");
      setShowAddExperience(false);
      setExperienceData({ title: "", experience: "" });
    } catch { showToast("Failed to create experience", "error"); }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await experienceService.deleteExperience(expId);
      showToast("Experience deleted");
      fetchDetails();
    } catch { showToast("Failed to delete experience", "error"); }
  };

  const handleStartExperience = async (expId) => {
    try {
      const exp = experiences.find(e => e.id === expId);
      if (!exp) return;
      await experienceService.startExperience(expId);
      setSelectedExperience(exp);
      setShowVideoMeeting(true);
    } catch { showToast("Failed to start experience", "error"); }
  };

  const openEditExperience = async (exp) => {
    try {
      // Always re-fetch the fireteam so we get the latest nested agenda + exhibits.
      // (The list endpoint used elsewhere doesn't return nested data, so cached state is unreliable.)
      const data = await fireteamService.getFireteam(id);
      const ft = data.fireTeam;
      // Keep experiences state fresh with full nested data
      if (Array.isArray(ft.experiences)) setExperiences(ft.experiences);
      const e = ft.experiences?.find(ex => ex.id === exp.id) || exp;
      setSelectedExperienceToEdit(e);
      setEditExperienceData({
        title: e.title || "",
        experience: e.experience || "",
        agenda: (e.agenda || e.agenda_steps || []).map(s => ({ ...s, title: String(s.title || ""), duration: String(s.duration || "") })),
        exhibits: (e.exhibits || []).map(x => ({ ...x, file: null })),
        videoAdminId: String(e.admin || e.videoAdminId || ""),
        link: e.link || "",
      });
      setShowEditExperience(true);
    } catch { showToast("Failed to load experience details", "error"); }
  };

  // Agenda step handlers
  const handleAddAgendaStep = () => {
    setEditExperienceData(p => ({ ...p, agenda: [...p.agenda, { _tempId: Date.now(), title: "", duration: "" }] }));
  };
  const handleSubmitAgendaStep = async (idx) => {
    const step = editExperienceData.agenda[idx];
    if (!step || step.id) return;
    if (!step.title?.trim() && !step.duration?.trim()) { setError("Fill in the step before submitting."); return; }
    try {
      const saved = await experienceService.addAgendaStep({ fire_team_experience_id: selectedExperienceToEdit.id, title: step.title || "", duration: step.duration || "" });
      const persistedStep = { ...saved, title: String(saved.title || ""), duration: String(saved.duration || "") };
      setEditExperienceData(p => ({ ...p, agenda: p.agenda.map((s, i) => i === idx ? persistedStep : s) }));
      // Keep experiences state in sync so card chips and next modal open are accurate
      setExperiences(prev => prev.map(ex =>
        ex.id === selectedExperienceToEdit.id
          ? { ...ex, agenda: [...(ex.agenda || []).filter(s => s.id !== persistedStep.id), persistedStep] }
          : ex
      ));
      showToast("Step saved");
    } catch { setError("Failed to save step"); }
  };
  const handleAddExhibit = () => {
    setEditExperienceData(p => ({ ...p, exhibits: [...p.exhibits, { _tempId: Date.now(), name: "", type: "link", link: "", file: null }] }));
  };
  const handleSubmitExhibit = async (idx) => {
    const ex = editExperienceData.exhibits[idx];
    if (!ex || ex.id) return;
    if (!ex.name?.trim()) { setError("Fill in the exhibit name."); return; }
    try {
      const saved = await experienceService.addExhibit({ fire_team_experience_id: selectedExperienceToEdit.id, name: ex.name, type: ex.type, link: ex.type === "link" ? ex.link : undefined });
      const persistedExhibit = { ...saved, file: null };
      setEditExperienceData(p => ({ ...p, exhibits: p.exhibits.map((x, i) => i === idx ? persistedExhibit : x) }));
      // Keep experiences state in sync
      setExperiences(prev => prev.map(exp =>
        exp.id === selectedExperienceToEdit.id
          ? { ...exp, exhibits: [...(exp.exhibits || []).filter(e => e.id !== persistedExhibit.id), persistedExhibit] }
          : exp
      ));
      showToast("Exhibit saved");
    } catch { setError("Failed to save exhibit"); }
  };
  const handleDeleteExhibit = async (exhibitId, idx) => {
    try {
      if (exhibitId) await experienceService.deleteExhibit(exhibitId);
      setEditExperienceData(p => ({ ...p, exhibits: p.exhibits.filter((_, i) => i !== idx) }));
    } catch { setError("Failed to delete exhibit"); }
  };
  const handleSaveEditExperience = async () => {
    if (!selectedExperienceToEdit) return;
    try {
      await experienceService.updateExperience(selectedExperienceToEdit.id, {
        title: editExperienceData.title,
        experience: editExperienceData.experience,
        link: editExperienceData.link || selectedExperienceToEdit.link,
        admin: editExperienceData.videoAdminId ? parseInt(editExperienceData.videoAdminId) : undefined,
      });
      for (const s of editExperienceData.agenda) {
        if (!s.id && (s.title?.trim() || s.duration?.trim())) {
          await experienceService.addAgendaStep({ fire_team_experience_id: selectedExperienceToEdit.id, title: s.title || "", duration: s.duration || "" });
        }
      }
      // Re-fetch full fireteam data so experiences state has fresh nested agenda/exhibits
      await fetchDetails();
      setShowEditExperience(false);
      setSelectedExperienceToEdit(null);
      showToast("Experience updated");
    } catch { showToast("Failed to update experience", "error"); }
  };

  const cohortName = cohort ? (cohort.name || cohort.title || `Cohort ${cohort.id}`) : `Cohort ${fireteam?.cohort_id || ""}`;

  /* ── Shell states ── */
  if (loading) {
    return (
      <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!fireteam) {
    return (
      <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-400 font-medium">Fireteam not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 min-w-0 overflow-y-auto px-10 py-8">

        {/* Back */}
        <button
          onClick={() => router.push("/admin/fireteammanagement")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft /> Back to Fireteam Management
        </button>

        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-lg font-black text-blue-500">
              {(fireteam.title || "F")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-[2rem] font-bold text-gray-900 leading-tight tracking-tight">
                {fireteam.title}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">{cohortName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition-colors">
              <EditIcon /> Edit
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-100 bg-white rounded-full hover:bg-red-50 transition-colors">
              <TrashIcon /> Delete
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard value={members.length} label="Members" color="blue" />
          <StatCard value={experiences.length} label="Experiences" color="amber" />
          <StatCard value={fireteam.date ? new Date(fireteam.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"} label="Session Date" color="green" />
        </div>

        {/* Info + Members + Experiences */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Left column — Info + Members stacked */}
          <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Fireteam Info</h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Description", fireteam.description || "—"],
                ["Date", fireteam.date ? new Date(fireteam.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "—"],
                ["Time", fireteam.time || "—"],
                ["Created", fireteam.created_at ? new Date(fireteam.created_at).toLocaleDateString() : "—"],
              ].map(([label, val]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="text-gray-900 mt-0.5">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Members card — still inside left column */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-900">Members</h2>
              <button onClick={() => setShowAddMember(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors">
                <PlusIcon /> Add
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-72">
              {members.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400">No members yet</p>
                  <button onClick={() => setShowAddMember(true)}
                    className="mt-2 text-xs text-gray-900 font-semibold hover:underline">
                    Add first member →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {members.map((m) => {
                    const name = m.client?.user?.name ?? m.name ?? "Unknown";
                    const email = m.client?.user?.email ?? m.email ?? "";
                    return (
                      <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                          {name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                          <p className="text-xs text-gray-400 truncate">{email}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 uppercase tracking-wider">
                          {m.role || "Member"}
                        </span>
                        <button onClick={() => handleRemoveMember(m.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-red-400 transition-all">
                          <UserMinusIcon />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          </div>{/* end left column */}

          {/* Right column — Experiences (wider) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Experiences</h2>
                {experiences.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {experiences.length} session{experiences.length !== 1 ? "s" : ""}
                    {(() => {
                      const withRoom = experiences.filter(e => e.link || e.meetingLink).length;
                      return withRoom > 0 ? ` · ${withRoom} with room` : "";
                    })()}
                  </p>
                )}
              </div>
              <button onClick={() => setShowAddExperience(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors">
                <PlusIcon /> New Experience
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)", minHeight: "200px" }}>
              {experiences.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">No experiences yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sessions you create will appear here</p>
                  <button onClick={() => setShowAddExperience(true)}
                    className="mt-3 text-xs text-gray-900 font-semibold hover:underline">
                    Create first experience →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {experiences.map((exp) => {
                    const agendaSteps = exp.agenda || exp.agenda_steps || [];
                    const agendaCount = agendaSteps.length;
                    const exhibitCount = exp.exhibits?.length || 0;
                    const roomName = exp.link || exp.meetingLink;
                    const hasLink = !!roomName;
                    const status = exp.status || "draft";
                    const statusStyles = {
                      completed: "bg-green-100 text-green-700",
                      active: "bg-blue-100 text-blue-700",
                      draft: "bg-gray-100 text-gray-500",
                    };
                    const totalDuration = agendaSteps.reduce((acc, s) => {
                      const match = (s.duration || "").match(/(\d+)/);
                      return acc + (match ? parseInt(match[1]) : 0);
                    }, 0);
                    return (
                      <div key={exp.id}
                        onClick={() => openEditExperience(exp)}
                        className="px-5 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer group border-b border-gray-50 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            {/* Title + status row */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">{exp.title}</p>
                              <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${statusStyles[status] || statusStyles.draft}`}>
                                {status}
                              </span>
                            </div>

                            {/* Description */}
                            {exp.experience && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{exp.experience}</p>
                            )}

                            {/* Inline agenda preview — first 3 steps */}
                            {agendaSteps.length > 0 && (
                              <div className="mt-2 space-y-0.5">
                                {agendaSteps.slice(0, 3).map((step, i) => (
                                  <div key={step.id || i} className="flex items-center gap-1.5">
                                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[9px] text-gray-500">
                                      {i + 1}
                                    </span>
                                    <span className="text-[11px] text-gray-500 truncate">{step.title}</span>
                                    {step.duration && (
                                      <span className="flex-shrink-0 text-[10px] text-gray-300">{step.duration}</span>
                                    )}
                                  </div>
                                ))}
                                {agendaSteps.length > 3 && (
                                  <p className="text-[10px] text-gray-300 pl-5.5">+{agendaSteps.length - 3} more steps</p>
                                )}
                              </div>
                            )}

                            {/* Meta chips */}
                            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                              {agendaCount > 0 && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-semibold text-gray-500">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                  {agendaCount} step{agendaCount !== 1 ? "s" : ""}{totalDuration > 0 ? ` · ${totalDuration} min` : ""}
                                </span>
                              )}
                              {exhibitCount > 0 && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-semibold text-gray-500">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  {exhibitCount} exhibit{exhibitCount !== 1 ? "s" : ""}
                                </span>
                              )}
                              {hasLink ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-100 rounded-lg text-[10px] font-semibold text-green-600">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  Room ready
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-lg text-[10px] font-semibold text-amber-600">
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                  No room
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action buttons — visible on hover */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {hasLink && (
                                <button onClick={() => handleStartExperience(exp.id)}
                                  title="Join room"
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                                  <VideoIcon /> Join
                                </button>
                              )}
                              <button onClick={() => router.push(`/admin/fireteammanagement/${id}/experience/${exp.id}`)}
                                title="View experience details"
                                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                                <ExternalLinkIcon />
                              </button>
                              <button onClick={() => openEditExperience(exp)}
                                title="Edit experience"
                                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                                <EditIcon />
                              </button>
                              <button onClick={() => handleDeleteExperience(exp.id)}
                                title="Delete experience"
                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors">
                                <TrashIcon />
                              </button>
                            </div>
                            {hasLink && (
                              <button
                                onClick={() => { navigator.clipboard.writeText(roomName); showToast("Room name copied!"); }}
                                title="Copy room name"
                                className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors font-mono">
                                <CopyIcon /> copy room
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>{/* end experiences card / right column */}
        </div>{/* end main grid */}
      </main>

      {/* ── Edit Fireteam Modal ── */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Fireteam"
        footer={
          <>
            <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={handleSaveEdit} className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">Save Changes</button>
          </>
        }>
        <div className="flex flex-col gap-4">
          <Field label="Title" required><input type="text" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} className={`${inputCls} resize-none`} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className={inputCls} /></Field>
            <Field label="Time"><input type="time" value={editData.time} onChange={(e) => setEditData({ ...editData, time: e.target.value })} className={inputCls} /></Field>
          </div>
        </div>
      </Modal>

      {/* ── Add Member Modal ── */}
      <Modal open={showAddMember} onClose={() => { setShowAddMember(false); setSelectedClient(""); }} title="Add Member"
        footer={
          <>
            <button onClick={() => setShowAddMember(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={handleAddMember} disabled={!selectedClient}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 disabled:opacity-40 transition-colors">Add Member</button>
          </>
        }>
        <Field label="Select Client" required>
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className={inputCls}>
            <option value="">Choose a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
            ))}
          </select>
        </Field>
      </Modal>

      {/* ── Add Experience Modal ── */}
      <Modal open={showAddExperience} onClose={() => { setShowAddExperience(false); setExperienceData({ title: "", experience: "" }); }} title="New Experience"
        footer={
          <>
            <button onClick={() => setShowAddExperience(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={handleSaveExperience} disabled={!experienceData.title.trim() || !experienceData.experience.trim()}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 disabled:opacity-40 transition-colors">Create</button>
          </>
        }>
        <div className="flex flex-col gap-4">
          <Field label="Title" required>
            <input type="text" value={experienceData.title} onChange={(e) => setExperienceData({ ...experienceData, title: e.target.value })}
              placeholder="e.g., Customer Discovery" className={inputCls} />
          </Field>
          <Field label="Description" required>
            <textarea value={experienceData.experience} onChange={(e) => setExperienceData({ ...experienceData, experience: e.target.value })}
              rows={4} placeholder="Describe what participants will learn and do…" className={`${inputCls} resize-none`} />
          </Field>
        </div>
      </Modal>

      {/* ── Edit Experience Modal (existing component) ── */}
      <EditExperienceModal
        open={showEditExperience}
        onClose={() => { setShowEditExperience(false); setSelectedExperienceToEdit(null); }}
        editExperienceData={editExperienceData}
        setEditExperienceData={setEditExperienceData}
        validationErrors={validationErrors}
        clearValidationErrors={() => setValidationErrors({})}
        handleAddAgendaStep={handleAddAgendaStep}
        handleSubmitAgendaStep={handleSubmitAgendaStep}
        handleAddExhibit={handleAddExhibit}
        handleSubmitExhibit={handleSubmitExhibit}
        handleSave={handleSaveEditExperience}
        setError={setError}
        error={error}
        members={members}
        selectedExperienceToEdit={selectedExperienceToEdit}
        generateFireteamMeetingLink={generateFireteamMeetingLink}
        id={id}
        fireteam={fireteam}
        experienceService={experienceService}
      />

      {/* ── Video Meeting Modal ── */}
      {showVideoMeeting && selectedExperience && (
        <ExperienceVideoModal
          onClose={() => {
            setShowVideoMeeting(false);
            if (selectedExperience) experienceService.endExperience(selectedExperience.id).catch(() => {});
            setSelectedExperience(null);
          }}
          experience={selectedExperience}
          fireteam={fireteam}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
