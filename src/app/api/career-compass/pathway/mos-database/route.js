import { NextResponse } from 'next/server';

// Complete MOS database for all branches
const mosDatabaseFull = [
  // Army
  { code: '11B', title: 'Infantryman', branch: 'Army', description: 'Engaged in combat operations, leadership under fire, team coordination' },
  { code: '25B', title: 'Information Technology Specialist', branch: 'Army', description: 'Network administration, system maintenance, IT infrastructure' },
  { code: '68W', title: 'Combat Medic', branch: 'Army', description: 'Emergency medical care, field triage, patient assessment' },
  { code: '35F', title: 'Intelligence Analyst', branch: 'Army', description: 'Data analysis, intelligence gathering, threat assessment' },
  { code: '15W', title: 'UAV Operator', branch: 'Army', description: 'Unmanned vehicle operation, surveillance, mission planning' },
  { code: '42A', title: 'Human Resources Specialist', branch: 'Army', description: 'Personnel management, recruitment, training coordination' },
  { code: '92Y', title: 'Supply Specialist', branch: 'Army', description: 'Supply chain management, inventory control, logistics' },
  { code: '13B', title: 'Cannon Crewmember', branch: 'Army', description: 'Artillery operations, crew coordination, equipment maintenance' },
  { code: '19D', title: 'Cavalry Scout', branch: 'Army', description: 'Reconnaissance, surveillance, tactical reporting' },
  { code: '31B', title: 'Military Police', branch: 'Army', description: 'Law enforcement, security operations, personnel escort' },
  { code: '54B', title: 'Chemical Operations Specialist', branch: 'Army', description: 'Chemical operations, hazmat handling, equipment maintenance' },
  { code: '88M', title: 'Motor Transport Operator', branch: 'Army', description: 'Vehicle operation, maintenance, logistics transport' },
  { code: '91B', title: 'Ammunition Specialist', branch: 'Army', description: 'Ammunition storage, handling, inventory management' },
  { code: '36B', title: 'Financial Management Specialist', branch: 'Army', description: 'Budget management, accounting, financial reporting' },

  // Navy
  { code: 'ET', title: 'Electronics Technician', branch: 'Navy', description: 'Electronics systems maintenance, radar, sonar operations' },
  { code: 'BM', title: 'Boatswain\'s Mate', branch: 'Navy', description: 'Ship operations, deck seamanship, personnel management' },
  { code: 'HM', title: 'Hospital Corpsman', branch: 'Navy', description: 'Medical operations, patient care, emergency response' },
  { code: 'IT', title: 'Information Systems Technician', branch: 'Navy', description: 'IT support, network maintenance, cybersecurity' },
  { code: 'YN', title: 'Yeoman', branch: 'Navy', description: 'Administrative support, records management, correspondence' },
  { code: 'AW', title: 'Aviation Warfare Systems Operator', branch: 'Navy', description: 'Aviation systems, radar, tactical coordination' },
  { code: 'MM', title: 'Machinist\'s Mate', branch: 'Navy', description: 'Propulsion systems, machinery maintenance, operations' },

  // Marines
  { code: '0311', title: 'Rifleman', branch: 'Marines', description: 'Infantry operations, small unit tactics, marksmanship' },
  { code: '0861', title: 'Field Radio Operator', branch: 'Marines', description: 'Communications, radio operations, tactical coordination' },
  { code: '5811', title: 'Military Police Officer', branch: 'Marines', description: 'Law enforcement, security, prisoner handling' },
  { code: '1812', title: 'Combat Engineer', branch: 'Marines', description: 'Engineering operations, demolition, obstacle clearance' },
  { code: '2111', title: 'Rifleman - Designated Marksman', branch: 'Marines', description: 'Precision shooting, tactical support, leadership' },

  // Air Force
  { code: '1A331', title: 'Tactical Airlift Operator', branch: 'Air Force', description: 'Aircraft operations, cargo handling, mission planning' },
  { code: '3D132', title: 'Cyber Systems Operations', branch: 'Air Force', description: 'Cybersecurity, network defense, threat analysis' },
  { code: '2A231', title: 'Aircraft Structural Maintenance', branch: 'Air Force', description: 'Aircraft maintenance, structural repair, safety' },
  { code: '4A231', title: 'Health Services Management', branch: 'Air Force', description: 'Healthcare administration, medical support, logistics' },
  { code: '1C431', title: 'Air Traffic Control', branch: 'Air Force', description: 'Air traffic management, radar, communications' },

  // Coast Guard
  { code: 'MK', title: 'Machinist\'s Mate', branch: 'Coast Guard', description: 'Marine engineering, equipment maintenance, operations' },
  { code: 'ET', title: 'Electronics Technician', branch: 'Coast Guard', description: 'Electronics systems, navigation, communications' },
  { code: 'SN', title: 'Seaman', branch: 'Coast Guard', description: 'Deck operations, seamanship, vessel maintenance' },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const branch = searchParams.get('branch');

    let results = mosDatabaseFull;

    // Filter by branch if provided
    if (branch) {
      results = results.filter(mos => mos.branch.toLowerCase() === branch.toLowerCase());
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(mos =>
        mos.code.toLowerCase().includes(searchLower) ||
        mos.title.toLowerCase().includes(searchLower) ||
        mos.description.toLowerCase().includes(searchLower)
      );
    }

    const response = {
      count: results.length,
      mos_codes: results,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
