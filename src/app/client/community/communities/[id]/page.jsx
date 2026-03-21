"use client";

import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  fetchCommunityById,
  addCommunityFeedPost,
  fetchCommunityPostsByCommunityId,
  addCommunityPostComment,
  updateCommunityPost,
  deleteCommunityPost,
} from "../../../../../services/api/community.service";
// Events are user-scoped (no community_id in API). addEvent uses only: type, date, time, location|link
import { getEvents, addEvent } from "../../../../../services/api/events.service";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../../../components/dashboardcomponents/clienttopbar";
import { notificationService } from "../../../../../services/api/notification.service";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const Ic = {
  Users: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Comments: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Calendar: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  ArrowLeft: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Send: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Plus: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={cls}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Pin: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Link: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  Clock: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Pencil: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Image: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Heart: ({ s = 16, cls = "", filled = false }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  ThumbUp: ({ s = 16, cls = "", filled = false }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  ),
  X: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={cls}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronDown: ({ s = 16, cls = "" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#002147","#1e3a5f","#c2440e","#0369a1","#6d28d9","#065f46","#9a3412","#1d4ed8"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name = "") => name.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase() || "?";
function Avatar({ name = "", size = 36 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, background: avatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
function timeAgo(date) {
  if (!date) return "";
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function CommunityDetailPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002147]"/></div>}>
      <CommunityDetailPageInner />
    </Suspense>
  );
}

function CommunityDetailPageInner() {
  const router = useRouter();
  const params = useParams();
  const communityId = params?.id;
  const imageInputRef = useRef(null);

  // ── core state ──
  const [collapsed, setCollapsed] = useState(false);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");

  // ── feed state ──
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [feedSuccess, setFeedSuccess] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);

  // ── compose state ──
  const [newFeedContent, setNewFeedContent] = useState("");
  const [postImages, setPostImages] = useState([]); // { dataUrl, name }[]

  // ── comment state ──
  const [comments, setComments] = useState({});          // postId → comment[]
  const [commentLoading, setCommentLoading] = useState({});
  const [expandedComments, setExpandedComments] = useState({}); // postId → bool
  const [newComment, setNewComment] = useState({});
  const [commentError, setCommentError] = useState("");

  // ── reactions (client-side) ──
  const [reactions, setReactions] = useState({});   // postId → { likes, hearts, myLike, myHeart }

  // ── edit/delete ──
  const [editingPost, setEditingPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [deletingPostId, setDeletingPostId] = useState(null);

  // ── events state ──
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState({});
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // API-accurate: events only store type, date, time, and location|link
  const [eventForm, setEventForm] = useState({ type: "Online", date: "", time: "", link: "", location: "" });
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState("");
  const [eventSuccess, setEventSuccess] = useState("");

  // ── chat state ──
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // ─── mixed timeline: merge posts + events sorted newest first ────────────
  const timeline = useMemo(() => {
    const postItems = feedPosts.map(p => ({ ...p, _kind: "post" }));
    const eventItems = events.map(e => ({
      ...e,
      _kind: "event",
      createdAt: e.date ? new Date(e.date + (e.time ? "T" + e.time : "")) : new Date(),
    }));
    return [...postItems, ...eventItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [feedPosts, events]);

  // ─── load data ───────────────────────────────────────────────────────────
  const loadCommunityPosts = async () => {
    if (!communityId) return;
    setFeedLoading(true);
    setFeedError("");
    try {
      const list = await fetchCommunityPostsByCommunityId(communityId);
      const normalized = (Array.isArray(list) ? list : []).map(p => ({
        id: p.id,
        user_id: p.user_id ?? p.userId,
        content: p.content ?? p.body ?? "",
        image_url: p.image_url ?? p.imageUrl ?? null,
        userName: p.user_name ?? p.userName ?? p.user?.name ?? "Unknown",
        createdAt: p.created_at ? new Date(p.created_at) : new Date(),
      }));
      setFeedPosts(normalized);
    } catch {
      setFeedError("Failed to load posts.");
      setFeedPosts([]);
    } finally {
      setFeedLoading(false);
    }
  };

  const loadCommunityEvents = async () => {
    setEventsLoading(true);
    setEventsError("");
    try {
      const data = await getEvents();
      // API stores no community_id — events are user-scoped. Show all user events.
      const eventList = Array.isArray(data) ? data
        : Array.isArray(data?.data) ? data.data
        : Array.isArray(data?.events) ? data.events
        : [];
      setEvents(eventList);
    } catch {
      setEventsError("Failed to load events.");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    fetchCommunityById(communityId)
      .then(data => {
        setCommunity(data);
        setError("");
        const posts = Array.isArray(data?.posts) ? data.posts : [];
        setFeedPosts(posts.map(p => ({
          id: p.id,
          user_id: p.user_id ?? p.userId,
          content: p.content ?? p.body ?? "",
          image_url: p.image_url ?? p.imageUrl ?? null,
          userName: p.user_name ?? p.userName ?? p.user?.name ?? "Unknown",
          createdAt: p.created_at ? new Date(p.created_at) : new Date(),
        })));
        try { sessionStorage.setItem("wanacCurrentCommunity", JSON.stringify({ id: communityId, name: data.name })); } catch {}
      })
      .catch(() => { setError("Failed to load community."); setCommunity(null); })
      .finally(() => setLoading(false));

    try { setUser(JSON.parse(localStorage.getItem("wanacUser") || "null")); } catch { setUser(null); }
    loadCommunityEvents();
  }, [communityId]);

  useEffect(() => { if (showScheduleModal) setModalVisible(true); else { const t = setTimeout(() => setModalVisible(false), 200); return () => clearTimeout(t); } }, [showScheduleModal]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  // ─── image attachment ─────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.slice(0, 4 - postImages.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPostImages(prev => [...prev, { dataUrl: ev.target.result, name: file.name }]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // ─── submit post ─────────────────────────────────────────────────────────
  // API accepts: { content, community_id } only. Images have no upload endpoint,
  // so they are attached to the local/optimistic post only (session-visible).
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if ((!newFeedContent.trim() && postImages.length === 0) || !user) return;
    setPostSubmitting(true);
    setFeedError("");
    setFeedSuccess("");
    try {
      // Only send what the API actually accepts
      const payload = { content: newFeedContent, community_id: communityId };
      const res = await addCommunityFeedPost(payload);
      const created = res?.post ?? res?.data ?? res;

      // Build optimistic post — attach local image (session-only, not persisted to server)
      const optimisticPost = {
        id: created?.id ?? `local-${Date.now()}`,
        user_id: user.id,
        content: newFeedContent,
        image_url: postImages.length > 0 ? postImages[0].dataUrl : null, // local only
        userName: user.name,
        createdAt: created?.created_at ? new Date(created.created_at) : new Date(),
      };
      setFeedPosts(prev => [optimisticPost, ...prev]);
      setNewFeedContent("");
      setPostImages([]);
      setFeedSuccess("Post shared!");
      setTimeout(() => setFeedSuccess(""), 3000);
      try {
        await notificationService.sendNotification({
          user_id: user.id,
          title: "New Community Post",
          message: `${user.name || "A member"} posted in ${community?.name || "the community"}`,
          type: "community_post",
          metadata: { community_id: communityId },
        });
      } catch {}
    } catch {
      setFeedError("Failed to post. Please try again.");
    } finally {
      setPostSubmitting(false);
    }
  };

  // ─── submit comment ───────────────────────────────────────────────────────
  // API accepts: { content, post_id } only — no user_id (identity from JWT token)
  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    const content = newComment[postId]?.trim();
    if (!content || !user) return;
    setCommentError("");
    setCommentLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await addCommunityPostComment({ content, post_id: postId });
      const added = res?.comment ?? res?.data ?? res;
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), {
          id: added?.id,
          content,
          userName: user.name,
          createdAt: added?.created_at ? new Date(added.created_at) : new Date(),
          ...(typeof added === "object" ? added : {}),
        }],
      }));
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      const post = feedPosts.find(p => p.id === postId);
      if (post?.user_id && post.user_id !== user.id) {
        try {
          await notificationService.sendNotification({
            user_id: post.user_id,
            title: "New Comment",
            message: `${user.name || "Someone"} commented on your post`,
            type: "community_comment",
            metadata: { post_id: postId, community_id: communityId },
          });
        } catch {}
      }
    } catch {
      setCommentError("Failed to add comment.");
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // ─── reactions ────────────────────────────────────────────────────────────
  const toggleReaction = (postId, type) => {
    setReactions(prev => {
      const cur = prev[postId] || { likes: 0, hearts: 0, myLike: false, myHeart: false };
      if (type === "like") return { ...prev, [postId]: { ...cur, likes: cur.myLike ? cur.likes - 1 : cur.likes + 1, myLike: !cur.myLike } };
      return { ...prev, [postId]: { ...cur, hearts: cur.myHeart ? cur.hearts - 1 : cur.hearts + 1, myHeart: !cur.myHeart } };
    });
  };

  // ─── early returns ────────────────────────────────────────────────────────
  const Shell = ({ children }) => (
    <div className="h-screen flex bg-[#f5f5f5] font-body">
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ClientTopbar user={user} currentCommunity={community?.name} />
        {children}
      </div>
    </div>
  );

  if (loading) return <Shell><main className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002147]"/></main></Shell>;
  if (error) return <Shell><main className="flex-1 flex items-center justify-center"><p className="text-red-500 text-sm">{error}</p></main></Shell>;
  if (!community) return <Shell><main className="flex-1 flex items-center justify-center"><p className="text-gray-500 text-sm">Community not found.</p></main></Shell>;

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <main className="flex-1 h-0 overflow-y-auto px-3 sm:px-5 py-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">

          {/* Back */}
          <button
            className="flex items-center gap-1.5 text-[#002147] hover:text-orange-500 font-semibold text-[11px] transition-colors"
            onClick={() => router.push("/client/community")}
          >
            <Ic.ArrowLeft s={13} /> Back to Communities
          </button>

          {/* Hero Banner */}
          <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-2xl p-4 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="/veterancommunity.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Ic.Users s={22} cls="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-white truncate">{community.name}</h1>
                  <p className="text-white/80 text-xs line-clamp-1">{community.description || "Welcome to the community"}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/70 text-[10px]">👥 {community.memberCount || 0} members</span>
                    <span className="text-white/70 text-[10px]">📝 {feedPosts.length} posts</span>
                    <span className="text-white/70 text-[10px]">🗓 {events.length} events</span>
                  </div>
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-[11px] shadow-sm shrink-0 transition-all"
                onClick={() => user?.id ? setShowScheduleModal(true) : alert("Please log in first.")}
              >
                <Ic.Plus s={10} /> Schedule Event
              </button>
            </div>
          </section>

          {/* Toasts */}
          {feedSuccess && (
            <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-medium">
              <span>✓</span>{feedSuccess}
            </div>
          )}
          {eventSuccess && (
            <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-medium">
              <span>✓</span>{eventSuccess}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: "feed", label: "Feed", icon: <Ic.Comments s={12} /> },
              { id: "chat", label: "Chat", icon: <Ic.Send s={12} /> },
              { id: "events", label: "Events", icon: <Ic.Calendar s={12} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-semibold text-[11px] transition-all ${
                  activeTab === tab.id
                    ? "bg-[#002147] text-white border-[#002147] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab.icon}{tab.label}
                {tab.id === "events" && events.length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"}`}>
                    {events.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── FEED TAB ─────────────────────────────────────────── */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              {/* Compose Box */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={user?.name || "?"} size={38} />
                  <form className="flex-1" onSubmit={handleSubmitPost}>
                    <textarea
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-[12px] focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/10 focus:outline-none resize-none min-h-[80px] placeholder-gray-400"
                      placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "friend"}?`}
                      value={newFeedContent}
                      onChange={e => setNewFeedContent(e.target.value)}
                    />

                    {/* Image previews */}
                    {postImages.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {postImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img.dataUrl} alt={img.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                            <button
                              type="button"
                              onClick={() => setPostImages(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Ic.X s={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {feedError && <p className="text-[10px] text-red-500 mt-1">{feedError}</p>}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2">
                        <input type="file" accept="image/*" multiple ref={imageInputRef} className="hidden" onChange={handleImageSelect} />
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={postImages.length >= 4}
                          title="Images are visible in your session only — no upload endpoint yet"
                          className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 hover:text-[#002147] disabled:opacity-40 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
                        >
                          <Ic.Image s={13} />
                          {postImages.length > 0 ? `Photo (${postImages.length}/4)` : "Photo"}
                          <span className="text-[8px] text-gray-400 font-normal">session only</span>
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={(!newFeedContent.trim() && postImages.length === 0) || postSubmitting || !user}
                        className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-[11px] shadow-sm disabled:opacity-50 transition-all"
                      >
                        <Ic.Send s={11} />
                        {postSubmitting ? "Posting…" : "Post"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Timeline */}
              {feedLoading && !postSubmitting && timeline.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002147]" />
                </div>
              ) : timeline.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
                  <Ic.Comments s={32} cls="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500 mb-1">Nothing here yet</p>
                  <p className="text-[11px] text-gray-400">Be the first to post or schedule an event!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timeline.map((item, idx) =>
                    item._kind === "event"
                      ? <EventFeedCard key={`ev-${item.id ?? idx}`} event={item} rsvps={rsvps} setRsvps={setRsvps} />
                      : <PostCard
                          key={`post-${item.id ?? idx}`}
                          post={item}
                          user={user}
                          comments={comments}
                          expandedComments={expandedComments}
                          setExpandedComments={setExpandedComments}
                          newComment={newComment}
                          setNewComment={setNewComment}
                          commentLoading={commentLoading}
                          commentError={commentError}
                          reactions={reactions}
                          toggleReaction={toggleReaction}
                          editingPost={editingPost}
                          setEditingPost={setEditingPost}
                          editPostContent={editPostContent}
                          setEditPostContent={setEditPostContent}
                          deletingPostId={deletingPostId}
                          setDeletingPostId={setDeletingPostId}
                          setFeedPosts={setFeedPosts}
                          setFeedError={setFeedError}
                          handleSubmitComment={handleSubmitComment}
                        />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── CHAT TAB ─────────────────────────────────────────── */}
          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ height: "520px" }}>
              {/* header */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#002147] to-[#003875] text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Ic.Send s={14} cls="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">Community Chat</p>
                  <p className="text-[9px] text-white/60">Session only · messages are not saved</p>
                </div>
                {user && <Avatar name={user.name} size={28} />}
              </div>

              {/* messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Ic.Send s={28} cls="text-gray-300 mb-2" />
                    <p className="text-gray-400 text-xs">Start the conversation!</p>
                  </div>
                ) : chatMessages.map((msg, idx) => {
                  const isMe = msg.userName === user?.name;
                  return (
                    <div key={idx} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <Avatar name={msg.userName} size={26} />
                      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-[11px] shadow-sm ${isMe ? "bg-orange-500 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`}>
                        {!isMe && <p className="font-bold text-[10px] mb-0.5" style={{ color: avatarColor(msg.userName) }}>{msg.userName}</p>}
                        <p>{msg.text}</p>
                        <p className={`text-[8px] mt-0.5 ${isMe ? "text-white/60" : "text-gray-400"}`}>
                          {msg.createdAt?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" }) ?? ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* input */}
              <form
                className="flex gap-2 px-4 py-3 bg-white border-t border-gray-100"
                onSubmit={e => {
                  e.preventDefault();
                  if (!chatInput.trim() || !user) return;
                  setChatMessages(prev => [...prev, { text: chatInput, userName: user.name, createdAt: new Date() }]);
                  setChatInput("");
                }}
              >
                <input
                  className="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2 text-[11px] focus:outline-none focus:border-[#002147] transition"
                  placeholder="Type a message…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={!user}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || !user}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-xl disabled:opacity-50 transition flex items-center gap-1.5 font-semibold text-[11px]"
                >
                  <Ic.Send s={12} />
                </button>
              </form>
            </div>
          )}

          {/* ── EVENTS TAB ───────────────────────────────────────── */}
          {activeTab === "events" && (
            <div className="space-y-3">
              {eventsLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002147]" /></div>
              ) : eventsError ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">{eventsError}</div>
              ) : events.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
                  <Ic.Calendar s={32} cls="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500 mb-1">No events yet</p>
                  <p className="text-[11px] text-gray-400">Schedule the first one!</p>
                </div>
              ) : (
                events.map((event, idx) => (
                  <EventFeedCard key={event.id ?? idx} event={event} rsvps={rsvps} setRsvps={setRsvps} />
                ))
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── Schedule Event Modal ─────────────────────────────────── */}
      {(showScheduleModal || modalVisible) && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${showScheduleModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={e => { if (e.target === e.currentTarget) setShowScheduleModal(false); }}
        >
          <div className={`bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl relative transform transition-all duration-200 mx-4 ${showScheduleModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              onClick={() => { setShowScheduleModal(false); setEventError(""); }}
            ><Ic.X s={14} /></button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-orange-100 rounded-xl"><Ic.Calendar s={14} cls="text-orange-600" /></div>
              <h2 className="font-bold text-[#002147]">Schedule New Event</h2>
            </div>

            <form className="space-y-3" onSubmit={async e => {
              e.preventDefault();
              setEventLoading(true); setEventError("");
              try {
                if (!user?.id) throw new Error("Not logged in");
                // API-accurate payload — only type, date, time, and location|link are stored
                const payload = {
                  type: eventForm.type,          // "Physical" or "Online"
                  date: eventForm.date,
                  time: eventForm.time,
                  ...(eventForm.type === "Physical"
                    ? { location: eventForm.location.trim() }
                    : { link: eventForm.link.trim() }),
                };
                await addEvent(payload);
                setShowScheduleModal(false);
                setEventForm({ type: "Online", date: "", time: "", link: "", location: "" });
                setEventSuccess("Event scheduled!");
                setTimeout(() => setEventSuccess(""), 3000);
                await loadCommunityEvents();
              } catch (err) {
                setEventError(err.response?.data?.error || err.message || "Failed to schedule event.");
              } finally { setEventLoading(false); }
            }}>
              {/* Note: API stores type, date, time, and location/link only */}
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[10px] text-blue-700 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">ℹ</span>
                <span>Events are saved with date, time, and join details. Use the description in your message to share more context with members.</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700">Date *</label>
                  <input type="date" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:border-[#002147] focus:outline-none" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700">Time *</label>
                  <input type="time" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:border-[#002147] focus:outline-none" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1 text-gray-700">Event Type *</label>
                <div className="flex gap-2">
                  {[{ v: "Online", l: "💻 Online" }, { v: "Physical", l: "📍 In Person" }].map(({ v, l }) => (
                    <button key={v} type="button" onClick={() => setEventForm(f => ({ ...f, type: v }))}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-semibold border-2 transition-all ${eventForm.type === v ? "border-[#002147] bg-blue-50 text-[#002147]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {eventForm.type === "Online" && (
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700">Meeting Link *</label>
                  <input type="url" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:border-[#002147] focus:outline-none" placeholder="https://zoom.us/j/…" value={eventForm.link} onChange={e => setEventForm(f => ({ ...f, link: e.target.value }))} required />
                </div>
              )}
              {eventForm.type === "Physical" && (
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700">Location *</label>
                  <input type="text" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:border-[#002147] focus:outline-none" placeholder="Address or venue…" value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} required />
                </div>
              )}
              {eventError && <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[10px]">{eventError}</div>}
              <div className="flex gap-2 pt-1">
                <button type="button" className="flex-1 py-2 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-[11px] transition-all" onClick={() => { setShowScheduleModal(false); setEventError(""); }}>Cancel</button>
                <button type="submit" disabled={eventLoading} className="flex-1 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold text-[11px] shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-1.5">
                  <Ic.Calendar s={11} />{eventLoading ? "Scheduling…" : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({
  post, user, comments, expandedComments, setExpandedComments,
  newComment, setNewComment, commentLoading, commentError,
  reactions, toggleReaction,
  editingPost, setEditingPost, editPostContent, setEditPostContent,
  deletingPostId, setDeletingPostId, setFeedPosts, setFeedError,
  handleSubmitComment,
}) {
  const postComments = comments[post.id] || [];
  const expanded = expandedComments[post.id] || false;
  const react = reactions[post.id] || { likes: 0, hearts: 0, myLike: false, myHeart: false };
  const isOwn = user && (post.user_id === user.id || post.userName === user.name);
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Avatar name={post.userName} size={38} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[12px] text-gray-900">{post.userName || "Unknown"}</p>
          <p className="text-[10px] text-gray-400">{timeAgo(post.createdAt)}</p>
        </div>
        {isOwn && (
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-1.5 text-gray-300 hover:text-[#002147] hover:bg-gray-100 rounded-lg transition-colors" title="Edit" onClick={() => { setEditingPost(post); setEditPostContent(post.content); }}>
              <Ic.Pencil s={13} />
            </button>
            <button className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete" disabled={deletingPostId === post.id} onClick={async () => {
              if (!window.confirm("Delete this post?")) return;
              setDeletingPostId(post.id);
              try { await deleteCommunityPost(post.id); setFeedPosts(prev => prev.filter(p => p.id !== post.id)); }
              catch { setFeedError("Failed to delete."); }
              finally { setDeletingPostId(null); }
            }}>
              <Ic.Trash s={13} />
            </button>
          </div>
        )}
      </div>

      {/* Inline edit */}
      {editingPost?.id === post.id ? (
        <div className="px-4 pb-3">
          <textarea
            className="w-full border-2 border-[#002147] rounded-xl px-3 py-2 text-[11px] focus:outline-none resize-none min-h-[72px]"
            value={editPostContent}
            onChange={e => setEditPostContent(e.target.value)}
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 hover:bg-gray-50" onClick={() => setEditingPost(null)}>Cancel</button>
            <button className="px-3 py-1.5 bg-[#002147] text-white rounded-lg text-[10px] font-semibold hover:bg-[#003875] disabled:opacity-50" disabled={!editPostContent.trim()} onClick={async () => {
              try { await updateCommunityPost(post.id, { content: editPostContent }); setFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, content: editPostContent } : p)); setEditingPost(null); }
              catch { setFeedError("Failed to update."); }
            }}>Save</button>
          </div>
        </div>
      ) : (
        <>
          {/* Content */}
          {post.content && (
            <p className="px-4 pb-3 text-[12px] text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
          )}
          {/* Image */}
          {post.image_url && (
            <>
              <div className="px-4 pb-3">
                <img
                  src={post.image_url}
                  alt="Post image"
                  className="w-full max-h-72 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity border border-gray-100"
                  onClick={() => setImageOpen(true)}
                />
              </div>
              {imageOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setImageOpen(false)}>
                  <img src={post.image_url} alt="Post image full" className="max-w-full max-h-full rounded-xl object-contain" />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Reactions bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-t border-gray-50">
        <button
          onClick={() => toggleReaction(post.id, "like")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${react.myLike ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
        >
          <Ic.ThumbUp s={13} filled={react.myLike} />
          {react.likes > 0 && <span>{react.likes}</span>}
          Like
        </button>
        <button
          onClick={() => toggleReaction(post.id, "heart")}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${react.myHeart ? "bg-red-50 text-red-500" : "text-gray-400 hover:bg-gray-100"}`}
        >
          <Ic.Heart s={13} filled={react.myHeart} />
          {react.hearts > 0 && <span>{react.hearts}</span>}
          Love
        </button>
        <button
          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-gray-400 hover:bg-gray-100 transition-all ml-auto"
        >
          <Ic.Comments s={13} />
          {postComments.length > 0 ? `${postComments.length} comment${postComments.length !== 1 ? "s" : ""}` : "Comment"}
          <Ic.ChevronDown s={11} cls={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Comments section */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-4 pt-3 pb-4 space-y-3">
          {/* Existing comments */}
          {postComments.length > 0 && (
            <div className="space-y-2.5">
              {postComments.map((c, ci) => (
                <div key={c.id ?? ci} className="flex items-start gap-2.5">
                  <Avatar name={c.userName} size={28} />
                  <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold text-[10px] text-gray-800">{c.userName}</p>
                      <p className="text-[9px] text-gray-400">{timeAgo(c.createdAt)}</p>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          <form className="flex items-center gap-2" onSubmit={e => handleSubmitComment(e, post.id)}>
            <Avatar name={user?.name || "?"} size={28} />
            <div className="flex-1 flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 focus-within:border-[#002147] transition-colors">
              <input
                className="flex-1 py-2 text-[11px] outline-none placeholder-gray-400 bg-transparent"
                placeholder="Write a comment…"
                value={newComment[post.id] || ""}
                onChange={e => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
              />
              <button
                type="submit"
                disabled={!newComment[post.id]?.trim() || commentLoading[post.id]}
                className="text-[#002147] disabled:text-gray-300 hover:text-orange-500 transition-colors p-0.5"
              >
                <Ic.Send s={13} />
              </button>
            </div>
          </form>
          {commentError && <p className="text-[10px] text-red-500">{commentError}</p>}
        </div>
      )}
    </div>
  );
}

// ─── EventFeedCard ─────────────────────────────────────────────────────────────
function EventFeedCard({ event, rsvps, setRsvps }) {
  const isRsvpd = rsvps[event.id];

  // Format time string like "14:30" → "2:30 PM"
  const fmtTime = (t) => {
    if (!t) return null;
    try {
      const [h, m] = t.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const hr = h % 12 || 12;
      return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
    } catch { return t; }
  };

  // Parse date safely (avoid timezone shift by treating as local)
  const parsedDate = event.date ? (() => {
    const [y, mo, d] = event.date.split("-").map(Number);
    return new Date(y, mo - 1, d);
  })() : null;

  const monthLabel = parsedDate?.toLocaleDateString(undefined, { month: "short" });
  const dayLabel   = parsedDate?.getDate();
  const weekday    = parsedDate?.toLocaleDateString(undefined, { weekday: "long" });

  const isOnline   = event.type === "Online";
  const isPhysical = event.type === "Physical";

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
      {/* header strip */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#002147]/5 border-b border-blue-100">
        <Ic.Calendar s={12} cls="text-[#002147]" />
        <span className="text-[10px] font-bold text-[#002147] uppercase tracking-wide">Community Event</span>
        {event.type && (
          <span className={`ml-auto text-[9px] px-2 py-0.5 rounded-full font-semibold ${isPhysical ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {isPhysical ? "📍 In Person" : "💻 Online"}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* date badge */}
          <div className="shrink-0 w-14 text-center bg-white rounded-xl border border-blue-200 shadow-sm py-2">
            {parsedDate ? (
              <>
                <p className="text-[9px] font-bold text-orange-500 uppercase leading-tight">{monthLabel}</p>
                <p className="text-2xl font-black text-[#002147] leading-none">{dayLabel}</p>
                <p className="text-[8px] text-gray-400 uppercase mt-0.5">{weekday?.slice(0, 3)}</p>
              </>
            ) : (
              <Ic.Calendar s={22} cls="text-gray-300 mx-auto my-1" />
            )}
          </div>

          {/* main info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* time row */}
            <div className="flex items-center gap-1.5">
              <Ic.Clock s={11} cls="text-orange-400 shrink-0" />
              <span className="text-sm font-bold text-gray-800">
                {fmtTime(event.time) ?? "Time TBD"}
              </span>
              {parsedDate && (
                <span className="text-[10px] text-gray-400">
                  · {parsedDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>

            {/* location / join link */}
            {isPhysical && event.location && (
              <div className="flex items-center gap-1 text-[11px] text-gray-600">
                <Ic.Pin s={10} cls="text-green-500 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
            {isOnline && event.link && (
              <div className="flex items-center gap-1">
                <Ic.Link s={10} cls="text-blue-400 shrink-0" />
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 hover:underline truncate"
                >
                  {event.link}
                </a>
              </div>
            )}
            {!event.location && !event.link && (
              <p className="text-[10px] text-gray-400 italic">Location / link TBD</p>
            )}
          </div>

          {/* RSVP */}
          <div className="shrink-0 text-right">
            <button
              disabled={isRsvpd}
              onClick={() => setRsvps(prev => ({ ...prev, [event.id]: true }))}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all shadow-sm ${
                isRsvpd ? "bg-green-100 text-green-700 cursor-default" : "bg-[#002147] hover:bg-[#003875] text-white"
              }`}
            >
              {isRsvpd ? "✓ Going" : "RSVP"}
            </button>
            {(event.rsvpCount || 0) > 0 && (
              <p className="text-[9px] text-gray-400 mt-1">{event.rsvpCount} going</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
