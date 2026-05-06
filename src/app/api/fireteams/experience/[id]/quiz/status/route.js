import { NextResponse } from 'next/server';

// Mock quiz results storage (replace with database in production)
const quizResultsStore = new Map();

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const resultKey = `${id}-${userId}`;
    const result = quizResultsStore.get(resultKey);

    if (!result) {
      return NextResponse.json({
        hasPassed: false,
        score: null,
        completedAt: null
      });
    }

    return NextResponse.json({
      hasPassed: result.passed,
      score: result.score,
      completedAt: result.completedAt
    });
  } catch (error) {
    console.error('Error checking quiz status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
