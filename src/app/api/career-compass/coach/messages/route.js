import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Mock messaging data
    const messagesData = {
      thread: {
        participantId: 'veteran-001',
        coachId: 'coach-001',
        coachName: 'Sarah Mitchell',
      },
      messages: [
        {
          id: 'msg-001',
          sender: 'coach',
          senderName: 'Sarah Mitchell',
          content: 'Hi! I wanted to check in on your progress with the resume assignments. How are things going?',
          timestamp: '2025-04-01T09:15:00Z',
          read: true,
        },
        {
          id: 'msg-002',
          sender: 'veteran',
          senderName: 'You',
          content: 'Hi Sarah! I\'ve completed the resume draft. Just wanted to get your feedback before moving forward.',
          timestamp: '2025-04-01T14:30:00Z',
          read: true,
        },
        {
          id: 'msg-003',
          sender: 'coach',
          senderName: 'Sarah Mitchell',
          content: 'Great! I\'ll review it before our next session on April 8th. In the meantime, can you take a look at the networking assignment I shared?',
          timestamp: '2025-04-01T15:45:00Z',
          read: true,
        },
        {
          id: 'msg-004',
          sender: 'veteran',
          senderName: 'You',
          content: 'Yes, I\'ve started researching companies. Found a few that align with my career goals. Should I reach out to anyone there?',
          timestamp: '2025-04-02T10:20:00Z',
          read: true,
        },
        {
          id: 'msg-005',
          sender: 'coach',
          senderName: 'Sarah Mitchell',
          content: 'Absolutely! Start with informational interviews - they\'re great for networking without the pressure of a formal job application. I\'ll share some tips on how to approach people.',
          timestamp: '2025-04-02T11:00:00Z',
          read: true,
        },
        {
          id: 'msg-006',
          sender: 'veteran',
          senderName: 'You',
          content: 'That sounds helpful. Looking forward to our session next Tuesday!',
          timestamp: '2025-04-02T16:30:00Z',
          read: true,
        },
        {
          id: 'msg-007',
          sender: 'coach',
          senderName: 'Sarah Mitchell',
          content: 'See you then! You\'re making excellent progress. Keep up the momentum.',
          timestamp: '2025-04-03T09:00:00Z',
          read: false,
        },
      ],
    };

    return NextResponse.json(messagesData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Mock message creation
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'veteran',
      senderName: 'You',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
