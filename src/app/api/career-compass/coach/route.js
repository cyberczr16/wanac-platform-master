import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Mock data for coach profile
    const coachData = {
      coach: {
        id: 'coach-001',
        name: 'Sarah Mitchell',
        title: 'Senior Career Coach - PLCA',
        photo: null, // Use initials avatar
        email: 'sarah.mitchell@promiseland.org',
        phone: '(555) 123-4567',
        specialties: ['Resume Optimization', 'Interview Prep', 'Networking Strategy', 'Career Planning'],
        availability: {
          monday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
          tuesday: ['10:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
          wednesday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
          thursday: ['10:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
          friday: ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM'],
        },
        bio: 'Sarah is a certified career coach with 10+ years of experience helping veterans transition into civilian careers. She specializes in PLCA curriculum delivery and personalized career strategies.',
      },
      relationship: {
        startDate: '2024-11-15',
        totalSessions: 8,
        upcomingSessions: 2,
        nextSession: {
          date: '2025-04-08',
          time: '10:00 AM',
          type: 'mock_interview',
        },
        status: 'active', // active, completed, paused
      },
    };

    return NextResponse.json(coachData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
