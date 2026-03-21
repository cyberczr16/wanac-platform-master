"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import {
  fetchCommunities,
  createCommunity,
} from "../../../../src/services/api/community.service";
import { fireteamService } from "../../../../src/services/api/fireteam.service";

// Inline SVG icon components (no react-icons dependency)
const IcPlus = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcUsers = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcSearch = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcInfo = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IcComments = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IcGlobe = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IcLightbulb = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);
const IcLock = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IcShield = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcTarget = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IcVideo = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IcChevronDown = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IcChevronUp = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const IcClock = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function CommunityPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Explore');
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [communityError, setCommunityError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    type: "public",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCommunity, setCurrentCommunity] = useState(null);

  // Fireteams state
  const [fireteams, setFireteams] = useState([]);
  const [loadingFireteams, setLoadingFireteams] = useState(false);
  const [fireteamError, setFireteamError] = useState("");
  const [expandedFireteam, setExpandedFireteam] = useState(null);
  const [fireteamRecordings, setFireteamRecordings] = useState({}); // { [ftId]: recordings[] }
  const [loadingRecordings, setLoadingRecordings] = useState({});

  const router = useRouter();

  // Load user data and last-viewed community from storage
  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Fetch communities data - runs on every mount
  useEffect(() => {
    let isMounted = true;
    
    const loadCommunities = async () => {
      setLoadingCommunities(true);
      setCommunityError("");
      
      try {
        const data = await fetchCommunities();
        console.log("Fetched data:", data);

        if (isMounted) {
          let comms = Array.isArray(data)
            ? data
            : Array.isArray(data.communites?.data)
            ? data.communites.data
            : [];

          setCommunities(comms);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        if (isMounted) {
          setCommunityError("Failed to load communities.");
          setCommunities([]);
        }
      } finally {
        if (isMounted) {
          setLoadingCommunities(false);
        }
      }
    };

    loadCommunities();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Keep empty array to run on mount - Next.js will remount on navigation
  

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreateSuccess("");
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      setCreateError("Name and description are required.");
      setCreating(false);
      return;
    }
    try {
      // API only accepts { name, description } — type field not yet in spec
      const payload = {
        name: newCommunity.name,
        description: newCommunity.description,
      };
      const raw = await createCommunity(payload);
      // Normalize the returned community (API may nest it under .data or .community)
      const unwrapped = raw?.data ?? raw?.community ?? raw;
      const created = {
        ...unwrapped,
        name: [unwrapped?.name, unwrapped?.title, unwrapped?.community_name].find(v => v != null && String(v).trim()) ?? newCommunity.name,
        description: [unwrapped?.description, unwrapped?.desc].find(v => v != null && String(v).trim()) ?? newCommunity.description,
        type: unwrapped?.type ?? newCommunity.type,
      };
      setCommunities([created, ...communities]);
      setShowCreateModal(false);
      setNewCommunity({ name: "", description: "", type: "public" });
      setCreateSuccess("Community created successfully!");
      setTimeout(() => setCreateSuccess(""), 3000);
    } catch (err) {
      setCreateError("Failed to create community.");
    } finally {
      setCreating(false);
    }
  };

  // Load fireteams when Fireteams tab is selected
  useEffect(() => {
    if (selectedTab !== "Fireteams") return;
    let isMounted = true;
    const load = async () => {
      setLoadingFireteams(true);
      setFireteamError("");
      try {
        const data = await fireteamService.getFireteams();
        if (isMounted) setFireteams(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setFireteamError("Failed to load fireteams.");
      } finally {
        if (isMounted) setLoadingFireteams(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [selectedTab]);

  // Expand a fireteam and lazy-load its recordings
  const handleExpandFireteam = async (ftId) => {
    if (expandedFireteam === ftId) {
      setExpandedFireteam(null);
      return;
    }
    setExpandedFireteam(ftId);
    if (fireteamRecordings[ftId]) return; // already loaded
    setLoadingRecordings(prev => ({ ...prev, [ftId]: true }));
    try {
      const recs = await fireteamService.getRecordings(ftId);
      setFireteamRecordings(prev => ({ ...prev, [ftId]: recs }));
    } catch {
      setFireteamRecordings(prev => ({ ...prev, [ftId]: [] }));
    } finally {
      setLoadingRecordings(prev => ({ ...prev, [ftId]: false }));
    }
  };

  // Filter communities based on search
  const filteredCommunities = communities.filter(comm =>
    searchQuery.trim()
      ? comm.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="h-screen flex bg-white font-body">
      {/* Sidebar */}
      <Sidebar
        className="w-56 bg-white border-r border-gray-200"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} currentCommunity={currentCommunity?.name} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-3 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Content */}
              <div className="flex-1 space-y-3">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl p-4 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src="/veterancommunity.png" 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <IcUsers className="text-white text-xl" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-white mb-1">Communities</h1>
                        <p className="text-white/90 text-xs">Connect, share, and grow together</p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-all font-semibold text-[11px] shadow-sm"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <IcPlus size={10} /> Create
                    </button>
                  </div>
                </section>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                  {[
                    { id: "Explore", label: "Communities", icon: IcGlobe },
                    { id: "Fireteams", label: "Fireteams", icon: IcTarget },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedTab(id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedTab === id
                          ? "bg-[#002147] text-white shadow-sm"
                          : "text-gray-500 hover:text-[#002147] hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={11} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Success/Error Messages */}
                {createSuccess && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2 text-xs">
                    <span>✓</span>
                    {createSuccess}
                  </div>
                )}
                {communityError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2 text-xs">
                    <span>⚠</span>
                    {communityError}
                  </div>
                )}

                {selectedTab === "Explore" && <>

                {/* Current community card - when user has a last-viewed community */}
                {currentCommunity && (
                  <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/80 rounded-lg">
                          <IcUsers className="text-[#002147]" size={14} />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Your current community</p>
                          <p className="text-sm font-bold text-[#002147]">{currentCommunity.name}</p>
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1.5 bg-gradient-to-r from-[#002147] to-[#003875] hover:from-[#003875] hover:to-[#002147] text-white font-semibold py-1.5 px-3 rounded-lg transition-all text-[11px]"
                        onClick={() => router.push(`/client/community/communities/${currentCommunity.id}`)}
                      >
                        <IcComments size={10} />
                        View Community
                      </button>
                    </div>
                  </section>
                )}

                {/* Search Bar */}
                <section className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <div className="relative">
                    <IcSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={10} />
                    <input
                      type="text"
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none"
                    />
                  </div>
                </section>

                {/* Communities List */}
                <section className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-[#002147] flex items-center gap-1.5">
                      <IcGlobe className="text-orange-500" size={12} />
                      All Communities
                      {communities.length > 0 && (
                        <span className="text-[10px] font-normal text-gray-500">({filteredCommunities.length})</span>
                      )}
                    </h2>
                  </div>

                  {loadingCommunities ? (
                    <div className="text-center text-gray-400 py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002147] mx-auto mb-2"></div>
                      <p className="text-[10px]">Loading communities...</p>
                    </div>
                  ) : filteredCommunities.length === 0 ? (
                    <div className="text-center border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 bg-gray-50">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-gray-200 rounded-full">
                          <IcUsers className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <p className="font-semibold text-gray-700 text-sm mb-1">
                        {searchQuery ? "No matches found" : "No Communities Yet"}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {searchQuery ? "Try a different search term" : "Be the first to create a community!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredCommunities.map((comm, index) => (
                        <div
                          key={comm.id ?? `community-${index}`}
                          className={`rounded-lg border-2 p-3 flex flex-col bg-white hover:shadow-lg transition-all group cursor-pointer ${
                            selectedCommunityId === comm.id
                              ? "ring-2 ring-blue-500 border-blue-500 shadow-md"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedCommunityId(comm.id)}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                              <IcUsers className="text-[#002147] text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm text-gray-800 group-hover:text-[#002147] transition truncate">
                              {comm.name || (
                                <span className="italic text-gray-400">
                                  Untitled
                                </span>
                              )}
                            </h3>
                              {comm.type && (
                                <span className={`inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${
                                  comm.type === "private" ? "bg-purple-100 text-purple-700" :
                                  comm.type === "admin" ? "bg-orange-100 text-orange-700" :
                                  "bg-blue-100 text-blue-700"
                                }`}>
                                  {comm.type === "private" ? "🔒 Private" :
                                   comm.type === "admin" ? "🛡 Admin-led" :
                                   "🌐 Public"}
                                </span>
                              )}
                          </div>
                            </div>
                          <p className="text-[11px] text-gray-600 mb-3 line-clamp-2 min-h-[32px]">
                            {comm.description || (
                              <span className="italic text-gray-400">No description</span>
                            )}
                          </p>
                          <div className="mt-auto pt-2 border-t border-gray-100">
                          <button
                              className="w-full bg-gradient-to-r from-[#002147] to-[#003875] hover:from-[#003875] hover:to-[#002147] text-white font-semibold py-1.5 px-3 rounded-lg transition-all text-[10px] flex items-center justify-center gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (comm.id) {
                                router.push(`/client/community/communities/${comm.id}`);
                              } else {
                                alert("Community ID is missing!");
                              }
                            }}
                          >
                              <IcComments size={9} />
                            View Community
                          </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                </> /* end selectedTab === "Explore" */}

                {/* ── Fireteams Tab ─────────────────────────────────────── */}
                {selectedTab === "Fireteams" && (
                  <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-[#002147] flex items-center gap-1.5">
                        <IcTarget className="text-orange-500" size={13} />
                        Your Fireteams
                        {fireteams.length > 0 && (
                          <span className="text-[10px] font-normal text-gray-500">({fireteams.length})</span>
                        )}
                      </h2>
                    </div>

                    {fireteamError && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[10px] mb-3">⚠ {fireteamError}</div>
                    )}

                    {loadingFireteams ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002147] mx-auto mb-2"></div>
                        <p className="text-[10px] text-gray-400">Loading fireteams…</p>
                      </div>
                    ) : fireteams.length === 0 ? (
                      <div className="text-center border-2 border-dashed border-gray-200 rounded-xl py-10 px-4 bg-gray-50">
                        <div className="p-3 bg-gray-200 rounded-full w-fit mx-auto mb-3">
                          <IcTarget className="text-gray-400" size={24} />
                        </div>
                        <p className="font-semibold text-gray-700 text-sm mb-1">No Fireteams Yet</p>
                        <p className="text-[10px] text-gray-500">Your coach will add you to a fireteam soon.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {fireteams.map((ft) => {
                          const isExpanded = expandedFireteam === ft.id;
                          const recs = fireteamRecordings[ft.id] ?? [];
                          const loadingRec = loadingRecordings[ft.id];

                          return (
                            <div key={ft.id} className="border border-gray-200 rounded-xl overflow-hidden">
                              {/* Fireteam header row */}
                              <button
                                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors text-left"
                                onClick={() => handleExpandFireteam(ft.id)}
                              >
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100 shrink-0">
                                  <IcTarget className="text-[#002147]" size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-[#002147] truncate">{ft.title || ft.name || "Fireteam"}</p>
                                  {ft.description && (
                                    <p className="text-[10px] text-gray-500 truncate">{ft.description}</p>
                                  )}
                                  {ft.date && ft.time && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <IcClock className="text-orange-400" size={9} />
                                      <span className="text-[9px] text-gray-500">
                                        {new Date(ft.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                        {" · "}{ft.time}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="shrink-0 text-gray-400">
                                  {isExpanded ? <IcChevronUp size={14} /> : <IcChevronDown size={14} />}
                                </div>
                              </button>

                              {/* Expanded: recordings */}
                              {isExpanded && (
                                <div className="p-3 bg-white border-t border-gray-100">
                                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <IcVideo size={10} />
                                    Session Recordings
                                  </p>
                                  {loadingRec ? (
                                    <div className="flex items-center gap-2 py-3">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#002147]"></div>
                                      <span className="text-[10px] text-gray-400">Loading recordings…</span>
                                    </div>
                                  ) : recs.length === 0 ? (
                                    <p className="text-[10px] text-gray-400 italic py-2">No recordings yet for this fireteam.</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {recs.map((rec) => (
                                        <div key={rec.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                          <div className="p-1.5 bg-orange-100 rounded-md shrink-0">
                                            <IcVideo className="text-orange-500" size={11} />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-semibold text-gray-800 truncate">
                                              {rec.title || rec.name || `Recording ${rec.id}`}
                                            </p>
                                            {rec.created_at && (
                                              <p className="text-[9px] text-gray-400">
                                                {new Date(rec.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                              </p>
                                            )}
                                            {rec.url && (
                                              <a
                                                href={rec.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-blue-600 hover:underline"
                                              >
                                                Watch recording →
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Link info */}
                                  {ft.link && (
                                    <div className="mt-3 pt-2 border-t border-gray-100">
                                      <p className="text-[10px] text-gray-500 mb-1 font-medium">Session Link</p>
                                      <a
                                        href={ft.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-600 hover:underline break-all"
                                      >
                                        {ft.link}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                )}
              </div>{/* end flex-1 main column */}

              {/* Right Sidebar */}
              <aside className="lg:w-64 space-y-3">
                {/* Tips Card */}
                <div className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl shadow-sm p-3 text-white">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <IcLightbulb />
                    {selectedTab === "Fireteams" ? "Fireteam Tips" : "Community Tips"}
                  </h3>
                  {selectedTab === "Fireteams" ? (
                    <ul className="space-y-2 text-[10px] text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Fireteams are small accountability groups for peer growth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Show up consistently — your team counts on you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Review session recordings to reinforce your progress</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>AI summaries help you track key insights over time</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-[10px] text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Join communities to connect with peers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Share experiences and learn from others</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Create your own community on topics you care about</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>Engage in meaningful conversations</span>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Stats Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
                  <h3 className="text-sm font-semibold text-[#002147] mb-3">
                    {selectedTab === "Fireteams" ? "Fireteam Stats" : "Community Stats"}
                  </h3>
                  {selectedTab === "Fireteams" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-[10px] font-medium text-gray-700">Your Fireteams</span>
                        <span className="text-sm font-bold text-[#002147]">{fireteams.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-[10px] font-medium text-gray-700">With Recordings</span>
                        <span className="text-sm font-bold text-green-600">
                          {Object.values(fireteamRecordings).filter(r => r.length > 0).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="text-[10px] font-medium text-gray-700">Total Recordings</span>
                        <span className="text-sm font-bold text-orange-600">
                          {Object.values(fireteamRecordings).reduce((sum, r) => sum + r.length, 0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-[10px] font-medium text-gray-700">Total Communities</span>
                        <span className="text-sm font-bold text-[#002147]">{communities.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-[10px] font-medium text-gray-700">Your Communities</span>
                        <span className="text-sm font-bold text-green-600">0</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="text-[10px] font-medium text-gray-700">Active Now</span>
                        <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          {Math.floor(communities.length * 0.3)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
                  <h3 className="text-sm font-semibold text-[#002147] mb-3 flex items-center gap-1.5">
                    <IcInfo className="text-orange-500" />
                    About Communities
                  </h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded text-[10px] text-gray-700">
                      <strong>Connect:</strong> Meet veterans and service members
                    </div>
                    <div className="p-2 bg-green-50 rounded text-[10px] text-gray-700">
                      <strong>Share:</strong> Exchange stories and experiences
                    </div>
                    <div className="p-2 bg-yellow-50 rounded text-[10px] text-gray-700">
                      <strong>Support:</strong> Give and receive peer support
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-[10px] text-gray-700">
                      <strong>Grow:</strong> Learn and develop together
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

                {/* Create Community Modal */}
                {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-2xl relative">
                      <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition"
              onClick={() => {
                setShowCreateModal(false);
                setCreateError("");
              }}
            >
              ×
                      </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <IcUsers className="text-[#002147]" size={12} />
              </div>
              <h2 className="text-sm font-bold text-[#002147]">Create New Community</h2>
            </div>
            <form onSubmit={handleCreateCommunity} className="space-y-3">
                        <div>
                <label className="block text-[11px] font-semibold mb-1 text-gray-700">
                  Community Name *
                          </label>
                          <input
                            type="text"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 text-[11px] focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none"
                  placeholder="Enter community name..."
                            value={newCommunity.name}
                            onChange={(e) =>
                              setNewCommunity({
                                ...newCommunity,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                <label className="block text-[11px] font-semibold mb-1 text-gray-700">
                  Description *
                          </label>
                          <textarea
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 text-[11px] focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none min-h-[80px] resize-none"
                  placeholder="Describe your community..."
                            value={newCommunity.description}
                            onChange={(e) =>
                              setNewCommunity({
                                ...newCommunity,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1 text-gray-700">
                            Community Type
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "public", label: "Public", icon: IcGlobe, desc: "Anyone can join", color: "blue" },
                              { value: "private", label: "Private", icon: IcLock, desc: "Invite only", color: "purple" },
                              { value: "admin", label: "Admin-led", icon: IcShield, desc: "Admin managed", color: "orange" },
                            ].map(({ value, label, icon: Icon, desc, color }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setNewCommunity({ ...newCommunity, type: value })}
                                className={`p-2 rounded-lg border-2 text-left transition-all ${
                                  newCommunity.type === value
                                    ? `border-${color}-500 bg-${color}-50`
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                              >
                                <Icon size={12} className={newCommunity.type === value ? `text-${color}-600` : "text-gray-400"} />
                                <div className="text-[10px] font-semibold mt-1">{label}</div>
                                <div className="text-[9px] text-gray-500">{desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        {createError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[10px]">
                  {createError}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold text-[11px] transition-all"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                  }}
                >
                  Cancel
                </button>
                        <button
                          type="submit"
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold text-[11px] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                          disabled={creating}
                        >
                  <IcPlus size={9} />
                  {creating ? "Creating..." : "Create Community"}
                        </button>
              </div>
                      </form>
                    </div>
                  </div>
                )}
    </div>
  );
}
