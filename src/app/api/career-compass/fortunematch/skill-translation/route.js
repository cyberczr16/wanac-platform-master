import { NextResponse } from 'next/server';

// Mock skill translations database
let MOCK_SKILL_TRANSLATIONS = [
  {
    id: 1,
    military_skill: "Supply Chain Management",
    civilian_equivalent: "Logistics & Operations Management",
    confidence: 0.95,
    related_roles: ["Operations Manager", "Supply Chain Analyst", "Logistics Coordinator"],
    category: "Operations"
  },
  {
    id: 2,
    military_skill: "Team Leadership & Command",
    civilian_equivalent: "Project Management & Team Lead",
    confidence: 0.92,
    related_roles: ["Team Lead", "Project Manager", "Program Director"],
    category: "Leadership"
  },
  {
    id: 3,
    military_skill: "Strategic Planning",
    civilian_equivalent: "Business Strategy & Planning",
    confidence: 0.90,
    related_roles: ["Strategy Analyst", "Business Analyst", "Planning Manager"],
    category: "Strategy"
  },
  {
    id: 4,
    military_skill: "Information Security & Compliance",
    civilian_equivalent: "Cybersecurity & Regulatory Compliance",
    confidence: 0.88,
    related_roles: ["Security Analyst", "Compliance Officer", "IT Security Manager"],
    category: "Technology"
  },
  {
    id: 5,
    military_skill: "Technical Operations",
    civilian_equivalent: "Systems Administration & Infrastructure",
    confidence: 0.87,
    related_roles: ["Systems Administrator", "Infrastructure Engineer", "IT Operations Manager"],
    category: "Technology"
  },
  {
    id: 6,
    military_skill: "Personnel Training & Development",
    civilian_equivalent: "Corporate Training & Talent Development",
    confidence: 0.85,
    related_roles: ["Training Coordinator", "Learning & Development Manager", "Instructional Designer"],
    category: "Human Resources"
  },
  {
    id: 7,
    military_skill: "Risk Assessment & Mitigation",
    civilian_equivalent: "Enterprise Risk Management",
    confidence: 0.83,
    related_roles: ["Risk Analyst", "Safety Manager", "Compliance Manager"],
    category: "Risk Management"
  },
  {
    id: 8,
    military_skill: "Budget Management & Resource Allocation",
    civilian_equivalent: "Financial Planning & Budgeting",
    confidence: 0.82,
    related_roles: ["Budget Analyst", "Financial Analyst", "Resource Manager"],
    category: "Finance"
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let filtered = MOCK_SKILL_TRANSLATIONS;

    if (category) {
      filtered = filtered.filter(skill =>
        skill.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      meta: {
        total: filtered.length
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { military_skill, civilian_equivalent, confidence, related_roles } = body;

    // Validation
    if (!military_skill || !civilian_equivalent) {
      return NextResponse.json({
        success: false,
        error: "military_skill and civilian_equivalent are required"
      }, { status: 400 });
    }

    // Create new translation
    const newTranslation = {
      id: MOCK_SKILL_TRANSLATIONS.length + 1,
      military_skill,
      civilian_equivalent,
      confidence: confidence || 0.75,
      related_roles: related_roles || [],
      category: "Custom"
    };

    MOCK_SKILL_TRANSLATIONS.push(newTranslation);

    return NextResponse.json({
      success: true,
      data: newTranslation,
      message: "Skill translation added successfully"
    }, { status: 201 });
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
    const { id, military_skill, civilian_equivalent, confidence, related_roles } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "id is required for update"
      }, { status: 400 });
    }

    const index = MOCK_SKILL_TRANSLATIONS.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: "Skill translation not found"
      }, { status: 404 });
    }

    // Update translation
    MOCK_SKILL_TRANSLATIONS[index] = {
      ...MOCK_SKILL_TRANSLATIONS[index],
      military_skill: military_skill || MOCK_SKILL_TRANSLATIONS[index].military_skill,
      civilian_equivalent: civilian_equivalent || MOCK_SKILL_TRANSLATIONS[index].civilian_equivalent,
      confidence: confidence !== undefined ? confidence : MOCK_SKILL_TRANSLATIONS[index].confidence,
      related_roles: related_roles || MOCK_SKILL_TRANSLATIONS[index].related_roles
    };

    return NextResponse.json({
      success: true,
      data: MOCK_SKILL_TRANSLATIONS[index],
      message: "Skill translation updated successfully"
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
