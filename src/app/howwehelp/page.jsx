export default function HowWeHelp() {
  const supportAreas = [
    {
      id: 1,
      title: "Personal Growth Assessment",
      description: "Take our comprehensive Life Score Assessment to identify your strengths and areas for development in your transition journey.",
      icon: "",
      features: ["Personalized insights", "Progress tracking", "Action recommendations"]
    },
    {
      id: 2,
      title: "Transition Coaching",
      description: "Work one-on-one with experienced coaches who understand the unique challenges of military transition.",
      icon: "",
      features: ["Customized coaching plans", "Goal setting", "Career guidance"]
    },
    {
      id: 3,
      title: "Reflective Journaling",
      description: "Document your journey and insights with our structured journaling platform designed for personal growth.",
      icon: "",
      features: ["Guided prompts", "Progress tracking", "Private space for reflection"]
    },
    {
      id: 4,
      title: "Veteran Community",
      description: "Connect with fellow veterans who understand your journey and share experiences in a supportive environment.",
      icon: "",
      features: ["Peer support", "Networking", "Shared experiences"]
    }
  ];

  const coachingPhases = [
    {
      id: 1,
      title: "Phase 1: Promise Land Transition",
      description: "Begin your journey with our foundational program designed specifically for military transition.",
      icon: "",
      features: [
        "Military to civilian transition strategy",
        "Identity transformation",
        "Core values alignment",
        "Goal setting framework"
      ]
    },
    {
      id: 2,
      title: "Phase 2: High Performance Coaching",
      description: "Elevate your potential and achieve excellence in your chosen path.",
      icon: "",
      features: [
        "Advanced performance techniques",
        "Leadership development",
        "Strategic decision making",
        "Personal brand building"
      ]
    },
    {
      id: 3,
      title: "Phase 3: Coaching Business Academy",
      description: "Transform your experience into a successful coaching business.",
      icon: "",
      features: [
        "Business model development",
        "Marketing strategies",
        "Client acquisition",
        "Sustainable practice building"
      ]
    }
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mb-6">
            Your Journey to Success Starts Here
          </h1>
          <p className="text-xl text-brand-blue max-w-3xl mx-auto">
            The WANAC Platform provides comprehensive support through our four-pillar approach
            and three-phase coaching program.
          </p>
        </div>

        {/* Support Areas Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-brand-navy mb-12 text-center">
            Our Support Pillars
          </h2>
          <div className="grid lg:grid-cols-2 gap-10">
            {supportAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span 
                      className="text-4xl bg-brand-navy bg-opacity-10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300" 
                      role="img" 
                      aria-hidden="true"
                    >
                      {area.icon}
                    </span>
                    <h3 className="text-2xl font-bold text-brand-navy">
                      {area.title}
                    </h3>
                  </div>
                  <p className="text-lg text-brand-blue">{area.description}</p>
                  <ul className="space-y-3">
                    {area.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-brand-blue">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching Phases Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-brand-navy mb-12 text-center">
            Your Coaching Journey
          </h2>
          <div className="space-y-8">
            {coachingPhases.map((phase) => (
              <div
                key={phase.id}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <span 
                      className="text-4xl bg-brand-navy bg-opacity-10 p-4 rounded-full inline-block"
                      role="img" 
                      aria-hidden="true"
                    >
                      {phase.icon}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-brand-navy mb-4">
                      {phase.title}
                    </h3>
                    <p className="text-lg text-brand-blue mb-6">
                      {phase.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-brand-blue">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#002147">
          <h3 className="text-2xl font-bold text-brand-navy mb-6">
            Ready to Begin Your Transformation?
          </h3>
          <div className="space-x-4">
            <button
              className="bg-white text-brand-navy border-2 border-brand-navy px-8 py-3 rounded-lg font-semibold hover:[#ff5e1a] transition-colors duration-300"
              aria-label="Start your assessment"
            >
              Take Life Score Assessment
            </button>
            <button
              className="bg-white text-brand-navy border-2 border-brand-navy px-8 py-3 rounded-lg font-semibold hover:bg-[#ff5e1a] transition-colors duration-300"
              aria-label="Schedule a consultation"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
