import { FaUsers } from 'react-icons/fa';

export default function BreakoutRoom() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full">
        <FaUsers className="text-5xl text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Breakout Room</h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome to the Breakout Room! Here, you can join group discussions, collaborate with peers, and participate in interactive sessions designed to enhance your learning experience.
        </p>
        <div className="mt-4">
          {/* Future: Add join/create room actions here */}
          <span className="text-sm text-gray-400">(Interactive features coming soon)</span>
        </div>
      </div>
    </div>
  );
} 