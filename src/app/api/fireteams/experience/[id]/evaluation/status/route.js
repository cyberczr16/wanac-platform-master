import { NextResponse } from 'next/server';
import { evaluationService } from '../../../../../../../services/evaluation/evaluationService';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const status = evaluationService.getEvaluationStatus(id);
    
    if (!status) {
      return NextResponse.json(
        { error: 'No evaluation found for this experience' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      experienceId: id,
      status: status.status,
      progress: status.progress,
      createdAt: status.createdAt,
      updatedAt: status.updatedAt,
      completedAt: status.completedAt,
      hasResults: !!status.results
    });

  } catch (error) {
    console.error('Error fetching evaluation status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
