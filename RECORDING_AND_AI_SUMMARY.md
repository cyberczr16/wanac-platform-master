# Meeting Recording and AI Summarization System

## Overview

This system enables automatic recording, transcription, and AI-powered summarization of Fireteam learning experiences. It uses OpenAI's Whisper for transcription and GPT-4 for generating role-specific summaries.

## Features

### 1. **Meeting Recording**
- Dual recording approach:
  - Jitsi built-in recording (primary)
  - Local browser MediaRecorder (backup)
- Automatic recording metadata tracking
- Participant attendance logging

### 2. **AI Transcription**
- Uses OpenAI Whisper API
- Supports multiple languages
- High accuracy transcription

### 3. **Role-Based Summaries**
The system generates three different summaries tailored to different user roles:

#### **Participant Summary**
- Personalized engagement assessment (high/medium/low)
- Key contributions made during the meeting
- Personal action items
- Speaking time statistics
- Number of questions asked
- Overall summary of their participation

#### **Coach/Facilitator Summary**
- Overall team engagement assessment
- Individual participant insights with engagement levels
- Whether session objectives were met
- Areas of concern requiring attention
- Recommendations for future sessions
- Key takeaways from the session

#### **Admin Summary**
- High-level session metrics:
  - Total participants
  - Average engagement rate
  - Completion rate
  - Technical issues
- Facilitator performance assessment
- Content effectiveness evaluation
- System-level recommendations
- Strategic next steps

## Architecture

### Services

1. **`openai.service.ts`** - OpenAI integration
   - `transcribeAudio()` - Transcribe audio using Whisper
   - `generateMeetingSummaries()` - Generate all three summaries
   - `generateParticipantSummary()` - Participant-specific analysis
   - `generateCoachSummary()` - Coach-specific analysis
   - `generateAdminSummary()` - Admin-specific analysis
   - `generateQuickSummary()` - Fast, cheaper summary

2. **`recording.service.ts`** - Recording management
   - `startRecording()` - Initialize recording metadata
   - `endRecording()` - Finalize recording
   - `uploadRecording()` - Upload audio file
   - `processRecording()` - Transcribe and generate summaries
   - `getRecording()` - Fetch recording details
   - `getExperienceRecordings()` - Get all recordings for an experience
   - `getFireteamRecordings()` - Get all recordings for a fireteam
   - `getUserSummary()` - Get participant summary
   - `getCoachSummary()` - Get coach summary
   - `getAdminSummary()` - Get admin summary

### API Routes

**`/api/recordings/process`** - Server-side endpoint for processing recordings
- Accepts: audio file, meeting data, recording ID
- Returns: transcript and summaries

### Components

1. **`MeetingSummaryModal.jsx`** - Display summaries
   - Renders different views based on user role
   - Download summary functionality
   - Beautiful, responsive UI

2. **Updated Experience Page** - Main meeting interface
   - Enhanced recording controls
   - Automatic prompt for AI summary on leave
   - Processing status indicators

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### Recording Management
```
POST   /api/v1/recordings/start              - Start recording
PUT    /api/v1/recordings/:id/end            - End recording
POST   /api/v1/recordings/:id/upload         - Upload recording file
PUT    /api/v1/recordings/:id/complete       - Save transcript & summaries
PUT    /api/v1/recordings/:id/status         - Update status
GET    /api/v1/recordings/:id                - Get recording details
GET    /api/v1/recordings/experience/:id     - Get experience recordings
GET    /api/v1/recordings/fireteam/:id       - Get fireteam recordings
DELETE /api/v1/recordings/:id                - Delete recording
```

### Summary Retrieval
```
GET    /api/v1/recordings/:id/summary/user/:userId  - Get user summary
GET    /api/v1/recordings/:id/summary/coach         - Get coach summary
GET    /api/v1/recordings/:id/summary/admin         - Get admin summary
```

### Database Schema (Suggested)

```sql
CREATE TABLE recordings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  experience_id INT NOT NULL,
  fireteam_id INT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  duration VARCHAR(50),
  recording_url TEXT,
  transcript_url TEXT,
  transcript LONGTEXT,
  status ENUM('recording', 'processing', 'completed', 'failed'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (experience_id) REFERENCES experiences(id),
  FOREIGN KEY (fireteam_id) REFERENCES fireteams(id)
);

CREATE TABLE recording_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recording_id INT NOT NULL,
  participant_id VARCHAR(255) NOT NULL,
  participant_name VARCHAR(255) NOT NULL,
  joined_at DATETIME NOT NULL,
  left_at DATETIME,
  FOREIGN KEY (recording_id) REFERENCES recordings(id)
);

CREATE TABLE recording_summaries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recording_id INT NOT NULL,
  summary_type ENUM('participant', 'coach', 'admin') NOT NULL,
  user_id VARCHAR(255),  -- NULL for coach/admin summaries
  summary_data JSON NOT NULL,  -- Store entire summary as JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recording_id) REFERENCES recordings(id)
);
```

