 "use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import { FaCompass, FaSearch, FaPlus, FaTrash, FaEdit, FaUsers, FaRoute, FaCheck, FaTimes } from "react-icons/fa";

// Mirror the client-side Education Compass sections so admins can control what
// appears for each template.
const EDUCATION_SECTIONS = [
  { name: "Home", sectionId: "overview" },
  { name: "Syllabus", sectionId: "syllabus" },
  { name: "Modules", sectionId: "modules" },
  { name: "Assignments", sectionId: "assignments" },
  { name: "Quizzes", sectionId: "quizzes" },
  { name: "Grades", sectionId: "grades" },
  { name: "Media Gallery", sectionId: "media-gallery" },
  { name: "Zoom", sectionId: "zoom" },
  { name: "Course Reader Solutions", sectionId: "reader-solutions" },
  { name: "Library Resources", sectionId: "library-resources" },
  { name: "Store Course Materials", sectionId: "store-materials" },
  { name: "Media Reserves", sectionId: "media-reserves" },
  { name: "Search", sectionId: "search" },
];

const INITIAL_PATHWAYS = [
  {
    id: 1,
    name: "STEM Degree Roadmap",
    audience: "Undergraduate",
    owner: "Academic Team",
    status: "Active",
    lastUpdated: "2025-09-10",
    enabledSections: [
      "overview",
      "modules",
      "assignments",
      "quizzes",
      "grades",
      "library-resources",
    ],
  },
  {
    id: 2,
    name: "Skilled Trades Pathway",
    audience: "Career Changers",
    owner: "Coaching Team",
    status: "Active",
    lastUpdated: "2025-07-22",
    enabledSections: [
      "overview",
      "modules",
      "assignments",
      "zoom",
      "store-materials",
    ],
  },
  {
    id: 3,
    name: "Graduate School Prep",
    audience: "Graduating Seniors",
    owner: "Admin",
    status: "Draft",
    lastUpdated: "2025-12-01",
    enabledSections: ["overview", "modules", "assignments"],
  },
];

const STATUS_OPTIONS = ["Active", "Draft", "Inactive"];

