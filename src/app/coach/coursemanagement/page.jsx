"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import CoachSidebar from "../../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { ProgramsService } from "../../../services/api/programs.service";
import { cohortService } from "../../../services/api/cohort.service";
import { clientsService } from "../../../services/api/clients.service";
import { programEnrollmentsService } from "../../../services/api/programEnrollments.service";
import { MARKETING_PROGRAMS } from "../../../data/marketingPrograms";

// ─── Inline SVG Icons ───────────────────────────
const BookIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const LayersIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
const UsersIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PlusIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const PenIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const TrashIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const LinkIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const UploadIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const CheckIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const UserPlusIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);
const ChevronRightIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ClipboardListIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M9 12h6" /><path d="M9 16h6" />
  </svg>
);
const UserMinusIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

// ─── Helpers ────────────────────────────────────
const getPreFillPrograms = () =>
  MARKETING_PROGRAMS.map((p, i) => ({
    id: `prefill-${i}`,
    title: p.title,
    name: p.title,
    description: p.desc || p.description || "",
  }));

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}
const PALETTE = ["#9A6AE3", "#002147", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
function colorFor(name = "") {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return PALETTE[sum % PALETTE.length];
}

// ─── Reusable Modal Shell ───────────────────────
function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${wide ? "w-full max-w-2xl" : "w-full max-w-lg"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-bold text-[#002147]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 shrink-0 flex items-center gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

// Reusable form input
function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
      <input {...props} className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] ${props.className || ""}`} />
    </div>
  );
}
function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
      <textarea {...props} className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] ${props.className || ""}`} />
    </div>
  );
}

