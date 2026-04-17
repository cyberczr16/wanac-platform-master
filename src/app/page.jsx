'use client';

// WANAC Coaching Platform - Home Page
import Image from 'next/image';
import Link from 'next/link';
import { FaQuoteLeft } from 'react-icons/fa';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';

// Z-Index Scale
const Z_INDEX = {
  background: 0,
  content: 10,
  overlay: 20,
  modal: 30,
};

// Testimonials Data
const TESTIMONIALS = [
  {
    id: 'veteran-1',
    name: 'Clarence Jacob',
    image: '/veteran1.jpg',
    branch: 'U.S. Army Veteran',
    quote: 'WANAC helped me rediscover my strength and purpose after leaving the military and finding my way in the civilian world.'
  },
  {
    id: 'veteran-2',
    name: 'Stephanie Williams',
    image: '/veteran2.jpg',
    branch: 'U.S. Marine Corps Veteran',
    quote: 'WANAC has been a game-changer for me. The support and guidance I\'ve received have been invaluable in my transition to civilian life.'
  }
];

import { MARKETING_PROGRAMS as PROGRAMS } from '../data/marketingPrograms';

// Features Data
const FEATURES = [
  {
    id: 'session-booking',
    icon: 'https://cdn.lordicon.com/uoljexdg.json',
    title: 'Session Booking',
    description: 'Book 1-on-1 coaching sessions in seconds with our smart scheduling system.',
    highlights: ['Calendar sync', 'Auto-reminders', 'Flexible rescheduling'],
    stat: '500+',
    statLabel: 'Sessions booked monthly'
  },
  {
    id: 'ai-assistant',
    icon: 'https://cdn.lordicon.com/qvbrkejx.json',
    title: 'AI Assistant',
    description: 'Your personal transition companion — get instant guidance on benefits, careers, and next steps.',
    highlights: ['24/7 availability', 'VA benefits guidance', 'Resume building'],
    stat: '24/7',
    statLabel: 'Always available'
  },
  {
    id: 'fireteams',
    icon: 'https://cdn.lordicon.com/thtrcqvk.json',
    title: 'Fireteams',
    description: 'Live, small-group learning sessions where 3-6 veterans tackle real-world scenarios together — guided by a coach and scored by AI on how deeply you engage.',
    highlights: ['Live discussions', 'AI-scored feedback', 'Coach-facilitated'],
    stat: '3-6',
    statLabel: 'Veterans per fireteam'
  }
];

// Management Cards Data
const MANAGEMENT_CARDS = [
  {
    id: 'coaching-preferences',
    icon: 'https://cdn.lordicon.com/dqxvvqzi.json',
    title: 'Coaching Preferences',
    description: 'Choose your plan, set notification preferences, and tailor your coaching sessions to match your transition goals.',
    highlights: ['Basic, Pro & Premium plans', 'Session reminders & alerts', 'Profile customization'],
    link: '/client/accountsettings',
    ariaLabel: 'Coaching Preferences - Customize your coaching experience'
  },
  {
    id: 'journaling-task-management',
    icon: 'https://cdn.lordicon.com/kbtmbyzy.json',
    title: 'Journaling & Task Management',
    description: 'Reflect daily with guided journals, track weekly actions, and prioritize tasks using an Eisenhower Matrix built for your goals.',
    highlights: ['3 journal types with daily prompts', 'Drag-and-drop task prioritization', 'Streak tracking & progress stats'],
    link: '/client/taskmanagement',
    ariaLabel: 'Journaling and Task Management - Reflect and prioritize your goals'
  },
  {
    id: 'career-education-compass',
    icon: 'https://cdn.lordicon.com/zhiiqoue.json',
    title: 'Career & Education Compass',
    description: 'Track job applications, manage your network, monitor your GPA and coursework — all from one dashboard.',
    highlights: ['Application & interview tracker', 'Salary research & employer targeting', 'GPA tracking & course modules'],
    link: '/client/mycareercompass',
    ariaLabel: 'Career and Education Compass - Track career and education progress'
  }
];

// Scroll Animation Hook
const useScrollAnimation = () => {
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return ref;
};

