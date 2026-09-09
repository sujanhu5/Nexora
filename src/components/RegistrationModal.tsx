import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  QrCode,
  Phone 
} from 'lucide-react';
import { DomainCategory, TeamMember, TeamRegistration } from '../types';
import { DOMAINS_LIST, EVENT_DETAILS } from '../data/eventData';
import { simulateEncryptSensitiveData, dispatchEmailNotification } from '../services/storageService';
import { QRCodeDisplay } from './QRCodeDisplay';
import { NexoraLogo } from './NexoraLogo';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulRegistration: (team: TeamRegistration) => void;
  initialDomain?: DomainCategory;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessfulRegistration,
  initialDomain
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Team & Project Info
  const [teamName, setTeamName] = useState('');
  const [domain, setDomain] = useState<DomainCategory>(initialDomain || DOMAINS_LIST[0].title);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectAbstract, setProjectAbstract] = useState('');

  // Step 2: Leader & Members Info (1 to 4 members: 1 Leader + 0 to 3 Members)
  const [leader, setLeader] = useState<TeamMember>({
    id: 'leader_1',
    name: '',
    email: '',
    phone: '',
    college: '',
    studentId: '',
    role: 'Leader',
    gender: 'Male'
  });

  const [members, setMembers] = useState<TeamMember[]>([]);

  // Step 3: Payment
  const [paymentMethod] = useState<'UPI / QR' | 'Credit/Debit Card' | 'Net Banking' | 'College Desk'>('UPI / QR');
  const [transactionId, setTransactionId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const finalFee = discountApplied ? Math.max(0, EVENT_DETAILS.registrationFee - 100) : EVENT_DETAILS.registrationFee;

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (members.length >= 3) {
      setErrorMsg('Maximum team size is 4 members (1 Leader + 3 Members).');
      return;
    }
    setMembers([
      ...members,
      {
        id: `member_${Date.now()}`,
        name: '',
        college: leader.college || '',
        studentId: '',
        role: 'Developer',
        gender: 'Other'
      }
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
  };

  const handleMemberChange = (idx: number, field: keyof TeamMember, val: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: val };
    setMembers(updated);
  };

  const handleApplyCoupon = () => {
    if (
      couponCode.trim().toUpperCase() === 'NEXORA' ||
      couponCode.trim().toUpperCase() === 'SJBIT' ||
      couponCode.trim().toUpperCase() === 'INNOVATE'
    ) {
      setDiscountApplied(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid coupon code. Try NEXORA or SJBIT for ₹100 discount.');
    }
  };

  const validateStep1 = () => {
    if (!teamName.trim()) return 'Please enter a team name.';
    if (!projectTitle.trim()) return 'Please enter your project / idea title.';
    if (!projectAbstract.trim() || projectAbstract.trim().length < 15) {
      return 'Please enter a brief project abstract (minimum 15 characters).';
    }
    return '';
  };

  const validateStep2 = () => {
    if (!leader.name.trim()) return 'Leader name is required.';
    if (!leader.email.trim() || !leader.email.includes('@')) return 'Valid leader email is required.';
    if (!leader.phone.trim() || leader.phone.trim().length < 10) return 'Valid 10-digit leader phone number is required.';
    if (!leader.studentId.trim()) return 'Leader student roll/ID number is required.';
    if (!leader.college.trim()) return 'Leader institution / college name is required.';

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim()) return `Member ${i + 2} name is required.`;
      if (!m.studentId.trim()) return `Member ${i + 2} student ID is required.`;
    }
    return '';
  };

  const validateStep3 = () => {
    if (!transactionId.trim()) {
      return 'Please enter the UPI Transaction Reference ID / UTR number.';
    }
    return '';
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      const err = validateStep1();
      if (err) { setErrorMsg(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setErrorMsg(err); return; }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setErrorMsg(err); return; }
      handleSubmitRegistration();
    }
  };

  const handleSubmitRegistration = async () => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const regNumber = `NEXORA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTeamId = `team_${Date.now()}`;
      const nowIso = new Date().toISOString();

      const sensitivePayload = JSON.stringify({
        leaderPhone: leader.phone,
        leaderStudentId: leader.studentId,
        txn: transactionId,
        membersPhoneMap: members.map(m => ({ id: m.id, studentId: m.studentId }))
      });

      const encryptedCipher = await simulateEncryptSensitiveData(sensitivePayload);

      const newRegistration: TeamRegistration = {
        id: newTeamId,
        registrationNumber: regNumber,
        teamName: teamName.trim(),
        domain,
        projectTitle: projectTitle.trim(),
        projectAbstract: projectAbstract.trim(),
        members: [leader, ...members],
        leaderEmail: leader.email.trim(),
        leaderPhone: leader.phone.trim(),
        registrationFee: finalFee,
        paymentMethod,
        transactionId: transactionId.trim(),
        paymentStatus: 'verified',
        paymentDate: nowIso,
        approvalStatus: 'approved',
        submittedAt: nowIso,
        updatedAt: nowIso,
        isEncryptedInStorage: true,
        encryptedFieldsHash: encryptedCipher.slice(0, 16)
      };

      dispatchEmailNotification({
        recipientEmail: leader.email.trim(),
        recipientName: `${leader.name} (${teamName.trim()})`,
        subject: `🎉 Registration Confirmed: NEXORA 2026 (${regNumber})`,
        templateType: 'registration_received',
        contentSnippet: `Your team '${teamName.trim()}' has successfully registered for NEXORA 2026 under domain '${domain}'. Registration Code: ${regNumber}. Venue: CSE Block, SJBIT on October 30, 2026.`,
        teamId: newTeamId
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors
      }

      onSuccessfulRegistration(newRegistration);
      setStep(4);
    } catch (err: any) {
      setErrorMsg('Failed to process registration. Please check inputs and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden flex flex-col max-h-[90vh] border border-cyan-500/30 shadow-2xl">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <NexoraLogo size="sm" showWordmark={true} />
            <div className="hidden sm:block h-6 w-px bg-white/10" />
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-wider">CSE Block, SJBIT</span>
              <span className="text-xs font-semibold text-slate-300">Registration Portal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Indicator */}
        {step < 4 && (
          <div className="px-6 py-3 bg-white/[0.01] border-b border-white/10">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-400">
              <span className={step >= 1 ? 'text-cyan-400' : ''}>1. Project & Domain</span>
              <span>→</span>
              <span className={step >= 2 ? 'text-cyan-400' : ''}>2. Team (1–4 Members)</span>
              <span>→</span>
              <span className={step >= 3 ? 'text-cyan-400' : ''}>3. Payment (₹{finalFee})</span>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Team & Project Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nexus Innovators"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Domain *
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090e1a] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400/60"
                >
                  {DOMAINS_LIST.map(t => (
                    <option key={t.id} value={t.title}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project / Idea Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart Energy Grid & Waste Management Node"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Abstract / Description (minimum 15 characters) *
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what problem you are solving and how your solution works..."
                  value={projectAbstract}
                  onChange={(e) => setProjectAbstract(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400/60"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5 font-mono">
                  <span className="text-cyan-400">ℹ</span> PDF naming format: <span className="text-cyan-300 font-semibold">{teamName.trim() ? `${teamName.trim().replace(/\s+/g, '')}.pdf` : 'TeamName.pdf'}</span> (max 15MB, PDF only)
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Team Members (1 to 4 members) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between">
                <span>Teams of 1–4 members. Cross-department & cross-year squads allowed.</span>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">1 Idea Per Team</span>
              </div>
              
              {/* Leader Card */}
              <div className="glass-slot p-4 rounded-2xl space-y-3 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    TEAM LEADER (MEMBER 1)
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
                    Primary Contact • Email & Phone
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={leader.name}
                    onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                  />
                  <input
                    type="email"
                    placeholder="Leader Email Address *"
                    value={leader.email}
                    onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                  />
                  <input
                    type="tel"
                    placeholder="Leader Phone (10 digits) *"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                  />
                  <input
                    type="text"
                    placeholder="Student ID / USN *"
                    value={leader.studentId}
                    onChange={(e) => setLeader({ ...leader, studentId: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                  />
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="College / Institution Name (e.g. SJBIT) *"
                      value={leader.college}
                      onChange={(e) => setLeader({ ...leader, college: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Members */}
              {members.map((member, idx) => (
                <div key={member.id} className="glass-slot p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        MEMBER {idx + 2}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        Teammate
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Member Name *"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                    />
                    <input
                      type="text"
                      placeholder="Student ID / USN *"
                      value={member.studentId}
                      onChange={(e) => handleMemberChange(idx, 'studentId', e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-400/60"
                    />
                  </div>
                </div>
              ))}

              {members.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="glass-btn-secondary w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer border border-dashed border-cyan-500/30"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Add Member ({members.length + 1} of 4 max)</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Fee summary */}
              <div className="p-4 rounded-2xl glass-slot flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Team Registration Fee</span>
                  <span className="text-base font-bold text-white font-display">₹{finalFee} / Team</span>
                </div>
                {discountApplied ? (
                  <span className="text-xs font-semibold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    ₹100 Coupon Applied
                  </span>
                ) : (
                  <span className="text-xs text-cyan-400 font-mono">
                    NEXORA 2026 Entry
                  </span>
                )}
              </div>

              {/* Coupon input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. NEXORA or SJBIT)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs uppercase focus:outline-none focus:border-cyan-400/60 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="glass-btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Payment Instructions & QR */}
              <div className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row items-center gap-5">
                <div className="text-center flex-shrink-0 bg-white p-3 rounded-2xl shadow-lg">
                  <QRCodeDisplay
                    value={`upi://pay?pa=nexora@upi&pn=NEXORA2026&am=${finalFee}&cu=INR`}
                    size={130}
                  />
                  <span className="block text-[10px] text-slate-700 mt-1 font-semibold">
                    Scan via GPay / PhonePe / Paytm
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>Official UPI VPA:</span>
                  </p>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-cyan-400 text-sm font-bold select-all">
                    nexora@upi
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pay <strong>₹{finalFee}</strong> and enter your 12-digit UPI Reference / UTR Number below.
                  </p>
                </div>
              </div>

              {/* Transaction ID input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Transaction Reference ID / UTR Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 409281928491 or TXN_987654"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400/60"
                />
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl glass-slot flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>
                  Team information and payment reference will be recorded directly for the NEXORA organizing committee at CSE Block, SJBIT.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Registration Receipt & Confirmation */}
          {step === 4 && (
            <div className="py-6 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-syne font-bold text-white">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Your team enrollment for NEXORA 2026 has been recorded.
                </p>
              </div>

              {/* Printable Cyber Receipt Slip */}
              <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/30 text-left max-w-md mx-auto space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    NEXORA 2026 REGISTRATION SLIP
                  </span>
                  <div className="cyber-dot" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">TEAM NAME</span>
                    <strong className="text-white text-sm">{teamName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DOMAIN</span>
                    <span className="text-cyan-300 text-xs font-semibold">{domain}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">TEAM LEADER</span>
                    <span className="text-slate-200">{leader.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">FEE PAID</span>
                    <span className="text-emerald-400 font-bold">₹{finalFee}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px]">TRANSACTION REFERENCE</span>
                    <span className="text-slate-300 text-xs break-all">{transactionId}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>VENUE: CSE BLOCK, SJBIT</span>
                  <span className="text-cyan-400">OCT 30, 2026 (8 HR)</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="glass-btn-secondary px-5 py-2.5 rounded-xl text-xs font-mono font-semibold text-slate-200 hover:text-white cursor-pointer"
                >
                  Print / Save Receipt
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-btn-primary px-7 py-2.5 rounded-xl text-xs font-mono font-bold text-white uppercase tracking-wider cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        {step < 4 && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep((step - 1) as any);
                }}
                className="glass-btn-secondary px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="glass-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>SUBMITTING REGISTRATION...</span>
              ) : step === 3 ? (
                <span>CONFIRM & SUBMIT REGISTRATION</span>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
