function secondsToDurationLabel(seconds) {
  const sec = Number(seconds || 0);
  if (!Number.isFinite(sec) || sec <= 0) return '—';
  const mins = Math.max(1, Math.round(sec / 60));
  return `${mins} min`;
}

export function buildBreakoutAgenda({ breakoutData, deckId }) {
  const slidePrefix = `slide_deck/${deckId}/slide/`;

  // 1) Collect slides
  const slides = [];
  for (const [key, doc] of Object.entries(breakoutData || {})) {
    if (!key.startsWith(slidePrefix)) continue;
    // keys we want: slide_deck/<deckId>/slide/<slideId>
    const parts = key.split('/');
    if (parts.length !== 4) continue;
    const slideId = parts[3];
    slides.push({ slideId, ...doc });
  }

  slides.sort((a, b) => (a.slideOrder ?? 0) - (b.slideOrder ?? 0));

  // 2) Collect captions grouped by slideId
  const captionsBySlideId = {};
  for (const [key, doc] of Object.entries(breakoutData || {})) {
    if (!key.startsWith(slidePrefix)) continue;
    if (!key.includes('/slide_caption/')) continue;
    // key: slide_deck/<deckId>/slide/<slideId>/slide_caption/<captionId>
    const parts = key.split('/');
    if (parts.length < 6) continue;
    const slideId = parts[3];
    (captionsBySlideId[slideId] ||= []).push(doc);
  }

  for (const arr of Object.values(captionsBySlideId)) {
    arr.sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0));
  }

  // 3) Convert to agenda steps
  return slides.map((s) => {
    const title = s.slideName || s.slideDescription || 'Untitled';
    const isSessionProcessing = title.toLowerCase().includes('session processing');

    return {
      title,
      subtitle: s.slideDescription || s.slideName || '',
      duration: isSessionProcessing ? null : secondsToDurationLabel(s.slideDuration),
      breakout: {
        deckId,
        slideId: s.slideId,
        slideOrder: s.slideOrder ?? 0,
        slideDurationSec: Number(s.slideDuration || 0) || null,
        slideImageURL: s.slideImageURL || null,
        slideImageAltText: s.slideImageAltText || '',
        captions: captionsBySlideId[s.slideId] || [],
      },
    };
  });
}

