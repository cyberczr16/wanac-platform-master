import { FaCalendar, FaPenFancy, FaRobot, FaChartLine, FaUsers } from 'react-icons/fa';

const sidebarLinks = [
  { icon: FaCalendar, label: 'Sessions', href: '/(dashboard)/appointments' },
  { icon: FaPenFancy, label: 'Journal', href: '/(dashboard)/journal' },
  { icon: FaRobot, label: 'AI Assistant', href: '/(dashboard)/aichatbot' },
  { icon: FaChartLine, label: 'Life Score', href: '/(dashboard)/lifescore' },
  { icon: FaUsers, label: 'Breakout Room', href: '/client/breakoutroom' },
];

export default function Sidebar() {
  return (
    <div className="group fixed top-0 left-0 h-full z-20 flex flex-col bg-white shadow-lg transition-all duration-200 w-16 hover:w-48">
      <div className="flex-1 flex flex-col gap-2 py-6">
        {sidebarLinks.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon className="text-xl text-blue-600" />
            <span className="text-gray-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
} 