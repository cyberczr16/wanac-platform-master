import { useState, useEffect } from 'react';
import { meetingService } from '../../../../../../../services/api/meeting.service';
import { experienceService } from '../../../../../../../services/api/experience.service';
import { mockEvaluationData } from '../../../../../../../types/evaluation';

/** Rubrics used when the WANAC experience has none — matches common Fireteam / Breakout themes. */
const DEFAULT_RUBRICS = [
  {
    id: 1,
    rubric: 'Demand validation & customer insight',
    rubricDescription: 'Engagement with validating demand and understanding customer needs.',
    rubricPrompt:
      'Did the participant discuss demand validation, customer needs, surveys, interviews, or evidence of market interest?',
    rubricType: 'discussion',
  },
  {
    id: 2,
    rubric: 'Market research & application',
    rubricDescription: 'Application of research concepts to realistic scenarios.',
    rubricPrompt:
      'Did the participant apply market research ideas, compare options, or relate discussion to concrete examples?',
    rubricType: 'discussion',
  },
];

const GROQ_EVAL_CACHE_PREFIX = 'wanac-fireteam-groq-eval:';

function parseRecordingMetadata(recording) {
  if (!recording?.metadata) return {};
  const m = recording.metadata;
  if (typeof m === 'string') {
    try {
      return JSON.parse(m);
    } catch {
      return {};
    }
  }
  return typeof m === 'object' ? m : {};
}

function extractTranscript(recording, metadata) {
  if (recording?.transcript && String(recording.transcript).trim()) {
    return String(recording.transcript).trim();
  }
  if (metadata?.transcript && String(metadata.transcript).trim()) {
    return String(metadata.transcript).trim();
  }
  return '';
}

/**
 * Without speaker diarization, each listed participant receives the full transcript;
 * the model scores each person against rubrics from the same text (quotes may overlap).
 */
function buildParticipantsForEvaluate(transcript, metadata) {
  const raw = metadata.participants || metadata.attendance_log || metadata.attendanceLog;
  const list = Array.isArray(raw) ? raw : [];

  if (list.length === 0) {
    const uid =
      typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'participant-1' : 'participant-1';
    const uname =
      typeof window !== 'undefined' ? localStorage.getItem('user_name') || 'Participant' : 'Participant';
    return [{ id: String(uid), name: String(uname), transcript }];
  }

  return list.map((p, i) => ({
    id: String(p.id ?? p.user_id ?? p.client_id ?? i + 1),
    name: String(p.name ?? p.user_name ?? p.userName ?? `Participant ${i + 1}`),
    transcript,
  }));
}

function normalizeRubricsFromExperience(experience) {
  const raw = experience?.rubrics ?? experience?.rubric_items ?? experience?.experience_rubrics;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  return raw.map((r, i) => ({
    id: Number(r.id ?? r.rubric_id ?? i + 1),
    rubric: String(r.rubric ?? r.title ?? r.name ?? `Rubric ${i + 1}`),
    rubricDescription: String(r.rubricDescription ?? r.description ?? ''),
    rubricPrompt: String(r.rubricPrompt ?? r.prompt ?? r.evaluation_prompt ?? r.rubricDescription ?? ''),
    rubricType: r.rubricType ?? r.type ?? 'discussion',
  }));
}

/**
 * Custom hook to fetch and manage evaluation data.
 * With hasAI + recordingId: runs Bloom evaluation via Groq (POST /api/fireteam/evaluate), then falls back to WANAC summary API.
 */
