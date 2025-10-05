"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const TransitionReadinessQuiz = () => {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Does it cost anything?",
      answer: "No. The quiz and plan are free."
    },
    {
      question: "Do I need email?",
      answer: "Yes—we send your plan and next-step links securely to your inbox."
    },
    {
      question: "Will this affect my VA claim?",
      answer: "No—it's a planning tool. If claims are indicated, we connect you to accredited VSO support (WANAC represents ≤12 months/BDD; >12 months we partner with accredited orgs)."
    },
    {
      question: "Are cohorts used for claims?",
      answer: "No. Cohorts are for PLEP, PLCA, PPC, CPPC, and VETA. Claims support is 1:1 representation."
    },
    {
      question: "How fast do I get results?",
      answer: "Immediately on screen, with the full plan by email within minutes."
    }
  ];

  const quizCoverageAreas = [
    {
      title: "Benefits (VA claims)",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      checks: "DD-214/orders, claim status, evidence gaps, BDD eligibility (if active duty).",
      output: "Whether VSO Claim Support should happen first, plus what evidence is missing."
    },
    {
      title: "Education (PLEP)",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      checks: "Goal clarity, program fit, GI Bill usage, timeline.",
      output: "Shortlist of programs, credit-for-experience pointers, and funding path."
    },
    {
      title: "Career (PLCA)",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      checks: "Target role, resume targeting, interview readiness, networking.",
      output: "2–3 target roles, employer list format, and a 2-week outreach plan."
    },
    {
      title: "Entrepreneurship (VETA)",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      checks: "Idea clarity, problem validation, revenue model, time runway.",
      output: "7-day validation sprint and model assumptions to test."
    },
    {
      title: "Performance (PPC/CPPC)",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      checks: "Clarity, daily routine, energy, time blocks, accountability.",
      output: "A 7-day mission rhythm (plan → execute → debrief) you can sustain."
    }
  ];

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
                Start Claim Check
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#002147] mb-6 leading-tight">
                WANAC Transition Readiness Quiz
              </h1>
            <p className="text-2xl text-gray-600 mb-4 font-semibold">
              Know your mission plan in 3 minutes
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Diagnose your benefits, education, career, entrepreneurship, and performance readiness—then get a personalized plan and the right next step (PLEP, PLCA, VETA, PPC/CPPC) or VSO Claim Support if benefits are the bottleneck.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Take the 3-minute quiz
                </button>
              <button className="border-2 border-[#002147] text-[#002147] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#002147] hover:text-white transition-all duration-200">
                Prefer to talk? Book a 15-minute consult
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
                Instant results
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
              Transition gets treated like separate checklists—TAP here, resume there, claims "somewhere." That fragmentation costs time, delays benefits, and creates missed school or hiring windows. <span className="font-semibold text-[#ff5e1a]">Every week without a plan is momentum lost.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-6">
              The WANAC solution (at a glance)
            </h2>
            <p className="text-2xl font-semibold text-[#ff5e1a] mb-8">
              One quiz. One mission plan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Features</h3>
              <p className="text-gray-600">
                12 quick questions across Benefits, Education, Career, Entrepreneurship, Performance.
              </p>
            </div>

            {/* Advantages Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#002147] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Advantages</h3>
              <p className="text-gray-600">
                Instant Red/Amber/Green score by domain, step-by-step plan, and a routed next step (cohort or claim support).
              </p>
            </div>

            {/* Benefits Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Benefits</h3>
              <p className="text-gray-600">
                Clarity in minutes, not months—so you move immediately toward funded school, a targeted job search, or a validated venture.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl">
              Take the 3-minute quiz
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
                  "I finally knew exactly what to do this week—file my claim, pick a program, and book two employer calls."
                </p>
                <p className="text-gray-300 font-medium">— U.S. Army veteran</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Impact Section - HubSpot Inspired */}
      <section className="bg-[#002147] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              WANAC quiz takers see results within 90 days
            </h2>
            <p className="text-xl text-gray-300">
              Veterans who complete the quiz and follow their personalized plan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold text-white mb-3">87%</h3>
              <p className="text-xl text-gray-300">File claims within 2 weeks</p>
              <p className="text-sm text-gray-400 mt-2">With complete evidence packages</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold text-white mb-3">3.2x</h3>
              <p className="text-xl text-gray-300">Faster program enrollment</p>
              <p className="text-sm text-gray-400 mt-2">Compared to unguided transition</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold text-white mb-3">94%</h3>
              <p className="text-xl text-gray-300">Report reduced anxiety</p>
              <p className="text-sm text-gray-400 mt-2">About their transition plan</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-white text-lg mb-6">
              Join thousands of veterans who've found clarity and direction
            </p>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#002147] transition-colors shadow-lg">
              Take the quiz now
            </button>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof - HubSpot Style */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-4">
              Trusted by Service Members Worldwide
            </p>
            <h3 className="text-3xl font-bold text-[#002147] mb-2">
              240,000+ veterans served across 135+ countries
            </h3>
            <p className="text-lg text-gray-600">
              Transitioning successfully with WANAC's support
            </p>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff5e1a] mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff5e1a] mb-2">50+</div>
              <div className="text-sm text-gray-600">Partner Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff5e1a] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff5e1a] mb-2">&lt;3min</div>
              <div className="text-sm text-gray-600">Average Quiz Time</div>
            </div>
          </div>

          {/* Partner Logos Placeholder */}
          <div className="border-t border-gray-200 pt-12">
            <p className="text-center text-sm text-gray-500 uppercase tracking-wide font-semibold mb-8">
              Partnered with Leading Organizations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-gray-600 font-bold text-sm">VA</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-gray-600 font-bold text-sm">DOD</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-gray-600 font-bold text-sm">VFW</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-gray-600 font-bold text-sm">American Legion</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-gray-600 font-bold text-sm">DAV</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Coverage Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              What the quiz covers (and what you'll get)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive assessment evaluates your readiness across five critical domains of transition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {quizCoverageAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-[#ff5e1a]">
                <div className="w-16 h-16 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-6 text-[#ff5e1a]">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-[#002147] mb-4">{area.title}</h3>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Checks:</p>
                  <p className="text-sm text-gray-600 mb-4">{area.checks}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Output:</p>
                  <p className="text-sm text-gray-600">{area.output}</p>
                </div>
              </div>
            ))}
              </div>

          <div className="text-center">
            <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              Get my personalized plan (free)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              </button>
            </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              How it works (3 steps)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple, fast, and actionable
            </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#ff5e1a] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  1
              </div>
                <h3 className="text-xl font-bold text-[#002147] mb-3">
                  Answer the 12 prompts
                </h3>
                <p className="text-gray-600">
                  Takes approximately 3 minutes. Quick, focused questions about your transition readiness.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-full w-full h-1 bg-gray-200" style={{ width: 'calc(100% - 40px)', left: 'calc(50% + 40px)' }}></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#002147] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  2
              </div>
                <h3 className="text-xl font-bold text-[#002147] mb-3">
                  See your R/A/G score
                </h3>
                <p className="text-gray-600">
                  Get instant Red/Amber/Green scoring and a concise plan for each domain.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-full w-full h-1 bg-gray-200" style={{ width: 'calc(100% - 40px)', left: 'calc(50% + 40px)' }}></div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">
                Act today
              </h3>
              <p className="text-gray-600">
                Book claims support, apply for a cohort, or grab your next task immediately.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl">
              Take the 3-minute quiz
            </button>
          </div>
        </div>
      </section>

      {/* Where it Plugs In Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Where it plugs in (integration & fit)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-600 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Claim-first routing</h3>
              <p className="text-gray-600">
                If you're ≤12 months from separation or on active duty, we route you to accredited VSO claim support (including BDD).
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Program routing</h3>
              <p className="text-gray-600">
                Education → PLEP, Career → PLCA, Entrepreneurship → VETA, Performance → PPC/CPPC.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Funding next step</h3>
              <p className="text-gray-600">
                Links to the Scholarship Eligibility Estimator and cohort dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Take This Section */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-8">
              Who should take this
            </h2>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#ff5e1a] to-[#e54e16] rounded-xl shadow-lg p-8 text-white text-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <p className="font-semibold text-lg">
                Active duty within BDD window or ≤12 months from separation
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-xl shadow-lg p-8 text-white text-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold text-lg">
                Recently separated veterans ready to prioritize benefits, school, job, or venture
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

      {/* FAQ Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Risk reversal & objections answered
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
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
              Start your transition plan today
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Get your personalized readiness assessment in just 3 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-[#ff5e1a] text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Take the 3-minute quiz
              </button>
              <button className="border-3 border-white text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-white hover:text-[#002147] transition-all duration-200 shadow-xl">
                Book a 15-minute consult
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
              <span className="font-semibold">Compliance & Privacy:</span> WANAC provides accredited VSO representation for eligible veterans within 12 months of separation and for active-duty BDD claims, and partners with accredited organizations for others. WANAC is not a law firm and is not affiliated with the U.S. Department of Veterans Affairs. Your information is handled securely and shared only with your consent.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002147] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4">Programs</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">PLEP (Education)</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">PLCA (Career)</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">VETA (Entrepreneurship)</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">PPC/CPPC (Performance)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Transition Guide</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">VSO Claim Support</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Scholarship Estimator</a></li>
                <li><a href="#" className="hover:text-[#ff5e1a] transition-colors">Success Stories</a></li>
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
              <p className="text-sm text-gray-300">
                Supporting veterans in their transition journey
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

export default TransitionReadinessQuiz;
