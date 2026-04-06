"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, BarChart2, LogOut, Users, Calendar, HeartPulse,
  BookOpen, CheckSquare, Brain, MessageCircle, Bot, UserCog,
  Briefcase, GraduationCap, Video, Menu as MenuIcon, X, UserCheck
} from 'lucide-react'
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { useState, useEffect, useCallback, memo } from 'react'
import { useDashboardMobile } from '@/contexts/DashboardMobileContext'

// -------------------- NAV GROUPS --------------------
export const navGroups = [
  {
    label: null,
    items: [
      { name: "Dashboard", href: "/client/dashboard", icon: <Home size={18} /> },
    ],
  },
  {
    label: "Health & Progress",
    items: [
      { name: "Calendar", href: "/client/calendar", icon: <Calendar size={18} /> },
      { name: "Lifescores", href: "/client/lifescores", icon: <HeartPulse size={18} /> },
      { name: "Journal", href: "/client/journal", icon: <BookOpen size={18} /> },
      { name: "Task Management", href: "/client/taskmanagement", icon: <CheckSquare size={18} /> },
    ],
  },
  {
    label: "Learning & Growth",
    items: [
      { name: "AI Insights", href: "/client/aiinsights", icon: <Brain size={18} /> },
      { name: "AI Chat Bot", href: "/client/aichatbot", icon: <Bot size={18} /> },
      { name: "Career Compass", href: "/client/mycareercompass", icon: <Briefcase size={18} /> },
      { name: "Education Compass", href: "/client/myeducationcompass", icon: <GraduationCap size={18} /> },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Fireteam", href: "/client/fireteam", icon: <Users size={18} /> },
      { name: "Community", href: "/client/community", icon: <MessageCircle size={18} /> },
      { name: "Students", href: "/client/students", icon: <UserCheck size={18} /> },
      { name: "Sessions", href: "/client/session", icon: <Video size={18} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Reports", href: "/client/reports", icon: <BarChart2 size={18} /> },
      { name: "Account Settings", href: "/client/accountsettings", icon: <UserCog size={18} /> },
    ],
  },
];

// Flat list kept for backward compatibility with any existing imports
export const navItems = navGroups.flatMap((g) => g.items);

// -------------------- SIDEBAR ITEM --------------------
const SidebarItem = memo(function SidebarItem({ item, isOpen, active, onClick }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-2.5 px-2 py-2 rounded-md text-xs font-medium transition-all duration-150
        ${active
          ? "bg-blue-50 text-blue-600 border-l-[3px] border-blue-500 pl-[5px]"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent pl-[5px]"
        }
        ${isOpen ? "" : "justify-center"} group`}
    >
      <span className="shrink-0">{item.icon}</span>
      {isOpen && <span className="truncate">{item.name}</span>}
      {/* Tooltip when collapsed */}
      {!isOpen && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none shadow-lg">
          {item.name}
        </span>
      )}
    </Link>
  );
});

// -------------------- SECTION LABEL --------------------
function SectionLabel({ label, isOpen }) {
  if (!label || !isOpen) return null;
  return (
    <p className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 truncate select-none">
      {label}
    </p>
  );
}

// -------------------- SIDEBAR --------------------
export default function Sidebar({ collapsed: collapsedProp, setCollapsed: setCollapsedProp }) {
  const pathname = usePathname();
  const router = useRouter();
  const mobileCtx = useDashboardMobile();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = mobileCtx ? mobileCtx.mobileOpen : internalMobileOpen;
  const setMobileOpen = mobileCtx ? mobileCtx.setMobileOpen : setInternalMobileOpen;

  // Collapsed state (falls back to internal if not controlled by parent)
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;
  const setCollapsed = setCollapsedProp || setInternalCollapsed;

  // Hover + pin states
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  // User info for profile footer
  const [userName, setUserName] = useState("");

  // Load persisted preferences
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (collapsedProp === undefined) {
      const storedCollapsed = localStorage.getItem("wanacSidebarCollapsed");
      if (storedCollapsed !== null) setInternalCollapsed(storedCollapsed === "true");
    }
    const storedPinned = localStorage.getItem("wanacSidebarPinned");
    if (storedPinned !== null) setPinned(storedPinned === "true");

    // Read user name from localStorage
    try {
      const raw = localStorage.getItem("wanacUser");
      if (raw) {
        const user = JSON.parse(raw);
        const name = user?.name || user?.firstName || user?.email || "";
        setUserName(name);
      }
    } catch (_) {}
  }, [collapsedProp]);

  // Persist collapsed state
  useEffect(() => {
    if (collapsedProp === undefined && typeof window !== "undefined") {
      localStorage.setItem("wanacSidebarCollapsed", String(internalCollapsed));
    }
  }, [internalCollapsed, collapsedProp]);

  // Persist pinned state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wanacSidebarPinned", String(pinned));
    }
  }, [pinned]);

  const handleLogout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wanacUser");
    }
    router.push("/login");
  }, [router]);

  const handleToggleCollapse = useCallback(() => {
    setPinned(false);
    setCollapsed((prev) => !prev);
  }, [setCollapsed]);

  const handleTogglePin = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      // When pinning, also make sure sidebar is not collapsed
      if (next) setCollapsed(false);
      return next;
    });
  }, [setCollapsed]);

  // Sidebar is "open" (wide) if: pinned, or not collapsed, or hovered while collapsed
  const isOpen = pinned || !collapsed || (collapsed && hovered);

  return (
    <>
      {/* ---- MOBILE OVERLAY ---- */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ---- MOBILE DRAWER ---- */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col h-screen w-60 fixed top-0 left-0 z-50 md:hidden transition-transform duration-300 ease-out shadow-xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
        }`}
        role="navigation"
        aria-label="Sidebar navigation"
        aria-modal="true"
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <Image
            src="/WANAC N 8 Old Glory.svg"
            alt="WANAC"
            width={100}
            height={22}
            className="object-contain h-6 w-auto"
          />
          <button
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-2" aria-label="Main navigation">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 select-none">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors border-l-[3px] ${
                    pathname.startsWith(item.href)
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Mobile footer */}
        <div className="p-3 border-t border-gray-100 shrink-0 space-y-1">
          {userName && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-700 font-medium truncate">{userName}</span>
            </div>
          )}
          <button
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full rounded-md transition-colors"
            onClick={() => { setMobileOpen(false); handleLogout(); }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ---- DESKTOP SIDEBAR ---- */}
      <aside
        className={`bg-white border-r border-gray-200 flex-col h-screen transition-[width] duration-300 ease-in-out ${
          isOpen ? "w-56" : "w-14"
        } hidden md:flex md:static md:z-0 shrink-0`}
        role="navigation"
        aria-label="Sidebar navigation"
        tabIndex={-1}
        onMouseEnter={() => collapsed && !pinned && setHovered(true)}
        onMouseLeave={() => collapsed && !pinned && setHovered(false)}
      >
        {/* Logo row */}
        <div className={`px-3 py-3 flex items-center border-b border-gray-100 shrink-0 ${isOpen ? "justify-between" : "justify-center"}`}>
          {isOpen ? (
            <>
              <Image
                src="/WANAC N 8 Old Glory.svg"
                alt="WANAC"
                width={100}
                height={22}
                className="object-contain h-6 w-auto"
              />
              {/* Pin button — only shown when expanded */}
              <button
                className={`ml-1 p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  pinned ? "text-blue-500 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-100"
                }`}
                aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
                onClick={handleTogglePin}
              >
                {pinned
                  ? <PushPinIcon style={{ fontSize: 16 }} />
                  : <PushPinOutlinedIcon style={{ fontSize: 16 }} />}
              </button>
            </>
          ) : (
            <span className="sr-only">WANAC</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-2 px-1.5 space-y-0.5" aria-label="Main navigation">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              <SectionLabel label={group.label} isOpen={isOpen} />
              {group.items.map((item) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  isOpen={isOpen}
                  active={pathname.startsWith(item.href)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Footer: toggle + user + logout */}
        <div className="shrink-0 border-t border-gray-100">
          {/* Collapse / expand toggle */}
          <div className={`flex ${isOpen ? "justify-end" : "justify-center"} px-2 pt-2`}>
            <button
              className="bg-blue-500 text-white rounded-full p-1.5 shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center min-w-[32px] min-h-[32px] transition-colors"
              aria-label={collapsed && !pinned ? "Expand sidebar" : "Collapse sidebar"}
              onClick={handleToggleCollapse}
            >
              {isOpen ? <X size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>

          {/* User profile */}
          {userName && isOpen && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-700 font-medium truncate">{userName}</span>
            </div>
          )}

          {/* Logout */}
          <div className="p-2">
            <button
              className={`flex items-center gap-2 px-2 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full rounded-md transition-colors ${
                isOpen ? "" : "justify-center"
              }`}
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut size={16} />
              {isOpen && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
