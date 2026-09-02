/* OBSYRA CAREER PORTAL - HIGH SECURITY VAULT & ENCRYPTION ENGINE (v5.1.0) */
const SECURITY_VAULT = {
  salt: 'OBSYRA_ENTERPRISE_SALT_2026',

  async hashPassword(password) {
    if (!password) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(password + this.salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async calculateFileHash(file) {
    if (!file) return '';
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'SHA256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  enforceFramebusting() {
    if (window.top !== window.self) {
      console.warn('[SECURITY HIGH ALERT] Anti-Clickjacking Framebusting triggered. Redirection to top window...');
      window.top.location = window.self.location;
    }
  },

  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SECURITY_VAULT.enforceFramebusting();
});
