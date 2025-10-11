import React from 'react';

export default function MeetingSummaryModal({ summaries, onClose, userRole = 'participant' }) {
  if (!summaries) return null;

  const renderParticipantSummary = () => {
    const summary = summaries.participantSummary;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Your Meeting Summary</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            summary.engagementLevel === 'high' ? 'bg-green-100 text-green-800' :
            summary.engagementLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {summary.engagementLevel.toUpperCase()} Engagement
          </span>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Overall Summary</h4>
          <p className="text-gray-700">{summary.overallSummary}</p>
        </div>

        {summary.keyContributions && summary.keyContributions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Your Key Contributions</h4>
            <ul className="list-disc list-inside space-y-1">
              {summary.keyContributions.map((contribution, idx) => (
                <li key={idx} className="text-gray-700">{contribution}</li>
              ))}
            </ul>
          </div>
        )}

        {summary.actionItems && summary.actionItems.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Your Action Items</h4>
            <ul className="space-y-2">
              {summary.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-2" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {summary.speakingTime && (
            <div>
              <p className="text-sm text-gray-600">Speaking Time</p>
              <p className="font-semibold">{summary.speakingTime}</p>
            </div>
          )}
          {summary.questionsAsked !== undefined && (
            <div>
              <p className="text-sm text-gray-600">Questions Asked</p>
              <p className="font-semibold">{summary.questionsAsked}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCoachSummary = () => {
    const summary = summaries.coachSummary;
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Coach Summary</h3>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Overall Engagement</h4>
          <p className="text-gray-700">{summary.overallEngagement}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Participant Insights</h4>
          <div className="space-y-3">
            {summary.participantInsights.map((participant, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{participant.userName}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    participant.engagementLevel === 'high' ? 'bg-green-100 text-green-800' :
                    participant.engagementLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {participant.engagementLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{participant.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Key Takeaways</h4>
          <ul className="list-disc list-inside space-y-1">
            {summary.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="text-gray-700">{takeaway}</li>
            ))}
          </ul>
        </div>

        {summary.areasOfConcern && summary.areasOfConcern.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-orange-700">Areas of Concern</h4>
            <ul className="list-disc list-inside space-y-1">
              {summary.areasOfConcern.map((concern, idx) => (
                <li key={idx} className="text-gray-700">{concern}</li>
              ))}
            </ul>
          </div>
        )}

        {summary.recommendations && summary.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {summary.recommendations.map((rec, idx) => (
                <li key={idx} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderAdminSummary = () => {
    const summary = summaries.adminSummary;
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Admin Summary</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Participants</p>
            <p className="text-2xl font-bold">{summary.sessionMetrics.totalParticipants}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Average Engagement</p>
            <p className="text-2xl font-bold">{summary.sessionMetrics.averageEngagement}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold">{summary.sessionMetrics.completionRate}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Technical Issues</p>
            <p className="text-2xl font-bold">{summary.sessionMetrics.technicalIssues.length}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Facilitator Performance</h4>
          <p className="text-gray-700">{summary.facilitatorPerformance}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Content Effectiveness</h4>
          <p className="text-gray-700">{summary.contentEffectiveness}</p>
        </div>

        {summary.systemRecommendations && summary.systemRecommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">System Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {summary.systemRecommendations.map((rec, idx) => (
                <li key={idx} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {summary.nextSteps && summary.nextSteps.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <ul className="list-disc list-inside space-y-1">
              {summary.nextSteps.map((step, idx) => (
                <li key={idx} className="text-gray-700">{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Meeting Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {userRole === 'participant' && renderParticipantSummary()}
          {userRole === 'coach' && renderCoachSummary()}
          {userRole === 'admin' && renderAdminSummary()}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Download summary as PDF or text
              const summaryText = JSON.stringify(summaries, null, 2);
              const blob = new Blob([summaryText], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `meeting-summary-${new Date().toISOString()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download Summary
          </button>
        </div>
      </div>
    </div>
  );
}
