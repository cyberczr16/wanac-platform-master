import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

/**
 * EvaluationProgress - Shows real-time progress of AI evaluation processing
 * 
 * @param {Object} props
 * @param {string} props.status - Current evaluation status
 * @param {Object} props.progress - Progress percentages for each stage
 * @param {string} props.message - Current status message
 * @param {boolean} props.showDetails - Whether to show detailed progress
 */
export default function EvaluationProgress({ 
  status = 'initializing', 
  progress = {}, 
  message = 'Initializing evaluation...', 
  showDetails = false 
}) {
  const stages = [
    { key: 'transcriptAssembly', label: 'Assembling Transcripts', icon: Clock },
    { key: 'aiProcessing', label: 'AI Analysis', icon: Loader2 },
    { key: 'resultAssembly', label: 'Generating Results', icon: CheckCircle }
  ];

  const getStatusColor = (stageStatus) => {
    if (stageStatus === 100) return 'text-green-600';
    if (stageStatus > 0) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-blue-500';
    return 'bg-gray-200';
  };

  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isProcessing = status === 'processing' || status === 'transcribing' || status === 'summarizing';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
          {isFailed && <AlertCircle className="w-5 h-5 text-red-600" />}
          {isProcessing && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          {!isCompleted && !isFailed && !isProcessing && <Clock className="w-5 h-5 text-gray-400" />}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isCompleted ? 'Evaluation Complete' : isFailed ? 'Evaluation Failed' : 'Processing Evaluation'}
            </h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isCompleted ? 'bg-green-100 text-green-800' :
          isFailed ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status}
        </div>
      </div>

      {/* Progress Stages */}
      {showDetails && (
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const stageProgress = progress[stage.key] || 0;
            const isActive = stageProgress > 0 && stageProgress < 100;
            const isComplete = stageProgress === 100;

            return (
              <div key={stage.key} className="flex items-center gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 ${getStatusColor(stageProgress)}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                </div>

                {/* Stage Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {stage.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {stageProgress}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(stageProgress)}`}
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {isComplete && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {isActive && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overall Progress */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round(Object.values(progress).reduce((sum, val) => sum + val, 0) / Object.keys(progress).length || 0)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ 
              width: `${Math.round(Object.values(progress).reduce((sum, val) => sum + val, 0) / Object.keys(progress).length || 0)}%` 
            }}
          />
        </div>
      </div>

      {/* Estimated Time */}
      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Estimated completion time: 2-3 minutes
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {isFailed && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">
              Evaluation failed. Please try again or contact support.
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Evaluation completed successfully! View your detailed results.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CompactEvaluationProgress - Smaller version for inline use
 */
export function CompactEvaluationProgress({ status, progress = {} }) {
  const overallProgress = Math.round(Object.values(progress).reduce((sum, val) => sum + val, 0) / Object.keys(progress).length || 0);
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {status === 'processing' && (
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        )}
        {status === 'completed' && (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
        {status === 'failed' && (
          <AlertCircle className="w-4 h-4 text-red-600" />
        )}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {status === 'processing' ? 'Processing...' : 
           status === 'completed' ? 'Completed' : 
           status === 'failed' ? 'Failed' : 'Initializing...'}
        </span>
      </div>
      
      <div className="flex-1 max-w-xs">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
      
      <span className="text-xs text-gray-600">{overallProgress}%</span>
    </div>
  );
}
