/**
 * Groq API Endpoint Test Suite (Node.js — works on Windows, Mac, Linux)
 *
 * Usage:
 *   node scripts/test-groq-endpoints.mjs
 *
 * Make sure your Next.js dev server is running: npm run dev
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let pass = 0;
let fail = 0;
let skip = 0;

function header(title) {
  console.log("");
  console.log("━".repeat(68));
  console.log(`  ${title}`);
  console.log("━".repeat(68));
}

function ok(msg) {
  console.log(`  ✅ PASS — ${msg}`);
  pass++;
}

function bad(msg, detail) {
  console.log(`  ❌ FAIL — ${msg}`);
  if (detail) console.log(`     ${String(detail).slice(0, 300)}`);
  fail++;
}

function skipped(msg) {
  console.log(`  ⏭️  SKIP — ${msg}`);
  skip++;
}

// ─── Test 1: Health Check ──────────────────────────────────────────────────
async function testHealth() {
  header("Test 1: Health Check (GET /api/test-groq)");
  try {
    const res = await fetch(`${BASE_URL}/api/test-groq`);
    const data = await res.json();
    if (data.ok) {
      ok(`Groq connected — model: ${data.llmTest?.model}, reply: "${data.llmTest?.reply}"`);
    } else {
      bad("Health check returned ok=false", data.llmTest?.error || data.error);
    }
  } catch (e) {
    bad("Could not reach server", e.message);
  }
}

// ─── Test 2: Quick Summary ─────────────────────────────────────────────────
async function testSummarizeQuick() {
  header("Test 2: Quick Summary (POST /api/groq/summarize — type: quick)");
  try {
    const res = await fetch(`${BASE_URL}/api/groq/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "quick",
        transcript:
          "Alice: I think the key issue with the Uber case is their burn rate. They were spending millions on driver subsidies. Bob: Right, but that was intentional. They needed market share first. Alice: True, but at what cost? The unit economics never made sense until they hit scale.",
        meetingTitle: "Uber Case Study Discussion",
      }),
    });
    const data = await res.json();
    if (res.ok && data.summary) {
      ok("Quick summary generated");
      console.log(`     "${data.summary.slice(0, 180)}..."`);
    } else {
      bad(`HTTP ${res.status}`, data.error || JSON.stringify(data));
    }
  } catch (e) {
    bad("Request failed", e.message);
  }
}

// ─── Test 3: Full Summary ──────────────────────────────────────────────────
async function testSummarizeFull() {
  header("Test 3: Full Summary — Participant + Coach + Admin (POST /api/groq/summarize — type: full)");
  try {
    const res = await fetch(`${BASE_URL}/api/groq/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "full",
        transcript:
          "Alice: Looking at the Airbnb case, I think the pivot from air mattresses to full apartments was genius. Bob: Absolutely. And the trust factor was crucial. Carol: I want to add that their photography program was an underrated growth hack. Alice: Great point Carol. That is a supply-side improvement that directly impacted demand.",
        meetingData: {
          experienceTitle: "Airbnb: Disrupting Hospitality",
          experienceDescription: "Analyze Airbnb growth strategy and platform dynamics",
          duration: "25 mins",
          userId: "test-user-1",
          userName: "Alice",
          participants: [
            { id: "1", name: "Alice" },
            { id: "2", name: "Bob" },
            { id: "3", name: "Carol" },
          ],
          agenda: [
            { title: "Case Overview", duration: "5 mins" },
            { title: "Growth Strategy Discussion", duration: "10 mins" },
            { title: "Regulatory Challenges", duration: "10 mins" },
          ],
        },
      }),
    });
    const data = await res.json();
    if (res.ok && data.participantSummary && data.coachSummary && data.adminSummary) {
      ok("Full summary generated with all 3 role-based views");
      console.log(`     Participant engagement: ${data.participantSummary.engagementLevel || "N/A"}`);
      console.log(`     Coach objectives met: ${data.coachSummary.sessionObjectivesMet}`);
      console.log(`     Admin total participants: ${data.adminSummary.sessionMetrics?.totalParticipants || "N/A"}`);
    } else {
      bad(`HTTP ${res.status}`, data.error || JSON.stringify(data).slice(0, 300));
    }
  } catch (e) {
    bad("Request failed", e.message);
  }
}

// ─── Test 4: Bloom's Taxonomy Evaluation ───────────────────────────────────
async function testEvaluate() {
  header("Test 4: Bloom's Taxonomy Evaluation (POST /api/groq/evaluate)");
  try {
    const res = await fetch(`${BASE_URL}/api/groq/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript:
          "Alice: The burn rate at Uber was unsustainable. They spent 2 billion on driver subsidies in 2015 alone. If we apply the same model to food delivery, I think you would see worse unit economics because food has thinner margins. I would suggest a hybrid approach — start with subsidies in key markets but simultaneously build proprietary technology like route optimization that creates lasting competitive advantages.",
        rubrics: [
          { id: 1, rubric: "Market Analysis", rubricPrompt: "Evaluate the student's ability to analyze market dynamics and competitive forces." },
          { id: 2, rubric: "Strategic Thinking", rubricPrompt: "Evaluate the student's ability to propose and evaluate strategic alternatives." },
          { id: 3, rubric: "Financial Literacy", rubricPrompt: "Evaluate the student's understanding of burn rate, unit economics, and margins." },
        ],
        experience: {
          name: "Uber: Growth at All Costs",
          keyConcepts: ["burn rate", "network effects", "unit economics", "competitive moat"],
          learningObjectives: [
            "Analyze trade-offs of growth-at-all-costs strategies",
            "Evaluate sustainable competitive advantages in platform businesses",
          ],
        },
        userId: "test-user-alice",
        userName: "Alice",
      }),
    });
    const data = await res.json();
    if (res.ok && data.rubricResults && data.overallBloomsScore !== undefined) {
      ok(`Bloom's evaluation completed — overall: ${data.overallBloomsScore}/6 (${data.engagementLevel} engagement)`);
      for (const r of data.rubricResults) {
        console.log(`     ${r.rubric}: ${r.score}/6 (${r.scoreLabel})`);
      }
    } else {
      bad(`HTTP ${res.status}`, data.error || JSON.stringify(data).slice(0, 300));
    }
  } catch (e) {
    bad("Request failed", e.message);
  }
}

// ─── Test 5: Quiz Explanation ──────────────────────────────────────────────
async function testExplain() {
  header("Test 5: Quiz Explanation (POST /api/groq/explain)");
  try {
    const res = await fetch(`${BASE_URL}/api/groq/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: "What is the primary reason Uber subsidized driver earnings in early markets?",
        correctAnswer: "To solve the chicken-and-egg problem of needing both drivers and riders on the platform",
        wrongAnswers: [
          "To comply with local labor regulations",
          "To avoid paying taxes on driver income",
          "To reduce insurance costs per ride",
        ],
        experienceName: "Uber: Growth at All Costs",
      }),
    });
    const data = await res.json();
    if (res.ok && data.explanation) {
      ok("Quiz explanation generated");
      console.log(`     "${data.explanation.slice(0, 200)}"`);
    } else {
      bad(`HTTP ${res.status}`, data.error || JSON.stringify(data));
    }
  } catch (e) {
    bad("Request failed", e.message);
  }
}

// ─── Test 6: Insight Tags ─────────────────────────────────────────────────
async function testInsights() {
  header("Test 6: Conversation Insight Tags (POST /api/groq/insights)");
  try {
    const res = await fetch(`${BASE_URL}/api/groq/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupTranscript:
          "Alice: The burn rate is the biggest red flag. Two billion in subsidies is not sustainable. Bob: But the network effect justifies it. Once you hit critical mass drivers stay without subsidies. Carol: What about the regulatory risk though? Cities are banning ride-sharing. Alice: And the autonomous driving bet is still years away. Bob: I think the real moat is data. They can optimize routes better than competitors. Carol: Data alone is not defensible if someone replicates the platform.",
        keyConcepts: ["burn rate", "network effects", "regulatory risk", "autonomous driving", "data moat", "switching costs"],
      }),
    });
    const data = await res.json();
    if (res.ok && data.tags) {
      ok(`Insight tags generated (${data.tags.length} tags)`);
      for (const t of data.tags.slice(0, 5)) {
        console.log(`     [${t.insightType}] ${t.label} (relevance: ${t.relevanceScore})`);
      }
      if (data.tags.length > 5) console.log(`     ... and ${data.tags.length - 5} more`);
    } else {
      bad(`HTTP ${res.status}`, data.error || JSON.stringify(data));
    }
  } catch (e) {
    bad("Request failed", e.message);
  }
}

// ─── Runner ────────────────────────────────────────────────────────────────
console.log("");
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║      WANAC Fireteam — Groq API Endpoint Test Suite             ║");
console.log(`║      Target: ${BASE_URL}                            ║`);
console.log("╚══════════════════════════════════════════════════════════════════╝");

try {
  await fetch(`${BASE_URL}/api/test-groq`, { signal: AbortSignal.timeout(3000) });
} catch {
  console.log("");
  console.log(`  ⚠️  Cannot reach ${BASE_URL}`);
  console.log("  Make sure your Next.js dev server is running: npm run dev");
  process.exit(1);
}

await testHealth();
await testSummarizeQuick();
await testSummarizeFull();
await testEvaluate();
await testExplain();
await testInsights();

header("RESULTS");
console.log(`  ✅ Passed: ${pass}  |  ❌ Failed: ${fail}  |  ⏭️  Skipped: ${skip}`);
console.log("");
if (fail > 0) {
  console.log("  Some tests failed. Check your GROQ_API_KEY in .env.local and server logs.");
  process.exit(1);
} else {
  console.log("  All tests passed! Groq integration is working.");
}
console.log("");
