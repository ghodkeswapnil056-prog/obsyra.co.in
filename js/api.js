/* OBSYRA CAREER PORTAL - FULL-STACK DUAL-BRIDGE API CLIENT (v9.0.0) */
const API = {
  localApiBaseUrl: 'http://localhost:3000/api',

  mockVacancies: [
    { jobId: 'OBS-JOB-00125', title: 'Network Engineer', location: 'Maharashtra', required: 5, selected: 5, joined: 5, remaining: 0, reqStatus: 'REQUIREMENT FULFILLED', jobStatus: 'CLOSED' },
    { jobId: 'OBS-JOB-00126', title: '5G Protocol Testing Engineer', location: 'Maharashtra / Hybrid', required: 5, selected: 4, joined: 3, remaining: 2, reqStatus: 'PARTIALLY FULFILLED', jobStatus: 'OPEN' },
    { jobId: 'OBS-JOB-00127', title: 'Data Center Infrastructure Technician', location: 'Mumbai', required: 3, selected: 2, joined: 1, remaining: 2, reqStatus: 'PARTIALLY FULFILLED', jobStatus: 'OPEN' }
  ],

  mockDocuments: [
    { id: 'DOC-001', name: 'B.Tech Degree Certificate', category: 'Education', uploadDate: '31 Aug 2026', status: 'Verified', statusColor: '#10b981' },
    { id: 'DOC-002', name: 'Aadhaar Card Front & Back', category: 'Identity', uploadDate: '31 Aug 2026', status: 'Verified', statusColor: '#10b981' },
    { id: 'DOC-003', name: 'PAN Card Scan', category: 'Identity', uploadDate: '31 Aug 2026', status: 'Verified', statusColor: '#10b981' },
    { id: 'DOC-004', name: 'Experience Letter', category: 'Employment', uploadDate: '30 Aug 2026', status: 'Action Required', statusColor: '#ef4444', rejectionReason: 'Uploaded document scan is blurred. Please upload a clear PDF file.' },
    { id: 'DOC-005', name: 'CCNA Cisco Certification', category: 'Certifications', uploadDate: '29 Aug 2026', status: 'Verified', statusColor: '#10b981' }
  ],

  async request(action, payload = {}) {
    payload.action = action;

    // 1. ATTEMPT LOCAL NODE.JS EXPRESS REST API
    try {
      const nodeRes = await fetch(`${this.localApiBaseUrl}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (nodeRes.ok) {
        const data = await nodeRes.json();
        console.log(`[Node.js Express SQL Backend] Action: ${action}`, data);
        return data;
      }
    } catch (e) {
      // Local Node server offline; proceed to Cloud Apps Script or Mock API
    }

    // 2. ATTEMPT CLOUD GOOGLE APPS SCRIPT API
    if (CONFIG.API_URL && CONFIG.API_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      try {
        const response = await fetch(CONFIG.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        return await response.json();
      } catch (err) {
        console.warn('Google Apps Script API Error, using fallback mock response:', err);
      }
    }

    // 3. FALLBACK TO IN-MEMORY MOCK API
    return this.handleMock(action, payload);
  },

  handleMock(action, payload) {
    console.log(`[Mock API Bridge] Action: ${action}`, payload);
    
    switch (action) {
      case 'ping':
        return { success: true, status: 'Obsyra API Bridge Online', timestamp: new Date() };

      case 'getCandidateDashboardData':
        const currentDashboardUser = (typeof AUTH !== 'undefined' && AUTH.getCurrentUser()) || { candidateId: 'CAN-2026-000125', fullName: 'Candidate Account', email: 'candidate@obsyra.com' };
        const dNameParts = (currentDashboardUser.fullName || 'Candidate').split(' ');
        return {
          success: true,
          user: {
            candidateId: currentDashboardUser.candidateId || 'CAN-2026-000125',
            firstName: dNameParts[0] || 'Candidate',
            lastName: dNameParts.slice(1).join(' ') || '',
            fullName: currentDashboardUser.fullName || 'Candidate',
            email: currentDashboardUser.email || ''
          },
          stats: { totalApplications: 3, shortlisted: 1, upcomingInterviews: 1, selected: 0, savedJobs: 4, profilePercent: 85 },
          recommendedJobs: [
            { jobId: 'OBS-JOB-00125', title: 'Network Engineer', client: 'Obsyra Pvt Ltd', location: 'Maharashtra', experience: '2-5 Yrs', matchScore: 95 },
            { jobId: 'OBS-JOB-00126', title: '5G Protocol Testing Engineer', client: 'Obsyra Pvt Ltd', location: 'Maharashtra / Hybrid', experience: '3-6 Yrs', matchScore: 91 }
          ]
        };

      case 'getCandidateProfile':
        const currentProfUser = (typeof AUTH !== 'undefined' && AUTH.getCurrentUser()) || { candidateId: 'CAN-2026-000125', fullName: 'Candidate Account', email: 'candidate@obsyra.com' };
        const pNameParts = (currentProfUser.fullName || 'Candidate').split(' ');
        return {
          success: true,
          candidate: {
            candidateId: currentProfUser.candidateId || 'CAN-2026-000125',
            firstName: pNameParts[0] || 'Candidate',
            lastName: pNameParts.slice(1).join(' ') || '',
            fullName: currentProfUser.fullName || 'Candidate',
            email: currentProfUser.email || '',
            mobile: currentProfUser.mobile || '',
            city: currentProfUser.city || 'Pune',
            state: currentProfUser.state || 'Maharashtra',
            jobTitle: currentProfUser.jobTitle || 'Applicant',
            total_experience: currentProfUser.total_experience || '2.0',
            skills: currentProfUser.skills || [{ skill_name: 'Software' }, { skill_name: 'Engineering' }]
          }
        };

      case 'getCandidateDocuments':
        return { success: true, documents: this.mockDocuments, completionPercent: 80 };

      case 'uploadDocumentToVault':
        const newDoc = {
          id: 'DOC-00' + (this.mockDocuments.length + 1),
          name: payload.docName || payload.docType || payload.fileName,
          category: payload.category || 'General',
          uploadDate: '01 Sep 2026',
          status: 'Pending Verification',
          statusColor: '#f59e0b'
        };
        this.mockDocuments.unshift(newDoc);
        return { success: true, message: '✓ Document uploaded to vault!', document: newDoc };

      case 'getJobs':
        return {
          success: true,
          jobs: [
            { id: 'OBS-JOB-00125', title: 'Network Engineer', client: 'Obsyra Pvt Ltd', location: 'Pune, Maharashtra', type: 'Full Time', expDisplay: '2-5 Yrs', workMode: 'On-Site', department: 'Telecom Services', postedDate: '31 Aug 2026', status: 'Open', featured: true, matchScore: 92 },
            { id: 'OBS-JOB-00126', title: '5G Protocol Testing Engineer', client: 'Obsyra Pvt Ltd', location: 'Mumbai / Hybrid', type: 'Full Time', expDisplay: '3-6 Yrs', workMode: 'Hybrid', department: 'Testing Services', postedDate: '30 Aug 2026', status: 'Open', featured: true, matchScore: 88 },
            { id: 'OBS-JOB-00127', title: 'Data Center Infrastructure Technician', client: 'Obsyra Pvt Ltd', location: 'Mumbai', type: 'Full Time', expDisplay: '1-4 Yrs', workMode: 'On-Site', department: 'Infrastructure', postedDate: '29 Aug 2026', status: 'Open', featured: false, matchScore: 85 }
          ]
        };

      case 'getAdminDashboardStats':
        return {
          success: true,
          stats: { totalCandidates: 1248, newToday: 18, openJobs: 27, totalApplications: 386, shortlisted: 74, interviews: 42, selected: 16, joined: 11 },
          stateBreakdown: [
            { state: 'Maharashtra', count: 17 },
            { state: 'Gujarat', count: 7 },
            { state: 'Delhi NCR', count: 8 },
            { state: 'PAN India', count: 12 }
          ]
        };

      case 'markCandidateJoined':
        return {
          success: true,
          message: '🎉 CANDIDATE JOINED & REQUIREMENT FULFILLED! Candidate marked as JOINED. Target vacancies reached (5/5). Vacancy OBS-JOB-00125 has automatically been CLOSED.',
          jobClosed: true,
          jobId: payload.jobId || 'OBS-JOB-00125',
          requirementStatus: 'REQUIREMENT FULFILLED'
        };

      case 'getVacanciesStatus':
        return { success: true, vacancies: this.mockVacancies };

      case 'submitServiceRequest':
        return { success: true, message: '✓ Requirement submitted successfully!', requestId: 'OBS-SR-2026-000125' };

      case 'registerCandidate':
        if (typeof AUTH !== 'undefined' && AUTH.registerCandidate) {
          return AUTH.registerCandidate(payload.fullName || payload.name, payload.email, payload.mobile || '', payload.password || payload.pass);
        }
        return { success: true, message: '✓ Account registered successfully!', candidate: { candidateId: 'CAN-2026-000125', fullName: payload.fullName, email: payload.email } };

      case 'loginCandidate':
        if (typeof AUTH !== 'undefined' && AUTH.authenticateCandidate) {
          return AUTH.authenticateCandidate(payload.username || payload.email, payload.password || payload.pass);
        }
        return { success: true, message: '✓ Login successful!', candidate: { candidateId: 'CAN-000125', fullName: 'Rahul Sharma', email: payload.email } };

      case 'applyForJob':
        return { success: true, message: '🎉 Application submitted successfully!', applicationId: 'APP-2026-000386' };

      case 'saveCandidateProfile':
        return { success: true, message: '✓ Profile saved successfully!' };

      case 'saveResume':
        return { success: true, message: '✓ Resume saved successfully to Google Drive!' };

      case 'scheduleInterview':
        return { success: true, message: '✓ Interview scheduled successfully!', interviewId: 'INT-2026-000125' };

      case 'updateApplicationStatus':
        return { success: true, message: `✓ Application status updated to ${payload.newStatus}` };

      case 'getAuditLogs':
        return {
          success: true,
          logs: [
            { auditId: 'AUD-000125', adminId: 'ADMIN-002 (HR Manager)', action: 'STATUS_CHANGED', module: 'APPLICATIONS', recordId: 'APP-2026-000386', oldValue: 'Under Review', newValue: 'Shortlisted', dateTime: '01 Sep 2026' }
          ]
        };

      default:
        return { success: true, message: 'Action completed.' };
    }
  }
};
