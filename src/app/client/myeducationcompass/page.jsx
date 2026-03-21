"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import SectionSidebar from '../../../../components/dashboardcomponents/SectionSidebar';
import CareerCompassModal from '../../../../components/dashboardcomponents/CareerCompassModal';
import {
  BookOpen, FolderOpen, ClipboardList, CheckCircle, BarChart2,
  Award, Star, Image, Video, FileText, Search, ShoppingCart,
  Calendar, Clock, Play, Download, ChevronRight, TrendingUp,
  AlertCircle, Zap, Users, Target
} from 'lucide-react';
import { FaPlus, FaTimes, FaEdit, FaChevronDown, FaChevronRight, FaGraduationCap } from 'react-icons/fa';

/* ─────────────────────────────────────────────────────────
   PERSISTENCE HOOK
───────────────────────────────────────────────────────── */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const set = useCallback((newVal) => {
    setValue((prev) => {
      const next = typeof newVal === 'function' ? newVal(prev) : newVal;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [value, set];
}

/* ─────────────────────────────────────────────────────────
   ERROR BOUNDARY
───────────────────────────────────────────────────────── */
class SectionErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[EducationCompass] Section error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-500" size={18} />
            <h2 className="text-sm font-semibold text-red-700">Something went wrong in this section</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button type="button" onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────── */
const INITIAL_PROGRAM = {
  title: 'PLEP',
  fullTitle: 'Pre-Licensing Education Program',
  duration: '12 Weeks',
  currentSemester: 'Cohort 1 — Spring 2026',
  totalCredits: 48,
  completedCredits: 18,
  gpa: 3.8,
  modules: [
    {
      id: 1,
      title: 'Orientation & Program Foundations',
      code: 'PLEP-101',
      credits: 6,
      status: 'completed',
      progress: 100,
      sessions: [
        { id: 1, title: 'Welcome & Program Overview', date: '2026-01-13', duration: '2h', type: 'lecture', status: 'completed' },
        { id: 2, title: 'Navigating the Compass Platform', date: '2026-01-15', duration: '1.5h', type: 'workshop', status: 'completed' },
        { id: 3, title: 'Goal Setting & Learning Contracts', date: '2026-01-20', duration: '2h', type: 'workshop', status: 'completed' },
        { id: 4, title: 'Veteran Benefits & Education Rights', date: '2026-01-22', duration: '2h', type: 'lecture', status: 'completed' },
        { id: 5, title: 'Cohort Integration Lab', date: '2026-01-27', duration: '3h', type: 'lab', status: 'completed' },
      ],
      assignments: [
        { id: 1, title: 'Personal Education & Career Plan', dueDate: '2026-01-19', points: 20, status: 'submitted', grade: 96 },
        { id: 2, title: 'Learning Contract Submission', dueDate: '2026-01-26', points: 15, status: 'submitted', grade: 100 },
        { id: 3, title: 'Benefits Overview Quiz', dueDate: '2026-01-28', points: 10, status: 'submitted', grade: 90 },
      ],
    },
    {
      id: 2,
      title: 'Academic Skill Building',
      code: 'PLEP-201',
      credits: 6,
      status: 'completed',
      progress: 100,
      sessions: [
        { id: 6, title: 'Academic Reading Strategies', date: '2026-02-03', duration: '2h', type: 'lecture', status: 'completed' },
        { id: 7, title: 'Research & Citation Methods', date: '2026-02-05', duration: '2h', type: 'lecture', status: 'completed' },
        { id: 8, title: 'Writing for Academic Success', date: '2026-02-10', duration: '2h', type: 'workshop', status: 'completed' },
        { id: 9, title: 'Math Refresher — Fundamentals', date: '2026-02-12', duration: '2h', type: 'lab', status: 'completed' },
      ],
      assignments: [
        { id: 4, title: 'Annotated Bibliography', dueDate: '2026-02-09', points: 25, status: 'submitted', grade: 88 },
        { id: 5, title: 'Short Research Essay', dueDate: '2026-02-17', points: 30, status: 'submitted', grade: 84 },
      ],
    },
    {
      id: 3,
      title: 'Career Exploration & Professional Identity',
      code: 'PLEP-301',
      credits: 6,
      status: 'in-progress',
      progress: 55,
      sessions: [
        { id: 10, title: 'Translating Military Skills', date: '2026-02-24', duration: '2h', type: 'lecture', status: 'completed' },
        { id: 11, title: 'Resume Writing Workshop', date: '2026-02-26', duration: '2h', type: 'workshop', status: 'completed' },
        { id: 12, title: 'LinkedIn & Professional Branding', date: '2026-03-03', duration: '1.5h', type: 'workshop', status: 'upcoming' },
        { id: 13, title: 'Informational Interview Practice', date: '2026-03-05', duration: '2h', type: 'lab', status: 'upcoming' },
        { id: 14, title: 'Industry Panel — Employer Perspectives', date: '2026-03-10', duration: '2h', type: 'lecture', status: 'upcoming' },
      ],
      assignments: [
        { id: 6, title: 'Military-to-Civilian Resume Draft', dueDate: '2026-02-28', points: 30, status: 'submitted', grade: 92 },
        { id: 7, title: 'LinkedIn Profile Review', dueDate: '2026-03-07', points: 15, status: 'in-progress', grade: null },
        { id: 8, title: 'Informational Interview Report', dueDate: '2026-03-14', points: 25, status: 'pending', grade: null },
      ],
    },
    {
      id: 4,
      title: 'Financial Literacy & Benefits Navigation',
      code: 'PLEP-401',
      credits: 6,
      status: 'in-progress',
      progress: 20,
      sessions: [
        { id: 15, title: 'GI Bill & Tuition Assistance Overview', date: '2026-03-17', duration: '2h', type: 'lecture', status: 'upcoming' },
        { id: 16, title: 'FAFSA & Scholarship Walkthrough', date: '2026-03-19', duration: '2h', type: 'workshop', status: 'upcoming' },
        { id: 17, title: 'Budgeting for Student Life', date: '2026-03-24', duration: '1.5h', type: 'workshop', status: 'upcoming' },
      ],
      assignments: [
        { id: 9, title: 'Benefits Eligibility Worksheet', dueDate: '2026-03-21', points: 20, status: 'in-progress', grade: null },
        { id: 10, title: 'Personal Budget Plan', dueDate: '2026-03-28', points: 25, status: 'pending', grade: null },
      ],
    },
    {
      id: 5,
      title: 'College Preparation & Application',
      code: 'PLEP-501',
      credits: 6,
      status: 'upcoming',
      progress: 0,
      sessions: [
        { id: 18, title: 'Choosing the Right Program & School', date: '2026-03-31', duration: '2h', type: 'lecture', status: 'upcoming' },
        { id: 19, title: 'Application Essay Workshop', date: '2026-04-07', duration: '2.5h', type: 'workshop', status: 'upcoming' },
        { id: 20, title: 'Admissions Process Q&A', date: '2026-04-09', duration: '1.5h', type: 'lecture', status: 'upcoming' },
      ],
      assignments: [
        { id: 11, title: 'School Research & Comparison Matrix', dueDate: '2026-04-05', points: 20, status: 'pending', grade: null },
        { id: 12, title: 'Personal Statement Draft', dueDate: '2026-04-14', points: 35, status: 'pending', grade: null },
      ],
    },
    {
      id: 6,
      title: 'Capstone: Transition Readiness',
      code: 'PLEP-601',
      credits: 6,
      status: 'upcoming',
      progress: 0,
      sessions: [
        { id: 21, title: 'Mock Interview Day', date: '2026-04-21', duration: '4h', type: 'lab', status: 'upcoming' },
        { id: 22, title: 'Capstone Presentation Prep', date: '2026-04-28', duration: '2h', type: 'workshop', status: 'upcoming' },
        { id: 23, title: 'Cohort Capstone Presentations', date: '2026-04-30', duration: '3h', type: 'lecture', status: 'upcoming' },
      ],
      assignments: [
        { id: 13, title: 'Transition Action Plan', dueDate: '2026-04-26', points: 40, status: 'pending', grade: null },
        { id: 14, title: 'Capstone Portfolio Submission', dueDate: '2026-04-30', points: 50, status: 'pending', grade: null },
      ],
    },
  ],
  upcomingSessions: [
    { id: 12, title: 'LinkedIn & Professional Branding', module: 'Career Exploration & Professional Identity', date: '2026-03-25', time: '10:00 AM', type: 'workshop' },
    { id: 13, title: 'Informational Interview Practice', module: 'Career Exploration & Professional Identity', date: '2026-03-27', time: '2:00 PM', type: 'lab' },
    { id: 15, title: 'GI Bill & Tuition Assistance Overview', module: 'Financial Literacy & Benefits Navigation', date: '2026-04-01', time: '10:00 AM', type: 'lecture' },
    { id: 16, title: 'FAFSA & Scholarship Walkthrough', module: 'Financial Literacy & Benefits Navigation', date: '2026-04-03', time: '1:00 PM', type: 'workshop' },
  ],
};

const MOCK_QUIZZES = [
  { id: 1, title: 'Veteran Benefits & Education Rights Check', module: 'Orientation & Program Foundations', questions: 12, status: 'completed', score: 90, date: '2026-01-28', duration: '15 min' },
  { id: 2, title: 'Academic Skills Self-Assessment', module: 'Academic Skill Building', questions: 10, status: 'completed', score: 85, date: '2026-02-17', duration: '12 min' },
  { id: 3, title: 'Career Exploration Knowledge Check', module: 'Career Exploration & Professional Identity', questions: 15, status: 'available', score: null, date: '2026-03-10', duration: '20 min' },
  { id: 4, title: 'Financial Literacy Baseline Quiz', module: 'Financial Literacy & Benefits Navigation', questions: 12, status: 'locked', score: null, date: '2026-03-24', duration: '15 min' },
];

const MEDIA_ITEMS = [
  { id: 1, type: 'video', title: 'Welcome & Program Overview — Session Recording', module: 'Orientation & Program Foundations', size: '210 MB', date: '2026-01-13' },
  { id: 2, type: 'video', title: 'Navigating the Compass Platform — Walkthrough', module: 'Orientation & Program Foundations', size: '180 MB', date: '2026-01-15' },
  { id: 3, type: 'pdf', title: 'PLEP Program Guide & Syllabus', module: 'Orientation & Program Foundations', size: '1.4 MB', date: '2026-01-13' },
  { id: 4, type: 'pdf', title: 'Veteran Benefits Quick Reference', module: 'Orientation & Program Foundations', size: '0.8 MB', date: '2026-01-22' },
  { id: 5, type: 'video', title: 'Academic Reading Strategies — Lecture Recording', module: 'Academic Skill Building', size: '340 MB', date: '2026-02-03' },
  { id: 6, type: 'pdf', title: 'APA Citation Guide', module: 'Academic Skill Building', size: '1.1 MB', date: '2026-02-05' },
  { id: 7, type: 'video', title: 'Translating Military Skills — Lecture Recording', module: 'Career Exploration & Professional Identity', size: '290 MB', date: '2026-02-24' },
  { id: 8, type: 'pdf', title: 'Resume Writing Workbook', module: 'Career Exploration & Professional Identity', size: '2.2 MB', date: '2026-02-26' },
];

const EDUCATION_SECTIONS = [
  { name: 'Home', sectionId: 'overview' },
  { name: 'Syllabus', sectionId: 'syllabus' },
  { name: 'Modules', sectionId: 'modules' },
  { name: 'Assignments', sectionId: 'assignments' },
  { name: 'Quizzes', sectionId: 'quizzes' },
  { name: 'Grades', sectionId: 'grades' },
  { name: 'My Documents', sectionId: 'documents' },
  { name: 'Media Gallery', sectionId: 'media-gallery' },
  { name: 'Zoom / Live Sessions', sectionId: 'zoom' },
  { name: 'Course Reader & Solutions', sectionId: 'reader-solutions' },
  { name: 'Library Resources', sectionId: 'library-resources' },
  { name: 'Store: Course Materials', sectionId: 'store-materials' },
  { name: 'Media Reserves', sectionId: 'media-reserves' },
  { name: 'Search', sectionId: 'search' },
];

const MODULE_STATUS_OPTIONS = ['upcoming', 'in-progress', 'completed'];
const ASSIGNMENT_STATUS_OPTIONS = ['pending', 'in-progress', 'submitted'];
const SESSION_TYPE_OPTIONS = ['lecture', 'lab', 'workshop', 'other'];

/* ─────────────────────────────────────────────────────────
   SHARED PRIMITIVES
───────────────────────────────────────────────────────── */
function ProgressBar({ percent, colorClass = 'bg-blue-500', height = 'h-2' }) {
  return (
    <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
      <div className={`${colorClass} ${height} rounded-full`} style={{ width: `${Math.min(percent, 100)}%`, transition: 'width 0.8s ease' }} />
    </div>
  );
}

function ScoreRing({ score, size = 88 }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" className="rotate-[-90deg]">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="url(#eduGrad)" strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ * (1 - score / 100)}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <defs>
        <linearGradient id="eduGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#002147" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const MODULE_STYLE = {
  completed:   { pill: 'bg-green-100 text-green-700', dot: 'bg-green-500', bar: 'bg-green-500' },
  'in-progress': { pill: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', bar: 'bg-blue-500' },
  upcoming:    { pill: 'bg-gray-100 text-gray-600', dot: 'bg-gray-300', bar: 'bg-gray-300' },
};
const ASSIGN_STYLE = {
  submitted:   'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  pending:     'bg-gray-100 text-gray-600',
};
const SESSION_STYLE = {
  completed: 'bg-green-500', upcoming: 'bg-blue-500', other: 'bg-gray-300',
};

/* ─────────────────────────────────────────────────────────
   OVERVIEW SECTION
───────────────────────────────────────────────────────── */
function OverviewSection({ program, onNavigate, onAddModule, onAddSession }) {
  const overallPct = Math.round((program.completedCredits / program.totalCredits) * 100);
  const completedModules = program.modules.filter((m) => m.status === 'completed').length;
  const pendingAssignments = program.modules.flatMap((m) => m.assignments).filter((a) => a.status === 'pending' || a.status === 'in-progress').length;
  const allGraded = program.modules.flatMap((m) => m.assignments).filter((a) => a.grade != null);
  const avgGrade = allGraded.length > 0 ? Math.round(allGraded.reduce((s, a) => s + a.grade, 0) / allGraded.length) : null;

  const readiness = Math.min(Math.round(
    (overallPct / 100) * 40 +
    (completedModules / Math.max(program.modules.length, 1)) * 30 +
    (avgGrade != null ? avgGrade / 100 : 0) * 30
  ), 100);

  const stats = [
    { label: 'Credits Completed', value: program.completedCredits, sub: `of ${program.totalCredits} total`, color: 'text-[#002147]', bg: 'bg-[#002147]/5 border-[#002147]/10' },
    { label: 'Current GPA', value: program.gpa.toFixed(1), sub: 'Grade point average', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    { label: 'Active Modules', value: program.modules.length, sub: `${completedModules} completed`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Pending Tasks', value: pendingAssignments, sub: 'assignments due', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  ];

  const quickLinks = [
    { id: 'modules', label: 'Modules', icon: FolderOpen, desc: 'Browse all course modules', iconBg: 'bg-[#002147]/10', iconColor: 'text-[#002147]', count: program.modules.length },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, desc: 'Track due dates and submissions', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', count: program.modules.flatMap((m) => m.assignments).length },
    { id: 'grades', label: 'Grades', icon: Award, desc: 'View your gradebook', iconBg: 'bg-green-100', iconColor: 'text-green-600', count: null },
    { id: 'quizzes', label: 'Quizzes', icon: CheckCircle, desc: 'Check your understanding', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', count: MOCK_QUIZZES.filter((q) => q.status === 'available').length },
    { id: 'media-gallery', label: 'Media Gallery', icon: Video, desc: 'Lecture recordings and slides', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', count: MEDIA_ITEMS.length },
    { id: 'zoom', label: 'Live Sessions', icon: Users, desc: 'Upcoming Zoom sessions', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', count: program.upcomingSessions.length },
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

      {/* Readiness + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Score Ring */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-[#002147]" size={18} />
            <h3 className="font-semibold text-gray-800 text-sm">Academic Progress Score</h3>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <ScoreRing score={readiness} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{readiness}</span>
                <span className="text-[10px] text-gray-500">/ 100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Credits</span><span className="font-medium">{program.completedCredits}/{program.totalCredits}</span>
                </div>
                <ProgressBar percent={overallPct} colorClass="bg-[#002147]" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Modules</span><span className="font-medium">{completedModules}/{program.modules.length}</span>
                </div>
                <ProgressBar percent={(completedModules / program.modules.length) * 100} colorClass="bg-blue-500" />
              </div>
              {avgGrade != null && (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Avg Grade</span><span className="font-medium">{avgGrade}%</span>
                  </div>
                  <ProgressBar percent={avgGrade} colorClass="bg-green-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module Status + Upcoming Sessions */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="text-[#002147]" size={18} />
              <h3 className="font-semibold text-gray-800 text-sm">Module Progress</h3>
            </div>
            <button onClick={() => onNavigate('modules')} className="text-xs text-[#002147] font-semibold hover:underline flex items-center gap-1">
              All modules <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3 mb-4">
            {program.modules.map((mod) => {
              const st = MODULE_STYLE[mod.status] || MODULE_STYLE.upcoming;
              return (
                <div key={mod.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-800 truncate">{mod.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${st.pill}`}>{mod.status.replace('-', ' ')}</span>
                    </div>
                    <ProgressBar percent={mod.progress} colorClass={st.bar} height="h-1.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-8 text-right shrink-0">{mod.progress}%</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Next Sessions</p>
              <button onClick={onAddSession} className="flex items-center gap-1 text-xs text-[#002147] font-semibold hover:underline">
                <FaPlus size={8} /> Schedule
              </button>
            </div>
            <div className="space-y-2">
              {program.upcomingSessions.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#002147]/10 flex items-center justify-center shrink-0">
                    <Calendar className="text-[#002147]" size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{s.title}</p>
                    <p className="text-[10px] text-gray-500">{s.date} · {s.time}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{s.type}</span>
                </div>
              ))}
              {program.upcomingSessions.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No upcoming sessions</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <button key={link.id} type="button" onClick={() => onNavigate(link.id)}
              className="text-left bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${link.iconBg} rounded-xl flex items-center justify-center`}>
                  <link.icon className={`w-4 h-4 ${link.iconColor}`} />
                </div>
                {link.count !== null && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">{link.count}</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{link.label}</h3>
              <p className="text-xs text-gray-500 mb-3">{link.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#002147] group-hover:gap-2 transition-all">
                Open <ChevronRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SYLLABUS SECTION
───────────────────────────────────────────────────────── */
function SyllabusSection({ program }) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2 mb-1">
              <BookOpen size={18} className="text-[#002147]" /> Course Syllabus
            </h2>
            <p className="text-sm text-gray-500">High-level view of modules, sessions, and learning milestones.</p>
          </div>
          <span className="text-xs text-gray-400">{program.modules.length} modules · {program.upcomingSessions.length} upcoming</span>
        </div>
        <div className="space-y-4">
          {program.modules.map((mod) => {
            const st = MODULE_STYLE[mod.status] || MODULE_STYLE.upcoming;
            return (
              <div key={mod.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{mod.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#002147]/10 text-[#002147] font-medium">{mod.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.pill}`}>{mod.status.replace('-', ' ')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.credits} credits · {mod.sessions.length} sessions · {mod.assignments.length} assignments</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{mod.progress}%</span>
                    <div className="w-24">
                      <ProgressBar percent={mod.progress} colorClass={st.bar} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sessions Roadmap</h4>
                    <div className="space-y-1.5">
                      {mod.sessions.map((sess) => (
                        <div key={sess.id} className="flex items-start gap-2 bg-white rounded-lg px-3 py-2">
                          <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${SESSION_STYLE[sess.status] || SESSION_STYLE.other}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-800 truncate">{sess.title}</div>
                            <div className="text-[10px] text-gray-500">{sess.date} · {sess.duration} · <span className="capitalize">{sess.type}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Assessment Overview</h4>
                    <div className="space-y-1.5">
                      {mod.assignments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="text-xs font-medium text-gray-800 truncate">{a.title}</div>
                            <div className="text-[10px] text-gray-500">Due {a.dueDate} · {a.points} pts</div>
                          </div>
                          {a.grade != null ? (
                            <span className="text-xs font-bold text-green-600">{a.grade}%</span>
                          ) : (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${ASSIGN_STYLE[a.status] || ASSIGN_STYLE.pending}`}>{a.status}</span>
                          )}
                        </div>
                      ))}
                      {mod.assignments.length === 0 && (
                        <p className="text-xs text-gray-400 italic px-3 py-2">No assessments yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODULE CARD
───────────────────────────────────────────────────────── */
function ModuleCard({ module, expanded, onToggle, onAddAssignment }) {
  const st = MODULE_STYLE[module.status] || MODULE_STYLE.upcoming;
  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${expanded ? 'border-[#002147]/30 shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
      <button type="button" onClick={() => onToggle(module.id)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{module.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{module.code}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${st.pill}`}>{module.status.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">{module.credits} credits</span>
            <span className="text-xs text-gray-500">{module.sessions.length} sessions</span>
            <span className="text-xs text-gray-500">{module.assignments.length} assignments</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-gray-600">{module.progress}%</span>
            <div className="w-20">
              <ProgressBar percent={module.progress} colorClass={st.bar} />
            </div>
          </div>
          {expanded ? <FaChevronDown size={12} className="text-gray-400" /> : <FaChevronRight size={12} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
            {/* Sessions */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar size={11} /> Sessions
              </h4>
              <div className="space-y-1.5">
                {module.sessions.map((sess) => (
                  <div key={sess.id} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${SESSION_STYLE[sess.status] || 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{sess.title}</div>
                      <div className="text-[10px] text-gray-500">{sess.date} · {sess.duration}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 capitalize ${sess.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{sess.type}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Assignments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={11} /> Assignments
                </h4>
                <button type="button" onClick={() => onAddAssignment(module.id)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[#002147] hover:underline">
                  <FaPlus size={8} /> Add
                </button>
              </div>
              <div className="space-y-1.5">
                {module.assignments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="text-xs font-medium text-gray-800 truncate">{a.title}</div>
                      <div className="text-[10px] text-gray-500">Due {a.dueDate} · {a.points} pts</div>
                    </div>
                    {a.grade != null ? (
                      <span className="text-xs font-bold text-green-600 shrink-0">{a.grade}%</span>
                    ) : (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize shrink-0 ${ASSIGN_STYLE[a.status] || ASSIGN_STYLE.pending}`}>{a.status}</span>
                    )}
                  </div>
                ))}
                {module.assignments.length === 0 && (
                  <p className="text-xs text-gray-400 italic py-2 text-center">No assignments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODULES SECTION
───────────────────────────────────────────────────────── */
function ModulesSection({ program, expandedModuleId, onToggle, onAddModule, onAddAssignment }) {
  const [filter, setFilter] = useState('All');
  const tabs = ['All', 'in-progress', 'completed', 'upcoming'];
  const filtered = filter === 'All' ? program.modules : program.modules.filter((m) => m.status === filter);
  const counts = useMemo(() => {
    const c = { All: program.modules.length };
    MODULE_STATUS_OPTIONS.forEach((s) => { c[s] = program.modules.filter((m) => m.status === s).length; });
    return c;
  }, [program.modules]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2">
            <FolderOpen size={18} /> All Modules
          </h2>
          <p className="text-sm text-gray-500">Browse, filter, and manage every module in your program.</p>
        </div>
        <button onClick={onAddModule}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm">
          <FaPlus size={10} /> Add Module
        </button>
      </div>
      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${filter === tab ? 'bg-[#002147] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab === 'All' ? 'All' : tab.replace('-', ' ')} <span className="opacity-70">({counts[tab] ?? 0})</span>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((mod) => (
          <ModuleCard key={mod.id} module={mod} expanded={expandedModuleId === mod.id}
            onToggle={onToggle} onAddAssignment={onAddAssignment} />
        ))}
        {filtered.length === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <FolderOpen className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm text-gray-500">No modules in this category</p>
          </div>
        )}
      </div>
      {filtered.length > 0 && <p className="text-xs text-gray-400">Showing {filtered.length} of {program.modules.length} modules</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ASSIGNMENTS SECTION
───────────────────────────────────────────────────────── */
function AssignmentsSection({ program }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const allAssignments = useMemo(() => program.modules.flatMap((m) => m.assignments.map((a) => ({ ...a, moduleTitle: m.title }))), [program.modules]);
  const counts = useMemo(() => {
    const c = { All: allAssignments.length };
    ASSIGNMENT_STATUS_OPTIONS.forEach((s) => { c[s] = allAssignments.filter((a) => a.status === s).length; });
    return c;
  }, [allAssignments]);
  const filtered = useMemo(() => allAssignments.filter((a) => {
    const ms = statusFilter === 'All' || a.status === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || a.title.toLowerCase().includes(q) || a.moduleTitle.toLowerCase().includes(q);
    return ms && mq;
  }), [allAssignments, statusFilter, search]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2"><ClipboardList size={18} /> Assignments</h2>
          <span className="text-xs text-gray-400">{allAssignments.length} total</span>
        </div>
        <p className="text-sm text-gray-500 mb-5">All assignments across your modules with due dates and statuses.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total', value: counts.All, color: 'text-[#002147]', bg: 'bg-[#002147]/5 border-[#002147]/10' },
            { label: 'Pending', value: counts.pending, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
            { label: 'In Progress', value: counts['in-progress'], color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
            { label: 'Submitted', value: counts.submitted, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          ].map((s) => (
            <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignment or module…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...ASSIGNMENT_STATUS_OPTIONS].map((tab) => (
              <button key={tab} onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${statusFilter === tab ? 'bg-[#002147] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab.replace('-', ' ')} <span className="opacity-70">({counts[tab] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 gap-3 px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-2">Assignment</div><div>Module</div><div>Due</div><div>Grade / Status</div>
            </div>
            {filtered.map((a) => (
              <div key={`${a.moduleTitle}-${a.id}`} className="grid grid-cols-5 gap-3 px-4 py-3 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-2">
                  <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.points} pts</div>
                </div>
                <div className="text-xs text-gray-600 truncate">{a.moduleTitle}</div>
                <div className="text-xs text-gray-500">{a.dueDate}</div>
                <div>
                  {a.grade != null ? (
                    <span className="text-sm font-bold text-green-600">{a.grade}%</span>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${ASSIGN_STYLE[a.status] || ASSIGN_STYLE.pending}`}>{a.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <ClipboardList className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm text-gray-500">{search || statusFilter !== 'All' ? 'No assignments match your filters' : 'No assignments yet'}</p>
          </div>
        )}
        {filtered.length > 0 && <p className="text-xs text-gray-400 mt-3">Showing {filtered.length} of {allAssignments.length} assignments</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   QUIZZES SECTION
───────────────────────────────────────────────────────── */
function QuizzesSection() {
  const completedCount = MOCK_QUIZZES.filter((q) => q.status === 'completed').length;
  const availableCount = MOCK_QUIZZES.filter((q) => q.status === 'available').length;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2"><CheckCircle size={18} /> Quizzes</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Short assessments to check your understanding of key concepts.</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total', value: MOCK_QUIZZES.length, color: 'text-[#002147]', bg: 'bg-[#002147]/5 border-[#002147]/10' },
            { label: 'Completed', value: completedCount, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
            { label: 'Available', value: availableCount, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          ].map((s) => (
            <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_QUIZZES.map((quiz) => (
            <div key={quiz.id} className={`border rounded-2xl p-4 flex flex-col ${quiz.status === 'locked' ? 'border-gray-100 bg-gray-50/60 opacity-70' : 'border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">{quiz.title}</h3>
                  <p className="text-xs text-gray-500">{quiz.module}</p>
                </div>
                {quiz.status === 'completed' && (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0">{quiz.score}%</span>
                )}
                {quiz.status === 'available' && (
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full shrink-0">Available</span>
                )}
                {quiz.status === 'locked' && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full shrink-0">Locked</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span>{quiz.questions} questions</span>
                <span>·</span>
                <span>{quiz.duration}</span>
                <span>·</span>
                <span>{quiz.date}</span>
              </div>
              {quiz.status === 'completed' && (
                <div className="mb-3">
                  <ProgressBar percent={quiz.score} colorClass="bg-green-500" />
                </div>
              )}
              <button type="button" disabled={quiz.status === 'locked'}
                className={`mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                  quiz.status === 'locked'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#002147] text-white hover:bg-[#003875]'
                }`}>
                <Play size={11} />
                {quiz.status === 'completed' ? 'Review Quiz' : quiz.status === 'available' ? 'Start Quiz' : 'Locked'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   GRADES SECTION
───────────────────────────────────────────────────────── */
function GradesSection({ program }) {
  const allGraded = useMemo(() => program.modules.flatMap((m) => m.assignments).filter((a) => a.grade != null), [program.modules]);
  const overallAvg = allGraded.length > 0 ? Math.round(allGraded.reduce((s, a) => s + a.grade, 0) / allGraded.length) : null;
  const overallPct = Math.round((program.completedCredits / program.totalCredits) * 100);

  const getGradeColor = (g) => {
    if (g >= 90) return 'text-green-600';
    if (g >= 80) return 'text-blue-600';
    if (g >= 70) return 'text-yellow-600';
    return 'text-red-500';
  };
  const getGradeBar = (g) => {
    if (g >= 90) return 'bg-green-500';
    if (g >= 80) return 'bg-blue-500';
    if (g >= 70) return 'bg-yellow-500';
    return 'bg-red-400';
  };
  const getLetterGrade = (g) => {
    if (g >= 90) return 'A';
    if (g >= 80) return 'B';
    if (g >= 70) return 'C';
    return 'D';
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="text-[#002147]" size={18} />
            <h3 className="text-sm font-semibold text-gray-700">Current GPA</h3>
          </div>
          <div className="text-4xl font-bold text-[#002147] mb-1">{program.gpa.toFixed(2)}</div>
          <p className="text-xs text-gray-500">Based on completed coursework</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="text-green-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-700">Avg Assignment Score</h3>
          </div>
          <div className={`text-4xl font-bold mb-1 ${overallAvg != null ? getGradeColor(overallAvg) : 'text-gray-400'}`}>
            {overallAvg != null ? `${overallAvg}%` : '—'}
          </div>
          {overallAvg != null && (
            <div className="mt-2"><ProgressBar percent={overallAvg} colorClass={getGradeBar(overallAvg)} /></div>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BarChart2 className="text-blue-500" size={18} />
            <h3 className="text-sm font-semibold text-gray-700">Credit Progress</h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-1">{overallPct}%</div>
          <p className="text-xs text-gray-500 mb-2">{program.completedCredits} of {program.totalCredits} credits</p>
          <ProgressBar percent={overallPct} colorClass="bg-blue-500" />
        </div>
      </div>

      {/* Module Gradebook */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Module Gradebook</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-3 px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-2">Module</div><div>Average</div><div>Assignments</div>
          </div>
          {program.modules.map((mod) => {
            const graded = mod.assignments.filter((a) => a.grade != null);
            const avg = graded.length > 0 ? Math.round(graded.reduce((s, a) => s + a.grade, 0) / graded.length) : null;
            const st = MODULE_STYLE[mod.status] || MODULE_STYLE.upcoming;
            return (
              <div key={mod.id} className="grid grid-cols-4 gap-3 px-4 py-3 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-2">
                  <div className="text-sm font-semibold text-gray-900">{mod.title}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.pill}`}>{mod.status.replace('-', ' ')}</span>
                </div>
                <div>
                  {avg != null ? (
                    <div>
                      <div className={`text-sm font-bold ${getGradeColor(avg)}`}>{avg}% <span className="text-xs">({getLetterGrade(avg)})</span></div>
                      <div className="w-16 mt-1"><ProgressBar percent={avg} colorClass={getGradeBar(avg)} /></div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No grades yet</span>
                  )}
                </div>
                <div className="text-xs text-gray-600">{graded.length}/{mod.assignments.length} graded</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MEDIA GALLERY
───────────────────────────────────────────────────────── */
function MediaGallerySection() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => MEDIA_ITEMS.filter((m) => {
    const mt = typeFilter === 'All' || m.type === typeFilter;
    const q = search.toLowerCase();
    const mq = !q || m.title.toLowerCase().includes(q) || m.module.toLowerCase().includes(q);
    return mt && mq;
  }), [typeFilter, search]);

  const videoCount = MEDIA_ITEMS.filter((m) => m.type === 'video').length;
  const pdfCount = MEDIA_ITEMS.filter((m) => m.type === 'pdf').length;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2"><Image size={18} /> Media Gallery</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Lecture recordings, slide decks, and visual materials from your courses.</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Items', value: MEDIA_ITEMS.length, color: 'text-[#002147]', bg: 'bg-[#002147]/5 border-[#002147]/10' },
            { label: 'Recordings', value: videoCount, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            { label: 'Documents', value: pdfCount, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          ].map((s) => (
            <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none" />
          </div>
          <div className="flex gap-1.5">
            {['All', 'video', 'pdf'].map((tab) => (
              <button key={tab} onClick={() => setTypeFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${typeFilter === tab ? 'bg-[#002147] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                {item.type === 'video' ? <Video size={14} className="text-blue-600" /> : <FileText size={14} className="text-green-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">{item.module} · {item.size} · {item.date}</p>
              </div>
              <button type="button"
                className="flex items-center gap-1 text-xs font-semibold text-[#002147] hover:text-[#003875] transition-colors shrink-0">
                {item.type === 'video' ? <><Play size={11} /> Play</> : <><Download size={11} /> Download</>}
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <Image className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-500">No media matches your filters</p>
            </div>
          )}
        </div>
        {filtered.length > 0 && <p className="text-xs text-gray-400 mt-3">Showing {filtered.length} of {MEDIA_ITEMS.length} items</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ZOOM / LIVE SESSIONS
───────────────────────────────────────────────────────── */
function ZoomSection({ program, onAddSession }) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2"><Video size={18} /> Live Sessions</h2>
          <button onClick={onAddSession}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm">
            <FaPlus size={10} /> Add Session
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">Upcoming virtual sessions and office hours for your courses.</p>

        {program.upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {program.upcomingSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-2xl p-4 hover:border-[#002147]/30 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#002147]/10 flex items-center justify-center shrink-0">
                    <Video className="text-[#002147]" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900">{session.title}</h3>
                    <p className="text-xs text-gray-500">{session.module}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{session.date} · {session.time} · <span className="capitalize">{session.type}</span></p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Zoom link pending
                  </span>
                  <button type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
                    <Play size={11} /> Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <Video className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-medium text-gray-500">No upcoming sessions scheduled</p>
            <p className="text-xs text-gray-400 mt-1">Add a live session to get started</p>
            <button onClick={onAddSession} className="mt-4 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
              Schedule Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   READER & SOLUTIONS
───────────────────────────────────────────────────────── */
function ReaderSolutionsSection() {
  const readings = [
    { week: 'Week 1', title: 'Foundational Concepts & Terminology', pages: '1–45', status: 'completed' },
    { week: 'Week 2', title: 'Problem-Solving Strategies & Patterns', pages: '46–90', status: 'completed' },
    { week: 'Week 3', title: 'Case Studies & Real-World Examples', pages: '91–140', status: 'in-progress' },
    { week: 'Week 4', title: 'Advanced Applications & Extensions', pages: '141–200', status: 'upcoming' },
  ];
  const solutions = [
    { title: 'Assignment 1 — Solution Guide', module: 'PLEP', type: 'Worked Example' },
    { title: 'Assignment 2 — Solution Guide', module: 'PLEP', type: 'Worked Example' },
    { title: 'DSA Problem Set Solutions', module: 'Data Structures', type: 'Problem Set' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2 mb-1"><BookOpen size={18} /> Course Reader & Solutions</h2>
        <p className="text-sm text-gray-500 mb-5">Curated readings, solution guides, and worked examples.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Weekly Readings</h3>
            <div className="space-y-2">
              {readings.map((r) => {
                const st = MODULE_STYLE[r.status] || MODULE_STYLE.upcoming;
                return (
                  <div key={r.week} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-600">{r.week}</div>
                      <div className="text-sm font-medium text-gray-800 truncate">{r.title}</div>
                      <div className="text-xs text-gray-400">Pages {r.pages}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize shrink-0 ${st.pill}`}>{r.status.replace('-', ' ')}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Solution Guides</h3>
            <div className="space-y-2">
              {solutions.map((s) => (
                <div key={s.title} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.module} · {s.type}</div>
                  </div>
                  <button type="button" className="flex items-center gap-1 text-xs text-[#002147] font-semibold hover:underline shrink-0">
                    <Download size={11} /> View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LIBRARY RESOURCES
───────────────────────────────────────────────────────── */
function LibrarySection() {
  const resources = [
    { title: 'Digital Textbooks', desc: 'Access core course texts via your institution\'s digital library.', icon: BookOpen, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', count: 4 },
    { title: 'Research Databases', desc: 'Find peer-reviewed articles and conference papers for projects.', icon: Search, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', count: 12 },
    { title: 'Citation Guides', desc: 'APA, MLA, and Chicago style quick references and tools.', icon: FileText, iconBg: 'bg-green-100', iconColor: 'text-green-600', count: 3 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2 mb-1"><BookOpen size={18} /> Library Resources</h2>
        <p className="text-sm text-gray-500 mb-5">Connect to your institution&apos;s academic resources and support services.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resources.map((r) => (
            <div key={r.title} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-gray-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${r.iconBg} rounded-xl flex items-center justify-center`}>
                  <r.icon size={18} className={r.iconColor} />
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{r.count} items</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{r.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{r.desc}</p>
              <button type="button" className="flex items-center gap-1 text-xs font-semibold text-[#002147] hover:underline">
                <Search size={11} /> Open resource
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STORE
───────────────────────────────────────────────────────── */
function StoreSection() {
  const [cart, setCart] = useState(new Set());
  const materials = [
    { id: 1, title: 'Course Reader (Print)', price: '$39.99', desc: 'Bound print edition of the core course readings.', icon: BookOpen, badge: 'Bestseller' },
    { id: 2, title: 'Lab Workbook', price: '$24.99', desc: 'Hands-on exercises and practice problems for lab sessions.', icon: ClipboardList, badge: null },
    { id: 3, title: 'Supplemental Problem Set Pack', price: '$14.99', desc: 'Extra practice questions grouped by topic and difficulty.', icon: Target, badge: 'New' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2"><ShoppingCart size={18} /> Store: Course Materials</h2>
          {cart.size > 0 && (
            <span className="text-xs font-semibold text-[#002147] bg-[#002147]/10 px-2.5 py-1 rounded-full">{cart.size} in cart</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">Optional physical and supplemental materials that support your learning.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {materials.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-2xl p-4 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <item.icon size={18} className="text-amber-600" />
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badge === 'New' ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-700'}`}>{item.badge}</span>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-4 flex-1">{item.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-base font-bold text-[#002147]">{item.price}</span>
                <button type="button" onClick={() => setCart((prev) => { const n = new Set(prev); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${cart.has(item.id) ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-[#002147] text-white hover:bg-[#003875]'}`}>
                  <ShoppingCart size={11} />
                  {cart.has(item.id) ? 'Added ✓' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MEDIA RESERVES
───────────────────────────────────────────────────────── */
function MediaReservesSection() {
  const reserves = [
    { id: 1, title: 'Recorded Review Session', module: 'PLEP', availableUntil: '2024-03-31', size: '290 MB', type: 'video' },
    { id: 2, title: 'Guest Lecture Recording', module: 'Data Structures and Algorithms', availableUntil: '2024-04-15', size: '510 MB', type: 'video' },
    { id: 3, title: 'Exam Prep PDF Pack', module: 'PLEP', availableUntil: '2024-04-01', size: '4.2 MB', type: 'pdf' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2 mb-1"><Clock size={18} /> Media Reserves</h2>
        <p className="text-sm text-gray-500 mb-5">Time-limited media items provided by your instructors or library.</p>
        <div className="space-y-2">
          {reserves.map((item) => {
            const isExpiringSoon = new Date(item.availableUntil) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            return (
              <div key={item.id} className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {item.type === 'video' ? <Video size={14} className="text-blue-600" /> : <FileText size={14} className="text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                    {isExpiringSoon && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle size={8} /> Expiring soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{item.module} · {item.size}</p>
                  <p className="text-xs text-gray-400">Available until {item.availableUntil}</p>
                </div>
                <button type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shrink-0">
                  {item.type === 'video' ? <><Play size={11} /> Watch</> : <><Download size={11} /> Download</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SEARCH SECTION
───────────────────────────────────────────────────────── */
function SearchSection({ program }) {
  const [query, setQuery] = useState('');
  const allAssignments = useMemo(() => program.modules.flatMap((m) => m.assignments.map((a) => ({ ...a, moduleTitle: m.title }))), [program.modules]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      modules: program.modules.filter((m) => m.title.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)),
      assignments: allAssignments.filter((a) => a.title.toLowerCase().includes(q) || a.moduleTitle.toLowerCase().includes(q)),
      sessions: program.upcomingSessions.filter((s) => s.title.toLowerCase().includes(q) || s.module.toLowerCase().includes(q)),
    };
  }, [query, program.modules, allAssignments, program.upcomingSessions]);

  const totalResults = results ? results.modules.length + results.assignments.length + results.sessions.length : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2 mb-1"><Search size={18} /> Search Your Course</h2>
        <p className="text-sm text-gray-500 mb-5">Find modules, assignments, and sessions by keyword.</p>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus placeholder='Try "arrays" or "lab session"…'
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/10 focus:outline-none" />
        </div>
        {query && results && (
          <p className="text-xs text-gray-500 mb-4">
            {totalResults > 0 ? <><span className="font-semibold">{totalResults} results</span> for "{query}"</> : <><span className="font-semibold">No results</span> for "{query}"</>}
          </p>
        )}
        {results && totalResults > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { label: 'Modules', items: results.modules, renderRow: (m) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                  <div><div className="text-xs font-semibold text-gray-900">{m.title}</div><div className="text-[10px] text-gray-500">{m.code}</div></div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${(MODULE_STYLE[m.status] || MODULE_STYLE.upcoming).pill}`}>{m.status.replace('-', ' ')}</span>
                </div>
              )},
              { label: 'Assignments', items: results.assignments, renderRow: (a) => (
                <div key={`${a.moduleTitle}-${a.id}`} className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-0.5"><span className="text-xs font-semibold text-gray-900 truncate">{a.title}</span><span className="text-[10px] text-gray-500 shrink-0 ml-2">{a.dueDate}</span></div>
                  <div className="flex justify-between text-[10px] text-gray-500"><span>{a.moduleTitle}</span><span>{a.points} pts</span></div>
                </div>
              )},
              { label: 'Sessions', items: results.sessions, renderRow: (s) => (
                <div key={s.id} className="p-2.5 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-0.5"><span className="text-xs font-semibold text-gray-900 truncate">{s.title}</span><span className="text-[10px] text-gray-500 shrink-0 ml-2">{s.date}</span></div>
                  <div className="flex justify-between text-[10px] text-gray-500"><span>{s.module}</span><span className="capitalize">{s.type}</span></div>
                </div>
              )},
            ].map((col) => (
              <div key={col.label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <h3 className="text-xs font-bold text-gray-700 mb-2">{col.label} ({col.items.length})</h3>
                <div className="space-y-1.5">{col.items.length > 0 ? col.items.map(col.renderRow) : <p className="text-xs text-gray-400 italic">None found</p>}</div>
              </div>
            ))}
          </div>
        )}
        {!query && (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <Search className="mx-auto text-gray-300 mb-2" size={28} />
            <p className="text-sm text-gray-400">Start typing to search your course content</p>
          </div>
        )}
        {query && totalResults === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <AlertCircle className="mx-auto text-gray-300 mb-2" size={28} />
            <p className="text-sm text-gray-500">No results found for "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DOCUMENTS SECTION (File Upload — Transcripts, Certs, DD-214)
───────────────────────────────────────────────────────── */
const DOC_CATEGORIES = ['Transcript', 'Certificate', 'DD-214', 'Resume', 'VA Letter', 'Other'];
const DOC_CATEGORY_COLORS = {
  'Transcript':  'bg-blue-100 text-blue-700',
  'Certificate': 'bg-green-100 text-green-700',
  'DD-214':      'bg-[#002147]/10 text-[#002147]',
  'Resume':      'bg-purple-100 text-purple-700',
  'VA Letter':   'bg-orange-100 text-orange-700',
  'Other':       'bg-gray-100 text-gray-600',
};

function DocumentsSection() {
  // Persist document metadata to localStorage; blobs live in memory only
  const [docs, setDocs] = useLocalStorage('plep_edu_documents', []);
  const blobMap = useRef(new Map()); // id -> File object (session-only)
  const [dragging, setDragging] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Transcript');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_FILE_MB = 20;

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fileExt = (name) => name.split('.').pop().toUpperCase();

  const processFile = async (file) => {
    setUploadError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Unsupported file type. Allowed: PDF, JPG, PNG, DOC, DOCX.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadError(`File too large. Maximum size is ${MAX_FILE_MB} MB.`);
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    // Simulate upload progress (replace with real fetch to /api/education/documents/upload)
    for (let i = 1; i <= 10; i++) {
      await new Promise((res) => setTimeout(res, 80));
      setUploadProgress(i * 10);
    }
    const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    blobMap.current.set(id, file);
    const meta = {
      id,
      name: file.name,
      size: file.size,
      category: uploadCategory,
      uploadedAt: new Date().toISOString(),
      retrievable: true, // blob is in memory this session
    };
    setDocs((prev) => [meta, ...prev]);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDownload = (doc) => {
    const blob = blobMap.current.get(doc.id);
    if (!blob) {
      alert('File is no longer available in this session. Please re-upload to download.');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleDelete = (id) => {
    blobMap.current.delete(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirmId(null);
  };

  const filtered = useMemo(() => (
    categoryFilter === 'All' ? docs : docs.filter((d) => d.category === categoryFilter)
  ), [docs, categoryFilter]);

  const counts = useMemo(() => {
    const c = { All: docs.length };
    DOC_CATEGORIES.forEach((cat) => { c[cat] = docs.filter((d) => d.category === cat).length; });
    return c;
  }, [docs]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="text-[#002147]" size={18} />
          <h2 className="text-lg font-bold text-[#002147]">My Documents</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Upload and manage your transcripts, DD-214, certificates, and other program documents.
          Files are stored securely and can be retrieved at any time during your session.
        </p>

        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer mb-5 ${
            dragging ? 'border-[#002147] bg-[#002147]/5' : 'border-gray-200 hover:border-[#002147]/40 hover:bg-gray-50'
          }`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div className="w-12 h-12 rounded-full bg-[#002147]/10 flex items-center justify-center mx-auto mb-3">
            <Download className="text-[#002147] rotate-180" size={20} />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {dragging ? 'Drop your file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC, DOCX — max {MAX_FILE_MB} MB</p>

          {/* Category selector */}
          <div className="flex items-center justify-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            <label className="text-xs font-medium text-gray-600">Category:</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none bg-white"
            >
              {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Choose File'}
            </button>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#002147] h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}

          {/* Error */}
          {uploadError && (
            <div className="mt-3 flex items-center gap-1.5 justify-center text-red-600 text-xs">
              <AlertCircle size={12} /> {uploadError}
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {['All', ...DOC_CATEGORIES].map((cat) => (
            counts[cat] > 0 || cat === 'All' ? (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  categoryFilter === cat ? 'bg-[#002147] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat} <span className="opacity-70">({counts[cat] ?? 0})</span>
              </button>
            ) : null
          ))}
        </div>

        {/* Document List */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((doc) => {
              const inMemory = blobMap.current.has(doc.id);
              return (
                <div key={doc.id} className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-colors">
                  {/* File type icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#002147]/10 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-[#002147]">{fileExt(doc.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 truncate">{doc.name}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${DOC_CATEGORY_COLORS[doc.category] || DOC_CATEGORY_COLORS.Other}`}>
                        {doc.category}
                      </span>
                      {!inMemory && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <AlertCircle size={8} /> Re-upload to download
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{formatSize(doc.size)} · Uploaded {formatDate(doc.uploadedAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      disabled={!inMemory}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        inMemory
                          ? 'bg-[#002147] text-white hover:bg-[#003875]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Download size={11} /> Download
                    </button>
                    {deleteConfirmId === doc.id ? (
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleDelete(doc.id)}
                          className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">Confirm</button>
                        <button type="button" onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setDeleteConfirmId(doc.id)}
                        className="p-1.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                        <FaTimes size={11} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <FileText className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-medium text-gray-500">No documents uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your DD-214, transcripts, or certificates to get started</p>
          </div>
        )}
        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            Showing {filtered.length} of {docs.length} documents
            {!filtered.every((d) => blobMap.current.has(d.id)) && (
              <span className="ml-2 text-amber-600"> · Some files require re-upload to download (session files don't persist across page reloads)</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION ROUTER
───────────────────────────────────────────────────────── */
function SectionContent({ section, program, expandedModuleId, onToggle, onAddModule, onAddAssignment, onAddSession, onNavigate }) {
  return (
    <SectionErrorBoundary key={section}>
      {(() => {
        switch (section) {
          case 'syllabus':        return <SyllabusSection program={program} />;
          case 'modules':        return <ModulesSection program={program} expandedModuleId={expandedModuleId} onToggle={onToggle} onAddModule={onAddModule} onAddAssignment={onAddAssignment} />;
          case 'assignments':    return <AssignmentsSection program={program} />;
          case 'quizzes':        return <QuizzesSection />;
          case 'grades':         return <GradesSection program={program} />;
          case 'documents':      return <DocumentsSection />;
          case 'media-gallery':  return <MediaGallerySection />;
          case 'zoom':           return <ZoomSection program={program} onAddSession={onAddSession} />;
          case 'reader-solutions': return <ReaderSolutionsSection />;
          case 'library-resources': return <LibrarySection />;
          case 'store-materials': return <StoreSection />;
          case 'media-reserves': return <MediaReservesSection />;
          case 'search':         return <SearchSection program={program} />;
          default: return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#002147] mb-2">{EDUCATION_SECTIONS.find((s) => s.sectionId === section)?.name || section}</h2>
              <p className="text-sm text-gray-500">This section is ready to be configured.</p>
            </div>
          );
        }
      })()}
    </SectionErrorBoundary>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function MyEducationCompassPage() {
  // ── Persistent state — survives navigation & page reload ──────────────────
  const [program, setProgram] = useLocalStorage('plep_edu_program', INITIAL_PROGRAM);
  const [selectedSection, setSelectedSection] = useLocalStorage('plep_edu_section', 'overview');
  const [expandedModuleId, setExpandedModuleId] = useLocalStorage('plep_edu_expanded_module', null);

  // Guard: if stored program is missing new fields, merge with INITIAL_PROGRAM
  useEffect(() => {
    if (!program?.fullTitle) {
      setProgram(INITIAL_PROGRAM);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Guard: if stored section no longer exists, reset to overview
  useEffect(() => {
    const valid = EDUCATION_SECTIONS.some((s) => s.sectionId === selectedSection);
    if (!valid) setSelectedSection('overview');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add Module modal
  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '', code: '', credits: 3, status: 'in-progress' });
  const [moduleFormError, setModuleFormError] = useState('');

  // Add Assignment modal
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [assignmentModuleId, setAssignmentModuleId] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', dueDate: new Date().toISOString().slice(0, 10), points: 20, status: 'pending' });
  const [assignmentFormError, setAssignmentFormError] = useState('');

  // Add Session modal
  const [addSessionOpen, setAddSessionOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: '', moduleId: '', date: new Date().toISOString().slice(0, 10), time: '10:00', type: 'lecture' });
  const [sessionFormError, setSessionFormError] = useState('');

  const handleToggle = useCallback((id) => setExpandedModuleId((prev) => (prev === id ? null : id)), [setExpandedModuleId]);

  // Module handlers
  const handleOpenAddModule = useCallback(() => {
    setModuleForm({ title: '', code: '', credits: 3, status: 'in-progress' });
    setModuleFormError(''); setAddModuleOpen(true);
  }, []);
  const handleCloseAddModule = useCallback(() => { setAddModuleOpen(false); setModuleFormError(''); }, []);
  const handleModuleChange = useCallback((e) => { const { name, value } = e.target; setModuleForm((p) => ({ ...p, [name]: name === 'credits' ? parseInt(value, 10) || 0 : value })); }, []);
  const handleAddModule = useCallback(() => {
    if (!moduleForm.title?.trim()) { setModuleFormError('Title is required.'); return; }
    if (!moduleForm.code?.trim()) { setModuleFormError('Code is required.'); return; }
    setProgram((prev) => ({ ...prev, modules: [...prev.modules, { id: Date.now(), title: moduleForm.title.trim(), code: moduleForm.code.trim(), credits: moduleForm.credits || 3, status: moduleForm.status, progress: 0, sessions: [], assignments: [] }] }));
    handleCloseAddModule();
  }, [moduleForm, handleCloseAddModule]);

  // Assignment handlers
  const handleOpenAddAssignment = useCallback((moduleId) => {
    setAssignmentModuleId(moduleId);
    setAssignmentForm({ title: '', dueDate: new Date().toISOString().slice(0, 10), points: 20, status: 'pending' });
    setAssignmentFormError(''); setAddAssignmentOpen(true);
  }, []);
  const handleCloseAddAssignment = useCallback(() => { setAddAssignmentOpen(false); setAssignmentModuleId(null); setAssignmentFormError(''); }, []);
  const handleAssignmentChange = useCallback((e) => { const { name, value } = e.target; setAssignmentForm((p) => ({ ...p, [name]: name === 'points' ? parseInt(value, 10) || 0 : value })); }, []);
  const handleAddAssignment = useCallback(() => {
    if (!assignmentForm.title?.trim()) { setAssignmentFormError('Title is required.'); return; }
    setProgram((prev) => ({ ...prev, modules: prev.modules.map((m) => m.id === assignmentModuleId ? { ...m, assignments: [...m.assignments, { id: Date.now(), title: assignmentForm.title.trim(), dueDate: assignmentForm.dueDate, points: assignmentForm.points, status: assignmentForm.status, grade: null }] } : m) }));
    handleCloseAddAssignment();
  }, [assignmentForm, assignmentModuleId, handleCloseAddAssignment]);

  // Session handlers
  const handleOpenAddSession = useCallback(() => {
    setSessionForm({ title: '', moduleId: program.modules[0]?.id ?? '', date: new Date().toISOString().slice(0, 10), time: '10:00', type: 'lecture' });
    setSessionFormError(''); setAddSessionOpen(true);
  }, [program.modules]);
  const handleCloseAddSession = useCallback(() => { setAddSessionOpen(false); setSessionFormError(''); }, []);
  const handleSessionChange = useCallback((e) => { const { name, value } = e.target; setSessionForm((p) => ({ ...p, [name]: value })); }, []);
  const handleAddSession = useCallback(() => {
    if (!sessionForm.title?.trim()) { setSessionFormError('Title is required.'); return; }
    const moduleTitle = program.modules.find((m) => m.id === Number(sessionForm.moduleId))?.title ?? '—';
    setProgram((prev) => ({ ...prev, upcomingSessions: [...prev.upcomingSessions, { id: Date.now(), title: sessionForm.title.trim(), module: moduleTitle, date: sessionForm.date, time: sessionForm.time, type: sessionForm.type }] }));
    handleCloseAddSession();
  }, [sessionForm, program.modules, handleCloseAddSession]);

  const sectionLabel = EDUCATION_SECTIONS.find((s) => s.sectionId === selectedSection)?.name || 'Overview';

  return (
    <div className="h-screen flex bg-[#f8f9fb]">
      <Sidebar />
      <SectionSidebar
        title="Education Compass"
        items={EDUCATION_SECTIONS}
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
                  <FaGraduationCap size={10} />
                  <span>My Education Compass</span>
                  {selectedSection !== 'overview' && (
                    <><ChevronRight size={10} /><span>{sectionLabel}</span></>
                  )}
                </div>
                <h1 className="text-xl font-bold text-white">
                  {selectedSection === 'overview' ? 'My Education Compass' : sectionLabel}
                </h1>
                <p className="text-white/60 text-xs mt-0.5">
                  {selectedSection === 'overview'
                    ? `${program.title} · ${program.currentSemester} · ${program.duration}`
                    : 'Education Compass — ' + sectionLabel}
                </p>
              </div>
              {selectedSection !== 'overview' && (
                <button onClick={() => setSelectedSection('overview')}
                  className="text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1 border border-white/20 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors">
                  ← Back to Overview
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 md:px-10 py-6">
            <div className="max-w-6xl mx-auto">
              {selectedSection === 'overview' ? (
                <OverviewSection program={program} onNavigate={setSelectedSection} onAddModule={handleOpenAddModule} onAddSession={handleOpenAddSession} />
              ) : (
                <SectionContent
                  section={selectedSection}
                  program={program}
                  expandedModuleId={expandedModuleId}
                  onToggle={handleToggle}
                  onAddModule={handleOpenAddModule}
                  onAddAssignment={handleOpenAddAssignment}
                  onAddSession={handleOpenAddSession}
                  onNavigate={setSelectedSection}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Module Modal */}
      <CareerCompassModal open={addModuleOpen} onClose={handleCloseAddModule} title="Add Module" icon={<FolderOpen size={14} />} onSubmit={handleAddModule} submitLabel="Add Module">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Module Title *</label>
            <input type="text" name="title" value={moduleForm.title} onChange={handleModuleChange} placeholder="e.g. Introduction to Machine Learning"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Module Code *</label>
            <input type="text" name="code" value={moduleForm.code} onChange={handleModuleChange} placeholder="e.g. CS401"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Credits</label>
            <input type="number" name="credits" value={moduleForm.credits} onChange={handleModuleChange} min={1} max={12}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={moduleForm.status} onChange={handleModuleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
              {MODULE_STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.replace('-', ' ')}</option>)}
            </select>
          </div>
        </div>
        {moduleFormError && <p className="text-red-600 text-xs">⚠ {moduleFormError}</p>}
      </CareerCompassModal>

      {/* Add Assignment Modal */}
      <CareerCompassModal open={addAssignmentOpen} onClose={handleCloseAddAssignment} title="Add Assignment" icon={<ClipboardList size={14} />} onSubmit={handleAddAssignment} submitLabel="Add Assignment">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" name="title" value={assignmentForm.title} onChange={handleAssignmentChange} placeholder="Assignment title"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" name="dueDate" value={assignmentForm.dueDate} onChange={handleAssignmentChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Points</label>
            <input type="number" name="points" value={assignmentForm.points} onChange={handleAssignmentChange} min={1}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={assignmentForm.status} onChange={handleAssignmentChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
              {ASSIGNMENT_STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.replace('-', ' ')}</option>)}
            </select>
          </div>
        </div>
        {assignmentFormError && <p className="text-red-600 text-xs">⚠ {assignmentFormError}</p>}
      </CareerCompassModal>

      {/* Add Session Modal */}
      <CareerCompassModal open={addSessionOpen} onClose={handleCloseAddSession} title="Schedule Live Session" icon={<Video size={14} />} onSubmit={handleAddSession} submitLabel="Add Session">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Session Title *</label>
          <input type="text" name="title" value={sessionForm.title} onChange={handleSessionChange} placeholder="e.g. Office Hours — Week 5"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Module</label>
          <select name="moduleId" value={sessionForm.moduleId} onChange={handleSessionChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
            {program.modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <input type="date" name="date" value={sessionForm.date} onChange={handleSessionChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
            <input type="time" name="time" value={sessionForm.time} onChange={handleSessionChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={sessionForm.type} onChange={handleSessionChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none">
              {SESSION_TYPE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        {sessionFormError && <p className="text-red-600 text-xs">⚠ {sessionFormError}</p>}
      </CareerCompassModal>
    </div>
  );
}
