import { useState, useEffect } from 'react';
import { meetingService } from '../../../../../../../services/api/meeting.service';
import { mockEvaluationData } from '../../../../../../../types/evaluation';

/**
 * Custom hook to fetch and manage evaluation data
 */
export function useEvaluationData(recordingId, _fireteamId, hasAI, userRole = 'client') {
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvaluationData() {
      try {
        setLoading(true);
        setError(null);

        if (hasAI && recordingId) {
          // Fetch AI-generated evaluation data from API
          console.log('Fetching AI evaluation data for recording:', recordingId);

          // Client summary endpoint is GET .../summary/client/{recordingId}/{clientId}
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
            
            // Transform API data to our evaluation format
            const transformedData = transformApiDataToEvaluationFormat(apiData);
            setEvaluationData(transformedData);
          } catch (apiError) {
            console.warn('Failed to fetch AI evaluation data, using mock data:', apiError);
            setEvaluationData(mockEvaluationData);
          }
        } else {
          // Generate basic metrics from available data
          console.log('Generating basic evaluation metrics');
          const basicData = generateBasicEvaluationData();
          setEvaluationData(basicData);
        }
      } catch (err) {
        console.error('Error loading evaluation data:', err);
        setError(err.message);
        // Fallback to mock data
        setEvaluationData(mockEvaluationData);
      } finally {
        setLoading(false);
      }
    }

    loadEvaluationData();
  }, [recordingId, hasAI, userRole]);

  return {
    evaluationData,
    loading,
    error
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
      id:   r.participantId,
      name: r.participantName,
      color: ['#002147', '#E87722', '#3BB5C8', '#D15924'][
        apiData.results.indexOf(r) % 4
      ],
      talkTimeMinutes: 5,
      engagementLevel: 'medium',
    }));

    return {
      conversationMap:   apiData.conversationMap   ?? mockEvaluationData.conversationMap,
      groupBalanceScore: apiData.groupBalanceScore  ?? { participants, averageTalkTime: 5, isBalanced: true, message: '' },
      individualEvaluations: apiData.results.map((r) => ({
        participantId:   r.participantId,
        participantName: r.participantName,
        evaluations: (r.evaluations ?? r.rubricResults ?? []).map((ev) => ({
          rubricId:          ev.rubricId,
          rubricTitle:       ev.rubricTitle,
          rubricDescription: ev.rubricDescription ?? '',
          bloomLevel:        ev.bloomLevel ?? { level: 'Did Not Discuss', score: 0, color: '#efefef' },
          contributions:     ev.contributions ?? ev.arguments ?? [],
          summary:           ev.summary ?? ev.justification ?? '',
          explanation:       ev.explanation ?? '',
        })),
      })),
      sessionInfo: {
        experienceTitle:   apiData.sessionInfo?.experienceId ?? 'Fireteam Session',
        duration:          '—',
        totalParticipants: apiData.results.length,
        startTime:         apiData.sessionInfo?.evaluatedAt ?? new Date().toISOString(),
        endTime:           apiData.sessionInfo?.evaluatedAt ?? new Date().toISOString(),
      },
    };
  }

  // ── Format B: legacy meetingService response ─────────────────────────────────
  // If it has the meeting service shape, try to adapt it
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
        participantId:   s.userId ?? String(i),
        participantName: s.userName ?? `Participant ${i + 1}`,
        evaluations: [{
          rubricId:          'general',
          rubricTitle:       'Overall Engagement',
          rubricDescription: 'General participation and discussion quality',
          bloomLevel:        { level: 'Understanding', score: 2, color: '#3BB5C8' },
          contributions:     s.participantSummary?.keyContributions ?? [],
          summary:           s.participantSummary?.overallSummary ?? '',
          explanation:       `Engagement: ${s.participantSummary?.engagementLevel ?? 'medium'}`,
        }],
      })),
    };
  }

  // Fallback to mock data
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
      experienceTitle: 'Basic Session Analysis'
    },
    individualEvaluations: mockEvaluationData.individualEvaluations.map(individualEval => ({
      ...individualEval,
      evaluations: individualEval.evaluations.map(evaluation => ({
        ...evaluation,
        summary: 'Basic session analysis - AI insights not available',
        explanation: 'This evaluation shows basic participation metrics. For detailed AI analysis, please process the recording with AI summary generation.',
        contributions: evaluation.contributions.slice(0, 2) // Limit contributions for basic view
      }))
    }))
  };
}
