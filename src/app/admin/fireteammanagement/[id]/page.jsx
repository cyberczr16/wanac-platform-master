"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";
import { fireteamService } from "../../../../services/api/fireteam.service";
import { experienceService } from "../../../../services/api/experience.service";
import { clientsService } from "../../../../services/api/clients.service";
import { generateFireteamMeetingLink } from "../../../../lib/livekit.utils";
import EditExperienceModal from "../../../../../components/EditExperienceModal";
import { notificationService } from "../../../../services/api/notification.service";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
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
const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE8220]/20 focus:border-[#EE8220]/60 transition-colors";

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
  const [showEditExperience, setShowEditExperience] = useState(false);
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
        setClients(arr.map(c => ({ id: c.id, userId: c.user?.id, name: c.user?.name || "Unknown", email: c.user?.email || "" })));
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

      // Send notification to the newly added member
      const client = clients.find(c => String(c.id) === String(selectedClient));
      if (client?.userId) {
        notificationService.sendNotification({
          user_id: client.userId,
          title: "You've been added to a Fireteam 🎯",
          message: `You have been added to the "${fireteam?.title || "a fireteam"}" fireteam. Log in to your dashboard to view the session details.`,
          type: "fireteam",
          metadata: { fireteam_id: id },
        }).catch((err) => console.warn("Fireteam notification failed (non-critical):", err));
      }

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
      await experienceService.startExperience(expId);
      router.push(`/admin/fireteammanagement/${id}/experience/${expId}`);
    } catch { showToast("Failed to start experience", "error"); }
  };

  const openEditExperience = async (exp) => {
    try {
      const data = await fireteamService.getFireteam(id);
      const ft = data.fireTeam;
      if (Array.isArray(ft.experiences)) setExperiences(ft.experiences);
      const e = ft.experiences?.find(ex => ex.id === exp.id) || exp;
      setSelectedExperienceToEdit(e);
      setEditExperienceData({
        title: e.title || "",
        experience: e.experience || "",
        agenda: (e.agenda || e.agenda_steps || []).map(s => ({ ...s, title: String(s.title || ""), duration: String(s.duration || "") })),
        exhibits: (e.exhibits || []).map(x => ({ ...x, link: x.link || x.url || "", file: null })),
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
      const saved = await experienceService.addExhibit({
        fire_team_experience_id: selectedExperienceToEdit.id,
        name: ex.name,
        type: ex.type,
        link: ex.type === "link" ? ex.link : undefined,
        file: ex.file || null,
      });
      const persistedExhibit = { ...saved, file: null };
      setEditExperienceData(p => ({ ...p, exhibits: p.exhibits.map((x, i) => i === idx ? persistedExhibit : x) }));
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
      <div className="h-screen flex bg-[#f8f7f4] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-[#EE8220]/25 border-t-[#EE8220] rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading fireteam…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!fireteam) {
    return (
      <div className="h-screen flex bg-[#f8f7f4] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-400 font-medium">Fireteam not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#f8f7f4] overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* ── HERO BANNER ── */}
        <div
          style={{ background: "linear-gradient(135deg, #EE8220 0%, #d9640e 100%)" }}
          className="px-10 pt-7 pb-6 relative overflow-hidden"
        >
          {/* Dot-grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Back link */}
          <button
            onClick={() => router.push("/admin/fireteammanagement")}
            className="relative flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold mb-5 transition-colors"
          >
            <ArrowLeft /> Back to Fireteam Management
          </button>

          {/* Title row */}
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Monogram avatar */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xl font-black text-white flex-shrink-0 shadow-inner">
                {(fireteam.title || "F")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white leading-tight tracking-tight">
                  {fireteam.title}
                </h1>
                <p className="text-white/65 text-xs mt-0.5 font-medium">{cohortName}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0 mt-0.5">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-full border border-white/25 transition-all"
              >
                <EditIcon /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-black/25 hover:bg-red-600/80 text-white text-xs font-bold rounded-full transition-all"
              >
                <TrashIcon /> Delete
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative flex items-center gap-3 mt-5 flex-wrap">
            {[
              { value: members.length, label: "Members" },
              { value: experiences.length, label: "Experiences" },
              {
                value: fireteam.date
                  ? new Date(fireteam.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—",
                label: "Session Date",
              },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-baseline gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <span className="text-xl font-black text-white">{value}</span>
                <span className="text-white/65 text-[10px] font-bold uppercase tracking-wider">{label}</span>
              </div>
            ))}
            {fireteam.time && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-white/65 text-[10px] font-bold uppercase tracking-wider">⏱ {fireteam.time}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="px-10 py-6 grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── LEFT COLUMN: Info + Members ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-[#ece8df] shadow-sm p-6">
              <h2 className="text-[10px] font-black text-[#EE8220] uppercase tracking-[0.12em] mb-4">
                Fireteam Info
              </h2>
              <dl className="space-y-3.5">
                {[
                  ["Description", fireteam.description || "—"],
                  [
                    "Date",
                    fireteam.date
                      ? new Date(fireteam.date).toLocaleDateString("en-US", {
                          weekday: "short", day: "numeric", month: "long", year: "numeric",
                        })
                      : "—",
                  ],
                  ["Time", fireteam.time || "—"],
                  [
                    "Created",
                    fireteam.created_at
                      ? new Date(fireteam.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })
                      : "—",
                  ],
                ].map(([label, val]) => (
                  <div key={label}>
                    <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</dt>
                    <dd className="text-sm text-gray-900 leading-snug">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Members Card */}
            <div className="bg-white rounded-2xl border border-[#ece8df] shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-[#ece8df] flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-[10px] font-black text-[#EE8220] uppercase tracking-[0.12em]">Members</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {members.length} participant{members.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMember(true)}
                  style={{ background: "#EE8220" }}
                  className="flex items-center gap-1 px-3 py-1.5 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm"
                >
                  <PlusIcon /> Add
                </button>
              </div>

              <div className="flex-1 overflow-y-auto" style={{ maxHeight: "340px" }}>
                {members.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EE8220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">No members yet</p>
                    <button
                      onClick={() => setShowAddMember(true)}
                      style={{ color: "#EE8220" }}
                      className="text-xs font-bold hover:underline"
                    >
                      Add first member →
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f5f1ea]">
                    {members.map((m) => {
                      const name = m.client?.user?.name ?? m.name ?? "Unknown";
                      const email = m.client?.user?.email ?? m.email ?? "";
                      return (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50/40 transition-colors group"
                        >
                          <div
                            style={{ background: "#EE8220" }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                          >
                            {name[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                            <p className="text-xs text-gray-400 truncate">{email}</p>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 uppercase tracking-wide flex-shrink-0">
                            {m.role || "Member"}
                          </span>
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-red-400 transition-all"
                          >
                            <UserMinusIcon />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Experiences ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ece8df] shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#ece8df] flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-[10px] font-black text-[#EE8220] uppercase tracking-[0.12em]">Experiences</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {experiences.length} session{experiences.length !== 1 ? "s" : ""}
                  {(() => {
                    const n = experiences.filter(e => e.link || e.meetingLink).length;
                    return n > 0 ? ` · ${n} with room` : "";
                  })()}
                </p>
              </div>
              <button
                onClick={() => setShowAddExperience(true)}
                style={{ background: "#EE8220" }}
                className="flex items-center gap-1 px-4 py-2 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm"
              >
                <PlusIcon /> New Experience
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)", minHeight: "200px" }}>
              {experiences.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE8220" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">No experiences yet</p>
                  <p className="text-xs text-gray-400 mb-3">Sessions you create will appear here</p>
                  <button
                    onClick={() => setShowAddExperience(true)}
                    style={{ color: "#EE8220" }}
                    className="text-xs font-bold hover:underline"
                  >
                    Create first experience →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#f5f1ea]">
                  {experiences.map((exp) => {
                    const agendaSteps = exp.agenda || exp.agenda_steps || [];
                    const exhibitCount = exp.exhibits?.length || 0;
                    const roomName = exp.link || exp.meetingLink;
                    const hasLink = !!roomName;
                    const status = exp.status || "draft";
                    const totalDuration = agendaSteps.reduce((acc, s) => {
                      const match = (s.duration || "").match(/(\d+)/);
                      return acc + (match ? parseInt(match[1]) : 0);
                    }, 0);
                    const statusBadge = {
                      completed: "bg-green-100 text-green-700",
                      active: "bg-blue-100 text-blue-600",
                      draft: "bg-gray-100 text-gray-500",
                    }[status] || "bg-gray-100 text-gray-500";
                    const accentColor =
                      status === "completed" ? "#22c55e" :
                      status === "active" ? "#3366FF" :
                      "#EE8220";

                    return (
                      <div
                        key={exp.id}
                        onClick={() => openEditExperience(exp)}
                        className="px-5 py-4 hover:bg-orange-50/25 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Colored left accent bar */}
                          <div
                            style={{ background: accentColor, opacity: 0.55 }}
                            className="w-[3px] rounded-full self-stretch flex-shrink-0 min-h-[44px]"
                          />

                          <div className="flex-1 min-w-0">
                            {/* Title + badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${statusBadge}`}>
                                {status}
                              </span>
                              {hasLink && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200/80">
                                  Room ready
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            {exp.experience && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{exp.experience}</p>
                            )}

                            {/* Agenda preview */}
                            {agendaSteps.length > 0 && (
                              <div className="mt-2 space-y-0.5">
                                {agendaSteps.slice(0, 3).map((step, i) => (
                                  <div key={step.id || i} className="flex items-center gap-1.5">
                                    <span
                                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center font-black text-[9px]"
                                      style={{ background: "#EE822018", color: "#EE8220" }}
                                    >
                                      {i + 1}
                                    </span>
                                    <span className="text-[11px] text-gray-500 truncate">{step.title}</span>
                                    {step.duration && (
                                      <span className="flex-shrink-0 text-[10px] text-gray-300">{step.duration}</span>
                                    )}
                                  </div>
                                ))}
                                {agendaSteps.length > 3 && (
                                  <p className="text-[10px] text-gray-300 pl-5">+{agendaSteps.length - 3} more steps</p>
                                )}
                              </div>
                            )}

                            {/* Meta chips */}
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                              {agendaSteps.length > 0 && (
                                <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 font-semibold">
                                  {agendaSteps.length} step{agendaSteps.length !== 1 ? "s" : ""}
                                  {totalDuration > 0 ? ` · ${totalDuration} min` : ""}
                                </span>
                              )}
                              {exhibitCount > 0 && (
                                <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 font-semibold">
                                  {exhibitCount} exhibit{exhibitCount !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Hover action buttons */}
                          <div
                            className="flex flex-col items-end gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1">
                              {hasLink && (
                                <button
                                  onClick={() => handleStartExperience(exp.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors"
                                  style={{ background: "#3366FF12", color: "#3366FF" }}
                                  title="Join room"
                                >
                                  <VideoIcon /> Join
                                </button>
                              )}
                              <button
                                onClick={() => router.push(`/admin/fireteammanagement/${id}/experience/${exp.id}`)}
                                className="w-7 h-7 rounded-lg hover:bg-orange-50 flex items-center justify-center text-gray-400 hover:text-[#EE8220] transition-colors"
                                title="View details"
                              >
                                <ExternalLinkIcon />
                              </button>
                              <button
                                onClick={() => openEditExperience(exp)}
                                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                                title="Edit experience"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDeleteExperience(exp.id)}
                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors"
                                title="Delete"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                            {hasLink && (
                              <button
                                onClick={() => { navigator.clipboard.writeText(roomName); showToast("Room name copied!"); }}
                                className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 font-mono transition-colors"
                                title="Copy room name"
                              >
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
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}

      {/* Edit Fireteam */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Fireteam"
        footer={
          <>
            <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</button>
            <button
              onClick={handleSaveEdit}
              style={{ background: "#EE8220" }}
              className="px-5 py-2 text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Title" required>
            <input type="text" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Time">
              <input type="time" value={editData.time} onChange={(e) => setEditData({ ...editData, time: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Add Member */}
      <Modal
        open={showAddMember}
        onClose={() => { setShowAddMember(false); setSelectedClient(""); }}
        title="Add Member"
        footer={
          <>
            <button onClick={() => setShowAddMember(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</button>
            <button
              onClick={handleAddMember}
              disabled={!selectedClient}
              style={{ background: selectedClient ? "#EE8220" : undefined }}
              className="px-5 py-2 text-white text-sm font-bold rounded-full hover:opacity-90 disabled:opacity-40 disabled:bg-gray-300 transition-opacity"
            >
              Add Member
            </button>
          </>
        }
      >
        <Field label="Select Client" required>
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className={inputCls}>
            <option value="">Choose a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
            ))}
          </select>
        </Field>
      </Modal>

      {/* New Experience */}
      <Modal
        open={showAddExperience}
        onClose={() => { setShowAddExperience(false); setExperienceData({ title: "", experience: "" }); }}
        title="New Experience"
        footer={
          <>
            <button onClick={() => setShowAddExperience(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</button>
            <button
              onClick={handleSaveExperience}
              disabled={!experienceData.title.trim() || !experienceData.experience.trim()}
              style={{ background: experienceData.title.trim() && experienceData.experience.trim() ? "#EE8220" : undefined }}
              className="px-5 py-2 text-white text-sm font-bold rounded-full hover:opacity-90 disabled:opacity-40 disabled:bg-gray-300 transition-opacity"
            >
              Create
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Title" required>
            <input
              type="text"
              value={experienceData.title}
              onChange={(e) => setExperienceData({ ...experienceData, title: e.target.value })}
              placeholder="e.g., Customer Discovery"
              className={inputCls}
            />
          </Field>
          <Field label="Description" required>
            <textarea
              value={experienceData.experience}
              onChange={(e) => setExperienceData({ ...experienceData, experience: e.target.value })}
              rows={4}
              placeholder="Describe what participants will learn and do…"
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>
      </Modal>

      {/* Edit Experience Modal (existing component, logic unchanged) */}
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


{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
