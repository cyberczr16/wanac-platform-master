import { Suspense } from "react";
import CommunityContent from "./CommunityContent";

// Main component with Suspense boundary
export default function CoachCommunityPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
