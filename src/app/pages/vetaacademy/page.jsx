"use client";

import React, { useState } from 'react';

const VetaAcademy = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Do I need a business idea to join?",
      answer: "A rough idea helps, but it's not required. Week 1 includes an ideation sprint that helps you identify problems worth solving based on your experience and interests."
    },
    {
      question: "What if my idea doesn't validate?",
      answer: "That's a win, not a failure. Killing a bad idea in week 4 saves months of wasted effort. We'll pivot or refine until you have a model that holds up."
    },
    {
      question: "I have no business background.",
      answer: "VETA is built for operators, not MBAs. The curriculum assumes zero business training and teaches by doing—customer interviews, sprints, and live modeling."
    },
    {
      question: "Can I do this while employed or in school?",
      answer: "Yes. Sessions are designed around working veterans. Expect 60–90 minutes per week for sessions, missions, and debriefs."
    },
    {
      question: "Do you handle VA claims inside the cohort?",
      answer: "No. If benefits are blocking, we route you to accredited VSO Claim Support first, then resume your VETA missions."
    },
    {
      question: "What happens after the 12 sessions?",
      answer: "You leave with a validated model, financial projections, and a go-to-market roadmap. Alumni get continued access to the VETA network, mentors, and funding partners."
    }
  ];

  const modules = [
    {
      title: "1) Customer Discovery",
      color: "blue",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      outcome: "A validated problem worth solving.",
      whatWeDo: "100+ customer interviews, problem-solution fit analysis, market sizing, and competitor mapping."
    },
    {
      title: "2) 7-Day Validation Sprints",
      color: "orange",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      outcome: "Real-world proof your model works.",
      whatWeDo: "MVP testing, A/B experiments, metric tracking, and rapid iteration cycles with live customer data."
    },
    {
      title: "3) Financial Modeling",
      color: "green",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      outcome: "Investor-ready financials and unit economics.",
      whatWeDo: "3-year projections, cost structure, revenue model, break-even analysis, and fundraising prep."
    },
    {
      title: "4) Go-to-Market Roadmap",
      color: "purple",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      outcome: "A launch plan with channels, messaging, and growth tactics.",
      whatWeDo: "Channel strategy, brand positioning, launch roadmap, and first 90-day execution plan."
    }
  ];

  const deliverables = [
    {
      title: "Validated Business Model",
      description: "(problem, solution, customer)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Financial Model",
      description: "(3-year projections + unit economics)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Go-to-Market Plan",
      description: "(channels, messaging, launch timeline)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Pitch Deck",
      description: "(investor-ready)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Customer Interview Bank",
      description: "(100+ conversations documented)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Mentor & Funding Network",
      description: "(warm intros to partners)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-600",
      bgOpacity: "bg-blue-600 bg-opacity-10",
      text: "text-blue-600",
      border: "border-blue-600"
    },
    orange: {
      bg: "bg-[#ff5e1a]",
      bgOpacity: "bg-[#ff5e1a] bg-opacity-10",
      text: "text-[#ff5e1a]",
      border: "border-[#ff5e1a]"
    },
    green: {
      bg: "bg-green-600",
      bgOpacity: "bg-green-600 bg-opacity-10",
      text: "text-green-600",
      border: "border-green-600"
    },
    purple: {
      bg: "bg-purple-600",
      bgOpacity: "bg-purple-600 bg-opacity-10",
      text: "text-purple-600",
      border: "border-purple-600"
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              12-Session Cohort Program • Entrepreneurship
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#002147] mb-6 leading-tight">
              WANAC Vetrepreneurship Academy (VETA)
            </h1>
            <p className="text-2xl text-gray-600 mb-4 font-semibold">
              From idea to launch in 12 weeks
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              A 12-session, cohort-based program that turns idea → validated model → launch plan using customer discovery, 7-day validation sprints, financial modeling, and a go-to-market roadmap. Built on UCLA Anderson methodology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Apply for the VETA cohort
              </button>
              <button className="border-2 border-[#002147] text-[#002147] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#002147] hover:text-white transition-all duration-200">
                Not sure yet? Take the 3-minute quiz
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
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
                Cohort-based
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                National
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Scholarships available (one per year)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              The problem (and what's at stake)
            </h2>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Veterans have the discipline and drive to build businesses—but most entrepreneurship programs are generic, theory-heavy, and disconnected from military experience. Without structured validation, founders waste months building something nobody wants. <span className="font-semibold text-[#ff5e1a]">Every week without real customer data compounds risk and burns runway.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              The VETA solution (at a glance)
            </h2>
            <p className="text-2xl font-semibold text-[#ff5e1a] mb-8">
              One cohort. Idea to launch plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-4">Features</h3>
              <p className="text-sm text-gray-600">
                Customer discovery sprints, 7-day validation experiments, financial modeling, pitch deck creation, go-to-market planning, mentor matching, and funding partner introductions.
              </p>
            </div>

            {/* Advantages Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#002147] bg-opacity-10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-4">Advantages</h3>
              <p className="text-sm text-gray-600">
                Built on UCLA Anderson venture methodology. Cohort accountability replaces solo guessing. Real customer data replaces assumptions. You validate before you build.
              </p>
            </div>

            {/* Benefits Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-4">Benefits</h3>
              <p className="text-sm text-gray-600">
                Launch confidence backed by evidence. Investor-ready financials. A network of veteran founders. Funding partner introductions. Less guessing, more building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module Deep-Dive Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              The 4-module VETA curriculum
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each module builds on the last. You finish with a validated business, not just a business plan.
            </p>
          </div>

          <div className="space-y-6">
            {modules.map((mod, index) => {
              const colors = colorClasses[mod.color] || colorClasses.blue;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 ${colors.bgOpacity} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <div className={colors.text}>
                          {mod.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#002147] mb-3">{mod.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">What we do</p>
                            <p className="text-gray-700">{mod.whatWeDo}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Outcome</p>
                            <p className={`font-semibold ${colors.text}`}>{mod.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              What you walk away with
            </h2>
            <p className="text-lg text-gray-600">
              Tangible assets—not theory slides
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {deliverables.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200 text-center">
                <div className="w-12 h-12 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-[#ff5e1a]">
                    {item.icon}
                  </div>
                </div>
                <h4 className="font-bold text-[#002147] text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Results Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              VETA alumni results after 12 months
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-[#faf9f7] rounded-2xl p-8">
              <div className="text-5xl font-bold text-[#ff5e1a] mb-2">73%</div>
              <p className="text-lg font-semibold text-[#002147] mb-1">launched their business</p>
              <p className="text-sm text-gray-600">within 12 months of completing VETA</p>
            </div>
            <div className="text-center bg-[#faf9f7] rounded-2xl p-8">
              <div className="text-5xl font-bold text-[#ff5e1a] mb-2">$2.3M</div>
              <p className="text-lg font-semibold text-[#002147] mb-1">average funding raised</p>
              <p className="text-sm text-gray-600">across grants, angel, and seed rounds</p>
            </div>
            <div className="text-center bg-[#faf9f7] rounded-2xl p-8">
              <div className="text-5xl font-bold text-[#ff5e1a] mb-2">18</div>
              <p className="text-lg font-semibold text-[#002147] mb-1">average team size</p>
              <p className="text-sm text-gray-600">jobs created per VETA graduate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              What alumni say
            </h2>
            <p className="text-lg text-gray-600">
              Hear from veterans who turned ideas into businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#ff5e1a] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  JS
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">John Smith</h4>
                  <p className="text-sm text-gray-600">Army Veteran • TechFlow Inc</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic">
                "VETA gave me the structure and confidence to turn my idea into a funded business. The veteran community support is unmatched."
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#ff5e1a] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  MR
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Maria Rodriguez</h4>
                  <p className="text-sm text-gray-600">Navy Veteran • VetHealth Solutions</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic">
                "The UCLA Anderson methodology combined with veteran-specific support helped me raise $1.5M and launch in 6 months."
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#ff5e1a] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  DW
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">David Williams</h4>
                  <p className="text-sm text-gray-600">Marine Veteran • MissionReady Logistics</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic">
                "From 0 to 25 employees in our first year. VETA's financial modeling module was game-changing for our growth strategy."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Ecosystem Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              VETA partner ecosystem
            </h2>
            <p className="text-lg text-gray-600">
              Access exclusive resources from our network of veteran business partners
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["SBA Programs", "VetFran", "Bunker Labs", "SCORE", "V-WISE", "Vet2Tech"].map((partner, index) => (
              <div key={index} className="bg-[#faf9f7] rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-[#002147] text-sm">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-[#002147] pr-4">{faq.question}</span>
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
              Build your business with veteran discipline
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Join the next VETA cohort and turn your idea into a validated, funded venture
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-[#ff5e1a] text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Apply for the VETA cohort
              </button>
              <button className="border-3 border-white text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-white hover:text-[#002147] transition-all duration-200 shadow-xl">
                Take the 3-minute quiz
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
              <span className="font-semibold">Compliance & Privacy:</span> Cohorts are available for PLEP, PLCA, PPC, CPPC, and VETA only. VA claims are handled 1:1 via accredited representatives (WANAC for ≤12 months/BDD; partner VSOs/agents/attorneys for others). One scholarship per veteran per year; awards limited and not guaranteed. WANAC is not a law firm and is not affiliated with the U.S. Department of Veterans Affairs. Your information is handled securely and shared only with your consent.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default VetaAcademy;
