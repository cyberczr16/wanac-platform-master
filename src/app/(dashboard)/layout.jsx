'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FaUser,
  FaHome,
  FaCalendarCheck,
  FaEnvelope,
  FaBook,
  FaBrain,
  FaPenFancy,
  FaUsers,
  FaCog,
  FaBars,
  FaTimes,
  FaChartBar,
  FaClipboardList,
  FaUserShield,
  FaUserCog,
  FaUserPlus,
  FaFileAlt,
  FaHandsHelping,
  FaGraduationCap,
  FaChartLine,
} from 'react-icons/fa';

const navItemsByRole = {
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: FaChartBar },
    { name: 'User Management', href: '/dashboard/admin/users', icon: FaUserCog },
    { name: 'Coach Directory', href: '/dashboard/admin/coaches', icon: FaUserShield },
    { name: 'Client Directory', href: '/dashboard/admin/clients', icon: FaUsers },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: FaFileAlt },
    { name: 'Resources', href: '/dashboard/admin/resources', icon: FaBook },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: FaCog },
  ],
  coach: [
    { name: 'Dashboard', href: '/dashboard/coachdashboard', icon: FaHome },
    { name: 'My Clients', href: '/dashboard/coachdashboard/clients', icon: FaUsers },
    { name: 'Appointments', href: '/dashboard/coachdashboard/appointments', icon: FaCalendarCheck },
    { name: 'Messages', href: '/dashboard/coachdashboard/messages', icon: FaEnvelope },
    { name: 'Resources', href: '/dashboard/coachdashboard/resources', icon: FaBook },
    { name: 'Client Progress', href: '/dashboard/coachdashboard/progress', icon: FaChartLine },
    { name: 'Training', href: '/dashboard/coachdashboard/training', icon: FaGraduationCap },
    { name: 'Settings', href: '/dashboard/coachdashboard/settings', icon: FaCog },
  ],
  client: [
    { name: 'Dashboard', href: '/dashboard', icon: FaHome },
    { name: 'My Coach', href: '/dashboard/my-coach', icon: FaHandsHelping },
    { name: 'Appointments', href: '/dashboard/bookings', icon: FaCalendarCheck },
    { name: 'Messages', href: '/dashboard/messages', icon: FaEnvelope },
    { name: 'Library', href: '/dashboard/library', icon: FaBook },
    { name: 'AI Chatbot', href: '/dashboard/ai-chatbot', icon: FaBrain },
    { name: 'Journal', href: '/dashboard/journal', icon: FaPenFancy },
    { name: 'Community', href: '/dashboard/community', icon: FaUsers },
    { name: 'Life Scores', href: '/dashboard/life-score', icon: FaChartLine },
    { name: 'Settings', href: '/dashboard/settings', icon: FaCog },
  ],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState('client');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserData = async () => {
      setTimeout(() => {
        if (pathname.includes('/admin')) {
          setUserRole('admin');
          setUserName('Admin User');
        } else if (pathname.includes('/coach')) {
          setUserRole('coach');
          setUserName('Coach Smith');
        } else {
          setUserRole('client');
          setUserName('Veteran Jones');
        }
      }, 100);
    };

    fetchUserData();
  }, [pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navItems = navItemsByRole[userRole] || navItemsByRole.client;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static md:translate-x-0 z-40 w-64 bg-white shadow-lg h-screen transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Company Logo Section */}
          <div className="flex justify-center mb-6 border-b pb-4">
            <div className="text-center">
              <Link href="/dashboard" className="inline-block">
                <Image 
                  src="/WANAC N 8 Old Glory.png" 
                  alt="WANAC Logo" 
                  width={200} 
                  height={80} 
                  className="mx-auto"
                  priority
                />
              </Link>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-700 text-white rounded-full p-2">
              <FaUser />
            </div>
            <div>
              <h2 className="font-semibold text-blue-700">{userName}</h2>
              <p className="text-sm text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-2 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 font-semibold'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <item.icon className="text-lg" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t pt-6">
            <button className="flex items-center gap-2 text-red-500 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        <div className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold text-blue-800">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </h1>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
