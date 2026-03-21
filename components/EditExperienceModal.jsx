"use client";

import React, { useCallback, useRef, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import {
  Trash2,
  Plus,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
  Clock,
  Link as LinkIcon,
  Image,
  FileText,
  Film,
  Paperclip,
  User,
  Copy,
  Check,
  Video,
  List,
  BookOpen,
  Settings,
} from "lucide-react";

/* ─────────────────────────────────────────
   Constants & Utilities
───────────────────────────────────────── */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const DEBOUNCE_DELAY = 600;

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Generate a LiveKit-compatible room name for an experience */
function generateLivekitRoomName(fireteamId, experienceId) {
  const uid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : Date.now().toString(36);
  return `wanac-ft${fireteamId}-exp${experienceId}-${uid}`;
}

function useDebounce(callback, delay) {
  const timerRef = useRef(null);
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return useCallback((...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => cbRef.current(...args), delay);
  }, [delay]);
}

/* ─────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────── */

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow";

function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
      {!error && hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function Avatar({ name, size = "sm" }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  const colors = ["bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700", "bg-green-100 text-green-700", "bg-purple-100 text-purple-700", "bg-rose-100 text-rose-700"];
  const color = colors[(name || "").charCodeAt(0) % colors.length];
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function getExhibitIcon(type) {
  switch (type) {
    case "image": return <Image className="w-4 h-4" />;
    case "video": return <Film className="w-4 h-4" />;
    case "document": return <FileText className="w-4 h-4" />;
    case "link": return <LinkIcon className="w-4 h-4" />;
    default: return <Paperclip className="w-4 h-4" />;
  }
}

/* ─────────────────────────────────────────
   AgendaStepItem
───────────────────────────────────────── */

const AgendaStepItem = memo(function AgendaStepItem({ step, idx, onUpdate, onDelete, onSubmit, experienceService, setError }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPersisted = !!step.id;

  const debouncedSave = useDebounce(async (field, value) => {
    if (!step.id) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await experienceService.updateAgendaStep(step.id, { [field]: value });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError("Failed to update step: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }, DEBOUNCE_DELAY);

  return (
    <div className={`group flex items-center gap-3 p-3 rounded-xl border transition-colors ${isPersisted ? "bg-white border-gray-100" : "bg-amber-50 border-amber-200"}`}>
      {/* step number */}
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
        {idx + 1}
      </span>

      {/* fields */}
      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Step title"
            value={step.title || ""}
            onChange={(e) => { onUpdate(idx, "title", e.target.value); debouncedSave("title", e.target.value); }}
            className={`${inputCls} pr-7`}
          />
          {isSaving && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-blue-400" />}
          {saveSuccess && <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-500" />}
        </div>
        <div className="relative flex items-center">
          <Clock className="absolute left-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Duration (e.g. 10 min)"
            value={step.duration || ""}
            onChange={(e) => { onUpdate(idx, "duration", e.target.value); debouncedSave("duration", e.target.value); }}
            className={`${inputCls} pl-8`}
          />
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!isPersisted && (
          <button
            onClick={async () => { setIsSubmitting(true); try { await onSubmit(idx); } finally { setIsSubmitting(false); } }}
            disabled={isSubmitting || !step.title?.trim()}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        )}
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

AgendaStepItem.propTypes = {
  step: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  experienceService: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
};

/* ─────────────────────────────────────────
   ExhibitItem
───────────────────────────────────────── */

const ExhibitItem = memo(function ExhibitItem({ exhibit, idx, onUpdate, onDelete, onSubmit, experienceService, setError }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPersisted = !!exhibit.id;

  const debouncedSave = useDebounce(async (field, value) => {
    if (!exhibit.id) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await experienceService.updateExhibit(exhibit.id, { [field]: value });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError("Failed to update exhibit: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }, DEBOUNCE_DELAY);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { setError(`File must be under ${MAX_FILE_SIZE / 1024 / 1024}MB`); e.target.value = ""; return; }
    onUpdate(idx, "file", file);
  };

  const handleLinkChange = (e) => {
    const v = e.target.value;
    setLinkError(v && !isValidUrl(v) ? "Please enter a valid URL (https://…)" : "");
    onUpdate(idx, "link", v);
    debouncedSave("link", v);
  };

  return (
    <div className={`p-4 rounded-xl border transition-colors ${isPersisted ? "bg-white border-gray-100" : "bg-amber-50 border-amber-200"}`}>
      {/* header row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg ${isPersisted ? "bg-gray-50 text-gray-500" : "bg-amber-100 text-amber-600"}`}>
            {getExhibitIcon(exhibit.type)}
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Exhibit name"
              value={exhibit.name || ""}
              onChange={(e) => { onUpdate(idx, "name", e.target.value); debouncedSave("name", e.target.value); }}
              className={`${inputCls} pr-7`}
            />
            {isSaving && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-blue-400" />}
            {saveSuccess && <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-500" />}
          </div>
        </div>

        {/* type selector */}
        <select
          value={exhibit.type || "link"}
          onChange={(e) => {
            const t = e.target.value;
            onUpdate(idx, "type", t, true);
            if (exhibit.id) experienceService.updateExhibit(exhibit.id, { type: t }).catch((err) => setError(err.message));
          }}
          className="px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="link">Link</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>

        {/* actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isPersisted && (
            <button
              onClick={async () => { setIsSubmitting(true); try { await onSubmit(idx); } finally { setIsSubmitting(false); } }}
              disabled={isSubmitting || !exhibit.name?.trim()}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save
            </button>
          )}
          <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* link / file field */}
      {exhibit.type === "link" ? (
        <div>
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
            <input
              type="url"
              placeholder="https://example.com"
              value={exhibit.link || ""}
              onChange={handleLinkChange}
              className={`${inputCls} pl-8 ${linkError ? "border-red-400" : ""}`}
            />
          </div>
          {linkError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{linkError}</p>}
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 w-full h-9 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-sm text-gray-500">
          <Upload className="w-3.5 h-3.5" />
          {exhibit.file ? exhibit.file.name : `Upload ${exhibit.type}`}
          <input
            type="file"
            hidden
            accept={exhibit.type === "image" ? "image/*" : exhibit.type === "video" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"}
            onChange={handleFileChange}
          />
        </label>
      )}
      {!isPersisted && (
        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Unsaved — click Save to persist
        </p>
      )}
    </div>
  );
});

ExhibitItem.propTypes = {
  exhibit: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  experienceService: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
};

/* ─────────────────────────────────────────
   EmptyState
───────────────────────────────────────── */

function EmptyState({ icon: Icon, description, onAdd, buttonText }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
      {Icon && <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 text-gray-400"><Icon className="w-5 h-5" /></div>}
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <button onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors">
        <Plus className="w-3.5 h-3.5" />{buttonText}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB: Details
───────────────────────────────────────── */

function DetailsTab({ data, setData, validationErrors, clearValidationErrors }) {
  return (
    <div className="space-y-5">
      <Field label="Experience Title" required error={validationErrors.title}>
        <input
          type="text"
          value={data.title}
          onChange={(e) => { setData((p) => ({ ...p, title: e.target.value })); clearValidationErrors(); }}
          placeholder="e.g., Customer Discovery Workshop"
          className={`${inputCls} ${validationErrors.title ? "border-red-400" : ""}`}
        />
      </Field>

      <Field label="Experience Description" required error={validationErrors.experience} hint="Describe what participants will learn and do during this experience">
        <textarea
          rows={6}
          value={data.experience}
          onChange={(e) => { setData((p) => ({ ...p, experience: e.target.value })); clearValidationErrors(); }}
          placeholder="Describe the experience content, learning activities, and expected outcomes…"
          className={`${inputCls} resize-none ${validationErrors.experience ? "border-red-400" : ""}`}
        />
      </Field>
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB: Agenda
───────────────────────────────────────── */

function AgendaTab({ data, setData, handleAddAgendaStep, handleSubmitAgendaStep, experienceService, setError, selectedExperienceToEdit }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdate = useCallback((idx, field, value) => {
    setData((p) => ({ ...p, agenda: p.agenda.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
  }, [setData]);

  const handleDelete = useCallback(async (idx, step) => {
    if (step.id) {
      try { await experienceService.deleteAgendaStep(step.id); }
      catch (err) { setError("Failed to delete step: " + (err.response?.data?.message || err.message)); return; }
    }
    setData((p) => ({ ...p, agenda: p.agenda.filter((_, i) => i !== idx) }));
  }, [setData, experienceService, setError]);

  const totalDuration = data.agenda.reduce((acc, s) => {
    const match = (s.duration || "").match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">
            {data.agenda.length} step{data.agenda.length !== 1 ? "s" : ""}
            {totalDuration > 0 && ` · ${totalDuration} min total`}
          </p>
          {data.agenda.filter((s) => !s.id).length > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              {data.agenda.filter((s) => !s.id).length} unsaved
            </span>
          )}
        </div>
        <button
          onClick={async () => {
            if (!selectedExperienceToEdit) return;
            setIsAdding(true);
            try { await handleAddAgendaStep(); }
            catch (err) { setError("Failed to add step: " + err.message); }
            finally { setIsAdding(false); }
          }}
          disabled={isAdding}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white rounded-full text-xs font-semibold transition-colors"
        >
          {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add Step
        </button>
      </div>

      {data.agenda.length > 0 ? (
        <div className="space-y-2">
          {data.agenda.map((step, idx) => (
            <AgendaStepItem
              key={step.id || step._tempId || idx}
              step={step}
              idx={idx}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(idx, step)}
              onSubmit={handleSubmitAgendaStep}
              experienceService={experienceService}
              setError={setError}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={List}
          description="No agenda steps yet. Build your session flow."
          onAdd={async () => {
            if (!selectedExperienceToEdit) return;
            setIsAdding(true);
            try { await handleAddAgendaStep(); }
            catch (err) { setError("Failed to add step: " + err.message); }
            finally { setIsAdding(false); }
          }}
          buttonText="Add First Step"
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB: Exhibits
───────────────────────────────────────── */

function ExhibitsTab({ data, setData, handleAddExhibit, handleSubmitExhibit, experienceService, setError }) {
  const handleUpdate = useCallback((idx, field, value, resetFields = false) => {
    setData((p) => ({
      ...p,
      exhibits: p.exhibits.map((ex, i) => {
        if (i !== idx) return ex;
        if (resetFields && field === "type") return { ...ex, type: value, file: null, link: value === "link" ? ex.link : "" };
        return { ...ex, [field]: value };
      }),
    }));
  }, [setData]);

  const handleDelete = useCallback(async (idx, exhibit) => {
    if (exhibit.id) {
      try { await experienceService.deleteExhibit(exhibit.id); }
      catch (err) { setError("Failed to delete exhibit: " + err.message); return; }
    }
    setData((p) => ({ ...p, exhibits: p.exhibits.filter((_, i) => i !== idx) }));
  }, [setData, experienceService, setError]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">
          {data.exhibits.length} exhibit{data.exhibits.length !== 1 ? "s" : ""}
          {data.exhibits.filter((e) => !e.id).length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              {data.exhibits.filter((e) => !e.id).length} unsaved
            </span>
          )}
        </p>
        <button
          onClick={handleAddExhibit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Exhibit
        </button>
      </div>

      {data.exhibits.length > 0 ? (
        <div className="space-y-3">
          {data.exhibits.map((exhibit, idx) => (
            <ExhibitItem
              key={exhibit.id || exhibit._tempId || idx}
              exhibit={exhibit}
              idx={idx}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(idx, exhibit)}
              onSubmit={handleSubmitExhibit}
              experienceService={experienceService}
              setError={setError}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          description="No exhibits yet. Add links, documents, or images."
          onAdd={handleAddExhibit}
          buttonText="Add First Exhibit"
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB: Settings (Facilitator + Room)
───────────────────────────────────────── */

function SettingsTab({ data, setData, members, selectedExperienceToEdit, id: fireteamId }) {
  const [copied, setCopied] = useState(false);

  const selectedMember = members.find((m) => {
    const uid = String(m.client?.user?.id || m.user_id || m.id);
    return uid === String(data.videoAdminId);
  });
  const selectedName = selectedMember
    ? (selectedMember.client?.user?.name || selectedMember.user?.name || selectedMember.name || "Member")
    : null;

  const handleCopyRoom = async () => {
    try {
      await navigator.clipboard.writeText(data.link || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleGenerateRoom = () => {
    const expId = selectedExperienceToEdit?.id || "new";
    const roomName = generateLivekitRoomName(fireteamId, expId);
    setData((p) => ({ ...p, link: roomName }));
  };

  return (
    <div className="space-y-6">
      {/* Meeting Facilitator */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Meeting Facilitator
        </p>

        {selectedName && (
          <div className="flex items-center gap-2.5 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <Avatar name={selectedName} size="sm" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{selectedName}</p>
              <p className="text-xs text-gray-400">Current facilitator</p>
            </div>
          </div>
        )}

        <select
          value={data.videoAdminId || ""}
          onChange={(e) => setData((p) => ({ ...p, videoAdminId: e.target.value }))}
          className={inputCls}
        >
          <option value="">— No facilitator —</option>
          {members.map((m) => {
            const uid = String(m.client?.user?.id || m.user_id || m.id);
            const name = m.client?.user?.name || m.user?.name || m.name || `User #${uid}`;
            return <option key={m.id} value={uid}>{name}</option>;
          })}
        </select>
        <p className="text-xs text-gray-400 mt-1.5">The facilitator controls the meeting flow and has host permissions.</p>
      </div>

      {/* LiveKit Room Name */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5" /> LiveKit Room Name
        </p>

        <div className="flex gap-2 mb-2">
          <div className="flex-1 flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs text-gray-700 overflow-hidden">
            <span className="truncate">{data.link || <span className="text-gray-400 italic">No room assigned</span>}</span>
          </div>
          <button
            onClick={handleCopyRoom}
            disabled={!data.link}
            title="Copy room name"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleGenerateRoom}
            title="Generate new room name"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 space-y-1">
          <p className="font-semibold">How LiveKit rooms work</p>
          <p>The room name is used to connect participants. Anyone who joins with the same room name joins the same session. Click <span className="font-semibold">↻</span> to generate a fresh room name.</p>
          {data.link && (
            <p className="mt-1 font-mono bg-white/60 px-2 py-1 rounded-lg text-blue-800 break-all">Token endpoint: /api/livekit/token?roomName={data.link}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main: EditExperienceModal
───────────────────────────────────────── */

const TABS = [
  { id: "details", label: "Details", icon: BookOpen },
  { id: "agenda", label: "Agenda", icon: List },
  { id: "exhibits", label: "Exhibits", icon: Paperclip },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function EditExperienceModal({
  open,
  onClose,
  editExperienceData,
  setEditExperienceData,
  validationErrors,
  clearValidationErrors,
  handleAddAgendaStep,
  handleSubmitAgendaStep,
  handleAddExhibit,
  handleSubmitExhibit,
  handleSave,
  setError,
  error,
  members,
  selectedExperienceToEdit,
  id,
  fireteam,
  experienceService,
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);

  /* Keyboard shortcuts */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, handleSave]);

  /* Badge counts for tab labels */
  const unsavedAgenda = editExperienceData.agenda?.filter((s) => !s.id).length || 0;
  const unsavedExhibits = editExperienceData.exhibits?.filter((e) => !e.id).length || 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-black text-gray-900">Edit Experience</h2>
            {selectedExperienceToEdit && (
              <p className="text-xs text-gray-400 mt-0.5">{selectedExperienceToEdit.title}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-full uppercase tracking-wide">
              Ctrl+S to save
            </span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-0.5 px-6 pt-3 pb-0 border-b border-gray-100 flex-shrink-0 bg-white">
          {TABS.map(({ id: tabId, label, icon: Icon }) => {
            const badge = tabId === "agenda" ? unsavedAgenda : tabId === "exhibits" ? unsavedExhibits : 0;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors ${
                  activeTab === tabId
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded-full leading-none">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Error bar ── */}
        {error && (
          <div className="mx-6 mt-3 flex-shrink-0 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ── Tab content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "details" && (
            <DetailsTab
              data={editExperienceData}
              setData={setEditExperienceData}
              validationErrors={validationErrors}
              clearValidationErrors={clearValidationErrors}
            />
          )}
          {activeTab === "agenda" && (
            <AgendaTab
              data={editExperienceData}
              setData={setEditExperienceData}
              handleAddAgendaStep={handleAddAgendaStep}
              handleSubmitAgendaStep={handleSubmitAgendaStep}
              experienceService={experienceService}
              setError={setError}
              selectedExperienceToEdit={selectedExperienceToEdit}
            />
          )}
          {activeTab === "exhibits" && (
            <ExhibitsTab
              data={editExperienceData}
              setData={setEditExperienceData}
              handleAddExhibit={handleAddExhibit}
              handleSubmitExhibit={handleSubmitExhibit}
              experienceService={experienceService}
              setError={setError}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              data={editExperienceData}
              setData={setEditExperienceData}
              members={members}
              selectedExperienceToEdit={selectedExperienceToEdit}
              id={id}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <div className="text-xs text-gray-400">
            {(unsavedAgenda + unsavedExhibits) > 0 ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {unsavedAgenda + unsavedExhibits} unsaved item{(unsavedAgenda + unsavedExhibits) !== 1 ? "s" : ""} — save individually or click Save Changes
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All items saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button
              onClick={async () => { setIsSaving(true); try { await handleSave(); } finally { setIsSaving(false); } }}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white rounded-full text-sm font-semibold transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditExperienceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editExperienceData: PropTypes.shape({
    title: PropTypes.string,
    experience: PropTypes.string,
    agenda: PropTypes.arrayOf(PropTypes.object),
    exhibits: PropTypes.arrayOf(PropTypes.object),
    videoAdminId: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  setEditExperienceData: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  clearValidationErrors: PropTypes.func.isRequired,
  handleAddAgendaStep: PropTypes.func.isRequired,
  handleSubmitAgendaStep: PropTypes.func.isRequired,
  handleAddExhibit: PropTypes.func.isRequired,
  handleSubmitExhibit: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  error: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedExperienceToEdit: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fireteam: PropTypes.object,
  experienceService: PropTypes.object.isRequired,
};
