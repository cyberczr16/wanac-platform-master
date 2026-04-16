"use client";

import React, { useState } from 'react';

const PlepPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Who is PLEP designed for?",
      answer: "PLEP is specifically designed for veterans, transitioning service members, and individuals who need structured, tailored support to pursue higher education successfully."
    },
    {
      question: "How long is the program?",
      answer: "PLEP is cohort-based and runs through a structured timeline. Your personalized roadmap is developed during the initial assessment and adapts as you progress."
    },
    {
      question: "Do I need to know what I want to study?",
      answer: "Not at all. The initial assessment helps you identify academic interests and career objectives. We meet you where you are."
    },
    {
      question: "Can PLEP help with VA education benefits?",
      answer: "Yes. Our mentors provide guidance on VA benefits, financial aid, GI Bill usage, and other funding sources as part of your personalized plan."
    },
    {
      question: "Is there a cost?",
      answer: "PLEP is a WANAC program delivered through cohorts. Scholarship opportunities may be available—apply to check eligibility."
    },
    {
      question: "What if I've been out of school for years?",
      answer: "That's exactly who we serve. Academic preparation workshops cover study skills, writing, time management, and more to get you ready."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Education Pathway • Cohort-Based
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#002147] mb-6 leading-tight">
              Promise Land Education Pathway (PLEP)
            </h1>
            <p className="text-2xl text-gray-600 mb-4 font-semibold">
              Your strategic pathway to educational excellence
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Structured, comprehensive guidance and support specifically designed for transitioning service members and veterans pursuing higher education — personalized coaching, tailored resources, and a clear roadmap to academic success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="bg-[#ff5e1a] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Apply Now
              </button>
              <button className="border-2 border-[#002147] text-[#002147] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#002147] hover:text-white transition-all duration-200">
                Schedule a Free Consultation
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Veteran-centric
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Personalized roadmap
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Mentor-supported
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
              Transitioning from military service to higher education means navigating unfamiliar systems — admissions, financial aid, credit transfers, civilian campus culture — with little structured support. <span className="font-semibold text-[#ff5e1a]">Without a clear roadmap, veterans lose time, money, and momentum.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-6">
              The PLEP solution (at a glance)
            </h2>
            <p className="text-2xl font-semibold text-[#ff5e1a] mb-8">
              One pathway. One plan. Full support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src="/transitionguide.jpg"
                  alt="Service member with family planning their future"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="w-16 h-16 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#002147] mb-4">Personalized Planning</h3>
                <p className="text-gray-600">
                  Educational planning aligned with your goals — identify academic interests, evaluate military credits, and build a personalized roadmap.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src="/Transitioncoaching.jpg"
                  alt="Veterans in a mentoring and coaching session"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="w-16 h-16 bg-[#002147] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#002147] mb-4">Veteran-Centric Guidance</h3>
                <p className="text-gray-600">
                  Expert guidance for admissions, financial aid, academic transitions, and VA benefits — designed by people who understand military-to-civilian challenges.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src="/veterancommunity.png"
                  alt="Group workshop and peer support session"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#002147] mb-4">Targeted Resources</h3>
                <p className="text-gray-600">
                  Academic workshops, peer support networks, and curated resources designed specifically for transitioning service members and veterans.
                </p>
              </div>
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
                  "PLEP gave me the confidence and clarity to pursue my degree. The tailored support made a real difference."
                </p>
                <p className="text-gray-300 font-medium">— James Matthews, U.S. Army Veteran, now pursuing an MBA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Benefits Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Comprehensive support network
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed academically — from day one through graduation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-[#ff5e1a]">
              <div className="w-14 h-14 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-3">Dedicated Mentors</h3>
              <p className="text-gray-600">
                Experienced mentors who understand veteran-specific educational transitions and provide one-on-one guidance throughout your journey.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600">
              <div className="w-14 h-14 bg-blue-600 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-3">Strategic Workshops</h3>
              <p className="text-gray-600">
                Academic workshops and webinars on study skills, research writing, time management, and organization strategies.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-green-600">
              <div className="w-14 h-14 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-3">Peer Support</h3>
              <p className="text-gray-600">
                Community networking, peer mentoring opportunities, veteran student events, and access to an alumni network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              Your roadmap to the Promise Land (4 steps)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these key steps to achieve your academic goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff5e1a] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Initial Assessment</h3>
              <p className="text-gray-600">
                Identify academic interests, evaluate military experience for credits, and develop a personalized education roadmap.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#002147] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Academic Preparation</h3>
              <p className="text-gray-600">
                Study skills workshops, academic writing training, and time management strategies to set you up for success.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Guided Coaching</h3>
              <p className="text-gray-600">
                One-on-one mentoring, application and enrollment assistance, and VA benefits and financial aid guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Community Building</h3>
              <p className="text-gray-600">
                Join a supportive community of fellow veteran students with peer mentoring and networking events.
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

      {/* Who Should Enroll */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-8">
              Who should enroll
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#ff5e1a] to-[#e54e16] rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-bold">Veterans</h3>
              </div>
              <p className="text-lg">
                Veterans aiming for higher education post-transition who want a structured path forward.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-bold">Service Members</h3>
              </div>
              <p className="text-lg">
                Transitioning service members exploring academic opportunities and career advancement through education.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-bold">Support Seekers</h3>
              </div>
              <p className="text-lg">
                Individuals requiring structured, tailored support for educational success — regardless of how long it's been.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Testimonial */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#002147] to-[#003366] rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <div className="flex items-start gap-4 mb-6">
              <svg className="w-12 h-12 text-[#ff5e1a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <p className="text-xl md:text-2xl font-semibold mb-4 leading-relaxed">
                  "The mentorship and community resources provided by PLEP were crucial in my transition to civilian academics."
                </p>
                <p className="text-gray-300 font-medium">— Sarah Johnson, U.S. Air Force Veteran, graduated with honors in Computer Science</p>
              </div>
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
              Start your academic journey today
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Schedule your free consultation and discover how PLEP can help you achieve your educational goals
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-[#ff5e1a] text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-[#e54e16] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Apply Now
              </button>
              <button className="border-3 border-white text-white px-12 py-5 rounded-lg text-xl font-semibold hover:bg-white hover:text-[#002147] transition-all duration-200 shadow-xl">
                Schedule a Free Consultation
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
              <span className="font-semibold">Compliance & Privacy:</span> PLEP is a WANAC cohort-based program for veterans and transitioning service members pursuing higher education. Scholarship availability is limited and not guaranteed. WANAC is not affiliated with the U.S. Department of Veterans Affairs or any academic institution. Your information is handled securely and shared only with your consent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlepPage;
