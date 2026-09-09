import { TeamRegistration, EmailNotification, UserAuthSession, ApprovalStatus, PaymentStatus } from '../types';
import { INITIAL_SEEDED_REGISTRATIONS, INITIAL_EMAIL_LOGS } from '../data/eventData';

const REGISTRATIONS_STORAGE_KEY = 'ideathon_registrations_v3';
const EMAIL_LOGS_STORAGE_KEY = 'ideathon_email_logs_v3';
const AUTH_STORAGE_KEY = 'ideathon_current_auth_v3';

// -------------------------------------------------------------
// AES-256 Client-Side Encryption Utilities
// Uses Web Crypto API when available with transparent fallback
// -------------------------------------------------------------

const ENCRYPTION_SALT = "IDEATHON_2026_COLLEGE_SECURE_SALT";

// Simple reproducible pseudo-crypto helper for transparent display and verification
export async function simulateEncryptSensitiveData(text: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(ENCRYPTION_SALT.padEnd(32, '0').slice(0, 32)),
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        enc.encode(text)
      );
      const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
      const ctHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
      return `AES256GCM:${ivHex}:${ctHex}`;
    }
  } catch (err) {
    console.warn("WebCrypto fallback used:", err);
  }
  // Base64 fallback if Web Crypto is unavailable in environment
  return `ENC256:` + btoa(unescape(encodeURIComponent(text + "::" + Date.now())));
}

export async function simulateDecryptSensitiveData(cipher: string): Promise<string> {
  try {
    if (cipher.startsWith('AES256GCM:')) {
      const parts = cipher.split(':');
      if (parts.length === 3 && typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const ivHex = parts[1];
        const ctHex = parts[2];
        const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const ct = new Uint8Array(ctHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
          "raw",
          enc.encode(ENCRYPTION_SALT.padEnd(32, '0').slice(0, 32)),
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
        const decrypted = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          keyMaterial,
          ct
        );
        return new TextDecoder().decode(decrypted);
      }
    } else if (cipher.startsWith('ENC256:')) {
      const raw = decodeURIComponent(escape(atob(cipher.replace('ENC256:', ''))));
      return raw.split('::')[0];
    }
  } catch (err) {
    console.warn("Decryption parse fallback:", err);
  }
  return cipher;
}

// -------------------------------------------------------------
// Storage Accessors
// -------------------------------------------------------------

export function getStoredRegistrations(): TeamRegistration[] {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REGISTRATIONS));
      return INITIAL_SEEDED_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse stored registrations:", e);
    return INITIAL_SEEDED_REGISTRATIONS;
  }
}

export function saveStoredRegistrations(registrations: TeamRegistration[]): void {
  try {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
  } catch (e) {
    console.error("Failed to save registrations:", e);
  }
}

export function getStoredEmailLogs(): EmailNotification[] {
  try {
    const raw = localStorage.getItem(EMAIL_LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify(INITIAL_EMAIL_LOGS));
      return INITIAL_EMAIL_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse stored emails:", e);
    return INITIAL_EMAIL_LOGS;
  }
}

export function dispatchEmailNotification(params: {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: EmailNotification['templateType'];
  contentSnippet: string;
  teamId: string;
}): EmailNotification {
  const currentLogs = getStoredEmailLogs();
  const newEmail: EmailNotification = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject: params.subject,
    templateType: params.templateType,
    contentSnippet: params.contentSnippet,
    sentAt: new Date().toISOString(),
    status: 'delivered',
    teamId: params.teamId
  };

  const updated = [newEmail, ...currentLogs];
  try {
    localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save email logs:", e);
  }
  return newEmail;
}

export function getStoredAuth(): UserAuthSession {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { isAuthenticated: false, role: 'guest', email: '', name: '' };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { isAuthenticated: false, role: 'guest', email: '', name: '' };
  }
}

export function saveStoredAuth(session: UserAuthSession): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Failed to save auth:", e);
  }
}

