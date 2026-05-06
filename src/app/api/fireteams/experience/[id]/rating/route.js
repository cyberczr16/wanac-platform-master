import { NextResponse } from 'next/server';

// Mock rating storage (replace with database in production)
const ratingStore = new Map();

export async function POST(request, { params }) {
  const { id } = params;
  
  try {
    const body = await request.json();
    const { stars, userId, feedback } = body;

    // Validate input
    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5 stars' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Store rating
    const ratingKey = `${id}-${userId}`;
    const rating = {
      experienceId: id,
      userId,
      stars,
      feedback: feedback || '',
      createdAt: new Date().toISOString()
    };

    ratingStore.set(ratingKey, rating);

    return NextResponse.json({
      success: true,
      rating,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Get all ratings for this experience
    const ratings = [];
    
    for (const [key, rating] of ratingStore.entries()) {
      if (rating.experienceId === id) {
        ratings.push(rating);
      }
    }

    // Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length 
      : 0;

    return NextResponse.json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
