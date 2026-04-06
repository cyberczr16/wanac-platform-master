'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, Search, Edit2, Check, X, TrendingUp, Clock, Award,
  MapPin, Target, Briefcase, Code, AlertCircle, Plus, Trash2,
  Download, Share2, BookOpen, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { FaCheckCircle, FaTimes, FaCheck, FaExclamationTriangle, FaStar } from 'react-icons/fa';

// Color coding utility
const getMatchColor = (strength) => {
  if (strength >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100' };
  if (strength >= 60) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100' };
  return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100' };
};

// ─────────────────────────────────────────────────────────────────
// MOS Profile Header Component
// ─────────────────────────────────────────────────────────────────
function MOSProfileHeader({ mos, pathways, onChangeMOS, isEditing, setIsEditing, selectedMOS, setSelectedMOS, mosList, isLoadingMOS }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMOS, setFilteredMOS] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMOS(mosList.slice(0, 15));
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredMOS(
      mosList.filter(m =>
        m.code.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query)
      ).slice(0, 10)
    );
  }, [searchQuery, mosList]);

  if (!mos) {
    return (
      <div className="bg-gradient-to-r from-[#002147] to-blue-900 text-white p-8 rounded-xl shadow-lg">
        <p className="text-center">Loading MOS information...</p>
      </div>
    );
  }

  const topMatch = pathways.length > 0 ? pathways[0].match_strength : 0;

  return (
    <div className="bg-gradient-to-r from-[#002147] to-blue-900 text-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <div className="relative w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search MOS..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-4 py-2 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {isLoadingMOS ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : filteredMOS.length > 0 ? (
                    filteredMOS.map(m => (
                      <button
                        key={m.code}
                        onClick={() => {
                          setSelectedMOS(m.code);
                          onChangeMOS(m.code);
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold">{m.code}</div>
                        <div className="text-sm text-gray-600">{m.title}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No MOS found</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{mos.code}</h1>
                <span className="text-sm font-semibold px-3 py-1 bg-white/20 rounded-full">{mos.branch}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{mos.title}</h2>
              <p className="text-blue-100 max-w-2xl">{mos.description}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 items-start">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-semibold"
            >
              <Edit2 className="w-4 h-4" />
              Change MOS
            </button>
          )}
          {isEditing && (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition font-semibold"
              >
                <Check className="w-4 h-4" />
                Done
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowDropdown(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-2 bg-red-500/30 hover:bg-red-600/40 px-4 py-2 rounded-lg transition font-semibold"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
        <div>
          <div className="text-sm font-semibold text-blue-100 mb-1">Total Pathways</div>
          <div className="text-3xl font-bold">{pathways.length}</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-blue-100 mb-1">Top Match</div>
          <div className="text-3xl font-bold">{topMatch}%</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-blue-100 mb-1">Avg Match</div>
          <div className="text-3xl font-bold">
            {pathways.length > 0 ? Math.round(pathways.reduce((sum, p) => sum + p.match_strength, 0) / pathways.length) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Visual Pathway Map Component
// ─────────────────────────────────────────────────────────────────
function PathwayMap({ pathways, selectedPathway, onSelectPathway }) {
  const nodeRadius = 80;
  const nodeGap = 200;
  const svgHeight = Math.max(300, (pathways.length || 1) * 160);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-x-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Career Pathway Visualization</h3>
      <svg width="100%" height={svgHeight} viewBox={`0 0 1200 ${svgHeight}`} className="min-w-max">
        {/* MOS Source Node */}
        <g>
          <circle cx="80" cy={svgHeight / 2} r={nodeRadius} fill="#002147" stroke="#1e40af" strokeWidth="3" />
          <text x="80" y={svgHeight / 2} textAnchor="middle" dy="0.3em" className="text-sm font-bold fill-white">
            MOS
          </text>
        </g>

        {/* Pathway Nodes */}
        {pathways.map((pathway, idx) => {
          const yPos = (idx + 1) * (svgHeight / (pathways.length + 1));
          const colors = getMatchColor(pathway.match_strength);
          const colorMap = {
            'bg-green-50': '#f0fdf4', 'bg-blue-50': '#f0f9ff', 'bg-amber-50': '#fffbeb',
          };
          const fillColor = colorMap[colors.bg] || '#f0f9ff';

          return (
            <g key={idx}>
              {/* Connector Line */}
              <line
                x1="160" y1={svgHeight / 2}
                x2="300" y2={yPos}
                stroke={pathway.match_strength >= 80 ? '#16a34a' : pathway.match_strength >= 60 ? '#3b82f6' : '#f59e0b'}
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Pathway Node */}
              <g
                onClick={() => onSelectPathway(pathway)}
                style={{ cursor: 'pointer' }}
                className="hover:opacity-80 transition"
              >
                <rect
                  x="300" y={yPos - nodeRadius}
                  width="280" height={nodeRadius * 2}
                  rx="12"
                  fill={fillColor}
                  stroke={pathway.match_strength >= 80 ? '#16a34a' : pathway.match_strength >= 60 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="3"
                />

                {selectedPathway?.civilian_role === pathway.civilian_role && (
                  <rect
                    x="298" y={yPos - nodeRadius - 2}
                    width="284" height={nodeRadius * 2 + 4}
                    rx="14"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                  />
                )}

                <text x="440" y={yPos - 20} textAnchor="middle" className="text-sm font-bold fill-gray-900">
                  {pathway.civilian_role}
                </text>
                <text x="440" y={yPos + 5} textAnchor="middle" className="text-xs fill-gray-600">
                  {pathway.industry}
                </text>
                <text x="440" y={yPos + 25} textAnchor="middle" className="text-lg font-bold fill-gray-900">
                  {pathway.match_strength}% Match
                </text>
              </g>

              {/* Salary Range */}
              <text x="600" y={yPos + 5} className="text-xs fill-gray-600">
                ${Math.round(pathway.salary_range.median / 1000)}k median
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-sm text-gray-600 mt-6 italic">Click any pathway to view detailed information</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Pathway Details Component
// ─────────────────────────────────────────────────────────────────
function PathwayDetails({ pathway }) {
  const [expandedStep, setExpandedStep] = useState(null);
  const colors = getMatchColor(pathway.match_strength);

  if (!pathway) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Select a career pathway to view details</p>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-xl p-8 ${colors.border} ${colors.bg}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{pathway.civilian_role}</h3>
          <p className="text-lg text-gray-600">{pathway.industry}</p>
        </div>
        <div className={`text-center px-6 py-3 rounded-lg ${colors.badge}`}>
          <div className="text-3xl font-bold">{pathway.match_strength}%</div>
          <div className="text-xs font-semibold mt-1">Match Strength</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">Timeline</span>
          </div>
          <p className="font-bold text-lg text-gray-900">{pathway.typical_transition_time}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Growth</span>
          </div>
          <p className="font-bold text-lg text-gray-900">{pathway.growth_outlook}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-semibold">Salary</span>
          </div>
          <p className="font-bold text-lg text-gray-900">${Math.round(pathway.salary_range.median / 1000)}k median</p>
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Skills Assessment</h4>
        <div className="space-y-3">
          {pathway.required_skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
              {skill.has ? (
                <FaCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              <span className={`font-semibold flex-1 ${skill.has ? 'text-gray-900' : 'text-amber-900'}`}>
                {skill.name}
              </span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${skill.has ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {skill.has ? 'Have' : 'Need'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range Visualization */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Salary Range</h4>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="relative h-12 bg-gradient-to-r from-red-200 to-green-200 rounded-full mb-4 flex items-center">
            <div className="absolute flex items-center" style={{ left: `${(pathway.salary_range.low / pathway.salary_range.high) * 100}%` }}>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-700 whitespace-nowrap">Low</div>
              </div>
            </div>
            <div className="absolute flex items-center" style={{ left: `${(pathway.salary_range.median / pathway.salary_range.high) * 100}%` }}>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-900 whitespace-nowrap">Median</div>
              </div>
            </div>
            <div className="absolute right-2 flex items-center">
              <div className="text-center">
                <div className="text-xs font-bold text-gray-700 whitespace-nowrap">High</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Minimum</p>
              <p className="text-2xl font-bold text-gray-900">${(pathway.salary_range.low / 1000).toFixed(0)}k</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Median</p>
              <p className="text-2xl font-bold text-blue-600">${(pathway.salary_range.median / 1000).toFixed(0)}k</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Maximum</p>
              <p className="text-2xl font-bold text-gray-900">${(pathway.salary_range.high / 1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {pathway.recommended_certifications.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Recommended Certifications</h4>
          <div className="flex flex-wrap gap-2">
            {pathway.recommended_certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full font-semibold">
                <Award className="w-4 h-4" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps to Transition */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">Transition Roadmap</h4>
        <div className="space-y-2">
          {pathway.steps.map((step, idx) => (
            <div key={idx}>
              <button
                onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#002147] text-white rounded-full flex items-center justify-center font-bold">
                    {step.order}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{step.action}</p>
                    <p className="text-sm text-gray-600">{step.estimated_time}</p>
                  </div>
                </div>
                {expandedStep === idx ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
              </button>
              {expandedStep === idx && (
                <div className="bg-gray-50 border border-gray-200 border-t-0 p-4 text-gray-700">
                  {step.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Career Goals Panel Component
// ─────────────────────────────────────────────────────────────────
function CareerGoalsPanel({ goals, onSaveGoals, isLoading }) {
  const [targetRoles, setTargetRoles] = useState(goals.targetRoles || []);
  const [newRole, setNewRole] = useState('');
  const [industries, setIndustries] = useState(goals.preferredIndustries || []);
  const [newIndustry, setNewIndustry] = useState('');
  const [locations, setLocations] = useState(goals.locationPreferences || []);
  const [newLocation, setNewLocation] = useState('');
  const [timeline, setTimeline] = useState(goals.timeline || '');

  const handleSave = () => {
    onSaveGoals({
      targetRoles,
      preferredIndustries: industries,
      locationPreferences: locations,
      timeline,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Career Goals
        </h4>

        {/* Target Roles */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target Roles</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newRole.trim()) {
                  setTargetRoles([...targetRoles, newRole]);
                  setNewRole('');
                }
              }}
              placeholder="Add a role and press Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                if (newRole.trim()) {
                  setTargetRoles([...targetRoles, newRole]);
                  setNewRole('');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {targetRoles.map((role, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm">
                {role}
                <button onClick={() => setTargetRoles(targetRoles.filter((_, i) => i !== idx))} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Industries */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Industries</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newIndustry.trim()) {
                  setIndustries([...industries, newIndustry]);
                  setNewIndustry('');
                }
              }}
              placeholder="Add an industry and press Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                if (newIndustry.trim()) {
                  setIndustries([...industries, newIndustry]);
                  setNewIndustry('');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map((ind, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm">
                {ind}
                <button onClick={() => setIndustries(industries.filter((_, i) => i !== idx))} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location Preferences */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location Preferences</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newLocation.trim()) {
                  setLocations([...locations, newLocation]);
                  setNewLocation('');
                }
              }}
              placeholder="Add a location and press Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                if (newLocation.trim()) {
                  setLocations([...locations, newLocation]);
                  setNewLocation('');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-sm">
                {loc}
                <button onClick={() => setLocations(locations.filter((_, i) => i !== idx))} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Transition Timeline</label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select timeline</option>
            <option value="3-6 months">3-6 Months</option>
            <option value="6-12 months">6-12 Months</option>
            <option value="12-18 months">12-18 Months</option>
            <option value="18+ months">18+ Months</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-[#002147] text-white py-3 rounded-lg hover:bg-blue-900 font-semibold disabled:opacity-50 transition"
        >
          {isLoading ? 'Saving...' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Skills Gap Analysis Component
// ─────────────────────────────────────────────────────────────────
function SkillsGapAnalysis({ pathway, allPathways }) {
  if (!pathway) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
        <Code className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Select a pathway to view skills gap analysis</p>
      </div>
    );
  }

  const skillsNeeded = pathway.required_skills.filter(s => !s.has);
  const skillsHave = pathway.required_skills.filter(s => s.has);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h4 className="text-lg font-bold text-gray-900 mb-6">Skills Gap Analysis</h4>

      <div className="grid grid-cols-2 gap-6">
        {/* Skills You Have */}
        <div>
          <h5 className="font-bold text-green-700 mb-4 flex items-center gap-2">
            <FaCheck className="w-4 h-4" />
            Your Strengths ({skillsHave.length})
          </h5>
          <div className="space-y-2">
            {skillsHave.map((skill, idx) => (
              <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-semibold text-green-900">{skill.name}</p>
                <p className="text-xs text-green-700 mt-1">From military experience</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills to Develop */}
        <div>
          <h5 className="font-bold text-amber-700 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="w-4 h-4" />
            Skills to Develop ({skillsNeeded.length})
          </h5>
          <div className="space-y-2">
            {skillsNeeded.map((skill, idx) => (
              <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold text-amber-900">{skill.name}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded font-semibold">Recommended Action</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">Find Course</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Gap Score */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700 font-semibold mb-2">Skills Readiness</p>
        <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${(skillsHave.length / pathway.required_skills.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-blue-700 mt-2">
          {skillsHave.length} of {pathway.required_skills.length} skills mastered ({Math.round((skillsHave.length / pathway.required_skills.length) * 100)}%)
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────
function CareerPathwayPage() {
  const [selectedMOS, setSelectedMOS] = useState('25B');
  const [mosData, setMosData] = useState(null);
  const [mosList, setMosList] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [goals, setGoals] = useState({ targetRoles: [], preferredIndustries: [], locationPreferences: [], timeline: null });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMOS, setLoadingMOS] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [error, setError] = useState(null);

  // Fetch MOS database
  useEffect(() => {
    const fetchMOSDatabase = async () => {
      try {
        setLoadingMOS(true);
        const res = await fetch('/api/career-compass/pathway/mos-database');
        if (!res.ok) throw new Error('Failed to fetch MOS database');
        const data = await res.json();
        setMosList(data.mos_codes || []);
      } catch (err) {
        console.error('Error fetching MOS database:', err);
      } finally {
        setLoadingMOS(false);
      }
    };
    fetchMOSDatabase();
  }, []);

  // Fetch pathway data
  useEffect(() => {
    const fetchPathwayData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/career-compass/pathway?mos=${selectedMOS}`);
        if (!res.ok) throw new Error('Failed to fetch pathway data');
        const data = await res.json();
        setMosData(data);
        setSelectedPathway(data.pathways[0] || null);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPathwayData();
  }, [selectedMOS]);

  // Fetch career goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch('/api/career-compass/pathway/goals');
        if (res.ok) {
          const data = await res.json();
          setGoals(data);
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
      }
    };
    fetchGoals();
  }, []);

  const handleSaveGoals = async (newGoals) => {
    try {
      setSavingGoals(true);
      const res = await fetch('/api/career-compass/pathway/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoals),
      });
      if (!res.ok) throw new Error('Failed to save goals');
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error('Error saving goals:', err);
    } finally {
      setSavingGoals(false);
    }
  };

  const handleChangeMOS = (mosCode) => {
    setSelectedMOS(mosCode);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
        <p className="mt-4 text-gray-600">Loading career pathway data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Pathway Visualization</h1>
        <p className="text-lg text-gray-600">Discover how your military experience maps to civilian career opportunities</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* MOS Profile Header */}
      {mosData && (
        <MOSProfileHeader
          mos={mosData.mos}
          pathways={mosData.pathways}
          onChangeMOS={handleChangeMOS}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          selectedMOS={selectedMOS}
          setSelectedMOS={setSelectedMOS}
          mosList={mosList}
          isLoadingMOS={loadingMOS}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visualization */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pathway Map */}
          {mosData && (
            <PathwayMap
              pathways={mosData.pathways}
              selectedPathway={selectedPathway}
              onSelectPathway={setSelectedPathway}
            />
          )}

          {/* Pathway Details */}
          <PathwayDetails pathway={selectedPathway} />
        </div>

        {/* Right Column: Goals and Analysis */}
        <div className="space-y-8">
          {/* Career Goals Panel */}
          <CareerGoalsPanel
            goals={goals}
            onSaveGoals={handleSaveGoals}
            isLoading={savingGoals}
          />

          {/* Skills Gap Analysis */}
          <SkillsGapAnalysis pathway={selectedPathway} allPathways={mosData?.pathways} />
        </div>
      </div>
    </div>
  );
}

// Missing icon import - add this utility
function DollarSign({ className }) {
  return <span className={className}>$</span>;
}

export default CareerPathwayPage;