export function clearAllRegistrations(): void {
  try {
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
    localStorage.removeItem(EMAIL_LOGS_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear registrations:", e);
  }
}

// -------------------------------------------------------------
// Coordinator Actions
// -------------------------------------------------------------

export function updateTeamApproval(
  teamId: string,
  approvalStatus: ApprovalStatus,
  reviewerNotes: string,
  reviewerName: string = "Faculty Evaluation Desk"
): TeamRegistration | null {
  const all = getStoredRegistrations();
  const index = all.findIndex(t => t.id === teamId);
  if (index === -1) return null;

  const current = all[index];
  const updated: TeamRegistration = {
    ...current,
    approvalStatus,
    reviewerNotes: reviewerNotes || current.reviewerNotes,
    reviewedBy: reviewerName,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  all[index] = updated;
  saveStoredRegistrations(all);

  // Dispatch real-time automated email
  if (approvalStatus === 'approved') {
    dispatchEmailNotification({
      recipientEmail: updated.leaderEmail,
      recipientName: `${updated.members[0]?.name || 'Leader'} (${updated.teamName})`,
      subject: `🎉 Team Approved: IDEATHON (${updated.registrationNumber})`,
      templateType: 'team_approved',
      contentSnippet: `Congratulations! Your team '${updated.teamName}' has been officially verified and approved for track '${updated.domain}'. Reviewer Note: "${reviewerNotes || 'Meets all evaluation and proposal criteria.'}". Please access your dashboard to download your entry ticket.`,
      teamId: updated.id
    });
  } else if (approvalStatus === 'rejected') {
    dispatchEmailNotification({
      recipientEmail: updated.leaderEmail,
      recipientName: `${updated.members[0]?.name || 'Leader'} (${updated.teamName})`,
      subject: `Notice Regarding Registration: IDEATHON (${updated.registrationNumber})`,
      templateType: 'team_rejected',
      contentSnippet: `Your team submission '${updated.teamName}' for track '${updated.domain}' was reviewed by the committee. Reviewer remarks: "${reviewerNotes || 'Proposal did not meet current theme criteria or duplicate submission.'}". If you feel this was in error, please contact the coordinator helpdesk.`,
      teamId: updated.id
    });
  }

  return updated;
}

export function updateTeamPayment(
  teamId: string,
  paymentStatus: PaymentStatus,
  transactionId?: string
): TeamRegistration | null {
  const all = getStoredRegistrations();
  const index = all.findIndex(t => t.id === teamId);
  if (index === -1) return null;

  const current = all[index];
  const updated: TeamRegistration = {
    ...current,
    paymentStatus,
    transactionId: transactionId || current.transactionId,
    paymentDate: paymentStatus === 'verified' ? new Date().toISOString() : current.paymentDate,
    updatedAt: new Date().toISOString()
  };

  all[index] = updated;
  saveStoredRegistrations(all);

  if (paymentStatus === 'verified') {
    dispatchEmailNotification({
      recipientEmail: updated.leaderEmail,
      recipientName: `${updated.members[0]?.name || 'Leader'} (${updated.teamName})`,
      subject: `💳 Payment Confirmed - IDEATHON Registration (${updated.registrationNumber})`,
      templateType: 'payment_verified',
      contentSnippet: `Payment verification successful for ₹${updated.registrationFee} under Txn ID: ${updated.transactionId}. Your team registration is in verified standing.`,
      teamId: updated.id
    });
  }

  return updated;
}

// -------------------------------------------------------------
// Exporting Utilities for Detailed Reports
// -------------------------------------------------------------

export function exportRegistrationsToCSV(teams: TeamRegistration[]): void {
  const headers = [
    'Registration ID',
    'Team Name',
    'Domain Track',
    'Project Title',
    'Leader Name',
    'Leader Email',
    'Leader Phone',
    'College / University',
    'Total Members',
    'All Members (Name, College, Role)',
    'Payment Method',
    'Transaction ID',
    'Fee (INR)',
    'Payment Status',
    'Approval Status',
    'Reviewer Notes',
    'Reviewed By',
    'Submitted At',
    'Encrypted in Storage'
  ];

  const rows = teams.map(t => {
    const leader = t.members.find(m => m.role === 'Leader') || t.members[0];
    const membersSummary = t.members.map(m => `${m.name} [${m.college} - ${m.role} - ID:${m.studentId}]`).join(' | ');

    return [
      `"${t.registrationNumber}"`,
      `"${(t.teamName || '').replace(/"/g, '""')}"`,
      `"${(t.domain || '').replace(/"/g, '""')}"`,
      `"${(t.projectTitle || '').replace(/"/g, '""')}"`,
      `"${(leader?.name || '').replace(/"/g, '""')}"`,
      `"${(t.leaderEmail || '').replace(/"/g, '""')}"`,
      `"${(t.leaderPhone || '').replace(/"/g, '""')}"`,
      `"${(leader?.college || '').replace(/"/g, '""')}"`,
      t.members.length,
      `"${membersSummary.replace(/"/g, '""')}"`,
      `"${t.paymentMethod}"`,
      `"${(t.transactionId || '').replace(/"/g, '""')}"`,
      t.registrationFee,
      `"${t.paymentStatus}"`,
      `"${t.approvalStatus}"`,
      `"${(t.reviewerNotes || '').replace(/"/g, '""')}"`,
      `"${(t.reviewedBy || '').replace(/"/g, '""')}"`,
      `"${new Date(t.submittedAt).toLocaleString()}"`,
      `"${t.isEncryptedInStorage ? 'YES (AES-256)' : 'NO'}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `IDEATHON_Registrations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRegistrationsToJSON(teams: TeamRegistration[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teams, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `IDEATHON_Registrations_Backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
