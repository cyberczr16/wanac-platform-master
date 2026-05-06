import { NextResponse } from 'next/server';

// In-memory storage for development (replace with database in production)
const roomStateStore = new Map();

export async function GET(request, { params }) {
  const { experienceId } = params;
  
  try {
    const roomState = roomStateStore.get(experienceId);
    
    if (!roomState) {
      return NextResponse.json(
        { error: 'Room state not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(roomState);
  } catch (error) {
    console.error('Error fetching room state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { experienceId } = params;
  
  try {
    const body = await request.json();
    const {
      experience_id,
      active_slide = 0,
      group_leader_user_ids = [],
      user_ids = [],
      active_exhibit_id = null,
      started_at = null,
      ended_at = null,
    } = body;

    const roomState = {
      id: experienceId,
      experience_id: experience_id || experienceId,
      active_slide,
      group_leader_user_ids,
      user_ids,
      active_exhibit_id,
      started_at: started_at || new Date().toISOString(),
      ended_at,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    roomStateStore.set(experienceId, roomState);

    return NextResponse.json(roomState, { status: 201 });
  } catch (error) {
    console.error('Error creating room state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { experienceId } = params;
  
  try {
    const body = await request.json();
    const existingState = roomStateStore.get(experienceId);

    if (!existingState) {
      return NextResponse.json(
        { error: 'Room state not found' },
        { status: 404 }
      );
    }

    const updatedState = {
      ...existingState,
      ...body,
      updated_at: new Date().toISOString(),
    };

    roomStateStore.set(experienceId, updatedState);

    return NextResponse.json(updatedState);
  } catch (error) {
    console.error('Error updating room state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { experienceId } = params;
  
  try {
    roomStateStore.delete(experienceId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
