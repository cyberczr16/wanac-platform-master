/**
 * AI Evaluation Service
 * 
 * Handles the AI-powered evaluation pipeline using Bloom's Taxonomy.
 * Integrates with the backend GroqEvaluationService and manages the evaluation workflow.
 */

import { transcriptService } from '../transcript/transcriptService';
import { fireteamService } from '../../services/api/fireteam.service';

class EvaluationService {
  constructor() {
    this.evaluations = new Map(); // experienceId -> evaluation data
    this.evaluationQueue = new Map(); // experienceId -> queue status
    this.rubrics = new Map(); // experienceId -> rubrics
  }

  /**
   * Initialize evaluation for an experience
   */
  async initializeEvaluation(experienceId, recordingId) {
    const evaluationId = `eval_${experienceId}_${recordingId}_${Date.now()}`;
    
    this.evaluations.set(experienceId, {
      evaluationId,
      experienceId,
      recordingId,
      status: 'initializing',
      createdAt: new Date().toISOString(),
      progress: {
        transcriptAssembly: 0,
        aiProcessing: 0,
        resultAssembly: 0
      }
    });

    return evaluationId;
  }

  /**
   * Load rubrics for an experience
   */
  async loadRubrics(experienceId) {
    // In a real implementation, this would fetch from the backend
    // For now, we'll use mock rubrics based on the blueprint
    const mockRubrics = [
      {
        id: 'demand-validation',
        title: 'Demand Validation',
        description: 'Understand various demand validation techniques to determine which methods are most appropriate for a specific business model and stage.',
        prompt: 'Evaluate the student\'s understanding of demand validation techniques based on their contributions to the discussion. Consider their ability to identify appropriate validation methods, analyze results, and make data-driven decisions.',
        weight: 1.0
      },
      {
        id: 'market-research',
        title: 'Market Research',
        description: 'Understand practical methods to perform market research and gather customer insights.',
        prompt: 'Assess the student\'s ability to apply market research concepts. Look for evidence of customer understanding, competitive analysis, and insight generation from their discussion contributions.',
        weight: 1.0
      },
      {
        id: 'customer-empathy',
        title: 'Customer Empathy',
        description: 'Demonstrate deep understanding of customer problems and pain points.',
        prompt: 'Evaluate the student\'s capacity for customer empathy. Consider how well they articulate customer problems, show understanding of user perspectives, and demonstrate customer-centric thinking.',
        weight: 0.8
      },
      {
        id: 'problem-solving',
        title: 'Problem Solving',
        description: 'Apply analytical thinking to solve complex business problems.',
        prompt: 'Assess the student\'s problem-solving abilities. Look for logical reasoning, creative solutions, and systematic approaches to addressing challenges discussed.',
        weight: 1.2
      }
    ];

    this.rubrics.set(experienceId, mockRubrics);
    return mockRubrics;
  }

  /**
   * Trigger automatic evaluation when session reaches slideType 11 (Processing)
   */
  async triggerAutomaticEvaluation(experienceId, recordingId, participants) {
    console.log(`🤖 Triggering automatic evaluation for experience ${experienceId}`);
    
    try {
      // Initialize evaluation
      const evaluationId = await this.initializeEvaluation(experienceId, recordingId);
      
      // Update status
      this.updateEvaluationStatus(experienceId, 'assembling_transcripts');
      
      // Step 1: Assemble transcripts for all participants
      const transcripts = await this.assembleAllTranscripts(experienceId, participants);
      this.updateProgress(experienceId, 'transcriptAssembly', 100);
      
      // Step 2: Load rubrics
      const rubrics = await this.loadRubrics(experienceId);
      
      // Step 3: Process evaluations for each participant
      this.updateEvaluationStatus(experienceId, 'ai_processing');
      const evaluations = await this.processAllEvaluations(experienceId, transcripts, rubrics);
      this.updateProgress(experienceId, 'aiProcessing', 100);
      
      // Step 4: Assemble final results
      this.updateEvaluationStatus(experienceId, 'assembling_results');
      const finalResults = await this.assembleFinalResults(experienceId, evaluations, participants);
      this.updateProgress(experienceId, 'resultAssembly', 100);
      
      // Step 5: Store results
      await this.storeEvaluationResults(experienceId, finalResults);
      
      this.updateEvaluationStatus(experienceId, 'completed');
      
      console.log(`✅ Evaluation completed for experience ${experienceId}`);
      return finalResults;
      
    } catch (error) {
      console.error(`❌ Evaluation failed for experience ${experienceId}:`, error);
      this.updateEvaluationStatus(experienceId, 'failed');
      throw error;
    }
  }

