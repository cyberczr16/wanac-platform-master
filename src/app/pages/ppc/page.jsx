"use client";

import React, { useState } from 'react';

const PpcPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Who is PPC designed for?",
      answer: "PPC is ideally suited for veterans transitioning to civilian careers, professionals striving for elevated performance in demanding roles, and individuals looking to significantly enhance their leadership and influence."
    },
    {
      question: "How is PPC structured?",
      answer: "PPC is a 12-session program split into two phases: Foundations (Sessions 1–6) covering clarity, energy, courage, productivity, and influence; and Mastery (Sessions 7–12) deepening those skills with advanced strategies."
    },
    {
      question: "Is this one-on-one or group coaching?",
      answer: "PPC includes both one-on-one personalized coaching sessions and interactive group workshops designed to reinforce key strategies collaboratively."
    },
    {
      question: "What kind of results can I expect?",
      answer: "Participants report enhanced clarity, sustained energy, stronger resilience, higher productivity, and advanced interpersonal and leadership skills."
    },
    {
      question: "How much time does it take per week?",
      answer: "Plan for approximately 2–3 hours per week including coaching sessions, workshop participation, and personal practice."
    },
    {
      question: "Is there a cost?",
      answer: "PPC is a WANAC program delivered through cohorts. Scholarship opportunities may be available — apply to check eligibility."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              High-Performance Coaching • 12 Sessions
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#002147] mb-6 leading-tight">
              Peak Performance Coaching (PPC)
            </h1>
            <p className="text-2xl text-gray-600 mb-4 font-semibold">
              Transform your potential into exceptional results
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Cutting-edge coaching methodologies with comprehensive support to help transitioning service members, veterans, and professionals redefine their potential and achieve their most ambitious goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Apply Now
              </button>
              <button className="border-2 border-[#002147] text-[#002147] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#002147] hover:text-white transition-all duration-200">
                Schedule Your Consultation
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                12-session program
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                1-on-1 coaching
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Progress tracking
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Scholarships available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              The problem (and what's at stake)
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              You performed at your peak in uniform. But the transition strips away the structure, mission clarity, and support systems that drove that performance. <span className="font-semibold text-[#ff5e1a]">Without a new framework, high performers plateau — losing momentum, energy, and direction.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-6">
              The PPC solution (at a glance)
            </h2>
            <p className="text-2xl font-semibold text-[#ff5e1a] mb-8">
              One system. Five pillars. Sustained high performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Clarity & Energy</h3>
              <p className="text-gray-600">
                Define your mission, set objectives, and optimize physical, emotional, and mental energy for sustained performance.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#002147] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Courage & Resilience</h3>
              <p className="text-gray-600">
                Build resilient mindsets, develop strategies to face adversity, and strengthen problem-solving capabilities.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Productivity & Influence</h3>
              <p className="text-gray-600">
                Master daily routines, enhance productivity, and develop interpersonal communication for impactful leadership.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl">
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* Proof/Testimonial Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#002147] to-[#003366] rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <div className="flex items-start gap-4 mb-6">
              <svg className="w-12 h-12 text-[#ff5e1a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <p className="text-xl md:text-2xl font-semibold mb-4 leading-relaxed">
                  "PPC gave me the framework to perform at my best again. The clarity and energy sessions alone were transformative."
                </p>
                <p className="text-gray-300 font-medium">— Veteran, PPC Graduate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Phases Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Two phases of transformative growth
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              12 sessions designed to build foundations, then achieve mastery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Phase 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1-6
                </div>
                <h3 className="text-2xl font-bold text-[#002147]">Phase 1: Foundations</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { label: "Clarity", desc: "Clarify your core mission, goals, and professional direction.", color: "text-blue-600" },
                  { label: "Energy", desc: "Build strong, health-focused routines — sleep, nutrition, exercise, emotional wellness.", color: "text-purple-600" },
                  { label: "Courage", desc: "Develop resilient mindsets and strategies to effectively face adversity.", color: "text-[#ff5e1a]" },
                  { label: "Productivity", desc: "Master daily routines, prioritize effectively, and achieve measurable results.", color: "text-green-600" },
                  { label: "Influence", desc: "Develop interpersonal communication skills to enhance leadership.", color: "text-indigo-600" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 ${item.color} mt-1 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-700"><span className="font-semibold">{item.label}:</span> {item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  7-12
                </div>
                <h3 className="text-2xl font-bold text-[#002147]">Phase 2: Mastery</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { label: "Psychology", desc: "Deepen mindset strategies for lasting high-performance habits.", color: "text-purple-600" },
                  { label: "Physiology", desc: "Maintain peak health through sustainable wellness practices.", color: "text-[#ff5e1a]" },
                  { label: "Advanced Productivity", desc: "Maximize productivity with advanced planning and execution strategies.", color: "text-green-600" },
                  { label: "Persuasion", desc: "Strengthen persuasive communication and build influential relationships.", color: "text-blue-600" },
                  { label: "Presence", desc: "Enhance emotional intelligence and full situational engagement.", color: "text-indigo-600" },
                  { label: "Purpose", desc: "Align daily actions with a meaningful professional and personal purpose.", color: "text-pink-600" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 ${item.color} mt-1 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-700"><span className="font-semibold">{item.label}:</span> {item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Experience */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Customized coaching experience
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Multiple touchpoints designed to accelerate your transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "One-on-One Coaching", desc: "Personalized sessions tailored to your individual goals and trajectory.", color: "border-[#ff5e1a]", iconColor: "text-[#ff5e1a]", bgColor: "bg-[#ff5e1a]" },
              { title: "Interactive Workshops", desc: "Collaborative workshops designed to reinforce key strategies with peers.", color: "border-blue-600", iconColor: "text-blue-600", bgColor: "bg-blue-600" },
              { title: "Resources & Tools", desc: "Access to premium content and performance tracking tools.", color: "border-green-600", iconColor: "text-green-600", bgColor: "bg-green-600" },
              { title: "Progress Tracking", desc: "Regular assessments and performance analytics to measure your growth.", color: "border-purple-600", iconColor: "text-purple-600", bgColor: "bg-purple-600" }
            ].map((item, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 ${item.color}`}>
                <div className={`w-14 h-14 ${item.bgColor} bg-opacity-10 rounded-full flex items-center justify-center mb-4`}>
                  <svg className={`w-7 h-7 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#002147] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proven Outcomes */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Proven outcomes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { text: "Enhanced clarity and strategic goal-setting", color: "border-blue-600" },
              { text: "Sustained increases in personal and professional energy", color: "border-[#ff5e1a]" },
              { text: "Stronger courage, resilience, and problem-solving", color: "border-green-600" },
              { text: "Higher productivity, efficiency, and results", color: "border-purple-600" },
              { text: "Advanced interpersonal skills and leadership", color: "border-indigo-600" }
            ].map((item, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 ${item.color}`}>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 font-semibold">{item.text}</p>
                </div>
              </div>
            ))}
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
            <p className="text-lg text-gray-600">
              Everything you need to know before enrolling
            </p>
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
              Take the first step towards excellence
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Schedule your complimentary consultation and explore how Peak Performance Coaching can transform your trajectory
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-[#ff5e1a] text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Apply Now
              </button>
              <button className="border-3 border-white text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-white hover:text-[#002147] transition-all duration-200 shadow-xl">
                Schedule Your Consultation
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
              <span className="font-semibold">Compliance & Privacy:</span> PPC is a WANAC cohort-based program for veterans, transitioning service members, and professionals seeking high-performance coaching. Results vary by individual. Scholarship availability is limited and not guaranteed. WANAC is not affiliated with the U.S. Department of Veterans Affairs. Your information is handled securely and shared only with your consent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PpcPage;
