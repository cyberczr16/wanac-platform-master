import { useState } from 'react';

const segments = [];

export default function InfographicWheel() {
  const [active, setActive] = useState(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* SVG Wheel */}
        <div className="relative w-[300px] h-[300px] mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* No segments to render */}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-2 text-sm font-semibold text-gray-700">
              {/* Empty title */}
            </div>
          </div>
        </div>

        {/* Empty Segment Details */}
        <div className="max-w-md">
          {/* No content to display */}
        </div>
      </div>
    </section>
  );
}