  /**
   * Assemble transcripts for all participants
   */
  async assembleAllTranscripts(experienceId, participants) {
    const transcripts = await transcriptService.getAllTranscripts(experienceId);
    
    // Format transcripts for each participant
    const formattedTranscripts = {};
    for (const participant of participants) {
      formattedTranscripts[participant.id] = transcriptService.formatTranscriptForEvaluation(
        transcripts.transcripts, 
        participant.id
      );
    }
    
    return formattedTranscripts;
  }

  /**
   * Process AI evaluations for all participants
   */
  async processAllEvaluations(experienceId, transcripts, rubrics) {
    const evaluations = {};
    
    for (const [userId, transcript] of Object.entries(transcripts)) {
      evaluations[userId] = await this.evaluateParticipant(
        experienceId, 
        userId, 
        transcript, 
        rubrics
      );
    }
    
    return evaluations;
  }

  /**
   * Evaluate a single participant using AI
   */
  async evaluateParticipant(experienceId, userId, transcript, rubrics) {
    const evaluations = [];
    
    for (const rubric of rubrics) {
      const evaluation = await this.evaluateAgainstRubric(
        experienceId,
        userId,
        transcript,
        rubric
      );
      evaluations.push(evaluation);
    }
    
    return {
      participantId: userId,
      evaluations,
      metadata: {
        totalWords: transcript.wordCount,
        duration: transcript.duration,
        averageConfidence: transcript.averageConfidence,
        evaluatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Evaluate transcript against a specific rubric
   */
  async evaluateAgainstRubric(experienceId, userId, transcript, rubric) {
    try {
      // In a real implementation, this would call the backend GroqEvaluationService
      // For now, we'll simulate the AI evaluation
      const mockEvaluation = await this.mockAIEvaluation(transcript, rubric);
      
      return {
        rubricId: rubric.id,
        rubricTitle: rubric.title,
        rubricDescription: rubric.description,
        bloomLevel: mockEvaluation.bloomLevel,
        contributions: mockEvaluation.contributions,
        summary: mockEvaluation.summary,
        explanation: mockEvaluation.explanation,
        confidence: mockEvaluation.confidence,
        evaluationModel: 'gpt-4o-mini', // From blueprint
        evaluatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`Error evaluating ${userId} against rubric ${rubric.id}:`, error);
      
      // Return fallback evaluation
      return {
        rubricId: rubric.id,
        rubricTitle: rubric.title,
        rubricDescription: rubric.description,
        bloomLevel: {
          level: 'Did Not Discuss',
          score: 0,
          color: '#efefef'
        },
        contributions: [],
        summary: 'Unable to evaluate due to processing error.',
        explanation: 'An error occurred during AI evaluation.',
        confidence: 0,
        evaluationModel: 'fallback',
        evaluatedAt: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Mock AI evaluation (replace with real backend call)
   */
  async mockAIEvaluation(transcript, rubric) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate mock evaluation based on transcript length and rubric
    const wordCount = transcript.wordCount;
    let score, level, confidence;
    
    if (wordCount < 10) {
      score = 0;
      level = 'Did Not Discuss';
      confidence = 0.9;
    } else if (wordCount < 30) {
      score = Math.floor(Math.random() * 2) + 1; // 1-2
      level = score === 1 ? 'Remembering' : 'Understanding';
      confidence = 0.8 + Math.random() * 0.2;
    } else if (wordCount < 60) {
      score = Math.floor(Math.random() * 2) + 3; // 3-4
      level = score === 3 ? 'Applying' : 'Analyzing';
      confidence = 0.85 + Math.random() * 0.15;
    } else {
      score = Math.floor(Math.random() * 2) + 5; // 5-6
      level = score === 5 ? 'Evaluating' : 'Creating';
      confidence = 0.9 + Math.random() * 0.1;
    }
    
    const bloomColors = {
      0: '#efefef', 1: '#AEF4FF', 2: '#3BB5C8', 3: '#BC9906', 
      4: '#FFCA00', 5: '#D15924', 6: '#282828'
    };
    
    const contributions = this.generateMockContributions(transcript, rubric);
    const summary = this.generateMockSummary(level, rubric);
    const explanation = this.generateMockExplanation(level, score);
    
    return {
      bloomLevel: {
        level,
        score,
        color: bloomColors[score]
      },
      contributions,
      summary,
      explanation,
      confidence
    };
  }

  /**
   * Generate mock contributions based on transcript
   */
  generateMockContributions(transcript, rubric) {
    const contributions = [];
    const segments = transcript.segments.slice(0, 3); // Take first 3 segments
    
    segments.forEach((segment, index) => {
      contributions.push(
        `Participant ${index + 1}: ${segment.text.substring(0, 100)}...`
      );
    });
    
    return contributions.length > 0 ? contributions : ['No significant contributions detected.'];
  }

  /**
   * Generate mock summary
   */
  generateMockSummary(level, rubric) {
    const summaries = {
      'Did Not Discuss': `Student did not demonstrate engagement in ${rubric.title.toLowerCase()}.`,
      'Remembering': `Student showed basic recall of ${rubric.title.toLowerCase()} concepts.`,
      'Understanding': `Student demonstrated comprehension of ${rubric.title.toLowerCase()} principles.`,
      'Applying': `Student successfully applied ${rubric.title.toLowerCase()} concepts to practical scenarios.`,
      'Analyzing': `Student effectively analyzed ${rubric.title.toLowerCase()} issues and broke down complex problems.`,
      'Evaluating': `Student critically evaluated ${rubric.title.toLowerCase()} approaches and made informed judgments.`,
      'Creating': `Student created innovative solutions related to ${rubric.title.toLowerCase()}.`
    };
    
    return summaries[level] || `Student engaged with ${rubric.title.toLowerCase()} at the ${level.toLowerCase()} level.`;
  }

  /**
   * Generate mock explanation
   */
  generateMockExplanation(level, score) {
    const explanations = {
      0: 'No participation detected in this area.',
      1: 'Basic recall demonstrated with minimal detail.',
      2: 'Good understanding shown with relevant examples.',
      3: 'Effective application of concepts to practical situations.',
      4: 'Strong analytical thinking with insightful observations.',
      5: 'Excellent critical evaluation with well-reasoned arguments.',
      6: 'Outstanding creative thinking with innovative solutions.'
    };
    
    return explanations[score] || `Performance evaluated at level ${score}.`;
  }

  /**
   * Assemble final evaluation results
   */
  async assembleFinalResults(experienceId, evaluations, participants) {
    const sessionInfo = {
      experienceId,
      totalParticipants: participants.length,
      evaluatedAt: new Date().toISOString(),
      evaluationModel: 'gpt-4o-mini',
      rubricsCount: this.rubrics.get(experienceId)?.length || 0
    };

    // Calculate group balance score
    const groupBalanceScore = this.calculateGroupBalance(evaluations);
    
    // Create conversation map
    const conversationMap = this.createConversationMap(evaluations);

    return {
      experienceId,
      sessionInfo,
      groupBalanceScore,
      conversationMap,
      individualEvaluations: Object.values(evaluations),
      metadata: {
        totalEvaluations: Object.keys(evaluations).length,
        averageBloomScore: this.calculateAverageBloomScore(evaluations),
        evaluationDuration: Date.now() - new Date(this.evaluations.get(experienceId).createdAt).getTime()
      }
    };
  }

  /**
   * Calculate group balance score
   */
  calculateGroupBalance(evaluations) {
    const participants = [];
    let totalWords = 0;
    
    for (const [userId, evaluation] of Object.entries(evaluations)) {
      const wordCount = evaluation.metadata.totalWords;
      totalWords += wordCount;
      
      participants.push({
        id: userId,
        name: `Participant ${userId}`,
        talkTimeMinutes: Math.round(wordCount / 150), // Assuming 150 words per minute
        engagementLevel: this.getEngagementLevel(wordCount, totalWords, Object.keys(evaluations).length)
      });
    }
    
    const averageTalkTime = totalWords / participants.length / 150;
    const isBalanced = this.checkBalance(participants.map(p => p.talkTimeMinutes));
    
    return {
      participants,
      averageTalkTime,
      isBalanced,
      message: isBalanced 
        ? 'Your group had a balanced discussion with good participation from all members.'
        : 'Your discussion was unbalanced. Consider encouraging more participation from quieter members.'
    };
  }

  /**
   * Get engagement level based on word count
   */
  getEngagementLevel(wordCount, totalWords, participantCount) {
    const averageWords = totalWords / participantCount;
    const ratio = wordCount / averageWords;
    
    if (ratio < 0.5) return 'low';
    if (ratio < 1.5) return 'medium';
    return 'high';
  }

  /**
   * Check if participation is balanced
   */
  checkBalance(talkTimes) {
    if (talkTimes.length < 2) return true;
    
    const average = talkTimes.reduce((sum, time) => sum + time, 0) / talkTimes.length;
    const maxDeviation = Math.max(...talkTimes.map(time => Math.abs(time - average)));
    
    return maxDeviation / average < 0.5; // Allow 50% deviation
  }

  /**
   * Create conversation map
   */
  createConversationMap(evaluations) {
    const bubbles = [];
    let timeline = { startTime: '', endTime: '', duration: 0 };
    
    // Create conversation bubbles from evaluation data
    for (const [userId, evaluation] of Object.entries(evaluations)) {
      // This would normally come from actual transcript data
      bubbles.push({
        id: `${userId}_1`,
        participantId: userId,
        timestamp: 300, // 5 minutes
        comment: 'Key contribution to the discussion',
        understandingDepth: 3,
        rubric: evaluation.evaluations[0]?.rubricTitle || 'General'
      });
    }
    
    return {
      bubbles,
      timeline: {
        startTime: '0:00',
        endTime: '45:00',
        duration: 2700 // 45 minutes in seconds
      }
    };
  }

  /**
   * Calculate average Bloom score
   */
  calculateAverageBloomScore(evaluations) {
    let totalScore = 0;
    let count = 0;
    
    for (const evaluation of Object.values(evaluations)) {
      for (const rubricEval of evaluation.evaluations) {
        totalScore += rubricEval.bloomLevel.score;
        count++;
      }
    }
    
    return count > 0 ? totalScore / count : 0;
  }

  /**
   * Store evaluation results
   */
  async storeEvaluationResults(experienceId, results) {
    // In a real implementation, this would store in the backend database
    // For now, we'll store in memory and update the evaluation record
    const evaluation = this.evaluations.get(experienceId);
    if (evaluation) {
      evaluation.results = results;
      evaluation.completedAt = new Date().toISOString();
    }
    
    return results;
  }

  /**
   * Get evaluation results
   */
  async getEvaluationResults(experienceId) {
    const evaluation = this.evaluations.get(experienceId);
    
    if (!evaluation) {
      throw new Error(`No evaluation found for experience ${experienceId}`);
    }
    
    return evaluation.results || null;
  }

  /**
   * Update evaluation status
   */
  updateEvaluationStatus(experienceId, status) {
    const evaluation = this.evaluations.get(experienceId);
    if (evaluation) {
      evaluation.status = status;
      evaluation.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Update progress
   */
  updateProgress(experienceId, stage, percentage) {
    const evaluation = this.evaluations.get(experienceId);
    if (evaluation) {
      evaluation.progress[stage] = percentage;
    }
  }

  /**
   * Get evaluation status
   */
  getEvaluationStatus(experienceId) {
    return this.evaluations.get(experienceId) || null;
  }
}

// Export singleton instance
export const evaluationService = new EvaluationService();
export default evaluationService;
