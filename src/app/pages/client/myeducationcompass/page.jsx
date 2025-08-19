"use client";

import React, { useState } from 'react';
import Sidebar from '../../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../../components/dashboardcomponents/clienttopbar';
import SectionSidebar from '../../../../../components/dashboardcomponents/SectionSidebar';
import { BookOpen, Briefcase, Users, ClipboardList, CheckCircle, Home, FolderOpen, BarChart2, Image, Video, FileText, Search, ShoppingCart } from 'lucide-react';

// Sample/mock data for demonstration
const courses = [
  {
    id: 1,
    title: 'Introduction to Psychology',
    description: 'Explore the basics of human behavior and mental processes.',
    units: [
      { name: 'History of Psychology', description: 'Study the origins and development of psychology as a science.' },
      { name: 'Research Methods', description: 'Learn about experimental design, surveys, and case studies.' },
      { name: 'Biological Bases of Behavior', description: 'Explore the brain, nervous system, and genetics.' },
      { name: 'Sensation and Perception', description: 'Understand how we sense and interpret the world.' },
      { name: 'Learning and Memory', description: 'Examine how we learn and remember information.' },
    ],
  },
  {
    id: 2,
    title: 'Fundamentals of Computer Science',
    description: 'Learn the core concepts of computer science and programming.',
    units: [
      { name: 'Introduction to Programming', description: 'Basics of programming languages and logic.' },
      { name: 'Data Structures', description: 'Arrays, lists, stacks, queues, and trees.' },
      { name: 'Algorithms', description: 'Sorting, searching, and algorithmic thinking.' },
      { name: 'Computer Architecture', description: 'How computers are built and operate.' },
      { name: 'Software Development', description: 'Principles of building and maintaining software.' },
    ],
  },
  {
    id: 3,
    title: 'Business Management 101',
    description: 'Understand the principles of effective business management.',
    units: [
      { name: 'Organizational Structure', description: 'Types of organizations and their structures.' },
      { name: 'Leadership Styles', description: 'Different approaches to leadership.' },
      { name: 'Marketing Basics', description: 'Fundamentals of marketing and sales.' },
      { name: 'Financial Management', description: 'Managing budgets, expenses, and revenue.' },
      { name: 'Strategic Planning', description: 'Setting goals and planning for the future.' },
    ],
  },
  {
    id: 4,
    title: 'Modern World History',
    description: 'A survey of major events shaping the modern world.',
    units: [
      { name: 'The Enlightenment', description: 'Intellectual movement of the 17th-18th centuries.' },
      { name: 'Industrial Revolution', description: 'Transformation to new manufacturing processes.' },
      { name: 'World Wars', description: 'Causes and effects of WWI and WWII.' },
      { name: 'Cold War Era', description: 'Political tension between East and West.' },
      { name: 'Globalization', description: 'The increasing interconnectedness of the world.' },
    ],
  },
];

const ProgressBar = ({ percent }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
    <div
      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${percent}%` }}
    />
  </div>
);

const CourseCard = ({ course, expanded, onClick, completedUnits, onUnitClick }) => {
  const percent = Math.round((completedUnits.length / course.units.length) * 100);
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 cursor-pointer border-2 ${expanded ? 'border-blue-500' : 'border-transparent'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
        <span className={`ml-2 text-blue-500 text-2xl transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>▶</span>
      </div>
      <p className="text-gray-600 mb-2">{course.description}</p>
      <ProgressBar percent={percent} />
      <p className="text-sm text-gray-500 mb-2">Progress: {completedUnits.length} / {course.units.length} units completed</p>
      {expanded && (
        <ul className="mt-4 list-disc list-inside text-gray-700">
          {course.units.map((unit, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition hover:bg-blue-50 ${completedUnits.includes(idx) ? 'line-through text-green-600' : ''}`}
              onClick={e => { e.stopPropagation(); onUnitClick(idx); }}
            >
              <span className="flex-1">{unit.name}</span>
              {completedUnits.includes(idx) && <span className="text-xs text-green-600">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UnitModal = ({ open, onClose, course, unitIdx }) => {
  if (!open || !course || unitIdx == null) return null;
  const unit = course.units[unitIdx];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2">{unit.name}</h2>
        <p className="mb-4 text-gray-700">{unit.description}</p>
        <h3 className="text-lg font-semibold mb-1">Course Outline</h3>
        <ol className="list-decimal list-inside text-gray-600 mb-4">
          {course.units.map((u, i) => (
            <li key={i} className={i === unitIdx ? 'font-bold text-blue-600' : ''}>{u.name}</li>
          ))}
        </ol>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function MyEducationCompassPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState({}); // { [courseId]: [unitIdx, ...] }
  const [modal, setModal] = useState({ open: false, courseIdx: null, unitIdx: null });

  // Optionally, fetch user from localStorage for topbar (as in other pages)
  React.useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUnitClick = (courseIdx, unitIdx) => {
    setModal({ open: true, courseIdx, unitIdx });
    // Mark as completed
    setCompleted(prev => {
      const courseId = courses[courseIdx].id;
      const prevUnits = prev[courseId] || [];
      if (!prevUnits.includes(unitIdx)) {
        return { ...prev, [courseId]: [...prevUnits, unitIdx] };
      }
      return prev;
    });
  };

  const handleCloseModal = () => {
    setModal({ open: false, courseIdx: null, unitIdx: null });
  };

  return (
    <div className="h-screen flex bg-gray-50 font-serif">
      {/* Main Sidebar */}
      <Sidebar />
      {/* Section Sidebar for Programs */}
      <SectionSidebar
        title="Education Compass"
        items={[
          { name: 'Home', href: '#home', icon: <Home size={18} /> },
          { name: 'Syllabus', href: '#syllabus', icon: <BookOpen size={18} /> },
          { name: 'Modules', href: '#modules', icon: <FolderOpen size={18} /> },
          { name: 'Assignments', href: '#assignments', icon: <ClipboardList size={18} /> },
          { name: 'Quizzes', href: '#quizzes', icon: <CheckCircle size={18} /> },
          { name: 'Grades', href: '#grades', icon: <BarChart2 size={18} /> },
          { name: 'Media Gallery', href: '#media-gallery', icon: <Image size={18} /> },
          { name: 'Zoom', href: '#zoom', icon: <Video size={18} /> },
          { name: 'Course Reader Solutions', href: '#reader-solutions', icon: <FileText size={18} /> },
          { name: 'Library Resources', href: '#library-resources', icon: <BookOpen size={18} /> },
          { name: 'Store Course Materials', href: '#store-materials', icon: <ShoppingCart size={18} /> },
          { name: 'Media Reserves', href: '#media-reserves', icon: <FolderOpen size={18} /> },
          { name: 'Search', href: '#search', icon: <Search size={18} /> },
        ]}
        collapsedDefault={true}
      />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-12 py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">My Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, courseIdx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  expanded={expandedId === course.id}
                  onClick={() => handleExpand(course.id)}
                  completedUnits={completed[course.id] || []}
                  onUnitClick={unitIdx => handleUnitClick(courseIdx, unitIdx)}
                />
              ))}
            </div>
          </div>
        </main>
        <UnitModal
          open={modal.open}
          onClose={handleCloseModal}
          course={modal.courseIdx != null ? courses[modal.courseIdx] : null}
          unitIdx={modal.unitIdx}
        />
      </div>
    </div>
  );
}
