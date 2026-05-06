import React, { useState } from "react";
import { bloomTaxonomyColors, getBloomColor } from "../../../../../../../types/evaluation";

/* ── Bloom's score label ──────────────────────────────────────────────────── */
const BLOOM_LEVELS = ["Did Not Discuss", "Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"];

export default function IndividualEvaluation({ individualEvaluations, userRole = "client" }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!individualEvaluations?.length) return null;

  // Filter: students see only their own evaluation
  const filtered = individualEvaluations.filter((ev) => {
    if (userRole === "client") {
      const uid = localStorage.getItem("user_id") || "clarence";
      return ev.participantId === uid;
    }
    return true;
  });

  const toggle = (pid, rid) => {
    const key = `${pid}-${rid}`;
    setExpandedId(expandedId === key ? null : key);
  };

  return (
    <div className="space-y-6">
      {filtered.map((evaluation) => (
        <div key={evaluation.participantId}>
          {/* Section header */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">
              {userRole === "client" ? "Your Evaluation" : evaluation.participantName}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              AI-analyzed performance across {evaluation.evaluations.length} rubric
              {evaluation.evaluations.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rubric cards */}
          <div className="space-y-3">
            {evaluation.evaluations.map((rubric) => {
              const isOpen = expandedId === `${evaluation.participantId}-${rubric.rubricId}`;
              const bloomColor = getBloomColor(rubric.bloomLevel.score) || "#9ca3af";
              const scorePct = (rubric.bloomLevel.score / 6) * 100;

              return (
                <div
                  key={rubric.rubricId}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Bloom score bar (top accent) */}
                  <div className="h-1" style={{ backgroundColor: bloomColor }} />

                  <div className="p-4">
                    {/* Rubric header row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                          {rubric.rubricTitle}
                        </h4>
                        {rubric.rubricDescription && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                            {rubric.rubricDescription}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Bloom badge */}
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: bloomColor + "18",
                            color: bloomColor,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: bloomColor }}
                          />
                          {rubric.bloomLevel.level}
                        </span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400 font-medium">Bloom&rsquo;s Score</span>
                        <span className="text-[10px] font-bold text-gray-600 tabular-nums">
                          {rubric.bloomLevel.score}/6
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${scorePct}%`, backgroundColor: bloomColor }}
                        />
                      </div>
                    </div>

                    {/* Contributions */}
                    {rubric.contributions?.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {rubric.contributions.map((c, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="mt-1 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                            <span className="leading-relaxed">{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Summary */}
                    {rubric.summary && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2.5 mb-3">
                        <p className="text-xs text-gray-600 leading-relaxed">{rubric.summary}</p>
                      </div>
                    )}

                    {/* Expand toggle */}
                    <button
                      onClick={() => toggle(evaluation.participantId, rubric.rubricId)}
                      className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                    >
                      {isOpen ? "Hide details" : "Show details"}
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                        {rubric.explanation && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              What does this mean?
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {rubric.explanation}
                            </p>
                          </div>
                        )}

                        {/* Bloom's scale visualization */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Bloom&rsquo;s Taxonomy Scale
                          </p>
                          <div className="flex gap-1">
                            {BLOOM_LEVELS.map((level, i) => {
                              const active = i + 1 <= rubric.bloomLevel.score;
                              const color = bloomTaxonomyColors[level] || "#e5e7eb";
                              return (
                                <div key={level} className="flex-1 text-center">
                                  <div
                                    className="h-2 rounded-full mb-1 transition-opacity duration-300"
                                    style={{
                                      backgroundColor: color,
                                      opacity: active ? 1 : 0.15,
                                    }}
                                  />
                                  <p
                                    className="text-[8px] font-medium leading-tight"
                                    style={{ color: active ? color : "#d1d5db" }}
                                  >
                                    {level}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
