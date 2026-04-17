import { useState, useRef } from 'react';
import { groqService } from '../../../../../services/api/groq.service';
import { meetingService } from '../../../../../services/api/meeting.service';

/** Prefer server-assigned id from POST /api/v1/fireteams/recordings/add response. */
function extractServerRecordingId(uploaded) {
  if (uploaded == null || typeof uploaded !== 'object') return null;
  return (
    uploaded.id ??
    uploaded.recording_id ??
    uploaded.recordingId ??
    uploaded.data?.id ??
    null
  );
}

/**
 * Custom hook to manage meeting recording and AI processing.
 * Provider-agnostic: expects a meetingRef with .current and a boolean ready flag.
 */
export function useRecording(meetingRef, meetingReady) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [processingRecording, setProcessingRecording] = useState(false);
  const [meetingSummaries, setMeetingSummaries] = useState(null);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingBlobRef = useRef(null);

  /**
   * Toggle recording on/off
   */
  const toggleRecording = async () => {
    if (!meetingRef?.current || !meetingReady) {
      console.warn('⚠️ Meeting not ready for recording');
      throw new Error('The meeting is not ready. Please wait a moment and try again.');
    }

    try {
      if (isRecording) {
        // STOP RECORDING
        console.log('🛑 Stopping recording...');

        // Stop local media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          console.log('✅ Local recorder stopped');
        }

        setIsRecording(false);
        console.log('✅ Recording stopped successfully');
      } else {
        // START RECORDING (local MediaRecorder only)
        console.log('🔴 Starting recording...');

        // Start local media recorder
        try {
          // Get display media (screen + audio) for better quality
          let stream;
          try {
            // Try to get screen + audio
            stream = await navigator.mediaDevices.getDisplayMedia({ 
              audio: true,
              video: true 
            });
            console.log('✅ Screen capture with audio enabled');
          } catch (err) {
            // Fallback to just microphone audio
            console.log('⚠️ Screen capture unavailable, using microphone only');
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          }
          
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
              ? 'video/webm;codecs=vp9'
              : 'video/webm'
          });
          mediaRecorderRef.current = mediaRecorder;
          recordedChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
              console.log('📦 Recording chunk saved:', event.data.size, 'bytes');
            }
          };

          mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunksRef.current, {
              type: stream.getVideoTracks().length > 0 ? 'video/webm' : 'audio/webm'
            });
            recordingBlobRef.current = blob;
            setRecordingBlob(blob);
            console.log('✅ Recording saved locally, size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');

            // Stop all tracks
            stream.getTracks().forEach((track) => {
              track.stop();
              console.log('🛑 Track stopped:', track.kind);
            });
          };

          mediaRecorder.start(1000); // Collect data every second
          console.log('✅ Local media recorder started');
        } catch (err) {
          console.error('❌ Failed to start local recorder:', err);
          throw new Error('Could not access microphone/screen. Please grant permissions.');
        }

        setIsRecording(true);

        // Generate a temporary recording ID
        const tempRecordingId = `rec_${Date.now()}`;
        setCurrentRecordingId(tempRecordingId);
        console.log('✅ Recording started with ID:', tempRecordingId);
      }
    } catch (err) {
      console.error('❌ Failed to toggle recording:', err);
      throw new Error('Failed to toggle recording: ' + err.message);
    }
  };

  /**
   * Process recording with AI transcription and summaries
   */
  /**
   * Process recording with AI transcription and summaries.
   * @param {object}   meetingData   - Experience / agenda / participant context
   * @param {object}   searchParams  - URL search params (id, fireteamId)
   * @param {function} [onProgress]  - Optional callback: onProgress(stage) where
   *                                   stage is 'transcribing' | 'summarizing' | 'uploading' | 'done'
   */
  const processRecording = async (meetingData, searchParams, onProgress) => {
    // Use the ref as fallback so async callers that captured a stale
    // closure still get the blob that was saved by mediaRecorder.onstop.
    const blob = recordingBlob || recordingBlobRef.current;
    if (!blob || !currentRecordingId) {
      throw new Error('No recording available to process');
    }

    setProcessingRecording(true);
    const notify = typeof onProgress === 'function' ? onProgress : () => {};

    try {
      const userId = localStorage.getItem('user_id') || 'unknown';
      const userName = localStorage.getItem('user_name') || 'Participant';
      const expId = searchParams?.get('id');
      const ftId = searchParams?.get('fireteamId');

      console.log('🎙️ Starting transcription (Groq Whisper via /api/groq/transcribe)...');
      notify('transcribing');

      // Step 1: Transcribe audio — Groq Whisper (server-side route)
      const transcriptionResult = await groqService.transcribeAudio(blob);
      const transcript = transcriptionResult.text || '';

      console.log('✅ Transcription complete, length:', transcript.length);
      console.log('🤖 Generating AI summaries (Groq via /api/groq/summarize)...');
      notify('summarizing');

      // Step 2: Participant + coach + admin summaries (single full request)
      const summaries = await groqService.generateMeetingSummaries(transcript, meetingData);

      console.log('✅ AI summaries generated');
      console.log('📤 Uploading to backend...');
      notify('uploading');

      // Step 3: Upload recording with metadata
      const metadata = {
        transcript: transcript,
        summaries: summaries,
        participants: meetingData.attendanceLog || [],
        start_time: meetingData.startTime || new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration: meetingData.duration || '0 mins',
        user_id: userId,
        user_name: userName,
        attendance_log: meetingData.attendanceLog || [],
      };

      const uploaded = await meetingService.uploadRecording(
        Number(ftId),
        Number(expId),
        blob,
        metadata
      );

      console.log('✅ Recording uploaded successfully');
      notify('done');

      const serverRecordingId = extractServerRecordingId(uploaded);
      const recordingIdForApp = serverRecordingId != null ? serverRecordingId : currentRecordingId;

      if (serverRecordingId == null) {
        console.warn(
          'Upload response did not include recording id; evaluation may not load summaries from API. Response:',
          uploaded
        );
      }

      // Set summaries for modal display
      setMeetingSummaries(summaries);

      return {
        summaries,
        recordingId: recordingIdForApp,
      };
    } catch (error) {
      console.error('❌ Failed to process recording:', error);
      throw new Error(
        'Failed to process recording: ' + (error.response?.data?.message || error.message)
      );
    } finally {
      setProcessingRecording(false);
    }
  };

  return {
    isRecording,
    recordingBlob,
    recordingBlobRef,
    processingRecording,
    meetingSummaries,
    toggleRecording,
    processRecording,
    setMeetingSummaries,
  };
}

