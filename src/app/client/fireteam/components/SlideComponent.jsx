import React from "react";

export default function Slide({ step, participants = [], experienceTitle = "" }) {
  if (!step) return null;

  // Example: custom content for the first step (Waiting Room)
  if (step.title === "Waiting Room" || step.isWaitingRoom) {
    return (
      <div className="bg-yellow-400 rounded-xl shadow-lg p-10 text-center w-full mx-auto h-[420px] md:h-[520px] lg:h-[620px] flex flex-col justify-center">
        <h1 className="text-3xl font-black leading-tight mb-4">
          Welcome to your <br /> Fireteam Experience
        </h1>
        <p className="text-sm mb-4 text-gray-800">
          When your entire group has arrived, your group leader will advance
          to the next slide to begin the experience!
        </p>
        <hr className="border-t border-black w-1/2 mx-auto my-4" />
        
        {/* Participant Count */}
        <div className="my-4">
          <div className="inline-flex items-center justify-center bg-white rounded-full px-6 py-3 shadow-md">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-bold text-lg">
              {participants.length} {participants.length === 1 ? 'Participant' : 'Participants'} Joined
            </span>
          </div>
        </div>

        {experienceTitle && (
          <>
            <p className="text-sm mb-2">We hope you enjoy</p>
            <h2 className="font-bold text-lg">{experienceTitle}</h2>
          </>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-700">Sincerely,</p>
          <p className="text-sm font-medium text-gray-800">
            The WANAC Team
          </p>
        </div>
        
        {/* Waiting animation */}
        <div className="mt-6 flex justify-center items-center gap-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  // Custom content for AI-generated Results step
  if (step.title === "AI-generated Results") {
    return (
      <div className="bg-yellow-400 rounded-xl shadow-lg p-10 text-center w-full mx-auto h-[420px] md:h-[520px] lg:h-[620px]">
        <h1 className="text-3xl font-black leading-tight mb-4">{step.title}</h1>
        <p className="text-md font-medium mb-4">{step.subtitle}</p>
        <p className="text-sm text-gray-700 mb-6">Duration: {step.duration}</p>
        <button
          className="bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
          onClick={() => alert('Detailed AI Report coming soon!')}
        >
          View Detailed AI Report
        </button>
        <div className="mt-6">
          <span className="inline-block text-3xl"></span>
        </div>
      </div>
    );
  }

  // Placeholder for other steps
  return (
    <div className="bg-yellow-400 rounded-xl shadow-lg p-10 text-center w-full mx-auto h-[420px] md:h-[520px] lg:h-[620px]">
      <h1 className="text-3xl font-black leading-tight mb-4">{step.title}</h1>
      <p className="text-md font-medium mb-4">{step.subtitle}</p>
      <p className="text-sm text-gray-700">Duration: {step.duration}</p>
      <div className="mt-4">
        <span className="inline-block text-3xl">🎓</span>
      </div>
    </div>
  );
}