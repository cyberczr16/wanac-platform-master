"use client";
import React from "react";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import SectionSidebar from '../../../../components/dashboardcomponents/SectionSidebar';
import { ClipboardList, HelpCircle, Building2, Users, CheckCircle, Calendar, FolderOpen, Briefcase, FileText } from 'lucide-react';
import { FaBriefcase, FaBuilding, FaUserTie, FaChartLine, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

const careerSections = [
  { name: 'Application Management', href: '#application' },
  { name: 'Employers', href: '/pages/client/mycareercompass/employers' },
  { name: 'Application Materials', href: '/pages/client/mycareercompass/applicationmaterials' },
  { name: 'Interview Questions', href: '#interview' },
  { name: 'Target Employers', href: '#employers' },
  { name: 'Contacts', href: '#contacts' },
  { name: 'Applied', href: '#applied' },
  { name: 'Appointments', href: '#appointments' },
  { name: 'Research Tools', href: '/pages/client/mycareercompass/researchtools' },
  { name: 'AFI and Job Postings', href: '/pages/client/mycareercompass/afijobpostings' },
];

// Career Compass Overview Widget
function CareerCompassOverview() {
  // Mock career data
  const careerData = {
    applications: {
      total: 12,
      thisMonth: 5,
      pending: 8,
      rejected: 3,
      accepted: 1
    },
    interviews: {
      scheduled: 3,
      completed: 2,
      upcoming: 1
    },
    targetEmployers: 8,
    contacts: 15,
    applicationMaterials: {
      resume: true,
      coverLetter: true,
      portfolio: false,
      references: true
    },
    recentActivity: [
      { type: 'application', company: 'Tech Corp', date: '2 days ago', status: 'pending' },
      { type: 'interview', company: 'StartupXYZ', date: '1 week ago', status: 'completed' },
      { type: 'contact', name: 'John Smith', company: 'Google', date: '3 days ago' },
    ]
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-md animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#002147]" style={{ fontFamily: 'var(--font-heading)' }}>
          <FaBriefcase className="text-[#002147]" />
          Career Progress Overview
        </h2>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-[#002147]/5 rounded-lg border border-[#002147]/10">
          <div className="text-2xl font-bold text-[#002147] mb-1">{careerData.applications.total}</div>
          <div className="text-xs text-gray-600">Total Applications</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600 mb-1">{careerData.interviews.scheduled}</div>
          <div className="text-xs text-gray-600">Interviews</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{careerData.targetEmployers}</div>
          <div className="text-xs text-gray-600">Target Companies</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{careerData.contacts}</div>
          <div className="text-xs text-gray-600">Network Contacts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Application Status */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaChartLine className="text-[#002147]" />
            Application Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-3 bg-gray-200 rounded-full">
                  <div className="w-20 h-3 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium w-8 text-right">{careerData.applications.pending}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accepted</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-3 bg-gray-200 rounded-full">
                  <div className="w-2 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium w-8 text-right">{careerData.applications.accepted}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rejected</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-3 bg-gray-200 rounded-full">
                  <div className="w-6 h-3 bg-red-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium w-8 text-right">{careerData.applications.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Materials Status */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="text-[#002147]" />
            Application Materials
          </h3>
          <div className="space-y-2">
            {Object.entries(careerData.applicationMaterials).map(([material, completed]) => (
              <div key={material} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {completed && <FaCheckCircle className="text-white text-xs" />}
                  </div>
                  <span className="text-sm text-gray-700 capitalize font-medium">{material.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {completed ? 'Complete' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function MyCareerCompassPage() {
  return (
    <div className="h-screen flex bg-gray-50 font-serif">
      {/* Main Sidebar */}
      <Sidebar />
      {/* Section Sidebar for Career Management */}
      <SectionSidebar
        title="Career Management"
        items={careerSections}
        collapsedDefault={true}
      />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-12 py-4 bg-gray-50">
          <div className="max-w-6xl mx-auto h-full">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold mb-2 text-[#002147]" style={{ fontFamily: 'var(--font-heading)' }}>
                My Career Compass
              </h1>
              <p className="text-gray-600">Track your career progress and manage your job search journey</p>
            </div>
            
            {/* Career Compass Overview Widget */}
            <div className="mb-4">
              <CareerCompassOverview />
            </div>
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-[#002147]/10 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-[#002147]" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Application Management</h3>
                </div>
                <p className="text-gray-600 text-xs mb-3">Track and manage all your job applications in one place</p>
                <a href="#application" className="text-[#002147] hover:underline text-xs font-medium">
                  Manage Applications →
                </a>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Target Employers</h3>
                </div>
                <p className="text-gray-600 text-xs mb-3">Research and track companies you want to work for</p>
                <a href="#employers" className="text-orange-600 hover:underline text-xs font-medium">
                  View Employers →
                </a>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Network Contacts</h3>
                </div>
                <p className="text-gray-600 text-xs mb-3">Manage your professional network and connections</p>
                <a href="#contacts" className="text-green-600 hover:underline text-xs font-medium">
                  View Contacts →
                </a>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Application Materials</h3>
                </div>
                <p className="text-gray-600 text-xs mb-3">Organize your resume, cover letters, and portfolios</p>
                <a href="/pages/client/mycareercompass/applicationmaterials" className="text-blue-600 hover:underline text-xs font-medium">
                  Manage Materials →
                </a>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Interview Questions</h3>
                </div>
                <p className="text-gray-600 text-xs mb-3">Practice and prepare for common interview questions</p>
                <a href="#interview" className="text-purple-600 hover:underline text-xs font-medium">
                  Practice Questions →
                </a>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Appointments</h3>
                </div>
                <p className="text-gray-600 text-xs mb-3">Schedule and track your career-related appointments</p>
                <a href="#appointments" className="text-yellow-600 hover:underline text-xs font-medium">
                  View Appointments →
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