export function useEvaluationData(recordingId, _fireteamId, experienceId, hasAI, userRole = 'client') {
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvaluationData() {
      try {
        setLoading(true);
        setError(null);

        if (hasAI && recordingId && recordingId !== 'unknown') {
          const cacheKey = `${GROQ_EVAL_CACHE_PREFIX}${recordingId}`;
          if (typeof window !== 'undefined') {
            try {
              const cached = sessionStorage.getItem(cacheKey);
              if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed?.results) {
                  const expTitle = parsed._experienceTitle || 'Fireteam Session';
                  const transformed = transformApiDataToEvaluationFormat(parsed);
                  transformed.sessionInfo = {
                    ...transformed.sessionInfo,
                    experienceTitle: expTitle,
                  };
                  setEvaluationData(transformed);
                  return;
                }
              }
            } catch {
              /* ignore cache */
            }
          }

          let experience = null;
          if (experienceId) {
            try {
              experience = await experienceService.getExperience(experienceId);
            } catch {
              experience = null;
            }
          }

          const expTitle =
            experience?.title || experience?.name || mockEvaluationData.sessionInfo.experienceTitle;
          const sessionContext = [
            experience?.title && `Experience: ${experience.title}`,
            (experience?.experience || experience?.description) &&
              `Description: ${experience.experience || experience.description}`,
          ]
            .filter(Boolean)
            .join('\n');

          try {
            const rec = await meetingService.getRecording(recordingId);

            if (rec) {
              const metadata = parseRecordingMetadata(rec);
              const transcript = extractTranscript(rec, metadata);

              if (transcript.length > 0) {
                const rubrics = normalizeRubricsFromExperience(experience) || DEFAULT_RUBRICS;
                const participants = buildParticipantsForEvaluate(transcript, metadata);

                const res = await fetch('/api/fireteam/evaluate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    experienceId: experienceId || '',
                    participants,
                    rubrics,
                    sessionContext: sessionContext || expTitle,
                  }),
                });

                if (res.ok) {
                  const groqPayload = await res.json();
                  const toStore = { ...groqPayload, _experienceTitle: expTitle };
                  if (typeof window !== 'undefined') {
                    try {
                      sessionStorage.setItem(cacheKey, JSON.stringify(toStore));
                    } catch {
                      /* ignore */
                    }
                  }

                  const transformed = transformApiDataToEvaluationFormat(groqPayload);
                  transformed.sessionInfo = {
                    ...transformed.sessionInfo,
                    experienceTitle: expTitle,
                    duration: metadata.duration || rec.duration || transformed.sessionInfo.duration,
                  };
                  setEvaluationData(transformed);
                  return;
                }

                const errBody = await res.json().catch(() => ({}));
                console.warn('Groq fireteam evaluate failed:', errBody?.error || res.status);
              }
            }
          } catch (groqErr) {
            console.warn('Groq evaluation path failed:', groqErr);
          }

          // Fallback: WANAC recording summary API (legacy summaries, not full Bloom rubrics)
          console.log('Falling back to recording summary API for recording:', recordingId);
          const clientId =
            typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

          if (userRole === 'client' && !clientId) {
            console.warn('No user_id in localStorage; cannot load client recording summary from API');
            setEvaluationData(mockEvaluationData);
            return;
          }

          try {
            const apiData = await meetingService.getRecordingSummaryByRole(
              recordingId,
              userRole,
              userRole === 'client' ? clientId : undefined
            );

            const transformedData = transformApiDataToEvaluationFormat(apiData);
            if (experience && transformedData?.sessionInfo) {
              transformedData.sessionInfo.experienceTitle =
                experience.title || transformedData.sessionInfo.experienceTitle;
            }
            setEvaluationData(transformedData);
          } catch (apiError) {
            console.warn('Failed to fetch AI evaluation data, using mock data:', apiError);
            setEvaluationData(mockEvaluationData);
          }
        } else {
          console.log('Generating basic evaluation metrics');
          const basicData = generateBasicEvaluationData();
          setEvaluationData(basicData);
        }
      } catch (err) {
        console.error('Error loading evaluation data:', err);
        setError(err.message);
        setEvaluationData(mockEvaluationData);
      } finally {
        setLoading(false);
      }
    }

    loadEvaluationData();
  }, [recordingId, experienceId, hasAI, userRole]);

  return {
    evaluationData,
    loading,
    error,
  };
}

/**
 * Transform API data (from /api/fireteam/evaluate — Groq — or meeting summaries API)
 * into the EvaluationData shape expected by the display components.
 *
 * Handles both:
 *   A) Results from POST /api/fireteam/evaluate (Groq Bloom's scoring)
 *   B) Results from meetingService.getRecordingSummaryByRole
 */
