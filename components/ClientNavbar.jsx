import { FaBell, FaUserCircle } from 'react-icons/fa';

export default function ClientNavbar({ user }) {
  return (
    <nav className="flex items-center justify-between bg-white px-4 py-4 border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-blue-700 tracking-tight">WanaC Platform</span>
        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Client</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative focus:outline-none group">
          <FaBell className="text-xl text-gray-500 group-hover:text-blue-600 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">2</span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded transition">
          <FaUserCircle className="text-2xl text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{user ? user.name : ''}</span>
        </div>
      </div>
    </nav>
  );
} 