# FortuneMatch AI - API Documentation

## Overview
FortuneMatch AI provides intelligent job matching for veterans transitioning to civilian careers, with military-to-civilian skill translation and personalized job alerts.

## API Endpoints

### 1. Job Matches
**Base URL:** `/api/career-compass/fortunematch`

#### GET - Retrieve AI-Matched Jobs
Fetch AI-matched job opportunities with filtering and pagination support.

**Query Parameters:**
- `minScore` (number, default: 0) - Minimum fit score (0-100)
- `location` (string) - Filter by location (partial match, case-insensitive)
- `roleType` (string) - Filter by job title or role type
- `page` (number, default: 1) - Pagination page number
- `limit` (number, default: 10) - Results per page

**Example Request:**
```
GET /api/career-compass/fortunematch?minScore=87&location=Austin&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_title": "Infrastructure Engineer",
      "company": "TechCorp Solutions",
      "location": "Austin, TX",
      "salary_range": "$95,000 - $125,000",
      "job_type": "Full-time",
      "fit_score": 92,
      "match_reasons": ["Military logistics background", "Infrastructure management"],
      "skill_translations": [
        {
          "military_skill": "Logistics Management",
          "civilian_equivalent": "Project Management"
        }
      ],
      "recommended_actions": ["Highlight supply chain optimization experience"],
      "posted_date": "2025-03-28",
      "description": "Seeking experienced infrastructure professional..."
    }
  ],
  "meta": {
    "total": 6,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 2. Skill Translations
**Base URL:** `/api/career-compass/fortunematch/skill-translation`

#### GET - Retrieve Military-to-Civilian Skill Mappings
Fetch pre-mapped or custom skill translations.

**Query Parameters:**
- `category` (string, optional) - Filter by category (e.g., "Operations", "Leadership", "Technology")

**Example Request:**
```
GET /api/career-compass/fortunematch/skill-translation?category=Operations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "military_skill": "Supply Chain Management",
      "civilian_equivalent": "Logistics & Operations Management",
      "confidence": 0.95,
      "related_roles": ["Operations Manager", "Supply Chain Analyst", "Logistics Coordinator"],
      "category": "Operations"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

#### POST - Add Custom Skill Translation
Create a new military-to-civilian skill translation.

**Request Body:**
```json
{
  "military_skill": "Your Military Skill",
  "civilian_equivalent": "Civilian Equivalent",
  "confidence": 0.85,
  "related_roles": ["Role 1", "Role 2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "military_skill": "Your Military Skill",
    "civilian_equivalent": "Civilian Equivalent",
    "confidence": 0.85,
    "related_roles": ["Role 1", "Role 2"],
    "category": "Custom"
  },
  "message": "Skill translation added successfully"
}
```

#### PUT - Update Skill Translation
Modify an existing skill translation.

**Request Body:**
```json
{
  "id": 1,
  "military_skill": "Updated Military Skill",
  "civilian_equivalent": "Updated Equivalent",
  "confidence": 0.90,
  "related_roles": ["Updated Role 1"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "military_skill": "Updated Military Skill",
    "civilian_equivalent": "Updated Equivalent",
    "confidence": 0.90,
    "related_roles": ["Updated Role 1"],
    "category": "Operations"
  },
  "message": "Skill translation updated successfully"
}
```

---

### 3. High-Match Alerts
**Base URL:** `/api/career-compass/fortunematch/alerts`

#### GET - Retrieve Match Alerts
Fetch high-fit job match notifications (87%+ fit score).

**Query Parameters:**
- `includeRead` (boolean, default: false) - Include already-read alerts

**Example Request:**
```
GET /api/career-compass/fortunematch/alerts
GET /api/career-compass/fortunematch/alerts?includeRead=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_title": "Infrastructure Engineer",
      "company": "TechCorp Solutions",
      "fit_score": 92,
      "created_at": "2025-04-02T10:30:00Z",
      "read": false,
      "dismissed": false,
      "match_reasons": ["Military logistics background", "Infrastructure management"]
    }
  ],
  "meta": {
    "total": 4,
    "unread": 2
  }
}
```

#### PUT - Update Alert Status
Mark alerts as read or dismissed.

**Request Body:**
```json
{
  "id": 1,
  "read": true,
  "dismissed": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "job_title": "Infrastructure Engineer",
    "company": "TechCorp Solutions",
    "fit_score": 92,
    "created_at": "2025-04-02T10:30:00Z",
    "read": true,
    "dismissed": false,
    "match_reasons": ["Military logistics background"]
  },
  "message": "Alert updated successfully"
}
```

---

## Frontend Integration

The frontend page is located at:
```
/src/app/client/mycareercompass/fortunematch/page.jsx
```

### Key Features:
1. **Dashboard Summary** - Total matches, high-fit jobs, new this week, applied
2. **Match Distribution Chart** - Visual breakdown of fit score ranges
3. **Opportunities Feed** - Card-based job listings with filtering and sorting
4. **Skill Translation Engine** - Military-to-civilian skill mappings with add/edit
5. **High-Match Alerts** - Notification panel for 87%+ fit jobs

### Filters:
- Search by job title/company
- Minimum score filter (0%, 70%, 87%+)
- Location filter
- Sort options (Fit Score, Salary, Most Recent)

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- `200` - Successful GET/PUT
- `201` - Successful POST
- `400` - Bad request (missing/invalid parameters)
- `404` - Resource not found
- `500` - Server error

---

## Mock Data Notes

Current implementation includes:
- **6 Sample Jobs** - Real veteran-friendly employers with realistic MOS-to-civilian translations
- **8 Pre-mapped Skills** - Military skill categories with confidence ratings
- **4 Alert Examples** - High-match notifications for testing

All mock data uses realistic:
- Military occupational specialties (MOS) and skill descriptions
- Veteran-friendly tech and logistics companies
- Fit scores ranging from 74-92%
- Practical match reasons and recommended actions

---

## Future Integration Points

1. **AI Matching Engine** - Replace mock fit_score with real ML model
2. **Database** - Store persistent skill translations and user preferences
3. **Authentication** - User context and personalized recommendations
4. **Job Board Integration** - Real job listings and updated matching
5. **Email Alerts** - Notification service for high-fit opportunities
6. **Analytics** - Track application rates and placement success

