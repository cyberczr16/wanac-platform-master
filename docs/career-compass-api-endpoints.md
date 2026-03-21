# Career Compass — Backend API Endpoints

This document outlines all REST API endpoints required by the Career Compass feature of the WANAC platform. All endpoints are authenticated via JWT bearer token. Base path: `/api/career-compass`.

---

## Authentication

All endpoints require the following header unless marked `[public]`:

```
Authorization: Bearer <jwt_token>
```

Responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 0, "page": 1, "limit": 20 }
}
```

Errors:

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

---

## 1. Overview / Dashboard

### `GET /api/career-compass/overview`

Returns aggregated stats for the overview dashboard.

**Response:**
```json
{
  "applications": {
    "total": 12,
    "thisMonth": 5,
    "pending": 8,
    "interview": 2,
    "rejected": 3,
    "offered": 1
  },
  "interviews": {
    "scheduled": 3,
    "completed": 2,
    "upcoming": 1
  },
  "targetEmployers": 8,
  "contacts": 15,
  "applicationMaterials": {
    "resume": true,
    "coverLetter": true,
    "portfolio": false,
    "references": true
  },
  "recentActivity": [
    {
      "id": "act_001",
      "type": "application",
      "title": "Application submitted",
      "subtitle": "Tech Corp — Software Engineer",
      "createdAt": "2025-01-22T14:41:00Z"
    }
  ]
}
```

---

## 2. Applications

### `GET /api/career-compass/applications`

Returns a paginated list of applications for the authenticated user.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status: `Pending`, `Interview`, `Rejected`, `Offered` |
| `search` | string | Full-text search on `company` and `role` fields |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20, max: 100) |
| `sortBy` | string | `dateApplied`, `company`, `status` (default: `dateApplied`) |
| `sortDir` | string | `asc` or `desc` (default: `desc`) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "app_001",
      "company": "Tech Corp",
      "role": "Software Engineer",
      "status": "Pending",
      "dateApplied": "2025-01-20",
      "notes": "",
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T10:00:00Z"
    }
  ],
  "meta": { "total": 12, "page": 1, "limit": 20 }
}
```

---

### `POST /api/career-compass/applications`

Creates a new application.

**Body:**
```json
{
  "company": "Tech Corp",
  "role": "Software Engineer",
  "status": "Pending",
  "dateApplied": "2025-01-20",
  "notes": "Applied via LinkedIn"
}
```

**Validation:**
- `company` — required, max 200 chars
- `role` — required, max 200 chars
- `status` — required, one of: `Pending`, `Interview`, `Rejected`, `Offered`
- `dateApplied` — required, ISO date
- `notes` — optional, max 2000 chars

**Response:** `201 Created` with the created application object.

---

### `PUT /api/career-compass/applications/:id`

Updates an existing application.

**Body:** Same fields as `POST`, all optional.

**Response:** `200 OK` with the updated application object.

---

### `DELETE /api/career-compass/applications/:id`

Soft-deletes an application.

**Response:** `200 OK`
```json
{ "success": true, "message": "Application deleted." }
```

---

## 3. Employers

### `GET /api/career-compass/employers`

Returns a paginated list of employers for the authenticated user.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `Saved`, `Applied`, `Contacted`, `Interview` |
| `search` | string | Matches `name` and `industry` |
| `page` | integer | Page (default: 1) |
| `limit` | integer | Per page (default: 20) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "emp_001",
      "name": "Tech Corp",
      "industry": "Technology",
      "status": "Applied",
      "website": "https://techcorp.com",
      "notes": "",
      "dateAdded": "2025-01-15",
      "createdAt": "2025-01-15T09:00:00Z"
    }
  ],
  "meta": { "total": 4, "page": 1, "limit": 20 }
}
```

---

### `POST /api/career-compass/employers`

**Body:**
```json
{
  "name": "Tech Corp",
  "industry": "Technology",
  "status": "Saved",
  "website": "https://techcorp.com",
  "notes": "",
  "dateAdded": "2025-01-15"
}
```

**Validation:**
- `name` — required, max 200 chars
- `status` — required, one of: `Saved`, `Applied`, `Contacted`, `Interview`

**Response:** `201 Created`

---

### `PUT /api/career-compass/employers/:id`

Updates an existing employer. All fields optional.

**Response:** `200 OK`

---

### `DELETE /api/career-compass/employers/:id`

Soft-deletes an employer record.

**Response:** `200 OK`

---

## 4. Target Employers

### `GET /api/career-compass/target-employers`

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `priority` | string | Filter: `High`, `Medium`, `Low` |
| `search` | string | Matches `name` and `industry` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 20 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tgt_001",
      "name": "Tech Corp",
      "industry": "Technology",
      "priority": "High",
      "nextStep": "Apply",
      "notes": "",
      "createdAt": "2025-01-15T09:00:00Z"
    }
  ],
  "meta": { "total": 5, "page": 1, "limit": 20 }
}
```

