"use client";

import React, { useState, useMemo } from "react";
import {
  FaBriefcase, FaMapMarkerAlt, FaCalendar, FaExternalLinkAlt,
  FaBookmark, FaRegBookmark, FaClock, FaFilter
} from "react-icons/fa";
import { Search, Briefcase } from "lucide-react";

const ALL_POSTINGS = [
  {
    id: 1, title: "Software Engineer", org: "Tech Corp", location: "Remote",
    date: "Jan 22, 2025", type: "Full-Time", salary: "$95k – $130k",
    tags: ["Engineering", "Backend", "Python"],
    description: "Join our platform engineering team building scalable microservices.",
    isNew: true,
  },
  {
    id: 2, title: "Full Stack Developer", org: "StartupXYZ", location: "San Francisco, CA",
    date: "Jan 18, 2025", type: "Full-Time", salary: "$110k – $150k",
    tags: ["Engineering", "React", "Node.js"],
    description: "Build product features end-to-end in a fast-paced startup environment.",
    isNew: true,
  },
  {
    id: 3, title: "Veteran Talent Program — Engineering", org: "Acme Industries", location: "Chicago, IL",
    date: "Jan 15, 2025", type: "Full-Time", salary: "$80k – $100k",
    tags: ["Veteran", "Engineering", "Entry-Level"],
    description: "Dedicated veteran hiring program for engineers transitioning from military service.",
    isNew: false,
  },
  {
    id: 4, title: "DevOps Engineer", org: "CloudNine", location: "Remote",
    date: "Jan 12, 2025", type: "Contract", salary: "$70/hr",
    tags: ["DevOps", "AWS", "Kubernetes"],
    description: "Lead CI/CD pipeline modernization for enterprise cloud infrastructure.",
    isNew: false,
  },
  {
    id: 5, title: "Data Analyst", org: "DataFlow Inc", location: "Austin, TX",
    date: "Jan 10, 2025", type: "Full-Time", salary: "$75k – $95k",
    tags: ["Analytics", "SQL", "Python"],
    description: "Turn data into actionable insights for our growing product and sales teams.",
    isNew: false,
  },
  {
    id: 6, title: "Transition Support Manager", org: "Global Solutions Inc", location: "Washington, DC",
    date: "Jan 8, 2025", type: "Part-Time", salary: "$45k – $55k",
    tags: ["Management", "Veteran", "Support"],
    description: "Support veterans and transitioning service members entering the civilian workforce.",
    isNew: false,
  },
];

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract"];
const TYPE_STYLE = {
  "Full-Time": "bg-blue-100 text-blue-700",
  "Part-Time":  "bg-purple-100 text-purple-700",
  "Contract":   "bg-amber-100 text-amber-700",
};

const ALL_TAGS = [...new Set(ALL_POSTINGS.flatMap((p) => p.tags))].sort();

export default function AFIAndJobPostingPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [saved, setSaved] = useState(new Set());
  const [tagFilter, setTagFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return ALL_POSTINGS.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.org.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      const matchesType = typeFilter === "All" || p.type === typeFilter;
      const matchesTag = tagFilter === "All" || p.tags.includes(tagFilter);
      return matchesSearch && matchesType && matchesTag;
    });
  }, [search, typeFilter, tagFilter]);

  const savedCount = saved.size;
  const newCount = ALL_POSTINGS.filter((p) => p.isNew).length;

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <FaBriefcase className="text-[#002147]" />
            AFI & Job Postings
          </h2>
          <div className="flex items-center gap-2">
            {savedCount > 0 && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                {savedCount} saved
              </span>
            )}
            {newCount > 0 && (
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                {newCount} new
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-5">Job postings and opportunities from AFI and partner employers.</p>

        {/* Search + Filters */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title, company, or location…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Type filter */}
            <div className="flex gap-1.5 flex-wrap">
              {["All", ...JOB_TYPES].map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    typeFilter === t ? "bg-[#002147] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-gray-200 self-center hidden sm:block" />
            {/* Tag filter */}
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Veteran", "Remote", "Engineering"].map((tag) => (
                <button key={tag} onClick={() => setTagFilter(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    tagFilter === tag ? "bg-[#002147]/10 text-[#002147]" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-3">
          Showing {filtered.length} of {ALL_POSTINGS.length} postings
        </p>

        {/* Job Cards */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div key={job.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  expanded === job.id ? "border-[#002147]/30 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}>
                <div className="flex items-start gap-3 p-4">
                  {/* Company initial */}
                  <div className="w-10 h-10 rounded-xl bg-[#002147]/10 flex items-center justify-center font-bold text-sm text-[#002147] shrink-0">
                    {job.org?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                          {job.isNew && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-500 text-white rounded-full">NEW</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{job.org}</p>
                      </div>
                      <button onClick={() => toggleSave(job.id)}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          saved.has(job.id) ? "text-amber-500 hover:bg-amber-50" : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                        }`} title={saved.has(job.id) ? "Unsave" : "Save"}>
                        {saved.has(job.id) ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt size={10} className="shrink-0" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock size={10} className="shrink-0" /> {job.date}
                      </span>
                      {job.salary && (
                        <span className="font-medium text-gray-700">{job.salary}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_STYLE[job.type] || "bg-gray-100 text-gray-600"}`}>
                        {job.type}
                      </span>
                      {job.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded description */}
                {expanded === job.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-[52px]">
                      <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                      <div className="flex gap-2">
                        <a href="#" onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors">
                          Apply Now <FaExternalLinkAlt size={10} />
                        </a>
                        <button onClick={() => toggleSave(job.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                            saved.has(job.id)
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}>
                          {saved.has(job.id) ? <><FaBookmark size={10} /> Saved</> : <><FaRegBookmark size={10} /> Save</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle expand */}
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100 font-medium"
                >
                  {expanded === job.id ? "Show less ↑" : "View details ↓"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <Briefcase className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm font-medium text-gray-500">No postings match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(""); setTypeFilter("All"); setTagFilter("All"); }}
              className="mt-4 text-xs text-[#002147] font-semibold hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
