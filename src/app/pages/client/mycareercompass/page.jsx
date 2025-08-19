"use client";
import React from "react";
import Sidebar from '../../../../../components/dashboardcomponents/sidebar';
import SectionSidebar from '../../../../../components/dashboardcomponents/SectionSidebar';
import { ClipboardList, HelpCircle, Building2, Users, CheckCircle, Calendar, FolderOpen, Briefcase } from 'lucide-react';

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
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-12 py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">My Career Compass</h1>
            <div className="text-gray-600 text-center">Select a section from the sidebar to get started.</div>
          </div>
        </main>
      </div>
    </div>
  );
}