---

### `POST /api/career-compass/target-employers`

**Body:**
```json
{
  "name": "Tech Corp",
  "industry": "Technology",
  "priority": "High",
  "nextStep": "Apply",
  "notes": ""
}
```

**Validation:**
- `name` — required
- `priority` — required, one of: `High`, `Medium`, `Low`

**Response:** `201 Created`

---

### `PUT /api/career-compass/target-employers/:id`

All fields optional.

**Response:** `200 OK`

---

### `DELETE /api/career-compass/target-employers/:id`

**Response:** `200 OK`

---

## 5. Contacts

### `GET /api/career-compass/contacts`

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Matches `name`, `company`, `email` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 20 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "con_001",
      "name": "Jane Doe",
      "company": "Google",
      "email": "jane@google.com",
      "phone": "",
      "notes": "Met at job fair",
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ],
  "meta": { "total": 15, "page": 1, "limit": 20 }
}
```

---

### `POST /api/career-compass/contacts`

**Body:**
```json
{
  "name": "Jane Doe",
  "company": "Google",
  "email": "jane@google.com",
  "phone": "+1-555-0123",
  "notes": "Met at job fair"
}
```

**Validation:**
- `name` — required

**Response:** `201 Created`

---

### `PUT /api/career-compass/contacts/:id`

**Response:** `200 OK`

---

### `DELETE /api/career-compass/contacts/:id`

**Response:** `200 OK`

---

## 6. Appointments

### `GET /api/career-compass/appointments`

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | `Interview`, `Call`, `Meeting`, `Other` |
| `upcoming` | boolean | If `true`, returns only future appointments |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 20 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "appt_001",
      "title": "Interview with Tech Corp",
      "type": "Interview",
      "date": "2025-02-03",
      "time": "14:00",
      "notes": "Bring portfolio",
      "createdAt": "2025-01-28T08:00:00Z"
    }
  ],
  "meta": { "total": 3, "page": 1, "limit": 20 }
}
```

---

### `POST /api/career-compass/appointments`

**Body:**
```json
{
  "title": "Interview with Tech Corp",
  "type": "Interview",
  "date": "2025-02-03",
  "time": "14:00",
  "notes": "Bring portfolio"
}
```

**Validation:**
- `title` — required
- `type` — required, one of: `Interview`, `Call`, `Meeting`, `Other`
- `date` — required, ISO date, must be today or future

**Response:** `201 Created`

---

### `PUT /api/career-compass/appointments/:id`

**Response:** `200 OK`

---

### `DELETE /api/career-compass/appointments/:id`

**Response:** `200 OK`

---

## 7. Application Materials

### `GET /api/career-compass/materials`

Returns the user's application materials checklist and uploaded files.

**Response:**
```json
{
  "success": true,
  "data": {
    "checklist": {
      "resume": true,
      "coverLetter": true,
      "portfolio": false,
      "references": true
    },
    "files": [
      {
        "id": "file_001",
        "type": "resume",
        "name": "Ian_Odundo_Resume_v2.pdf",
        "url": "https://cdn.wanac.org/files/Ian_Odundo_Resume_v2.pdf",
        "uploadedAt": "2025-01-18T10:00:00Z"
      }
    ]
  }
}
```

---

### `PUT /api/career-compass/materials/checklist`

Updates which material types are marked complete.

**Body:**
```json
{
  "resume": true,
  "coverLetter": true,
  "portfolio": false,
  "references": true
}
```

**Response:** `200 OK`

---

### `POST /api/career-compass/materials/upload`

Uploads a file (multipart/form-data).

**Form fields:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The document to upload |
| `type` | string | `resume`, `coverLetter`, `portfolio`, `references` |

**Constraints:**
- Max file size: 10 MB
- Allowed types: `pdf`, `docx`, `doc`

**Response:** `201 Created` with the file object.

---

### `DELETE /api/career-compass/materials/:fileId`

Deletes an uploaded material file.

**Response:** `200 OK`

---

## 8. Activity Stream

### `GET /api/career-compass/activity`

Returns a paginated activity feed for the authenticated user, sorted newest first.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter: `application`, `interview`, `contact`, `employer`, `material`, `target`, `milestone` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 20 |
| `since` | ISO datetime | Return activity after this timestamp |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "act_001",
      "type": "application",
      "title": "Application submitted",
      "subtitle": "Tech Corp — Software Engineer",
      "relatedId": "app_001",
      "relatedType": "application",
      "createdAt": "2025-01-22T14:41:00Z"
    }
  ],
  "meta": { "total": 50, "page": 1, "limit": 20 }
}
```

**Note:** Activity entries are auto-created by the server whenever the user creates, updates, or reaches a milestone within Career Compass. Clients do not `POST` to this endpoint directly.

---

## 9. AFI & Job Postings

### `GET /api/career-compass/job-postings`

Returns job postings from AFI and partner employers. This endpoint is read-only for clients.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search `title`, `org`, `location` |
| `type` | string | `Full-Time`, `Part-Time`, `Contract` |
| `tag` | string | Filter by tag, e.g. `Veteran`, `Remote`, `Engineering` |
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 20 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "job_001",
      "title": "Software Engineer",
      "org": "Tech Corp",
      "location": "Remote",
      "type": "Full-Time",
      "salary": "$95k – $130k",
      "description": "Join our platform engineering team.",
      "tags": ["Engineering", "Backend", "Python"],
      "applyUrl": "https://techcorp.com/careers/se",
      "isNew": true,
      "postedAt": "2025-01-22T00:00:00Z"
    }
  ],
  "meta": { "total": 6, "page": 1, "limit": 20 }
}
```

