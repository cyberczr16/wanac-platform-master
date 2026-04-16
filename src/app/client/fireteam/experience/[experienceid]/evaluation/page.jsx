"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEvaluationData } from './hooks/useEvaluationData';
import ConversationMap from './components/ConversationMap';
import GroupBalanceScore from './components/GroupBalanceScore';
import IndividualEvaluation from './components/IndividualEvaluation';
import RoleTabView from './components/RoleTabView';
import Sidebar from '../../../../../../../components/dashboardcomponents/sidebar';
import AdminSidebar from '../../../../../../../components/dashboardcomponents/adminsidebar';
import { isCurrentUserMemberOf, isClientRole } from '../../../../../../lib/fireteamAccess';

export default function EvaluationPage() {
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const router = useRouter();
  const experienceIdFromRoute = routeParams?.experienceid != null ? String(routeParams.experienceid) : null;
  const experienceId = searchParams?.get('experienceId') || experienceIdFromRoute;
  const fireteamId = searchParams?.get('fireteamId');
  const recordingId = searchParams?.get('recordingId');
  const hasAI = searchParams?.get('hasAI') === 'true';
  const isAdmin = searchParams?.get('admin') === 'true';

  // ── Access control ──
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (!fireteamId || !isClientRole()) { setAccessChecked(true); return; }
    let cancelled = false;
    isCurrentUserMemberOf(fireteamId).then((ok) => {
      if (cancelled) return;
      if (!ok) setAccessDenied(true);
      setAccessChecked(true);
    });
    return () => { cancelled = true; };
  }, [fireteamId]);

  // Determine user role
  const userRole = isAdmin ? 'admin' : 'client';

  const { evaluationData, loading, error } = useEvaluationData(
    recordingId,
    fireteamId,
    experienceId,
    hasAI,
    userRole
  );

  /* ── Shared shell ── */
  const Shell = ({ children }) => (
    <div className="h-screen flex bg-gray-100">
      {isAdmin
        ? <AdminSidebar collapsed={true} setCollapsed={() => {}} />
        : <Sidebar collapsed={true} setCollapsed={() => {}} />
      }
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6">
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );

  // Access check
  if (!accessChecked) {
    return (
      <Shell>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
        </div>
      </Shell>
    );
  }

  if (accessDenied) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <h2 className="text-lg font-semibold text-gray-800">Access Denied</h2>
          <p className="text-gray-500 text-sm">You are not a member of this fireteam.</p>
          <button
            onClick={() => router.push("/client/fireteam")}
            className="mt-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to FireTeam
          </button>
        </div>
      </Shell>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002147] mb-4" />
          <p className="text-sm">Loading session results…</p>
        </div>
      </Shell>
    );
  }

  // Error state
  if (error) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-lg font-semibold text-gray-800">Error loading evaluation</h2>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </Shell>
    );
  }

  if (!evaluationData) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <span className="text-5xl">📊</span>
          <h2 className="text-lg font-semibold text-gray-800">No evaluation data</h2>
          <p className="text-gray-500 text-sm">No evaluation data is available for this session yet.</p>
        </div>
      </Shell>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      {isAdmin
        ? <AdminSidebar collapsed={true} setCollapsed={() => {}} />
        : <Sidebar collapsed={true} setCollapsed={() => {}} />
      }

      {/* Main content card */}
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6">
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">

          {/* Page header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-[#002147] tracking-tight">
                  Session Results
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {evaluationData.sessionInfo.experienceTitle}
                  {evaluationData.sessionInfo.duration && (
                    <> &bull; {evaluationData.sessionInfo.duration}</>
                  )}
                  {evaluationData.sessionInfo.totalParticipants && (
                    <> &bull; {evaluationData.sessionInfo.totalParticipants} participant{evaluationData.sessionInfo.totalParticipants !== 1 ? "s" : ""}</>
                  )}
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/client/fireteam'}
                className="self-start sm:self-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                ← Back to FireTeam
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="max-w-7xl mx-auto space-y-6">

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <ConversationMap
                    conversationMap={evaluationData.conversationMap}
                    participants={evaluationData.groupBalanceScore.participants}
                  />
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <GroupBalanceScore groupBalanceScore={evaluationData.groupBalanceScore} />
                </div>
              </div>

              {/* Individual evaluation */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <RoleTabView userRole={userRole}>
                  <IndividualEvaluation
                    individualEvaluations={evaluationData.individualEvaluations}
                    userRole={userRole}
                  />
                </RoleTabView>
              </div>

              {/* Footer info */}
              <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 flex items-start gap-3 text-sm text-blue-800">
                <span className="text-lg leading-none mt-0.5">ℹ️</span>
                <div>
                  <p className="font-semibold mb-0.5">About This Evaluation</p>
                  <p className="text-blue-700 leading-relaxed">
                    This evaluation is based on{' '}
                    {hasAI
                      ? 'AI analysis of your meeting recording and transcript'
                      : 'basic participation metrics'}
                    . The analysis uses Bloom&rsquo;s Taxonomy to assess cognitive engagement levels across different learning objectives.
                  </p>
                  {hasAI && (
                    <p className="text-blue-700/90 leading-relaxed mt-3 border-t border-blue-100 pt-3">
                      <span className="font-medium text-blue-900">Transcript note: </span>
                      The recording is a single mixed audio track from this session. We do not run speaker
                      diarization, so the transcript does not label who spoke each sentence. Bloom scores for each
                      participant use that same full discussion text and attribute evidence when wording can be tied
                      to a person; they are best read as facilitation-style feedback, not as a forensic split of
                      speaking time.
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
