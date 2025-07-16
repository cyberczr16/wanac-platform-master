
export default function Page() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-gray-700 text-green-400 font-bold">Virtual Huddle</div>
          <div className="p-4 text-sm text-gray-400">Web Conferencing</div>
          <nav className="mt-4">
            <ul className="space-y-2 px-4">
              <li className="text-gray-300">Dashboard</li>
              <li className="text-gray-300">Reports</li>
            </ul>
          </nav>

          <div className="mt-6 px-4 text-sm text-gray-400">COURSES</div>
          <ul className="mt-2 space-y-1 px-4">
            <li className="flex justify-between text-white">Prototyping <span className="bg-red-600 text-xs px-2 rounded-full">10</span></li>
            <li className="flex justify-between text-white">Human-Computer... <span className="bg-red-600 text-xs px-2 rounded-full">2</span></li>
            <li className="text-white">Webflow Fundamentals</li>
            <li className="text-white">Origami Studio</li>
          </ul>

          <div className="mt-6 px-4 text-sm text-gray-400">Assignments</div>
          <ul className="mt-2 px-4">
            <li className="text-blue-400">Navigating the Path...</li>
          </ul>

          <div className="mt-6 px-4 text-sm text-gray-400">DIRECT MESSAGES</div>
          <ul className="mt-2 px-4 space-y-1">
            <li className="text-white">Annette Black</li>
            <li className="text-white">Marvin McKinney</li>
            <li className="text-white">Robert Fox</li>
          </ul>
        </div>

        <div className="p-4 space-y-2 text-sm text-gray-300">
          <div>Settings</div>
          <div>Help</div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Navigating the path to success.</h1>
          <div className="flex items-center space-x-4">
            <span className="text-red-400">● Recording</span>
            <div className="w-8 h-8 rounded-full bg-pink-400"></div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 p-6">
          {/* Top Left */}
          <div className="bg-gray-700 rounded-lg flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-2xl">👨🏽‍🎓</div>
            <div className="mt-2 text-sm text-gray-200">Melody Onuocha</div>
          </div>

          {/* Top Right */}
          <div className="relative rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/400x250" alt="Darrell Stewart" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-orange-500 text-sm px-2 py-1 rounded">Darrell Steward</div>
          </div>

          {/* Bottom Left */}
          <div className="relative rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/400x250" alt="Bessie Cooper" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-red-500 text-sm px-2 py-1 rounded">Bessie Cooper</div>
          </div>

          {/* Bottom Right */}
          <div className="relative rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/400x250" alt="Esther Howard" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-green-500 text-sm px-2 py-1 rounded">Esther Howard</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-center space-x-4 border-t border-gray-700">
          <button className="bg-gray-700 p-2 rounded-full">🎤</button>
          <button className="bg-gray-700 p-2 rounded-full">🎥</button>
          <button className="bg-gray-700 p-2 rounded-full">💬</button>
          <button className="bg-red-600 p-2 rounded-full">📞</button>
        </div>
      </main>
    </div>
  );
}
