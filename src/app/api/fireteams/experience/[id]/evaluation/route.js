import { NextResponse } from 'next/server';
import { evaluationService } from '../../../../../services/evaluation/evaluationService';
import { transcriptService } from '../../../../../services/transcript/transcriptService';

// Mock evaluation storage (replace with database in production)
const evaluationStore = new Map();
const rubricStore = new Map();

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const recordingId = searchParams.get('recordingId');
  
  try {
    // Try to get results from the new evaluation service first
    try {
      const results = await evaluationService.getEvaluationResults(id);
      
      if (results) {
        // Filter for specific user if requested
        if (userId) {
          const filteredResults = {
            ...results,
            individualEvaluations: results.individualEvaluations.filter(
              evaluation => evaluation.participantId === userId
            )
          };
          return NextResponse.json(filteredResults);
        }
        
        return NextResponse.json(results);
      }
    } catch (evalError) {
      console.log('Evaluation service not ready, falling back to mock data');
    }

    // Fallback to mock data if no evaluation exists
    const mockEvaluation = {
      experienceId: id,
      recordingId: recordingId || 'mock-recording-id',
      individualEvaluations: [
        {
          participantId: userId || 'mock-user',
          participantName: 'Mock User',
          evaluations: [
            {
              rubricId: 'demand-validation',
              rubricTitle: 'Demand Validation',
              rubricDescription: 'Understand various demand validation techniques',
              bloomLevel: {
                level: 'Analyzing',
                score: 4,
                color: '#FFCA00'
              },
              contributions: [
                'Student discussed customer surveys as a means to confirm market needs',
                'Student recognized limitations like potential bias and inaccuracy'
              ],
              summary: "Student achieved an Analyze level on Bloom's Taxonomy.",
              explanation: "Good critical thinking and analysis demonstrated."
            }
          ]
        }
      ],
      sessionInfo: {
        experienceTitle: 'Fireteam Experience',
        duration: '45:00',
        totalParticipants: 4,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      }
    };

    return NextResponse.json(mockEvaluation);
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  
  try {
    const body = await request.json();
    const { 
      recordingId, 
      userId, 
      triggerType = 'manual', // 'manual' | 'auto-slide-11'
      participants = [], // List of participants for automatic evaluation
      transcriptData 
    } = body;

    console.log(`🚀 Starting evaluation for experience ${id}, trigger: ${triggerType}`);

    if (triggerType === 'auto-slide-11' && participants.length > 0) {
      // Automatic evaluation triggered when reaching slideType 11
      console.log(`🤖 Triggering automatic evaluation for ${participants.length} participants`);
      
      try {
        // Initialize transcript service session
        transcriptService.initializeSession(id, participants);
        
        // Start automatic evaluation pipeline
        const evaluationPromise = evaluationService.triggerAutomaticEvaluation(
          id, 
          recordingId, 
          participants
        );
        
        // Don't await - let it run in background
        evaluationPromise.catch(error => {
          console.error('Automatic evaluation failed:', error);
        });
        
        return NextResponse.json({
          success: true,
          evaluationId: id,
          status: 'processing',
          triggerType,
          message: 'Automatic evaluation started. Results will be available shortly.',
          participants: participants.length
        });
        
      } catch (error) {
        console.error('Failed to start automatic evaluation:', error);
        return NextResponse.json(
          { error: 'Failed to start automatic evaluation', details: error.message },
          { status: 500 }
        );
      }
    } else {
      // Manual evaluation (legacy support)
      const evaluationId = await evaluationService.initializeEvaluation(id, recordingId);
      
      return NextResponse.json({
        success: true,
        evaluationId,
        status: 'initializing',
        triggerType,
        message: 'Evaluation initialized. Use status endpoint to track progress.'
      });
    }

  } catch (error) {
    console.error('Error triggering evaluation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
