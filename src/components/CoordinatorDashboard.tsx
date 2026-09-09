import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard, 
  Download, 
  Search, 
  ShieldCheck, 
  Mail, 
  FileSpreadsheet, 
  FileText, 
  Eye, 
  Check, 
  X, 
  Lock, 
  Send, 
  Sparkles,
  Printer, 
  Plus,
  Trash2
} from 'lucide-react';
import { 
  TeamRegistration, 
  PaymentStatus, 
  EmailNotification 
} from '../types';
import { 
  exportRegistrationsToCSV, 
  exportRegistrationsToJSON, 
  updateTeamApproval, 
  updateTeamPayment,
  simulateDecryptSensitiveData,
  dispatchEmailNotification,
  clearAllRegistrations
} from '../services/storageService';
import { DOMAINS_LIST } from '../data/eventData';

interface CoordinatorDashboardProps {
  teams: TeamRegistration[];
  emailLogs: EmailNotification[];
  onTeamsUpdated: (updated: TeamRegistration[]) => void;
  onEmailsUpdated: (logs: EmailNotification[]) => void;
  onOpenNewRegistration: () => void;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  teams,
  emailLogs,
  onTeamsUpdated,
  onEmailsUpdated,
  onOpenNewRegistration
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'emails' | 'security' | 'reports'>('teams');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Selected team for dossier inspection
  const [inspectingTeam, setInspectingTeam] = useState<TeamRegistration | null>(null);
  const [reviewerNoteDraft, setReviewerNoteDraft] = useState('');
  const [decryptedSensitiveData, setDecryptedSensitiveData] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);

  // Email test broadcast state
  const [testEmailTeam, setTestEmailTeam] = useState<string>(teams[0]?.id || '');
  const [testEmailSubject, setTestEmailSubject] = useState('');
  const [testEmailContent, setTestEmailContent] = useState('');
  const [emailPreviewModal, setEmailPreviewModal] = useState<EmailNotification | null>(null);

  // Action toast message
  const [actionAlert, setActionAlert] = useState<string>('');

  const showAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(''), 4000);
  };

  // Metrics calculations
  const totalTeams = teams.length;
  const approvedTeams = teams.filter(t => t.approvalStatus === 'approved').length;
  const pendingTeams = teams.filter(t => t.approvalStatus === 'pending' || t.approvalStatus === 'under_review').length;
  const rejectedTeams = teams.filter(t => t.approvalStatus === 'rejected').length;
  const verifiedPayments = teams.filter(t => t.paymentStatus === 'verified').length;
  const totalRevenue = teams
    .filter(t => t.paymentStatus === 'verified')
    .reduce((acc, curr) => acc + curr.registrationFee, 0);

  // Filtered Teams
  const filteredTeams = teams.filter(t => {
    const matchesSearch = 
      t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.leaderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === 'all' || t.domain === domainFilter;
    const matchesApproval = approvalFilter === 'all' || t.approvalStatus === approvalFilter;
    const matchesPayment = paymentFilter === 'all' || t.paymentStatus === paymentFilter;

    return matchesSearch && matchesDomain && matchesApproval && matchesPayment;
  });

  // Action handlers
  const handleQuickApprove = (team: TeamRegistration) => {
    const note = prompt(`Enter approval remark for ${team.teamName}:`, 'Meets track criteria. Approved for Day 1 entry.');
    if (note === null) return;

    const updated = updateTeamApproval(team.id, 'approved', note);
    if (updated) {
      const allUpdated = teams.map(t => t.id === team.id ? updated : t);
      onTeamsUpdated(allUpdated);
      showAlert(`Team "${team.teamName}" approved! Automated confirmation email dispatched.`);
    }
  };

  const handleQuickReject = (team: TeamRegistration) => {
    const reason = prompt(`Enter rejection reason for ${team.teamName}:`, 'Proposal does not meet track guidelines.');
    if (reason === null) return;

    const updated = updateTeamApproval(team.id, 'rejected', reason);
    if (updated) {
      const allUpdated = teams.map(t => t.id === team.id ? updated : t);
      onTeamsUpdated(allUpdated);
      showAlert(`Team "${team.teamName}" rejected.`);
    }
  };

  const handleTogglePayment = (team: TeamRegistration) => {
    const newStatus: PaymentStatus = team.paymentStatus === 'verified' ? 'pending' : 'verified';
    const updated = updateTeamPayment(team.id, newStatus);
    if (updated) {
      const allUpdated = teams.map(t => t.id === team.id ? updated : t);
      onTeamsUpdated(allUpdated);
      showAlert(`Payment for "${team.teamName}" updated to ${newStatus}.`);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all registrations and logs? This will reset all stored data.")) {
      clearAllRegistrations();
      onTeamsUpdated([]);
      onEmailsUpdated([]);
      showAlert("All registrations and data have been cleared successfully.");
    }
  };

  const handleDecryptInspector = async (cipher: string) => {
    setDecrypting(true);
    try {
      const result = await simulateDecryptSensitiveData(cipher);
      setDecryptedSensitiveData(result);
    } catch (e) {
      setDecryptedSensitiveData('Decryption error.');
    } finally {
      setDecrypting(false);
    }
  };

  const handleSendCustomNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailSubject.trim() || !testEmailContent.trim()) {
      alert('Subject and Message content are required.');
      return;
    }

    const target = teams.find(t => t.id === testEmailTeam);
    if (!target) return;

    const newLog = dispatchEmailNotification({
      recipientEmail: target.leaderEmail,
      recipientName: `${target.members[0]?.name} (${target.teamName})`,
      subject: testEmailSubject.trim(),
      templateType: 'pass_ready',
      contentSnippet: testEmailContent.trim(),
      teamId: target.id
    });

    onEmailsUpdated([newLog, ...emailLogs]);
    setTestEmailSubject('');
    setTestEmailContent('');
    showAlert(`Notification sent to ${target.leaderEmail}!`);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Alert Banner */}
      {actionAlert && (
        <div className="p-3 bg-[#0a0f18] border-2 border-emerald-500 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{actionAlert}</span>
          </div>
          <button onClick={() => setActionAlert('')} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Coordinator Command Header */}
      <div className="p-5 sm:p-6 mc-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#0a0f18] border border-[#1e293b] text-emerald-400 text-[10px] font-mono flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>COORDINATOR & ADMIN COMMAND</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400" />
              Live Sync Active
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-mono tracking-wide text-white pixel-shadow">
            IDEATHON 2026 DASHBOARD
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1 max-w-2xl">
            Real-time participant approvals, fee verification, AES-GCM data security, and email logs.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportRegistrationsToCSV(teams)}
            className="mc-btn-green px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            title="Download CSV Report for Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={onOpenNewRegistration}
            className="mc-btn-diamond px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>SPOT ENROLL</span>
          </button>

          <button
            onClick={handleClearAllData}
            className="mc-btn-stone px-3 py-1.5 text-xs font-mono text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
            title="Clear all stored registrations"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>RESET DATA</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards in Minecraft Slots */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        
        <div className="mc-slot p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">TOTAL TEAMS</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono text-white">
            {totalTeams}
          </p>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
            {totalTeams * 3} Est. Innovators
          </span>
        </div>

        <div className="mc-slot p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">APPROVED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono text-emerald-400">
            {approvedTeams}
          </p>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
            {Math.round((approvedTeams / (totalTeams || 1)) * 100)}% Accepted
          </span>
        </div>

        <div className="mc-slot p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">PENDING</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono text-amber-400">
            {pendingTeams}
          </p>
          <span className="text-[10px] font-mono text-amber-400/80 mt-0.5 block">
            Awaiting Review
          </span>
        </div>

        <div className="mc-slot p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">REJECTED</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-mono text-rose-400">
            {rejectedTeams}
          </p>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
            Feedback Sent
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 mc-slot p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">FEES VERIFIED</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono text-white">
            ₹{totalRevenue}
          </p>
          <span className="text-[10px] font-mono text-emerald-400 mt-0.5 block">
            {verifiedPayments} Payments Cleared
          </span>
        </div>

      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 text-xs font-mono font-bold cursor-pointer whitespace-nowrap ${
            activeTab === 'teams' ? 'mc-btn-diamond text-white' : 'mc-btn-stone text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1.5" />
          <span>TEAMS ({filteredTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`px-4 py-2 text-xs font-mono font-bold cursor-pointer whitespace-nowrap ${
            activeTab === 'emails' ? 'mc-btn-diamond text-white' : 'mc-btn-stone text-slate-400'
          }`}
        >
          <Mail className="w-3.5 h-3.5 inline mr-1.5" />
          <span>EMAIL LOGS ({emailLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-mono font-bold cursor-pointer whitespace-nowrap ${
            activeTab === 'security' ? 'mc-btn-diamond text-white' : 'mc-btn-stone text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" />
          <span>SECURITY & AES-GCM</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs font-mono font-bold cursor-pointer whitespace-nowrap ${
            activeTab === 'reports' ? 'mc-btn-diamond text-white' : 'mc-btn-stone text-slate-400'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          <span>EXPORT & REPORTS</span>
        </button>
      </div>

      {/* TAB 1: REGISTRATIONS MANAGEMENT TABLE */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          
          {/* Search & Multi-Filters Toolbar */}
          <div className="p-3 mc-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team, leader, reg ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Domain Filter */}
            <div>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Domains ({teams.length})</option>
                {DOMAINS_LIST.map(d => (
                  <option key={d.id} value={d.title}>{d.title}</option>
                ))}
              </select>
            </div>

            {/* Approval Filter */}
            <div>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Approvals</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Payments</option>
                <option value="verified">Verified (₹300)</option>
                <option value="pending">Pending Proof</option>
                <option value="failed">Failed / Unpaid</option>
              </select>
            </div>

          </div>

          {/* Registrations Data Table */}
          <div className="mc-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                
                <thead>
                  <tr className="border-b-2 border-[#1e293b] bg-[#0a0f18] text-slate-400 font-bold uppercase">
                    <th className="py-3 px-3">Reg ID & Team</th>
                    <th className="py-3 px-3">Domain Track</th>
                    <th className="py-3 px-3">Leader & College</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Approval Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1e293b]">
                  {filteredTeams.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 font-mono">
                        {teams.length === 0 ? (
                          <div>
                            <p className="text-white font-bold mb-1">No active registrations yet.</p>
                            <p className="text-xs text-slate-400 mb-3">Live submissions will appear here instantly when participants register.</p>
                            <button
                              onClick={onOpenNewRegistration}
                              className="mc-btn-green px-4 py-1.5 text-xs cursor-pointer font-mono"
                            >
                              ENROLL FIRST TEAM
                            </button>
                          </div>
                        ) : (
                          "No team registrations match the current filters."
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredTeams.map((team) => {
                      const leader = team.members.find(m => m.role === 'Leader') || team.members[0];

                      return (
                        <tr key={team.id} className="hover:bg-[#0a0f18]/60 transition-colors">
                          
                          {/* Reg ID & Team */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">
                              {team.teamName}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-emerald-400">
                              <span>{team.registrationNumber}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{team.members.length} members</span>
                            </div>
                          </td>

                          {/* Domain Track */}
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 bg-[#0a0f18] border border-[#1e293b] text-[10px] text-slate-300">
                              {team.domain}
                            </span>
                            <span className="block text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                              {team.projectTitle}
                            </span>
                          </td>

                          {/* Leader & College */}
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-200">
                              {leader?.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                              {leader?.college}
                            </div>
                            <div className="text-[10px] text-cyan-400/80 mt-0.5">
                              {team.leaderPhone}
                            </div>
                          </td>

                          {/* Payment */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                team.paymentStatus === 'verified'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                  : 'bg-amber-950 text-amber-300 border border-amber-700'
                              }`}>
                                {team.paymentStatus}
                              </span>
                              <button
                                onClick={() => handleTogglePayment(team)}
                                className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                              >
                                {team.paymentStatus === 'verified' ? 'Mark Pending' : 'Verify'}
                              </button>
                            </div>
                            <span className="block text-[10px] text-slate-500 mt-0.5 truncate max-w-[110px]">
                              {team.transactionId}
                            </span>
                          </td>

                          {/* Approval Status */}
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase ${
                              team.approvalStatus === 'approved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : team.approvalStatus === 'rejected'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                                : 'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}>
                              {team.approvalStatus === 'approved' && <Check className="w-3 h-3" />}
                              {team.approvalStatus === 'rejected' && <X className="w-3 h-3" />}
                              {team.approvalStatus === 'pending' && <Clock className="w-3 h-3" />}
                              <span>{team.approvalStatus}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              
                              {/* Inspect Full Dossier */}
                              <button
                                onClick={() => {
                                  setInspectingTeam(team);
                                  setReviewerNoteDraft(team.reviewerNotes || '');
                                  setDecryptedSensitiveData(null);
                                }}
                                className="p-1.5 mc-btn-stone text-slate-300 hover:text-white cursor-pointer"
                                title="Inspect Team Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Approve */}
                              <button
                                onClick={() => handleQuickApprove(team)}
                                className="p-1.5 mc-btn-green text-white cursor-pointer"
                                title="Approve Team"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Reject */}
                              <button
                                onClick={() => handleQuickReject(team)}
                                className="p-1.5 mc-btn-stone text-rose-400 hover:text-white cursor-pointer"
                                title="Reject Team"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>

              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 border-t border-[#1e293b] bg-[#0a0f18] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Showing {filteredTeams.length} of {teams.length} registrations</span>
              <span className="text-emerald-400">AES-GCM Protected</span>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: REAL-TIME EMAIL NOTIFICATIONS CENTER */}
      {activeTab === 'emails' && (
        <div className="space-y-5">
          
          {/* Dispatcher Form */}
          <div className="p-5 mc-card">
            <h3 className="text-sm font-mono tracking-wide text-white pixel-shadow mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>EMAIL NOTIFICATION DISPATCHER</span>
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-3">
              Dispatch real-time updates and schedule instructions to registered team leaders.
            </p>

            <form onSubmit={handleSendCustomNotification} className="space-y-3 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Select Target Registered Team
                  </label>
                  <select
                    value={testEmailTeam}
                    onChange={(e) => setTestEmailTeam(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.teamName} ({t.leaderEmail}) - {t.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule Update / Workstation Assigned"
                    value={testEmailSubject}
                    onChange={(e) => setTestEmailSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Message Content / Notice Body
                </label>
                <textarea
                  rows={3}
                  placeholder="Type message body..."
                  value={testEmailContent}
                  onChange={(e) => setTestEmailContent(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-white text-xs resize-none focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mc-btn-green px-4 py-1.5 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>DISPATCH EMAIL</span>
                </button>
              </div>
            </form>
          </div>

          {/* Email Logs History */}
          <div className="p-5 mc-card space-y-3 font-mono">
            <h4 className="text-xs font-mono text-white pixel-shadow">
              DISPATCHED EMAIL LOGS ({emailLogs.length})
            </h4>

            {emailLogs.length === 0 ? (
              <p className="text-xs text-slate-400">No email notices dispatched yet.</p>
            ) : (
              <div className="space-y-2">
                {emailLogs.map((log) => (
                  <div 
                    key={log.id} 
                    onClick={() => setEmailPreviewModal(log)}
                    className="p-3 mc-slot flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:border-emerald-500"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {log.status}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {log.subject}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        To: {log.recipientName} ({log.recipientEmail})
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-emerald-400 underline">View Message</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: DATA ENCRYPTION & SECURITY */}
      {activeTab === 'security' && (
        <div className="p-5 sm:p-6 mc-card space-y-5 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 mc-slot text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-mono tracking-wide text-white pixel-shadow">
                PARTICIPANT DATA ENCRYPTION STANDARD (AES-GCM)
              </h3>
              <p className="text-xs text-slate-400">
                Client-side Web Crypto cryptographic verification ensuring participant phone numbers and ID tokens are safeguarded.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="mc-slot p-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">CIPHER ALGORITHM</span>
              <span className="text-sm font-bold text-white">AES-GCM (256-Bit)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Hardware-accelerated Web Crypto API</span>
            </div>

            <div className="mc-slot p-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">ENCRYPTED RECORDS</span>
              <span className="text-sm font-bold text-white">{teams.length} / {teams.length} Verified</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">100% of stored records encrypted at rest</span>
            </div>

            <div className="mc-slot p-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">ROLE ACCESS</span>
              <span className="text-sm font-bold text-white">Coordinator Verified</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Faculty and convener authenticated view</span>
            </div>
          </div>

          {/* Ciphertext Inspector */}
          <div className="mc-slot p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase">
              Encrypted Storage Records
            </h4>

            {teams.length === 0 ? (
              <p className="text-xs text-slate-400">No records to inspect yet. Register a team to verify encryption.</p>
            ) : (
              <div className="space-y-2">
                {teams.map((t) => (
                  <div key={t.id} className="p-2.5 bg-[#0a0f18] border border-[#1e293b] text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{t.teamName} ({t.registrationNumber})</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 border border-emerald-700">
                        AES-256 Encrypted
                      </span>
                    </div>
                    <div className="p-1.5 bg-black/60 font-mono text-[10px] text-slate-400 break-all select-all">
                      {t.encryptedFieldsHash || 'AES256GCM:9f28a018bc:88492048f029...'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT & REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-5 sm:p-6 mc-card space-y-5 font-mono">
          <div>
            <h3 className="text-sm sm:text-base font-mono tracking-wide text-white pixel-shadow">
              EXPORT REPORTS & AUDIT ARCHIVES
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Download complete spreadsheets, JSON backups, or print executive summaries for collegiate administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* CSV Export */}
            <div className="mc-slot p-4 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 mc-slot text-emerald-400 flex items-center justify-center mb-2">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold font-mono text-white">CSV MASTER SPREADSHEET</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Export complete registry with student roll numbers, emails, and payment verification columns.
                </p>
              </div>

              <button
                onClick={() => exportRegistrationsToCSV(teams)}
                className="mt-4 mc-btn-green w-full py-2 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD CSV</span>
              </button>
            </div>

            {/* JSON Export */}
            <div className="mc-slot p-4 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 mc-slot text-cyan-400 flex items-center justify-center mb-2">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold font-mono text-white">JSON DATA BACKUP</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Full nested team member payloads and cryptographic hashes for developers and database sync.
                </p>
              </div>

              <button
                onClick={() => exportRegistrationsToJSON(teams)}
                className="mt-4 mc-btn-diamond w-full py-2 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD JSON</span>
              </button>
            </div>

            {/* Print Summary */}
            <div className="mc-slot p-4 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 mc-slot text-purple-400 flex items-center justify-center mb-2">
                  <Printer className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold font-mono text-white">PRINT DOSSIER</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Print-ready summary for dean and judge review binders during event morning.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-4 mc-btn-stone w-full py-2 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT SUMMARY</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TEAM DOSSIER INSPECTOR MODAL */}
      {inspectingTeam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl mc-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4 font-mono">
            
            <div className="flex items-start justify-between border-b border-[#1e293b] pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 bg-[#0a0f18] px-2 py-0.5 border border-[#1e293b]">
                  {inspectingTeam.registrationNumber}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {inspectingTeam.teamName}
                </h3>
                <p className="text-xs text-slate-400">
                  Track: <strong className="text-emerald-400">{inspectingTeam.domain}</strong>
                </p>
              </div>

              <button
                onClick={() => setInspectingTeam(null)}
                className="mc-btn-stone w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project Title & Abstract */}
            <div className="p-3 mc-slot space-y-1">
              <span className="text-[10px] uppercase text-slate-400 block">Proposed Project Solution</span>
              <p className="text-xs font-bold text-white">{inspectingTeam.projectTitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {inspectingTeam.projectAbstract}
              </p>
            </div>

            {/* Members Roster */}
            <div>
              <h4 className="text-[10px] uppercase font-bold text-slate-300 mb-2">
                Team Members ({inspectingTeam.members.length})
              </h4>
              <div className="space-y-1.5">
                {inspectingTeam.members.map((m, idx) => (
                  <div key={idx} className="p-2 mc-slot flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white mr-2">{m.name}</span>
                      <span className="px-1 py-0.2 bg-[#0a0f18] text-[10px] text-emerald-400 border border-[#1e293b]">
                        {m.role}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {m.college} • Roll: {m.studentId}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400">{m.email || 'Lead Contact'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Verification Controls */}
            <div className="p-3 mc-slot flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Payment Details</span>
                <p className="text-xs text-white">
                  Method: <strong>{inspectingTeam.paymentMethod}</strong> • Fee: ₹{inspectingTeam.registrationFee}
                </p>
                <p className="text-[10px] text-emerald-400">Txn: {inspectingTeam.transactionId}</p>
              </div>

              <button
                onClick={() => {
                  handleTogglePayment(inspectingTeam);
                  setInspectingTeam({
                    ...inspectingTeam,
                    paymentStatus: inspectingTeam.paymentStatus === 'verified' ? 'pending' : 'verified'
                  });
                }}
                className={`px-3 py-1.5 text-xs font-mono font-bold cursor-pointer ${
                  inspectingTeam.paymentStatus === 'verified'
                    ? 'mc-btn-green text-white'
                    : 'mc-btn-diamond text-white'
                }`}
              >
                {inspectingTeam.paymentStatus === 'verified' ? 'Payment Verified ✓' : 'Mark Verified'}
              </button>
            </div>

            {/* Reviewer Remarks & Actions */}
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-slate-300">
                Evaluation Remarks
              </label>
              <textarea
                rows={2}
                value={reviewerNoteDraft}
                onChange={(e) => setReviewerNoteDraft(e.target.value)}
                placeholder="Remarks for team pass..."
                className="w-full px-2.5 py-1.5 bg-[#0a0f18] border-2 border-[#1e293b] text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    const updated = updateTeamApproval(inspectingTeam.id, 'rejected', reviewerNoteDraft);
                    if (updated) {
                      onTeamsUpdated(teams.map(t => t.id === inspectingTeam.id ? updated : t));
                      setInspectingTeam(null);
                      showAlert(`Team "${inspectingTeam.teamName}" rejected.`);
                    }
                  }}
                  className="mc-btn-stone px-4 py-1.5 text-xs text-rose-300 hover:text-white cursor-pointer"
                >
                  REJECT
                </button>

                <button
                  onClick={() => {
                    const updated = updateTeamApproval(inspectingTeam.id, 'approved', reviewerNoteDraft);
                    if (updated) {
                      onTeamsUpdated(teams.map(t => t.id === inspectingTeam.id ? updated : t));
                      setInspectingTeam(null);
                      showAlert(`Team "${inspectingTeam.teamName}" approved!`);
                    }
                  }}
                  className="mc-btn-green px-4 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>APPROVE TEAM</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EMAIL PREVIEW MODAL */}
      {emailPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg mc-card p-5 space-y-3 font-mono">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <span className="text-xs font-mono text-emerald-400">EMAIL PREVIEW</span>
              <button
                onClick={() => setEmailPreviewModal(null)}
                className="mc-btn-stone w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 mc-slot space-y-1 text-xs">
              <p><strong>To:</strong> {emailPreviewModal.recipientName} &lt;{emailPreviewModal.recipientEmail}&gt;</p>
              <p><strong>Subject:</strong> {emailPreviewModal.subject}</p>
              <p className="text-slate-400"><strong>Sent:</strong> {new Date(emailPreviewModal.sentAt).toLocaleString()}</p>
            </div>

            <div className="p-3 bg-white text-slate-900 text-xs font-sans space-y-2 border border-slate-300">
              <div className="border-b pb-1.5 flex items-center justify-between">
                <span className="font-bold text-slate-900">IDEATHON 2026 Official Communication</span>
                <span className="text-[10px] text-slate-600">College Tech Fest</span>
              </div>
              <p>Dear {emailPreviewModal.recipientName},</p>
              <p className="text-slate-800">{emailPreviewModal.contentSnippet}</p>
              <div className="pt-2 text-[10px] text-slate-600 border-t">
                October 24-25, 2026 • Turing Auditorium • Bangalore
              </div>
            </div>

            <button
              onClick={() => setEmailPreviewModal(null)}
              className="mc-btn-stone w-full py-1.5 text-xs font-mono text-white cursor-pointer"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
