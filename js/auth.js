/* OBSYRA CAREER PORTAL - PRODUCTION AUTHENTICATION & CREDENTIALS ENGINE (v10.0.0) */
const AUTH = {
  /* PRODUCTION ADMIN / RECRUITER ACCOUNTS REGISTRY */
  adminAccounts: [
    { email: 'surekha@obsyra.com', pass: 'Obsyra@2026!', adminId: 'ADMIN-001', name: 'Surekha Aade', role: 'Super Admin' },
    { email: 'anil.kumar@obsyra.com', pass: 'Obsyra@2026!', adminId: 'ADMIN-002', name: 'Anil Kumar', role: 'HR Manager' }
  ],

  /**
   * ADD NEW ADMIN / RECRUITER CREDENTIALS
   * Call this function to register new recruiter accounts!
   * Example: AUTH.addAdminAccount('hr.john@obsyra.com', 'SecurePass@2026', 'John Doe', 'HR Specialist')
   */
  addAdminAccount(email, password, name = 'HR Recruiter', role = 'HR Manager') {
    const existing = this.adminAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.pass = password;
      existing.name = name;
      existing.role = role;
      console.log(`✓ Updated existing admin account: ${email}`);
    } else {
      const newAdmin = {
        email: email,
        pass: password,
        adminId: 'ADMIN-00' + (this.adminAccounts.length + 1),
        name: name,
        role: role
      };
      this.adminAccounts.push(newAdmin);
      console.log(`✓ Added new admin account: ${email} (${role})`);
    }

    // Persist custom admin accounts in localStorage
    try {
      localStorage.setItem('obsyra_custom_admin_accounts', JSON.stringify(this.adminAccounts));
    } catch(e) {}

    return true;
  },

  loadStoredAdminAccounts() {
    try {
      const stored = localStorage.getItem('obsyra_custom_admin_accounts');
      if (stored) {
        this.adminAccounts = JSON.parse(stored);
      }
    } catch(e) {}
  },

  validateAdminCredentials(email, password) {
    this.loadStoredAdminAccounts();
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

  /* CANDIDATE AUTHENTICATION */
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
    localStorage.setItem('obsyra_candidate_token', 'TOKEN_' + Date.now());
    localStorage.setItem('obsyra_candidate_user', JSON.stringify(candidate));
  },

  logout() {
    localStorage.removeItem('obsyra_candidate_token');
    localStorage.removeItem('obsyra_candidate_user');
    window.location.href = 'login.html';
  },

  /* RECRUITER ADMIN AUTHENTICATION */
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
      navAuthContainer.innerHTML = `
        <div class="profile-dropdown-container">
          <button class="profile-avatar-btn" onclick="APP.toggleProfileDropdown()">
            <span style="background:var(--primary); color:white; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">${user.fullName ? user.fullName.charAt(0) : 'C'}</span>
            <span>${APP.escapeHtml(user.fullName || 'Candidate')}</span>
            <span style="font-size:0.65rem;">▼</span>
          </button>
          <div class="dropdown-menu" id="profileDropdownMenu">
            <div style="padding:0.75rem 1rem; border-bottom:1px solid #e2e8f0;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--dark);">${APP.escapeHtml(user.fullName || 'Candidate')}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${APP.escapeHtml(user.email || '')}</div>
            </div>
            <a href="candidate-dashboard.html">📊 Dashboard Overview</a>
            <a href="profile.html">👤 My Profile</a>
            <a href="applications.html">📋 My Applications</a>
            <a href="interview.html">📅 Scheduled Interviews</a>
            <a href="documents.html">📁 Document Vault</a>
            <a href="resume-builder.html">📄 Resume Builder</a>
            <div class="dropdown-divider"></div>
            <button onclick="AUTH.logout()" style="color:var(--danger); font-weight:600;">🚪 Sign Out</button>
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
  AUTH.loadStoredAdminAccounts();
  AUTH.checkAdminAuth();
  AUTH.checkCandidateAuth();
  AUTH.renderNavbarAuth();
});
