# Education Compass — Backend API Endpoints

This document outlines all REST API endpoints required by the Education Compass feature of the WANAC platform. All endpoints are authenticated via JWT bearer token. Base path: `/api/education-compass`.

---

## Authentication

All endpoints require:

```
Authorization: Bearer <jwt_token>
```

Standard response envelope:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 0, "page": 1, "limit": 20 }
}
```

Error shape:

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

---

## 1. Program / Enrollment

### `GET /api/education-compass/program`

Returns the authenticated user's current enrolled program and high-level stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prog_001",
    "title": "PLEP",
    "duration": "1 Year",
    "currentSemester": "Semester 1",
    "totalCredits": 120,
    "completedCredits": 45,
    "gpa": 3.7,
    "startDate": "2024-01-01",
    "expectedEndDate": "2025-01-01",
    "status": "active"
  }
}
```

---

### `GET /api/education-compass/overview`

Returns aggregated dashboard stats — one call to power the overview widgets.

**Response:**
```json
{
  "success": true,
  "data": {
    "completedCredits": 45,
    "totalCredits": 120,
    "gpa": 3.7,
    "modulesTotal": 3,
    "modulesCompleted": 1,
    "assignmentsPending": 5,
    "assignmentsSubmitted": 3,
    "upcomingSessionsCount": 3,
    "availableQuizzesCount": 1,
    "avgGrade": 91,
    "readinessScore": 68
  }
}
```

---

## 2. Modules

### `GET /api/education-compass/modules`

Returns a list of modules for the user's enrolled program.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `upcoming`, `in-progress`, `completed` |
| `search` | string | Matches `title` and `code` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 50 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mod_001",
      "title": "PLEP",
      "code": "CS101",
      "credits": 3,
      "status": "completed",
      "progress": 100,
      "sessionsCount": 5,
      "assignmentsCount": 3,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": { "total": 3, "page": 1, "limit": 50 }
}
```

---

### `GET /api/education-compass/modules/:id`

Returns a single module with full sessions and assignments.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "mod_001",
    "title": "PLEP",
    "code": "CS101",
    "credits": 3,
    "status": "completed",
    "progress": 100,
    "sessions": [
      {
        "id": "sess_001",
        "title": "Introduction to Programming",
        "date": "2024-01-15",
        "duration": "2 hours",
        "type": "lecture",
        "status": "completed"
      }
    ],
    "assignments": [
      {
        "id": "asgn_001",
        "title": "Hello World Program",
        "dueDate": "2024-01-20",
        "points": 10,
        "status": "submitted",
        "grade": 95
      }
    ]
  }
}
```

---

### `POST /api/education-compass/modules`

Creates a new module within the user's program. (Admin or instructor role may be required.)

**Body:**
```json
{
  "title": "Machine Learning Fundamentals",
  "code": "CS401",
  "credits": 4,
  "status": "upcoming"
}
```

**Validation:**
- `title` — required, max 200 chars
- `code` — required, max 20 chars, unique within program
- `credits` — required, integer 1–12
- `status` — required, one of: `upcoming`, `in-progress`, `completed`

**Response:** `201 Created` with the module object.

---

### `PUT /api/education-compass/modules/:id`

Updates a module's metadata or status.

**Body:** Same fields as `POST`, all optional. Can also update `progress` (0–100).

**Response:** `200 OK`

---

### `DELETE /api/education-compass/modules/:id`

Soft-deletes a module.

**Response:** `200 OK`

---

## 3. Sessions (within Modules)

### `GET /api/education-compass/modules/:moduleId/sessions`

Returns all sessions for a module.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sess_001",
      "moduleId": "mod_001",
      "title": "Introduction to Programming",
      "date": "2024-01-15",
      "duration": "2 hours",
      "type": "lecture",
      "status": "completed",
      "zoomLink": null
    }
  ]
}
```

---

### `POST /api/education-compass/modules/:moduleId/sessions`

Creates a new session under a module.

**Body:**
```json
{
  "title": "Trees and Graphs",
  "date": "2024-03-07",
  "duration": "2 hours",
  "type": "lecture",
  "zoomLink": "https://zoom.us/j/..."
}
```

**Validation:**
- `title` — required
- `date` — required, ISO date
- `type` — required, one of: `lecture`, `lab`, `workshop`, `other`

**Response:** `201 Created`

---

### `PUT /api/education-compass/modules/:moduleId/sessions/:id`

Updates a session (e.g., mark as completed, add Zoom link).

**Response:** `200 OK`

---

### `DELETE /api/education-compass/modules/:moduleId/sessions/:id`

**Response:** `200 OK`

---

## 4. Upcoming Sessions (cross-module)

### `GET /api/education-compass/upcoming-sessions`

Returns all upcoming sessions across all modules, sorted by date.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `limit` | integer | Default: 10 |
| `from` | ISO date | Start date filter (default: today) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sess_009",
      "moduleId": "mod_002",
      "moduleTitle": "Data Structures and Algorithms",
      "title": "Trees and Graphs",
      "date": "2024-03-07",
      "time": "10:00",
      "type": "lecture",
      "zoomLink": null
    }
  ]
}
```

