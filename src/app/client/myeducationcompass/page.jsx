"use client";

import React, { useState } from 'react';
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import SectionSidebar from '../../../../components/dashboardcomponents/SectionSidebar';
import { BookOpen, Briefcase, Users, ClipboardList, CheckCircle, Home, FolderOpen, BarChart2, Image, Video, FileText, Search, ShoppingCart, Calendar, Clock, Play, Download, Upload, Star, Award, Target, TrendingUp } from 'lucide-react';

// Comprehensive program data with sessions and modules
const program = {
  id: 1,
  title: 'PLEP',
  duration: '1 Years',
  currentSemester: 'Semester 1',
  totalCredits: 120,
  completedCredits: 45,
  gpa: 3.7,
  modules: [
  {
    id: 1,
      title: 'PLEP',
      code: 'CS101',
      credits: 3,
      status: 'completed',
      progress: 100,
      sessions: [
        { id: 1, title: 'Introduction to Programming', date: '2024-01-15', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 2, title: 'Variables and Data Types', date: '2024-01-22', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 3, title: 'Control Structures', date: '2024-01-29', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 4, title: 'Functions and Methods', date: '2024-02-05', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 5, title: 'Lab Session - Basic Programs', date: '2024-02-12', duration: '3 hours', type: 'lab', status: 'completed' }
      ],
      assignments: [
        { id: 1, title: 'Hello World Program', dueDate: '2024-01-20', points: 10, status: 'submitted', grade: 95 },
        { id: 2, title: 'Calculator Application', dueDate: '2024-02-10', points: 25, status: 'submitted', grade: 88 },
        { id: 3, title: 'Student Grade Tracker', dueDate: '2024-02-25', points: 30, status: 'submitted', grade: 92 }
      ]
  },
  {
    id: 2,
      title: 'Data Structures and Algorithms',
      code: 'CS201',
      credits: 4,
      status: 'in-progress',
      progress: 65,
      sessions: [
        { id: 6, title: 'Introduction to Data Structures', date: '2024-02-15', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 7, title: 'Arrays and Linked Lists', date: '2024-02-22', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 8, title: 'Stacks and Queues', date: '2024-02-29', duration: '2 hours', type: 'lecture', status: 'completed' },
        { id: 9, title: 'Trees and Graphs', date: '2024-03-07', duration: '2 hours', type: 'lecture', status: 'upcoming' },
        { id: 10, title: 'Lab Session - Implementation', date: '2024-03-14', duration: '3 hours', type: 'lab', status: 'upcoming' }
      ],
      assignments: [
        { id: 4, title: 'Array Implementation', dueDate: '2024-02-28', points: 20, status: 'submitted', grade: 90 },
        { id: 5, title: 'Linked List Operations', dueDate: '2024-03-12', points: 25, status: 'in-progress', grade: null },
        { id: 6, title: 'Tree Traversal Algorithms', dueDate: '2024-03-25', points: 30, status: 'pending', grade: null }
      ]
  },
  {
    id: 3,
      title: 'Database Systems',
      code: 'CS301',
      credits: 3,
      status: 'upcoming',
      progress: 0,
      sessions: [
        { id: 11, title: 'Introduction to Databases', date: '2024-03-20', duration: '2 hours', type: 'lecture', status: 'upcoming' },
        { id: 12, title: 'SQL Fundamentals', date: '2024-03-27', duration: '2 hours', type: 'lecture', status: 'upcoming' },
        { id: 13, title: 'Database Design', date: '2024-04-03', duration: '2 hours', type: 'lecture', status: 'upcoming' },
        { id: 14, title: 'Lab Session - SQL Practice', date: '2024-04-10', duration: '3 hours', type: 'lab', status: 'upcoming' }
      ],
      assignments: [
        { id: 7, title: 'Database Schema Design', dueDate: '2024-04-15', points: 25, status: 'pending', grade: null },
        { id: 8, title: 'SQL Query Implementation', dueDate: '2024-04-30', points: 30, status: 'pending', grade: null }
      ]
    }
  ],
  upcomingSessions: [
    { id: 9, title: 'Trees and Graphs', module: 'Data Structures and Algorithms', date: '2024-03-07', time: '10:00 AM', type: 'lecture' },
    { id: 10, title: 'Lab Session - Implementation', module: 'Data Structures and Algorithms', date: '2024-03-14', time: '2:00 PM', type: 'lab' },
    { id: 11, title: 'Introduction to Databases', module: 'Database Systems', date: '2024-03-20', time: '10:00 AM', type: 'lecture' }
  ],
  recentActivity: [
    { id: 1, title: 'Submitted: Calculator Application', module: 'Programming Fundamentals', time: '2 hours ago', type: 'assignment' },
    { id: 2, title: 'Attended: Control Structures Lecture', module: 'Programming Fundamentals', time: '1 day ago', type: 'session' },
    { id: 3, title: 'Graded: Hello World Program', module: 'Programming Fundamentals', time: '2 days ago', type: 'grade' }
  ]
};

