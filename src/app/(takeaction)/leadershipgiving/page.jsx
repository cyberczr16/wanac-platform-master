import React from "react";

const LeadershipGivingPage = () => {
  return (
    <div className="text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="bg-[#002147] bg-cover bg-center text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Leadership Giving
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Make a lasting impact through philanthropic leadership and transform the lives of service members and their families.
          </p>
          <a
            href="#donate"
            className="bg-orange-500 text-white hover:bg-orange-200 text-white px-6 py-3 text-lg font-medium rounded-full"
          >
            Give Now
          </a>
        </div>
      </section>

      {/* Gift Options */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Ways to Make a Major Impact</h2>
          <p className="text-gray-700 mb-8">
            Join a dedicated community of supporters through meaningful gift opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Major Gifts",
                desc: "Provide transformational support to help expand USO programs around the globe."
              },
              {
                title: "Planned Giving",
                desc: "Include the USO in your will or estate plans to leave a lasting legacy."
              },
              {
                title: "Donor-Advised Funds",
                desc: "Support the USO easily using your donor-advised fund contributions."
              }
            ].map(({ title, desc }, i) => (
              <div key={i} className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Highlight */}
      <section className="py-16 px-6 bg-[#f9f9f9]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Your Leadership Fuels Our Mission</h2>
          <p className="text-gray-700 text-lg">
            From supporting families during deployments to helping service members transition to civilian life, your generosity ensures that WANAC is always by their side.
          </p>
        </div>
      </section>

      {/* Donor Quotes */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-10">Voices of Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Linda K., WANAC Donor",
                quote: "Giving to the WANAC is my way of honoring the heroes who serve and sacrifice every day."
              },
              {
                name: "Robert M., Legacy Supporter",
                quote: "Including the WANAC in my estate plan was an easy decision — it's a cause I deeply believe in."
              }
            ].map(({ name, quote }) => (
              <div key={name} className="bg-white p-6 rounded shadow text-left">
                <p className="italic text-gray-700 mb-4">“{quote}”</p>
                <p className="font-bold text-gray-800">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="give-now" className="bg-[#002147] text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Leadership Circle</h2>
        <p className="text-lg mb-6">
          Make a difference that endures for generations.
        </p>
        <a
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 text-white hover:bg-orange-200 text-white px-6 py-3 text-lg font-medium rounded-full"
        >
          Contact Our Team
        </a>
      </section>
    </div>
  );
};

export default LeadershipGivingPage;
