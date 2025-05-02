// ✅ Coach Dashboard for WANAC Coaching Platform with sidebar navigation
import Link from 'next/link';
import { FaUser, FaHome, FaCalendarCheck, FaEnvelope, FaBook, FaComments, FaCog, FaBrain, FaPenFancy, FaUsers, FaClipboardList, FaClock, FaBookOpen } from 'react-icons/fa';

export default function CoachDashboard() {
  return (
    <section className="min-h-screen bg-brand-blue flex">
      

      {/* Coach Dashboard Content */}
      <main className="flex-1 px-6 py-10">
       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Next Session Overview */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
              <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
                <FaCalendarCheck /> Next Session
              </h2>
              <p className="text-brand-blue text-sm">With: John Doe</p>
              <p className="text-brand-blue text-sm">Date: Apr 5, 2025 – 3:00PM</p>
              <button className="mt-4 bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
                View Details
              </button>
            </div>

            {/* Session Notes */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
              <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
                <FaClipboardList /> Session Notes
              </h2>
              <p className="text-brand-blue text-sm mb-4">Add or review coaching session notes.</p>
              <button className="bg-brand-navy text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                Go to Notes
              </button>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
              <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
                <FaComments /> AI Suggestions
              </h2>
              <p className="italic text-brand-blue">"Encourage your client to reflect on weekly energy levels."</p>
              <button className="mt-3 text-sm text-brand-orange hover:underline">See More Suggestions</button>
            </div>

            {/* Coach Calendar */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
              <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
                <FaClock /> Your Calendar
              </h2>
              <p className="text-brand-blue text-sm mb-2">View and manage availability</p>
              <button className="bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
                Open Calendar
              </button>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
              <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
                <FaBookOpen /> Resources
              </h2>
              <p className="text-brand-blue text-sm mb-2">Access coaching materials and tools.</p>
              <button className="bg-brand-navy text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                Go to Library
              </button>
            </div>
          </div>
        
      </main>
    </section>
  );
}
