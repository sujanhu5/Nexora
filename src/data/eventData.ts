import { DomainCategory, TeamRegistration, EmailNotification } from '../types';

export const EVENT_DETAILS = {
  name: "NEXORA",
  edition: "2026 College Ideathon",
  theme: "Innovate. Code. Build.",
  tagline: "8-Hour College Ideathon & Prototype Challenge",
  dates: "October 30, 2026",
  duration: "8 Hours",
  venue: "CSE Block, SJBIT",
  address: "BGS Health & Education City, Dr. Vishnuvardhan Road, Kengeri, Bengaluru, Karnataka 560060",
  institution: "SJBIT",
  city: "Bengaluru, Karnataka",
  registrationFee: 300,
  currency: "₹",
  prizePool: "₹40,000",
  minTeamSize: 1,
  maxTeamSize: 4,
  totalSlots: 60,
  registrationDeadline: "October 28, 2026, 11:59 PM IST",
  supportEmail: "sjbit.nexora@gmail.com",
  helpdeskPhone: "+91 97402 00530"
};

export interface SimpleDomain {
  id: string;
  title: DomainCategory;
}

export const DOMAINS_LIST: SimpleDomain[] = [
  { id: 'ai-emerging-tech', title: 'AI, Emerging Tech & Industry 4.0' },
  { id: 'agri-biotech', title: 'Agriculture, Food & Biotechnology' },
  { id: 'healthcare-life-sciences', title: 'Healthcare, Pharma & Life Sciences' },
  { id: 'education-skills', title: 'Education, Skills & Future of Work' },
  { id: 'cybersecurity-governance', title: 'Cybersecurity, Digital Trust & Governance' },
  { id: 'smart-cities-mobility', title: 'Smart Cities, Infrastructure & Mobility' },
  { id: 'environment-sustainability', title: 'Environment, Energy & Sustainability' },
  { id: 'finance-economy', title: 'Finance, Commerce & Digital Economy' },
  { id: 'space-defence', title: 'Space, Aerospace, Defence & Advanced Sciences' },
  { id: 'social-impact-resilience', title: 'Social Impact, Accessibility, Public Safety & Resilience' }
];

export interface GuidelineCategory {
  id: string;
  category: string;
  subtitle?: string;
  rules: string[];
  badge?: string;
}

export interface JudgingCriterion {
  title: string;
  percentage: number;
  description: string;
}

export const GUIDELINES: GuidelineCategory[] = [
  {
    id: "team-eligibility",
    category: "Team & Eligibility",
    subtitle: "Squad composition & member registration",
    badge: "1–4 Members",
    rules: [
      "Team size: Typically 1–4 members per team (individual innovators or squads).",
      "Cross-department/cross-year teams allowed — multidisciplinary squads often produce the strongest ideas.",
      "One idea per team; a student cannot be part of two teams.",
      "Carry your valid college student ID card on event day (October 30, 2026)."
    ]
  },
  {
    id: "idea-originality",
    category: "Idea & Originality",
    subtitle: "Innovation integrity & differentiation",
    badge: "Strict Originality",
    rules: [
      "Idea must be original — not copied from an existing published product without significant innovation added.",
      "If inspired by an existing solution, the team must clearly state what is new and different.",
      "Plagiarism or duplicate submissions across teams will lead to immediate disqualification."
    ]
  },
  {
    id: "abstract-synopsis",
    category: "Abstract / Synopsis",
    subtitle: "Document format & file naming",
    badge: "PDF Format",
    rules: [
      "File naming convention: strictly TeamName.pdf (e.g., CyberKnights.pdf).",
      "Format: PDF only; max file size 15 MB, recommended 10–12 slides maximum.",
      "Document must highlight problem statement, solution overview, tech stack, and expected outcomes."
    ]
  },
  {
    id: "presentation-rules",
    category: "Presentation Rules",
    subtitle: "Pitch duration & speaking format",
    badge: "10-15 Min Pitch",
    rules: [
      "Time limit: 10–15 minutes presentation pitch + 3–5 minutes jury Q&A.",
      "Speaking structure: One designated presenter or all members can speak (decide and state clearly).",
      "Working prototype, interactive mockup, or architectural demo must be presented."
    ]
  },
  {
    id: "conduct-disqualification",
    category: "Conduct & Disqualification",
    subtitle: "Ethics, anti-AI clause & hardware",
    badge: "Zero Tolerance",
    rules: [
      "No plagiarized content, fabricated data, or offensive material allowed.",
      "Anti-AI clause: AI tools may be used for research/design, but the core idea and solution must be the team's own.",
      "Hardware logistics: Laptop and power adapter need to be carried by yourself.",
      "Maintain respectful professionalism across the CSE Block, SJBIT campus."
    ]
  }
];

export const JUDGING_CRITERIA: JudgingCriterion[] = [
  {
    title: "Innovation & Originality",
    percentage: 25,
    description: "Novelty, creative problem-solving, and unique innovation beyond existing market products."
  },
  {
    title: "Feasibility & Technical Viability",
    percentage: 20,
    description: "Technical realism, sound architecture, and execution feasibility within constraints."
  },
  {
    title: "Impact & Relevance to Domain/Problem",
    percentage: 20,
    description: "Magnitude of real-world impact, practical applicability, and alignment with chosen domain."
  },
  {
    title: "Business / Scalability Potential",
    percentage: 15,
    description: "Market viability, user adoption potential, economic sustainability, and scale runway."
  },
  {
    title: "Presentation & Clarity",
    percentage: 10,
    description: "Structure, pitch quality, concise communication, and presentation aesthetic."
  },
  {
    title: "Q&A Handling & Defense",
    percentage: 10,
    description: "Technical depth, response accuracy, and team confidence during jury scrutiny."
  }
];

export interface SimpleCoordinator {
  name: string;
  phone: string;
  role?: string;
}

export const COORDINATORS: SimpleCoordinator[] = [
  {
    name: "Sathvik SP",
    phone: "+91 97402 00530",
    role: "Event Coordinator"
  },
  {
    name: "Tejas S",
    phone: "+91 831 055 9438",
    role: "Event Coordinator"
  }
];

export const REGISTRATION_HELPLINES = [
  {
    phone: "+91 79046 08866",
    raw: "7904608866",
    label: "Registration Support 1"
  },
  {
    phone: "+91 73384 40272",
    raw: "7338440272",
    label: "Registration Support 2"
  }
];

export const INITIAL_SEEDED_REGISTRATIONS: TeamRegistration[] = [];
export const INITIAL_EMAIL_LOGS: EmailNotification[] = [];
