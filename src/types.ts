export type DomainCategory = 
  | 'AI, Emerging Tech & Industry 4.0'
  | 'Agriculture, Food & Biotechnology'
  | 'Healthcare, Pharma & Life Sciences'
  | 'Education, Skills & Future of Work'
  | 'Cybersecurity, Digital Trust & Governance'
  | 'Smart Cities, Infrastructure & Mobility'
  | 'Environment, Energy & Sustainability'
  | 'Finance, Commerce & Digital Economy'
  | 'Space, Aerospace, Defence & Advanced Sciences'
  | 'Social Impact, Accessibility, Public Safety & Resilience';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'under_review';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'waived';

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  college: string;
  studentId: string;
  role: 'Leader' | 'Developer' | 'Designer' | 'Researcher' | 'Presenter';
  gender?: 'Male' | 'Female' | 'Other';
}

export interface TeamRegistration {
  id: string;
  registrationNumber: string; // e.g. INNO-2026-0842
  teamName: string;
  domain: DomainCategory;
  projectTitle: string;
  projectAbstract: string;
  members: TeamMember[];
  leaderEmail: string;
  leaderPhone: string;
  
  // Payment info
  registrationFee: number; // e.g. 300
  paymentMethod: 'UPI / QR' | 'Credit/Debit Card' | 'Net Banking' | 'College Desk';
  transactionId: string;
  paymentScreenshot?: string;
  paymentStatus: PaymentStatus;
  paymentDate?: string;

  // Review & Approval info
  approvalStatus: ApprovalStatus;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  // Timestamps
  submittedAt: string;
  updatedAt: string;

  // Security / encryption flag
  encryptedFieldsHash?: string;
  isEncryptedInStorage: boolean;
}

export interface DomainTrack {
  id: string;
  title: DomainCategory;
  shortDesc: string;
  iconName: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  problemStatements: string[];
  suggestedTech: string[];
  slotsAvailable: number;
  totalSlots: number;
}

export interface CoordinatorInfo {
  name: string;
  role: string;
  type: 'faculty' | 'student';
  department: string;
  phone: string;
  email: string;
  avatar: string;
  whatsappUrl?: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: 'registration_received' | 'team_approved' | 'team_rejected' | 'payment_verified' | 'pass_ready';
  contentSnippet: string;
  sentAt: string;
  status: 'delivered' | 'queued';
  teamId: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  description: string;
  day: 'Day 1 (Oct 24)' | 'Day 2 (Oct 25)';
  type: 'keynote' | 'hack' | 'evaluation' | 'food' | 'award';
}

export interface UserAuthSession {
  isAuthenticated: boolean;
  role: 'participant' | 'coordinator' | 'guest';
  email: string;
  name: string;
  teamId?: string;
}
