import { Suspense } from "react";
import CommunityContent from "./CommunityContent";
import LoadingFallback from "../../../../components/LoadingFallback";

// Main component with Suspense boundary
export default function CoachCommunityPage() {
  return (
    <Suspense fallback={<LoadingFallback label="Loading community…" />}>
      <CommunityContent />
    </Suspense>
  );
}
