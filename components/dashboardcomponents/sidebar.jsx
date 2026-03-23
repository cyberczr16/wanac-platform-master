"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Home, BarChart2, LogOut, Users, Calendar, HeartPulse, BookOpen, CheckSquare, Brain, MessageCircle, Bot, UserCog, Briefcase, GraduationCap, Video, Menu as MenuIcon, X } from 'lucide-react'
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { useState, useEffect } from 'react'
import { useDashboardMobile } from '@/contexts/DashboardMobileContext'

// -------------------- NAV ITEMS --------------------
export const navItems = [
  { name: "Dashboard", href: "/client/dashboard", icon: <Home size={18} /> },
  { name: "Calendar", href: "/client/calendar", icon: <Calendar size={18} /> },
  { name: "Lifescores", href: "/client/lifescores", icon: <HeartPulse size={18} /> },
  { name: "Journal", href: "/client/journal", icon: <BookOpen size={18} /> },
  { name: "Fireteam", href: "/client/fireteam", icon: <Users size={18} /> },
  { name: "Task Management", href: "/client/taskmanagement", icon: <CheckSquare size={18} /> },
  { name: "AI Insights", href: "/client/aiinsights", icon: <Brain size={18} /> },
  { name: "Community", href: "/client/community", icon: <MessageCircle size={18} /> },
  { name: "AI Chat Bot", href: "/client/aichatbot", icon: <Bot size={18} /> },
  { name: "Students", href: "/client/students", icon: <Users size={18} /> },
  { name: "Account Settings", href: "/client/accountsettings", icon: <UserCog size={18} /> },
  { name: "Sessions", href: "/client/session", icon: <Video size={18} /> },
  { name: "My Career Compass", href: "/client/mycareercompass", icon: <Briefcase size={18} /> },
  { name: "My Education Compass", href: "/client/myeducationcompass", icon: <GraduationCap size={18} /> },
  { name: "Reports", href: "/client/reports", icon: <BarChart2 size={18} /> },
];

// -------------------- SIDEBAR ITEM COMPONENT --------------------
function SidebarItem({ item, isOpen, active, onClick }) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-all
        ${active ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
        ${isOpen ? "" : "justify-center"} group`}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {item.icon}
      {isOpen && item.name}
      {/* Tooltip for collapsed */}
      {!isOpen && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
          {item.name}
        </span>
      )}
    </Link>
  );
}

// -------------------- SIDEBAR COMPONENT --------------------
export default function Sidebar({ collapsed: collapsedProp, setCollapsed: setCollapsedProp }) {
  const pathname = usePathname();
  const router = useRouter();
  const mobileCtx = useDashboardMobile();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = mobileCtx ? mobileCtx.mobileOpen : internalMobileOpen;
  const setMobileOpen = mobileCtx ? mobileCtx.setMobileOpen : setInternalMobileOpen;

  // If no props provided, use internal state (fallback for backward compatibility)
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;
  const setCollapsed = setCollapsedProp || setInternalCollapsed;

  // collapsed: user's preference; hovered: current mouse state
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false);

  // Load collapsed state from localStorage if uncontrolled
  useEffect(() => {
    if (collapsedProp === undefined && typeof window !== "undefined") {
      const stored = localStorage.getItem("wanacSidebarCollapsed");
      if (stored !== null) setInternalCollapsed(stored === "true");
    }
  }, [collapsedProp]);

  useEffect(() => {
    if (collapsedProp === undefined && typeof window !== "undefined") {
      localStorage.setItem("wanacSidebarCollapsed", internalCollapsed);
    }
  }, [internalCollapsed, collapsedProp]);

  // Logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wanacUser");
    }
    router.push("/login");
  };

  const isOpen = !collapsed || (collapsed && (hovered || pinned));

  return (
    <>
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      {/* Mobile drawer: slide from left with close button; when closed, translate fully off-screen so cancel icon doesn't remain visible */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col h-screen w-56 fixed top-0 left-0 z-50 md:hidden transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'}`}
        role="navigation"
        aria-label="Sidebar"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-100 shrink-0">
          <Image
            src="/WANAC N 8 Old Glory.svg"
            alt="WANAC"
            width={100}
            height={22}
            className="object-contain h-6 w-auto"
          />
          <button
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 min-h-0 overflow-y-auto py-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium transition-colors rounded-none ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-100 shrink-0">
          <button
            className="flex items-center gap-2 px-2 py-2.5 text-sm text-gray-600 hover:bg-gray-100 w-full rounded-md"
            onClick={() => { setMobileOpen(false); handleLogout(); }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
      {/* Sidebar for desktop */}
      <aside
        className={`bg-white border-r border-gray-200 flex-col h-screen transition-[width] duration-300 ease-in-out ${
          isOpen ? "w-56" : "w-16"
        } hidden md:flex md:static md:z-0`}
        role="navigation"
        aria-label="Sidebar"
        tabIndex={-1}
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => collapsed && setHovered(false)}
      >
        <div className={`p-3 flex items-center ${isOpen ? 'ml-2' : 'justify-center'}`}>
          {!isOpen && <span className="sr-only">WANAC</span>}
          <Image
            src="/WANAC N 8 Old Glory.svg"
            alt="WANAC"
            width={isOpen ? 100 : 48}
            height={isOpen ? 22 : 11}
            className={`object-contain w-auto ${isOpen ? 'h-6' : 'h-8'}`}
          />
        </div>
        <nav className="flex-1 py-1 space-y-0.5">
          {navItems.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              isOpen={isOpen}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>
        {/* Toggle button below nav items */}
        <div className={`flex justify-${isOpen ? 'end' : 'center'} px-2 pb-2 min-w-0 overflow-hidden`}>
          <button
            className="bg-blue-500 text-white rounded-full p-1.5 shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-1 min-w-[44px] shrink-0 overflow-hidden"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            <span className="flex items-center justify-center shrink-0" key={isOpen ? 'close' : 'menu'}>
              {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </span>
            {/* Material UI pin icon to indicate pinned state */}
            {!collapsed ? <PushPinIcon style={{ fontSize: 16 }} /> : <PushPinOutlinedIcon style={{ fontSize: 16 }} />}
          </button>
        </div>

        {/* LOGOUT */}
        <div className="p-2 border-t flex flex-col gap-1">
          <button
            className={`flex items-center gap-2 px-2 py-2 text-xs text-gray-600 hover:bg-gray-100 w-full rounded-md ${
              isOpen ? "" : "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {isOpen && "Log Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
