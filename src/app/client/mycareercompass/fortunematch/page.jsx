"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaBrain,
  FaCheckCircle,
  FaInfoCircle,
  FaPlus,
  FaTimes,
  FaBell,
  FaFilter,
  FaArrowRight,
} from "react-icons/fa";
import {
  TrendingUp,
  AlertCircle,
  Search,
  Zap,
  Award,
  MapPin,
  DollarSign,
} from "lucide-react";

const FIT_SCORE_COLOR = {
  high: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", ring: "ring-green-400" },
  medium: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", ring: "ring-blue-400" },
  low: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", ring: "ring-amber-400" },
};

function getFitScoreCategory(score) {
  if (score >= 87) return "high";
  if (score >= 70) return "medium";
  return "low";
}

function FitScoreBadge({ score }) {
  const category = getFitScoreCategory(score);
  const colors = FIT_SCORE_COLOR[category];
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="60" height="60" className="transform -rotate-90">
        <circle
          cx="30"
          cy="30"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-200"
        />
        <circle
          cx="30"
          cy="30"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={colors.text}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${colors.text}`}>{score}%</span>
    </div>
  );
}

function StatCard({ label, value, subtext, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-[#002147] mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        {Icon && <Icon className="text-[#002147] text-xl opacity-50" />}
      </div>
    </div>
  );
}

function MatchReasonTag({ reason }) {
  return (
    <span className="inline-block px-2 py-1 bg-[#002147]/10 text-[#002147] text-xs rounded-full font-medium">
      {reason}
    </span>
  );
}

function MatchCard({ job, onApply, onSave }) {
  const category = getFitScoreCategory(job.fit_score);
  const colors = FIT_SCORE_COLOR[category];

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-4 md:p-5 shadow-sm hover:shadow-md transition-all ${colors.bg}`}>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{job.job_title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} />
              {job.salary_range}
            </div>
          </div>

          <div className="mb-3 space-y-2">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Match Reasons:</p>
            <div className="flex flex-wrap gap-2">
              {job.match_reasons.map((reason, i) => (
                <MatchReasonTag key={i} reason={reason} />
              ))}
            </div>
          </div>

          {job.recommended_actions && job.recommended_actions.length > 0 && (
            <div className="mb-3 space-y-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recommended Actions:</p>
              <ul className="space-y-1">
                {job.recommended_actions.map((action, i) => (
                  <li key={i} className="text-xs text-gray-700 flex gap-2">
                    <span className="text-[#002147] font-bold">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-6">
          <FitScoreBadge score={job.fit_score} />
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => onApply(job.id)}
              className="px-4 py-2 bg-[#002147] text-white rounded-lg text-sm font-medium hover:bg-[#001a33] transition-colors whitespace-nowrap"
            >
              Apply
            </button>
            <button
              onClick={() => onSave(job.id)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillTranslationCard({ skill }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <FaArrowRight className="text-[#002147] mt-1 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{skill.military_skill}</p>
          <p className="text-sm text-gray-600 mt-1">{skill.civilian_equivalent}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Confidence</span>
          <span className="text-xs font-semibold text-[#002147]">{Math.round(skill.confidence * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#002147] h-2 rounded-full transition-all"
            style={{ width: `${skill.confidence * 100}%` }}
          ></div>
        </div>
      </div>

      {skill.related_roles && skill.related_roles.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Related Roles:</p>
          <div className="flex flex-wrap gap-1">
            {skill.related_roles.slice(0, 3).map((role, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {role}
              </span>
            ))}
            {skill.related_roles.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                +{skill.related_roles.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AlertItem({ alert, onMarkRead, onDismiss }) {
  return (
    <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm hover:shadow-md transition-shadow bg-amber-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-amber-600" />
            <h4 className="font-semibold text-gray-900">{alert.job_title}</h4>
          </div>
          <p className="text-sm text-gray-700 mb-2">{alert.company}</p>
          <div className="flex items-center gap-2">
            <FitScoreBadge score={alert.fit_score} />
            <span className="text-sm font-semibold text-amber-700">High Match Alert</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {!alert.read && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors"
              title="Mark as read"
            >
              <FaCheckCircle size={18} />
            </button>
          )}
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
            title="Dismiss"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FortuneMatchPage() {
  const [jobs, setJobs] = useState([]);
  const [skillTranslations, setSkillTranslations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter and sort states
  const [minScore, setMinScore] = useState(0);
  const [location, setLocation] = useState("");
  const [roleType, setRoleType] = useState("");
  const [sortBy, setSortBy] = useState("fit_score");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ military_skill: "", civilian_equivalent: "", confidence: 0.75 });
  const [skillError, setSkillError] = useState("");

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsRes, skillsRes, alertsRes] = await Promise.all([
          fetch("/api/career-compass/fortunematch?minScore=0&limit=10"),
          fetch("/api/career-compass/fortunematch/skill-translation"),
          fetch("/api/career-compass/fortunematch/alerts"),
        ]);

        const jobsData = await jobsRes.json();
        const skillsData = await skillsRes.json();
        const alertsData = await alertsRes.json();

        if (jobsData.success) setJobs(jobsData.data);
        if (skillsData.success) setSkillTranslations(skillsData.data);
        if (alertsData.success) setAlerts(alertsData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered and sorted jobs
  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (minScore > 0) {
      result = result.filter(job => job.fit_score >= minScore);
    }
    if (location) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (roleType) {
      result = result.filter(job =>
        job.job_title.toLowerCase().includes(roleType.toLowerCase()) ||
        job.description?.toLowerCase().includes(roleType.toLowerCase())
      );
    }
    if (searchQuery) {
      result = result.filter(job =>
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "fit_score") {
      result.sort((a, b) => b.fit_score - a.fit_score);
    } else if (sortBy === "salary") {
      result.sort((a, b) => {
        const aMin = parseInt(a.salary_range?.split("-")[0]?.replace(/[^\d]/g, "") || "0");
        const bMin = parseInt(b.salary_range?.split("-")[0]?.replace(/[^\d]/g, "") || "0");
        return bMin - aMin;
      });
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    }

    return result;
  }, [jobs, minScore, location, roleType, searchQuery, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      highFit: jobs.filter(j => j.fit_score >= 87).length,
      newThisWeek: jobs.filter(j => {
        const postedDate = new Date(j.posted_date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return postedDate >= weekAgo;
      }).length,
      applied: 0, // Mock value - would come from actual applied jobs
    };
  }, [jobs]);

  // Distribution chart data
  const distributionData = useMemo(() => {
    return [
      { range: "87%+", count: jobs.filter(j => j.fit_score >= 87).length, color: "bg-green-500" },
      { range: "70-86%", count: jobs.filter(j => j.fit_score >= 70 && j.fit_score < 87).length, color: "bg-blue-500" },
      { range: "Below 70%", count: jobs.filter(j => j.fit_score < 70).length, color: "bg-amber-500" },
    ];
  }, [jobs]);

  const maxDistribution = Math.max(...distributionData.map(d => d.count), 1);

  // Handlers
  const handleApply = useCallback((jobId) => {
    alert(`Applied to job ID: ${jobId}`);
  }, []);

  const handleSave = useCallback((jobId) => {
    alert(`Saved job ID: ${jobId}`);
  }, []);

  const handleAddSkill = useCallback(async () => {
    if (!newSkill.military_skill.trim() || !newSkill.civilian_equivalent.trim()) {
      setSkillError("Both skill fields are required");
      return;
    }

    try {
      const res = await fetch("/api/career-compass/fortunematch/skill-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });

      const data = await res.json();
      if (data.success) {
        setSkillTranslations([...skillTranslations, data.data]);
        setNewSkill({ military_skill: "", civilian_equivalent: "", confidence: 0.75 });
        setShowAddSkillModal(false);
        setSkillError("");
      } else {
        setSkillError(data.error || "Failed to add skill");
      }
    } catch (err) {
      setSkillError(err.message);
    }
  }, [newSkill, skillTranslations]);

  const handleMarkAlertRead = useCallback(async (alertId) => {
    try {
      const res = await fetch("/api/career-compass/fortunematch/alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: alertId, read: true }),
      });

      const data = await res.json();
      if (data.success) {
        setAlerts(alerts.map(a => (a.id === alertId ? { ...a, read: true } : a)));
      }
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  }, [alerts]);

  const handleDismissAlert = useCallback(async (alertId) => {
    try {
      const res = await fetch("/api/career-compass/fortunematch/alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: alertId, dismissed: true }),
      });

      const data = await res.json();
      if (data.success) {
        setAlerts(alerts.filter(a => a.id !== alertId));
      }
    } catch (err) {
      console.error("Error dismissing alert:", err);
    }
  }, [alerts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147] mb-4"></div>
          <p className="text-gray-600">Loading your AI matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">Error loading FortuneMatch data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <FaBrain className="text-[#002147] text-2xl" />
          <h1 className="text-3xl font-bold text-[#002147]" style={{ fontFamily: "var(--font-heading)" }}>
            FortuneMatch AI
          </h1>
        </div>
        <p className="text-gray-600">AI-powered job matching powered by your military background and skills</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Matches" value={stats.total} icon={TrendingUp} />
        <StatCard label="High Fit (87%+)" value={stats.highFit} icon={Award} />
        <StatCard label="New This Week" value={stats.newThisWeek} subtext="Based on latest matches" icon={Zap} />
        <StatCard label="Applied" value={stats.applied} icon={FaCheckCircle} />
      </div>

      {/* Match Quality Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] mb-4">Match Quality Distribution</h2>
        <div className="space-y-3">
          {distributionData.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.range}</span>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all`}
                  style={{ width: `${(item.count / maxDistribution) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Alerts Panel */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FaBell className="text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">High-Match Alerts</h2>
            <span className="ml-auto inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-semibold">
              {alerts.filter(a => !a.read).length} new
            </span>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onMarkRead={handleMarkAlertRead}
                onDismiss={handleDismissAlert}
              />
            ))}
          </div>
        </div>
      )}

      {/* Matched Opportunities Feed */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] mb-4">Matched Opportunities</h2>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Min Score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]"
            >
              <option value={0}>All scores</option>
              <option value={70}>70%+</option>
              <option value={87}>87%+ (High)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Location</label>
            <input
              type="text"
                placeholder="City or state..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]"
            >
              <option value="fit_score">Fit Score (High to Low)</option>
              <option value="salary">Salary (High to Low)</option>
              <option value="date">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <MatchCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onSave={handleSave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFilter className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">No jobs match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>

      {/* Skill Translation Engine */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#002147]">Skill Translation Engine</h2>
          <button
            onClick={() => setShowAddSkillModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#002147] text-white rounded-lg text-sm font-medium hover:bg-[#001a33] transition-colors"
          >
            <FaPlus size={14} />
            Add Custom Skill
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Military skills mapped to civilian equivalents with confidence ratings
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillTranslations.map(skill => (
            <SkillTranslationCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>

      {/* Add Custom Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Custom Skill Translation</h3>
              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setSkillError("");
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes size={20} className="text-gray-500" />
              </button>
            </div>

            {skillError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {skillError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Military Skill
                </label>
                <input
                  type="text"
                  placeholder="E.g., Leadership & Command"
                  value={newSkill.military_skill}
                  onChange={(e) => setNewSkill({ ...newSkill, military_skill: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Civilian Equivalent
                </label>
                <input
                  type="text"
                  placeholder="E.g., Project Management"
                  value={newSkill.civilian_equivalent}
                  onChange={(e) => setNewSkill({ ...newSkill, civilian_equivalent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level: {Math.round(newSkill.confidence * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.confidence * 100}
                  onChange={(e) => setNewSkill({ ...newSkill, confidence: parseInt(e.target.value) / 100 })}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddSkillModal(false);
                    setSkillError("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSkill}
                  className="flex-1 px-4 py-2 bg-[#002147] text-white rounded-lg font-medium hover:bg-[#001a33] transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
