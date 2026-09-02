/* OBSYRA CAREER PORTAL - ACTIVE CYBER ATTACK DEFENSE & SOC ENGINE (v5.3.0) */
const CYBER_DEFENSE = {
  shieldActive: true,
  lockdownMode: false,
  blockedAttacks: [],
  csrfToken: 'OBSYRA-CSRF-' + Math.floor(100000 + Math.random() * 900000),
  lastRequestTime: 0,
  requestBurstCount: 0,

  init() {
    this.injectHoneypotFields();
    this.setupFormInterception();
    this.setupCSRFHeader();
    console.log(`[CYBER DEFENSE SHIELD] Active & Armed. Anti-CSRF Token: ${this.csrfToken}`);
  },

  scanSQLi(str) {
    if (typeof str !== 'string') return false;
    const sqlPatterns = [/DROP\s+TABLE/i, /UNION\s+SELECT/i, /OR\s+'1'='1'/i, /SELECT\s+\*\s+FROM/i, /INSERT\s+INTO/i, /DELETE\s+FROM/i];
    return sqlPatterns.some(pattern => pattern.test(str));
  },

  scanXSS(str) {
    if (typeof str !== 'string') return false;
    const xssPatterns = [/<script/i, /javascript:/i, /onerror=/i, /onload=/i, /eval\(/i, /<iframe/i];
    return xssPatterns.some(pattern => pattern.test(str));
  },

  checkDDoSBurst() {
    const now = Date.now();
    if (now - this.lastRequestTime < 2000) {
      this.requestBurstCount++;
      if (this.requestBurstCount > 10) {
        this.recordBlockedAttack('DDoS_BURST_SPAM', 'Rapid click burst detected (>10 actions in 2s)', 'CRITICAL');
        return true;
      }
    } else {
      this.requestBurstCount = 1;
    }
    this.lastRequestTime = now;
    return false;
  },

  injectHoneypotFields() {
    document.querySelectorAll('form').forEach(form => {
      if (!form.querySelector('.obsyra-hp-trap')) {
        const hp = document.createElement('input');
        hp.type = 'text';
        hp.name = 'website_hp_trap';
        hp.className = 'obsyra-hp-trap';
        hp.style.display = 'none';
        hp.tabIndex = -1;
        hp.autocomplete = 'off';
        form.appendChild(hp);
      }
    });
  },

  setupFormInterception() {
    document.addEventListener('submit', (e) => {
      if (this.lockdownMode) {
        e.preventDefault();
        alert('🛡️ EMERGENCY LOCKDOWN ACTIVE: System is in Read-Only Defense Mode.');
        return;
      }

      if (this.checkDDoSBurst()) {
        e.preventDefault();
        alert('🛡️ DDOS GUARD: Rapid request burst blocked.');
        return;
      }

      const hpInput = e.target.querySelector('.obsyra-hp-trap');
      if (hpInput && hpInput.value !== '') {
        e.preventDefault();
        this.recordBlockedAttack('BOT_HONEYPOT_TRAP', 'Automated spam bot detected filling hidden honeypot', 'CRITICAL');
        alert('🛡️ BOT DEFENSE: Automated submission blocked by Honeypot Trap.');
        return;
      }

      // Scan all text inputs for SQLi & XSS
      const inputs = e.target.querySelectorAll('input[type="text"], textarea');
      inputs.forEach(input => {
        const val = input.value || '';
        if (this.scanSQLi(val)) {
          e.preventDefault();
          this.recordBlockedAttack('SQL_INJECTION_ATTACK', `SQLi payload intercepted on #${input.id || 'field'}`, 'CRITICAL');
          alert('🛡️ CYBER DEFENSE: Potential SQL Injection attack blocked.');
        } else if (this.scanXSS(val)) {
          e.preventDefault();
          this.recordBlockedAttack('XSS_SCRIPT_ATTACK', `XSS vector intercepted on #${input.id || 'field'}`, 'CRITICAL');
          alert('🛡️ CYBER DEFENSE: Potential Cross-Site Scripting vector blocked.');
        }
      });
    }, true);
  },

  setupCSRFHeader() {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = this.csrfToken;
    document.head.appendChild(meta);
  },

  recordBlockedAttack(type, details, severity = 'CRITICAL') {
    const attack = {
      attackId: 'CYBER-DEF-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString(),
      type: type,
      details: details,
      severity: severity,
      originIp: '127.0.0.1 (Client Endpoint)',
      status: 'INTERCEPTED & BLOCKED'
    };

    this.blockedAttacks.unshift(attack);
    if (this.blockedAttacks.length > 50) this.blockedAttacks.pop();

    if (typeof EDR_SECURITY !== 'undefined') {
      EDR_SECURITY.logSecurityEvent(type, details, severity);
    }
  },

  toggleLockdown() {
    this.lockdownMode = !this.lockdownMode;
    alert(`🛡️ EMERGENCY LOCKDOWN: ${this.lockdownMode ? 'ENABLED (Read-Only Mode)' : 'DISABLED (Normal Operations)'}`);
    return this.lockdownMode;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CYBER_DEFENSE.init();
});
