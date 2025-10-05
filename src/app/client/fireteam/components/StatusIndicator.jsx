import React from 'react';

const StatusIndicator = ({ error, isConnecting, connectionQuality, participantCount }) => {
  const getConnectionQualityColor = (quality) => {
    switch (quality) {
      case 'good': return 'text-green-600';
      case 'poor': return 'text-yellow-600';
      case 'bad': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionQualityIcon = (quality) => {
    switch (quality) {
      case 'good': return '🟢';
      case 'poor': return '🟡';
      case 'bad': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      {/* Error Message */}
      {error && (
        <div className={`px-4 py-2 text-sm rounded-lg border max-w-md text-center ${
          error.includes('Connecting') 
            ? 'bg-blue-100 text-blue-700 border-blue-300' 
            : 'bg-red-100 text-red-700 border-red-300'
        }`}>
          {error}
        </div>
      )}
      
      {/* Connection Status */}
      {!error && (
        <div className="flex items-center gap-4 text-sm">
          {isConnecting && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-300">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-700"></div>
              <span>Connecting...</span>
            </div>
          )}
          
          {!isConnecting && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-300">
              <span className={getConnectionQualityColor(connectionQuality)}>
                {getConnectionQualityIcon(connectionQuality)}
              </span>
              <span className="capitalize">{connectionQuality} connection</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-300">
            <span>👥</span>
            <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
