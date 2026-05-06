/**
 * Transcript Assembly Service
 * 
 * Handles the assembly and processing of meeting transcripts for AI evaluation.
 * This service collects audio chunks, processes them through speech-to-text,
 * and assembles participant-specific transcripts for evaluation.
 */

class TranscriptService {
  constructor() {
    this.transcripts = new Map(); // experienceId -> Map(userId -> transcript[])
    this.recordingSessions = new Map(); // experienceId -> session data
    this.audioChunks = new Map(); // experienceId -> Map(userId -> audio chunks)
  }

  /**
   * Initialize a new transcript session for an experience
   */
  initializeSession(experienceId, participants = []) {
    const sessionId = `session_${experienceId}_${Date.now()}`;
    
    this.transcripts.set(experienceId, new Map());
    this.audioChunks.set(experienceId, new Map());
    
    // Initialize transcript storage for each participant
    participants.forEach(participant => {
      this.transcripts.get(experienceId).set(participant.id, []);
      this.audioChunks.get(experienceId).set(participant.id, []);
    });

    this.recordingSessions.set(experienceId, {
      sessionId,
      startTime: new Date().toISOString(),
      participants: participants.map(p => ({ id: p.id, name: p.name })),
      status: 'initialized'
    });

    return sessionId;
  }

  /**
   * Add audio chunk for a participant
   */
  addAudioChunk(experienceId, userId, audioChunk, timestamp) {
    if (!this.audioChunks.has(experienceId)) {
      throw new Error(`No active session for experience ${experienceId}`);
    }

    const userChunks = this.audioChunks.get(experienceId).get(userId);
    if (!userChunks) {
      this.audioChunks.get(experienceId).set(userId, []);
    }

    userChunks.push({
      data: audioChunk,
      timestamp,
      index: userChunks.length
    });
  }

  /**
   * Process audio chunks into transcript segments
   * This would integrate with a speech-to-text service (OpenAI Whisper, Google Speech-to-Text, etc.)
   */
  async processAudioToText(experienceId, userId) {
    const chunks = this.audioChunks.get(experienceId)?.get(userId) || [];
    if (chunks.length === 0) return [];

    // In a real implementation, this would send audio chunks to a speech-to-text service
    // For now, we'll simulate transcript generation
    const transcriptSegments = [];
    
    for (let i = 0; i < chunks.length; i += 5) { // Process in groups of 5 chunks
      const chunkGroup = chunks.slice(i, i + 5);
      const startTime = chunkGroup[0].timestamp;
      const endTime = chunkGroup[chunkGroup.length - 1].timestamp;
      
      // Simulate speech-to-text processing
      const mockTranscript = await this.mockSpeechToText(chunkGroup);
      
      if (mockTranscript && mockTranscript.trim()) {
        transcriptSegments.push({
          text: mockTranscript,
          startTime,
          endTime,
          confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
          speaker: userId,
          chunkIndex: i
        });
      }
    }

    return transcriptSegments;
  }

  /**
   * Mock speech-to-text processing (replace with real service)
   */
  async mockSpeechToText(chunks) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate mock transcript based on chunk count
    const mockTranscripts = [
      "I think the key challenge here is understanding customer needs.",
      "We should validate our assumptions before building the product.",
      "The market research shows there's definitely demand for this solution.",
      "I agree with the approach, but we need to consider the timeline.",
      "What about the competitive landscape? How do we differentiate?",
      "The user interviews revealed some interesting pain points.",
      "I'm concerned about the technical feasibility of this feature.",
      "Let's focus on the MVP first and iterate based on feedback.",
      "The pricing strategy needs to align with the value proposition.",
      "We should prioritize features based on user impact and effort."
    ];
    
    return mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
  }

  /**
   * Assemble complete transcript for a participant
   */
  async assembleParticipantTranscript(experienceId, userId) {
    const segments = await this.processAudioToText(experienceId, userId);
    
    // Sort by timestamp
    segments.sort((a, b) => a.startTime - b.startTime);
    
    // Store in transcripts map
    const experienceTranscripts = this.transcripts.get(experienceId);
    if (experienceTranscripts) {
      experienceTranscripts.set(userId, segments);
    }

    return segments;
  }

  /**
   * Get assembled transcript for all participants
   */
  async getAllTranscripts(experienceId) {
    const session = this.recordingSessions.get(experienceId);
    if (!session) {
      throw new Error(`No session found for experience ${experienceId}`);
    }

    const allTranscripts = {};
    const participantIds = session.participants.map(p => p.id);

    // Process transcripts for all participants
    for (const userId of participantIds) {
      const transcript = await this.assembleParticipantTranscript(experienceId, userId);
      allTranscripts[userId] = transcript;
    }

    return {
      experienceId,
      sessionId: session.sessionId,
      transcripts: allTranscripts,
      metadata: {
        totalParticipants: participantIds.length,
        processedAt: new Date().toISOString(),
        sessionDuration: Date.now() - new Date(session.startTime).getTime()
      }
    };
  }

  /**
   * Format transcript for AI evaluation
   */
  formatTranscriptForEvaluation(transcripts, userId) {
    const userTranscript = transcripts[userId] || [];
    
    // Format as continuous text with timestamps
    const formattedText = userTranscript
      .map(segment => `[${this.formatTimestamp(segment.startTime)}] ${segment.text}`)
      .join('\n');

    return {
      userId,
      rawTranscript: formattedText,
      segments: userTranscript,
      wordCount: formattedText.split(' ').length,
      duration: userTranscript.length > 0 
        ? userTranscript[userTranscript.length - 1].endTime - userTranscript[0].startTime
        : 0,
      averageConfidence: userTranscript.reduce((sum, seg) => sum + seg.confidence, 0) / userTranscript.length || 0
    };
  }

  /**
   * Format timestamp for readability
   */
  formatTimestamp(timestamp) {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Clean up session data
   */
  cleanupSession(experienceId) {
    this.transcripts.delete(experienceId);
    this.audioChunks.delete(experienceId);
    this.recordingSessions.delete(experienceId);
  }

  /**
   * Get session status
   */
  getSessionStatus(experienceId) {
    const session = this.recordingSessions.get(experienceId);
    if (!session) return null;

    return {
      ...session,
      hasTranscripts: this.transcripts.has(experienceId),
      audioChunksCount: Array.from(this.audioChunks.get(experienceId)?.values() || [])
        .reduce((total, chunks) => total + chunks.length, 0)
    };
  }
}

// Export singleton instance
export const transcriptService = new TranscriptService();
export default transcriptService;
