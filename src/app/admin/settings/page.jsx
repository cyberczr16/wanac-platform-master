"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  FaCogs, FaRegBell, FaUserShield, FaComments, FaRobot,
  FaCreditCard, FaUsers, FaBook, FaCalendarAlt, FaShieldAlt, FaUniversity,
} from "react-icons/fa";
import { CheckCircle } from "lucide-react";

// ─── Toggle Switch Component ──────────────────────────────────────────────────
function Toggle({ name, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() =>
        onChange({ target: { name, type: "checkbox", checked: !checked } })
      }
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Setting Row: label + description + toggle ────────────────────────────────
function ToggleRow({ label, description, name, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <Toggle name={name} checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <span className="text-[#002147]">{icon}</span>
        <h3 className="font-semibold text-[#002147] text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

// ─── Styled text input ────────────────────────────────────────────────────────
function Input({ label, hint, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <input
        {...props}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ─── Styled select ────────────────────────────────────────────────────────────
function Select({ label, hint, children, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <select
        {...props}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
      >
        {children}
      </select>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "platform",      label: "Platform",      icon: <FaUniversity size={15} /> },
  { key: "users",         label: "Users",          icon: <FaUsers size={15} /> },
  { key: "programs",      label: "Programs",       icon: <FaBook size={15} /> },
  { key: "sessions",      label: "Sessions",       icon: <FaCalendarAlt size={15} /> },
  { key: "notifications", label: "Notifications",  icon: <FaRegBell size={15} /> },
  { key: "ai",            label: "AI Assistant",   icon: <FaRobot size={15} /> },
  { key: "community",     label: "Community",      icon: <FaComments size={15} /> },
  { key: "security",      label: "Security",       icon: <FaShieldAlt size={15} /> },
  { key: "payments",      label: "Payments",       icon: <FaCreditCard size={15} /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("platform");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);

  const [settings, setSettings] = useState({
    orgName: "WANAC Coaching Platform",
    contactEmail: "admin@wanac.org",
    enableRegistration: true,
    defaultUserRole: "Client",
    passwordMinLength: 8,
    wanacPrograms: {
      PLCA: true,
      PLEP: true,
      PPC: true,
      CPPC: true,
      Vetrepreneurship: true,
    },
    sessionDuration: 60,
    enableBooking: true,
    maxSessionsPerWeek: 3,
    emailNotifications: true,
    smsNotifications: false,
    aiAssistant: true,
    aiInsights: true,
    communityForum: true,
    chatFeature: true,
    require2FA: false,
    privacyPolicy: "https://wanac.org/privacy",
    enablePayments: false,
    stripeKey: "",
    subscriptionPlans: "Basic, Premium, Pro",
  });

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch { setUser(null); }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("wanacPrograms.")) {
      const prog = name.split(".")[1];
      setSettings((prev) => ({
        ...prev,
        wanacPrograms: { ...prev.wanacPrograms, [prog]: checked },
      }));
    } else if (type === "checkbox") {
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ─── Tab content panels ─────────────────────────────────────────────────────
  const panels = {
    platform: (
      <Card title="Platform Info" icon={<FaUniversity />}>
        <Input
          label="Organization Name"
          type="text"
          name="orgName"
          value={settings.orgName}
          onChange={handleChange}
        />
        <Input
          label="Contact Email"
          type="email"
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleChange}
        />
      </Card>
    ),

    users: (
      <Card title="User Management" icon={<FaUsers />}>
        <ToggleRow
          label="Enable New User Registrations"
          description="Allow new users to sign up on the platform."
          name="enableRegistration"
          checked={settings.enableRegistration}
          onChange={handleChange}
        />
        <div className="pt-4">
          <Select
            label="Default User Role"
            hint="Role automatically assigned to new sign-ups."
            name="defaultUserRole"
            value={settings.defaultUserRole}
            onChange={handleChange}
          >
            <option value="Client">Client</option>
            <option value="Coach">Coach</option>
            <option value="Admin">Admin</option>
          </Select>
          <Input
            label="Password Minimum Length"
            hint="Minimum number of characters required for passwords."
            type="number"
            name="passwordMinLength"
            value={settings.passwordMinLength}
            min={6}
            max={32}
            onChange={handleChange}
          />
        </div>
      </Card>
    ),

    programs: (
      <Card title="WANAC Programs" icon={<FaBook />}>
        <p className="text-xs text-gray-500 mb-4">Enable or disable individual programs available on the platform.</p>
        <div className="space-y-1">
          {Object.entries(settings.wanacPrograms).map(([prog, enabled]) => (
            <ToggleRow
              key={prog}
              label={prog}
              name={`wanacPrograms.${prog}`}
              checked={enabled}
              onChange={handleChange}
            />
          ))}
        </div>
      </Card>
    ),

    sessions: (
      <Card title="Session & Booking" icon={<FaCalendarAlt />}>
        <ToggleRow
          label="Enable Session Booking"
          description="Allow clients to schedule sessions with coaches."
          name="enableBooking"
          checked={settings.enableBooking}
          onChange={handleChange}
        />
        <div className="pt-4">
          <Input
            label="Default Session Duration (minutes)"
            hint="Duration applied when a coach does not specify one."
            type="number"
            name="sessionDuration"
            value={settings.sessionDuration}
            min={15}
            max={180}
            onChange={handleChange}
          />
          <Input
            label="Max Sessions Per User / Week"
            hint="Maximum number of bookable sessions per client per week."
            type="number"
            name="maxSessionsPerWeek"
            value={settings.maxSessionsPerWeek}
            min={1}
            max={10}
            onChange={handleChange}
          />
        </div>
      </Card>
    ),

    notifications: (
      <Card title="Notification Channels" icon={<FaRegBell />}>
        <ToggleRow
          label="Email Notifications"
          description="Send platform alerts and reminders via email."
          name="emailNotifications"
          checked={settings.emailNotifications}
          onChange={handleChange}
        />
        <ToggleRow
          label="SMS Notifications"
          description="Send platform alerts and reminders via SMS."
          name="smsNotifications"
          checked={settings.smsNotifications}
          onChange={handleChange}
        />
      </Card>
    ),

    ai: (
      <Card title="AI Assistant" icon={<FaRobot />}>
        <ToggleRow
          label="Enable AI Assistant"
          description="Make the AI assistant available across the platform."
          name="aiAssistant"
          checked={settings.aiAssistant}
          onChange={handleChange}
        />
        <ToggleRow
          label="Enable AI Insights"
          description="Show AI-generated insights and suggestions to users."
          name="aiInsights"
          checked={settings.aiInsights}
          onChange={handleChange}
        />
      </Card>
    ),

    community: (
      <Card title="Community & Chat" icon={<FaComments />}>
        <ToggleRow
          label="Enable Community Forums"
          description="Allow users to post and interact in community forums."
          name="communityForum"
          checked={settings.communityForum}
          onChange={handleChange}
        />
        <ToggleRow
          label="Enable Chat Features"
          description="Enable real-time messaging between users and coaches."
          name="chatFeature"
          checked={settings.chatFeature}
          onChange={handleChange}
        />
      </Card>
    ),

    security: (
      <Card title="Security & Privacy" icon={<FaShieldAlt />}>
        <ToggleRow
          label="Require 2FA for Admins"
          description="Enforce two-factor authentication on all admin accounts."
          name="require2FA"
          checked={settings.require2FA}
          onChange={handleChange}
        />
        <div className="pt-4">
          <Input
            label="Privacy Policy URL"
            hint="Link displayed in user-facing privacy notices."
            type="url"
            name="privacyPolicy"
            value={settings.privacyPolicy}
            onChange={handleChange}
          />
        </div>
      </Card>
    ),

    payments: (
      <Card title="Payment & Subscription" icon={<FaCreditCard />}>
        <ToggleRow
          label="Enable Payments"
          description="Activate the payment gateway for subscription billing."
          name="enablePayments"
          checked={settings.enablePayments}
          onChange={handleChange}
        />
        <div className="pt-4">
          <Input
            label="Stripe API Key"
            hint="Your Stripe secret key for processing payments."
            type="text"
            name="stripeKey"
            value={settings.stripeKey}
            placeholder="sk_live_..."
            onChange={handleChange}
          />
          <Input
            label="Subscription Plans"
            hint="Comma-separated list of available plan names."
            type="text"
            name="subscriptionPlans"
            value={settings.subscriptionPlans}
            onChange={handleChange}
          />
        </div>
      </Card>
    ),
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* ── Top Bar ── */}
        <nav className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <FaCogs className="text-blue-600 text-lg" />
            <span className="font-semibold text-[#002147] text-base">Admin Settings</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Save feedback */}
            {saved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium animate-fade-in">
                <CheckCircle size={15} /> Saved successfully
              </span>
            )}
            <button
              onClick={handleSave}
              className="bg-[#002147] hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-150 shadow-sm"
            >
              Save Changes
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
              <FaUserShield className="text-gray-500 text-lg" />
              <span className="text-sm font-medium text-gray-700">{user ? user.name : "Admin"}</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* ── Page heading ── */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#002147]">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">Manage platform-wide configurations and feature toggles.</p>
            </div>

            {/* ── Tab bar ── */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm mb-8 flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-[#002147] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Active panel ── */}
            <div className="max-w-2xl">
              {panels[activeTab]}

              {/* ── Bottom save button ── */}
              <div className="flex items-center justify-end gap-3 mt-2">
                {saved && (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <CheckCircle size={14} /> Changes saved
                  </span>
                )}
                <button
                  onClick={handleSave}
                  className="bg-[#002147] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
