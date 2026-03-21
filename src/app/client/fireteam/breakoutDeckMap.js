export const breakoutDeckByExperienceId = {
  // Demo mapping (WANAC experience id -> Breakout slide_deckId)
  // Replace these with real IDs from your backend + breakout-data.json.
  // Example deck ids visible in breakout-data.json: dGroEHvrmqsC2TMkYH5A, uVsQSYlBzaowyXH2g23a, FOvoGhZsu0QPjqnNkPLZ
  //
  // 101: 'dGroEHvrmqsC2TMkYH5A',
};

export function getBreakoutDeckIdForExperience({ experienceId, experienceTitle }) {
  if (experienceId != null) {
    const mapped = breakoutDeckByExperienceId[Number(experienceId)];
    if (mapped) return mapped;
  }

  // Optional demo-friendly fallback by title.
  const title = String(experienceTitle || '').toLowerCase();
  if (title.includes('customer discovery')) return 'dGroEHvrmqsC2TMkYH5A';

  return null;
}