---

### `POST /api/education-compass/upcoming-sessions`

Creates a standalone upcoming session (not tied to a specific module session record — for ad-hoc scheduling).

**Body:**
```json
{
  "title": "Office Hours — Week 5",
  "moduleId": "mod_002",
  "date": "2024-03-10",
  "time": "14:00",
  "type": "other",
  "zoomLink": "https://zoom.us/j/..."
}
```

**Response:** `201 Created`

---

## 5. Assignments

### `GET /api/education-compass/assignments`

Returns all assignments across all modules for the user.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `pending`, `in-progress`, `submitted` |
| `moduleId` | string | Filter by specific module |
| `search` | string | Matches `title` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 50 |
| `sortBy` | string | `dueDate`, `status`, `points` (default: `dueDate`) |
| `sortDir` | string | `asc` or `desc` |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "asgn_001",
      "moduleId": "mod_001",
      "moduleTitle": "PLEP",
      "title": "Hello World Program",
      "dueDate": "2024-01-20",
      "points": 10,
      "status": "submitted",
      "grade": 95,
      "submittedAt": "2024-01-19T20:00:00Z",
      "feedback": "Excellent work!"
    }
  ],
  "meta": { "total": 8, "page": 1, "limit": 50 }
}
```

---

### `POST /api/education-compass/modules/:moduleId/assignments`

Creates an assignment under a module.

**Body:**
```json
{
  "title": "Linked List Operations",
  "dueDate": "2024-03-12",
  "points": 25,
  "status": "pending",
  "description": "Implement insert, delete, and search for a singly linked list."
}
```

**Validation:**
- `title` — required
- `dueDate` — required, ISO date
- `points` — required, integer ≥ 1
- `status` — one of: `pending`, `in-progress`, `submitted`

**Response:** `201 Created`

---

### `PUT /api/education-compass/modules/:moduleId/assignments/:id`

Updates an assignment. Can update `status`, `grade`, `feedback`, `dueDate`.

**Response:** `200 OK`

---

### `POST /api/education-compass/modules/:moduleId/assignments/:id/submit`

Marks an assignment as submitted (can include file upload URL).

**Body:**
```json
{
  "submissionUrl": "https://cdn.wanac.org/submissions/...",
  "notes": "Submitted before deadline"
}
```

**Response:** `200 OK`

---

### `DELETE /api/education-compass/modules/:moduleId/assignments/:id`

Soft-deletes an assignment.

**Response:** `200 OK`

---

## 6. Quizzes

### `GET /api/education-compass/quizzes`

Returns all quizzes for the user's program.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `available`, `completed`, `locked` |
| `moduleId` | string | Filter by module |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "quiz_001",
      "moduleId": "mod_001",
      "moduleTitle": "PLEP",
      "title": "Intro to Programming Quiz",
      "questions": 10,
      "status": "completed",
      "score": 92,
      "duration": "15 min",
      "availableFrom": "2024-02-01",
      "availableUntil": "2024-03-01",
      "completedAt": "2024-02-10T11:30:00Z"
    }
  ]
}
```

---

### `POST /api/education-compass/quizzes/:id/start`

