"use client";

import React, { useState } from "react";
import Link from "next/link";

const RANKS = [
  ...Array.from({ length: 9 }, (_, i) => `E-${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `O-${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `W-${i + 1}`),
];

const BRANCHES = [
  "Marines",
  "Army",
  "Navy",
  "Air Force",
  "Coast Guard",
  "Space Force",
];

export default function VSOIntakeForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    preferredContact: "email",
    branch: "",
    rank: "",
    unit: "",
    dutyStation: "",
    eas: "",
    eligibility: "",
    vaClaimType: [],
    prevVaClaim: "",
    hasVaRating: "",
    notes: "",
    attachment: null,
    transitionSupport: "",
    wanacCoach: "",
    consentFree: false,
    consentContact: false,
    consentPrivacy: false,
  });
  const [errors, setErrors] = useState({});
  const [showEligibilityMsg, setShowEligibilityMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const VA_CLAIM_OPTIONS = [
    "Disability Compensation",
    "GI Bill/Education Benefits",
    "Vocational Rehabilitation & Employment (VR&E)",
    "Pension Claims",
    "Dependency & Survivor Benefits",
    "Appeal/Supplemental Claim",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox" && name === "vaClaimType") {
      setForm((prev) => {
        const newArr = prev.vaClaimType.includes(value)
          ? prev.vaClaimType.filter((v) => v !== value)
          : [...prev.vaClaimType, value];
        return { ...prev, vaClaimType: newArr };
      });
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, attachment: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "eligibility" && value === "no") {
      setShowEligibilityMsg(true);
    } else if (name === "eligibility") {
      setShowEligibilityMsg(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Full Name is required.";
    if (!form.dob) newErrors.dob = "Date of Birth is required.";
    if (!form.email) newErrors.email = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format.";
    if (!form.phone) newErrors.phone = "Phone Number is required.";
    if (!form.unit) newErrors.unit = "Unit is required.";
    if (!form.dutyStation) newErrors.dutyStation = "Duty Station/Location is required.";
    if (!form.eas) newErrors.eas = "End of Active Service (EAS) Date is required.";
    if (!form.eligibility) newErrors.eligibility = "Eligibility selection is required.";
    if (!form.consentFree) newErrors.consentFree = "You must acknowledge services are free and for eligible veterans.";
    if (!form.consentContact) newErrors.consentContact = "Consent to be contacted is required.";
    if (!form.consentPrivacy) newErrors.consentPrivacy = "You must agree to the Privacy Policy.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      // Here you would handle the actual submission (API call, etc.)
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#002147]">Thank you!</h2>
          <p className="mb-4">Your VSO Intake Form has been submitted. We will contact you soon.</p>
          <Link href="/" className="btn w-full">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#002147]">VSO Intake Form</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#002147]">1. Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="fullName">Full Name <span className="text-red-500">*</span></label>
                <input type="text" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dob">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" id="dob" name="dob" value={form.dob} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.dob ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
              <div className="flex gap-6 mt-1">
                {['email', 'phone', 'text'].map((method) => (
                  <label key={method} className="inline-flex items-center gap-2">
                    <input type="radio" name="preferredContact" value={method} checked={form.preferredContact === method} onChange={handleChange} className="accent-[#002147]" />
                    <span className="capitalize">{method === 'text' ? 'Text Message' : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Military Service Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#002147]">2. Military Service Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Branch of Service</label>
                <select name="branch" value={form.branch} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002147]">
                  <option value="">Select branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rank</label>
                <select name="rank" value={form.rank} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002147]">
                  <option value="">Select rank</option>
                  {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="unit">Unit <span className="text-red-500">*</span></label>
                <input type="text" id="unit" name="unit" value={form.unit} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.unit ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dutyStation">Duty Station / Location <span className="text-red-500">*</span></label>
                <input type="text" id="dutyStation" name="dutyStation" value={form.dutyStation} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.dutyStation ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.dutyStation && <p className="text-red-500 text-xs mt-1">{errors.dutyStation}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="eas">End of Active Service (EAS) Date <span className="text-red-500">*</span></label>
                <input type="date" id="eas" name="eas" value={form.eas} onChange={handleChange} className={`w-full p-3 rounded-lg border ${errors.eas ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#002147]`} />
                {errors.eas && <p className="text-red-500 text-xs mt-1">{errors.eas}</p>}
              </div>
            </div>
          </section>

          {/* Section 3: Eligibility Verification */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#002147]">3. Eligibility Verification</h2>
            <label className="block text-sm font-medium mb-2">Are you within 12 months of separation or have separated within the past 12 months? <span className="text-red-500">*</span></label>
            <div className="flex gap-6 mb-2">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="eligibility" value="yes" checked={form.eligibility === "yes"} onChange={handleChange} className="accent-[#002147]" />
                Yes
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="eligibility" value="no" checked={form.eligibility === "no"} onChange={handleChange} className="accent-[#002147]" />
                No
              </label>
            </div>
            {errors.eligibility && <p className="text-red-500 text-xs mt-1">{errors.eligibility}</p>}
            {showEligibilityMsg && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded text-orange-700">
                You're outside WANAC's eligibility window for internal VSO support. We'll provide external VSO referrals.
              </div>
            )}
          </section>

          {/* Section 4: VA Claim Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#002147]">4. VA Claim Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">What type of VA claim do you need assistance with?</label>
              <div className="grid md:grid-cols-2 gap-2">
                {VA_CLAIM_OPTIONS.map((option) => (
                  <label key={option} className="inline-flex items-center gap-2">
                    <input type="checkbox" name="vaClaimType" value={option} checked={form.vaClaimType.includes(option)} onChange={handleChange} className="accent-[#002147]" />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Have you previously filed a VA claim?</label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="prevVaClaim" value="yes" checked={form.prevVaClaim === "yes"} onChange={handleChange} className="accent-[#002147]" />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="prevVaClaim" value="no" checked={form.prevVaClaim === "no"} onChange={handleChange} className="accent-[#002147]" />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Do you currently have a VA disability rating?</label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="hasVaRating" value="yes" checked={form.hasVaRating === "yes"} onChange={handleChange} className="accent-[#002147]" />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="hasVaRating" value="no" checked={form.hasVaRating === "no"} onChange={handleChange} className="accent-[#002147]" />
                    No
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1" htmlFor="notes">Additional Notes/Details</label>
              <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002147]" placeholder="Provide any additional information (optional)" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1" htmlFor="attachment">Upload Relevant Documents</label>
              <input type="file" id="attachment" name="attachment" onChange={handleChange} className="w-full" />
              {form.attachment && <p className="text-xs mt-1 text-gray-600">Selected: {form.attachment.name}</p>}
            </div>
          </section>

          {/* Section 5: Transition Planning & Program Interest (Optional) */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#002147]">5. Transition Planning & Program Interest <span className="text-gray-400 text-sm">(Optional)</span></h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Are you interested in additional transition support (career, education, coaching)?</label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="transitionSupport" value="yes" checked={form.transitionSupport === "yes"} onChange={handleChange} className="accent-[#002147]" />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="transitionSupport" value="no" checked={form.transitionSupport === "no"} onChange={handleChange} className="accent-[#002147]" />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Would you like to speak to a WANAC coach following your claims session?</label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="wanacCoach" value="yes" checked={form.wanacCoach === "yes"} onChange={handleChange} className="accent-[#002147]" />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="wanacCoach" value="no" checked={form.wanacCoach === "no"} onChange={handleChange} className="accent-[#002147]" />
                    No
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Consent & Agreement */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#002147]">6. Consent & Agreement</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consentFree" checked={form.consentFree} onChange={handleChange} className="accent-[#002147] mt-1" />
                <span>I understand WANAC's VSO services are completely free and only available for veterans within the eligibility timeframe. <span className="text-red-500">*</span></span>
              </label>
              {errors.consentFree && <p className="text-red-500 text-xs ml-6">{errors.consentFree}</p>}
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consentContact" checked={form.consentContact} onChange={handleChange} className="accent-[#002147] mt-1" />
                <span>I consent to be contacted by WANAC regarding my claim and related support services. <span className="text-red-500">*</span></span>
              </label>
              {errors.consentContact && <p className="text-red-500 text-xs ml-6">{errors.consentContact}</p>}
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consentPrivacy" checked={form.consentPrivacy} onChange={handleChange} className="accent-[#002147] mt-1" />
                <span>I agree to WANAC's <Link href="/privacy" className="text-orange-500 underline hover:text-orange-700" target="_blank">Privacy Policy</Link> <span className="text-red-500">*</span></span>
              </label>
              {errors.consentPrivacy && <p className="text-red-500 text-xs ml-6">{errors.consentPrivacy}</p>}
            </div>
          </section>

          <div className="pt-4">
            <button type="submit" className="btn w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
