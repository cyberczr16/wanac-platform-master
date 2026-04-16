#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Groq API Endpoint Test Suite
# Tests all 5 Groq endpoints + health check for the WANAC Fireteam platform
#
# Prerequisites:
#   1. Next.js dev server running: npm run dev
#   2. GROQ_API_KEY set in .env.local
#
# Usage:
#   chmod +x scripts/test-groq-endpoints.sh
#   ./scripts/test-groq-endpoints.sh
#
#   # Or test individual endpoints:
#   ./scripts/test-groq-endpoints.sh health
#   ./scripts/test-groq-endpoints.sh summarize-quick
#   ./scripts/test-groq-endpoints.sh summarize-full
#   ./scripts/test-groq-endpoints.sh evaluate
#   ./scripts/test-groq-endpoints.sh explain
#   ./scripts/test-groq-endpoints.sh insights
#   ./scripts/test-groq-endpoints.sh transcribe   # requires a .webm/.wav file
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
PASS=0
FAIL=0
SKIP=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

header() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

pass() {
  echo -e "  ${GREEN}✅ PASS${NC} — $1"
  ((PASS++))
}

fail() {
  echo -e "  ${RED}❌ FAIL${NC} — $1"
  echo -e "  ${RED}   Response: $2${NC}"
  ((FAIL++))
}

