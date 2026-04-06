import { NextResponse } from 'next/server';

// Mock storage for career goals (in a real app, this would be a database)
const careerGoalsStore = new Map();

export async function GET(req) {
  try {
    // In a real implementation, this would fetch from database using user ID from auth context
    const mockUserId = 'veteran-001';

    const goals = careerGoalsStore.get(mockUserId) || {
      userId: mockUserId,
      targetRoles: [],
      preferredIndustries: [],
      locationPreferences: [],
      timeline: null,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const mockUserId = 'veteran-001';
    const body = await req.json();

    const goals = {
      userId: mockUserId,
      targetRoles: body.targetRoles || [],
      preferredIndustries: body.preferredIndustries || [],
      locationPreferences: body.locationPreferences || [],
      timeline: body.timeline || null,
      notes: body.notes || '',
      createdAt: careerGoalsStore.has(mockUserId)
        ? careerGoalsStore.get(mockUserId).createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    careerGoalsStore.set(mockUserId, goals);

    return NextResponse.json(goals, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const mockUserId = 'veteran-001';
    const body = await req.json();

    if (!careerGoalsStore.has(mockUserId)) {
      return NextResponse.json(
        { error: 'Goals not found' },
        { status: 404 }
      );
    }

    const existingGoals = careerGoalsStore.get(mockUserId);
    const updatedGoals = {
      ...existingGoals,
      ...body,
      userId: mockUserId,
      createdAt: existingGoals.createdAt,
      updatedAt: new Date().toISOString(),
    };

    careerGoalsStore.set(mockUserId, updatedGoals);

    return NextResponse.json(updatedGoals, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
