/**
 * SlideComponent — renders the correct UI for each Breakout slideType.
 *
 * The blueprint defines 12 distinct slideType values (0,1,2,4,6,7,8,11,12,17,18,19).
 * This component dispatches on step.breakout.slideType (or a legacy title fallback)
 * so every slide renders correctly regardless of how the deck was built.
 *
 * Props:
 *   step            — agenda step object from useMeetingData / breakoutDeckParser
 *   participants    — LiveKit participant list
 *   experienceTitle — display name of the experience
 *   onRatingSubmit  — callback(stars: number) for slideType 11 (Processing)
 *   exhibits        — array of exhibit objects for slideType 6 (Discussion)
 *   activeExhibitId — currently selected exhibit id
 */

import React, { useState } from "react";

// ─── Bloom's Taxonomy color map (exact colors from the blueprint) ─────────────
const BLOOMS_COLORS = {
  0: { bg: "#efefef", text: "#555", label: "Did Not Discuss" },
  1: { bg: "#AEF4FF", text: "#0a4a5c", label: "Remembering" },
  2: { bg: "#3BB5C8", text: "#fff",    label: "Understanding" },
  3: { bg: "#BC9906", text: "#fff",    label: "Applying" },
  4: { bg: "#FFCA00", text: "#333",    label: "Analyzing" },
  5: { bg: "#D15924", text: "#fff",    label: "Evaluating" },
  6: { bg: "#282828", text: "#fff",    label: "Creating" },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Animated waiting dots used in the waiting room */
function WaitingDots() {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

/** Slide shell — consistent 16:9 card frame */
function SlideShell({ children, className = "" }) {
  return (
    <div
      className={`w-full mx-auto flex items-center justify-center
                  h-[420px] md:h-[520px] lg:h-[620px] ${className}`}
    >
      {children}
    </div>
  );
}

// ─── slideType 0 — Waiting Room ───────────────────────────────────────────────
function WaitingRoomSlide({ participants, experienceTitle }) {
  return (
    <SlideShell>
      <div className="bg-[#FFCA00] rounded-2xl shadow-lg p-10 text-center w-full h-full flex flex-col justify-center">
        <h1 className="text-3xl font-black leading-tight mb-4">
          Welcome to your <br /> Fireteam Experience
        </h1>
        <p className="text-sm mb-4 text-gray-800">
          When your entire group has arrived, your group leader will advance to the
          next slide to begin the experience!
        </p>
        <hr className="border-t border-black/20 w-1/2 mx-auto my-4" />
        <div className="my-4">
          <div className="inline-flex items-center justify-center bg-white rounded-full px-6 py-3 shadow-md">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-bold text-lg">
              {participants.length} {participants.length === 1 ? "Participant" : "Participants"} Joined
            </span>
          </div>
        </div>
        {experienceTitle && (
          <>
            <p className="text-sm mb-2">We hope you enjoy</p>
            <h2 className="font-bold text-lg">{experienceTitle}</h2>
          </>
        )}
        <WaitingDots />
      </div>
    </SlideShell>
  );
}

// ─── slideType 1 — Standard Content (image + optional video) ─────────────────
function StandardContentSlide({ step }) {
  const b = step.breakout ?? {};
  const caption = b.captions?.[0]?.caption;

  if (b.slideImageURL) {
    return (
      <SlideShell>
        <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center relative border border-gray-200">
          <img
            src={b.slideImageURL}
            alt={b.slideImageAltText || step.title}
            className="max-w-full max-h-full object-contain"
          />
          {caption && (
            <div className="absolute left-6 right-6 bottom-5 bg-black/80 text-white px-4 py-3 rounded-lg text-sm leading-snug">
              {caption}
            </div>
          )}
        </div>
      </SlideShell>
    );
  }

  // Text-only fallback
  return (
    <SlideShell>
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full h-full flex flex-col justify-center border border-gray-200">
        <h1 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h1>
        {step.subtitle && <p className="text-gray-600 text-base">{step.subtitle}</p>}
      </div>
    </SlideShell>
  );
}

// ─── slideType 2 — Content with Linked Questions ─────────────────────────────
function ContentWithQuestionsSlide({ step }) {
  // Same as type 1 but no video — questions are embedded via slideInputQuestionIds
  return <StandardContentSlide step={step} />;
}

// ─── slideType 4 — Poll ───────────────────────────────────────────────────────
function PollSlide({ step }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const options = step.breakout?.answers || step.answers || [];

  return (
    <SlideShell>
      <div className="bg-[#002147] rounded-2xl shadow-lg p-10 w-full h-full flex flex-col justify-center text-white">
        <h2 className="text-xl font-black mb-6">{step.title}</h2>
        {step.subtitle && <p className="text-white/70 mb-6 text-sm">{step.subtitle}</p>}
        <div className="space-y-3">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${
                selected === i
                  ? "bg-[#E87722] border-[#E87722] text-white"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {selected !== null && !submitted && (
          <button
            onClick={() => setSubmitted(true)}
            className="mt-6 self-center px-8 py-3 bg-[#E87722] text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Submit Vote
          </button>
        )}
        {submitted && (
          <p className="mt-6 text-center text-white/80 text-sm font-medium">
            ✓ Vote submitted — waiting for results…
          </p>
        )}
      </div>
    </SlideShell>
  );
}

// ─── slideType 6 — Discussion Prompt ─────────────────────────────────────────
function DiscussionSlide({ step }) {
  const b = step.breakout ?? {};
  return (
    <SlideShell>
      <div className="w-full h-full flex flex-col">
        {/* Discussion prompt card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-[#D15924]/10 text-[#D15924] text-xs font-bold px-3 py-1 rounded-full mb-4">
              Discussion
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3 leading-tight">
              {step.title}
            </h1>
            {step.subtitle && (
              <p className="text-gray-600 text-sm leading-relaxed">{step.subtitle}</p>
            )}
          </div>

          {/* Discussion prompt text */}
          {b.slideDescription && b.slideDescription !== step.title && (
            <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {b.slideDescription}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Discussion in progress</span>
            </div>
            {step.duration && (
              <>
                <span>·</span>
                <span>{step.duration}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── slideType 7 — Grading / Information ─────────────────────────────────────
function GradingSlide({ step }) {
  const b = step.breakout ?? {};
  return (
    <SlideShell>
      {b.slideImageURL ? (
        <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center border border-gray-200">
          <img
            src={b.slideImageURL}
            alt={b.slideImageAltText || step.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full h-full flex flex-col justify-center border border-gray-200">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
            Grading
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h1>
          {step.subtitle && <p className="text-gray-600">{step.subtitle}</p>}
          {/* Bloom's legend */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {Object.entries(BLOOMS_COLORS).map(([score, { bg, text, label }]) => (
              <div
                key={score}
                className="flex flex-col items-center gap-1 p-2 rounded-lg text-center"
                style={{ backgroundColor: bg, color: text }}
              >
                <span className="text-lg font-black">{score}</span>
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SlideShell>
  );
}

// ─── slideType 8 — Agenda ────────────────────────────────────────────────────
function AgendaSlide({ step, allSteps = [], currentStepIndex = 0 }) {
  return (
    <SlideShell>
      <div className="bg-[#002147] rounded-2xl shadow-lg p-8 w-full h-full flex flex-col text-white overflow-hidden">
        <h1 className="text-2xl font-black mb-6">Today&apos;s Agenda</h1>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {allSteps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                i === currentStepIndex
                  ? "bg-[#E87722] font-semibold"
                  : i < currentStepIndex
                  ? "bg-white/10 text-white/50"
                  : "bg-white/5"
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border ${
                i < currentStepIndex ? "bg-green-400 border-green-400 text-white" :
                i === currentStepIndex ? "bg-white border-white text-[#E87722]" :
                "border-white/30 text-white/50"
              }`}>
                {i < currentStepIndex ? "✓" : i + 1}
              </div>
              <span className="flex-1 truncate">{s.title}</span>
              {s.duration && (
                <span className="text-white/50 text-xs flex-shrink-0">{s.duration}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

// ─── slideType 11 — Session Processing ───────────────────────────────────────
function ProcessingSlide({ onRatingSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) return;
    setSubmitted(true);
    onRatingSubmit?.(rating);
  };

  return (
    <SlideShell>
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg p-10 text-center w-full h-full flex flex-col justify-center text-white">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-3">Processing Session Data</h1>
          <p className="text-white/80 text-sm mb-6">
            Our AI is analyzing your discussion and generating your Bloom&apos;s Taxonomy evaluation…
          </p>
        </div>

        {/* 5-star rating — required by blueprint */}
        {!submitted ? (
          <div className="bg-white/10 rounded-2xl p-6 max-w-sm mx-auto w-full">
            <p className="text-sm font-semibold mb-4">How would you rate this session?</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  <span className={star <= (hovered || rating) ? "text-[#FFCA00]" : "text-white/30"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!rating}
              className="w-full py-2.5 bg-white text-purple-700 rounded-xl font-bold text-sm
                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
            >
              Submit Rating
            </button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-2xl p-6 max-w-sm mx-auto w-full">
            <p className="text-2xl mb-2">{"★".repeat(rating)}</p>
            <p className="text-sm text-white/80">Thank you for your feedback!</p>
            <p className="text-xs text-white/50 mt-2">Results will appear shortly…</p>
          </div>
        )}
      </div>
    </SlideShell>
  );
}

// ─── slideType 12 — End of Session ───────────────────────────────────────────
function EndOfSessionSlide({ experienceTitle }) {
  return (
    <SlideShell>
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-lg p-10 text-center w-full h-full flex flex-col justify-center text-white">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 mx-auto">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-black mb-3">Session Complete!</h1>
        {experienceTitle && (
          <p className="text-white/80 text-lg mb-6">{experienceTitle}</p>
        )}
        <div className="space-y-2 text-sm text-white/70">
          <p>✓ Session transcribed</p>
          <p>✓ AI insights generated</p>
          <p>✓ Bloom&apos;s evaluation complete</p>
        </div>
        <p className="mt-6 text-xs text-white/50">
          Your detailed results will be available on the evaluation page.
        </p>
      </div>
    </SlideShell>
  );
}

// ─── slideType 17 — Quiz / Timer Question ────────────────────────────────────
function QuizTimerSlide({ step }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const sec = step.breakout?.slideDurationSec || 60;
    return sec;
  });
  const [started, setStarted] = useState(false);

  React.useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft]);

  const pct = step.breakout?.slideDurationSec
    ? Math.max(0, (timeLeft / step.breakout.slideDurationSec) * 100)
    : 0;

  return (
    <SlideShell>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full h-full flex flex-col justify-between">
        <div>
          <div className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
            Timed Question
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">{step.title}</h2>
          {step.subtitle && <p className="text-gray-600 text-sm">{step.subtitle}</p>}
        </div>
        <div className="text-center">
          <div className="text-6xl font-black text-gray-900 tabular-nums mb-4">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div
              className="h-2 rounded-full bg-orange-500 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          {!started ? (
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Start Timer
            </button>
          ) : timeLeft === 0 ? (
            <p className="text-green-600 font-bold">Time&apos;s up!</p>
          ) : (
            <p className="text-gray-400 text-sm">Timer running…</p>
          )}
        </div>
      </div>
    </SlideShell>
  );
}

// ─── slideType 18 — Quiz Question (MCQ) ──────────────────────────────────────
function QuizQuestionSlide({ step }) {
  const b = step.breakout ?? {};
  const answers = b.answers || step.answers || [];
  const correctIndex = b.correctAnswerIndex ?? step.correctAnswerIndex;
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <SlideShell>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full h-full flex flex-col">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
          Quiz
        </div>
        <h2 className="text-lg font-black text-gray-900 mb-6 leading-snug">
          {step.title || b.question}
        </h2>
        <div className="space-y-3 flex-1">
          {answers.map((ans, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = i === selected;
            let cls = "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50";
            if (revealed) {
              if (isCorrect) cls = "border-green-400 bg-green-50";
              else if (isSelected) cls = "border-red-400 bg-red-50";
            } else if (isSelected) {
              cls = "border-blue-500 bg-blue-50";
            }
            return (
              <button
                key={i}
                onClick={() => !revealed && setSelected(i)}
                className={`w-full text-left px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${cls}`}
              >
                <span className="font-bold text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                {ans}
                {revealed && isCorrect && <span className="ml-2 text-green-600">✓</span>}
                {revealed && isSelected && !isCorrect && <span className="ml-2 text-red-500">✗</span>}
              </button>
            );
          })}
        </div>
        {selected !== null && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="mt-4 self-center px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            Submit Answer
          </button>
        )}
        {revealed && b.explanation && (
          <div className="mt-4 bg-blue-50 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
            <span className="font-bold">Explanation: </span>{b.explanation}
          </div>
        )}
      </div>
    </SlideShell>
  );
}

// ─── slideType 19 — Learning Objectives (variant) ────────────────────────────
function LearningObjectivesSlide({ step }) {
  const b = step.breakout ?? {};
  const objectives = b.loBullets || b.slideLearningObjectives || [];
  return (
    <SlideShell>
      <div className="bg-[#002147] rounded-2xl shadow-lg p-10 w-full h-full flex flex-col justify-center text-white">
        <p className="text-[#E87722] text-xs font-bold uppercase tracking-widest mb-3">
          {b.loHeading || "Learning Objectives"}
        </p>
        <h1 className="text-2xl font-black mb-2">{step.title}</h1>
        {b.loIntro && (
          <p className="text-white/70 text-sm mb-6">{b.loIntro}</p>
        )}
        {objectives.length > 0 && (
          <ul className="space-y-3 mt-2">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-[#E87722] text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-white/90 leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SlideShell>
  );
}

// ─── Fallback — unknown slideType ────────────────────────────────────────────
function FallbackSlide({ step }) {
  const b = step.breakout ?? {};
  if (b.slideImageURL) {
    return <StandardContentSlide step={step} />;
  }
  return (
    <SlideShell>
      <div className="bg-[#FFCA00] rounded-2xl shadow-lg p-10 text-center w-full h-full flex flex-col justify-center">
        <h1 className="text-3xl font-black leading-tight mb-4">{step.title}</h1>
        {step.subtitle && <p className="text-md font-medium mb-4">{step.subtitle}</p>}
        {step.duration && <p className="text-sm text-gray-700">Duration: {step.duration}</p>}
        <div className="mt-4 text-3xl">🎓</div>
      </div>
    </SlideShell>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Slide({
  step,
  participants = [],
  experienceTitle = "",
  onRatingSubmit,
  allSteps = [],
  currentStepIndex = 0,
}) {
  if (!step) return null;

  // Resolve slideType — prefer the breakout data field, fall back to legacy title matching
  const slideType = step.breakout?.slideType ?? step.slideType ?? null;

  // Dispatch on slideType number (all 12 confirmed blueprint types)
  switch (slideType) {
    case 0:
      return <WaitingRoomSlide participants={participants} experienceTitle={experienceTitle} />;
    case 1:
      return <StandardContentSlide step={step} />;
    case 2:
      return <ContentWithQuestionsSlide step={step} />;
    case 4:
      return <PollSlide step={step} />;
    case 6:
      return <DiscussionSlide step={step} />;
    case 7:
      return <GradingSlide step={step} />;
    case 8:
      return <AgendaSlide step={step} allSteps={allSteps} currentStepIndex={currentStepIndex} />;
    case 11:
      return <ProcessingSlide onRatingSubmit={onRatingSubmit} />;
    case 12:
      return <EndOfSessionSlide experienceTitle={experienceTitle} />;
    case 17:
      return <QuizTimerSlide step={step} />;
    case 18:
      return <QuizQuestionSlide step={step} />;
    case 19:
      return <LearningObjectivesSlide step={step} />;
    default:
      // Legacy title-based fallback (handles manually created experiences without a slideType)
      break;
  }

  // ── Legacy fallbacks (title-based) ─────────────────────────────────────────
  const title = (step.title || "").toLowerCase();

  if (step.isWaitingRoom || title === "waiting room")
    return <WaitingRoomSlide participants={participants} experienceTitle={experienceTitle} />;

  if (step.isProcessing || title.includes("session processing") || title.includes("processing"))
    return <ProcessingSlide onRatingSubmit={onRatingSubmit} />;

  if (title.includes("ai-generated results") || title.includes("ai summary"))
    return <EndOfSessionSlide experienceTitle={experienceTitle} />;

  if (title.includes("learning objectives"))
    return <LearningObjectivesSlide step={step} />;

  if (title.includes("discussion"))
    return <DiscussionSlide step={step} />;

  if (title.includes("agenda"))
    return <AgendaSlide step={step} allSteps={allSteps} currentStepIndex={currentStepIndex} />;

  if (title.includes("grading") || title.includes("scoring"))
    return <GradingSlide step={step} />;

  return <FallbackSlide step={step} />;
}
