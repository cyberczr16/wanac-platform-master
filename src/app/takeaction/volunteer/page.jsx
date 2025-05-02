import React from "react";

const VolunteerPage = () => {
  const volunteerSteps = [
    { 
      step: 1, 
      title: "Explore Opportunities", 
      desc: "Find volunteer roles near you that match your interests." 
    },
    { 
      step: 2, 
      title: "Apply Online", 
      desc: "Submit your application through our secure platform." 
    },
    { 
      step: 3, 
      title: "Start Making a Difference", 
      desc: "Receive training and begin your journey." 
    }
  ];

  const volunteerStories = [
    {
      name: "Sarah M.",
      story: "Volunteering at the USO has allowed me to give back to those who serve. It's been incredibly rewarding.",
      role: "Event Coordinator"
    },
    {
      name: "James T.",
      story: "The community I've built through volunteering is like a second family. I wouldn't trade it for anything.",
      role: "Program Assistant"
    }
  ];

  const faqData = [
    {
      question: "What are the time commitments for volunteering?",
      answer: "Volunteer commitments are flexible and can range from a few hours per week to monthly engagements, depending on your availability and the program you choose."
    },
    {
      question: "Do I need special qualifications to volunteer?",
      answer: "Most volunteer positions don't require special qualifications. We provide all necessary training. However, you must be 18 or older and pass a background check."
    },
    {
      question: "Can I volunteer if I'm not affiliated with the military?",
      answer: "Absolutely! We welcome volunteers from all backgrounds. Your dedication to helping service members and their families is what matters most."
    },
    {
      question: "What kinds of volunteer opportunities are available?",
      answer: "We offer various opportunities including event support, administrative assistance, mentoring, and program coordination. You can choose based on your interests and skills."
    }
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section 
        className="relative bg-[url('/images/volunteer-hero.jpg')] bg-cover bg-center py-32 px-4"
        aria-label="Hero section"
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Volunteer with WANAC
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white">
            Make a difference in the lives of service members and their families.
          </p>
          <a
            href="#get-started"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors duration-300"
            aria-label="Get started volunteering"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Steps to Volunteer */}
      <section 
        id="get-started" 
        className="py-20 px-6 bg-gray-50"
        aria-label="Volunteering steps"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
            How to Volunteer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {volunteerSteps.map(({ step, title, desc }) => (
              <div 
                key={step}
                className="bg-white shadow-lg rounded-xl p-8 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold">{step}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
                <p className="text-gray-600 text-center">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Stories */}
      <section 
        className="py-20 px-6 bg-white"
        aria-label="Volunteer stories"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
            Meet Our Volunteers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {volunteerStories.map(({ name, story, role }) => (
              <div 
                key={name}
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <p className="italic text-gray-700 mb-6 text-lg">"{story}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-gray-800 text-lg">— {name}</p>
                  <p className="text-red-600">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        className="py-20 px-6 bg-gray-50"
        aria-label="Frequently asked questions"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
                role="region"
                aria-label={`FAQ item ${index + 1}`}
              >
                <h3 className="text-xl font-semibold mb-4 text-[#002147]">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="py-20 px-6 bg-[#002147] text-white"
        aria-label="Call to action"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-xl mb-8">
            Start your volunteer journey and make a lasting impact.
          </p>
          <a
            href="https://volunteers.uso.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-full text-lg font-medium transition-colors duration-300 hover:bg-gray-100"
            aria-label="Apply to volunteer - Opens in new tab"
          >
            Apply to Volunteer
          </a>
        </div>
      </section>
    </div>
  );
};

export default VolunteerPage;
