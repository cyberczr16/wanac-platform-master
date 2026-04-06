import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Mock coaching sessions data
    const sessionsData = {
      upcomingSessions: [
        {
          id: 'sess-upcoming-001',
          date: '2025-04-08',
          time: '10:00 AM',
          duration: 45,
          type: 'mock_interview', // resume_review, mock_interview, networking_strategy, career_planning
          title: 'Mock Interview #2: Technical Role Interview Practice',
          coach: {
            id: 'coach-001',
            name: 'Sarah Mitchell',
          },
          status: 'scheduled',
          meetingLink: 'https://zoom.us/meeting/upcoming-session-001',
          notes: 'Come prepared with answers for the research you did on our target companies.',
        },
        {
          id: 'sess-upcoming-002',
          date: '2025-04-22',
          time: '2:00 PM',
          duration: 60,
          type: 'career_planning',
          title: 'Career Planning Session: 5-Year Roadmap Review',
          coach: {
            id: 'coach-001',
            name: 'Sarah Mitchell',
          },
          status: 'scheduled',
          meetingLink: 'https://zoom.us/meeting/upcoming-session-002',
          notes: 'Please bring your completed goal-setting worksheet.',
        },
      ],
      pastSessions: [
        {
          id: 'sess-past-001',
          date: '2025-03-21',
          time: '10:00 AM',
          duration: 45,
          type: 'mock_interview',
          title: 'Mock Interview #1: General Competency Questions',
          coach: {
            id: 'coach-001',
            name: 'Sarah Mitchell',
          },
          status: 'completed',
          feedback: 'Excellent interview performance overall. Your answers were well-structured and showed great awareness of the company. Work on being more concise with some examples to stay within time limits.',
          recordingLink: 'https://recordings.zoom.us/session-001',
        },
        {
          id: 'sess-past-002',
          date: '2025-03-14',
          time: '10:00 AM',
          duration: 60,
          type: 'networking_strategy',
          title: 'Networking Fundamentals Workshop',
          coach: {
            id: 'coach-001',
            name: 'Sarah Mitchell',
          },
          status: 'completed',
          feedback: 'Great discussion on LinkedIn strategy. Your action items are clear. Follow up with me on the informational interviews you schedule.',
          recordingLink: 'https://recordings.zoom.us/session-002',
        },
        {
          id: 'sess-past-003',
          date: '2025-03-07',
          time: '11:00 AM',
          duration: 60,
          type: 'resume_review',
          title: 'Resume Content Strategy & Achievement Bullets',
          coach: {
            id: 'coach-001',
            name: 'Sarah Mitchell',
          },
          status: 'completed',
          feedback: 'Outstanding work on translating your military background into civilian language. Your achievement bullets now clearly show impact and metrics.',
          recordingLink: 'https://recordings.zoom.us/session-003',
        },
        {
          id: 'sess-past-004',
          date: '2025-02-15',
          time: '2:00 PM',
          duration: 60,
          type: 'resume_review',
          title: 'Resume Format & ATS Optimization',
          coach: {
            id: 'coach-001',
            name: 'Sarah Mitchell',
          },
          status: 'completed',
          feedback: 'Your resume formatting looks great now. All the best practices are applied. Ready to move to the next phase.',
          recordingLink: 'https://recordings.zoom.us/session-004',
        },
      ],
    };

    return NextResponse.json(sessionsData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { type, preferredDate, preferredTime, notes } = await req.json();

    if (!type || !preferredDate) {
      return NextResponse.json(
        { error: 'Type and preferred date are required' },
        { status: 400 }
      );
    }

    // Mock session request creation
    const newRequest = {
      id: `sess-req-${Date.now()}`,
      type,
      preferredDate,
      preferredTime: preferredTime || 'Any time',
      notes: notes || '',
      status: 'pending', // pending, confirmed, rejected
      createdAt: new Date().toISOString(),
      message: 'Your session request has been submitted. Your coach will confirm the details within 24 hours.',
    };

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
