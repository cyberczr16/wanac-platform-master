"use client";

import { useState, useEffect } from "react";
import {
  FaUser,
  FaBell,
  FaBriefcase,
  FaShieldAlt,
  FaPencilAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaStar,
  FaRocket,
  FaGem,
  FaLock,
  FaMobile,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Sidebar from "../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { profileService } from "../../../services/api/profile.service";

/* ── Constants ─────────────────────────────────────────────────────────────── */
const SETTINGS_TABS = [
  { id: "profile",       label: "Edit Profile",       icon: FaUser },
  { id: "notifications", label: "Notifications",      icon: FaBell },
  { id: "plan",          label: "Choose Plan",         icon: FaBriefcase },
  { id: "password",      label: "Password & Security", icon: FaShieldAlt },
];

const PLANS = [
  {
    id: "basic",
    label: "Basic",
    price: "Free",
    icon: FaStar,
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    activeBorder: "border-gray-400",
    features: ["1 coaching session / month", "Journal access", "Life Score tracking", "Community read-only"],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$29/mo",
    icon: FaRocket,
    color: "text-[#9A6AE3]",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBorder: "border-[#9A6AE3]",
    popular: true,
    features: ["4 coaching sessions / month", "FireTeam access", "AI Assistant", "Full community access", "Detailed insights"],
  },
  {
    id: "premium",
    label: "Premium",
    price: "$59/mo",
    icon: FaGem,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBorder: "border-amber-500",
    features: ["Unlimited sessions", "Priority coach matching", "Career & education compass", "Custom life-score analytics", "Dedicated success manager"],
  },
];

const DEFAULT_PROFILE = {
  firstName: "", lastName: "", email: "",
  phone: "", address: "", city: "", state: "", zipCode: "", country: "",
};

function parseName(fullName) {
  if (!fullName || typeof fullName !== "string") return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  return parts.length <= 1
    ? { firstName: parts[0] || "", lastName: "" }
    : { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/* ── Shared input style ─────────────────────────────────────────────────────── */
const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9A6AE3]/30 focus:border-[#9A6AE3] transition-colors";

/* ── Toggle switch ──────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#9A6AE3]" : "bg-gray-200"}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

/* ── Section header ─────────────────────────────────────────────────────────── */
function SectionHeader({ children }) {
  return (
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{children}</p>
  );
}

/* ── Field wrapper ──────────────────────────────────────────────────────────── */
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function AccountSettingsPage() {
  const [collapsed, setCollapsed]         = useState(false);
  const [user, setUser]                   = useState(null);
  const [activeTab, setActiveTab]         = useState("profile");
  const [profile, setProfile]             = useState({ ...DEFAULT_PROFILE });
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [success, setSuccess]             = useState("");
  const [error, setError]                 = useState("");

  // Password tab state (separate from profile)
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]   = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    session_reminders: true,
    fireteam_updates: true,
    community_activity: false,
    coach_messages: true,
    weekly_digest: true,
    sms: false,
    push: false,
  });

  // Plan
  const [selectedPlan, setSelectedPlan] = useState("basic");

  /* ── Load profile ── */
  useEffect(() => {
    const stored = localStorage.getItem("wanacUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        const { firstName, lastName } = parseName(parsed?.name);
        setProfile(p => ({
          ...p,
          firstName: firstName || p.firstName,
          lastName:  lastName  || p.lastName,
          email:     parsed?.email   ?? p.email,
          phone:     parsed?.phone   ?? p.phone,
          address:   parsed?.address ?? p.address,
          city:      parsed?.city    ?? p.city,
          state:     parsed?.state   ?? p.state,
          zipCode:   parsed?.zipCode ?? p.zipCode,
          country:   parsed?.country ?? p.country,
        }));
      } catch { setUser(null); }
    }
    profileService.getProfile()
      .then((data) => {
        const { firstName, lastName } = parseName(data?.name);
        setProfile(p => ({
          ...p,
          firstName: firstName || p.firstName,
          lastName:  lastName  || p.lastName,
          email:     data?.email   ?? p.email,
          phone:     data?.phone   ?? p.phone,
          address:   data?.address ?? p.address,
          city:      data?.city    ?? p.city,
          state:     data?.state   ?? p.state,
          zipCode:   data?.zipCode ?? p.zipCode,
          country:   data?.country ?? p.country,
        }));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  /* ── Auto-clear messages ── */
  useEffect(() => {
    if (!success && !error) return;
    const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
    return () => clearTimeout(t);
  }, [success, error]);

  /* ── Handlers ── */
  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = {
      name:    [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim(),
      email:   profile.email,
      phone:   profile.phone   || undefined,
      address: profile.address || undefined,
      city:    profile.city    || undefined,
      state:   profile.state   || undefined,
      zipCode: profile.zipCode || undefined,
      country: profile.country || undefined,
    };
    try {
      const updated = await profileService.updateProfile(payload);
      const stored = localStorage.getItem("wanacUser");
      const existing = stored ? JSON.parse(stored) : {};
      const next = { ...existing, ...updated, ...payload };
      localStorage.setItem("wanacUser", JSON.stringify(next));
      setUser(next);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      setError(msg ? String(msg) : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.next.trim()) { setError("Please enter a new password."); return; }
    if (pwForm.next !== pwForm.confirm) { setError("Passwords do not match."); return; }
    if (pwForm.next.length < 8) { setError("Password must be at least 8 characters."); return; }
    setPwSaving(true);
    setError("");
    setSuccess("");
    try {
      await profileService.updateProfile({ password: pwForm.next });
      setPwForm({ current: "", next: "", confirm: "" });
      setSuccess("Password updated successfully!");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setError(msg ? String(msg) : "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  const profileImage = user?.profile_image || user?.profilePic || null;
  const initials = [profile.firstName, profile.lastName]
    .map(s => (s && s[0]) || "").join("").toUpperCase() || "?";

  /* ── Render ── */
  return (
    <div className="h-screen flex bg-[#f5f5f5]" style={{ fontFamily: "var(--font-body)" }}>
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-w-0 flex flex-col h-full transition-all duration-300">
        <ClientTopbar user={user} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-8 py-6 min-w-0">
          <div className="max-w-5xl mx-auto">

            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                Account Settings
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage your profile, notifications, plan and security.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-5">

              {/* ── Left nav ── */}
              <nav className="w-full md:w-52 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1.5">
                  {SETTINGS_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors mb-0.5 last:mb-0 ${
                          active
                            ? "bg-[#9A6AE3] text-white font-semibold shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 font-medium"
                        }`}
                      >
                        <Icon className={`text-sm flex-shrink-0 ${active ? "text-white" : "text-gray-400"}`} />
                        <span className="flex-1 leading-tight">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1.5 mt-3">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
                  >
                    <FaSignOutAlt className="text-sm flex-shrink-0 text-red-400" />
                    <span>Sign out</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-red-400 hover:bg-red-50 font-medium transition-colors"
                  >
                    <FaTrashAlt className="text-xs flex-shrink-0 text-red-300" />
                    <span>Delete account</span>
                  </button>
                </div>
              </nav>

              {/* ── Right panel ── */}
              <div className="flex-1 min-w-0">

                {/* ── PROFILE TAB ── */}
                {activeTab === "profile" && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                      Edit Profile
                    </h2>

                    {loading ? (
                      <div className="space-y-4">
                        {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile} className="space-y-6">

                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                          <div className="relative group flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                              {profileImage ? (
                                <img src={profileImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl font-bold text-[#9A6AE3]">{initials}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#9A6AE3] text-white flex items-center justify-center shadow hover:bg-purple-600 transition-colors"
                              aria-label="Edit profile picture"
                            >
                              <FaPencilAlt className="text-[10px]" />
                            </button>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {[profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Your Name"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{profile.email || "your@email.com"}</p>
                            <button type="button" className="mt-1 text-xs text-[#9A6AE3] font-semibold hover:underline">
                              Change photo
                            </button>
                          </div>
                        </div>

                        {/* Personal Info */}
                        <div>
                          <SectionHeader>Personal Information</SectionHeader>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="First Name" required>
                              <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} className={inputCls} placeholder="First name" />
                            </Field>
                            <Field label="Last Name">
                              <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} className={inputCls} placeholder="Last name" />
                            </Field>
                            <Field label="Email Address" required>
                              <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                <input type="email" name="email" value={profile.email} onChange={handleChange} className={`${inputCls} pl-8`} required />
                              </div>
                            </Field>
                            <Field label="Phone Number">
                              <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="e.g. 661-724-7734" className={`${inputCls} pl-8`} />
                              </div>
                            </Field>
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <SectionHeader>Location</SectionHeader>
                          <div className="space-y-3">
                            <Field label="Street Address">
                              <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                <input type="text" name="address" value={profile.address} onChange={handleChange} placeholder="Street address" className={`${inputCls} pl-8`} />
                              </div>
                            </Field>
                            <div className="grid grid-cols-3 gap-3">
                              <Field label="City">
                                <input type="text" name="city" value={profile.city} onChange={handleChange} className={inputCls} />
                              </Field>
                              <Field label="State">
                                <input type="text" name="state" value={profile.state} onChange={handleChange} placeholder="e.g. New York" className={inputCls} />
                              </Field>
                              <Field label="Zip Code">
                                <input type="text" name="zipCode" value={profile.zipCode} onChange={handleChange} placeholder="11357" className={inputCls} />
                              </Field>
                            </div>
                            <Field label="Country">
                              <input type="text" name="country" value={profile.country} onChange={handleChange} placeholder="e.g. United States" className={inputCls} />
                            </Field>
                          </div>
                        </div>

                        {/* Feedback */}
                        {error && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            <span>⚠</span> {error}
                          </div>
                        )}
                        {success && (
                          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                            <FaCheck className="text-xs" /> {success}
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-[#9A6AE3] text-white text-sm font-semibold rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50 shadow-sm"
                          >
                            {saving ? "Saving…" : "Save Changes"}
                          </button>
                          <button type="button" className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* ── NOTIFICATIONS TAB ── */}
                {activeTab === "notifications" && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h2>
                    <p className="text-sm text-gray-400 mb-6">Choose what you want to be notified about.</p>

                    <div className="space-y-6">
                      {/* Email notifications */}
                      <div>
                        <SectionHeader>Email Notifications</SectionHeader>
                        <div className="space-y-0 rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                          {[
                            { key: "session_reminders", label: "Session Reminders", desc: "Get reminded before your upcoming coaching sessions" },
                            { key: "fireteam_updates",  label: "FireTeam Updates",  desc: "New posts, sessions and activity in your FireTeam" },
                            { key: "coach_messages",    label: "Coach Messages",    desc: "Direct messages from your assigned coach" },
                            { key: "community_activity",label: "Community Activity",desc: "Comments and replies in the community" },
                            { key: "weekly_digest",     label: "Weekly Digest",     desc: "A summary of your progress every Monday" },
                          ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">
                              <div className="min-w-0 pr-4">
                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                              </div>
                              <Toggle checked={notifs[key]} onChange={(v) => setNotifs(p => ({ ...p, [key]: v }))} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Other channels */}
                      <div>
                        <SectionHeader>Other Channels</SectionHeader>
                        <div className="space-y-0 rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                          {[
                            { key: "sms",  icon: FaMobile,  label: "SMS Notifications", desc: "Receive alerts via text message" },
                            { key: "push", icon: FaBell,    label: "Push Notifications", desc: "Browser and mobile push alerts" },
                          ].map(({ key, icon: Icon, label, desc }) => (
                            <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">
                              <div className="flex items-center gap-3 min-w-0 pr-4">
                                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Icon className="text-gray-400 text-xs" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{label}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                                </div>
                              </div>
                              <Toggle checked={notifs[key]} onChange={(v) => setNotifs(p => ({ ...p, [key]: v }))} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-6 px-6 py-2.5 bg-[#9A6AE3] text-white text-sm font-semibold rounded-full hover:bg-purple-600 transition-colors shadow-sm"
                      onClick={() => setSuccess("Notification preferences saved!")}
                    >
                      Save Preferences
                    </button>
                    {success && (
                      <span className="ml-3 text-sm text-emerald-600 font-medium">{success}</span>
                    )}
                  </div>
                )}

                {/* ── PLAN TAB ── */}
                {activeTab === "plan" && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Choose Your Plan</h2>
                    <p className="text-sm text-gray-400 mb-6">Upgrade or downgrade at any time. Changes apply from your next billing cycle.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const active = selectedPlan === plan.id;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                              active
                                ? `${plan.activeBorder} ${plan.bg} shadow-md`
                                : `${plan.border} bg-white hover:shadow-sm`
                            }`}
                          >
                            {plan.popular && (
                              <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#9A6AE3] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                                Most popular
                              </span>
                            )}
                            <div className={`w-9 h-9 rounded-xl ${plan.bg} border ${plan.border} flex items-center justify-center mb-3`}>
                              <Icon className={`text-sm ${plan.color}`} />
                            </div>
                            <p className="font-bold text-gray-900 text-sm">{plan.label}</p>
                            <p className={`text-lg font-black mt-0.5 ${plan.color}`}>{plan.price}</p>
                            <ul className="mt-3 space-y-1.5">
                              {plan.features.map((f) => (
                                <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                                  <FaCheck className={`text-[9px] mt-0.5 flex-shrink-0 ${plan.color}`} />
                                  {f}
                                </li>
                              ))}
                            </ul>
                            {active && (
                              <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${plan.color}`}>
                                <FaCheck className="text-[10px]" /> Current selection
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-[#9A6AE3] text-white text-sm font-semibold rounded-full hover:bg-purple-600 transition-colors shadow-sm"
                        onClick={() => setSuccess(`Switched to ${PLANS.find(p => p.id === selectedPlan)?.label} plan!`)}
                      >
                        Confirm Plan
                      </button>
                      {success && <span className="text-sm text-emerald-600 font-medium">{success}</span>}
                    </div>
                  </div>
                )}

                {/* ── PASSWORD & SECURITY TAB ── */}
                {activeTab === "password" && (
                  <div className="space-y-4">
                    {/* Change password */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Change Password</h2>
                      <p className="text-sm text-gray-400 mb-5">Use a strong password that you don't use anywhere else.</p>

                      <form onSubmit={handleSavePassword} className="space-y-4">
                        {/* Current password */}
                        <Field label="Current Password">
                          <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                            <input
                              type={showPw.current ? "text" : "password"}
                              value={pwForm.current}
                              onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                              placeholder="Enter current password"
                              className={`${inputCls} pl-8 pr-10`}
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPw.current ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                            </button>
                          </div>
                        </Field>

                        {/* New password */}
                        <Field label="New Password" hint="Minimum 8 characters">
                          <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                            <input
                              type={showPw.next ? "text" : "password"}
                              value={pwForm.next}
                              onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                              placeholder="Choose a new password"
                              className={`${inputCls} pl-8 pr-10`}
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, next: !p.next }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPw.next ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                            </button>
                          </div>
                          {/* Strength indicator */}
                          {pwForm.next && (
                            <div className="mt-2 flex gap-1">
                              {[1,2,3,4].map(i => {
                                const strength = pwForm.next.length < 8 ? 1 : pwForm.next.length < 12 ? 2 : /[^a-zA-Z0-9]/.test(pwForm.next) ? 4 : 3;
                                return (
                                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                    i <= strength
                                      ? strength <= 1 ? "bg-red-400" : strength <= 2 ? "bg-amber-400" : strength <= 3 ? "bg-blue-400" : "bg-emerald-400"
                                      : "bg-gray-200"
                                  }`} />
                                );
                              })}
                            </div>
                          )}
                        </Field>

                        {/* Confirm */}
                        <Field label="Confirm New Password">
                          <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                            <input
                              type={showPw.confirm ? "text" : "password"}
                              value={pwForm.confirm}
                              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                              placeholder="Confirm new password"
                              className={`${inputCls} pl-8 pr-10 ${pwForm.confirm && pwForm.next !== pwForm.confirm ? "border-red-300 focus:border-red-400 focus:ring-red-200" : ""}`}
                            />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPw.confirm ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                            </button>
                          </div>
                          {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                          )}
                        </Field>

                        {error   && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">⚠ {error}</div>}
                        {success && <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"><FaCheck className="text-xs" /> {success}</div>}

                        <button
                          type="submit"
                          disabled={pwSaving}
                          className="px-6 py-2.5 bg-[#9A6AE3] text-white text-sm font-semibold rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50 shadow-sm"
                        >
                          {pwSaving ? "Updating…" : "Update Password"}
                        </button>
                      </form>
                    </div>

                    {/* Security info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Security Overview</h3>
                      <div className="space-y-3">
                        {[
                          { icon: FaEnvelope, label: "Email verified",   status: true,  statusLabel: "Verified" },
                          { icon: FaMobile,   label: "Two-factor auth",  status: false, statusLabel: "Not enabled" },
                          { icon: FaLock,     label: "Password strength", status: true, statusLabel: "Good" },
                        ].map(({ icon: Icon, label, status, statusLabel }) => (
                          <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${status ? "bg-emerald-50" : "bg-gray-100"}`}>
                                <Icon className={`text-xs ${status ? "text-emerald-500" : "text-gray-400"}`} />
                              </div>
                              <span className="text-sm text-gray-700">{label}</span>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                              {statusLabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
