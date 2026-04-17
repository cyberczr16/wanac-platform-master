"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useEvaluationData } from "./hooks/useEvaluationData";
import ConversationMap from "./components/ConversationMap";
import GroupBalanceScore from "./components/GroupBalanceScore";
import IndividualEvaluation from "./components/IndividualEvaluation";
import RoleTabView from "./components/RoleTabView";
import Sidebar from "../../../../../../../components/dashboardcomponents/sidebar";
import AdminSidebar from "../../../../../../../components/dashboardcomponents/adminsidebar";

/* ── Bloom's Taxonomy color + label map ───────────────────────────────────── */
const BLOOMS = [
  { score: 1, label: "Remembering", color: "#06B6D4" },
  { score: 2, label: "Understanding", color: "#3B82F6" },
  { score: 3, label: "Applying", color: "#FCD34D" },
  { score: 4, label: "Analyzing", color: "#F59E0B" },
  { score: 5, label: "Evaluating", color: "#D15924" },
  { score: 6, label: "Creating", color: "#10B981" },
];

/* ── Compute an average Bloom score across all rubrics for the student ───── */
function getOverallScore(evaluations) {
  if (!evaluations?.length) return null;
  let total = 0;
  let count = 0;
  evaluations.forEach((ev) => {
    ev.evaluations?.forEach((r) => {
      if (r.bloomLevel?.score) {
        total += r.bloomLevel.score;
        count++;
      }
    });
  });
  return count > 0 ? { avg: total / count, count } : null;
}

export default function EvaluationPage() {
  const searchParams = useSearchParams();
  const fireteamId = searchParams?.get("fireteamId");
  const recordingId = searchParams?.get("recordingId");
  const hasAI = searchParams?.get("hasAI") === "true";
  const isAdmin = searchParams?.get("admin") === "true";
  const userRole = isAdmin ? "admin" : "client";

  const { evaluationData, loading, error } = useEvaluationData(
    recordingId,
    fireteamId,
    hasAI,
    userRole
  );

  /* ── Shell wrapper ─────────────────────────────────────────────────────── */
  const Shell = ({ children }) => (
    <div className="h-screen flex bg-[#f5f5f5]">
      {isAdmin ? (
        <AdminSidebar collapsed={true} setCollapsed={() => {}} />
      ) : (
        <Sidebar collapsed={true} setCollapsed={() => {}} />
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );

  /* ── Loading ────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading your results...</p>
        </div>
      </Shell>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────────────── */
  if (error) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Something went wrong</h2>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Shell>
    );
  }

  /* ── Empty ───────────────────────────────────────────────────────────────── */
  if (!evaluationData) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">No evaluation data available yet</p>
        </div>
      </Shell>
    );
  }

  /* ── Compute hero stats ─────────────────────────────────────────────────── */
  const overall = getOverallScore(evaluationData.individualEvaluations);
  const bloomMatch = overall ? BLOOMS.find((b) => b.score === Math.round(overall.avg)) : null;
  const si = evaluationData.sessionInfo;

  return (
    <Shell>
      <div className="flex-1 overflow-y-auto">
        {/* ── Hero Section ──────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Back link */}
            <button
              onClick={() => (window.location.href = "/client/fireteam")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium mb-6 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to FireTeam
            </button>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                  Session Results
                </h1>
                <p className="text-sm text-gray-400">
                  {si.experienceTitle}
                  {si.duration ? ` \u00B7 ${si.duration}` : ""}
                  {si.totalParticipants
                    ? ` \u00B7 ${si.totalParticipants} participant${si.totalParticipants !== 1 ? "s" : ""}`
                    : ""}
                </p>
              </div>

              {/* Overall Bloom score pill */}
              {overall && bloomMatch && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: bloomMatch.color }}
                  >
                    {overall.avg.toFixed(1)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Overall Level</p>
                    <p className="text-sm font-bold text-gray-900">{bloomMatch.label}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bloom scale strip */}
            <div className="mt-6 flex gap-1 rounded-xl overflow-hidden h-2">
              {BLOOMS.map((b) => (
                <div
                  key={b.score}
                  className="flex-1 transition-opacity duration-300"
                  style={{
                    backgroundColor: b.color,
                    opacity: overall && Math.round(overall.avg) >= b.score ? 1 : 0.15,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-gray-300 font-medium">Remembering</span>
              <span className="text-[10px] text-gray-300 font-medium">Creating</span>
            </div>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ConversationMap
              conversationMap={evaluationData.conversationMap}
              participants={evaluationData.groupBalanceScore.participants}
            />
            <GroupBalanceScore groupBalanceScore={evaluationData.groupBalanceScore} />
          </div>

          {/* Individual evaluations */}
          <RoleTabView userRole={userRole}>
            <IndividualEvaluation
              individualEvaluations={evaluationData.individualEvaluations}
              userRole={userRole}
            />
          </RoleTabView>

          {/* AI disclaimer */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 flex items-start gap-3 text-sm">
            <svg className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 leading-relaxed">
              This evaluation is based on{" "}
              {hasAI
                ? "AI analysis of your meeting recording and transcript"
                : "basic participation metrics"}
              . Bloom&rsquo;s Taxonomy levels assess cognitive engagement across your learning objectives.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