function transformApiDataToEvaluationFormat(apiData) {
  if (!apiData) return mockEvaluationData;

  // Recording API may return { summaries: { participantSummary, coachSummary, adminSummary } }
  if (
    apiData.summaries &&
    typeof apiData.summaries === 'object' &&
    apiData.summaries.participantSummary &&
    !apiData.participantSummary
  ) {
    return transformApiDataToEvaluationFormat(apiData.summaries);
  }

  // ── Format A: direct response from /api/fireteam/evaluate ───────────────────
  if (Array.isArray(apiData.results)) {
    const participants = apiData.results.map((r) => ({
      id: r.participantId,
      name: r.participantName,
      color: ['#002147', '#E87722', '#3BB5C8', '#D15924'][apiData.results.indexOf(r) % 4],
      talkTimeMinutes: 5,
      engagementLevel: 'medium',
    }));

    return {
      conversationMap: apiData.conversationMap ?? mockEvaluationData.conversationMap,
      groupBalanceScore:
        apiData.groupBalanceScore ?? {
          participants,
          averageTalkTime: 5,
          isBalanced: true,
          message: '',
        },
      individualEvaluations: apiData.results.map((r) => ({
        participantId: r.participantId,
        participantName: r.participantName,
        evaluations: (r.evaluations ?? r.rubricResults ?? []).map((ev) => ({
          rubricId: ev.rubricId,
          rubricTitle: ev.rubricTitle,
          rubricDescription: ev.rubricDescription ?? '',
          bloomLevel: ev.bloomLevel ?? {
            level: 'Did Not Discuss',
            score: 0,
            color: '#efefef',
          },
          contributions: ev.contributions ?? ev.arguments ?? [],
          summary: ev.summary ?? ev.justification ?? '',
          explanation: ev.explanation ?? '',
        })),
      })),
      sessionInfo: {
        experienceTitle:
          apiData.sessionInfo?.experienceTitle ?? apiData.sessionInfo?.experienceId ?? 'Fireteam Session',
        duration: '—',
        totalParticipants: apiData.results.length,
        startTime: apiData.sessionInfo?.evaluatedAt ?? new Date().toISOString(),
        endTime: apiData.sessionInfo?.evaluatedAt ?? new Date().toISOString(),
      },
    };
  }

  // ── Format B: legacy meetingService response ─────────────────────────────────
  if (apiData.summaries || apiData.participantSummary) {
    const summaries = apiData.summaries ?? [apiData];
    return {
      ...mockEvaluationData,
      sessionInfo: {
        ...mockEvaluationData.sessionInfo,
        experienceTitle: apiData.experienceTitle ?? 'Fireteam Session',
        totalParticipants: summaries.length,
      },
      individualEvaluations: summaries.map((s, i) => ({
        participantId: s.userId ?? String(i),
        participantName: s.userName ?? `Participant ${i + 1}`,
        evaluations: [
          {
            rubricId: 'general',
            rubricTitle: 'Overall Engagement',
            rubricDescription: 'General participation and discussion quality',
            bloomLevel: { level: 'Understanding', score: 2, color: '#3BB5C8' },
            contributions: s.participantSummary?.keyContributions ?? [],
            summary: s.participantSummary?.overallSummary ?? '',
            explanation: `Engagement: ${s.participantSummary?.engagementLevel ?? 'medium'}`,
          },
        ],
      })),
    };
  }

  return mockEvaluationData;
}

/**
 * Generate basic evaluation data without AI processing
 */
function generateBasicEvaluationData() {
  return {
    ...mockEvaluationData,
    sessionInfo: {
      ...mockEvaluationData.sessionInfo,
      experienceTitle: 'Basic Session Analysis',
    },
    individualEvaluations: mockEvaluationData.individualEvaluations.map((individualEval) => ({
      ...individualEval,
      evaluations: individualEval.evaluations.map((evaluation) => ({
        ...evaluation,
        summary: 'Basic session analysis - AI insights not available',
        explanation:
          'This evaluation shows basic participation metrics. For detailed AI analysis, please process the recording with AI summary generation.',
        contributions: evaluation.contributions.slice(0, 2),
      })),
    })),
  };
}
