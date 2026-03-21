"use client";
import React, { useState, useCallback, useEffect } from "react";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import SectionSidebar from '../../../../components/dashboardcomponents/SectionSidebar';
import CareerCompassModal from '../../../../components/dashboardcomponents/CareerCompassModal';
import {
  ClipboardList, HelpCircle, Building2, Users, CheckCircle,
  Calendar, FileText, TrendingUp, Target, Zap, ChevronRight,
  BarChart2, Award, BookOpen, Search
} from 'lucide-react';
import {
  FaBriefcase, FaBuilding, FaUserTie, FaChartLine, FaCheckCircle,
  FaClock, FaTimes, FaPlus, FaUserPlus, FaCalendarPlus,
  FaPaperPlane, FaCalendarCheck, FaStream, FaFileAlt
} from 'react-icons/fa';
import ActivityStreamPage from './activitystream/page';
import ApplicationManagementPage from './applicationmanagement/page';
import EmployersPage from './employers/page';
import InterviewQuestionsPage from './interviewquestions/page';
import TargetEmployersPage from './targetemployers/page';
import AppliedPage from './applied/page';
import ResearchToolsPage from './researchtools/page';
import AFIAndJobPostingPage from './afiandjobposting/page';

const careerSections = [
  { name: 'Overview', sectionId: 'overview' },
  { name: 'Activity Stream', sectionId: 'activitystream' },
  { name: 'Application Management', sectionId: 'applicationmanagement' },
  { name: 'Employers', sectionId: 'employers' },
  { name: 'Application Materials', sectionId: 'applicationmaterials' },
  { name: 'Interview Questions', sectionId: 'interviewquestions' },
  { name: 'Target Employers', sectionId: 'targetemployers' },
  { name: 'Contacts', sectionId: 'contacts' },
  { name: 'Applied', sectionId: 'applied' },
  { name: 'Appointments', sectionId: 'appointments' },
  { name: 'Research Tools', sectionId: 'researchtools' },
  { name: 'AFI and Job Postings', sectionId: 'afiandjobposting' },
];

