import React from 'react';
import { useRouter } from 'next/router';

const ExperiencePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { fireteamId } = router.query;

  // Placeholder for fetching experience data
  // You can replace this with your actual data fetching logic
  // Example: useEffect(() => { fetchExperience(id, fireteamId) }, [id, fireteamId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Experience Details</h1>
      <p>Experience ID: {id}</p>
      <p>Fireteam ID: {fireteamId}</p>
      {/* Render experience details here */}
      <div className="mt-6">
        <p>This is the experience details page. Add your content here.</p>
      </div>
    </div>
  );
};

export default ExperiencePage;
