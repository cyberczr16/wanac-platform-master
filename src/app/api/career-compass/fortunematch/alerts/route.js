import { NextResponse } from 'next/server';

// Mock alerts database (87%+ fit score notifications)
let MOCK_ALERTS = [
  {
    id: 1,
    job_title: "Infrastructure Engineer",
    company: "TechCorp Solutions",
    fit_score: 92,
    created_at: "2025-04-02T10:30:00Z",
    read: false,
    dismissed: false,
    match_reasons: ["Military logistics background", "Infrastructure management", "Team leadership"]
  },
  {
    id: 2,
    job_title: "Operations Manager",
    company: "Global Logistics Inc",
    fit_score: 88,
    created_at: "2025-04-01T14:15:00Z",
    read: false,
    dismissed: false,
    match_reasons: ["Supply chain expertise", "Process optimization"]
  },
  {
    id: 3,
    job_title: "Project Coordinator",
    company: "BuildRight Construction",
    fit_score: 87,
    created_at: "2025-03-31T09:45:00Z",
    read: true,
    dismissed: false,
    match_reasons: ["Project management", "Budget oversight"]
  },
  {
    id: 4,
    job_title: "Senior Supply Chain Analyst",
    company: "DistributionPro Corp",
    fit_score: 91,
    created_at: "2025-03-30T16:20:00Z",
    read: false,
    dismissed: false,
    match_reasons: ["Advanced supply chain skills", "Leadership experience", "Cost reduction expertise"]
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const includeRead = searchParams.get('includeRead') === 'true';

    let filtered = MOCK_ALERTS;

    // Filter out dismissed by default
    filtered = filtered.filter(alert => !alert.dismissed);

    // Optionally filter unread only
    if (!includeRead) {
      filtered = filtered.filter(alert => !alert.read);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({
      success: true,
      data: filtered,
      meta: {
        total: filtered.length,
        unread: MOCK_ALERTS.filter(a => !a.read && !a.dismissed).length
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, read, dismissed } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "id is required"
      }, { status: 400 });
    }

    const alert = MOCK_ALERTS.find(a => a.id === parseInt(id));
    if (!alert) {
      return NextResponse.json({
        success: false,
        error: "Alert not found"
      }, { status: 404 });
    }

    // Update alert status
    if (read !== undefined) alert.read = read;
    if (dismissed !== undefined) alert.dismissed = dismissed;

    return NextResponse.json({
      success: true,
      data: alert,
      message: "Alert updated successfully"
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
