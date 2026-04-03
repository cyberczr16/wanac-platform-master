"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../../../components/dashboardcomponents/adminsidebar";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Clock,
  Video,
  Link as LinkIcon,
  Image,
  FileText,
  Film,
  Paperclip,
  Plus,
  User,
  Save,
  Flag,
  X,
  Calendar,
  Target,
  Copy,
  Check,
} from "lucide-react";
import { fireteamService } from "../../../../../../services/api/fireteam.service";
import { experienceService } from "../../../../../../services/api/experience.service";
import { generateFireteamMeetingLink } from "../../../../../../lib/livekit.utils";
import EditExperienceModal from "../../../../../../../components/EditExperienceModal";

/* ─── Reusable micro-components ─── */

function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = type === "error"
    ? "bg-red-500 text-white"
    : "bg-gray-900 text-white";
  return (
    <div className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium ${colors}`}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

/* ─── Main page ─── */

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id: fireteamId, experienceId } = params;

  const [experience, setExperience] = useState(null);
  const [fireteam, setFireteam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type }
  const [showEditModal, setShowEditModal] = useState(false);
  const [editExperienceData, setEditExperienceData] = useState({
    title: "",
    experience: "",
    agenda: [],
    exhibits: [],
    videoAdminId: "",
    link: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showAddAgendaDialog, setShowAddAgendaDialog] = useState(false);
  const [newAgendaStep, setNewAgendaStep] = useState({ title: "", duration: "" });
  const [showAddExhibitDialog, setShowAddExhibitDialog] = useState(false);
  const [newExhibit, setNewExhibit] = useState({ name: "", type: "link", link: "" });
  const [selectedVideoAdminId, setSelectedVideoAdminId] = useState("");
  const [isUpdatingVideoAdmin, setIsUpdatingVideoAdmin] = useState(false);
  const [showAddObjectiveDialog, setShowAddObjectiveDialog] = useState(false);
  const [newObjective, setNewObjective] = useState({ objective: "" });
  const [objectives, setObjectives] = useState([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (fireteamId && experienceId) fetchExperienceDetails();
  }, [fireteamId, experienceId]);

  useEffect(() => {
    if (experience) {
      const facilitatorId = experience.admin || experience.videoAdminId;
      setSelectedVideoAdminId(facilitatorId ? facilitatorId.toString() : "");
    }
  }, [experience]);

  useEffect(() => {
    if (experience && showEditModal) {
      const agendaSource = experience.agenda || experience.agenda_steps || [];
      const agendaData = Array.isArray(agendaSource) && agendaSource.length > 0
        ? agendaSource.map((step) => ({
            ...step,
            title: typeof step.title === "string" ? step.title : "",
            duration: typeof step.duration === "string" ? step.duration : "",
          }))
        : [];
      const exhibitsData =
        experience.exhibits && Array.isArray(experience.exhibits) && experience.exhibits.length > 0
          ? experience.exhibits.map((ex) => ({ ...ex, link: ex.link || ex.url || "", file: null }))
          : [];
      setEditExperienceData((prev) => ({ ...prev, agenda: agendaData, exhibits: exhibitsData }));
    }
  }, [experience, showEditModal]);

  const fetchExperienceDetails = async () => {
    setLoading(true);
    try {
      const fireteamData = await fireteamService.getFireteam(fireteamId);
      const fireTeam = fireteamData.fireTeam;
      setFireteam(fireTeam);
      setMembers(Array.isArray(fireTeam.members) ? fireTeam.members : []);
      const experiences = Array.isArray(fireTeam.experiences) ? fireTeam.experiences : [];
      const currentExperience = experiences.find((exp) => exp.id === parseInt(experienceId));
      if (currentExperience) {
        const normalized = {
          ...currentExperience,
          agenda: currentExperience.agenda || currentExperience.agenda_steps || [],
          exhibits: currentExperience.exhibits || [],
        };
        setExperience(normalized);
        if (currentExperience.objectives && Array.isArray(currentExperience.objectives)) {
          setObjectives(currentExperience.objectives);
        }
      } else {
        showToast("Experience not found", "error");
      }
    } catch (err) {
      console.error("Error fetching experience:", err);
      showToast("Failed to load experience details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!experience) return;
    const agendaSource = experience.agenda || experience.agenda_steps || [];
    const agendaData = Array.isArray(agendaSource) && agendaSource.length > 0
      ? agendaSource.map((step) => ({
          ...step,
          title: typeof step.title === "string" ? step.title : "",
          duration: typeof step.duration === "string" ? step.duration : "",
        }))
      : [];
    const exhibitsData =
      experience.exhibits && Array.isArray(experience.exhibits) && experience.exhibits.length > 0
        ? experience.exhibits.map((ex) => ({ ...ex, file: null }))
        : [];
    setEditExperienceData({
      title: experience.title || "",
      experience: experience.experience || "",
      agenda: agendaData,
      exhibits: exhibitsData,
      videoAdminId: experience.videoAdminId || "",
      link: experience.link || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceService.deleteExperience(experienceId);
        showToast("Experience deleted successfully!");
        setTimeout(() => router.push(`/admin/fireteammanagement/${fireteamId}`), 1000);
      } catch (err) {
        showToast("Failed to delete experience", "error");
      }
    }
  };

  const handleAddAgendaStep = async ({ title, duration }) => {
    if (!experience) return;
    try {
      const stepTitle = title && typeof title === "string" && title.trim() ? title : "New Step";
      const requestData = {
        fire_team_experience_id: experience.id,
        title: stepTitle,
        duration: typeof duration === "string" ? duration : "5 minutes",
      };
      const newStep = await experienceService.addAgendaStep(requestData);
      const safeStep = {
        ...newStep,
        title: typeof newStep.title === "string" ? newStep.title : stepTitle,
        duration: typeof newStep.duration === "string" ? newStep.duration : "5 minutes",
      };
      setEditExperienceData((prev) => ({ ...prev, agenda: [...prev.agenda, safeStep] }));
      return safeStep;
    } catch (err) {
      showToast("Failed to add agenda step", "error");
      throw err;
    }
  };

  const handleAddExhibit = async () => {
    if (!experience) return;
    try {
      const newEx = await experienceService.addExhibit({
        fire_team_experience_id: experience.id,
        name: "New Exhibit",
        type: "link",
        link: "https://",
      });
      setEditExperienceData((prev) => ({ ...prev, exhibits: [...prev.exhibits, { ...newEx, file: null }] }));
    } catch (err) {
      showToast("Failed to add exhibit", "error");
      throw err;
    }
  };

  const handleSubmitAgendaStep = async () => {
    if (!newAgendaStep.title.trim()) { showToast("Agenda step title is required", "error"); return; }
    try {
      await experienceService.addAgendaStep({
        fire_team_experience_id: experience.id,
        title: newAgendaStep.title,
        duration: newAgendaStep.duration || "5 minutes",
      });
      showToast("Agenda step added successfully!");
      setShowAddAgendaDialog(false);
      setNewAgendaStep({ title: "", duration: "" });
      await fetchExperienceDetails();
    } catch (err) {
      showToast("Failed to add agenda step", "error");
    }
  };

  const handleSubmitExhibit = async () => {
    if (!newExhibit.name.trim()) { showToast("Exhibit name is required", "error"); return; }
    if (newExhibit.type === "link" && !newExhibit.link.trim()) { showToast("Link is required for link-type exhibits", "error"); return; }
    try {
      await experienceService.addExhibit({
        fire_team_experience_id: experience.id,
        name: newExhibit.name,
        type: newExhibit.type,
        ...(newExhibit.type === "link" && { link: newExhibit.link }),
      });
      showToast("Exhibit added successfully!");
      setShowAddExhibitDialog(false);
      setNewExhibit({ name: "", type: "link", link: "" });
      await fetchExperienceDetails();
    } catch (err) {
      showToast("Failed to add exhibit", "error");
    }
  };

  const handleAddObjective = async () => {
    if (!newObjective.objective.trim()) { showToast("Objective is required", "error"); return; }
    try {
      const userData = localStorage.getItem("wanacUser");
      const user = userData ? JSON.parse(userData) : null;
      const addedObjective = await fireteamService.addObjective({
        fire_team_experience_id: experienceId,
        objective: newObjective.objective,
        added_by: user?.id,
      });
      showToast("Objective added successfully!");
      setObjectives((prev) => [...prev, addedObjective]);
      setShowAddObjectiveDialog(false);
      setNewObjective({ objective: "" });
      await fetchExperienceDetails();
    } catch (err) {
      showToast("Failed to add objective", "error");
    }
  };

  const handleDeleteObjective = async (objectiveId) => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        await fireteamService.deleteObjective(objectiveId);
        showToast("Objective deleted successfully!");
        setObjectives((prev) => prev.filter((obj) => obj.id !== objectiveId));
        await fetchExperienceDetails();
      } catch (err) {
        showToast("Failed to delete objective", "error");
      }
    }
  };

  const handleDeleteAgendaStep = async (agendaStepId) => {
    if (window.confirm("Are you sure you want to delete this agenda step?")) {
      try {
        await experienceService.deleteAgendaStep(agendaStepId);
        showToast("Agenda step deleted successfully!");
        await fetchExperienceDetails();
      } catch (err) {
        showToast("Failed to delete agenda step", "error");
      }
    }
  };

  const handleDeleteExhibit = async (exhibitId) => {
    if (window.confirm("Are you sure you want to delete this exhibit?")) {
      try {
        await experienceService.deleteExhibit(exhibitId);
        showToast("Exhibit deleted successfully!");
        await fetchExperienceDetails();
      } catch (err) {
        showToast("Failed to delete exhibit", "error");
      }
    }
  };

  const handleUpdateVideoAdmin = async () => {
    if (!selectedVideoAdminId) { showToast("Please select a video admin", "error"); return; }
    setIsUpdatingVideoAdmin(true);
    try {
      const updateData = {
        title: experience.title,
        experience: experience.experience,
        link: experience.link,
        status: experience.status,
        report: experience.report,
        summary: experience.summary,
        admin: parseInt(selectedVideoAdminId),
      };
      const result = await experienceService.updateExperience(experience.id, updateData);
      if (result.fireTeamExperience?.admin === null) {
        showToast("Backend does not support setting meeting facilitator.", "error");
      } else {
        showToast("Meeting facilitator updated successfully!");
      }
      await fetchExperienceDetails();
    } catch (err) {
      showToast("Failed to update meeting facilitator: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setIsUpdatingVideoAdmin(false);
    }
  };

  const handleGenerateLink = () => {
    try {
      const userData = localStorage.getItem("wanacUser");
      const user = userData ? JSON.parse(userData) : null;
      const newLink = generateFireteamMeetingLink(
        fireteamId,
        experienceId,
        user?.name || "admin",
        experience?.title || "Fireteam Meeting"
      );
      setGeneratedLink(newLink);
      showToast("Meeting link generated! Click 'Save Link' to apply it.");
    } catch (err) {
      showToast("Failed to generate meeting link", "error");
    }
  };

  const handleSaveLink = async () => {
    if (!generatedLink) { showToast("No link to save. Please generate a link first.", "error"); return; }
    setIsSavingLink(true);
    try {
      await experienceService.updateExperience(experience.id, {
        title: experience.title,
        experience: experience.experience,
        link: generatedLink,
        status: experience.status,
        report: experience.report,
        summary: experience.summary,
        admin: experience.admin,
      });
      showToast("Meeting link saved successfully!");
      setGeneratedLink("");
      await fetchExperienceDetails();
    } catch (err) {
      showToast("Failed to save meeting link: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!experience.link) { showToast("No link to delete.", "error"); return; }
    if (!window.confirm("Are you sure you want to delete this meeting link?")) return;
    setIsSavingLink(true);
    try {
      await experienceService.updateExperience(experience.id, {
        title: experience.title,
        experience: experience.experience,
        link: "",
        status: experience.status,
        report: experience.report,
        summary: experience.summary,
        admin: experience.admin,
      });
      showToast("Meeting link deleted successfully!");
      setGeneratedLink("");
      await fetchExperienceDetails();
    } catch (err) {
      showToast("Failed to delete meeting link: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      showToast("Failed to copy link to clipboard", "error");
    }
  };

  const validateExperienceData = () => {
    const errors = {};
    if (!editExperienceData.title.trim()) errors.title = "Experience title is required";
    if (!editExperienceData.experience.trim()) errors.experience = "Experience content is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => setValidationErrors({});

  const getExhibitIcon = (type) => {
    switch (type) {
      case "image": return <Image className="w-4 h-4" />;
      case "video": return <Film className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "link": return <LinkIcon className="w-4 h-4" />;
      default: return <Paperclip className="w-4 h-4" />;
    }
  };

  /* ── Loading / empty states ── */
  if (loading) {
    return (
      <div className="flex h-screen bg-[#f5f5f5]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading experience details…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex h-screen bg-[#f5f5f5]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500 font-semibold">Experience not found</p>
        </main>
      </div>
    );
  }

  /* ── Shared input class ── */
  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm";

  return (
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ── Page header ── */}
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <button
            onClick={() => router.push(`/admin/fireteammanagement/${fireteamId}`)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {fireteam?.title || "Fireteam"}
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[2rem] font-black text-gray-900 leading-tight">{experience.title}</h1>
              {fireteam && (
                <p className="text-sm text-gray-500 mt-0.5">{fireteam.title}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 pt-1">
              {experience.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  experience.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {experience.status}
                </span>
              )}
              {experience.status === "completed" && (
                <button
                  onClick={() => router.push(`/client/fireteam/experience/${experienceId}/evaluation?experienceId=${experienceId}&fireteamId=${fireteamId}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-semibold transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  View Results
                </button>
              )}
              {experience.link && (
                <button
                  onClick={() => {
                    const clientUrl = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}&link=${encodeURIComponent(experience.link)}&admin=true`;
                    router.push(clientUrl);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Meeting
                </button>
              )}
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-xs font-semibold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-full text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* ── Left column (8/12) ── */}
            <div className="lg:col-span-8 flex flex-col gap-5">

              {/* Experience Content */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Experience Content</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{experience.experience}</p>

                {(experience.summary || experience.report) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {experience.summary && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Summary</p>
                        <p className="text-xs text-gray-700">{experience.summary}</p>
                      </div>
                    )}
                    {experience.report && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Report</p>
                        <p className="text-xs text-gray-700">{experience.report}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Learning Objectives */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-amber-500" />
                    Learning Objectives
                  </h2>
                  <button
                    onClick={() => setShowAddObjectiveDialog(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
                {objectives && objectives.length > 0 ? (
                  <div className="space-y-2">
                    {objectives.map((objective, index) => (
                      <div
                        key={objective.id || index}
                        className="group flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700">{objective.objective}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteObjective(objective.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No learning objectives yet</p>
                )}
              </div>

              {/* Agenda & Exhibits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Agenda */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Agenda</h2>
                    <button
                      onClick={() => setShowAddAgendaDialog(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                  {experience.agenda && experience.agenda.length > 0 ? (
                    <div className="space-y-2">
                      {experience.agenda.map((step, index) => (
                        <div
                          key={step.id || index}
                          className="group flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-xs font-bold">
                            {index + 1}
                          </span>
                          <p className="text-sm font-medium text-gray-900 flex-1">{step.title}</p>
                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </div>
                          <button
                            onClick={() => handleDeleteAgendaStep(step.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No agenda steps yet</p>
                  )}
                </div>

                {/* Exhibits */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Exhibits</h2>
                    <button
                      onClick={() => setShowAddExhibitDialog(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                  {experience.exhibits && experience.exhibits.length > 0 ? (
                    <div className="space-y-2">
                      {experience.exhibits.map((exhibit, index) => (
                        <div
                          key={exhibit.id || index}
                          className="group flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="text-gray-400 flex-shrink-0">{getExhibitIcon(exhibit.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{exhibit.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-md">{exhibit.type}</span>
                              {exhibit.type === "link" && exhibit.link && (
                                <a
                                  href={exhibit.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Open →
                                </a>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteExhibit(exhibit.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No exhibits yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right column (4/12) ── */}
            <div className="lg:col-span-4 flex flex-col gap-5">

              {/* Meeting Facilitator */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-4">
                  <User className="w-4 h-4 text-gray-500" />
                  Meeting Facilitator
                </h2>
                <select
                  value={selectedVideoAdminId}
                  onChange={(e) => setSelectedVideoAdminId(e.target.value)}
                  className={`${inputCls} mb-3`}
                >
                  <option value="">None</option>
                  {members.map((member) => (
                    <option
                      key={member.id}
                      value={member.client?.user?.id || member.user_id || member.id}
                    >
                      {member.client?.user?.name ||
                        member.user?.name ||
                        member.name ||
                        `User #${member.client?.user?.id || member.user_id || member.id}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUpdateVideoAdmin}
                  disabled={isUpdatingVideoAdmin || !selectedVideoAdminId}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-full text-xs font-semibold transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isUpdatingVideoAdmin ? "Saving…" : "Save Facilitator"}
                </button>
              </div>

              {/* Meeting Link */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-4">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  Meeting Link
                </h2>

                {experience.link && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1.5">Current Link</p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                        <p className="text-xs font-mono text-gray-700 break-all">{experience.link}</p>
                      </div>
                      <button
                        onClick={() => handleCopyLink(experience.link)}
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-gray-900 hover:bg-gray-700 text-white rounded-xl transition-colors"
                        title="Copy link"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {generatedLink && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1.5">New Generated Link</p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2.5 bg-blue-50 border border-blue-100 rounded-xl overflow-hidden">
                        <p className="text-xs font-mono text-blue-800 break-all">{generatedLink}</p>
                      </div>
                      <button
                        onClick={() => handleCopyLink(generatedLink)}
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        title="Copy link"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {!experience.link && !generatedLink && (
                  <p className="text-xs text-gray-400 italic mb-3">No meeting link yet.</p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={handleGenerateLink}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Generate New Link
                  </button>
                  {generatedLink && (
                    <button
                      onClick={handleSaveLink}
                      disabled={isSavingLink}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-full text-xs font-semibold transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSavingLink ? "Saving…" : "Save Link"}
                    </button>
                  )}
                  {experience.link && (
                    <button
                      onClick={handleDeleteLink}
                      disabled={isSavingLink}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 rounded-full text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Link
                    </button>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Metadata</h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-0.5">Experience ID</p>
                    <p className="text-sm font-bold text-gray-900">#{experience.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-0.5">Team ID</p>
                    <p className="text-sm font-bold text-gray-900">#{experience.fire_team_id || fireteamId}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {experience.created_at && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Created</span>
                      <span className="font-semibold text-gray-700">
                        {new Date(experience.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  )}
                  {experience.updated_at && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Updated</span>
                      <span className="font-semibold text-gray-700">
                        {new Date(experience.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Edit Modal (existing complex component) ── */}
      <EditExperienceModal
        open={showEditModal}
        onClose={() => { setShowEditModal(false); clearValidationErrors(); }}
        editExperienceData={editExperienceData}
        setEditExperienceData={setEditExperienceData}
        validationErrors={validationErrors}
        clearValidationErrors={clearValidationErrors}
        handleAddAgendaStep={handleAddAgendaStep}
        handleAddExhibit={handleAddExhibit}
        handleSave={async () => {
          if (!experience) return;
          if (!validateExperienceData()) { showToast("Please fix validation errors before saving", "error"); return; }
          try {
            const agendaData = editExperienceData.agenda
              .filter((step) => step.title?.trim())
              .map((step) => ({ id: step.id, title: step.title, duration: step.duration || "5 minutes" }));
            const exhibitsData = editExperienceData.exhibits
              .filter((ex) => ex.name?.trim())
              .map((ex) => ({ id: ex.id, name: ex.name, type: ex.type || "link", link: ex.type === "link" ? ex.link : undefined }));
            await experienceService.updateExperience(experience.id, {
              title: editExperienceData.title,
              experience: editExperienceData.experience,
              link: editExperienceData.link || experience.link,
              status: experience.status,
              report: experience.report,
              summary: experience.summary,
              admin: editExperienceData.videoAdminId ? parseInt(editExperienceData.videoAdminId) : undefined,
              agenda: agendaData,
              exhibits: exhibitsData,
            });
            const currentExhibitIds = experience.exhibits?.map((ex) => ex.id).filter(Boolean) || [];
            const updatedExhibitIds = exhibitsData.map((ex) => ex.id).filter(Boolean);
            for (const exhibitId of currentExhibitIds) {
              if (!updatedExhibitIds.includes(exhibitId)) {
                try { await experienceService.deleteExhibit(exhibitId); } catch {}
              }
            }
            const currentAgendaIds = experience.agenda?.map((step) => step.id).filter(Boolean) || [];
            const updatedAgendaIds = agendaData.map((step) => step.id).filter(Boolean);
            for (const stepId of currentAgendaIds) {
              if (!updatedAgendaIds.includes(stepId)) {
                try { await experienceService.deleteAgendaStep(stepId); } catch {}
              }
            }
            setShowEditModal(false);
            clearValidationErrors();
            showToast("Experience updated successfully!");
            fetchExperienceDetails();
          } catch (err) {
            showToast("Failed to update experience: " + (err.message || "Unknown error"), "error");
          }
        }}
        setError={(msg) => showToast(msg, "error")}
        members={members}
        selectedExperienceToEdit={experience}
        generateFireteamMeetingLink={generateFireteamMeetingLink}
        id={fireteamId}
        fireteam={fireteam}
        experienceService={experienceService}
      />

      {/* ── Add Agenda Step Modal ── */}
      <Modal
        open={showAddAgendaDialog}
        onClose={() => { setShowAddAgendaDialog(false); setNewAgendaStep({ title: "", duration: "" }); }}
        title="Add Agenda Step"
        footer={
          <>
            <button
              onClick={() => { setShowAddAgendaDialog(false); setNewAgendaStep({ title: "", duration: "" }); }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAgendaStep}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Add Step
            </button>
          </>
        }
      >
        <Field label="Step Title" required>
          <input
            type="text"
            value={newAgendaStep.title}
            onChange={(e) => setNewAgendaStep((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Introduction & Icebreaker"
            className={inputCls}
          />
        </Field>
        <Field label="Duration" hint="Optional — specify the estimated duration">
          <input
            type="text"
            value={newAgendaStep.duration}
            onChange={(e) => setNewAgendaStep((prev) => ({ ...prev, duration: e.target.value }))}
            placeholder="e.g., 10 minutes"
            className={inputCls}
          />
        </Field>
      </Modal>

      {/* ── Add Exhibit Modal ── */}
      <Modal
        open={showAddExhibitDialog}
        onClose={() => { setShowAddExhibitDialog(false); setNewExhibit({ name: "", type: "link", link: "" }); }}
        title="Add Exhibit"
        footer={
          <>
            <button
              onClick={() => { setShowAddExhibitDialog(false); setNewExhibit({ name: "", type: "link", link: "" }); }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitExhibit}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Add Exhibit
            </button>
          </>
        }
      >
        <Field label="Exhibit Name" required>
          <input
            type="text"
            value={newExhibit.name}
            onChange={(e) => setNewExhibit((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Leadership Framework"
            className={inputCls}
          />
        </Field>
        <Field label="Type" required>
          <select
            value={newExhibit.type}
            onChange={(e) => setNewExhibit((prev) => ({ ...prev, type: e.target.value }))}
            className={inputCls}
          >
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </Field>
        {newExhibit.type === "link" && (
          <Field label="Link URL" required hint="Enter the full URL including https://">
            <input
              type="text"
              value={newExhibit.link}
              onChange={(e) => setNewExhibit((prev) => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com"
              className={inputCls}
            />
          </Field>
        )}
      </Modal>

      {/* ── Add Objective Modal ── */}
      <Modal
        open={showAddObjectiveDialog}
        onClose={() => { setShowAddObjectiveDialog(false); setNewObjective({ objective: "" }); }}
        title="Add Learning Objective"
        footer={
          <>
            <button
              onClick={() => { setShowAddObjectiveDialog(false); setNewObjective({ objective: "" }); }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddObjective}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Add Objective
            </button>
          </>
        }
      >
        <Field label="Objective" required hint="Describe what participants should learn or achieve">
          <textarea
            rows={3}
            value={newObjective.objective}
            onChange={(e) => setNewObjective({ objective: e.target.value })}
            placeholder="e.g., Understand the key principles of effective leadership"
            className={inputCls}
          />
        </Field>
      </Modal>

      {/* ── Toast notifications ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
