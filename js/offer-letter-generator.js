/* OBSYRA CAREER PORTAL - OFFER LETTER GENERATOR ENGINE (v8.0.0) */
const OFFER_LETTER_GENERATOR = {
  generateOfferData(candidate, job, offerDetails = {}) {
    const ctc = parseFloat(offerDetails.ctc) || 600000;
    const monthlyGross = Math.round(ctc / 12);
    const basic = Math.round(monthlyGross * 0.50);
    const hra = Math.round(basic * 0.40);
    const pf = 1800;
    const pt = 200;
    const special = Math.max(0, monthlyGross - (basic + hra + pf));
    const netTakeHome = Math.round(monthlyGross - (pf + pt));

    return {
      offerRef: 'OBS-OFFER-' + Math.floor(100000 + Math.random() * 900000),
      issueDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      candidateName: candidate.fullName || candidate.firstName + ' ' + (candidate.lastName || 'Sharma'),
      candidateEmail: candidate.email || 'candidate@example.com',
      candidatePhone: candidate.mobile || candidate.phone || '+91 9876543210',
      jobTitle: job.title || 'Network Engineer',
      department: job.department || 'Telecom Infrastructure',
      location: job.location || 'Pune, Maharashtra',
      joiningDate: offerDetails.joiningDate || '15-Sep-2026',
      annualCTC: ctc,
      ctcText: '₹' + ctc.toLocaleString('en-IN') + ' per annum',
      breakdown: {
        monthlyGross: monthlyGross,
        basic: basic,
        hra: hra,
        special: special,
        pf: pf,
        pt: pt,
        netTakeHome: netTakeHome
      },
      reportingManager: offerDetails.reportingManager || 'Anil Kumar (HR Lead)',
      company: 'Obsyra Pvt Ltd',
      companyAddress: 'Wagholi, Pune, Maharashtra 412207, India (Reg: 16 Feb 2026)'
    };
  },

  renderOfferModalHtml(offerData) {
    return `
      <div id="offerLetterDocument" style="background:white; color:#0f172a; padding:2rem; font-family:'Inter', sans-serif; border:1px solid #cbd5e1; border-radius:12px; max-width:650px; margin:0 auto; box-shadow:0 10px 30px rgba(0,0,0,0.15);">
        <!-- CORPORATE HEADER -->
        <div style="display:flex; justify-space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:1rem; margin-bottom:1.5rem;">
          <div>
            <h2 style="color:#0284c7; font-size:1.6rem; font-weight:800; margin:0;">OBSYRA PVT LTD</h2>
            <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Reg. No: OBS-2026-IN • Corporate HR Division</div>
            <div style="font-size:0.75rem; color:#64748b;">Wagholi, Pune, Maharashtra 412207, India</div>
          </div>
          <div style="text-align:right;">
            <span style="background:#e0f2fe; color:#0369a1; padding:0.3rem 0.7rem; border-radius:6px; font-weight:800; font-size:0.75rem;">OFFICIAL OFFER</span>
            <div style="font-size:0.75rem; color:#64748b; margin-top:0.35rem;">Ref: <strong>${offerData.offerRef}</strong></div>
            <div style="font-size:0.75rem; color:#64748b;">Date: ${offerData.issueDate}</div>
          </div>
        </div>

        <!-- CANDIDATE SALUTATION -->
        <div style="margin-bottom:1.25rem; font-size:0.9rem;">
          <strong>To:</strong> ${offerData.candidateName}<br>
          <strong>Email:</strong> ${offerData.candidateEmail} | <strong>Mobile:</strong> ${offerData.candidatePhone}<br>
        </div>

        <p style="font-size:0.875rem; line-height:1.65; color:#334155; margin-bottom:1.25rem;">
          Dear <strong>${offerData.candidateName}</strong>,<br>
          Following our recent interview and selection process, <strong>Obsyra Pvt Ltd</strong> is pleased to offer you the position of <strong>${offerData.jobTitle}</strong> in our <strong>${offerData.department}</strong> division based at <strong>${offerData.location}</strong>. Your expected joining date is <strong>${offerData.joiningDate}</strong>.
        </p>

        <!-- COMPENSATION TABLE -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-bottom:1.25rem;">
          <h4 style="margin-top:0; margin-bottom:0.75rem; color:#0284c7; font-weight:800; font-size:0.95rem;">COMPENSATION BREAKDOWN (ANNUAL CTC: ${offerData.ctcText})</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.825rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid #cbd5e1; color:#475569;">
                <th style="padding:0.4rem 0;">Salary Component</th>
                <th style="padding:0.4rem 0; text-align:right;">Monthly (₹)</th>
                <th style="padding:0.4rem 0; text-align:right;">Annualized (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:0.35rem 0;">Basic Salary (50%)</td>
                <td style="text-align:right;">₹${offerData.breakdown.basic.toLocaleString('en-IN')}</td>
                <td style="text-align:right;">₹${(offerData.breakdown.basic * 12).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding:0.35rem 0;">House Rent Allowance (HRA)</td>
                <td style="text-align:right;">₹${offerData.breakdown.hra.toLocaleString('en-IN')}</td>
                <td style="text-align:right;">₹${(offerData.breakdown.hra * 12).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding:0.35rem 0;">Special Allowance</td>
                <td style="text-align:right;">₹${offerData.breakdown.special.toLocaleString('en-IN')}</td>
                <td style="text-align:right;">₹${(offerData.breakdown.special * 12).toLocaleString('en-IN')}</td>
              </tr>
              <tr style="border-top:1px dashed #cbd5e1;">
                <td style="padding:0.35rem 0;">Provident Fund (PF) & PT Deductions</td>
                <td style="text-align:right; color:#ef4444;">-₹${(offerData.breakdown.pf + offerData.breakdown.pt).toLocaleString('en-IN')}</td>
                <td style="text-align:right; color:#ef4444;">-₹${((offerData.breakdown.pf + offerData.breakdown.pt) * 12).toLocaleString('en-IN')}</td>
              </tr>
              <tr style="border-top:2px solid #0284c7; font-weight:800; color:#0f172a; font-size:0.9rem;">
                <td style="padding:0.5rem 0;">ESTIMATED NET MONTHLY TAKE-HOME</td>
                <td style="text-align:right; color:#10b981;" colspan="2">₹${offerData.breakdown.netTakeHome.toLocaleString('en-IN')} / month</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TERMS & SIGNATURE BLOCK -->
        <div style="font-size:0.8rem; color:#64748b; line-height:1.5; margin-bottom:1.5rem;">
          This offer is subject to satisfactory completion of your Background Verification (BGV) and submission of educational & experience certificates.
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #e2e8f0; padding-top:1rem;">
          <div>
            <div style="font-size:0.8rem; font-weight:800; color:#0f172a;">For Obsyra Pvt Ltd</div>
            <div style="font-family:'Courier New', monospace; font-weight:800; color:#0284c7; margin-top:0.5rem;">[DIGITALLY SIGNED]</div>
            <div style="font-size:0.75rem; color:#64748b;">Authorized Signatory - HR Lead</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.8rem; font-weight:800; color:#0f172a;">Candidate Acceptance</div>
            <div style="border-bottom:1px solid #94a3b8; width:140px; margin-top:1.5rem; display:inline-block;"></div>
            <div style="font-size:0.75rem; color:#64748b;">Signature & Date</div>
          </div>
        </div>
      </div>
    `;
  }
};
