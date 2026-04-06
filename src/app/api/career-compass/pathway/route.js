import { NextResponse } from 'next/server';

// Mock MOS database with descriptions
const mosDatabase = {
  '11B': { code: '11B', title: 'Infantryman', branch: 'Army', description: 'Engaged in combat operations, leadership under fire, team coordination' },
  '25B': { code: '25B', title: 'Information Technology Specialist', branch: 'Army', description: 'Network administration, system maintenance, IT infrastructure' },
  '68W': { code: '68W', title: 'Combat Medic', branch: 'Army', description: 'Emergency medical care, field triage, patient assessment' },
  '35F': { code: '35F', title: 'Intelligence Analyst', branch: 'Army', description: 'Data analysis, intelligence gathering, threat assessment' },
  '15W': { code: '15W', title: 'UAV Operator', branch: 'Army', description: 'Unmanned vehicle operation, surveillance, mission planning' },
  '42A': { code: '42A', title: 'Human Resources Specialist', branch: 'Army', description: 'Personnel management, recruitment, training coordination' },
  '92Y': { code: '92Y', title: 'Supply Specialist', branch: 'Army', description: 'Supply chain management, inventory control, logistics' },
};

// Pathway mappings with realistic transitions
const pathwayMappings = {
  '11B': [
    {
      civilian_role: 'Project Manager',
      industry: 'Technology/Consulting',
      match_strength: 85,
      required_skills: [
        { name: 'Leadership', has: true },
        { name: 'Team Coordination', has: true },
        { name: 'Risk Management', has: true },
        { name: 'Agile/Scrum Methodology', has: false },
        { name: 'Project Planning Software', has: false },
      ],
      salary_range: { low: 70000, median: 95000, high: 130000 },
      growth_outlook: 'High',
      typical_transition_time: '6-9 months',
      recommended_certifications: ['PMP', 'CSM (Certified Scrum Master)', 'PRINCE2'],
      steps: [
        { order: 1, action: 'Complete PM Fundamentals Course', description: 'Online certification in project management basics', estimated_time: '4-6 weeks' },
        { order: 2, action: 'Earn PMP or CSM Certification', description: 'Industry-recognized credential', estimated_time: '8-12 weeks' },
        { order: 3, action: 'Build Portfolio Projects', description: 'Lead 2-3 small projects to showcase skills', estimated_time: '3-4 months' },
        { order: 4, action: 'Network in PM Communities', description: 'Join PMI chapters, attend conferences', estimated_time: 'Ongoing' },
        { order: 5, action: 'Apply to PM Roles', description: 'Target associate/coordinator roles first', estimated_time: '1-2 months' },
      ],
    },
    {
      civilian_role: 'Security Consultant',
      industry: 'Security/Defense Contracting',
      match_strength: 88,
      required_skills: [
        { name: 'Leadership', has: true },
        { name: 'Risk Assessment', has: true },
        { name: 'Security Protocols', has: true },
        { name: 'Cybersecurity Knowledge', has: false },
        { name: 'Security Clearance', has: false },
      ],
      salary_range: { low: 75000, median: 110000, high: 160000 },
      growth_outlook: 'High',
      typical_transition_time: '6-12 months',
      recommended_certifications: ['Security+', 'CISSP', 'CEH (Certified Ethical Hacker)'],
      steps: [
        { order: 1, action: 'Pursue Security+ Certification', description: 'Entry-level security credential', estimated_time: '6-8 weeks' },
        { order: 2, action: 'Explore Defense Contractor Opportunities', description: 'Companies like Booz Allen, Raytheon, Lockheed Martin', estimated_time: 'Ongoing' },
        { order: 3, action: 'Obtain/Maintain Security Clearance', description: 'Leverage military background', estimated_time: '3-6 months' },
        { order: 4, action: 'Gain Certifications in Specialty Area', description: 'CISSP, CEH, or CISM', estimated_time: '3-6 months' },
        { order: 5, action: 'Build Consulting Portfolio', description: 'Lead security assessments', estimated_time: '6-12 months' },
      ],
    },
    {
      civilian_role: 'Law Enforcement Officer',
      industry: 'Public Safety/Government',
      match_strength: 82,
      required_skills: [
        { name: 'Leadership', has: true },
        { name: 'Decision Making Under Pressure', has: true },
        { name: 'Communication', has: true },
        { name: 'Law Enforcement Training', has: false },
        { name: 'State Police Academy Certification', has: false },
      ],
      salary_range: { low: 45000, median: 62000, high: 90000 },
      growth_outlook: 'Medium',
      typical_transition_time: '3-6 months',
      recommended_certifications: ['Police Academy', 'Certified Patrol Officer'],
      steps: [
        { order: 1, action: 'Research Local Police Departments', description: 'Identify agencies aligned with your goals', estimated_time: '2-4 weeks' },
        { order: 2, action: 'Complete Police Academy', description: 'State-required training program', estimated_time: '12-20 weeks' },
        { order: 3, action: 'Pass Background Investigation', description: 'Standard for all LE positions', estimated_time: '2-4 months' },
        { order: 4, action: 'Obtain POST Certification', description: 'Peace Officer Standards and Training', estimated_time: 'Upon academy completion' },
        { order: 5, action: 'Apply and Interview', description: 'Competitive process with written and physical exams', estimated_time: '1-3 months' },
      ],
    },
  ],
  '25B': [
    {
      civilian_role: 'Systems Administrator',
      industry: 'Technology/IT Services',
      match_strength: 90,
      required_skills: [
        { name: 'Network Administration', has: true },
        { name: 'System Configuration', has: true },
        { name: 'Troubleshooting', has: true },
        { name: 'Cloud Infrastructure (AWS/Azure)', has: false },
        { name: 'Advanced Scripting', has: false },
      ],
      salary_range: { low: 60000, median: 82000, high: 115000 },
      growth_outlook: 'High',
      typical_transition_time: '3-6 months',
      recommended_certifications: ['CompTIA Security+', 'Microsoft Azure', 'AWS Solutions Architect'],
      steps: [
        { order: 1, action: 'Earn Security+ Certification', description: 'Industry standard, often required', estimated_time: '4-8 weeks' },
        { order: 2, action: 'Learn Cloud Platforms', description: 'Focus on AWS or Azure', estimated_time: '8-12 weeks' },
        { order: 3, action: 'Build Home Lab', description: 'Practice networking and system administration', estimated_time: 'Ongoing' },
        { order: 4, action: 'Develop Scripting Skills', description: 'PowerShell, Bash, Python', estimated_time: '6-8 weeks' },
        { order: 5, action: 'Apply to SysAdmin Roles', description: 'Target tier-1 to tier-2 positions', estimated_time: '1-2 months' },
      ],
    },
    {
      civilian_role: 'Network Engineer',
      industry: 'Technology/Telecom',
      match_strength: 88,
      required_skills: [
        { name: 'Network Architecture', has: true },
        { name: 'Routing and Switching', has: true },
        { name: 'TCP/IP Protocol', has: true },
        { name: 'Cisco Certifications', has: false },
        { name: 'Network Design', has: false },
      ],
      salary_range: { low: 70000, median: 95000, high: 140000 },
      growth_outlook: 'High',
      typical_transition_time: '6-9 months',
      recommended_certifications: ['CCNA', 'CCNP', 'CompTIA Network+'],
      steps: [
        { order: 1, action: 'Complete Network+ or CCNA', description: 'Foundation networking certification', estimated_time: '8-12 weeks' },
        { order: 2, action: 'Study for CCNA Routing & Switching', description: 'Industry-leading credential', estimated_time: '12-16 weeks' },
        { order: 3, action: 'Build Practice Lab with Cisco', description: 'Hands-on experience with routers/switches', estimated_time: 'Ongoing' },
        { order: 4, action: 'Get Experience with Enterprise Networks', description: 'Consider network NOC roles first', estimated_time: '3-6 months' },
        { order: 5, action: 'Pursue CCNP for Senior Roles', description: 'Advanced certification for growth', estimated_time: '4-6 months (after CCNA)' },
      ],
    },
    {
      civilian_role: 'Cloud Architect',
      industry: 'Cloud Computing/Enterprise IT',
      match_strength: 85,
      required_skills: [
        { name: 'System Architecture', has: true },
        { name: 'Infrastructure Knowledge', has: true },
        { name: 'Technical Communication', has: true },
        { name: 'Cloud Certifications (AWS/Azure)', has: false },
        { name: 'Advanced Cloud Design Patterns', has: false },
      ],
      salary_range: { low: 95000, median: 135000, high: 180000 },
      growth_outlook: 'High',
      typical_transition_time: '12-18 months',
      recommended_certifications: ['AWS Solutions Architect', 'Azure Administrator', 'Google Cloud Architect'],
      steps: [
        { order: 1, action: 'Master Cloud Fundamentals', description: 'AWS, Azure, or GCP core services', estimated_time: '8-10 weeks' },
        { order: 2, action: 'Earn Cloud Associate Certification', description: 'AWS Solutions Architect Associate, etc.', estimated_time: '10-12 weeks' },
        { order: 3, action: 'Gain Hands-on Cloud Project Experience', description: 'Deploy and manage cloud infrastructure', estimated_time: '6-9 months' },
        { order: 4, action: 'Advance to Professional Cloud Certification', description: 'Solutions Architect Professional level', estimated_time: '3-4 months' },
        { order: 5, action: 'Apply to Cloud Architect Roles', description: 'Senior technical positions', estimated_time: '1-2 months' },
      ],
    },
  ],
  '68W': [
    {
      civilian_role: 'Registered Nurse (RN)',
      industry: 'Healthcare',
      match_strength: 92,
      required_skills: [
        { name: 'Patient Care', has: true },
        { name: 'Emergency Response', has: true },
        { name: 'Triage Assessment', has: true },
        { name: 'Nursing Degree (BSN)', has: false },
        { name: 'State RN License', has: false },
      ],
      salary_range: { low: 60000, median: 75000, high: 110000 },
      growth_outlook: 'High',
      typical_transition_time: '24-36 months',
      recommended_certifications: ['BSN Degree', 'NCLEX-RN', 'BLS/ACLS Certification'],
      steps: [
        { order: 1, action: 'Enroll in Bachelor of Science in Nursing (BSN)', description: 'Many universities offer accelerated programs for military', estimated_time: '24-36 months' },
        { order: 2, action: 'Complete Nursing Clinicals', description: 'Hospital and clinical rotations', estimated_time: 'Integrated with coursework' },
        { order: 3, action: 'Pass NCLEX-RN Exam', description: 'National licensing exam', estimated_time: '2-4 weeks after graduation' },
        { order: 4, action: 'Obtain State RN License', description: 'Submit to state nursing board', estimated_time: '2-6 weeks' },
        { order: 5, action: 'Apply to Nursing Positions', description: 'Target acute care, ER, or ICU roles', estimated_time: 'Ongoing' },
      ],
    },
    {
      civilian_role: 'EMT/Paramedic',
      industry: 'Emergency Services/Healthcare',
      match_strength: 88,
      required_skills: [
        { name: 'Emergency Medical Knowledge', has: true },
        { name: 'Patient Assessment', has: true },
        { name: 'Quick Decision Making', has: true },
        { name: 'Paramedic Certification', has: false },
        { name: 'State EMT License', has: false },
      ],
      salary_range: { low: 28000, median: 38000, high: 55000 },
      growth_outlook: 'Medium',
      typical_transition_time: '3-6 months',
      recommended_certifications: ['EMT-B or EMT-P', 'ACLS', 'PALS'],
      steps: [
        { order: 1, action: 'Complete EMT-Basic Training', description: 'Usually 6-8 week course', estimated_time: '6-8 weeks' },
        { order: 2, action: 'Pass National Registry Exam', description: 'NREMT-Basic certification', estimated_time: '1-2 weeks' },
        { order: 3, action: 'Obtain State EMT License', description: 'Register with your state', estimated_time: '2-4 weeks' },
        { order: 4, action: 'Pursue Paramedic Certification (Optional)', description: 'Higher pay and responsibility', estimated_time: '12-24 months additional' },
        { order: 5, action: 'Apply to Ambulance/Fire Department', description: 'Entry positions available throughout country', estimated_time: '1-3 months' },
      ],
    },
    {
      civilian_role: 'Medical Technician',
      industry: 'Healthcare/Hospitals',
      match_strength: 85,
      required_skills: [
        { name: 'Patient Care', has: true },
        { name: 'Medical Equipment Operation', has: true },
        { name: 'Clinical Procedures', has: true },
        { name: 'Certification (varies by specialty)', has: false },
        { name: 'Healthcare IT Systems', has: false },
      ],
      salary_range: { low: 30000, median: 42000, high: 62000 },
      growth_outlook: 'Medium',
      typical_transition_time: '3-9 months',
      recommended_certifications: ['CNA (Certified Nursing Assistant)', 'Phlebotomy Technician', 'Medical Assistant'],
      steps: [
        { order: 1, action: 'Choose Medical Tech Specialty', description: 'CNA, Phlebotomy, Lab Tech, or Imaging', estimated_time: '1-2 weeks' },
        { order: 2, action: 'Complete Certification Program', description: 'Varies by specialty, 4-12 weeks', estimated_time: '4-12 weeks' },
        { order: 3, action: 'Pass Certification Exam', description: 'National or state exam', estimated_time: '1-2 weeks' },
        { order: 4, action: 'Obtain State License/Certification', description: 'Register with state health board', estimated_time: '2-4 weeks' },
        { order: 5, action: 'Apply to Healthcare Facilities', description: 'Hospitals, clinics, diagnostic centers', estimated_time: '1-2 months' },
      ],
    },
  ],
  '35F': [
    {
      civilian_role: 'Business Intelligence Analyst',
      industry: 'Technology/Finance/Retail',
      match_strength: 90,
      required_skills: [
        { name: 'Data Analysis', has: true },
        { name: 'Pattern Recognition', has: true },
        { name: 'Report Generation', has: true },
        { name: 'SQL & Python', has: false },
        { name: 'BI Tools (Tableau, Power BI)', has: false },
      ],
      salary_range: { low: 65000, median: 85000, high: 125000 },
      growth_outlook: 'High',
      typical_transition_time: '6-9 months',
      recommended_certifications: ['Tableau Desktop Specialist', 'Microsoft Power BI', 'Google Analytics'],
      steps: [
        { order: 1, action: 'Learn SQL and Data Querying', description: 'Foundation for BI work', estimated_time: '4-6 weeks' },
        { order: 2, action: 'Master BI Tools (Tableau or Power BI)', description: 'Industry standard tools', estimated_time: '6-8 weeks' },
        { order: 3, action: 'Earn BI Certification', description: 'Tableau or Microsoft certified', estimated_time: '4-6 weeks' },
        { order: 4, action: 'Build BI Portfolio Projects', description: '2-3 real-world datasets', estimated_time: '8-10 weeks' },
        { order: 5, action: 'Apply to BI Analyst Roles', description: 'Entry to mid-level positions', estimated_time: '1-2 months' },
      ],
    },
    {
      civilian_role: 'Cybersecurity Analyst',
      industry: 'Technology/Defense/Finance',
      match_strength: 88,
      required_skills: [
        { name: 'Threat Analysis', has: true },
        { name: 'Security Protocols', has: true },
        { name: 'Incident Response', has: true },
        { name: 'Cybersecurity Certifications', has: false },
        { name: 'Network and System Security', has: false },
      ],
      salary_range: { low: 70000, median: 95000, high: 140000 },
      growth_outlook: 'High',
      typical_transition_time: '6-12 months',
      recommended_certifications: ['Security+', 'CEH', 'CISSP'],
      steps: [
        { order: 1, action: 'Earn CompTIA Security+', description: 'Entry-level security cert', estimated_time: '6-8 weeks' },
        { order: 2, action: 'Learn Network Security Fundamentals', description: 'Firewalls, IDS/IPS, VPNs', estimated_time: '6-8 weeks' },
        { order: 3, action: 'Study for CEH (Certified Ethical Hacker)', description: 'Advanced hands-on credential', estimated_time: '8-12 weeks' },
        { order: 4, action: 'Build Security Lab Environment', description: 'Practice with tools like Wireshark', estimated_time: 'Ongoing' },
        { order: 5, action: 'Apply to SOC Analyst Roles', description: 'Start in Security Operations Center', estimated_time: '1-3 months' },
      ],
    },
    {
      civilian_role: 'Data Analyst',
      industry: 'Technology/Finance/Marketing',
      match_strength: 86,
      required_skills: [
        { name: 'Data Analysis', has: true },
        { name: 'Statistical Thinking', has: true },
        { name: 'Report Writing', has: true },
        { name: 'SQL and Python', has: false },
        { name: 'Data Visualization', has: false },
      ],
      salary_range: { low: 55000, median: 72000, high: 105000 },
      growth_outlook: 'High',
      typical_transition_time: '4-8 months',
      recommended_certifications: ['Google Data Analytics', 'Microsoft Certified Data Analyst', 'Tableau Desktop'],
      steps: [
        { order: 1, action: 'Complete Data Analytics Bootcamp', description: 'Online or in-person 8-12 week program', estimated_time: '8-12 weeks' },
        { order: 2, action: 'Master SQL and Python', description: 'Core data manipulation languages', estimated_time: '6-8 weeks' },
        { order: 3, action: 'Learn Excel Advanced Skills', description: 'Pivot tables, VLOOKUP, macros', estimated_time: '2-4 weeks' },
        { order: 4, action: 'Build Data Analytics Portfolio', description: '3-4 projects with public datasets', estimated_time: '4-8 weeks' },
        { order: 5, action: 'Apply to Data Analyst Positions', description: 'Entry and junior analyst roles', estimated_time: '1-2 months' },
      ],
    },
  ],
  '15W': [
    {
      civilian_role: 'Drone Operations Manager',
      industry: 'Aerial Services/Technology',
      match_strength: 92,
      required_skills: [
        { name: 'UAV Operation', has: true },
        { name: 'Mission Planning', has: true },
        { name: 'Team Leadership', has: true },
        { name: 'FAA Part 107 License', has: false },
        { name: 'Aerial Survey Software', has: false },
      ],
      salary_range: { low: 50000, median: 70000, high: 110000 },
      growth_outlook: 'High',
      typical_transition_time: '2-4 months',
      recommended_certifications: ['FAA Part 107', 'DJI Enterprise Certification'],
      steps: [
        { order: 1, action: 'Obtain FAA Part 107 License', description: 'Federal drone pilot certification', estimated_time: '4-6 weeks' },
        { order: 2, action: 'Learn Commercial Drone Platforms', description: 'DJI Matrice, Freefly, Auterion', estimated_time: '2-4 weeks' },
        { order: 3, action: 'Get Aerial Survey Software Training', description: 'Pix4D, DroneDeploy, WebODM', estimated_time: '2-4 weeks' },
        { order: 4, action: 'Build Portfolio with Test Projects', description: 'Mapping, inspection, or surveying demos', estimated_time: '4-8 weeks' },
        { order: 5, action: 'Apply to Drone Service Companies', description: 'Startups to established firms', estimated_time: '1-2 months' },
      ],
    },
    {
      civilian_role: 'Aerospace Technician',
      industry: 'Aerospace/Defense Manufacturing',
      match_strength: 85,
      required_skills: [
        { name: 'Systems Operation', has: true },
        { name: 'Technical Documentation', has: true },
        { name: 'Problem Solving', has: true },
        { name: 'Aerospace Certifications', has: false },
        { name: 'Manufacturing Process Knowledge', has: false },
      ],
      salary_range: { low: 55000, median: 75000, high: 105000 },
      growth_outlook: 'High',
      typical_transition_time: '6-12 months',
      recommended_certifications: ['FAA A&P License', 'Boeing/Airbus Supplier Training'],
      steps: [
        { order: 1, action: 'Research Aerospace Companies', description: 'Boeing, Airbus, Lockheed Martin, etc.', estimated_time: '2-4 weeks' },
        { order: 2, action: 'Complete Aerospace Tech Training', description: 'Company-provided or vocational programs', estimated_time: '8-16 weeks' },
        { order: 3, action: 'Obtain Required Certifications', description: 'Company or FAA specific', estimated_time: '4-8 weeks' },
        { order: 4, action: 'Gain Hands-on Shop Experience', description: 'Assembly, testing, inspection', estimated_time: '3-6 months' },
        { order: 5, action: 'Progress to Technician Roles', description: 'Leads to engineering support', estimated_time: 'Ongoing' },
      ],
    },
    {
      civilian_role: 'Aviation Safety Inspector',
      industry: 'Government/Civil Aviation',
      match_strength: 83,
      required_skills: [
        { name: 'Safety Protocols', has: true },
        { name: 'Systems Knowledge', has: true },
        { name: 'Attention to Detail', has: true },
        { name: 'FAA Certifications', has: false },
        { name: 'Regulatory Knowledge', has: false },
      ],
      salary_range: { low: 48000, median: 68000, high: 98000 },
      growth_outlook: 'Medium',
      typical_transition_time: '6-9 months',
      recommended_certifications: ['FAA Part 107', 'FAA Safety Inspector Training'],
      steps: [
        { order: 1, action: 'Apply to FAA or Government Positions', description: 'Federal job boards (USAJobs)', estimated_time: '1-3 months' },
        { order: 2, action: 'Complete Background Investigation', description: 'Standard for government roles', estimated_time: '2-4 months' },
        { order: 3, action: 'Attend FAA Safety Inspector Training', description: 'Academy-based program', estimated_time: '12-16 weeks' },
        { order: 4, action: 'Obtain Field Training Certificate', description: 'On-the-job training with mentor', estimated_time: '6-12 months' },
        { order: 5, action: 'Begin Independent Inspection Duties', description: 'Full inspector responsibilities', estimated_time: 'Upon certification' },
      ],
    },
  ],
  '42A': [
    {
      civilian_role: 'HR Manager',
      industry: 'Human Resources/Corporate',
      match_strength: 88,
      required_skills: [
        { name: 'Recruitment', has: true },
        { name: 'Employee Relations', has: true },
        { name: 'Program Management', has: true },
        { name: 'HR Certification (SHRM)', has: false },
        { name: 'Labor Law Knowledge', has: false },
      ],
      salary_range: { low: 60000, median: 85000, high: 125000 },
      growth_outlook: 'High',
      typical_transition_time: '6-12 months',
      recommended_certifications: ['SHRM-CP', 'PHR', 'CIPD'],
      steps: [
        { order: 1, action: 'Pursue SHRM Certification', description: 'Society for Human Resource Management', estimated_time: '8-12 weeks' },
        { order: 2, action: 'Study Employment Law and Compliance', description: 'FMLA, ADA, Title VII, wage/hour', estimated_time: '4-6 weeks' },
        { order: 3, action: 'Build HR Technology Skills', description: 'HRIS systems like Workday, SAP', estimated_time: '6-8 weeks' },
        { order: 4, action: 'Gain Experience in HR Coordinator Role', description: 'Step up from your HR specialist experience', estimated_time: '3-6 months' },
        { order: 5, action: 'Apply to HR Manager Positions', description: 'Mid-size to large organizations', estimated_time: '1-2 months' },
      ],
    },
    {
      civilian_role: 'Recruiter',
      industry: 'HR/Staffing/Technology',
      match_strength: 86,
      required_skills: [
        { name: 'Recruitment Process', has: true },
        { name: 'Candidate Assessment', has: true },
        { name: 'Communication Skills', has: true },
        { name: 'ATS Systems', has: false },
        { name: 'Networking and Sourcing', has: false },
      ],
      salary_range: { low: 40000, median: 62000, high: 95000 },
      growth_outlook: 'High',
      typical_transition_time: '3-6 months',
      recommended_certifications: ['Certified Recruiter (REC)', 'LinkedIn Recruiter Certification'],
      steps: [
        { order: 1, action: 'Learn ATS and Recruiting Tools', description: 'LinkedIn Recruiter, Indeed, Greenhouse', estimated_time: '2-4 weeks' },
        { order: 2, action: 'Study Interview Techniques', description: 'Behavioral, technical, practical', estimated_time: '3-4 weeks' },
        { order: 3, action: 'Build Sourcing Network', description: 'LinkedIn, industry groups, conferences', estimated_time: 'Ongoing' },
        { order: 4, action: 'Apply to Recruiter Roles', description: 'Corporate or agency recruiting', estimated_time: '1-2 months' },
        { order: 5, action: 'Specialize in Vertical', description: 'Tech, healthcare, finance, etc.', estimated_time: '6-12 months' },
      ],
    },
    {
      civilian_role: 'Training Coordinator',
      industry: 'Corporate Training/Education',
      match_strength: 85,
      required_skills: [
        { name: 'Program Coordination', has: true },
        { name: 'Instructional Design', has: false },
        { name: 'Training Platforms', has: false },
        { name: 'Curriculum Development', has: false },
        { name: 'Adult Learning Principles', has: false },
      ],
      salary_range: { low: 40000, median: 58000, high: 82000 },
      growth_outlook: 'Medium',
      typical_transition_time: '3-6 months',
      recommended_certifications: ['IDOL (Instructional Design Online Learning)', 'ATD CPLP'],
      steps: [
        { order: 1, action: 'Learn Instructional Design Basics', description: 'Adult learning, curriculum design', estimated_time: '4-6 weeks' },
        { order: 2, action: 'Master Learning Management Systems', description: 'Canvas, Blackboard, Moodle, Cornerstone', estimated_time: '2-4 weeks' },
        { order: 3, action: 'Develop E-learning Content', description: 'Using Articulate Storyline or similar', estimated_time: '4-6 weeks' },
        { order: 1, action: 'Build Training Portfolio', description: '2-3 course examples', estimated_time: '4-8 weeks' },
        { order: 5, action: 'Apply to Training Coordinator Roles', description: 'Corporate learning departments', estimated_time: '1-2 months' },
      ],
    },
  ],
  '92Y': [
    {
      civilian_role: 'Supply Chain Manager',
      industry: 'Logistics/Manufacturing/Retail',
      match_strength: 89,
      required_skills: [
        { name: 'Inventory Management', has: true },
        { name: 'Process Optimization', has: true },
        { name: 'Logistics Knowledge', has: true },
        { name: 'APICS CSCP Certification', has: false },
        { name: 'Advanced ERP Systems', has: false },
      ],
      salary_range: { low: 65000, median: 90000, high: 135000 },
      growth_outlook: 'High',
      typical_transition_time: '6-9 months',
      recommended_certifications: ['APICS CSCP', 'APICS CPIM', 'Six Sigma'],
      steps: [
        { order: 1, action: 'Earn APICS CSCP Certification', description: 'Certified Supply Chain Professional', estimated_time: '8-12 weeks' },
        { order: 2, action: 'Master ERP Systems', description: 'SAP, Oracle, NetSuite', estimated_time: '8-10 weeks' },
        { order: 3, action: 'Study Process Improvement', description: 'Lean, Six Sigma fundamentals', estimated_time: '4-6 weeks' },
        { order: 4, action: 'Build Relevant Experience', description: 'Coordinator or specialist roles first', estimated_time: '6-12 months' },
        { order: 5, action: 'Apply to Supply Chain Manager Roles', description: 'Mid to large organizations', estimated_time: '1-2 months' },
      ],
    },
    {
      civilian_role: 'Logistics Coordinator',
      industry: 'Shipping/Warehousing/Transportation',
      match_strength: 87,
      required_skills: [
        { name: 'Inventory Control', has: true },
        { name: 'Shipping Knowledge', has: true },
        { name: 'Organization', has: true },
        { name: 'Logistics Software', has: false },
        { name: 'Transportation Planning', has: false },
      ],
      salary_range: { low: 40000, median: 55000, high: 80000 },
      growth_outlook: 'High',
      typical_transition_time: '3-6 months',
      recommended_certifications: ['APICS CPIM', 'Certified Logistics Associate'],
      steps: [
        { order: 1, action: 'Learn Logistics Software', description: 'Kinaxis, JDA, Manhattan Associates', estimated_time: '4-6 weeks' },
        { order: 2, action: 'Study Shipping and Freight', description: 'Modes, rates, regulations', estimated_time: '2-4 weeks' },
        { order: 3, action: 'Understand Warehouse Operations', description: 'WMS, picking, packing, shipping', estimated_time: '4-6 weeks' },
        { order: 4, action: 'Apply to Coordinator Roles', description: 'Shipping, receiving, warehouse', estimated_time: '1-2 months' },
        { order: 5, action: 'Progress to Supervisor/Manager', description: 'Advance through experience', estimated_time: '12-24 months' },
      ],
    },
    {
      civilian_role: 'Warehouse Manager',
      industry: 'Warehousing/Distribution/E-commerce',
      match_strength: 86,
      required_skills: [
        { name: 'Inventory Management', has: true },
        { name: 'Team Leadership', has: true },
        { name: 'Operations Optimization', has: true },
        { name: 'WMS Expertise', has: false },
        { name: 'Safety Certifications', has: false },
      ],
      salary_range: { low: 55000, median: 78000, high: 115000 },
      growth_outlook: 'High',
      typical_transition_time: '12-18 months',
      recommended_certifications: ['APICS CSCP', 'Occupational Safety (OSHA)', 'Forklift Certification'],
      steps: [
        { order: 1, action: 'Complete Warehouse Operations Training', description: 'WMS, safety, best practices', estimated_time: '4-8 weeks' },
        { order: 2, action: 'Get OSHA 30-Hour Safety Certification', description: 'Occupational safety knowledge', estimated_time: '3-4 weeks' },
        { order: 3, action: 'Gain Supervisor-level Experience', description: 'Lead teams, manage operations', estimated_time: '6-12 months' },
        { order: 4, action: 'Learn Advanced WMS Features', description: 'Reporting, optimization, integration', estimated_time: '4-6 weeks' },
        { order: 5, action: 'Apply to Warehouse Manager Positions', description: 'Large distribution centers or fulfillment', estimated_time: '1-2 months' },
      ],
    },
  ],
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mos = searchParams.get('mos');
    const goalRole = searchParams.get('goalRole');

    // Validate MOS code
    if (!mos || !mosDatabase[mos]) {
      return NextResponse.json(
        { error: 'Invalid or missing MOS code' },
        { status: 400 }
      );
    }

    const mosInfo = mosDatabase[mos];
    const allPathways = pathwayMappings[mos] || [];

    // Filter by goal role if provided
    let pathways = allPathways;
    if (goalRole) {
      pathways = allPathways.filter(p => p.civilian_role.toLowerCase().includes(goalRole.toLowerCase()));
    }

    // Sort by match strength descending
    pathways = pathways.sort((a, b) => b.match_strength - a.match_strength);

    const response = {
      mos: mosInfo,
      pathways,
      summary: {
        total_pathways: pathways.length,
        top_match_strength: pathways.length > 0 ? pathways[0].match_strength : 0,
        avg_match_strength: pathways.length > 0
          ? Math.round(pathways.reduce((sum, p) => sum + p.match_strength, 0) / pathways.length)
          : 0,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