skip() {
  echo -e "  ${YELLOW}⏭️  SKIP${NC} — $1"
  ((SKIP++))
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 1: Health Check — GET /api/test-groq
# ─────────────────────────────────────────────────────────────────────────────
test_health() {
  header "Test 1: Health Check (GET /api/test-groq)"

  RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/test-groq")
  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    # Check for "ok": true in the response
    if echo "$BODY" | grep -q '"ok":true'; then
      pass "Groq API connected — $(echo "$BODY" | grep -o '"message":"[^"]*"' | head -1)"
      echo "  Prefix: $(echo "$BODY" | grep -o '"apiKeyPrefix":"[^"]*"')"
      echo "  LLM reply: $(echo "$BODY" | grep -o '"reply":"[^"]*"')"
    else
      fail "Health check returned 200 but ok=false" "$BODY"
    fi
  else
    fail "Health check returned HTTP $HTTP_CODE" "$BODY"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 2: Quick Summary — POST /api/groq/summarize (type: quick)
# ─────────────────────────────────────────────────────────────────────────────
test_summarize_quick() {
  header "Test 2: Quick Summary (POST /api/groq/summarize?type=quick)"

  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/api/groq/summarize" \
    -H "Content-Type: application/json" \
    -d '{
      "type": "quick",
      "transcript": "Alice: I think the key issue with the Uber case is their burn rate. They were spending millions on driver subsidies. Bob: Right, but that was intentional. They needed market share first. Alice: True, but at what cost? The unit economics never made sense until they hit scale. Bob: And even now their margins are thin. The real question is whether the network effect justifies the initial losses. Alice: I agree. It is a classic chicken-and-egg problem. You need riders to attract drivers and drivers to attract riders.",
      "meetingTitle": "Uber Case Study Discussion"
    }')

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    if echo "$BODY" | grep -q '"summary"'; then
      pass "Quick summary generated"
      echo "  Summary: $(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('summary','')[:150])" 2>/dev/null || echo "$BODY" | head -c 200)..."
    else
      fail "Response missing 'summary' field" "$BODY"
    fi
  else
    fail "Quick summary returned HTTP $HTTP_CODE" "$BODY"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 3: Full Summary — POST /api/groq/summarize (type: full)
# ─────────────────────────────────────────────────────────────────────────────
test_summarize_full() {
  header "Test 3: Full Summary — Participant + Coach + Admin (POST /api/groq/summarize?type=full)"

  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/api/groq/summarize" \
    -H "Content-Type: application/json" \
    -d '{
      "type": "full",
      "transcript": "Alice: Looking at the Airbnb case, I think the pivot from air mattresses to full apartments was genius. The insight was that travelers wanted authentic local experiences, not just cheap lodging. Bob: Absolutely. And the trust factor was crucial. Their review system and host verification solved the stranger-danger problem. Carol: I want to add that their photography program was an underrated growth hack. Professional photos of listings increased bookings by 2-3x. Alice: Great point Carol. That is a supply-side improvement that directly impacted demand. Bob: The regulatory challenges are interesting too. How do you handle city-by-city legal battles while scaling globally? Carol: They essentially created a new category between hotels and homestays. The regulations had not caught up yet.",
      "meetingData": {
        "experienceTitle": "Airbnb: Disrupting Hospitality",
        "experienceDescription": "Analyze Airbnb growth strategy and platform dynamics",
        "duration": "25 mins",
        "userId": "test-user-1",
        "userName": "Alice",
        "participants": [
          { "id": "1", "name": "Alice" },
          { "id": "2", "name": "Bob" },
          { "id": "3", "name": "Carol" }
        ],
        "agenda": [
          { "title": "Case Overview", "duration": "5 mins" },
          { "title": "Growth Strategy Discussion", "duration": "10 mins" },
          { "title": "Regulatory Challenges", "duration": "10 mins" }
        ]
      }
    }')

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    HAS_PARTICIPANT=$(echo "$BODY" | grep -c '"participantSummary"' || true)
    HAS_COACH=$(echo "$BODY" | grep -c '"coachSummary"' || true)
    HAS_ADMIN=$(echo "$BODY" | grep -c '"adminSummary"' || true)

    if [ "$HAS_PARTICIPANT" -gt 0 ] && [ "$HAS_COACH" -gt 0 ] && [ "$HAS_ADMIN" -gt 0 ]; then
      pass "Full summary generated with all 3 role-based views"
      echo "  Contains: participantSummary ✓  coachSummary ✓  adminSummary ✓"
      # Show engagement level if present
      echo "  Engagement: $(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('participantSummary',{}).get('engagementLevel','N/A'))" 2>/dev/null || echo "N/A")"
    else
      fail "Response missing one or more summary sections" "participant=$HAS_PARTICIPANT coach=$HAS_COACH admin=$HAS_ADMIN"
    fi
  else
    fail "Full summary returned HTTP $HTTP_CODE" "$BODY"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 4: Bloom's Taxonomy Evaluation — POST /api/groq/evaluate
# ─────────────────────────────────────────────────────────────────────────────
test_evaluate() {
  header "Test 4: Bloom's Taxonomy Evaluation (POST /api/groq/evaluate)"

  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/api/groq/evaluate" \
    -H "Content-Type: application/json" \
    -d '{
      "transcript": "Alice: The burn rate at Uber was unsustainable. They spent 2 billion dollars on driver subsidies in 2015 alone. If we apply the same growth-at-all-costs model to a different market like food delivery, I think you would see similar dynamics but potentially worse unit economics because food has thinner margins. Bob: That is a good analysis. What would you propose as an alternative strategy? Alice: I would suggest a hybrid approach. Start with subsidies in key markets to establish network effects, but simultaneously build proprietary technology like route optimization that creates lasting competitive advantages beyond just price. That way when you pull back subsidies the technology moat keeps customers.",
      "rubrics": [
        {
          "id": 1,
          "rubric": "Market Analysis",
          "rubricPrompt": "Evaluate the students ability to analyze market dynamics, competitive forces, and industry structure."
        },
        {
          "id": 2,
          "rubric": "Strategic Thinking",
          "rubricPrompt": "Evaluate the students ability to propose and evaluate strategic alternatives with supporting reasoning."
        },
        {
          "id": 3,
          "rubric": "Financial Literacy",
          "rubricPrompt": "Evaluate the students understanding of financial concepts like burn rate, unit economics, and margins."
        }
      ],
      "experience": {
        "name": "Uber: Growth at All Costs",
        "keyConcepts": ["burn rate", "network effects", "unit economics", "competitive moat", "market subsidies"],
        "learningObjectives": [
          "Analyze the trade-offs of growth-at-all-costs strategies",
          "Evaluate sustainable competitive advantages in platform businesses",
          "Apply financial analysis to real-world business decisions"
        ]
      },
      "userId": "test-user-alice",
      "userName": "Alice"
    }')

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    HAS_RESULTS=$(echo "$BODY" | grep -c '"rubricResults"' || true)
    HAS_SCORE=$(echo "$BODY" | grep -c '"overallBloomsScore"' || true)

    if [ "$HAS_RESULTS" -gt 0 ] && [ "$HAS_SCORE" -gt 0 ]; then
      pass "Bloom's evaluation completed"
      echo "  Overall Score: $(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d['overallBloomsScore']}/6 ({d['engagementLevel']} engagement)\")" 2>/dev/null || echo "see response")"
      echo "  Rubric scores: $(echo "$BODY" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for r in d.get('rubricResults',[]):
    print(f\"    {r['rubric']}: {r['score']}/6 ({r['scoreLabel']})\")
" 2>/dev/null || echo "see response")"
    else
      fail "Response missing rubricResults or overallBloomsScore" "$BODY"
    fi
  else
    fail "Evaluation returned HTTP $HTTP_CODE" "$BODY"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 5: Quiz Explanation — POST /api/groq/explain
# ─────────────────────────────────────────────────────────────────────────────
test_explain() {
  header "Test 5: Quiz Explanation (POST /api/groq/explain)"

  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/api/groq/explain" \
    -H "Content-Type: application/json" \
    -d '{
      "questionText": "What is the primary reason Uber subsidized driver earnings in early markets?",
      "correctAnswer": "To solve the chicken-and-egg problem of needing both drivers and riders on the platform",
      "wrongAnswers": [
        "To comply with local labor regulations",
        "To avoid paying taxes on driver income",
        "To reduce insurance costs per ride"
      ],
      "experienceName": "Uber: Growth at All Costs"
    }')

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    if echo "$BODY" | grep -q '"explanation"'; then
      pass "Quiz explanation generated"
      echo "  Explanation: $(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('explanation','')[:200])" 2>/dev/null || echo "$BODY" | head -c 200)"
    else
      fail "Response missing 'explanation' field" "$BODY"
    fi
  else
    fail "Explain returned HTTP $HTTP_CODE" "$BODY"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 6: Insight Tags — POST /api/groq/insights
# ─────────────────────────────────────────────────────────────────────────────
test_insights() {
  header "Test 6: Conversation Insight Tags (POST /api/groq/insights)"

  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/api/groq/insights" \
    -H "Content-Type: application/json" \
    -d '{
      "groupTranscript": "Alice: The burn rate is the biggest red flag. Two billion in subsidies is not sustainable. Bob: But the network effect justifies it. Once you hit critical mass drivers stay without subsidies. Carol: What about the regulatory risk though? Cities are banning ride-sharing left and right. Alice: True. And the autonomous driving bet is still years away. Bob: I think the real moat is data. Uber has more trip data than anyone. They can optimize routes and pricing better than competitors. Carol: Good point but data alone is not defensible if someone replicates the platform. Alice: Exactly. The switching costs for both riders and drivers are basically zero. Bob: Unless they build a super-app ecosystem like Grab did in Southeast Asia.",
      "keyConcepts": ["burn rate", "network effects", "regulatory risk", "autonomous driving", "data moat", "switching costs", "platform economics"]
    }')

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    if echo "$BODY" | grep -q '"tags"'; then
      TAG_COUNT=$(echo "$BODY" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('tags',[])))" 2>/dev/null || echo "?")
      pass "Insight tags generated ($TAG_COUNT tags)"
      echo "  Tags: $(echo "$BODY" | python3 -c "
import sys,json
tags = json.load(sys.stdin).get('tags',[])
for t in tags[:5]:
    print(f\"    [{t.get('insightType','?')}] {t.get('label','?')} (relevance: {t.get('relevanceScore','?')})\")
if len(tags) > 5: print(f'    ... and {len(tags)-5} more')
" 2>/dev/null || echo "see response")"
    else
      fail "Response missing 'tags' field" "$BODY"
    fi
  else
    fail "Insights returned HTTP $HTTP_CODE" "$BODY"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# TEST 7: Transcription — POST /api/groq/transcribe (requires audio file)
# ─────────────────────────────────────────────────────────────────────────────
test_transcribe() {
  header "Test 7: Audio Transcription (POST /api/groq/transcribe)"

  # Check if a test audio file exists
  AUDIO_FILE="${1:-}"

  if [ -z "$AUDIO_FILE" ]; then
    # Try common locations
    for f in test-audio.webm test-audio.wav test-audio.mp3 scripts/test-audio.webm; do
      if [ -f "$f" ]; then
        AUDIO_FILE="$f"
        break
      fi
    done
  fi

  if [ -z "$AUDIO_FILE" ] || [ ! -f "$AUDIO_FILE" ]; then
    skip "No audio file found. To test transcription, run:"
    echo "    ./scripts/test-groq-endpoints.sh transcribe path/to/audio.webm"
    echo ""
    echo "  Tip: Record a short clip from your browser or use ffmpeg to create one:"
    echo "    ffmpeg -f lavfi -i sine=frequency=440:duration=5 -ac 1 test-audio.wav"
    echo "    # Then record yourself speaking over it, or just test with silence"
    return
  fi

  FILE_SIZE=$(du -h "$AUDIO_FILE" | cut -f1)
  echo "  Using audio file: $AUDIO_FILE ($FILE_SIZE)"

  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/api/groq/transcribe" \
    -F "file=@$AUDIO_FILE" \
    -F "language=en" \
    -F "timestamps=true")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    if echo "$BODY" | grep -q '"text"'; then
      pass "Audio transcribed successfully"
      echo "  Transcript: $(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('text','')[:200])" 2>/dev/null || echo "$BODY" | head -c 200)"
    else
      fail "Response missing 'text' field" "$BODY"
    fi
  else
    fail "Transcribe returned HTTP $HTTP_CODE" "$BODY"
  fi
}


# ─────────────────────────────────────────────────────────────────────────────
# RUNNER
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║          WANAC Fireteam — Groq API Endpoint Test Suite             ║${NC}"
echo -e "${CYAN}║          Target: $BASE_URL                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════╝${NC}"

# Check if server is reachable
if ! curl -s --max-time 3 "$BASE_URL" > /dev/null 2>&1; then
  echo ""
  echo -e "${RED}  ⚠️  Cannot reach $BASE_URL${NC}"
  echo -e "${RED}  Make sure your Next.js dev server is running: npm run dev${NC}"
  echo ""
  exit 1
fi

# Run specific test or all tests
case "${1:-all}" in
  health)           test_health ;;
  summarize-quick)  test_summarize_quick ;;
  summarize-full)   test_summarize_full ;;
  evaluate)         test_evaluate ;;
  explain)          test_explain ;;
  insights)         test_insights ;;
  transcribe)       test_transcribe "${2:-}" ;;
  all)
    test_health
    test_summarize_quick
    test_summarize_full
    test_evaluate
    test_explain
    test_insights
    test_transcribe
    ;;
  *)
    echo "Unknown test: $1"
    echo "Usage: $0 [health|summarize-quick|summarize-full|evaluate|explain|insights|transcribe [audio-file]|all]"
    exit 1
    ;;
esac

# ─── Summary ──────────────────────────────────────────────────────────────────
header "RESULTS"
echo -e "  ${GREEN}Passed: $PASS${NC}  |  ${RED}Failed: $FAIL${NC}  |  ${YELLOW}Skipped: $SKIP${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}  Some tests failed. Check your GROQ_API_KEY in .env.local and the server logs.${NC}"
  exit 1
else
  echo -e "${GREEN}  All tests passed! Groq integration is working.${NC}"
fi
echo ""