Starts a quiz attempt for the user. Returns quiz questions.

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "att_001",
    "quizId": "quiz_002",
    "questions": [
      {
        "id": "q_001",
        "text": "What is a stack data structure?",
        "type": "multiple_choice",
        "options": ["LIFO", "FIFO", "Both", "Neither"]
      }
    ],
    "timeLimit": 1200,
    "startedAt": "2024-03-08T10:00:00Z"
  }
}
```

---

### `POST /api/education-compass/quizzes/:id/submit`

Submits quiz answers and returns the score.

**Body:**
```json
{
  "attemptId": "att_001",
  "answers": [
    { "questionId": "q_001", "answer": "LIFO" },
    { "questionId": "q_002", "answer": "O(n)" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 87,
    "correct": 13,
    "total": 15,
    "feedback": [
      { "questionId": "q_001", "correct": true },
      { "questionId": "q_002", "correct": false, "correctAnswer": "O(log n)" }
    ]
  }
}
```

---

## 7. Grades

### `GET /api/education-compass/grades`

Returns the full gradebook for the user.

**Response:**
```json
{
  "success": true,
  "data": {
    "gpa": 3.7,
    "overallAvgGrade": 91,
    "completedCredits": 45,
    "totalCredits": 120,
    "modules": [
      {
        "moduleId": "mod_001",
        "moduleTitle": "PLEP",
        "moduleStatus": "completed",
        "averageGrade": 92,
        "gradedAssignments": 3,
        "totalAssignments": 3,
        "assignments": [
          {
            "id": "asgn_001",
            "title": "Hello World Program",
            "points": 10,
            "grade": 95,
            "feedback": "Excellent work!"
          }
        ]
      }
    ]
  }
}
```

---

## 8. Media Gallery

### `GET /api/education-compass/media`

Returns media items (lecture recordings, PDFs, images) for the user's program.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | `video`, `pdf`, `image` |
| `moduleId` | string | Filter by module |
| `search` | string | Matches `title` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 20 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "media_001",
      "type": "video",
      "title": "Intro to Programming — Lecture 1",
      "moduleId": "mod_001",
      "moduleTitle": "PLEP",
      "url": "https://cdn.wanac.org/media/lecture-01.mp4",
      "thumbnailUrl": "https://cdn.wanac.org/media/lecture-01-thumb.jpg",
      "size": "320 MB",
      "duration": "1h 45m",
      "date": "2024-01-15",
      "uploadedAt": "2024-01-16T08:00:00Z"
    }
  ],
  "meta": { "total": 6, "page": 1, "limit": 20 }
}
```

---

### `POST /api/education-compass/media`

Uploads a new media item (instructor/admin only). Multipart form-data.

**Form fields:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Media file |
| `type` | string | `video`, `pdf`, `image` |
| `title` | string | Display name |
| `moduleId` | string | Associated module |

**Constraints:** Max 2 GB for video, 50 MB for PDFs/images.

**Response:** `201 Created`

---

### `DELETE /api/education-compass/media/:id`

Soft-deletes a media item (instructor/admin only).

**Response:** `200 OK`

---

## 9. Syllabus

### `GET /api/education-compass/syllabus`

Returns the full syllabus — all modules with their sessions and assignments in a single response for the Syllabus view.

**Response:** Same structure as `GET /modules` with embedded `sessions` and `assignments` arrays per module.

---

### `PUT /api/education-compass/syllabus`

Bulk-updates the syllabus structure (instructor/admin only). Allows reordering modules and updating module metadata.

**Body:**
```json
{
  "modules": [
    { "id": "mod_001", "order": 1 },
    { "id": "mod_002", "order": 2 }
  ]
}
```

**Response:** `200 OK`

---

## 10. Live Sessions (Zoom)

### `GET /api/education-compass/live-sessions`

Returns upcoming live/Zoom sessions across all modules.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `from` | ISO date | Start date (default: today) |
| `limit` | integer | Default: 10 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "live_001",
      "moduleId": "mod_002",
      "moduleTitle": "Data Structures and Algorithms",
      "title": "Trees and Graphs",
      "date": "2024-03-07",
      "time": "10:00",
      "type": "lecture",
      "zoomLink": "https://zoom.us/j/123456789",
      "zoomMeetingId": "123456789",
      "status": "scheduled"
    }
  ]
}
```

---

### `POST /api/education-compass/live-sessions`

Creates a live session with Zoom link.

**Body:**
```json
{
  "moduleId": "mod_002",
  "title": "Office Hours — Week 5",
  "date": "2024-03-10",
  "time": "14:00",
  "type": "other",
  "zoomLink": "https://zoom.us/j/..."
}
```

**Validation:**
- `title` — required
- `date` — required, must be future date
- `time` — required, HH:MM format
- `type` — one of: `lecture`, `lab`, `workshop`, `other`

**Response:** `201 Created`

---

### `PUT /api/education-compass/live-sessions/:id`

Updates a live session (e.g., add/change Zoom link, reschedule).

**Response:** `200 OK`

---

### `DELETE /api/education-compass/live-sessions/:id`

Cancels/removes a live session.

**Response:** `200 OK`

---

## 11. Course Reader & Solutions

### `GET /api/education-compass/readings`

Returns the list of weekly readings.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "read_001",
      "week": "Week 1",
      "title": "Foundational Concepts & Terminology",
      "pages": "1-45",
      "status": "completed",
      "fileUrl": "https://cdn.wanac.org/reader/week1.pdf"
    }
  ]
}
```

---

