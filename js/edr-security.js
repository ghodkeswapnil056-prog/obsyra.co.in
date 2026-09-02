/* OBSYRA CAREER PORTAL - ENTERPRISE EDR SECURITY & AUDIT ENGINE */
const EDR_SECURITY = {
  threatScore: 100, // 0 to 100 (100 = Optimal)
  securityEvents: [],
  apiCallTracker: {},

  init() {
    this.setupInputSanitizerProbe();
    this.setupRateLimiter();
    this.logSecurityEvent('SYSTEM_INIT', 'EDR Threat Engine initialized (Threat Score: 100/100)', 'INFO');
  },

  setupInputSanitizerProbe() {
    window.addEventListener('input', (e) => {
      const val = e.target.value || '';
      if (val.includes('<script>') || val.includes('javascript:') || val.includes('SELECT * FROM')) {
        this.threatScore = Math.max(0, this.threatScore - 15);
        this.logSecurityEvent('XSS_PROBE_DETECTED', `Malicious script string probe blocked on element #${e.target.id || 'input'}`, 'CRITICAL');
        e.target.value = APP.escapeHtml(val);
      }
    });
  },

  setupRateLimiter() {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const now = Date.now();
      const windowTime = 60000; // 1 minute
      this.apiCallTracker.calls = (this.apiCallTracker.calls || []).filter(t => now - t < windowTime);
      this.apiCallTracker.calls.push(now);

      if (this.apiCallTracker.calls.length > 60) {
        this.logSecurityEvent('RATE_LIMIT_EXCEEDED', 'Excessive API requests detected (>60 req/min)', 'WARNING');
        this.threatScore = Math.max(0, this.threatScore - 10);
      }

      return origFetch(...args);
    };
  },

  logSecurityEvent(eventType, details, severity = 'INFO') {
    const event = {
      eventId: 'EDR-EVT-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString(),
      type: eventType,
      details: details,
      severity: severity,
      userIp: '127.0.0.1 (Local Client)'
    };

    this.securityEvents.unshift(event);
    if (this.securityEvents.length > 50) this.securityEvents.pop();

    if (severity === 'CRITICAL') {
      console.warn(`[EDR CRITICAL SECURITY ALERT] ${eventType}: ${details}`);
      if (typeof APP !== 'undefined' && APP.showToast) {
        APP.showToast(`🛡️ Security Warning: ${details}`, 'danger');
      }
    }
  },

  getSecurityReport() {
    let level = 'OPTIMAL';
    if (this.threatScore < 60) level = 'CRITICAL RISK';
    else if (this.threatScore < 85) level = 'WARNING';

    return {
      threatScore: this.threatScore,
      securityLevel: level,
      totalEvents: this.securityEvents.length,
      recentEvents: this.securityEvents
    };
  }
};

document.addEventListener('DOMContentLoaded', () => {
  EDR_SECURITY.init();
});
