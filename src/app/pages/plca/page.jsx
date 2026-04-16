"use client";

import React, { useState } from 'react';

const PlcaPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Who is PLCA designed for?",
      answer: "PLCA is ideal for veterans preparing to enter or re-enter the civilian workforce, transitioning service members seeking structured career guidance, and individuals aiming to significantly enhance their professional readiness."
    },
    {
      question: "How is PLCA different from a regular career counselor?",
      answer: "PLCA is veteran-centric — our coaches understand military-to-civilian translation, veteran-friendly employers, and the unique strengths service members bring. The curriculum is built around proven methodologies specific to this transition."
    },
    {
      question: "What does the coaching cover?",
      answer: "One-on-one career coaching, resume and LinkedIn optimization, interview preparation, personal branding, strategic networking, and direct connections to veteran-friendly employers and job placement networks."
    },
    {
      question: "How long is the program?",
      answer: "PLCA is cohort-based with a structured timeline. Your personalized career roadmap is developed during the initial assessment and guides you through the full program."
    },
    {
      question: "Is there a cost?",
      answer: "PLCA is a WANAC program delivered through cohorts. Scholarship opportunities may be available — apply to check eligibility."
    },
    {
      question: "Can I join if I already have a civilian job?",
      answer: "Yes. PLCA serves anyone looking to enhance their professional readiness, whether you're job-seeking or aiming to advance in your current role."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Career Accelerator • Cohort-Based
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#002147] mb-6 leading-tight">
              Promise Land Career Accelerator (PLCA)
            </h1>
            <p className="text-2xl text-gray-600 mb-4 font-semibold">
              Accelerate your career transition with confidence
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Proven methodologies and comprehensive support to prepare transitioning service members and veterans with the essential skills needed to thrive professionally in diverse sectors.
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
                Veteran-centric
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Expert coaching
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Employer network
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
              Military skills don't automatically translate on a civilian resume. Without strategic career coaching, veterans face generic job boards, irrelevant advice, and a workforce that doesn't understand their value. <span className="font-semibold text-[#ff5e1a]">The result: underemployment, frustration, and careers far below your potential.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-6">
              The PLCA solution (at a glance)
            </h2>
            <p className="text-2xl font-semibold text-[#ff5e1a] mb-8">
              One accelerator. One career strategy. Full support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#ff5e1a] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#ff5e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Strategic Readiness</h3>
              <p className="text-gray-600">
                Comprehensive career management skills training, personalized coaching to define clear objectives, and targeted strategies for securing placements.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#002147] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Expert Curriculum</h3>
              <p className="text-gray-600">
                Personal branding, professional identity development, strategic networking techniques, and advanced interview preparation.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002147] mb-4">Placement Network</h3>
              <p className="text-gray-600">
                Access to veteran-friendly employers, job placement networks, and structured events connecting you with industry leaders.
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
                  "PLCA provided me with the structure and support I needed to successfully transition into a fulfilling civilian career. The personalized coaching was invaluable."
                </p>
                <p className="text-gray-300 font-medium">— Army Veteran, Program Graduate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002147] mb-4">
              How PLCA works (4 steps)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From assessment to placement — we guide you every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff5e1a] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Initial Career Assessment</h3>
              <p className="text-gray-600">
                Clarify professional goals, define career direction, and develop a personalized roadmap.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#002147] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Targeted Coaching</h3>
              <p className="text-gray-600">
                One-on-one sessions with career experts. Build robust resumes, LinkedIn profiles, and cover letters.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Development Workshops</h3>
              <p className="text-gray-600">
                Interactive workshops on networking, interviewing, and personal branding with veteran-specific guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">Networking & Placement</h3>
              <p className="text-gray-600">
                Access veteran-friendly employers and structured events to connect with industry leaders.
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
      <section className="bg-white py-20">
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
                Veterans preparing to enter or re-enter the civilian workforce with confidence.
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
                Transitioning service members seeking clear, structured career guidance and direction.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <h3 className="text-2xl font-bold">Career Changers</h3>
              </div>
              <p className="text-lg">
                Individuals aiming to significantly enhance their professional readiness and employability.
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
              Launch your civilian career today
            </h2>
            <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Schedule your complimentary consultation and discover how PLCA can accelerate your professional success
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
              <span className="font-semibold">Compliance & Privacy:</span> PLCA is a WANAC cohort-based program for veterans and transitioning service members pursuing civilian careers. Job placement is not guaranteed. Scholarship availability is limited. WANAC is not affiliated with the U.S. Department of Veterans Affairs. Your information is handled securely and shared only with your consent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlcaPage;
