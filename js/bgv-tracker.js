/* OBSYRA CAREER PORTAL - BACKGROUND VERIFICATION (BGV) TRACKER ENGINE (v8.0.0) */
const BGV_TRACKER = {
  getInitialChecklist(candidateId) {
    return [
      { id: 'BGV-01', name: 'Identity & Aadhaar / PAN Verification', status: 'VERIFIED', vendor: 'UIDAI API', updated: '01-Sep-2026' },
      { id: 'BGV-02', name: 'Educational Degree & Transcript Audit', status: 'VERIFIED', vendor: 'Pune University Gate', updated: '02-Sep-2026' },
      { id: 'BGV-03', name: 'Prior Employment & Experience Verification', status: 'IN_PROGRESS', vendor: 'Third-Party HR Audit', updated: '02-Sep-2026' },
      { id: 'BGV-04', name: 'Police Record & Criminal Background Check', status: 'VERIFIED', vendor: 'E-Courts / Crime Bureau', updated: '01-Sep-2026' },
      { id: 'BGV-05', name: 'Permanent Address Physical Verification', status: 'PENDING_DOCS', vendor: 'Field Verification', updated: '03-Sep-2026' }
    ];
  },

  calculateBgvScore(checklist) {
    const total = checklist.length;
    const verified = checklist.filter(c => c.status === 'VERIFIED').length;
    const score = Math.round((verified / total) * 100);

    let badge = { text: 'IN PROGRESS', color: '#f59e0b', bg: '#fef3c7' };
    if (score === 100) badge = { text: '🟢 BGV CLEAR', color: '#10b981', bg: '#d1fae5' };
    else if (checklist.some(c => c.status === 'FLAGGED')) badge = { text: '🔴 FLAGGED', color: '#ef4444', bg: '#fee2e2' };

    return { score: score, verifiedCount: verified, totalCount: total, badge: badge };
  }
};
