"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { notificationService } from "../../src/services/api/notification.service";

// Icons
const BellIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const CheckIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const InfoIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const AlertIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

function typeIcon(type) {
  if (type === "success") return <CheckIcon size={14} className="text-green-500" />;
  if (type === "warning") return <AlertIcon size={14} className="text-amber-500" />;
  if (type === "error") return <AlertIcon size={14} className="text-red-500" />;
  return <InfoIcon size={14} className="text-blue-500" />;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      const list = Array.isArray(data) ? data : (data?.notifications || data?.data || []);
      setNotifications(list);
    } catch { setNotifications([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read && !n.read_at).length;

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n));
    } catch {}
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read && !n.read_at);
    await Promise.allSettled(unread.map((n) => notificationService.markAsRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, read_at: n.read_at || new Date().toISOString() })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open) loadNotifications(); }}
        className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-[#002147] transition-colors"
        aria-label="Notifications"
      >
        <BellIcon size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-[#002147]">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <BellIcon size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs text-gray-500">No notifications yet.</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => {
                const isRead = n.read || n.read_at;
                return (
                  <button
                    key={n.id}
                    onClick={() => { if (!isRead) markRead(n.id); }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 last:border-0 ${
                      isRead ? "bg-white" : "bg-blue-50/40 hover:bg-blue-50/60"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${isRead ? "text-gray-600" : "text-gray-800 font-medium"}`}>
                        {n.title && <span className="font-semibold">{n.title}: </span>}
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
