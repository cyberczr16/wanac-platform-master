#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
#  Fireteam Laravel AI Backend — Setup Script
#  Run this ONCE on your server or local machine to scaffold the
#  full Laravel project and drop in the AI service files.
#
#  Requirements:
#    - PHP 8.2+  (php --version)
#    - Composer  (composer --version)
#    - PostgreSQL running with a 'fireteam' database
#
#  Usage:
#    chmod +x setup.sh
#    ./setup.sh
# ═══════════════════════════════════════════════════════════════════

set -e   # Stop on any error

PROJECT="fireteam-backend"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   Fireteam Laravel AI Backend Setup        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ── 1. Create fresh Laravel project ─────────────────────────────────
echo "▶ Creating Laravel project: $PROJECT"
composer create-project laravel/laravel "$PROJECT" --prefer-dist --quiet
cd "$PROJECT"
echo "  ✅ Laravel project created"

# ── 2. Install required packages ────────────────────────────────────
echo "▶ Installing packages..."
composer require laravel/sanctum --quiet        # API authentication
echo "  ✅ Packages installed"

# ── 3. Copy AI service files ─────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "▶ Copying Groq AI service files..."

# Services
cp "$SCRIPT_DIR/app/Services/GroqWhisperService.php"    app/Services/
cp "$SCRIPT_DIR/app/Services/GroqEvaluationService.php" app/Services/
cp "$SCRIPT_DIR/app/Services/GroqSummaryService.php"    app/Services/

# Jobs
cp "$SCRIPT_DIR/app/Jobs/TranscribeAudioJob.php"  app/Jobs/
cp "$SCRIPT_DIR/app/Jobs/EvaluateSessionJob.php"  app/Jobs/

# Controller
cp "$SCRIPT_DIR/app/Http/Controllers/TranscriptionController.php" \
   app/Http/Controllers/

# Exception
cp "$SCRIPT_DIR/app/Exceptions/GroqApiException.php" app/Exceptions/

# Config
cp "$SCRIPT_DIR/config/groq.php" config/
cp "$SCRIPT_DIR/config/cors.php" config/

# Migration
cp "$SCRIPT_DIR/database/migrations/2026_04_03_create_ai_tables.php" \
   database/migrations/

# Routes
cp "$SCRIPT_DIR/routes/api_ai.php" routes/
cp "$SCRIPT_DIR/routes/api.php"    routes/

echo "  ✅ All AI files copied"

# ── 4. Set up environment ────────────────────────────────────────────
echo "▶ Configuring .env..."
cp "$SCRIPT_DIR/.env.example" .env

# Generate app key
php artisan key:generate --quiet
echo "  ✅ App key generated"

echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  NEXT STEPS — complete these manually:                      │"
echo "│                                                             │"
echo "│  1. Edit .env — fill in your database + Groq API key:      │"
echo "│     DB_DATABASE, DB_USERNAME, DB_PASSWORD                   │"
echo "│     GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx                   │"
echo "│     FRONTEND_URL=https://your-nextjs-domain.com            │"
echo "│                                                             │"
echo "│  2. Run database migration:                                 │"
echo "│     php artisan migrate                                     │"
echo "│                                                             │"
echo "│  3. Set up queue table (if using database driver):          │"
echo "│     php artisan queue:table && php artisan migrate          │"
echo "│                                                             │"
echo "│  4. Start the API server:                                   │"
echo "│     php artisan serve                                       │"
echo "│     → runs at http://localhost:8000                         │"
echo "│                                                             │"
echo "│  5. Start the AI queue worker (separate terminal):          │"
echo "│     php artisan queue:work --queue=ai,default               │"
echo "│                                                             │"
echo "│  6. Test the connection:                                    │"
echo "│     curl http://localhost:8000/api/health                   │"
echo "│                                                             │"
echo "│  7. Update NEXT_PUBLIC_LARAVEL_API_URL in your Next.js      │"
echo "│     .env.local to point to this server.                     │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""
echo "✅ Setup complete! Project is in: $(pwd)"
echo ""