// ─── Main Page ──────────────────────────────────
export default function CourseManagementPage() {
  const [user, setUser] = useState({ name: "Coach" });
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programUnits, setProgramUnits] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("programs");

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [courseForm, setCourseForm] = useState({ name: "", syllabus: "", resources: [] });
  const [newResource, setNewResource] = useState({ type: "link", title: "", url: "", file: null });
  const fileRef = useRef(null);

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitForm, setUnitForm] = useState({ name: "", resources: [] });
  const [newUnitResource, setNewUnitResource] = useState({ type: "link", title: "", url: "", file: null });
  const unitFileRef = useRef(null);

  const [showCohortModal, setShowCohortModal] = useState(false);
  const [cohortForm, setCohortForm] = useState({ name: "", description: "", start_date: "", end_date: "" });

  const [showCohortDetail, setShowCohortDetail] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);

  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  // Enrollments
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollClientId, setEnrollClientId] = useState("");
  const [enrollClients, setEnrollClients] = useState([]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const u = localStorage.getItem("wanacUser");
    if (u) try { setUser(JSON.parse(u)); } catch {}
  }, []);

  // Fetch programs
  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ProgramsService.getAll();
      let arr = Array.isArray(data) ? data : (data?.data || data?.programs || []);
      if (!arr.length) arr = getPreFillPrograms();
      setPrograms(arr);
      if (arr.length && !selectedProgram) setSelectedProgram(arr[0]);
    } catch {
      const pf = getPreFillPrograms();
      setPrograms(pf);
      setSelectedProgram(pf[0] || null);
    } finally { setLoading(false); }
  }, []);

  const loadCohorts = useCallback(async () => {
    try {
      const data = await cohortService.getCohorts();
      setCohorts(Array.isArray(data) ? data : (data?.cohorts || []));
    } catch { setCohorts([]); }
  }, []);

  useEffect(() => { loadPrograms(); loadCohorts(); }, [loadPrograms, loadCohorts]);

  // Load units when program changes
  useEffect(() => {
    if (!selectedProgram) { setProgramUnits([]); return; }
    if (String(selectedProgram.id).startsWith("prefill-")) { setProgramUnits([]); return; }
    ProgramsService.getUnitsByProgramId(selectedProgram.id)
      .then((u) => setProgramUnits(Array.isArray(u) ? u : []))
      .catch(() => setProgramUnits([]));
  }, [selectedProgram]);

  // Load enrollments when program changes
  const loadEnrollments = useCallback(async () => {
    if (!selectedProgram || String(selectedProgram.id).startsWith("prefill-")) { setEnrollments([]); return; }
    setLoadingEnrollments(true);
    try {
      const data = await programEnrollmentsService.getForProgram(selectedProgram.id);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch { setEnrollments([]); }
    finally { setLoadingEnrollments(false); }
  }, [selectedProgram]);

  useEffect(() => { loadEnrollments(); }, [loadEnrollments]);

  const filteredCohorts = selectedProgram
    ? cohorts.filter((c) => c.program_id === selectedProgram.id)
    : [];

  // ── Course handlers ──
  const openAddCourse = () => {
    setEditingProgramId(null);
    setCourseForm({ name: "", syllabus: "", resources: [] });
    setNewResource({ type: "link", title: "", url: "", file: null });
    setShowCourseModal(true);
  };
  const openEditCourse = (p) => {
    setEditingProgramId(p.id);
    setCourseForm({ name: p.title || p.name || "", syllabus: p.description || "", resources: Array.isArray(p.resources) ? p.resources : [] });
    setNewResource({ type: "link", title: "", url: "", file: null });
    setShowCourseModal(true);
  };
  const addResource = () => {
    if (newResource.type === "link" && newResource.title && newResource.url) {
      setCourseForm((f) => ({ ...f, resources: [...f.resources, { type: "link", title: newResource.title, url: newResource.url }] }));
      setNewResource({ type: "link", title: "", url: "", file: null });
    } else if (newResource.type === "document" && newResource.title && newResource.file) {
      setCourseForm((f) => ({ ...f, resources: [...f.resources, { type: "document", title: newResource.title, file: newResource.file }] }));
      setNewResource({ type: "link", title: "", url: "", file: null });
    }
  };
  const saveCourse = async () => {
    const title = courseForm.name.trim();
    if (!title) return;
    try {
      if (editingProgramId) {
        if (String(editingProgramId).startsWith("prefill-")) {
          setPrograms((p) => p.map((x) => x.id === editingProgramId ? { ...x, title, name: title, description: courseForm.syllabus } : x));
        } else {
          await ProgramsService.update(editingProgramId, { title, description: courseForm.syllabus });
          await loadPrograms();
        }
      } else {
        await ProgramsService.create({ title, description: courseForm.syllabus });
        await loadPrograms();
      }
      setShowCourseModal(false);
      showToast(editingProgramId ? "Program updated!" : "Program created!");
    } catch { setError("Failed to save program"); }
  };
  const removeCourse = async (program, e) => {
    e?.stopPropagation();
    if (String(program.id).startsWith("prefill-")) {
      setPrograms((p) => { const n = p.filter((x) => x.id !== program.id); if (selectedProgram?.id === program.id) setSelectedProgram(n[0] || null); return n; });
      return;
    }
    try {
      await ProgramsService.delete(program.id);
      setPrograms((p) => { const n = p.filter((x) => x.id !== program.id); if (selectedProgram?.id === program.id) setSelectedProgram(n[0] || null); return n.length ? n : getPreFillPrograms(); });
      showToast("Program removed.");
    } catch { setError("Failed to delete program"); }
  };

  // ── Unit handlers ──
  const openAddUnit = () => {
    setUnitForm({ name: "", resources: [] });
    setNewUnitResource({ type: "link", title: "", url: "", file: null });
    setShowUnitModal(true);
  };
  const addUnitResource = () => {
    if (newUnitResource.type === "link" && newUnitResource.title && newUnitResource.url) {
      setUnitForm((f) => ({ ...f, resources: [...f.resources, { type: "link", title: newUnitResource.title, url: newUnitResource.url }] }));
      setNewUnitResource({ type: "link", title: "", url: "", file: null });
    } else if (newUnitResource.type === "document" && newUnitResource.title && newUnitResource.file) {
      setUnitForm((f) => ({ ...f, resources: [...f.resources, { type: "document", title: newUnitResource.title, file: newUnitResource.file }] }));
      setNewUnitResource({ type: "link", title: "", url: "", file: null });
    }
  };
  const saveUnit = () => { setShowUnitModal(false); showToast("Unit saved!"); };

  // ── Cohort handlers ──
  const openAddCohort = () => {
    setCohortForm({ name: "", description: "", start_date: "", end_date: "" });
    setShowCohortModal(true);
  };
  const saveCohort = async () => {
    const name = cohortForm.name.trim();
    if (!name || !selectedProgram) return;
    const isPre = String(selectedProgram.id).startsWith("prefill-");
    let pid = selectedProgram.id;
    try {
      if (isPre) {
        await ProgramsService.create({ title: selectedProgram.title || selectedProgram.name, description: selectedProgram.description || "" });
        const data = await ProgramsService.getAll();
        const arr = Array.isArray(data) ? data : (data?.data || data?.programs || []);
        const found = arr.find((p) => (p.title || p.name || "").trim() === (selectedProgram.title || selectedProgram.name || "").trim());
        pid = found?.id ?? data?.id;
        if (!pid) { setError("Program created but ID not found. Refresh and try again."); return; }
        setPrograms(arr.length ? arr : getPreFillPrograms());
        setSelectedProgram(found || { id: pid, title: selectedProgram.title, name: selectedProgram.name, description: selectedProgram.description });
      }
      await cohortService.createCohort({ program_id: pid, name, description: cohortForm.description, start_date: cohortForm.start_date || undefined, end_date: cohortForm.end_date || undefined });
      await loadCohorts();
      setShowCohortModal(false);
      showToast("Cohort created!");
    } catch { setError("Failed to create cohort"); }
  };

  const openCohortDetail = (cohort) => { setSelectedCohort(cohort); setShowCohortDetail(true); };

  const openAddClient = async () => {
    setSelectedClientId("");
    try {
      const data = await clientsService.getClients();
      const list = data?.clients ?? (Array.isArray(data) ? data : []);
      setClients(Array.isArray(list) ? list : []);
    } catch { setClients([]); }
    setShowAddClientModal(true);
  };
  const saveAddClient = async () => {
    if (!selectedCohort || !selectedClientId) return;
    try {
      await cohortService.addCohortMember({ cohort_id: selectedCohort.id, member_id: Number(selectedClientId), role: "client" });
      const added = clients.find((c) => Number(c.id ?? c.user_id ?? c.user?.id) === Number(selectedClientId));
      await loadCohorts();
      if (added) {
        const existing = Array.isArray(selectedCohort.clients) ? selectedCohort.clients : [];
        setSelectedCohort({ ...selectedCohort, clients: [...existing, added] });
      }
      setShowAddClientModal(false);
      showToast("Client added to cohort!");
    } catch { setError("Failed to add client"); }
  };

  const cohortClientIds = Array.isArray(selectedCohort?.clients)
    ? selectedCohort.clients.map((c) => (typeof c === "object" ? c.id ?? c.user_id : c))
    : [];
  const clientsNotInCohort = clients.filter((c) => !cohortClientIds.includes(c.id ?? c.user_id ?? c.user?.id));
  const clientOptions = clientsNotInCohort.length > 0 ? clientsNotInCohort : clients;

  // ── Enrollment handlers ──
  const openEnrollClient = async () => {
    setEnrollClientId("");
    try {
      const data = await clientsService.getClients();
      const list = data?.clients ?? (Array.isArray(data) ? data : []);
      setEnrollClients(Array.isArray(list) ? list : []);
    } catch { setEnrollClients([]); }
    setShowEnrollModal(true);
  };
  const saveEnrollment = async () => {
    if (!selectedProgram || !enrollClientId) return;
    const isPre = String(selectedProgram.id).startsWith("prefill-");
    if (isPre) { showToast("Save the program first before enrolling clients."); return; }
    try {
      await programEnrollmentsService.create({ client_id: Number(enrollClientId), program_id: selectedProgram.id });
      await loadEnrollments();
      setShowEnrollModal(false);
      showToast("Client enrolled!");
    } catch { setError("Failed to enroll client"); }
  };
  const removeEnrollment = async (enrollmentId) => {
    try {
      await programEnrollmentsService.delete(enrollmentId);
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
      showToast("Client unenrolled.");
    } catch { setError("Failed to unenroll client"); }
  };

  // Clients already enrolled (to filter dropdown)
  const enrolledClientIds = enrollments.map((e) => e.client_id);
  const enrollableClients = enrollClients.filter((c) => {
    const cid = Number(c.id ?? c.user_id ?? c.user?.id);
    return !enrolledClientIds.includes(cid);
  });

  const TABS = [
    { key: "programs", label: "Programs", icon: BookIcon, color: "text-blue-600" },
    { key: "units", label: "Units / Modules", icon: LayersIcon, color: "text-green-600" },
    { key: "cohorts", label: "Cohorts", icon: UsersIcon, color: "text-purple-600" },
    { key: "enrollments", label: "Enrollments", icon: ClipboardListIcon, color: "text-amber-600" },
  ];

  return (
    <div className="h-screen flex bg-[#f5f5f5] font-body overflow-hidden">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ClientTopbar user={user} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-5">
          <div className="max-w-6xl mx-auto space-y-5">

            {/* Toast */}
            {toast && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm fixed top-4 right-4 z-50 shadow-lg">
                <CheckIcon size={14} /> {toast}
              </div>
            )}

            {/* ── Page Header ── */}
            <div className="bg-gradient-to-br from-[#002147] via-[#003a7a] to-[#002147] rounded-2xl px-6 py-5 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_20%,white,transparent)] pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Course Management</p>
                  <h1 className="text-xl font-bold text-white">Programs & Courses</h1>
                  <p className="text-white/70 text-xs mt-0.5">Create programs, organize units, and manage cohorts.</p>
                </div>
                <button onClick={openAddCourse}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-all border border-white/20 self-start sm:self-auto">
                  <PlusIcon size={14} /> New Program
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-between gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <span>{error}</span>
                <button onClick={() => setError("")} className="text-xs font-semibold underline">Dismiss</button>
              </div>
            )}

            {/* ── Stats ── */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50"><BookIcon size={16} className="text-blue-600" /></div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Programs</p>
                  <p className="text-xl font-bold text-[#002147]">{loading ? "..." : programs.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-50"><LayersIcon size={16} className="text-green-600" /></div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Units</p>
                  <p className="text-xl font-bold text-green-700">{programUnits.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50"><UsersIcon size={16} className="text-purple-600" /></div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Cohorts</p>
                  <p className="text-xl font-bold text-purple-700">{cohorts.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50"><ClipboardListIcon size={16} className="text-amber-600" /></div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Enrolled</p>
                  <p className="text-xl font-bold text-amber-700">{loadingEnrollments ? "..." : enrollments.length}</p>
                </div>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100 px-2 pt-1 bg-gray-50/50">
                {TABS.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-5 py-3 text-xs font-semibold transition-all rounded-t-xl border-b-2 ${
                      activeTab === tab.key ? "text-[#002147] border-[#002147] bg-white" : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
                    }`}>
                    <tab.icon size={14} className={activeTab === tab.key ? tab.color : ""} /> {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">

                {/* ──── PROGRAMS TAB ──── */}
                {activeTab === "programs" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-[#002147]">All Programs</p>
                      <button onClick={openAddCourse}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#002147] hover:bg-[#003875] transition-all">
                        <PlusIcon size={12} /> Add Program
                      </button>
                    </div>
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-5 animate-pulse space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-full" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : programs.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <BookIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No programs yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {programs.map((p) => {
                          const isSelected = selectedProgram?.id === p.id;
                          const pCohorts = cohorts.filter((c) => c.program_id === p.id).length;
                          return (
                            <div key={p.id} onClick={() => setSelectedProgram(p)}
                              className={`rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md group ${
                                isSelected ? "border-[#002147] bg-[#002147]/[0.02] shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
                              }`}>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: colorFor(p.title || p.name) + "18" }}>
                                    <BookIcon size={16} style={{ color: colorFor(p.title || p.name) }} />
                                  </div>
                                  <h3 className="text-sm font-bold text-[#002147] truncate">{p.title || p.name}</h3>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button onClick={(e) => { e.stopPropagation(); openEditCourse(p); }}
                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                                    <PenIcon size={12} />
                                  </button>
                                  <button onClick={(e) => removeCourse(p, e)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                    <TrashIcon size={12} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description || "No description"}</p>
                              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium">
                                <span className="flex items-center gap-1"><LayersIcon size={10} /> {isSelected ? programUnits.length : 0} units</span>
                                <span className="flex items-center gap-1"><UsersIcon size={10} /> {pCohorts} cohorts</span>
                              </div>
                              {isSelected && <div className="mt-2 text-[10px] font-semibold text-[#002147] bg-[#002147]/5 rounded-full px-2.5 py-0.5 inline-block">Selected</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ──── UNITS TAB ──── */}
                {activeTab === "units" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-[#002147]">Units / Modules</p>
                        {selectedProgram && <p className="text-xs text-gray-500 mt-0.5">For: {selectedProgram.title || selectedProgram.name}</p>}
                      </div>
                      <button onClick={openAddUnit} disabled={!selectedProgram}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        <PlusIcon size={12} /> Add Unit
                      </button>
                    </div>
                    {!selectedProgram ? (
                      <div className="text-center py-12 text-gray-400">
                        <LayersIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">Select a program first</p>
                        <button onClick={() => setActiveTab("programs")} className="mt-2 text-xs text-[#002147] hover:text-orange-500 font-semibold underline">Go to Programs</button>
                      </div>
                    ) : programUnits.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <LayersIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No units for this program yet.</p>
                        <button onClick={openAddUnit} className="mt-2 text-xs text-green-600 hover:text-green-700 font-semibold underline">Create the first unit</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {programUnits.map((unit) => (
                          <div key={unit.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all group">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-green-50"><LayersIcon size={14} className="text-green-600" /></div>
                                <h3 className="text-sm font-bold text-gray-800">{unit.name}</h3>
                              </div>
                              <button onClick={() => setShowUnitModal(true)}
                                className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100">
                                <PenIcon size={12} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{unit.description || "No description"}</p>
                            <div className="flex gap-2">
                              <button className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors">Attach Resource</button>
                              <button className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors">View Assignments</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ──── COHORTS TAB ──── */}
                {/* ──── ENROLLMENTS TAB ──── */}
                {activeTab === "enrollments" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-[#002147]">Enrollments</p>
                        {selectedProgram && <p className="text-xs text-gray-500 mt-0.5">For: {selectedProgram.title || selectedProgram.name}</p>}
                      </div>
                      <button onClick={openEnrollClient} disabled={!selectedProgram || String(selectedProgram?.id).startsWith("prefill-")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        <UserPlusIcon size={12} /> Enroll Client
                      </button>
                    </div>
                    {!selectedProgram ? (
                      <div className="text-center py-12 text-gray-400">
                        <ClipboardListIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">Select a program first</p>
                        <button onClick={() => setActiveTab("programs")} className="mt-2 text-xs text-[#002147] hover:text-orange-500 font-semibold underline">Go to Programs</button>
                      </div>
                    ) : String(selectedProgram.id).startsWith("prefill-") ? (
                      <div className="text-center py-12 text-gray-400">
                        <ClipboardListIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">Save this program first to manage enrollments.</p>
                        <p className="text-xs mt-1">Pre-filled programs need to be saved to the API before clients can be enrolled.</p>
                      </div>
                    ) : loadingEnrollments ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : enrollments.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <ClipboardListIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No clients enrolled yet.</p>
                        <button onClick={openEnrollClient} className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-semibold underline">Enroll the first client</button>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-100 flex items-center gap-2">
                          <ClipboardListIcon size={14} className="text-amber-600 shrink-0" />
                          <p className="text-xs text-amber-700"><span className="font-bold">{enrollments.length}</span> client{enrollments.length !== 1 ? "s" : ""} enrolled in this program</p>
                        </div>
                        <div className="space-y-2">
                          {enrollments.map((enrollment) => {
                            const client = enrollment.client;
                            const name = client?.user?.name ?? client?.name ?? client?.email ?? `Client #${enrollment.client_id}`;
                            const email = client?.user?.email ?? client?.email ?? "";
                            const enrolledDate = enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
                            const status = enrollment.status || "active";
                            const statusStyle = status.toLowerCase() === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200";
                            return (
                              <div key={enrollment.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-all group">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: colorFor(name) }}>
                                  {getInitials(name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                                  {email && <p className="text-xs text-gray-500 truncate">{email}</p>}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right hidden sm:block">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle}`}>{status}</span>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Enrolled {enrolledDate}</p>
                                  </div>
                                  <button onClick={() => removeEnrollment(enrollment.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Unenroll client">
                                    <UserMinusIcon size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "cohorts" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-[#002147]">Cohorts</p>
                        {selectedProgram && <p className="text-xs text-gray-500 mt-0.5">For: {selectedProgram.title || selectedProgram.name}</p>}
                      </div>
                      <button onClick={openAddCohort} disabled={!selectedProgram}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        <PlusIcon size={12} /> Add Cohort
                      </button>
                    </div>
                    {!selectedProgram ? (
                      <div className="text-center py-12 text-gray-400">
                        <UsersIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">Select a program first</p>
                        <button onClick={() => setActiveTab("programs")} className="mt-2 text-xs text-[#002147] hover:text-orange-500 font-semibold underline">Go to Programs</button>
                      </div>
                    ) : filteredCohorts.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <UsersIcon size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No cohorts yet for this program.</p>
                        <button onClick={openAddCohort} className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-semibold underline">Create the first cohort</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredCohorts.map((cohort) => (
                          <button key={cohort.id} onClick={() => openCohortDetail(cohort)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm hover:border-gray-200 transition-all text-left group">
                            <div className="p-2.5 rounded-xl bg-purple-50 shrink-0">
                              <UsersIcon size={18} className="text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800">{cohort.name}</p>
                              <p className="text-xs text-gray-500 truncate">{cohort.description || "No description"}</p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <UsersIcon size={11} /> {Array.isArray(cohort.clients) ? cohort.clients.length : 0}
                              </span>
                              {cohort.start_date && (
                                <span className="flex items-center gap-1 hidden sm:flex">
                                  <CalendarIcon size={11} /> {new Date(cohort.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  {cohort.end_date && ` – ${new Date(cohort.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                                </span>
                              )}
                              <ChevronRightIcon size={14} className="text-gray-300 group-hover:text-[#002147] transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ──── MODALS ──── */}

      {/* Add/Edit Program */}
      <Modal open={showCourseModal} onClose={() => { setShowCourseModal(false); setEditingProgramId(null); }}
        title={editingProgramId ? "Edit Program" : "New Program"}
        footer={
          <>
            <button onClick={() => { setShowCourseModal(false); setEditingProgramId(null); }}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={saveCourse} disabled={!courseForm.name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-[#002147] hover:bg-[#003875] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {editingProgramId ? "Save Changes" : "Create Program"}
            </button>
          </>
        }>
        <div className="space-y-4">
          <Input label="Program Name *" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} placeholder="e.g. Peak Performance Coaching" />
          <Textarea label="Description / Syllabus" value={courseForm.syllabus} onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })} rows={3} placeholder="Brief description of the program..." />
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Resources</p>
            {courseForm.resources.length > 0 && (
              <div className="space-y-2 mb-3">
                {courseForm.resources.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    {r.type === "link" ? <LinkIcon size={12} className="text-blue-500 shrink-0" /> : <UploadIcon size={12} className="text-green-500 shrink-0" />}
                    <span className="text-xs font-medium text-gray-700 flex-1 truncate">{r.title}</span>
                    <button onClick={() => setCourseForm((f) => ({ ...f, resources: f.resources.filter((_, j) => j !== i) }))}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><TrashIcon size={11} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <button onClick={() => setNewResource({ ...newResource, type: "link" })}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${newResource.type === "link" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                <LinkIcon size={10} className="inline mr-1" /> Link
              </button>
              <button onClick={() => setNewResource({ ...newResource, type: "document" })}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${newResource.type === "document" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                <UploadIcon size={10} className="inline mr-1" /> File
              </button>
            </div>
            <div className="flex gap-2">
              <input value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Title" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]/10" />
              {newResource.type === "link" ? (
                <input value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  placeholder="URL" className="flex-[2] border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]/10" />
              ) : (
                <label className="flex-[2] flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 cursor-pointer hover:border-[#002147] transition-colors">
                  <UploadIcon size={12} /> {newResource.file ? newResource.file.name.slice(0, 20) : "Choose file"}
                  <input ref={fileRef} type="file" className="hidden" onChange={(e) => setNewResource({ ...newResource, file: e.target.files?.[0] || null })} />
                </label>
              )}
              <button onClick={addResource}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#002147] hover:bg-[#003875] transition-all">Add</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Unit */}
      <Modal open={showUnitModal} onClose={() => setShowUnitModal(false)} title="Add Unit / Module"
        footer={
          <>
            <button onClick={() => setShowUnitModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button onClick={saveUnit} disabled={!unitForm.name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed">Create Unit</button>
          </>
        }>
        <div className="space-y-4">
          <Input label="Unit Name *" value={unitForm.name} onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })} placeholder="e.g. Module 1: Introduction" />
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Resources</p>
            {unitForm.resources.length > 0 && (
              <div className="space-y-2 mb-3">
                {unitForm.resources.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    {r.type === "link" ? <LinkIcon size={12} className="text-blue-500" /> : <UploadIcon size={12} className="text-green-500" />}
                    <span className="text-xs font-medium text-gray-700 flex-1 truncate">{r.title}</span>
                    <button onClick={() => setUnitForm((f) => ({ ...f, resources: f.resources.filter((_, j) => j !== i) }))}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><TrashIcon size={11} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <button onClick={() => setNewUnitResource((r) => ({ ...r, type: "link" }))}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${newUnitResource.type === "link" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>Link</button>
              <button onClick={() => setNewUnitResource((r) => ({ ...r, type: "document" }))}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${newUnitResource.type === "document" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>File</button>
            </div>
            <div className="flex gap-2">
              <input value={newUnitResource.title} onChange={(e) => setNewUnitResource({ ...newUnitResource, title: e.target.value })}
                placeholder="Title" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]/10" />
              {newUnitResource.type === "link" ? (
                <input value={newUnitResource.url} onChange={(e) => setNewUnitResource({ ...newUnitResource, url: e.target.value })}
                  placeholder="URL" className="flex-[2] border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]/10" />
              ) : (
                <label className="flex-[2] flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 cursor-pointer hover:border-[#002147]">
                  <UploadIcon size={12} /> {newUnitResource.file ? newUnitResource.file.name.slice(0, 20) : "Choose file"}
                  <input ref={unitFileRef} type="file" className="hidden" onChange={(e) => setNewUnitResource({ ...newUnitResource, file: e.target.files?.[0] || null })} />
                </label>
              )}
              <button onClick={addUnitResource} className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700">Add</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Cohort */}
      <Modal open={showCohortModal} onClose={() => setShowCohortModal(false)} title="New Cohort"
        footer={
          <>
            <button onClick={() => setShowCohortModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button onClick={saveCohort} disabled={!cohortForm.name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed">Create Cohort</button>
          </>
        }>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            <span className="font-semibold">Program:</span> {selectedProgram?.title || selectedProgram?.name || "—"}
          </div>
          <Input label="Cohort Name *" value={cohortForm.name} onChange={(e) => setCohortForm({ ...cohortForm, name: e.target.value })} placeholder="e.g. Cohort 2026 - Spring" />
          <Textarea label="Description" value={cohortForm.description} onChange={(e) => setCohortForm({ ...cohortForm, description: e.target.value })} rows={2} placeholder="Brief description..." />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" value={cohortForm.start_date} onChange={(e) => setCohortForm({ ...cohortForm, start_date: e.target.value })} />
            <Input label="End Date" type="date" value={cohortForm.end_date} onChange={(e) => setCohortForm({ ...cohortForm, end_date: e.target.value })} />
          </div>
        </div>
      </Modal>

      {/* Cohort Detail */}
      <Modal open={showCohortDetail} onClose={() => setShowCohortDetail(false)} title={selectedCohort?.name || "Cohort Details"} wide
        footer={
          <button onClick={() => setShowCohortDetail(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Close</button>
        }>
        {selectedCohort && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Program</p>
                <p className="text-sm text-gray-800 font-medium">{selectedProgram?.title || selectedProgram?.name || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Dates</p>
                <p className="text-sm text-gray-800 font-medium">
                  {selectedCohort.start_date ? new Date(selectedCohort.start_date).toLocaleDateString() : "—"}
                  {selectedCohort.end_date ? ` – ${new Date(selectedCohort.end_date).toLocaleDateString()}` : ""}
                </p>
              </div>
            </div>
            {selectedCohort.description && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium uppercase mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedCohort.description}</p>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Members ({Array.isArray(selectedCohort.clients) ? selectedCohort.clients.length : 0})
                </p>
                <button onClick={openAddClient}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all">
                  <UserPlusIcon size={12} /> Add Client
                </button>
              </div>
              {(!selectedCohort.clients || selectedCohort.clients.length === 0) ? (
                <div className="text-center py-6 text-gray-400">
                  <UsersIcon size={24} className="mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">No clients in this cohort yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedCohort.clients.map((client) => {
                    const name = client?.user?.name ?? client?.name ?? client?.email ?? "Unknown";
                    const email = client?.user?.email ?? client?.email ?? "";
                    return (
                      <div key={client?.id ?? client?.user_id ?? name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: colorFor(name) }}>
                          {getInitials(name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                          {email && <p className="text-xs text-gray-500 truncate">{email}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Client to Cohort */}
      <Modal open={showAddClientModal} onClose={() => setShowAddClientModal(false)} title={`Add Client to ${selectedCohort?.name || "Cohort"}`}
        footer={
          <>
            <button onClick={() => setShowAddClientModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button onClick={saveAddClient} disabled={!selectedClientId}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed">Add to Cohort</button>
          </>
        }>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Select Client</label>
            <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]">
              <option value="">Choose a client...</option>
              {clientOptions.map((c) => {
                const id = c.id ?? c.user_id ?? c.user?.id;
                const name = c.user?.name ?? c.name ?? c.email ?? `Client ${id}`;
                const email = c.user?.email ?? c.email ?? "";
                return <option key={id} value={id}>{name}{email ? ` (${email})` : ""}</option>;
              })}
            </select>
          </div>
          {clientOptions.length === 0 && clients.length > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5">All clients are already in this cohort.</p>
          )}
          {clients.length === 0 && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">No clients available. Add clients in the platform first.</p>
          )}
        </div>
      </Modal>

      {/* Enroll Client in Program */}
      <Modal open={showEnrollModal} onClose={() => setShowEnrollModal(false)} title={`Enroll Client in ${selectedProgram?.title || selectedProgram?.name || "Program"}`}
        footer={
          <>
            <button onClick={() => setShowEnrollModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button onClick={saveEnrollment} disabled={!enrollClientId}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed">Enroll</button>
          </>
        }>
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            <span className="font-semibold">Program:</span> {selectedProgram?.title || selectedProgram?.name || "—"}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Select Client</label>
            <select value={enrollClientId} onChange={(e) => setEnrollClientId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]">
              <option value="">Choose a client...</option>
              {enrollableClients.map((c) => {
                const id = c.id ?? c.user_id ?? c.user?.id;
                const name = c.user?.name ?? c.name ?? c.email ?? `Client ${id}`;
                const email = c.user?.email ?? c.email ?? "";
                return <option key={id} value={id}>{name}{email ? ` (${email})` : ""}</option>;
              })}
            </select>
          </div>
          {enrollableClients.length === 0 && enrollClients.length > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5">All available clients are already enrolled in this program.</p>
          )}
          {enrollClients.length === 0 && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">No clients available. Add clients to the platform first.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
