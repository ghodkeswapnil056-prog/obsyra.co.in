/* OBSYRA RESUME BUILDER ENGINE & PREVIEW RENDERER */
const RESUME = {
  data: {
    fullName: 'Rahul Sharma',
    title: 'Network Engineer',
    dob: '15/08/1996',
    gender: 'Male',
    city: 'Pune',
    state: 'Maharashtra',
    mobile: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    linkedin: 'linkedin.com/in/rahulsharma',
    objective: 'Results-oriented Network Engineer with experience in telecom infrastructure, network support and 4G/5G technical troubleshooting.',
    templateId: 'tmpl1',
    experiences: [
      { company: 'ABC Telecom Ltd', title: 'Network Engineer', start: '01/2024', end: 'Present', desc: 'Handled 4G/5G NR field troubleshooting, Cisco router mounts, and site surveys across Pune region.' }
    ],
    educations: [
      { qual: 'Graduation', course: 'B.E. E&TC', inst: 'Pune University', year: '2023', grade: '78%' }
    ],
    skills: ['Networking', '4G', '5G NR', 'Troubleshooting', 'Linux', 'Cisco Routers'],
    certifications: [
      { name: 'CCNA Routing & Switching', org: 'Cisco', year: '2023' }
    ],
    projects: [
      { name: '5G Core Deployment Support', role: 'Field Lead', desc: 'Assisted in MME/EPG integration and drive testing validation.' }
    ]
  },

  init() {
    const user = typeof AUTH !== 'undefined' ? AUTH.getCurrentUser() : null;
    if (user) {
      this.data.fullName = user.fullName || 'Candidate';
      this.data.email = user.email || '';
      this.data.mobile = user.mobile || '';
      this.data.title = user.jobTitle || 'Applicant';
    } else {
      this.data.fullName = 'Candidate';
      this.data.email = '';
      this.data.mobile = '';
      this.data.title = 'Applicant';
    }
    this.updatePreview();
    this.calculateScore();
  },

  generateFromProfile() {
    const user = typeof AUTH !== 'undefined' ? AUTH.getCurrentUser() : null;
    if (user) {
      this.data.fullName = user.fullName || 'Candidate';
      this.data.email = user.email || '';
      this.data.mobile = user.mobile || '';
      this.data.title = user.jobTitle || 'Applicant';
      this.data.objective = 'Motivated ' + (this.data.title || 'Technical Professional') + ' seeking opportunities to apply engineering skills at Obsyra Pvt Ltd.';
      
      if (document.getElementById('resFullName')) document.getElementById('resFullName').value = this.data.fullName;
      if (document.getElementById('resEmail')) document.getElementById('resEmail').value = this.data.email;
      if (document.getElementById('resMobile')) document.getElementById('resMobile').value = this.data.mobile;
      if (document.getElementById('resObjective')) document.getElementById('resObjective').value = this.data.objective;
      
      this.updatePreview();
      this.calculateScore();
      alert('✓ Pre-filled resume fields from your Obsyra Master Profile!');
    }
  },

  calculateScore() {
    let score = 0;
    const checks = [];

    if (this.data.fullName && this.data.email && this.data.mobile) { score += 20; checks.push('✓ Contact Information Complete'); }
    if (this.data.objective && this.data.objective.length > 20) { score += 20; checks.push('✓ Career Objective Provided'); }
    if (this.data.experiences && this.data.experiences.length > 0) { score += 25; checks.push('✓ Work Experience Added'); }
    if (this.data.educations && this.data.educations.length > 0) { score += 15; checks.push('✓ Education Details Added'); }
    if (this.data.skills && this.data.skills.length >= 3) { score += 10; checks.push('✓ Key Technical Skills Added'); }
    if (this.data.projects && this.data.projects.length > 0) { score += 10; checks.push('✓ Technical Projects Added'); }

    const bar = document.getElementById('resScoreBar');
    const text = document.getElementById('resScoreText');
    const list = document.getElementById('resScoreList');

    if (bar) bar.style.width = score + '%';
    if (text) text.innerText = score + '%';
    if (list) list.innerHTML = checks.map(c => `<div>${c}</div>`).join('');
  },

  setTemplate(tmpl) {
    this.data.templateId = tmpl;
    this.updatePreview();
  },

  updatePreview() {
    const canvas = document.getElementById('resumeCanvas');
    if (!canvas) return;

    if (this.data.templateId === 'tmpl2') {
      canvas.innerHTML = this.renderModernTemplate();
    } else if (this.data.templateId === 'tmpl3') {
      canvas.innerHTML = this.renderTechnicalTemplate();
    } else {
      canvas.innerHTML = this.renderProfessionalTemplate();
    }
  },

  renderProfessionalTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 1.5rem; background: white; border: 1px solid #cbd5e1;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #0284c7; margin: 0;">${APP.escapeHtml(this.data.fullName)}</h1>
          <div style="font-size: 1rem; font-weight: 700; color: #475569;">${APP.escapeHtml(this.data.title)}</div>
          <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">
            ${APP.escapeHtml(this.data.city)}, ${APP.escapeHtml(this.data.state)} | ${APP.escapeHtml(this.data.mobile)} | ${APP.escapeHtml(this.data.email)}
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0284c7; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2rem; margin-bottom: 0.4rem;">CAREER OBJECTIVE</h3>
          <p style="font-size: 0.825rem; color: #334155; margin: 0;">${APP.escapeHtml(this.data.objective)}</p>
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0284c7; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2rem; margin-bottom: 0.4rem;">WORK EXPERIENCE</h3>
          ${this.data.experiences.map(e => `
            <div style="margin-bottom: 0.5rem;">
              <div style="display:flex; justify-style:space-between; font-weight:700; font-size:0.85rem;">
                <span>${APP.escapeHtml(e.title)} — ${APP.escapeHtml(e.company)}</span>
                <span style="font-size:0.78rem; color:#64748b;">${APP.escapeHtml(e.start)} - ${APP.escapeHtml(e.end)}</span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:0.2rem 0 0 0;">${APP.escapeHtml(e.desc)}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0284c7; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2rem; margin-bottom: 0.4rem;">TECHNICAL SKILLS</h3>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem; font-size:0.78rem;">
            ${this.data.skills.map(s => `<span style="background:#e0f2fe; color:#0369a1; padding:0.2rem 0.5rem; border-radius:4px; font-weight:600;">${APP.escapeHtml(s)}</span>`).join('')}
          </div>
        </div>

        <div>
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0284c7; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2rem; margin-bottom: 0.4rem;">EDUCATION</h3>
          ${this.data.educations.map(ed => `
            <div style="font-size:0.825rem;">
              <strong>${APP.escapeHtml(ed.course)}</strong> — ${APP.escapeHtml(ed.inst)} (${APP.escapeHtml(ed.year)})
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderModernTemplate() {
    return `
      <div style="font-family: Inter, sans-serif; display: grid; grid-template-columns: 1fr 2fr; background: white; border: 1px solid #cbd5e1; min-height: 500px;">
        <div style="background: #0f172a; color: white; padding: 1.25rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; margin: 0; color: #38bdf8;">${APP.escapeHtml(this.data.fullName)}</h2>
          <div style="font-size: 0.8rem; color: #94a3b8;">${APP.escapeHtml(this.data.title)}</div>
          <hr style="border-color: #334155; margin: 1rem 0;">
          <div style="font-size: 0.75rem; color: #cbd5e1;">
            <div>📍 ${APP.escapeHtml(this.data.city)}</div>
            <div>📞 ${APP.escapeHtml(this.data.mobile)}</div>
            <div>✉ ${APP.escapeHtml(this.data.email)}</div>
          </div>
        </div>
        <div style="padding: 1.25rem;">
          <h4 style="color:#0f172a; font-weight:800; font-size:0.9rem;">PROFILE SUMMARY</h4>
          <p style="font-size:0.8rem; color:#475569;">${APP.escapeHtml(this.data.objective)}</p>
        </div>
      </div>
    `;
  },

  renderTechnicalTemplate() {
    return this.renderProfessionalTemplate();
  },

  async downloadPDF() {
    window.print();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  RESUME.init();
});
