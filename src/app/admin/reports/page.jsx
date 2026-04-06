"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  Download,
  Trash2,
  Zap,
  Loader,
  X,
} from "lucide-react";
import { clientsService } from "../../../services/api/clients.service";
import { sessionsService } from "../../../services/api/sessions.service";
import { ProgramsService } from "../../../services/api/programs.service";
import { cohortService } from "../../../services/api/cohort.service";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateFrom, setDateFrom] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [format, setFormat] = useState("CSV");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [history, setHistory] = useState([
    {
      id: 1,
      name: "Client Enrollment Report - March 2026",
      type: "Client Enrollment",
      dateGenerated: "2026-04-02",
      size: "2.4 MB",
      status: "Ready",
    },
    {
      id: 2,
      name: "Coach Performance Report - Q1 2026",
      type: "Coach Performance",
      dateGenerated: "2026-04-01",
      size: "1.8 MB",
      status: "Ready",
    },
    {
      id: 3,
      name: "Session Summary Report - March 2026",
      type: "Session Summary",
      dateGenerated: "2026-03-31",
      size: "3.1 MB",
      status: "Ready",
    },
  ]);
  const [quickStats, setQuickStats] = useState({
    totalGenerated: 24,
    thisMonth: 7,
    mostPopular: "Client Enrollment",
  });

  const reportTemplates = [
    {
      id: "enrollment",
      title: "Client Enrollment Report",
      description: "Track client enrollments per program and per month",
      icon: Users,
      color: "#002147",
    },
    {
      id: "coach",
      title: "Coach Performance Report",
      description: "Sessions completed, average ratings, and hours coached",
      icon: TrendingUp,
      color: "#002147",
    },
    {
      id: "session",
      title: "Session Summary Report",
      description: "Total sessions by status and date range",
      icon: BarChart3,
      color: "#002147",
    },
    {
      id: "program",
      title: "Program Analytics Report",
      description: "Enrollment trends and completion rates by program",
      icon: Zap,
      color: "#002147",
    },
    {
      id: "financial",
      title: "Financial Summary",
      description: "Revenue and financial metrics (Coming Soon)",
      icon: FileText,
      color: "#ccc",
      disabled: true,
    },
    {
      id: "custom",
      title: "Custom Report Builder",
      description: "Build your own custom report queries (Coming Soon)",
      icon: FileText,
      color: "#ccc",
      disabled: true,
    },
  ];

  useEffect(() => {
    fetchProgramsAndCoaches();
  }, []);

  const fetchProgramsAndCoaches = async () => {
    try {
      const programsData = await ProgramsService.getPrograms();
      setPrograms(programsData || []);

      // Mock coaches data - in real app would fetch from API
      setCoaches([
        { id: 1, name: "John Smith" },
        { id: 2, name: "Sarah Johnson" },
        { id: 3, name: "Michael Brown" },
        { id: 4, name: "Emily Davis" },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    setIsGenerating(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newReport = {
      id: history.length + 1,
      name: `${selectedReport.title} - ${new Date().toLocaleDateString()}`,
      type: selectedReport.title,
      dateGenerated: new Date().toISOString().split("T")[0],
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      status: "Ready",
    };

    setHistory([newReport, ...history]);
    setIsGenerating(false);
    setSelectedReport(null);
    setSelectedProgram("");
    setSelectedCoach("");
  };

  const handleDownload = (reportId) => {
    // Mock download - in real app would trigger file download
    alert(`Downloading report ${reportId}...`);
  };

  const handleDelete = (reportId) => {
    setHistory(history.filter((report) => report.id !== reportId));
  };

  const getReportTemplate = (id) => {
    return reportTemplates.find((template) => template.id === id);
  };

  return (
    <div className="h-screen flex bg-white font-body overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white px-8 py-6 shadow-sm">
          <h1 className="text-3xl font-bold">Reports & Export Center</h1>
          <p className="text-blue-100 mt-1">
            Generate, view, and manage admin reports
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Reports
                    </p>
                    <p className="text-3xl font-bold text-[#002147] mt-2">
                      {quickStats.totalGenerated}
                    </p>
                  </div>
                  <BarChart3
                    className="w-12 h-12 text-[#f97316]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-[#002147] mt-2">
                      {quickStats.thisMonth}
                    </p>
                  </div>
                  <Zap
                    className="w-12 h-12 text-[#f97316]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Most Popular
                    </p>
                    <p className="text-lg font-bold text-[#002147] mt-2">
                      {quickStats.mostPopular}
                    </p>
                  </div>
                  <TrendingUp
                    className="w-12 h-12 text-[#f97316]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Report Templates Grid */}
            <div>
              <h2 className="text-2xl font-bold text-[#002147] mb-4">
                Available Reports
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <div
                      key={template.id}
                      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all ${
                        template.disabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-md hover:border-[#f97316]"
                      }`}
                    >
                      <IconComponent
                        className="w-10 h-10 mb-3"
                        color={template.color}
                        strokeWidth={1.5}
                      />
                      <h3 className="text-lg font-bold text-[#002147] mb-2">
                        {template.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {template.description}
                      </p>
                      <button
                        onClick={() =>
                          !template.disabled && setSelectedReport(template)
                        }
                        disabled={template.disabled}
                        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                          template.disabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#f97316] text-white hover:bg-orange-500"
                        }`}
                      >
                        {template.disabled ? "Coming Soon" : "Generate"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Report Configuration Panel */}
            {selectedReport && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#002147]">
                    Configure {selectedReport.title}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      setSelectedProgram("");
                      setSelectedCoach("");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-semibold text-[#002147] mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#002147] mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-semibold text-[#002147] mb-2">
                      Export Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                    >
                      <option>CSV</option>
                      <option>PDF</option>
                      <option>Excel</option>
                    </select>
                  </div>

                  {/* Conditional Filters */}
                  {(selectedReport.id === "enrollment" ||
                    selectedReport.id === "program") && (
                    <div>
                      <label className="block text-sm font-semibold text-[#002147] mb-2">
                        Program Filter
                      </label>
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                      >
                        <option value="">All Programs</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(selectedReport.id === "coach" ||
                    selectedReport.id === "session") && (
                    <div>
                      <label className="block text-sm font-semibold text-[#002147] mb-2">
                        Coach Filter
                      </label>
                      <select
                        value={selectedCoach}
                        onChange={(e) => setSelectedCoach(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f97316]"
                      >
                        <option value="">All Coaches</option>
                        {coaches.map((coach) => (
                          <option key={coach.id} value={coach.id}>
                            {coach.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex-1 bg-[#f97316] text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating && <Loader className="w-5 h-5 animate-spin" />}
                    {isGenerating ? "Generating..." : "Generate Report"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      setSelectedProgram("");
                      setSelectedCoach("");
                    }}
                    className="flex-1 bg-gray-100 text-[#002147] py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Generated Reports History */}
            <div>
              <h2 className="text-2xl font-bold text-[#002147] mb-4">
                Report History
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {history.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reports generated yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-[#002147]">
                            Report Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-[#002147]">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-[#002147]">
                            Date Generated
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-[#002147]">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-[#002147]">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-[#002147]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {history.map((report) => (
                          <tr
                            key={report.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                              {report.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {report.type}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(report.dateGenerated).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {report.size}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDownload(report.id)}
                                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-[#002147]"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(report.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