---

### `POST /api/career-compass/job-postings/:id/save`

Saves a job posting to the user's saved list.

**Response:**
```json
{ "success": true, "saved": true }
```

---

### `DELETE /api/career-compass/job-postings/:id/save`

Removes a saved job posting.

**Response:**
```json
{ "success": true, "saved": false }
```

---

### `GET /api/career-compass/job-postings/saved`

Returns all job postings the user has saved.

**Response:** Same shape as `GET /job-postings`.

---

## 10. Interview Questions

### `GET /api/career-compass/interview-questions`

Returns a library of interview questions (system-wide + user's custom).

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | e.g. `Behavioral`, `Technical`, `Situational` |
| `search` | string | Matches question text |
| `page` | integer | Default: 1 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q_001",
      "question": "Tell me about a time you overcame a challenge.",
      "category": "Behavioral",
      "tip": "Use the STAR method.",
      "userAnswer": "My answer here...",
      "isSystemQuestion": true,
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### `PUT /api/career-compass/interview-questions/:id/answer`

Saves the user's answer to an interview question.

**Body:**
```json
{
  "answer": "My answer using the STAR method..."
}
```

**Response:** `200 OK`

---

### `POST /api/career-compass/interview-questions`

Creates a custom interview question for the user.

**Body:**
```json
{
  "question": "Custom question text",
  "category": "Technical",
  "tip": "Optional tip"
}
```

**Response:** `201 Created`

---

### `DELETE /api/career-compass/interview-questions/:id`

Deletes a custom user question (cannot delete system questions).

**Response:** `200 OK`

---

## 11. Research Tools

### `GET /api/career-compass/research/salary`

Returns salary range data for a given role and location.

**Query params:**
| Param | Type | Required |
|-------|------|----------|
| `role` | string | Yes |
| `location` | string | No |

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "Software Engineer",
    "location": "Remote",
    "low": 85000,
    "median": 115000,
    "high": 155000,
    "currency": "USD",
    "source": "Bureau of Labor Statistics / O*NET",
    "updatedAt": "2025-01-01"
  }
}
```

---

### `GET /api/career-compass/research/industry-trends`

Returns current job market trends by industry.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `industry` | string | e.g. `Technology`, `Healthcare` |

**Response:**
```json
{
  "success": true,
  "data": {
    "industry": "Technology",
    "growthRate": "+8% YoY",
    "topRoles": ["Software Engineer", "Data Analyst", "Cloud Architect"],
    "topLocations": ["Remote", "San Francisco", "Austin"],
    "demandLevel": "High"
  }
}
```

---

## 12. Applied Positions

### `GET /api/career-compass/applied`

Returns positions the user has already applied to (subset of applications with status ≠ `Saved`).

**Query params:** Same as `/applications`.

**Response:** Same shape as `/applications`.

> **Note:** This endpoint is a filtered alias. Alternatively, the frontend can filter `GET /applications?status=Applied,Interview,Offered,Rejected`. A dedicated endpoint is provided for convenience.

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | User does not own the resource |
| `NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limits

| Scope | Limit |
|-------|-------|
| Read endpoints (`GET`) | 300 requests / minute |
| Write endpoints (`POST`, `PUT`, `DELETE`) | 60 requests / minute |
| File uploads | 10 requests / minute |

---

## Pagination

All list endpoints use cursor-less page-based pagination:

| Param | Default | Max |
|-------|---------|-----|
| `page` | 1 | — |
| `limit` | 20 | 100 |

---

## Notes for Backend Team

- All `DELETE` operations should be **soft-deletes** (add `deletedAt` timestamp; do not purge rows).
- Activity entries in `/activity` should be **auto-generated** as side effects when write operations occur on other resources (applications, employers, contacts, etc.).
- The `overview` endpoint should be backed by **pre-aggregated counts** or a lightweight query — not N+1 fetches.
- Job postings are **admin-managed content** (not user-generated). Provide a separate admin API for posting management.
- File uploads in `/materials/upload` should be stored in S3-compatible object storage and signed URLs served to clients.
- Salary data in `/research/salary` may be sourced from a third-party API (e.g. O*NET, Bureau of Labor Statistics) — consider caching results for 24 hours.
