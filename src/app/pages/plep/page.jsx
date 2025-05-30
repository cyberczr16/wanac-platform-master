'use client';

import React from 'react';
import Link from 'next/link';
import InfographicWheel from '../../../../components/infographicWheel';


const PlepPage = () => {
  const steps = [
    {
      number: 1,
      title: "Initial Assessment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: "Begin your journey with a comprehensive assessment of your goals, experience, and aspirations.",
      details: [
        "Identify your academic interests and career objectives",
        "Evaluate your military experience for academic credits",
        "Develop a personalized education roadmap"
      ]
    },
    {
      number: 2,
      title: "Guided Coaching",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "Receive dedicated support throughout your academic journey.",
      details: [
        "One-on-one mentoring sessions",
        "Application and enrollment assistance",
        "VA benefits and financial aid guidance"
      ]
    },
    {
      number: 3,
      title: "Academic Preparation",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: "Get ready for academic success with our comprehensive preparation program.",
      details: [
        "Study skills workshops",
        "Academic writing and research training",
        "Time management and organization strategies"
      ]
    },
    {
      number: 4,
      title: "Community Building",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "Join a supportive community of fellow veteran students.",
      details: [
        "Peer mentoring opportunities",
        "Veteran student networking events",
        "Access to alumni network and resources"
      ]
    }
  ];
  const colorClasses = [
    'border-orange-400 bg-orange-50 text-orange-700',
    'border-lime-500 bg-lime-50 text-lime-700',
    'border-blue-400 bg-blue-50 text-blue-700',
    'border-pink-400 bg-pink-50 text-pink-700',
    'border-cyan-400 bg-cyan-50 text-cyan-700',
  ];
  

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <header className="relative bg-[#002147] text-white">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url("/landingpage1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-[#002147] opacity-75"></div>
        <div className="relative z-10 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Promise Land Education Pathway (PLEP)
          </h1>
          <p className="text-xl max-w-3xl mx-auto px-4">
            Your Strategic Pathway to Educational Excellence
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Apply Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#002147] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <section>
        <div className="relative w-full h-10 bg-[#002147] overflow-hidden flex items-center justify-center">
          <nav className="relative z-10 flex space-x-16 px-4">
            <a href="#program-overview" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
              Program Overview
            </a>
            <a href="#how-it-works" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
              How It Works
            </a>
            <a href="#success-stories" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
              Success Stories
            </a>
          </nav>
          <div 
            className="absolute inset-0 w-full" 
            style={{
              animation: 'slide 20s linear infinite',
            }}
          >
            <div className="h-full bg-gradient-to-r from-blue-600 via-[#002147] to-blue-600 w-[200%]"></div>
          </div>
        </div>
      </section>

      {/* Program Overview Section */}
      <section id="program-overview" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Program Overview</h2>
          <h3 className="text-xl font-semibold mb-6 text-center text-[#002147]">
            A Structured Approach to Your Academic Future
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-semibold mb-3">Personalized Planning</h4>
              <p className="text-gray-600">Educational planning aligned with your personal and professional goals</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-semibold mb-3">Veteran-Centric Guidance</h4>
              <p className="text-gray-600">Specialized support for admissions, financial aid, and academic transitions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-semibold mb-3">Targeted Resources</h4>
              <p className="text-gray-600">Custom resources designed specifically for transitioning service members and veterans</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <span className="text-orange-400 font-semibold text-lg mb-4 block">Our Process</span>
      <h2 className="text-4xl font-bold mb-6 text-[#002147]">How PLEP Works</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Our comprehensive approach ensures a smooth transition from military service to academic success.
      </p>
    </div>
  
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left Infographic Chart (placeholder for now) */}
      <div className="relative w-full flex justify-center">
      
      </div>

      {/* Right Step List */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-start shadow rounded-lg p-4 border-l-[6px] ${
              colorClasses[index % colorClasses.length]
            }`}
          >
            <div className={`text-xl font-bold mr-4`}>0{step.number}</div>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Success Stories Section */}
      <section id="success-stories" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">John D.</p>
                  <p className="text-sm text-gray-500">U.S. Army Veteran</p>
                </div>
              </div>
              <p className="italic mb-4">
                "PLEP gave me the confidence and clarity to pursue my degree. The tailored support made a real difference."
              </p>
              <p className="text-sm text-gray-600">Now pursuing a Master's in Business Administration</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-gray-500">U.S. Air Force Veteran</p>
                </div>
              </div>
              <p className="italic mb-4">
                "The mentorship and community resources provided by PLEP were crucial in my transition to civilian academics."
              </p>
              <p className="text-sm text-gray-600">Recently graduated with honors in Computer Science</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002147] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-72 h-72 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-white rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Start Your Academic Journey Today</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Ready to pave your path to academic success? Schedule your free consultation to explore how WANAC's Promise Land
            Education Pathway can help you achieve your educational goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/consultation"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              Schedule Your Free Consultation
            </Link>
            <Link 
              href="/resources"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#002147] transition-colors duration-300"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlepPage; 