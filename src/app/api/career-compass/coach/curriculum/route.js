import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Mock PLCA curriculum data
    const curriculumData = {
      overallProgress: 45,
      modules: [
        {
          id: 'mod-001',
          name: 'Resume Building Foundations',
          description: 'Master the fundamentals of creating a compelling resume that resonates with hiring managers.',
          category: 'resume_building',
          status: 'completed', // not_started, in_progress, completed
          progress: 100,
          completedDate: '2025-02-28',
          sessions: [
            {
              id: 'sess-001',
              title: 'Resume Basics & Format',
              date: '2025-02-01',
              duration: 60,
              status: 'completed',
              notes: 'Covered ATS optimization, formatting best practices',
            },
            {
              id: 'sess-002',
              title: 'Content Strategy & Achievements',
              date: '2025-02-15',
              duration: 60,
              status: 'completed',
              notes: 'Worked on highlighting military skills, metrics-driven accomplishments',
            },
          ],
          assignments: [
            {
              id: 'assign-001',
              title: 'Draft Initial Resume',
              dueDate: '2025-02-10',
              status: 'completed',
              feedback: 'Excellent work on translating military experience to civilian language!',
            },
            {
              id: 'assign-002',
              title: 'Final Resume Review & Polish',
              dueDate: '2025-02-28',
              status: 'completed',
              feedback: 'Your resume is now ready for applications.',
            },
          ],
        },
        {
          id: 'mod-002',
          name: 'Interview Preparation & Practice',
          description: 'Build confidence and skills through comprehensive interview training and mock interviews.',
          category: 'interview_prep',
          status: 'in_progress',
          progress: 65,
          sessions: [
            {
              id: 'sess-003',
              title: 'Common Interview Questions',
              date: '2025-03-07',
              duration: 60,
              status: 'completed',
              notes: 'Discussed behavioral questions, STAR method, military-to-civilian translation',
            },
            {
              id: 'sess-004',
              title: 'Mock Interview #1',
              date: '2025-03-21',
              duration: 45,
              status: 'completed',
              notes: 'Strong performance. Focus on specific examples.',
              feedback: 'Good eye contact and communication. Work on concise answers.',
            },
            {
              id: 'sess-005',
              title: 'Mock Interview #2 (Scheduled)',
              date: '2025-04-08',
              duration: 45,
              status: 'scheduled',
            },
          ],
          assignments: [
            {
              id: 'assign-003',
              title: 'Record Practice Interview Response',
              dueDate: '2025-03-30',
              status: 'in_progress',
              feedback: 'Submit recording before next session',
            },
            {
              id: 'assign-004',
              title: 'Research 3 Target Companies',
              dueDate: '2025-04-05',
              status: 'pending',
            },
          ],
        },
        {
          id: 'mod-003',
          name: 'Networking & Relationship Building',
          description: 'Develop effective networking strategies to build professional relationships and discover opportunities.',
          category: 'networking_strategy',
          status: 'in_progress',
          progress: 35,
          sessions: [
            {
              id: 'sess-006',
              title: 'Networking Fundamentals',
              date: '2025-03-14',
              duration: 60,
              status: 'completed',
              notes: 'LinkedIn optimization, informational interviews, industry events',
            },
          ],
          assignments: [
            {
              id: 'assign-005',
              title: 'LinkedIn Profile Enhancement',
              dueDate: '2025-03-21',
              status: 'completed',
              feedback: 'Great improvements! Your profile now highlights leadership experience.',
            },
            {
              id: 'assign-006',
              title: 'Schedule 3 Informational Interviews',
              dueDate: '2025-04-15',
              status: 'in_progress',
            },
            {
              id: 'assign-007',
              title: 'Attend Industry Networking Event',
              dueDate: '2025-04-30',
              status: 'pending',
            },
          ],
        },
        {
          id: 'mod-004',
          name: 'Career Planning & Goal Setting',
          description: 'Create a strategic 5-year career plan aligned with your strengths and market opportunities.',
          category: 'career_planning',
          status: 'not_started',
          progress: 0,
          sessions: [],
          assignments: [
            {
              id: 'assign-008',
              title: 'Skills Assessment & Gap Analysis',
              dueDate: '2025-04-20',
              status: 'pending',
            },
            {
              id: 'assign-009',
              title: 'Create 5-Year Career Roadmap',
              dueDate: '2025-05-10',
              status: 'pending',
            },
          ],
        },
        {
          id: 'mod-005',
          name: 'Salary Negotiation & Benefits',
          description: 'Learn how to negotiate compensation packages and evaluate job offers effectively.',
          category: 'salary_negotiation',
          status: 'not_started',
          progress: 0,
          sessions: [],
          assignments: [
            {
              id: 'assign-010',
              title: 'Research Market Salary Ranges',
              dueDate: '2025-05-15',
              status: 'pending',
            },
          ],
        },
      ],
    };

    return NextResponse.json(curriculumData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { moduleId, assignmentId, status, progress } = await req.json();

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      );
    }

    // Mock update - in production, this would update a database
    const updateData = {
      success: true,
      message: `Updated module ${moduleId}`,
      status: status || 'in_progress',
      progress: progress || 50,
    };

    return NextResponse.json(updateData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
