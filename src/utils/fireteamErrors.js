/**
 * Fireteam Experience Error Handling Utilities
 * 
 * Provides standardized error types, messages, and handling functions
 * for the Fireteam experience processing and evaluation system.
 */

// Error types for different scenarios
export const ERROR_TYPES = {
  ROOM_STATE_INIT: 'ROOM_STATE_INIT',
  ROOM_STATE_UPDATE: 'ROOM_STATE_UPDATE',
  SLIDE_ADVANCE: 'SLIDE_ADVANCE',
  EXHIBIT_CHANGE: 'EXHIBIT_CHANGE',
  LIVEKIT_CONNECTION: 'LIVEKIT_CONNECTION',
  RECORDING: 'RECORDING',
  EVALUATION: 'EVALUATION',
  QUIZ_SUBMIT: 'QUIZ_SUBMIT',
  NETWORK: 'NETWORK',
  PERMISSION: 'PERMISSION',
};

// User-friendly error messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.ROOM_STATE_INIT]: 'Unable to join the session. Please refresh the page and try again.',
  [ERROR_TYPES.ROOM_STATE_UPDATE]: 'Session sync issue. Your changes may not be visible to others.',
  [ERROR_TYPES.SLIDE_ADVANCE]: 'Only the group leader can advance slides.',
  [ERROR_TYPES.EXHIBIT_CHANGE]: 'Only the group leader can change exhibits.',
  [ERROR_TYPES.LIVEKIT_CONNECTION]: 'Video connection lost. Attempting to reconnect...',
  [ERROR_TYPES.RECORDING]: 'Recording issue. Your session may not be saved for evaluation.',
  [ERROR_TYPES.EVALUATION]: 'Unable to process evaluation. Please try again later.',
  [ERROR_TYPES.QUIZ_SUBMIT]: 'Failed to submit quiz. Please check your connection and try again.',
  [ERROR_TYPES.NETWORK]: 'Network connection issue. Please check your internet connection.',
  [ERROR_TYPES.PERMISSION]: 'You don\'t have permission to perform this action.',
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Creates a standardized error object
 */
export function createFireteamError(type, originalError, context = {}) {
  return {
    type,
    message: ERROR_MESSAGES[type] || 'An unexpected error occurred.',
    originalError,
    context,
    timestamp: new Date().toISOString(),
    severity: getErrorSeverity(type),
  };
}

/**
 * Determines error severity based on type
 */
function getErrorSeverity(type) {
  switch (type) {
    case ERROR_TYPES.LIVEKIT_CONNECTION:
    case ERROR_TYPES.RECORDING:
    case ERROR_TYPES.EVALUATION:
      return ERROR_SEVERITY.HIGH;
    
    case ERROR_TYPES.ROOM_STATE_INIT:
    case ERROR_TYPES.NETWORK:
      return ERROR_SEVERITY.MEDIUM;
    
    case ERROR_TYPES.SLIDE_ADVANCE:
    case ERROR_TYPES.EXHIBIT_CHANGE:
    case ERROR_TYPES.PERMISSION:
      return ERROR_SEVERITY.LOW;
    
    default:
      return ERROR_SEVERITY.MEDIUM;
  }
}

/**
 * Error handler for async operations
 */
export async function withErrorHandling(asyncFn, errorType, context = {}) {
  try {
    return await asyncFn();
  } catch (error) {
    const fireteamError = createFireteamError(errorType, error, context);
    console.error(`Fireteam Error [${errorType}]:`, fireteamError);
    throw fireteamError;
  }
}

/**
 * Checks if error is recoverable
 */
export function isRecoverableError(error) {
  const recoverableTypes = [
    ERROR_TYPES.NETWORK,
    ERROR_TYPES.LIVEKIT_CONNECTION,
    ERROR_TYPES.ROOM_STATE_UPDATE,
  ];
  
  return recoverableTypes.includes(error.type);
}

/**
 * Gets user-friendly action for error recovery
 */
export function getRecoveryAction(error) {
  switch (error.type) {
    case ERROR_TYPES.NETWORK:
      return 'Check your internet connection and try again.';
    
    case ERROR_TYPES.LIVEKIT_CONNECTION:
      return 'Refreshing the page may restore the video connection.';
    
    case ERROR_TYPES.ROOM_STATE_INIT:
      return 'Please refresh the page to rejoin the session.';
    
    case ERROR_TYPES.SLIDE_ADVANCE:
    case ERROR_TYPES.EXHIBIT_CHANGE:
      return 'Wait for the group leader to control the session.';
    
    case ERROR_TYPES.PERMISSION:
      return 'Contact your session administrator if you believe this is an error.';
    
    default:
      return 'Try refreshing the page or contact support if the issue persists.';
  }
}

/**
 * Logger for fireteam-specific errors
 */
export class FireteamLogger {
  static log(error, additionalInfo = {}) {
    const logEntry = {
      ...error,
      additionalInfo,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToSentry(logEntry);
      console.error('Fireteam Error Logged:', logEntry);
    } else {
      console.group(`🔥 Fireteam Error [${error.type}]`);
      console.error('Message:', error.message);
      console.error('Context:', error.context);
      console.error('Original Error:', error.originalError);
      console.error('Additional Info:', additionalInfo);
      console.groupEnd();
    }
  }

  static info(message, data = {}) {
    console.log(`ℹ️ Fireteam Info: ${message}`, data);
  }

  static warn(message, data = {}) {
    console.warn(`⚠️ Fireteam Warning: ${message}`, data);
  }

  static debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 Fireteam Debug: ${message}`, data);
    }
  }
}
