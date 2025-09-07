"use client";
import { useParams } from "next/navigation";

export default function FireteamDetailPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-2xl mt-10">
        <h1 className="text-2xl font-bold mb-4">Fireteam Details</h1>
        <p className="text-lg">Fireteam ID: <span className="font-mono text-blue-600">{id}</span></p>
        {/* TODO: Fetch and display fireteam details here */}
      </div>
    </div>
  );
}