/* ── Radial Score Ring ───────────────────────────────────────── */
function ScoreRing({ score, size = 96 }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const progress = circ * (1 - score / 100);
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className="rotate-[-90deg]">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke="url(#scoreGrad)" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={progress}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Progress Bar ────────────────────────────────────────────── */
function ProgressBar({ value, max, color = "bg-blue-500" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, transition: 'width 0.8s ease' }} />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{value}</span>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────────── */
function CareerCompassOverview({ onNavigate }) {
  const careerData = {
    applications: { total: 12, thisMonth: 5, pending: 8, rejected: 3, accepted: 1, interview: 2 },
    interviews: { scheduled: 3, completed: 2, upcoming: 1 },
    targetEmployers: 8,
    contacts: 15,
    applicationMaterials: { resume: true, coverLetter: true, portfolio: false, references: true },
    recentActivity: [
      { icon: FaPaperPlane, title: "Applied to Tech Corp", sub: "Software Engineer", time: "2h ago", color: "bg-blue-100 text-blue-600" },
      { icon: FaCalendarCheck, title: "Interview scheduled", sub: "StartupXYZ — 2nd round", time: "1d ago", color: "bg-orange-100 text-orange-600" },
      { icon: FaUserPlus, title: "Contact added", sub: "Jane Doe — Google", time: "2d ago", color: "bg-green-100 text-green-600" },
      { icon: FaFileAlt, title: "Resume updated", sub: "Version 2.1", time: "5d ago", color: "bg-gray-100 text-gray-600" },
    ],
  };

  const materialsCompleted = Object.values(careerData.applicationMaterials).filter(Boolean).length;
  const materialsTotal = Object.keys(careerData.applicationMaterials).length;
  const readinessScore = Math.round(
    ((careerData.applications.total / 20) * 25 +
      (careerData.interviews.scheduled / 5) * 25 +
      (materialsCompleted / materialsTotal) * 25 +
      (careerData.contacts / 30) * 25)
  );
  const clampedScore = Math.min(readinessScore, 100);

  const stats = [
    { label: "Applications", value: careerData.applications.total, sub: `+${careerData.applications.thisMonth} this month`, color: "text-[#002147]", bg: "bg-[#002147]/5 border-[#002147]/10" },
    { label: "Interviews", value: careerData.interviews.scheduled, sub: `${careerData.interviews.completed} completed`, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    { label: "Target Companies", value: careerData.targetEmployers, sub: "being tracked", color: "text-green-600", bg: "bg-green-50 border-green-200" },
    { label: "Network Contacts", value: careerData.contacts, sub: "connections", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  ];

  const quickActions = [
    {
      id: 'applicationmanagement', label: "Application Management",
      desc: "Track and manage all your job applications",
      icon: ClipboardList, iconBg: "bg-[#002147]/10", iconColor: "text-[#002147]",
      linkColor: "text-[#002147]", count: careerData.applications.total, countLabel: "applications",
    },
    {
      id: 'targetemployers', label: "Target Employers",
      desc: "Research and track companies you want to work for",
      icon: Target, iconBg: "bg-orange-100", iconColor: "text-orange-600",
      linkColor: "text-orange-600", count: careerData.targetEmployers, countLabel: "targets",
    },
    {
      id: 'contacts', label: "Network Contacts",
      desc: "Build and manage your professional network",
      icon: Users, iconBg: "bg-green-100", iconColor: "text-green-600",
      linkColor: "text-green-600", count: careerData.contacts, countLabel: "contacts",
    },
    {
      id: 'applicationmaterials', label: "Application Materials",
      desc: "Organize your resume, cover letters, and portfolios",
      icon: FileText, iconBg: "bg-blue-100", iconColor: "text-blue-600",
      linkColor: "text-blue-600", count: `${materialsCompleted}/${materialsTotal}`, countLabel: "complete",
    },
    {
      id: 'interviewquestions', label: "Interview Questions",
      desc: "Practice and prepare for common interview questions",
      icon: HelpCircle, iconBg: "bg-purple-100", iconColor: "text-purple-600",
      linkColor: "text-purple-600", count: null, countLabel: null,
    },
    {
      id: 'afiandjobposting', label: "AFI & Job Postings",
      desc: "Browse opportunities from partner employers",
      icon: Search, iconBg: "bg-amber-100", iconColor: "text-amber-600",
      linkColor: "text-amber-600", count: 3, countLabel: "open roles",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Readiness + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Career Readiness Score */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Award className="text-[#002147]" size={18} />
            <h3 className="font-semibold text-gray-800 text-sm">Career Readiness Score</h3>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <ScoreRing score={clampedScore} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{clampedScore}</span>
                <span className="text-[10px] text-gray-500">/ 100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Applications</span>
                  <span className="font-medium">{careerData.applications.total}/20</span>
                </div>
                <ProgressBar value={careerData.applications.total} max={20} color="bg-[#002147]" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Materials</span>
                  <span className="font-medium">{materialsCompleted}/{materialsTotal}</span>
                </div>
                <ProgressBar value={materialsCompleted} max={materialsTotal} color="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Interviews</span>
                  <span className="font-medium">{careerData.interviews.scheduled}/5</span>
                </div>
                <ProgressBar value={careerData.interviews.scheduled} max={5} color="bg-orange-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Network</span>
                  <span className="font-medium">{careerData.contacts}/30</span>
                </div>
                <ProgressBar value={careerData.contacts} max={30} color="bg-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Application Funnel */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-[#002147]" size={18} />
            <h3 className="font-semibold text-gray-800 text-sm">Application Pipeline</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Applied", value: careerData.applications.total, max: careerData.applications.total, color: "bg-[#002147]", pill: "bg-[#002147]/10 text-[#002147]" },
              { label: "In Review / Pending", value: careerData.applications.pending, max: careerData.applications.total, color: "bg-blue-400", pill: "bg-blue-100 text-blue-700" },
              { label: "Interview Stage", value: careerData.applications.interview, max: careerData.applications.total, color: "bg-orange-400", pill: "bg-orange-100 text-orange-700" },
              { label: "Offers Received", value: careerData.applications.accepted, max: careerData.applications.total, color: "bg-green-500", pill: "bg-green-100 text-green-700" },
              { label: "Rejected / Closed", value: careerData.applications.rejected, max: careerData.applications.total, color: "bg-red-400", pill: "bg-red-100 text-red-700" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-36 text-xs text-gray-600 shrink-0">{row.label}</div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: row.max > 0 ? `${(row.value / row.max) * 100}%` : '0%', transition: 'width 0.8s ease' }}
                  />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.pill} w-8 text-center`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Materials checklist */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Application Materials</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(careerData.applicationMaterials).map(([mat, done]) => (
                <div key={mat} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${done ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {done && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <span className={`capitalize font-medium ${done ? 'text-green-700' : 'text-gray-500'}`}>
                    {mat.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onNavigate(action.id)}
              className="text-left bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${action.iconBg} rounded-xl flex items-center justify-center`}>
                  <action.icon className={`w-4 h-4 ${action.iconColor}`} />
                </div>
                {action.count !== null && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600`}>
                    {action.count} {action.countLabel}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{action.label}</h3>
              <p className="text-xs text-gray-500 mb-3">{action.desc}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${action.linkColor} group-hover:gap-2 transition-all`}>
                Open <ChevronRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaStream className="text-[#002147]" />
            <h3 className="font-semibold text-gray-800 text-sm">Recent Activity</h3>
          </div>
          <button onClick={() => onNavigate('activitystream')} className="text-xs text-[#002147] font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-0">
          {careerData.recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                <item.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Contacts ─────────────────────────────────────────────────── */
const INITIAL_CONTACT_FORM = { name: "", company: "", email: "", phone: "", notes: "" };

function ContactsSection() {
  const [contacts, setContacts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_CONTACT_FORM);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = contacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = useCallback(() => { setForm(INITIAL_CONTACT_FORM); setFormError(""); setDialogOpen(true); }, []);
  const handleClose = useCallback(() => { setDialogOpen(false); setFormError(""); }, []);
  const handleChange = useCallback((e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }, []);

  const handleSubmit = useCallback(() => {
    if (!form.name?.trim()) { setFormError("Name is required."); return; }
    setContacts((prev) => [...prev, {
      id: Date.now(), name: form.name.trim(), company: form.company?.trim() || "—",
      email: form.email?.trim() || "—", phone: form.phone?.trim() || "—", notes: form.notes?.trim() || "",
    }]);
    handleClose();
  }, [form, handleClose]);

  const handleDelete = useCallback((id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <Users className="text-[#002147]" size={18} /> Contacts
          </h2>
          <button onClick={handleOpen} className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm">
            <FaPlus size={10} /> Add Contact
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Manage your professional network and connections.</p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none" />
          </div>
          <span className="text-xs text-gray-500">{filtered.length} contacts</span>
        </div>

        {filtered.length > 0 ? (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div>Name</div><div>Company</div><div>Email</div><div>Actions</div>
            </div>
            {filtered.map((c) => (
              <div key={c.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900 text-sm">{c.name}</div>
                <div className="text-sm text-gray-600">{c.company}</div>
                <div className="text-sm text-gray-600 truncate">{c.email}</div>
                <div>
                  <button onClick={() => setDeleteId(c.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <Users className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-medium text-gray-500">No contacts yet</p>
            <p className="text-xs text-gray-400 mt-1">Add your professional connections to build your network</p>
            <button onClick={handleOpen} className="mt-4 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
              Add First Contact
            </button>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Remove contact?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      <CareerCompassModal open={dialogOpen} onClose={handleClose} title="Add Contact" icon={<FaUserPlus size={14} />} onSubmit={handleSubmit} submitLabel="Add Contact">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full name"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional" rows={2}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none resize-none" />
        </div>
        {formError && <p className="text-red-600 text-xs">⚠ {formError}</p>}
      </CareerCompassModal>
    </div>
  );
}

/* ── Appointments ─────────────────────────────────────────────── */
const APPOINTMENT_TYPES = ["Interview", "Call", "Meeting", "Other"];
const INITIAL_APPT_FORM = { title: "", date: "", time: "09:00", type: "Meeting", notes: "" };
const TYPE_COLORS = {
  Interview: "bg-orange-100 text-orange-700",
  Call: "bg-blue-100 text-blue-700",
  Meeting: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-700",
};

function AppointmentsSection() {
  const [appointments, setAppointments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ ...INITIAL_APPT_FORM, date: new Date().toISOString().slice(0, 10) });
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const upcoming = appointments.filter((a) => new Date(a.rawDate) >= new Date()).length;

  const handleOpen = useCallback(() => {
    setForm({ ...INITIAL_APPT_FORM, date: new Date().toISOString().slice(0, 10) });
    setFormError(""); setDialogOpen(true);
  }, []);
  const handleClose = useCallback(() => { setDialogOpen(false); setFormError(""); }, []);
  const handleChange = useCallback((e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }, []);

  const handleSubmit = useCallback(() => {
    if (!form.title?.trim()) { setFormError("Title is required."); return; }
    const displayDate = form.date ? new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
    setAppointments((prev) => [...prev, {
      id: Date.now(), title: form.title.trim(), rawDate: form.date,
      date: displayDate, time: form.time || "—", type: form.type, notes: form.notes?.trim() || "",
    }]);
    handleClose();
  }, [form, handleClose]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <Calendar className="text-[#002147]" size={18} /> Appointments
          </h2>
          <button onClick={handleOpen} className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm">
            <FaPlus size={10} /> Schedule
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Schedule and track career-related appointments.</p>

        {upcoming > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-semibold text-orange-700">{upcoming} upcoming appointment{upcoming > 1 ? 's' : ''}</span>
          </div>
        )}

        {appointments.length > 0 ? (
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="shrink-0 w-10 text-center">
                  <div className="text-xs font-bold text-gray-700">{a.date?.split(" ")[1]?.replace(",", "")}</div>
                  <div className="text-[10px] text-gray-400 uppercase">{a.date?.split(" ")[0]}</div>
                </div>
                <div className="w-px h-8 bg-gray-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.time}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${TYPE_COLORS[a.type] || TYPE_COLORS.Other}`}>{a.type}</span>
                <button onClick={() => setDeleteId(a.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <Calendar className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-medium text-gray-500">No appointments scheduled</p>
            <p className="text-xs text-gray-400 mt-1">Track interviews, calls, and meetings here</p>
            <button onClick={handleOpen} className="mt-4 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
              Schedule First Appointment
            </button>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">Remove appointment?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { setAppointments((p) => p.filter((a) => a.id !== deleteId)); setDeleteId(null); }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      <CareerCompassModal open={dialogOpen} onClose={handleClose} title="Schedule Appointment" icon={<FaCalendarPlus size={14} />} onSubmit={handleSubmit} submitLabel="Schedule">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Interview with Tech Corp"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
            {APPOINTMENT_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional" rows={2}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none resize-none" />
        </div>
        {formError && <p className="text-red-600 text-xs">⚠ {formError}</p>}
      </CareerCompassModal>
    </div>
  );
}

/* ── Section Router ──────────────────────────────────────────── */
function SectionContent({ sectionId }) {
  switch (sectionId) {
    case 'activitystream': return <ActivityStreamPage />;
    case 'applicationmanagement':
    case 'applicationmaterials': return <ApplicationManagementPage />;
    case 'employers': return <EmployersPage />;
    case 'interviewquestions': return <InterviewQuestionsPage />;
    case 'targetemployers': return <TargetEmployersPage />;
    case 'applied': return <AppliedPage />;
    case 'researchtools': return <ResearchToolsPage />;
    case 'afiandjobposting': return <AFIAndJobPostingPage />;
    case 'contacts': return <ContactsSection />;
    case 'appointments': return <AppointmentsSection />;
    default: return null;
  }
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function MyCareerCompassPage() {
  const [selectedSection, setSelectedSection] = useState('overview');

  const sectionLabel = careerSections.find((s) => s.sectionId === selectedSection)?.name || 'Overview';

  return (
    <div className="h-screen flex bg-[#f8f9fb] font-body">
      <Sidebar />
      <SectionSidebar
        title="Career Management"
        items={careerSections}
        collapsedDefault={true}
        onSectionSelect={setSelectedSection}
        activeSectionId={selectedSection}
      />
      <div className="flex-1 flex flex-col h-full transition-all duration-300 min-w-0">
        <main className="flex-1 h-0 overflow-y-auto bg-[#f8f9fb]">
          {/* Page Header Banner */}
          <div className="bg-gradient-to-r from-[#002147] to-[#003875] px-4 md:px-10 py-5 shadow-md">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                  <FaBriefcase size={10} />
                  <span>My Career Compass</span>
                  {selectedSection !== 'overview' && (
                    <>
                      <ChevronRight size={10} />
                      <span>{sectionLabel}</span>
                    </>
                  )}
                </div>
                <h1 className="text-xl font-bold text-white">
                  {selectedSection === 'overview' ? 'My Career Compass' : sectionLabel}
                </h1>
                <p className="text-white/60 text-xs mt-0.5">
                  {selectedSection === 'overview'
                    ? 'Track your career progress and manage your job search journey'
                    : 'Career Compass — ' + sectionLabel}
                </p>
              </div>
              {selectedSection !== 'overview' && (
                <button
                  onClick={() => setSelectedSection('overview')}
                  className="text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1 border border-white/20 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors"
                >
                  ← Back to Overview
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 md:px-10 py-6">
            <div className="max-w-6xl mx-auto">
              {selectedSection === 'overview' ? (
                <CareerCompassOverview onNavigate={setSelectedSection} />
              ) : (
                <SectionContent sectionId={selectedSection} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