// Progress Bar Component
const ProgressBar = ({ percent, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

// Program Overview Component
const ProgramOverview = ({ program }) => {
  const overallProgress = Math.round((program.completedCredits / program.totalCredits) * 100);
  
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-md mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#002147]" style={{ fontFamily: 'var(--font-heading)' }}>
          {program.title}
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">{program.currentSemester}</div>
          <div className="text-xs text-gray-500">{program.duration}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
          <div className="text-2xl font-bold text-[#002147]">{program.completedCredits}</div>
          <div className="text-xs text-gray-600">Credits Completed</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{program.gpa}</div>
          <div className="text-xs text-gray-600">Current GPA</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{program.modules.length}</div>
          <div className="text-xs text-gray-600">Active Modules</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{program.upcomingSessions.length}</div>
          <div className="text-xs text-gray-600">Upcoming Sessions</div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{overallProgress}%</span>
        </div>
        <ProgressBar percent={overallProgress} color="blue" />
      </div>
    </div>
  );
};

// Module Card Component
const ModuleCard = ({ module, expanded, onToggle }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
            <span className="text-sm text-gray-500">({module.code})</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{module.credits} Credits</span>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(module.status)}`}>
              {module.status.replace('-', ' ')}
            </span>
          </div>
        </div>
        <button
          onClick={() => onToggle(module.id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className={`text-[#002147] text-xl transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>▶</span>
        </button>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Module Progress</span>
          <span>{module.progress}%</span>
        </div>
        <ProgressBar percent={module.progress} color={module.status === 'completed' ? 'green' : 'blue'} />
      </div>
      
      {expanded && (
        <div className="space-y-4">
          {/* Sessions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sessions ({module.sessions.length})
            </h4>
            <div className="space-y-2">
              {module.sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      session.status === 'completed' ? 'bg-green-500' : 
                      session.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{session.title}</div>
                      <div className="text-xs text-gray-500">{session.date} • {session.duration}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {session.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Assignments */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Assignments ({module.assignments.length})
            </h4>
            <div className="space-y-2">
              {module.assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      assignment.status === 'submitted' ? 'bg-green-500' : 
                      assignment.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{assignment.title}</div>
                      <div className="text-xs text-gray-500">Due: {assignment.dueDate} • {assignment.points} points</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {assignment.grade ? (
                      <span className="text-sm font-semibold text-green-600">{assignment.grade}%</span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === 'submitted' ? 'bg-green-100 text-green-700' :
                        assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {assignment.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MyEducationCompassPage() {
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user from localStorage for topbar
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

  const handleModuleToggle = (moduleId) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
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
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-8 py-4 bg-gray-50">
          <div className="max-w-7xl mx-auto h-full">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold mb-2 text-[#002147]" style={{ fontFamily: 'var(--font-heading)' }}>
                My Education Compass
              </h1>
              <p className="text-gray-600">Track your academic progress and manage your learning journey</p>
            </div>
            
            {/* Program Overview */}
            <ProgramOverview program={program} />
            
            {/* Canvas-like Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Main Content - Modules */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-[#002147]" />
                    Course Modules
                  </h2>
                  <span className="text-sm text-gray-500">{program.modules.length} modules</span>
                </div>
                
                <div className="space-y-3">
                  {program.modules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      expanded={expandedModuleId === module.id}
                      onToggle={handleModuleToggle}
                    />
                  ))}
                </div>
              </div>
              
              {/* Sidebar - Upcoming Sessions & Activity */}
              <div className="space-y-4">
                {/* Upcoming Sessions */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#002147]" />
                    Upcoming Sessions
                  </h3>
                  <div className="space-y-3">
                    {program.upcomingSessions.map((session) => (
                      <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{session.title}</div>
                            <div className="text-xs text-gray-500">{session.module}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{session.date}</span>
                          <span>{session.time}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            session.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {session.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#002147]" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {program.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'assignment' ? 'bg-green-500' : 
                          activity.type === 'session' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800">{activity.title}</div>
                          <div className="text-xs text-gray-500">{activity.module} • {activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#002147]" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed Modules</span>
                      <span className="text-sm font-semibold text-green-600">
                        {program.modules.filter(m => m.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {program.modules.filter(m => m.status === 'in-progress').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Upcoming</span>
                      <span className="text-sm font-semibold text-gray-600">
                        {program.modules.filter(m => m.status === 'upcoming').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Assignments</span>
                      <span className="text-sm font-semibold text-[#002147]">
                        {program.modules.reduce((acc, module) => acc + module.assignments.length, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