export default function Homepage() {
  // Handler for management card interactions
  const handleCardInteraction = (cardId) => {
    // Placeholder for future navigation or modal opening
    console.log(`Card clicked: ${cardId}`);
    // TODO: Implement actual navigation or modal logic
  };

  const handleCardKeyDown = (e, cardId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardInteraction(cardId);
    }
  };

  // Initialize scroll animations
  const heroRef = useScrollAnimation();
  const programsRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const communityRef = useScrollAnimation();
  const manageRef = useScrollAnimation();

  // Scroll-driven effects (Lenis): progress 0–1, hero parallax, progress bar
  const scrollProgress = useMotionValue(0);
  useLenis((lenis) => {
    scrollProgress.set(lenis.progress);
  });
  const heroBgY = useTransform(scrollProgress, [0, 0.25], [0, 80]);
  const heroContentScale = useTransform(scrollProgress, [0, 0.2], [1, 0.98]);
  const progressBarWidth = useTransform(scrollProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="bg-background text-foreground relative overflow-x-hidden">
      <Script src="https://cdn.lordicon.com/lordicon.js" strategy="lazyOnload" />

      {/* Scroll progress bar — Lenis-driven */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-orange-500 z-[100] origin-left"
        style={{ width: progressBarWidth }}
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] bg-[#002147] text-white py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden flex items-center"
        aria-label="Hero section with main call to action"
      >
        {/* Background (parallax: moves slower than scroll) */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,33,71,0.95) 0%, rgba(0,33,71,0.85) 50%, rgba(255,94,26,0.35) 100%), url('/landingpage4.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: Z_INDEX.background,
            y: heroBgY,
          }}
          aria-hidden="true"
        />

        <div className="absolute top-1/4 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-l from-orange-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ zIndex: Z_INDEX.background }} />

        <motion.div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative w-full" style={{ zIndex: Z_INDEX.content, scale: heroContentScale }}>
    <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
        Empowering Veterans to <span className="block sm:inline">Thrive After Service</span>{' '}
        <span className="text-orange-500 block mt-1">with Community Support</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 max-w-xl leading-relaxed mx-auto lg:mx-0">
        Tailored coaching, smart tools, and a community that understands your journey.
      </p>
      <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center lg:items-start">
                <Link
                  href="/signup"
          className="group relative px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center overflow-hidden hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 text-sm"
                >
          <span className="relative z-10 flex items-center justify-center gap-2">
          Get Started for Free
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
                <Link
          href="/pages/vsoclaimsupport"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold text-center hover:bg-white hover:text-[#002147] transition-all duration-300 text-sm"
                >
          VSO Claim Support 
                </Link>
              </div>
            </div>
        </motion.div>
      </section>

<section 
  ref={programsRef}
  id="how-we-help" 
  className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden scroll-mt-[120px]" 
  style={{ background: 'linear-gradient(160deg, #002147 0%, #FF7D33 15%, #FF5E1A 30%, #002147 50%)' }}
  aria-labelledby="programs-heading"
>
  {/* gradient */}
  <div className="absolute top-1/3 left-0 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ zIndex: Z_INDEX.background }} />
  
  {/* Content Container */}
  <div className="relative max-w-6xl mx-auto" style={{ zIndex: Z_INDEX.content }}>
    {/* Section Header */}
    <div className="mb-10 md:mb-12 text-center">
      <h2 id="programs-heading" className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 uppercase text-white">Our Programs</h2>
      <div className="w-12 h-1 bg-white mx-auto rounded-full" aria-hidden="true"/>
      <p className="mt-3 text-gray-200 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
        Comprehensive support designed specifically for veterans at every stage of their journey
      </p>
    </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {PROGRAMS.map(({ title, desc, image, alt, highlights, link }) => (
        <div 
          key={title} 
          className="group relative bg-white overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
        >
          {/* Gradient border effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"/>
          </div>

          {/* Content Container */}
          <div className="relative p-4 sm:p-5 flex flex-col flex-grow">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#002147] group-hover:text-orange-600 transition-colors leading-snug mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed mb-3 flex-grow">
              {desc}
            </p>

            {/*  pill badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {highlights.map((item) => (
                <span 
                  key={item} 
                  className="bg-gradient-to-r from-blue-50 to-orange-50 text-[#002147] px-2 py-0.5 text-xs font-semibold border border-blue-100"
                >
                  {item}
                </span>
              ))}
            </div>

            {/*  button with arrow */}
              <Link
                href={link}
              className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all duration-300 text-xs mt-auto"
                aria-label={`Learn more about ${title}`}
              >
                Learn More
              <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              </Link>
          </div>
        </div>
      ))}
    </div>
          </div>
      </section>

      <section
        ref={featuresRef}
        className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #002147 0%, #001a3a 40%, #002147 100%)' }}
        aria-labelledby="features-heading"
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,33,71,0.95) 0%, rgba(0,26,58,0.92) 50%, rgba(0,33,71,0.95) 100%), url('/aIandfeatires.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: Z_INDEX.background
          }}
          aria-hidden="true"
        />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-gradient-to-l from-orange-500/8 to-transparent rounded-full blur-3xl" style={{ zIndex: Z_INDEX.background }} />
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-blue-400/5 to-transparent rounded-full blur-3xl" style={{ zIndex: Z_INDEX.background }} />

        <div className="max-w-6xl mx-auto relative" style={{ zIndex: Z_INDEX.content }}>
          {/* Section Header */}
          <div className="mb-12 md:mb-16 text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-widest mb-4">
              Platform Features
            </span>
            <h2 id="features-heading" className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              Built for Your <span className="text-orange-500">Transition</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Every feature is designed with veterans in mind — simple to use, powerful when you need it.
            </p>
          </div>

          {/* Feature Cards — Alternating layout on desktop, stacked on mobile */}
          <div className="space-y-6 md:space-y-8">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                className={`group relative flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch gap-0 md:gap-0 bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-all duration-500 overflow-hidden`}
              >
                {/* Hover glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" aria-hidden="true" />

                {/* Stat highlight side panel */}
                <div className={`relative flex-shrink-0 w-full md:w-48 lg:w-56 bg-gradient-to-br from-orange-500 to-orange-600 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-1 py-4 md:py-0 px-6 md:px-4`}>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none">{feature.stat}</span>
                  <span className="text-xs sm:text-sm text-white/80 font-medium md:text-center">{feature.statLabel}</span>
                </div>

                {/* Content area */}
                <div className="relative flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 p-2 sm:p-2.5 bg-white/10 border border-white/10 group-hover:border-orange-500/30 transition-colors duration-300">
                      <lord-icon
                        src={feature.icon}
                        trigger="hover"
                        colors="primary:#ee8220,secondary:#ffffff"
                        style={{ width: '36px', height: '36px' }}
                        class="sm:w-10 sm:h-10"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlight pills */}
                  <div className="flex flex-wrap gap-2 mt-1 ml-0 sm:ml-[52px] md:ml-[56px]">
                    {feature.highlights.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs sm:text-sm font-medium group-hover:border-orange-500/20 group-hover:text-white transition-all duration-300"
                      >
                        <svg className="w-3 h-3 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 overflow-hidden text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Free Trial Now
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <p className="text-xs text-gray-400">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 text-[#002147] relative overflow-hidden" 
        style={{ background: 'linear-gradient(160deg, #002147 0%, #FF7D33 15%, #FF5E1A 50%, #002147 60%)' }}
        aria-labelledby="testimonials-heading"
      >
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 left-1/3 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ zIndex: Z_INDEX.background }} />
        
        <div className="max-w-5xl mx-auto relative" style={{ zIndex: Z_INDEX.content }}>
          {/* Section Header */}
          <div className="mb-10 md:mb-12 text-center">
            <h2 id="testimonials-heading" className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 uppercase text-white">
              Veteran Voices
            </h2>
            <div className="w-12 h-1 bg-white mx-auto rounded-full mb-3" aria-hidden="true"/>
            <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-xl mx-auto leading-relaxed">
              Real stories from veterans who found their path forward with WANAC
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
                className="group relative bg-white p-5 sm:p-6 hover:shadow-2xl transition-all duration-500"
              >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Quote icon  */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                    <FaQuoteLeft className="text-sm sm:text-base" />
                  </div>
                  
                  <blockquote className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Author info */}
                  <div className="flex items-center gap-2.5 sm:gap-3 pt-3 border-t border-gray-100">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden ring-2 ring-orange-500/20 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                        alt={testimonial.name}
                      fill
                        sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                      <p className="font-bold text-[#002147] text-xs sm:text-sm">{testimonial.name}</p>
                      <p className="text-xs text-orange-600 font-medium">{testimonial.branch}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
        </div>
      </section>

      {/* Community CTA */}
      <section 
        ref={communityRef}
        id="community" 
        className="relative bg-[#002147] text-white text-center py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-[120px]"
        aria-labelledby="community-heading"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/community1.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#002147]/50 to-[#002147]"></div>
        
        {/* Simplified Animated Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-5 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 id="community-heading" className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 uppercase">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
            Join Our Community
            </span>
          </h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-gray-200 max-w-xl mx-auto leading-relaxed px-4">
            Discover upcoming events, connect with fellow veterans, and make an impact together.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            <Link 
              href="/signup" 
              className="group relative px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-500 overflow-hidden shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform group-hover:scale-105 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
                Sign Up
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              href="/donate" 
              className="group relative px-5 sm:px-6 py-2.5 sm:py-3 bg-white overflow-hidden shadow-xl hover:shadow-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 transform group-hover:scale-105 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-[#002147] group-hover:text-orange-500 transition-colors">
                Donate
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* Manage Experience Section */}
      <section
        ref={manageRef}
        className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #002147 0%, #001530 50%, #002147 100%)' }}
        aria-labelledby="manage-experience-heading"
      >
        {/* Background */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,33,71,0.96) 0%, rgba(0,21,48,0.94) 50%, rgba(0,33,71,0.96) 100%), url('/pexels-rdne-7467965.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat',
            zIndex: Z_INDEX.background
          }}
          aria-hidden="true"
        />

        {/* Decorative gradients */}
        <div className="absolute top-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-gradient-to-br from-orange-500/6 to-transparent rounded-full blur-3xl" style={{ zIndex: Z_INDEX.background }} />
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-tl from-blue-400/5 to-transparent rounded-full blur-3xl" style={{ zIndex: Z_INDEX.background }} />

        <div className="max-w-6xl mx-auto relative" style={{ zIndex: Z_INDEX.content }}>
          {/* Section Header */}
          <div className="mb-12 md:mb-16 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/15 text-gray-300 text-xs font-semibold uppercase tracking-widest mb-4">
              Your Dashboard
            </span>
            <h2 id="manage-experience-heading" className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              Manage Your <span className="text-orange-500">Experience</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your coaching journey, journals, career progress, and goals — organized in one place.
            </p>
          </div>

          {/* Cards — numbered, left-aligned content, with highlights */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {MANAGEMENT_CARDS.map((card, index) => (
              <Link
                key={card.id}
                href={card.link}
                className="group relative flex flex-col sm:flex-row items-stretch bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
                aria-label={card.ariaLabel}
              >
                {/* Hover glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/0 via-orange-500/8 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" aria-hidden="true" />

                {/* Number badge — side strip */}
                <div className="relative flex-shrink-0 w-full sm:w-20 md:w-24 bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-500/30 group-hover:text-orange-500/50 transition-colors duration-300 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="relative flex-1 p-5 sm:p-6 md:p-8">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/15 to-orange-600/5 border border-orange-500/20 group-hover:border-orange-500/40 transition-colors duration-300">
                      <lord-icon
                        src={card.icon}
                        trigger="hover"
                        colors="primary:#ee8220,secondary:#ffffff"
                        style={{ width: '32px', height: '32px' }}
                        class="sm:w-9 sm:h-9"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-1.5 group-hover:text-gray-300 transition-colors duration-300">
                        {card.description}
                      </p>
                    </div>

                    {/* Arrow — desktop only */}
                    <div className="hidden md:flex items-center self-center flex-shrink-0 ml-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Highlight pills */}
                  <div className="flex flex-wrap gap-2 ml-0 sm:ml-[48px] md:ml-[52px]">
                    {card.highlights.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs sm:text-sm font-medium group-hover:border-orange-500/20 group-hover:text-gray-200 transition-all duration-300"
                      >
                        <svg className="w-3 h-3 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
