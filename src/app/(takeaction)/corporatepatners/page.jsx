import React from "react";

const CorporatePartnersPage = () => {
  return (
    <div className="text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="bg-[url('/images/corporate-hero.jpg')] bg-cover bg-center text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-[#002147] md:text-5xl font-bold mb-4">
            Partner With the WANAC
          </h1>
          <p className="text-lg text-[#002147] md:text-xl mb-6">
            Align your brand with a mission that supports our nation’s military and their families.
          </p>
          <a
            href="#become-partner"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 text-lg font-medium rounded-full"
          >
            Become a Partner
          </a>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Partner With the US?</h2>
          <p className="text-gray-700 mb-6">
            By partnering with the WANAC, your company demonstrates its commitment to the men and women who serve our country. We offer meaningful opportunities for engagement, recognition, and impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { title: "Brand Alignment", desc: "Associate your business with a trusted and respected nonprofit." },
              { title: "Employee Engagement", desc: "Inspire your team through volunteerism and shared purpose." },
              { title: "Social Impact", desc: "Contribute directly to the morale and wellbeing of service members." }
            ].map(({ title, desc }, idx) => (
              <div key={idx} className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Logos */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-10">Our Corporate Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {[...Array(8)].map((_, i) => (
              <img
                key={i}
                src={`/images/partner-logo-${i + 1}.png`}
                alt={`Partner ${i + 1}`}
                className="h-20 mx-auto object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Become a Partner */}
      <section id="become-partner" className="bg-[#002147] text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
        <p className="text-lg mb-6">
          Learn more about how your organization can partner with the WANAC to support our military heroes.
        </p>
        <a
          href="https://www.uso.org/contact/partnerships"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-red-600 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-100"
        >
          Contact Our Team
        </a>
      </section>
    </div>
  );
};

export default CorporatePartnersPage;
