"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const WanacWebinarRegistration = () => {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is it free?",
      answer: "Yes."
    },
    {
      question: "Will you cover BDD?",
      answer: "Yes—how it works, who's eligible, and how WANAC supports active duty filing before separation."
    },
    {
      question: "Do I need to turn on my camera?",
      answer: "No. Attend however you prefer."
    },
    {
      question: "Will there be a recording?",
      answer: "We'll send registrants a quick-start checklist and key links; recording availability may vary by session."
    },
    {
      question: "Will you pitch programs?",
      answer: "We'll show next steps (free VSO Claim Support, quiz, cohort dates, scholarships). Join only if it's the right fit."
    }
  ];

  const learningOutcomes = [
    {
      title: "Claim with confidence (incl. BDD)",
      color: "blue",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "How to decide what to file first, the evidence triad (nexus / diagnostics / continuity), and where WANAC's accredited VSO support fits."
    },
    {
      title: "Education on-time & funded",
      color: "purple",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: "Map program fit, prerequisites, and GI Bill timing so you start this term—not 'someday.'"
    },
    {
      title: "Career pipeline that converts",
      color: "orange",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: "Go from target role → employer list → interviews with a repeatable weekly cadence."
    },
    {
      title: "If you're launching a venture",
      color: "green",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Run 7-day validation sprints to find truth fast before you spend."
    },
    {
      title: "Your first step today",
      color: "red",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: "Walk away with a one-page mission plan and the exact next action."
    }
  ];

  const freeResources = [
    {
      title: "One-page mission plan template",
      description: "(fill-as-you-watch)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Claim Readiness Checklist",
      description: "(incl. BDD notes)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Transition Readiness Quiz",
      description: "(routes to the right next step)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Cohort dates & scholarship info",
      description: "(one scholarship per veteran per year)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const colorClasses = {
    blue: {
      bgOpacity: "bg-blue-600 bg-opacity-10",
      text: "text-blue-600",
      border: "border-blue-600"
    },
    purple: {
      bgOpacity: "bg-purple-600 bg-opacity-10",
      text: "text-purple-600",
      border: "border-purple-600"
    },
    orange: {
      bgOpacity: "bg-[#ff5e1a] bg-opacity-10",
      text: "text-[#ff5e1a]",
      border: "border-[#ff5e1a]"
    },
    green: {
      bgOpacity: "bg-green-600 bg-opacity-10",
      text: "text-green-600",
      border: "border-green-600"
    },
    red: {
      bgOpacity: "bg-red-600 bg-opacity-10",
      text: "text-red-600",
      border: "border-red-600"
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-sm">
              <div className="flex items-center space-x-4">
                <select className="bg-transparent border-none text-gray-600 focus:outline-none cursor-pointer">
                  <option>English</option>
                </select>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Sign in/Sign up</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Customer Support</a>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Log in</a>
                <button className="bg-[#ff5e1a] text-white px-4 py-2 rounded-md hover:bg-[#e54e16] transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/WANAC N 8 Old Glory.svg"
                alt="WANAC Logo"
                width={120}
                height={40}
                className="h-8 w-auto cursor-pointer"
                onClick={() => router.push('/')}
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-[#ff5e1a] font-medium transition-colors">Products</a>
              <a href="#" className="text-gray-700 hover:text-[#ff5e1a] font-medium transition-colors">Solutions</a>
              <a href="#" className="text-gray-700 hover:text-[#ff5e1a] font-medium transition-colors">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-[#ff5e1a] font-medium transition-colors">Resources</a>
            </nav>
            <div className="hidden md:flex space-x-4">
              <button className="bg-[#002147] text-white px-6 py-2 rounded-md hover:bg-[#001530] transition-colors text-sm">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              100% FREE WEBINAR • 60 Minutes • Multiple Sessions Available
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#002147] mb-6 leading-tight">
              From Fragmented to Funded
            </h1>
            <p className="text-2xl text-gray-600 mb-4 font-semibold">
              Build your veteran mission plan in 60 minutes
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Free training for service members and veterans to align benefits → education → career/venture (includes BDD claim guidance for active duty).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Save my seat
              </button>
              <button className="border-2 border-[#002147] text-[#002147] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#002147] hover:text-white transition-all duration-200">
                Can't make it? Get the quick-start checklist
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Veteran-led
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Private & secure
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                National (multiple session times)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Why attend (what's at stake)
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              TAP hands you checklists—not a plan. That's why benefits get delayed, school starts slip, and job searches stall. <span className="font-semibold text-[#ff5e1a]">In one hour, you'll see exactly how to turn scattered tasks into a single, funded mission plan.</span>
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              What you'll learn (outcomes)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Actionable insights across every transition domain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningOutcomes.map((outcome, index) => {
              const colors = colorClasses[outcome.color];
              return (
                <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 ${colors.border}`}>
                  <div className={`w-16 h-16 ${colors.bgOpacity} rounded-full flex items-center justify-center mb-6 ${colors.text}`}>
                    {outcome.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#002147] mb-4">{outcome.title}</h3>
                  <p className="text-gray-600">{outcome.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl">
              Save my seat
            </button>
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Agenda (60–75 minutes)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Structured, actionable, and veteran-focused
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  5 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">The problem & stakes</h3>
                  <p className="text-gray-600 text-sm">Why fragmentation kills momentum.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  10 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">The vehicle</h3>
                  <p className="text-gray-600 text-sm">WANAC's mission-driven framework and when to use claims/cohorts.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#ff5e1a] hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-[#ff5e1a] text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  10 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">Claims primer</h3>
                  <p className="text-gray-600 text-sm">BDD window, FDC vs. standard, evidence map, and C&P prep.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  10 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">Education path</h3>
                  <p className="text-gray-600 text-sm">Shortlist, prerequisites, and GI Bill timing.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  10 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">Career pipeline</h3>
                  <p className="text-gray-600 text-sm">Target role, outreach cadence, and interview reps.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  10 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">Venture validation</h3>
                  <p className="text-gray-600 text-sm">Sprints, pricing signals, and MVP scope.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  5 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">Your first step</h3>
                  <p className="text-gray-600 text-sm">Pick one action; get tools.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-amber-600 text-white px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0">
                  10–15 min
                </div>
                <div>
                  <h3 className="font-bold text-[#002147] mb-1">Q&A</h3>
                  <p className="text-gray-600 text-sm">Open questions and personalized guidance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-8">
              Who should attend
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#ff5e1a] to-[#e54e16] rounded-xl shadow-lg p-8 text-white text-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <p className="font-semibold text-lg">
                Active duty in the BDD window or ≤ 12 months from separation
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-xl shadow-lg p-8 text-white text-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold text-lg">
                Recently separated veterans prioritizing benefits, school, job, or venture
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white text-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold text-lg">
                Anyone stuck in "where do I start?" who wants a single, clear plan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              What you'll get (free)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Valuable resources to accelerate your transition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freeResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#ff5e1a]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center text-[#ff5e1a] flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002147] mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm">{resource.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              Save my seat
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Speakers
            </h2>
          </div>

          <div className="bg-gradient-to-r from-[#002147] to-[#003366] rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <div className="flex items-start gap-4">
              <svg className="w-12 h-12 text-[#ff5e1a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <div>
                <h3 className="text-2xl font-bold mb-4">WANAC Program Team</h3>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Claims, education, career, and venture coaches who run our national cohorts (PLEP, PLCA, PPC, CPPC, VETA) and accredited VSO claim support for eligible veterans.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mt-6">
              <p className="text-gray-800 text-sm">
                <span className="font-semibold text-blue-900">Note:</span> Claims support is 1:1 with accredited representatives (WANAC for ≤12 months/BDD; partner VSOs/agents/attorneys for others). Cohorts apply to PLEP, PLCA, PPC, CPPC, and VETA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-semibold text-[#002147]">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-[#ff5e1a] transition-transform duration-200 ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#002147] to-[#003366] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Reserve your seat today
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Transform scattered tasks into a single, funded mission plan in just 60 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-[#ff5e1a] text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Save my seat
              </button>
              <button className="border-3 border-white text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-white hover:text-[#002147] transition-all duration-200 shadow-xl">
                Get the quick-start checklist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold">Compliance & Privacy:</span> WANAC provides accredited VSO representation for eligible veterans within 12 months of separation and for active-duty BDD claims, and partners with accredited organizations for others. Cohorts are for PLEP, PLCA, PPC, CPPC, and VETA programs. One scholarship per veteran per year; awards limited and not guaranteed. WANAC is not a law firm and is not affiliated with the U.S. Department of Veterans Affairs. Your information is handled securely and shared only with your consent.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002147] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4">Webinar Resources</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Mission Plan Template</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Claim Readiness Checklist</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Quick-Start Guide</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Upcoming Sessions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Programs</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">PLEP (Education)</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">PLCA (Career)</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">PPC (Performance)</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">VETA (Entrepreneurship)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Connect</h4>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#ff5e1a] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#ff5e1a] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#ff5e1a] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                From fragmented to funded
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <div className="mb-4 md:mb-0">
                <p>&copy; 2025 WANAC. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/WANAC N 8 Old Glory.svg"
                  alt="WANAC Logo"
                  width={80}
                  height={30}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WanacWebinarRegistration;

