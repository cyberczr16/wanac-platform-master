import { NextResponse } from 'next/server';

// Mock AI-matched opportunities database
const MOCK_MATCHED_JOBS = [
  {
    id: 1,
    job_title: "Infrastructure Engineer",
    company: "TechCorp Solutions",
    location: "Austin, TX",
    salary_range: "$95,000 - $125,000",
    job_type: "Full-time",
    fit_score: 92,
    match_reasons: ["Military logistics background", "Infrastructure management", "Team leadership"],
    skill_translations: [
      { military_skill: "Logistics Management", civilian_equivalent: "Project Management" },
      { military_skill: "Team Leadership", civilian_equivalent: "Agile Team Lead" }
    ],
    recommended_actions: [
      "Highlight supply chain optimization experience",
      "Emphasize cross-functional team coordination"
    ],
    posted_date: "2025-03-28",
    description: "Seeking experienced infrastructure professional to manage enterprise systems and oversee technical operations."
  },
  {
    id: 2,
    job_title: "Operations Manager",
    company: "Global Logistics Inc",
    location: "Denver, CO",
    salary_range: "$85,000 - $115,000",
    job_type: "Full-time",
    fit_score: 88,
    match_reasons: ["Supply chain expertise", "Process optimization", "Resource allocation"],
    skill_translations: [
      { military_skill: "Supply Chain Coordination", civilian_equivalent: "Operations Management" },
      { military_skill: "Risk Assessment", civilian_equivalent: "Compliance & Safety" }
    ],
    recommended_actions: [
      "Leverage military efficiency standards",
      "Showcase inventory management skills"
    ],
    posted_date: "2025-03-20",
    description: "Lead operational excellence across multiple distribution centers with focus on efficiency and cost reduction."
  },
  {
    id: 3,
    job_title: "Project Coordinator",
    company: "BuildRight Construction",
    location: "Phoenix, AZ",
    salary_range: "$65,000 - $85,000",
    job_type: "Full-time",
    fit_score: 81,
    match_reasons: ["Project management", "Budget oversight", "Deadline-driven work"],
    skill_translations: [
      { military_skill: "Mission Planning", civilian_equivalent: "Project Planning" },
      { military_skill: "Resource Management", civilian_equivalent: "Budget Management" }
    ],
    recommended_actions: [
      "Discuss large-scale coordination experience",
      "Highlight attention to timeline management"
    ],
    posted_date: "2025-03-15",
    description: "Coordinate construction projects from planning to completion, managing timelines, budgets, and team coordination."
  },
  {
    id: 4,
    job_title: "Systems Administrator",
    company: "SecureNet Technologies",
    location: "Remote",
    salary_range: "$75,000 - $100,000",
    job_type: "Full-time",
    fit_score: 79,
    match_reasons: ["Network security", "Technical compliance", "System troubleshooting"],
    skill_translations: [
      { military_skill: "Information Security", civilian_equivalent: "Cybersecurity Compliance" },
      { military_skill: "Technical Troubleshooting", civilian_equivalent: "Systems Troubleshooting" }
    ],
    recommended_actions: [
      "Emphasize security clearance background",
      "Highlight technical certification goals"
    ],
    posted_date: "2025-03-10",
    description: "Maintain and support enterprise IT infrastructure with emphasis on security and system reliability."
  },
  {
    id: 5,
    job_title: "Safety Compliance Officer",
    company: "WorkSafe Industries",
    location: "Chicago, IL",
    salary_range: "$60,000 - $80,000",
    job_type: "Full-time",
    fit_score: 77,
    match_reasons: ["Safety protocol expertise", "Regulatory knowledge", "Training background"],
    skill_translations: [
      { military_skill: "Occupational Safety", civilian_equivalent: "OSHA Compliance" },
      { military_skill: "Personnel Training", civilian_equivalent: "Safety Training & Development" }
    ],
    recommended_actions: [
      "Showcase military safety standards knowledge",
      "Highlight training program development"
    ],
    posted_date: "2025-03-05",
    description: "Develop and implement comprehensive safety programs across manufacturing facilities."
  },
  {
    id: 6,
    job_title: "Logistics Analyst",
    company: "ShipFast Express",
    location: "Atlanta, GA",
    salary_range: "$70,000 - $95,000",
    job_type: "Full-time",
    fit_score: 74,
    match_reasons: ["Data analysis", "Route optimization", "Cost reduction"],
    skill_translations: [
      { military_skill: "Route Planning", civilian_equivalent: "Logistics Analysis" },
      { military_skill: "Performance Metrics", civilian_equivalent: "Data Analytics" }
    ],
    recommended_actions: [
      "Present analytical approach to problem-solving",
      "Highlight efficiency improvement projects"
    ],
    posted_date: "2025-02-28",
    description: "Analyze logistics operations and identify efficiency improvements for cost optimization."
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const minScore = parseInt(searchParams.get('minScore') || '0');
    const location = searchParams.get('location') || '';
    const roleType = searchParams.get('roleType') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter logic
    let filtered = MOCK_MATCHED_JOBS.filter(job => {
      if (job.fit_score < minScore) return false;
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (roleType && !job.job_title.toLowerCase().includes(roleType.toLowerCase())) return false;
      return true;
    });

    // Sorting by fit score (descending)
    filtered.sort((a, b) => b.fit_score - a.fit_score);

    // Pagination
    const total = filtered.length;
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedData = filtered.slice(startIdx, endIdx);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
