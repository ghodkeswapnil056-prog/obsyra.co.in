/* OBSYRA CAREER PORTAL - AUTHENTICATION & SECURITY GATE ENGINE (v5.4.0) */
const AUTH = {
  /* CANDIDATE AUTHENTICATION */
  isLoggedIn() {
    return localStorage.getItem('obsyra_candidate_token') !== null;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('obsyra_candidate_user');
    if (!userStr) return { candidateId: 'CAN-2026-000125', fullName: 'Rahul Sharma', email: 'rahul.sharma@example.com', profileCompletion: '75%' };
    try {
      return JSON.parse(userStr);
    } catch(e) {
      return { candidateId: 'CAN-2026-000125', fullName: 'Rahul Sharma', email: 'rahul.sharma@example.com', profileCompletion: '75%' };
    }
  },

  setSession(candidate) {
    localStorage.setItem('obsyra_candidate_token', 'TOKEN_' + Date.now());
    localStorage.setItem('obsyra_candidate_user', JSON.stringify(candidate));
  },

  logout() {
    localStorage.removeItem('obsyra_candidate_token');
    localStorage.removeItem('obsyra_candidate_user');
    window.location.href = 'index.html';
  },

  /* RECRUITER ADMIN AUTHENTICATION & PASSWORD GATE */
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
    window.location.href = 'login.html';
  },

  checkAdminAuth() {
    // If on an admin page (path includes /admin/ or admin file) and not logged in
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/') && !path.includes('login.html')) {
      if (!this.isAdminLoggedIn()) {
        console.warn('Unauthenticated access attempt to Admin Control Center. Redirecting to admin login...');
        window.location.href = 'login.html';
      }
    }
  },

  renderNavbarAuth() {
    const navAuthContainer = document.getElementById('navAuth');
    if (!navAuthContainer) return;

    if (this.isLoggedIn()) {
      const user = this.getCurrentUser();
      navAuthContainer.innerHTML = `
        <div class="profile-dropdown-container">
          <button class="profile-avatar-btn" onclick="APP.toggleProfileDropdown()">
            <span style="background:var(--primary); color:white; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">${user.fullName ? user.fullName.charAt(0) : 'R'}</span>
            <span>${APP.escapeHtml(user.fullName || 'Rahul Sharma')}</span>
            <span style="font-size:0.65rem;">▼</span>
          </button>
          <div class="dropdown-menu" id="profileDropdownMenu">
            <div style="padding:0.75rem 1rem; border-bottom:1px solid #e2e8f0;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--dark);">${APP.escapeHtml(user.fullName || 'Rahul Sharma')}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${APP.escapeHtml(user.candidateId || 'CAN-2026-000125')}</div>
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
  AUTH.checkAdminAuth();
  AUTH.renderNavbarAuth();
});
