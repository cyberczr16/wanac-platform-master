import React, { useState } from 'react';
import { X, AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { getRecoveryAction, isRecoverableError } from '../../../utils/fireteamErrors';

/**
 * ErrorNotification - Displays fireteam-specific errors with recovery actions
 * 
 * @param {Object} error - The error object from useRoomState or other fireteam hooks
 * @param {Function} onRetry - Optional retry callback
 * @param {Function} onDismiss - Callback to dismiss the error
 * @param {boolean} showRecovery - Whether to show recovery actions
 */
export default function ErrorNotification({ 
  error, 
  onRetry, 
  onDismiss, 
  showRecovery = true 
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!error) return null;

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorIcon = () => {
    switch (error.severity) {
      case 'critical':
        return <X className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Wifi className="w-5 h-5 text-blue-600" />;
    }
  };

  const getErrorColorClasses = () => {
    switch (error.severity) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'high':
        return 'border-orange-200 bg-orange-50 text-orange-900';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-900';
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md rounded-lg border p-4 shadow-lg z-50 ${getErrorColorClasses()}`}>
      <div className="flex items-start gap-3">
        {/* Error Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getErrorIcon()}
        </div>

        {/* Error Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">
            {error.type === 'PERMISSION' ? 'Permission Required' : 'Connection Issue'}
          </h4>
          
          <p className="text-sm opacity-90 mb-2">
            {error.message}
          </p>

          {/* Recovery Action */}
          {showRecovery && (
            <div className="text-xs opacity-75 mb-3">
              {getRecoveryAction(error)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isRecoverableError(error) && onRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white bg-opacity-30 hover:bg-opacity-50 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Development Details */}
      {process.env.NODE_ENV === 'development' && error.context && (
        <details className="mt-3 pt-3 border-t border-current border-opacity-20">
          <summary className="text-xs cursor-pointer opacity-70 hover:opacity-100">
            Debug Info
          </summary>
          <pre className="text-xs mt-2 opacity-60 overflow-auto max-h-20">
            {JSON.stringify(error.context, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * FireteamErrorBoundary - Catches and displays errors in fireteam components
 */
export function FireteamErrorBoundary({ children, fallback }) {
  return (
    <div className="fireteam-error-boundary">
      {children}
    </div>
  );
}
