"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/dashboardcomponents/adminsidebar';
import { getBloomColor } from '../../../../types/evaluation';

/**
 * Admin Evaluation Management Interface
 * 
 * Provides comprehensive evaluation management for administrators including:
 * - View all evaluations across experiences
 * - Filter and search evaluations
 * - View detailed evaluation results
 * - Manage evaluation status
 * - Export evaluation data
 */

export default function AdminEvaluationsPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - in production, this would fetch from the backend
  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockEvaluations = [
          {
            id: 'eval_1',
            experienceId: 'exp_123',
            experienceTitle: 'Market Validation Workshop',
            participantCount: 4,
            status: 'completed',
            createdAt: '2024-01-15T10:00:00Z',
            completedAt: '2024-01-15T10:45:00Z',
            averageBloomScore: 4.2,
            totalRubrics: 4,
            evaluationModel: 'gpt-4o-mini'
          },
          {
            id: 'eval_2',
            experienceId: 'exp_124',
            experienceTitle: 'Customer Discovery Session',
            participantCount: 3,
            status: 'processing',
            createdAt: '2024-01-15T14:00:00Z',
            completedAt: null,
            averageBloomScore: null,
            totalRubrics: 4,
            evaluationModel: 'gpt-4o-mini'
          },
          {
            id: 'eval_3',
            experienceId: 'exp_125',
            experienceTitle: 'Product Development Sprint',
            participantCount: 5,
            status: 'failed',
            createdAt: '2024-01-14T16:00:00Z',
            completedAt: null,
            averageBloomScore: null,
            totalRubrics: 4,
            evaluationModel: 'gpt-4o-mini',
            error: 'Transcription service unavailable'
          }
        ];
        
        setEvaluations(mockEvaluations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
      case 'processing':
        return <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;
      case 'failed':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
      default:
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
    }
  };

  const getScoreColor = (score) => {
    if (score === null) return 'text-gray-400';
    if (score >= 5) return 'text-green-600';
    if (score >= 4) return 'text-blue-600';
    if (score >= 3) return 'text-yellow-600';
    if (score >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filters.status !== 'all' && evaluation.status !== filters.status) return false;
    if (filters.search && !evaluation.experienceTitle.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleViewDetails = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowDetails(true);
  };

  const handleExportEvaluation = async (evaluationId) => {
    try {
      // Simulate export functionality
      console.log(`Exporting evaluation ${evaluationId}`);
      alert('Evaluation exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleRetryEvaluation = async (evaluationId) => {
    try {
      // Simulate retry functionality
      console.log(`Retrying evaluation ${evaluationId}`);
      alert('Evaluation retry initiated!');
    } catch (error) {
      console.error('Retry failed:', error);
      alert('Retry failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading evaluations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluation Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and review AI-powered evaluations</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export All
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search evaluations..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No evaluations found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Bloom Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {evaluation.experienceTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {evaluation.experienceId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                          {getStatusIcon(evaluation.status)}
                          <span className="ml-1">{evaluation.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evaluation.participantCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {evaluation.averageBloomScore !== null ? (
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${getScoreColor(evaluation.averageBloomScore)}`}>
                              {evaluation.averageBloomScore.toFixed(1)}
                            </span>
                            <div 
                              className="ml-2 w-3 h-3 rounded-full"
                              style={{ backgroundColor: getBloomColor(Math.round(evaluation.averageBloomScore)) }}
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(evaluation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(evaluation)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {evaluation.status === 'completed' && (
                            <button
                              onClick={() => handleExportEvaluation(evaluation.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Export
                            </button>
                          )}
                          {evaluation.status === 'failed' && (
                            <button
                              onClick={() => handleRetryEvaluation(evaluation.id)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Evaluation Details Modal */}
      {showDetails && selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEvaluation.experienceTitle}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Evaluation Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Status:</dt>
                      <dd className={`text-sm font-medium ${getStatusColor(selectedEvaluation.status)} px-2 py-1 rounded-full inline-flex items-center`}>
                        {getStatusIcon(selectedEvaluation.status)}
                        <span className="ml-1">{selectedEvaluation.status}</span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Participants:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedEvaluation.participantCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Model:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedEvaluation.evaluationModel}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Created:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {new Date(selectedEvaluation.createdAt).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Performance Metrics</h3>
                  <dl className="space-y-2">
                    {selectedEvaluation.averageBloomScore !== null && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Avg. Bloom Score:</dt>
                        <dd className="flex items-center">
                          <span className={`text-sm font-medium ${getScoreColor(selectedEvaluation.averageBloomScore)}`}>
                            {selectedEvaluation.averageBloomScore.toFixed(1)}
                          </span>
                          <div 
                            className="ml-2 w-3 h-3 rounded-full"
                            style={{ backgroundColor: getBloomColor(Math.round(selectedEvaluation.averageBloomScore)) }}
                          />
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Total Rubrics:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedEvaluation.totalRubrics}</dd>
                    </div>
                    {selectedEvaluation.error && (
                      <div>
                        <dt className="text-sm text-gray-600">Error:</dt>
                        <dd className="text-sm font-medium text-red-600">{selectedEvaluation.error}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                {selectedEvaluation.status === 'completed' && (
                  <button
                    onClick={() => handleExportEvaluation(selectedEvaluation.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Export Results
                  </button>
                )}
                {selectedEvaluation.status === 'failed' && (
                  <button
                    onClick={() => handleRetryEvaluation(selectedEvaluation.id)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Retry Evaluation
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