// Mock participants — replace with clientsService.getClients() call when API is ready
const MOCK_PARTICIPANTS = [
  { id: 'p1', name: 'Marcus Johnson', email: 'marcus.j@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p2', name: 'Sarah Williams', email: 'swilliams@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p3', name: 'David Chen', email: 'dchen@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p4', name: 'Aisha Thompson', email: 'a.thompson@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p5', name: 'James Rodriguez', email: 'j.rodriguez@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p6', name: 'Priya Patel', email: 'priya.p@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p7', name: 'Kevin O\'Brien', email: 'kobrien@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
  { id: 'p8', name: 'Danielle Moore', email: 'd.moore@email.com', cohort: 'Cohort 1 — Spring 2026', status: 'Active' },
];

const ADMIN_TABS = [
  { id: 'pathways', label: 'Education Pathways', icon: FaRoute },
  { id: 'assignments', label: 'Participant Assignments', icon: FaUsers },
];

const emptyForm = {
  id: null,
  name: "",
  audience: "",
  owner: "",
  status: "Draft",
  enabledSections: ["overview", "modules", "assignments"],
};

export default function EducationCompassManagementPage() {
  // ── Tab navigation ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('pathways');

  // ── Pathways state ────────────────────────────────────────────────────────
  const [pathways, setPathways] = useState(INITIAL_PATHWAYS);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Participant assignments state ─────────────────────────────────────────
  // assignments: { [participantId]: pathwayId | null }
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [assignments, setAssignments] = useState(() => {
    // Pre-assign first 4 participants to PLEP pathway for demo
    return { p1: 1, p2: 1, p3: 1, p4: 1 };
  });
  const [participantSearch, setParticipantSearch] = useState('');
  const [assignFilter, setAssignFilter] = useState('All'); // All | Assigned | Unassigned
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Participant data loads from mock; swap in a real API call when backend is ready:
  // clientsService.getClients().then(data => setParticipants(mapClients(data)))
  useEffect(() => {
    setLoadingParticipants(false); // mock data is already set in useState above
  }, []);

  const handleAssignmentChange = useCallback((participantId, pathwayId) => {
    setAssignments((prev) => ({ ...prev, [participantId]: pathwayId ? Number(pathwayId) : null }));
  }, []);

  const handleSaveAssignments = useCallback(() => {
    // TODO: POST to /api/admin/education-compass/assignments when backend is ready
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, []);

  const handleClearAssignment = useCallback((participantId) => {
    setAssignments((prev) => ({ ...prev, [participantId]: null }));
  }, []);

  const filteredParticipants = useMemo(() => {
    const q = participantSearch.trim().toLowerCase();
    return participants.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || (p.cohort || '').toLowerCase().includes(q);
      const isAssigned = !!assignments[p.id];
      const matchFilter = assignFilter === 'All' || (assignFilter === 'Assigned' ? isAssigned : !isAssigned);
      return matchSearch && matchFilter;
    });
  }, [participants, participantSearch, assignFilter, assignments]);

  const assignedCount = useMemo(() => participants.filter((p) => !!assignments[p.id]).length, [participants, assignments]);
  const activePathways = useMemo(() => pathways.filter((pw) => pw.status === 'Active'), [pathways]);

  const filteredPathways = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = pathways;
    if (!term) return base;
    return base.filter((pathway) =>
      [pathway.name, pathway.audience, pathway.owner]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [pathways, search]);

  const totalCount = pathways.length;
  const activeCount = pathways.filter((p) => p.status === "Active").length;
  const inactiveOrDraftCount = pathways.filter(
    (p) => p.status !== "Active"
  ).length;

  const openNewModal = () => {
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (pathway) => {
    setForm({
      id: pathway.id,
      name: pathway.name || "",
      audience: pathway.audience || "",
      owner: pathway.owner || "",
      status: pathway.status || "Draft",
      enabledSections: pathway.enabledSections?.length
        ? pathway.enabledSections
        : emptyForm.enabledSections,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = (sectionId) => {
    setForm((prev) => {
      const exists = prev.enabledSections.includes(sectionId);
      return {
        ...prev,
        enabledSections: exists
          ? prev.enabledSections.filter((s) => s !== sectionId)
          : [...prev.enabledSections, sectionId],
      };
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    const now = new Date().toISOString().slice(0, 10);
    if (form.id == null) {
      const nextId = pathways.length
        ? Math.max(...pathways.map((p) => p.id)) + 1
        : 1;
      const newPathway = {
        ...form,
        id: nextId,
        owner: form.owner || "Admin",
        lastUpdated: now,
      };
      setPathways((prev) => [...prev, newPathway]);
    } else {
      setPathways((prev) =>
        prev.map((pathway) =>
          pathway.id === form.id
            ? {
                ...pathway,
                ...form,
                lastUpdated: now,
              }
            : pathway
        )
      );
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this Education Compass pathway?"
      );
      if (!confirmed) return;
    }
    setPathways((prev) => prev.filter((pathway) => pathway.id !== id));
  };

  const describeSections = (pathway) => {
    const names = EDUCATION_SECTIONS.filter((s) =>
      pathway.enabledSections?.includes(s.sectionId)
    ).map((s) => s.name);
    if (!names.length) return "No sections enabled";
    if (names.length <= 3) return names.join(", ");
    return `${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
              <FaCompass size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#002147]">
                Education Compass Management
              </h1>
              <p className="text-gray-600 text-sm">
                Manage pathways and sections that power the client Education
                Compass.
              </p>
            </div>
          </div>

          {activeTab === 'pathways' && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder="Search education pathways..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <FaSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
              <button
                type="button"
                onClick={openNewModal}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <FaPlus size={12} />
                New Pathway
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={13} />
                {tab.label}
                {tab.id === 'assignments' && (
                  <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'assignments' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {assignedCount}/{participants.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── PATHWAYS TAB ── */}
        {activeTab === 'pathways' && <>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Education Pathways
            </p>
            <p className="text-2xl font-bold text-[#002147]">{totalCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              Total guidance templates configured across the platform.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Active Pathways
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {activeCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Currently visible to clients in the Education Compass.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Draft / Inactive
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {inactiveOrDraftCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Templates that can be refined before publishing.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#002147]">
              Education Compass Pathways
            </h2>
            <span className="text-xs text-gray-500">
              {filteredPathways.length} result
              {filteredPathways.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Audience</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Client Sections</th>
                  <th className="px-4 py-2">Last Updated</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPathways.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                    >
                      No matching education pathways. Try a different search or
                      create a new pathway.
                    </td>
                  </tr>
                ) : (
                  filteredPathways.map((pathway) => (
                    <tr
                      key={pathway.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{pathway.name}</div>
                        {pathway.audience && (
                          <div className="text-xs text-gray-500">
                            Audience: {pathway.audience}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {pathway.audience || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                            pathway.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : pathway.status === "Draft"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {pathway.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="block max-w-xs truncate">
                          {describeSections(pathway)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {pathway.lastUpdated || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(pathway)}
                            className="p-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
                            title="Edit pathway"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pathway.id)}
                            className="p-1.5 rounded-md border border-red-100 text-red-600 hover:bg-red-50"
                            title="Delete pathway"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50">
            This page currently stores changes in the browser only. Connect to
            backend services to persist and publish Education Compass pathways.
          </div>
        </section>
        </> /* end pathways tab */}

        {/* ── PARTICIPANT ASSIGNMENTS TAB ── */}
        {activeTab === 'assignments' && (
          <section>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Participants</p>
                <p className="text-2xl font-bold text-[#002147]">{participants.length}</p>
                <p className="text-xs text-gray-500 mt-1">Enrolled in the PLEP pilot cohort.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assigned</p>
                <p className="text-2xl font-bold text-emerald-600">{assignedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Participants with an active pathway.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Unassigned</p>
                <p className="text-2xl font-bold text-amber-600">{participants.length - assignedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Participants pending pathway assignment.</p>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <div className="relative sm:w-72">
                  <input
                    type="text"
                    placeholder="Search participants…"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
                </div>
                <div className="flex gap-1">
                  {['All', 'Assigned', 'Unassigned'].map((f) => (
                    <button key={f} type="button" onClick={() => setAssignFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        assignFilter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                    <FaCheck size={11} /> Assignments saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveAssignments}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <FaCheck size={12} />
                  Save All Assignments
                </button>
              </div>
            </div>

            {/* Assignment Table */}
            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#002147]">Pathway Assignments</h2>
                <span className="text-xs text-gray-500">{filteredParticipants.length} participant{filteredParticipants.length !== 1 ? 's' : ''}</span>
              </div>

              {loadingParticipants ? (
                <div className="py-10 text-center text-gray-500 text-sm">Loading participants…</div>
              ) : filteredParticipants.length === 0 ? (
                <div className="py-10 text-center text-gray-500 text-sm">
                  {participantSearch || assignFilter !== 'All' ? 'No participants match your filters.' : 'No participants found.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <th className="px-4 py-2">Participant</th>
                        <th className="px-4 py-2">Cohort</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 w-60">Assigned Pathway</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((participant) => {
                        const assignedPathwayId = assignments[participant.id] || null;
                        const assignedPathway = pathways.find((pw) => pw.id === assignedPathwayId);
                        const initials = participant.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                        return (
                          <tr key={participant.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{participant.name}</div>
                                  <div className="text-xs text-gray-500">{participant.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{participant.cohort || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                                participant.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {participant.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={assignedPathwayId ?? ''}
                                onChange={(e) => handleAssignmentChange(participant.id, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              >
                                <option value="">— No pathway assigned —</option>
                                {activePathways.map((pw) => (
                                  <option key={pw.id} value={pw.id}>{pw.name}</option>
                                ))}
                                {pathways.filter((pw) => pw.status !== 'Active').map((pw) => (
                                  <option key={pw.id} value={pw.id} disabled>{pw.name} ({pw.status})</option>
                                ))}
                              </select>
                              {assignedPathway && (
                                <p className="text-[10px] text-gray-500 mt-0.5 px-1">
                                  Enabled: {assignedPathway.enabledSections?.length ?? 0} sections
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {assignedPathwayId && (
                                <button
                                  type="button"
                                  onClick={() => handleClearAssignment(participant.id)}
                                  className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
                                  title="Remove pathway assignment"
                                >
                                  <FaTimes size={11} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50 flex items-center justify-between">
                <span>
                  Assignments are saved to the backend when you click "Save All Assignments".
                  {activePathways.length === 0 && (
                    <span className="ml-1 text-amber-600 font-medium">No active pathways — set a pathway to Active first.</span>
                  )}
                </span>
                <span className="text-gray-400">{assignedCount} / {participants.length} assigned</span>
              </div>
            </div>
          </section>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#002147]">
                    {form.id == null
                      ? "New Education Pathway"
                      : "Edit Education Pathway"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Define who this pathway is for and which Education Compass
                    sections are enabled.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pathway name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. STEM Degree Roadmap"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Audience
                    </label>
                    <input
                      type="text"
                      name="audience"
                      value={form.audience}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Undergraduates, Career Changers"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Owner
                    </label>
                    <input
                      type="text"
                      name="owner"
                      value={form.owner}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Academic Team"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <fieldset className="border border-gray-200 rounded-lg px-3 py-3">
                  <legend className="text-xs font-semibold text-gray-700 px-1">
                    Enabled client sections
                  </legend>
                  <p className="text-[11px] text-gray-500 mb-2">
                    These map directly to the sections in the client Education
                    Compass sidebar.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EDUCATION_SECTIONS.map((section) => (
                      <label
                        key={section.sectionId}
                        className="flex items-center gap-2 text-xs text-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={form.enabledSections.includes(
                            section.sectionId
                          )}
                          onChange={() => toggleSection(section.sectionId)}
                        />
                        <span>{section.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
                >
                  Save Pathway
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