## Setup Instructions

### 1. Install Dependencies
The required packages are already in package.json:
- axios (for API calls)
- react, next.js (framework)

### 2. Configure Environment Variables

Create or update `.env.local`:
```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Important:** Get your OpenAI API key from https://platform.openai.com/api-keys

### 3. Verify File Structure

Ensure these files exist:
```
src/
├── services/
│   └── api/
│       ├── openai.service.ts         ✅ Created
│       ├── recording.service.ts      ✅ Created
│       └── ...
├── app/
│   ├── api/
│   │   └── recordings/
│   │       └── process/
│   │           └── route.ts          ✅ Created
│   └── client/
│       └── fireteam/
│           ├── components/
│           │   └── MeetingSummaryModal.jsx  ✅ Created
│           └── experience/
│               └── [experienceid]/
│                   └── page.jsx       ✅ Updated
```

## Usage Flow

### For Participants:

1. **Join Meeting** - Enter the Fireteam experience
2. **Start Recording** - Click the record button (red dot)
3. **Participate** - Engage in the discussion
4. **Stop Recording** - Click record button again to stop
5. **Leave Meeting** - When leaving, you'll be prompted:
   - "Would you like to generate an AI summary?"
6. **View Summary** - See your personalized summary with:
   - Engagement level
   - Your contributions
   - Action items
   - Speaking time
7. **Download** - Save summary for your records

### For Coaches:

Same flow, but the summary includes:
- Team dynamics analysis
- Individual participant insights
- Session objectives assessment
- Recommendations for improvement

### For Admins:

Same flow, but the summary includes:
- High-level metrics
- Facilitator performance
- System recommendations
- Strategic insights

## Cost Considerations

### OpenAI API Costs (as of 2024):

**Whisper (Transcription):**
- $0.006 per minute of audio
- Example: 60-minute meeting = $0.36

**GPT-4o (Summarization):**
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens
- Estimated per meeting: $0.20 - $0.50

**Total per 60-minute meeting: ~$0.60 - $0.90**

### Cost Optimization Tips:

1. Use `gpt-4o-mini` for faster, cheaper summaries (10x cheaper)
2. Limit transcript length if needed
3. Generate summaries only on request
4. Cache summaries in database

## Testing

### Manual Testing:

1. Start a meeting
2. Enable recording
3. Speak for a few minutes
4. Stop recording
5. Leave meeting
6. Accept the AI summary prompt
7. Verify summary displays correctly

### Test with Sample Audio:

```javascript
// In browser console during meeting
const testBlob = new Blob(['test audio data'], { type: 'audio/webm' });
setRecordingBlob(testBlob);
await handleProcessRecording();
```

## Troubleshooting

### Common Issues:

1. **"OpenAI API key not found"**
   - Ensure `.env.local` exists
   - Verify `NEXT_PUBLIC_OPENAI_API_KEY` is set
   - Restart development server

2. **Recording not capturing audio**
   - Check browser permissions
   - Ensure microphone access granted
   - Try different browser (Chrome recommended)

3. **AI processing fails**
   - Check OpenAI API key validity
   - Verify audio file size (< 25MB for Whisper)
   - Check network connectivity

4. **Backend 404 errors**
   - Implement required API endpoints
   - Check backend URL configuration
   - Verify authentication headers

### Debug Mode:

Enable detailed logging:
```javascript
// In experience page, set:
const DEBUG_RECORDING = true;
```

## Future Enhancements

1. **Real-time Transcription** - Live transcription during meeting
2. **Speaker Diarization** - Identify who said what
3. **Sentiment Analysis** - Analyze emotional tone
4. **Action Item Extraction** - Automatic task creation
5. **Meeting Analytics Dashboard** - Trends over time
6. **Integration with Calendar** - Auto-schedule follow-ups
7. **Multi-language Support** - Translate summaries
8. **Video Recording** - Not just audio
9. **Searchable Transcript Archive** - Find past discussions
10. **AI Meeting Coach** - Real-time suggestions during meeting

## Security Considerations

1. **Data Privacy**
   - Audio recordings contain sensitive information
   - Store securely with encryption
   - Implement access controls
   - GDPR compliance for EU users

2. **API Key Security**
   - Never expose OpenAI API key in client code
   - Use server-side processing route
   - Rotate keys regularly

3. **User Consent**
   - Get explicit consent before recording
   - Display recording indicator clearly
   - Allow opt-out option

## Support

For issues or questions:
1. Check console logs for errors
2. Review this documentation
3. Contact development team
4. Submit issue to repository

## Credits

Built with:
- OpenAI Whisper & GPT-4
- Next.js & React
- Jitsi Meet
- TypeScript
