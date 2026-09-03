/* OBSYRA CAREER PORTAL - STRICT AUTHENTICATION & CANDIDATE REGISTRY ENGINE (v11.0.0) */
const AUTH = {
  /* PRODUCTION ADMIN / RECRUITER ACCOUNTS REGISTRY */
  adminAccounts: [
    { email: 'surekha@obsyra.com', pass: 'Obsyra@2026!', adminId: 'ADMIN-001', name: 'Surekha Aade', role: 'Super Admin' },
    { email: 'anil.kumar@obsyra.com', pass: 'Obsyra@2026!', adminId: 'ADMIN-002', name: 'Anil Kumar', role: 'HR Manager' }
  ],

  /* REGISTERED CANDIDATE ACCOUNTS REGISTRY */
  registeredCandidates: [
    { candidateId: 'CAN-2026-000125', fullName: 'Rahul Sharma', email: 'rahul.sharma@example.com', mobile: '+91 9876543210', pass: 'Rahul@2026!', profileCompletion: '92%' }
  ],

  loadStoredData() {
    try {
      const storedAdmin = localStorage.getItem('obsyra_custom_admin_accounts');
      if (storedAdmin) {
        this.adminAccounts = JSON.parse(storedAdmin);
      }

      const storedCand = localStorage.getItem('obsyra_registered_candidates');
      if (storedCand) {
        this.registeredCandidates = JSON.parse(storedCand);
      }
    } catch(e) {}
  },

  saveStoredCandidates() {
    try {
      localStorage.setItem('obsyra_registered_candidates', JSON.stringify(this.registeredCandidates));
    } catch(e) {}
  },

  /* CANDIDATE REGISTRATION & AUTHENTICATION */
  registerCandidate(fullName, email, mobile, password) {
    this.loadStoredData();
    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile.replace(/\D/g, '');

    // Duplicate account protection
    const existing = this.registeredCandidates.find(c =>
      c.email.toLowerCase().trim() === cleanEmail ||
      c.mobile.replace(/\D/g, '').includes(cleanMobile)
    );

    if (existing) {
      return {
        success: false,
        message: '⚠ An account with this Email or Mobile Number already exists! Please login instead.'
      };
    }

    const newCandidate = {
      candidateId: 'CAN-2026-' + Math.floor(100000 + Math.random() * 900000),
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: mobile,
      pass: password,
      profileCompletion: '50%',
      registeredDate: new Date().toLocaleDateString()
    };

    this.registeredCandidates.push(newCandidate);
    this.saveStoredCandidates();

    return {
      success: true,
      candidate: newCandidate,
      message: '🎉 Account registered successfully!'
    };
  },

  authenticateCandidate(identifier, password) {
    this.loadStoredData();
    const cleanId = identifier.toLowerCase().trim();
    const cleanPhone = cleanId.replace(/\D/g, '');

    const account = this.registeredCandidates.find(c => {
      const emailMatch = c.email.toLowerCase().trim() === cleanId;
      const phoneMatch = cleanPhone.length >= 8 && c.mobile.replace(/\D/g, '').includes(cleanPhone);
      return (emailMatch || phoneMatch) && c.pass === password;
    });

    if (account) {
      return {
        success: true,
        candidate: account,
        message: '✓ Login successful!'
      };
    }

    return {
      success: false,
      message: '❌ Invalid Email/Mobile or Password! Please check your credentials or create a new account.'
    };
  },

  /* CANDIDATE SESSION MANAGEMENT */
  isLoggedIn() {
    return localStorage.getItem('obsyra_candidate_token') !== null;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('obsyra_candidate_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch(e) {
      return null;
    }
  },

  setSession(candidate) {
    if (!candidate) return;
    localStorage.setItem('obsyra_candidate_token', 'TOKEN_' + Date.now());
    localStorage.setItem('obsyra_candidate_user', JSON.stringify(candidate));
  },

  clearCandidateSession() {
    localStorage.removeItem('obsyra_candidate_token');
    localStorage.removeItem('obsyra_candidate_user');
    sessionStorage.removeItem('obsyra_candidate_user');
    sessionStorage.removeItem('obsyra_candidate_token');
  },

  logout() {
    this.clearCandidateSession();
    sessionStorage.clear();
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/')) {
      window.location.href = '../login.html';
    } else {
      window.location.href = 'login.html';
    }
  },

  logoutCandidate() {
    this.logout();
  },

  /* RECRUITER ADMIN AUTHENTICATION */
  addAdminAccount(email, password, name = 'HR Recruiter', role = 'HR Manager') {
    this.loadStoredData();
    const existing = this.adminAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.pass = password;
      existing.name = name;
      existing.role = role;
    } else {
      const newAdmin = {
        email: email,
        pass: password,
        adminId: 'ADMIN-00' + (this.adminAccounts.length + 1),
        name: name,
        role: role
      };
      this.adminAccounts.push(newAdmin);
    }

    try {
      localStorage.setItem('obsyra_custom_admin_accounts', JSON.stringify(this.adminAccounts));
    } catch(e) {}

    return true;
  },

  loadStoredAdminAccounts() {
    this.loadStoredData();
  },

  validateAdminCredentials(email, password) {
    this.loadStoredData();
    const account = this.adminAccounts.find(a => a.email.toLowerCase() === email.toLowerCase().trim() && a.pass === password);
    if (account) {
      return {
        adminId: account.adminId,
        name: account.name,
        email: account.email,
        role: account.role
      };
    }
    return null;
  },

  isAdminLoggedIn() {
    return localStorage.getItem('obsyra_admin_token') !== null;
  },

  getAdminUser() {
    const str = localStorage.getItem('obsyra_admin_user');
    if (!str) return null;
    try { return JSON.parse(str); } catch(e) { return null; }
  },

  setAdminSession(adminUser) {
    localStorage.setItem('obsyra_admin_token', 'ADMIN_TOKEN_' + Date.now());
    localStorage.setItem('obsyra_admin_user', JSON.stringify(adminUser));
  },

  adminLogout() {
    localStorage.removeItem('obsyra_admin_token');
    localStorage.removeItem('obsyra_admin_user');
    sessionStorage.clear();
    
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/')) {
      window.location.href = 'login.html';
    } else {
      window.location.href = 'admin/login.html';
    }
  },

  logoutAdmin() {
    this.adminLogout();
  },

  checkAdminAuth() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/') && !path.includes('login.html')) {
      if (!this.isAdminLoggedIn()) {
        console.warn('Unauthenticated access attempt to Admin Control Center. Redirecting to admin login...');
        window.location.href = 'login.html';
      }
    }
  },

  checkCandidateAuth() {
    const path = window.location.pathname.toLowerCase();
    const candidatePages = ['candidate-dashboard.html', 'profile.html', 'resume-builder.html', 'documents.html', 'applications.html', 'interview.html'];
    if (candidatePages.some(page => path.includes(page))) {
      if (!this.isLoggedIn()) {
        console.warn('Unauthenticated candidate access attempt. Redirecting to login...');
        window.location.href = 'login.html';
      }
    }
  },

  renderNavbarAuth() {
    const navAuthContainer = document.getElementById('navAuth');
    if (!navAuthContainer) return;

    if (this.isLoggedIn()) {
      const user = this.getCurrentUser() || { fullName: 'Candidate' };
      const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'C';
      navAuthContainer.innerHTML = `
        <div class="profile-dropdown-container">
          <button class="profile-avatar-btn" onclick="APP.toggleProfileDropdown()">
            <span style="background:var(--primary); color:white; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">${initials}</span>
            <span>${APP.escapeHtml(user.fullName || 'Candidate')}</span>
            <span style="font-size:0.65rem;">▼</span>
          </button>
          <div class="dropdown-menu" id="profileDropdownMenu">
            <div style="padding:0.75rem 1rem; border-bottom:1px solid #e2e8f0;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--dark);">${APP.escapeHtml(user.fullName || 'Candidate')}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${APP.escapeHtml(user.email || user.candidateId || '')}</div>
            </div>
            <a href="candidate-dashboard.html">📊 Dashboard Overview</a>
            <a href="profile.html">👤 My Profile</a>
            <a href="applications.html">📋 My Applications</a>
            <a href="interview.html">📅 Scheduled Interviews</a>
            <a href="documents.html">📁 Document Vault</a>
            <a href="resume-builder.html">📄 Resume Builder</a>
            <div class="dropdown-divider"></div>
            <button onclick="AUTH.logoutCandidate()" style="color:var(--danger); font-weight:600;">🚪 Sign Out</button>
          </div>
        </div>
      `;
    } else {
      navAuthContainer.innerHTML = `
        <a href="login.html" class="btn btn-outline" style="padding:0.4rem 0.85rem; font-size:0.825rem; color:white; border-color:#475569;">Candidate Login</a>
        <a href="register.html" class="btn btn-primary" style="padding:0.4rem 0.85rem; font-size:0.825rem;">Create Account</a>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AUTH.loadStoredData();
  AUTH.checkAdminAuth();
  AUTH.checkCandidateAuth();
  AUTH.renderNavbarAuth();
});
