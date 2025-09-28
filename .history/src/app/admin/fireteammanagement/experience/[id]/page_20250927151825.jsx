import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ExperiencePage = () => {
  const router = useRouter();
  const { id, fireteamId } = router.query;
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fireteamId && id) {
      setLoading(true);
      fetch(`https://wanac-api.kuzasports.com/api/v1/fireteams/experiences/${fireteamId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch experiences');
          return res.json();
        })
        .then(data => {
          // Find the experience with the matching id
          const found = Array.isArray(data) ? data.find(exp => String(exp.id) === String(id)) : null;
          setExperience(found);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [fireteamId, id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Experience Details</h1>
      <p>Experience ID: {id}</p>
      <p>Fireteam ID: {fireteamId}</p>
      {loading && <p>Loading experience...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && experience ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">{experience.title}</h2>
          <p>{experience.experience}</p>
          {/* Add more fields as needed */}
        </div>
      ) : null}
      {!loading && !error && !experience && (
        <div className="mt-6">
          <p>No experience found for this ID.</p>
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
