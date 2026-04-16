"use client";

/**
 * Pre-Work Quiz Page
 *
 * Students must pass this quiz before they can join a live session.
 * Blueprint: Section 11 — questionType 0 = multiple choice pre-work question.
 * Pass threshold: 70% correct (configurable via PASS_THRESHOLD below).
 *
 * Route: /client/fireteam/experience/[experienceid]/quiz
 * Query params: fireteamId, link (optional meeting link)
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../../components/dashboardcomponents/sidebar";
import { experienceService } from "../../../../../../services/api/experience.service";
import { isCurrentUserMemberOf, isClientRole } from "../../../../../../lib/fireteamAccess";

const PASS_THRESHOLD = 0.70; // 70% to pass

// ─── Icons ────────────────────────────────────────────────────────────────────
function CheckCircle({ cls = "text-green-500" }) {
  return (
    <svg className={`w-5 h-5 ${cls}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function XCircle() {
  return (
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Single multiple-choice question card */
function QuestionCard({ question, index, selected, onSelect, revealed }) {
  const answers = question.answers ?? [];
  const correct  = question.correctAnswerIndex ?? question.correct_answer_index;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="w-7 h-7 rounded-full bg-[#002147] text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <p className="text-base font-semibold text-gray-900 leading-snug">
          {question.question}
        </p>
      </div>

      <div className="space-y-2.5 pl-10">
        {answers.map((ans, i) => {
          const isCorrect   = i === correct;
          const isSelected  = i === selected;

          let border = "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50";
          let icon   = null;

          if (revealed) {
            if (isCorrect) {
              border = "border-green-400 bg-green-50";
              icon = <CheckCircle />;
            } else if (isSelected && !isCorrect) {
              border = "border-red-300 bg-red-50";
              icon = <XCircle />;
            }
          } else if (isSelected) {
            border = "border-[#002147] bg-blue-50";
          }

          return (
            <button
              key={i}
              onClick={() => !revealed && onSelect(index, i)}
              disabled={revealed}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium
                         transition-colors flex items-center gap-3 ${border}
                         disabled:cursor-default`}
            >
              <span className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                               text-[10px] font-bold border-current">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{ans}</span>
              {icon && <span className="flex-shrink-0">{icon}</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation — shown after reveal */}
      {revealed && question.explanation && (
        <div className="mt-4 ml-10 bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-800 leading-relaxed">
          <span className="font-semibold">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}

/** Results summary shown after quiz submission */
function QuizResults({ score, total, passed, onRetry, onJoin }) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col items-center text-center py-10 gap-6 max-w-sm mx-auto">
      <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black
                       ${passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
        {pct}%
      </div>

      <div>
        <h2 className={`text-2xl font-black mb-1 ${passed ? "text-green-700" : "text-red-600"}`}>
          {passed ? "Quiz Passed! 🎉" : "Not quite — try again"}
        </h2>
        <p className="text-gray-500 text-sm">
          You answered {score} of {total} questions correctly.
          {!passed && ` You need ${Math.ceil(PASS_THRESHOLD * total)} correct to pass.`}
        </p>
      </div>

      <div className="flex gap-3 w-full">
        {!passed && (
          <button
            onClick={onRetry}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold
                       text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        )}
        {passed && (
          <button
            onClick={onJoin}
            className="flex-1 py-3 bg-[#002147] text-white rounded-xl text-sm font-bold
                       hover:bg-[#003275] transition-colors"
          >
            Join Session →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PreWorkQuizPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();

  const experienceId = params?.experienceid;
  const fireteamId   = searchParams?.get("fireteamId");
  const meetingLink  = searchParams?.get("link");

  const [collapsed, setCollapsed] = useState(true);

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

  // Quiz state
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});     // { questionIndex: answerIndex }
  const [submitted, setSubmitted]   = useState(false);
  const [score, setScore]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // ── Fetch quiz questions from the API ────────────────────────────────────────
  useEffect(() => {
    if (!experienceId) return;
    (async () => {
      try {
        setLoading(true);
        // Try the experience service first
        let qs = await experienceService.getQuizQuestions?.(experienceId).catch(() => null);
        if (!qs) {
          // Fallback: fetch from the experience details which may include questions
          const exp = await experienceService.getExperience?.(experienceId).catch(() => null);
          qs = exp?.questions ?? exp?.quiz_questions ?? [];
        }
        // Filter to pre-work MC questions only (questionType 0)
        const preWorkQs = (qs ?? []).filter(
          (q) => (q.questionType ?? q.question_type ?? 0) === 0
        );
        setQuestions(preWorkQs);
      } catch {
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    })();
  }, [experienceId]);

  // ── Handle answer selection ──────────────────────────────────────────────────
  const handleSelect = useCallback((questionIndex, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }));
  }, []);

  // ── Calculate score on submit ────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      const expected = q.correctAnswerIndex ?? q.correct_answer_index;
      if (answers[i] === expected) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    // Persist pass status so the overview gate doesn't re-show the quiz
    try {
      const key = `quiz_passed_${experienceId}`;
      const passed = correct / questions.length >= PASS_THRESHOLD;
      if (passed) localStorage.setItem(key, "true");
    } catch {}
  }, [questions, answers, experienceId]);

  // ── Retry ────────────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }, []);

  // ── Join session after passing ────────────────────────────────────────────────
  const handleJoin = useCallback(() => {
    let url = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}`;
    if (meetingLink) url += `&link=${encodeURIComponent(meetingLink)}`;
    router.push(url);
  }, [experienceId, fireteamId, meetingLink, router]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);
  const passed      = score !== null && score / questions.length >= PASS_THRESHOLD;
  const progress    = questions.length
    ? Math.round((Object.keys(answers).length / questions.length) * 100)
    : 0;

  // ── Render ───────────────────────────────────────────────────────────────────

  if (!accessChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 min-w-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-sm text-gray-500 mb-6">You are not a member of this fireteam.</p>
            <button
              onClick={() => router.push("/client/fireteam")}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Back to FireTeam
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 min-w-0 overflow-y-auto px-6 md:px-10 py-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-4 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                Pre-Work Required
              </div>
              <h1 className="text-2xl font-black text-gray-900">Pre-Work Quiz</h1>
              <p className="text-sm text-gray-500 mt-1">
                Complete this quiz before joining your session. You need{" "}
                {Math.round(PASS_THRESHOLD * 100)}% to pass.
              </p>
            </div>
          </div>

          {/* Progress bar (only before submit) */}
          {!submitted && questions.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{Object.keys(answers).length} of {questions.length} answered</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-[#002147] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="max-w-2xl mx-auto">

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3" />
              <p className="text-sm">Loading quiz…</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-red-500 font-semibold mb-2">{error}</p>
              <button onClick={() => router.back()} className="text-sm text-gray-500 underline">Go back</button>
            </div>
          )}

          {!loading && !error && questions.length === 0 && (
            /* No quiz configured — allow direct join */
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle cls="text-blue-500 w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">No quiz required</h2>
              <p className="text-gray-500 text-sm">This experience doesn&apos;t have a pre-work quiz.</p>
              <button
                onClick={handleJoin}
                className="px-8 py-3 bg-[#002147] text-white rounded-xl font-bold hover:bg-[#003275] transition-colors"
              >
                Join Session →
              </button>
            </div>
          )}

          {/* Results */}
          {submitted && (
            <QuizResults
              score={score}
              total={questions.length}
              passed={passed}
              onRetry={handleRetry}
              onJoin={handleJoin}
            />
          )}

          {/* Questions */}
          {!submitted && !loading && !error && questions.length > 0 && (
            <>
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <QuestionCard
                    key={q.id ?? i}
                    question={q}
                    index={i}
                    selected={answers[i]}
                    onSelect={handleSelect}
                    revealed={false}
                  />
                ))}
              </div>

              {/* Submit */}
              <div className="mt-8 flex flex-col items-center gap-3">
                {!allAnswered && (
                  <p className="text-sm text-gray-400">
                    Answer all {questions.length} questions to submit.
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="px-10 py-3.5 bg-[#002147] text-white rounded-xl font-bold text-sm
                             hover:bg-[#003275] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Quiz
                </button>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