### `GET /api/education-compass/solutions`

Returns solution guides and worked examples.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sol_001",
      "title": "Assignment 1 — Solution Guide",
      "moduleId": "mod_001",
      "moduleTitle": "PLEP",
      "type": "Worked Example",
      "fileUrl": "https://cdn.wanac.org/solutions/asgn1-solution.pdf"
    }
  ]
}
```

---

## 12. Library Resources

### `GET /api/education-compass/library`

Returns available library resource collections.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lib_001",
      "title": "Digital Textbooks",
      "description": "Access core course texts via your institution's digital library.",
      "count": 4,
      "url": "https://library.institution.edu/digital"
    }
  ]
}
```

---

## 13. Store / Course Materials

### `GET /api/education-compass/store`

Returns available course materials for purchase.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "store_001",
      "title": "Course Reader (Print)",
      "description": "Bound print edition of the core course readings.",
      "price": 39.99,
      "currency": "USD",
      "inStock": true,
      "badge": "Bestseller"
    }
  ]
}
```

---

### `POST /api/education-compass/store/cart`

Adds an item to the user's cart.

**Body:**
```json
{ "itemId": "store_001", "quantity": 1 }
```

**Response:** `201 Created`

> **Note:** Checkout/payment processing should be handled by a dedicated payments service. This endpoint only manages cart state.

---

## 14. Media Reserves

### `GET /api/education-compass/media-reserves`

Returns time-limited reserve media items.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `active` | boolean | If `true`, only items where `availableUntil >= today` |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "res_001",
      "title": "Recorded Review Session",
      "moduleId": "mod_001",
      "moduleTitle": "PLEP",
      "type": "video",
      "url": "https://cdn.wanac.org/reserves/review-session.mp4",
      "size": "290 MB",
      "availableFrom": "2024-03-01",
      "availableUntil": "2024-03-31"
    }
  ]
}
```

---

## 15. Search

### `GET /api/education-compass/search`

Full-text search across modules, assignments, sessions, and media.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `types` | string | No | Comma-separated: `modules,assignments,sessions,media` (default: all) |

**Response:**
```json
{
  "success": true,
  "data": {
    "modules": [
      { "id": "mod_002", "title": "Data Structures and Algorithms", "code": "CS201", "status": "in-progress" }
    ],
    "assignments": [
      { "id": "asgn_004", "title": "Array Implementation", "moduleTitle": "Data Structures and Algorithms", "dueDate": "2024-02-28", "points": 20 }
    ],
    "sessions": [
      { "id": "sess_007", "title": "Arrays and Linked Lists", "moduleTitle": "Data Structures and Algorithms", "date": "2024-02-22", "type": "lecture" }
    ],
    "media": []
  },
  "meta": { "totalResults": 3, "query": "arrays" }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Insufficient permissions (e.g., student trying to create a module) |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Role-Based Access

| Role | Read | Create/Edit | Delete | Grade |
|------|------|-------------|--------|-------|
| Student | ✅ Own program | ❌ | ❌ | ❌ |
| Instructor | ✅ Assigned programs | ✅ Modules, Sessions, Assignments, Media | ✅ | ✅ |
| Admin | ✅ All | ✅ All | ✅ All | ✅ |

---

## Rate Limits

| Scope | Limit |
|-------|-------|
| `GET` endpoints | 300 requests / minute |
| `POST` / `PUT` / `DELETE` | 60 requests / minute |
| File uploads | 10 requests / minute |
| Quiz submissions | 5 requests / minute per user |

---

## Notes for Backend Team

- **Program enrollment** is managed by the Admissions/Enrollment service, not Education Compass. The `/program` endpoint should join against that service's data.
- **GPA calculation** should be performed server-side based on graded assignments; the client should never send GPA values.
- **Zoom links** can be created via the Zoom API on the backend when an instructor creates a live session — expose this as a toggle in the POST body (`"createZoomMeeting": true`).
- **Quiz attempts** should be stored server-side with timestamps and answers to prevent tampering. Never calculate quiz scores client-side.
- **Media storage** should use a CDN-backed object store (e.g., S3 + CloudFront). Serve signed URLs with short TTLs for protected content.
- **Media Reserves** with `availableUntil` deadlines should be enforced server-side — expired items should return `403 Forbidden`.
- **Soft-deletes** on all entities: add `deletedAt` timestamp, never hard-delete rows.
- **Search** endpoint should use full-text search (Postgres `tsvector`, Elasticsearch, or similar) — not `ILIKE` on all columns.
- **Progress** on modules (0–100%) should be auto-calculated from sessions/assignments completion where possible, with a manual override option.
