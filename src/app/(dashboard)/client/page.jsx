// Client Dashboard (Veteran) for WANAC Coaching Platform with Community & Messaging
import Link from 'next/link';
import {
  FaUser,
  FaCalendarCheck,
  FaPenFancy,
  FaBrain,
  FaChartLine,
  FaBookOpen,
  FaHandsHelping,
  FaUsers,
  FaEnvelopeOpenText,
} from 'react-icons/fa';

export default function ClientDashboard() {
  return (
    <section className="min-h-screen bg-brand-blue flex">
      {/* Client Dashboard Content */}
      <main className="flex-1 px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Session */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaCalendarCheck /> Upcoming Session
            </h2>
            <p className="text-brand-blue text-sm">Coach: Sarah Smith</p>
            <p className="text-brand-blue text-sm">Date: Apr 6, 2025 – 11:00AM</p>
            <button className="mt-4 bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
              View Session
            </button>
          </div>

          {/* Journal Entry */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaPenFancy /> Journal
            </h2>
            <p className="text-brand-blue text-sm mb-4">Reflect on your thoughts and progress.</p>
            <button className="bg-brand-navy text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Write Now
            </button>
          </div>

          {/* AI Assistant */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaBrain /> AI Assistant
            </h2>
            <p className="italic text-brand-blue">"Take a moment to list 3 things you're grateful for today."</p>
            <button className="mt-3 text-sm text-brand-orange hover:underline">
              Ask More
            </button>
          </div>

          {/* Life Score */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaChartLine /> Life Score
            </h2>
            <p className="text-brand-blue text-sm mb-2">Track your weekly well-being and growth.</p>
            <button className="bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
              View Life Score
            </button>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaBookOpen /> Library
            </h2>
            <p className="text-brand-blue text-sm mb-2">Read guides and watch videos from your coach.</p>
            <button className="bg-brand-navy text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Explore Library
            </button>
          </div>

          {/* My Coach */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaHandsHelping /> My Coach
            </h2>
            <p className="text-brand-blue text-sm mb-2">Get in touch or learn more about your coach.</p>
            <button className="bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
              View Coach Profile
            </button>
          </div>

          {/* Community */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaUsers /> Community
            </h2>
            <p className="text-brand-blue text-sm mb-2">Connect with other clients on the platform.</p>
            <button className="bg-brand-navy text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Join Discussion
            </button>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-transform duration-300">
            <h2 className="text-xl font-semibold text-brand-navy mb-2 flex items-center gap-2">
              <FaEnvelopeOpenText /> Messages
            </h2>
            <p className="text-brand-blue text-sm mb-2">Check your messages from your coach or community.</p>
            <button className="bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-500 transition">
              Open Inbox
            </button>
          </div>

        </div>
      </main>
    </section>
  );
}
