"use client";

import React, { useState, useMemo } from "react";
import {
  FaStream, FaPaperPlane, FaCalendarCheck, FaUserPlus,
  FaBuilding, FaFileAlt, FaBullseye, FaStar, FaFilter
} from "react-icons/fa";

const ACTIVITY_TYPES = {
  application: { icon: FaPaperPlane,    label: "Application",  color: "bg-blue-100 text-blue-600",    dot: "bg-blue-500"    },
  interview:   { icon: FaCalendarCheck, label: "Interview",    color: "bg-orange-100 text-orange-600", dot: "bg-orange-500"  },
  contact:     { icon: FaUserPlus,      label: "Contact",      color: "bg-green-100 text-green-600",   dot: "bg-green-500"   },
  employer:    { icon: FaBuilding,      label: "Employer",     color: "bg-[#002147]/10 text-[#002147]",dot: "bg-[#002147]"   },
  material:    { icon: FaFileAlt,       label: "Material",     color: "bg-gray-100 text-gray-600",     dot: "bg-gray-400"    },
  target:      { icon: FaBullseye,      label: "Target",       color: "bg-purple-100 text-purple-600", dot: "bg-purple-500"  },
  milestone:   { icon: FaStar,          label: "Milestone",    color: "bg-amber-100 text-amber-600",   dot: "bg-amber-500"   },
};

const MOCK_ACTIVITY = [
  { id: 1, type: "application", title: "Application submitted", subtitle: "Tech Corp — Software Engineer",    date: "Today",     time: "2:41 PM",  relDate: "2 hours ago" },
  { id: 2, type: "interview",   title: "Interview scheduled",   subtitle: "StartupXYZ — Second round",       date: "Today",     time: "10:15 AM", relDate: "6 hours ago" },
  { id: 3, type: "contact",     title: "Contact added",         subtitle: "Jane Doe — Google",               date: "Yesterday", time: "4:30 PM",  relDate: "1 day ago"   },
  { id: 4, type: "employer",    title: "Employer saved",         subtitle: "Acme Industries",                 date: "Yesterday", time: "11:00 AM", relDate: "2 days ago"  },
  { id: 5, type: "material",    title: "Resume updated",         subtitle: "Version 2.1",                     date: "Mar 18",    time: "9:00 AM",  relDate: "3 days ago"  },
  { id: 6, type: "target",      title: "Target employer added",  subtitle: "BioHealth Partners — High priority","date": "Mar 17",  time: "2:00 PM",  relDate: "4 days ago"  },
  { id: 7, type: "application", title: "Follow-up sent",         subtitle: "DataFlow Inc — Backend Developer","date": "Mar 17",  time: "8:30 AM",  relDate: "4 days ago"  },
  { id: 8, type: "milestone",   title: "5th application reached","subtitle": "Keep up the momentum!",         "date": "Mar 15",  time: "11:45 AM", relDate: "6 days ago"  },
  { id: 9, type: "contact",     title: "LinkedIn connection",    subtitle: "Marcus Lee — Amazon",             date: "Mar 14",    time: "3:15 PM",  relDate: "1 week ago"  },
  { id: 10,type: "interview",   title: "Interview completed",    subtitle: "CloudNine — DevOps Engineer",     date: "Mar 12",    time: "2:00 PM",  relDate: "9 days ago"  },
];

const TYPE_FILTER_TABS = ["All", ...Object.keys(ACTIVITY_TYPES)];

function groupByDate(items) {
  const groups = {};
  items.forEach((item) => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });
  return Object.entries(groups);
}

export default function ActivityStreamPage() {
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    if (activeType === "All") return MOCK_ACTIVITY;
    return MOCK_ACTIVITY.filter((a) => a.type === activeType);
  }, [activeType]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#002147]">
            <FaStream className="text-[#002147]" />
            Activity Stream
          </h2>
          <span className="text-xs text-gray-400 font-medium">{filtered.length} events</span>
        </div>
        <p className="text-gray-500 text-sm mb-5">Your recent career-related actions and updates, all in one place.</p>

        {/* Type Filter Chips */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {TYPE_FILTER_TABS.map((tab) => {
            const meta = ACTIVITY_TYPES[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveType(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
                  activeType === tab ? "bg-[#002147] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {meta && <meta.icon size={10} />}
                {tab === "All" ? "All" : meta?.label || tab}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        {grouped.length > 0 ? (
          <div className="space-y-6">
            {grouped.map(([date, items]) => (
              <div key={date}>
                {/* Date divider */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{date}</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Activity items for this date */}
                <div className="space-y-0 pl-3">
                  {items.map((item, i) => {
                    const meta = ACTIVITY_TYPES[item.type] || ACTIVITY_TYPES.material;
                    return (
                      <div key={item.id} className="flex items-start gap-4 relative">
                        {/* Timeline connector */}
                        {i < items.length - 1 && (
                          <div className="absolute left-[18px] top-9 bottom-0 w-px bg-gray-100 z-0" />
                        )}

                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10 ${meta.color}`}>
                          <meta.icon size={14} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs text-gray-400">{item.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                              {meta.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <FaStream className="mx-auto text-gray-300 mb-3 text-3xl" />
            <p className="text-sm font-medium text-gray-500">No activity for this filter</p>
            <p className="text-xs text-gray-400 mt-1">Try selecting a different type</p>
          </div>
        )}
      </div>
    </div>
  );
}
