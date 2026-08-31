/* OBSYRA CAREER PORTAL - MAIN APP & JOBS UI CONTROLLER */
const APP = {
  allJobs: [],
  filteredJobs: [],
  allDocuments: [],

  stateCityMap: {
    'Maharashtra': ['All Cities', 'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Thane'],
    'Gujarat': ['All Cities', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Delhi': ['All Cities', 'New Delhi', 'North Delhi', 'South Delhi'],
    'Karnataka': ['All Cities', 'Bengaluru', 'Mysuru', 'Hubballi'],
    'Tamil Nadu': ['All Cities', 'Chennai', 'Coimbatore', 'Madurai'],
    'Telangana': ['All Cities', 'Hyderabad', 'Warangal'],
    'Uttar Pradesh': ['All Cities', 'Noida', 'Lucknow', 'Kanpur', 'Agra'],
    'PAN India': ['Multiple Locations / Field Sites']
  },

  animateCounters() {
    const counters = document.querySelectorAll('.counter-val');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target') || 100;
      const duration = 1200;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    });
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'success') toast.style.borderLeftColor = '#10b981';
    if (type === 'warning') toast.style.borderLeftColor = '#f59e0b';
    if (type === 'danger') toast.style.borderLeftColor = '#ef4444';
    
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  toggleProfileDropdown() {
    const menu = document.getElementById('profileDropdownMenu');
    if (menu) menu.classList.toggle('show');
  },

  async initJobsMarketplace() {
    const res = await API.request('getJobs');
    if (res.success && res.jobs) {
      this.allJobs = res.jobs;
      this.filteredJobs = res.jobs;
      this.renderFeaturedJobs(this.allJobs.filter(j => j.featured));
      this.renderJobsGrid(this.allJobs);
    }
  },

  /* DOCUMENT VAULT ENGINE */
  async initDocumentVault() {
    const res = await API.request('getCandidateDocuments');
    if (res.success && res.documents) {
      this.allDocuments = res.documents;
      this.renderDocumentTable(res.documents);
    }
  },

  filterDocumentCategory(cat) {
    const btns = document.querySelectorAll('.vault-filter-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.innerText.includes(cat) || (cat === 'All' && b.innerText.includes('All')));
    });

    if (cat === 'All') {
      this.renderDocumentTable(this.allDocuments);
    } else {
      const filtered = this.allDocuments.filter(d => d.category === cat || d.status === cat);
      this.renderDocumentTable(filtered);
    }
  },

  renderDocumentTable(docs) {
    const tbody = document.getElementById('documentTableBody');
    if (!tbody) return;

    if (!docs || docs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No documents found in this category view.</td></tr>`;
      return;
    }

    tbody.innerHTML = docs.map(d => `
      <tr>
        <td><strong>${this.escapeHtml(d.name)}</strong></td>
        <td><span class="tag" style="background:#f1f5f9; color:#475569;">${this.escapeHtml(d.category)}</span></td>
        <td>${this.escapeHtml(d.uploadDate)}</td>
        <td><span class="tag" style="background:${d.status === 'Verified' ? '#d1fae5' : d.status === 'Action Required' ? '#fee2e2' : '#fef3c7'}; color:${d.statusColor};">● ${this.escapeHtml(d.status)}</span></td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button onclick="APP.previewDocument('${d.id}')" class="btn btn-outline btn-sm" style="color:var(--dark); border-color:#cbd5e1;">👁 Preview</button>
            ${d.status === 'Action Required' ? `<button onclick="APP.openUploadModal('${d.category}', '${d.name}')" class="btn btn-primary btn-sm" style="background:var(--danger); border:none;">🔄 Replace</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openUploadModal(category, name) {
    const modal = document.getElementById('uploadDocModal');
    if (modal) {
      modal.classList.add('show');
      if (category) document.getElementById('modalDocCategory').value = category;
      if (name) document.getElementById('modalDocName').value = name;
    }
  },

  previewDocument(docId) {
    const doc = this.allDocuments.find(d => d.id === docId);
    if (!doc) return;

    const modal = document.getElementById('previewDocModal');
    if (modal) {
      modal.classList.add('show');
      document.getElementById('prevDocTitle').innerText = doc.name;
      document.getElementById('prevDocMeta').innerText = `Category: ${doc.category} | Uploaded: ${doc.uploadDate}`;
      document.getElementById('prevDocStatus').innerText = doc.status;
      document.getElementById('prevDocStatus').style.color = doc.statusColor;

      const banner = document.getElementById('prevRejectionBanner');
      if (doc.rejectionReason) {
        banner.style.display = 'block';
        document.getElementById('prevRejectionReason').innerText = doc.rejectionReason;
      } else {
        banner.style.display = 'none';
      }
    }
  },

  onStateChange() {
    const stateEl = document.getElementById('searchState');
    const cityEl = document.getElementById('searchCity');
    if (!stateEl || !cityEl) return;

    const selectedState = stateEl.value;
    const cities = this.stateCityMap[selectedState] || ['All Cities'];

    cityEl.innerHTML = cities.map(c => `<option value="${c === 'All Cities' ? '' : c}">${c}</option>`).join('');
    this.filterJobs();
  },

  renderFeaturedJobs(jobs) {
    const container = document.getElementById('featuredJobsContainer');
    if (!container) return;

    container.innerHTML = jobs.map(j => `
      <div class="form-card" style="border: 1px solid #0284c7; background: #f0f9ff;">
        <span class="tag" style="background:#0284c7; color:white; font-weight:800;">🔥 FEATURED</span>
        <h3 style="font-size:1.15rem; font-weight:800; margin-top:0.35rem;">${this.escapeHtml(j.title)}</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">${this.escapeHtml(j.client)} — 📍 ${this.escapeHtml(j.location)}</p>
        <p style="font-size:0.825rem; color:var(--dark); margin:0.4rem 0;">💼 ${this.escapeHtml(j.type)} | 🕐 ${this.escapeHtml(j.expDisplay)}</p>
        <a href="job-details.html?id=${j.id}" class="btn btn-primary btn-sm" style="width:100%; margin-top:0.5rem;">VIEW DETAILS & APPLY →</a>
      </div>
    `).join('');
  },

  renderJobsGrid(jobs) {
    const container = document.getElementById('jobsGridContainer');
    const countEl = document.getElementById('jobsCountText');
    if (!container) return;

    if (countEl) countEl.innerText = `${jobs.length} Jobs Found`;

    if (!jobs || jobs.length === 0) {
      container.innerHTML = `
        <div class="form-card" style="text-align:center; padding:3rem 1.5rem; background:white;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">🔍</div>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--dark);">NO JOBS FOUND</h3>
          <p style="font-size:0.9rem; color:var(--text-muted); max-width:480px; margin:0.5rem auto 1.5rem auto;">No vacancies match your search criteria. Try changing your location or department filters.</p>
          <button onclick="APP.clearSearch()" class="btn btn-primary">CLEAR SEARCH</button>
        </div>
      `;
      return;
    }

    container.innerHTML = jobs.map(j => `
      <div class="form-card" style="margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <span class="tag" style="background:#d1fae5; color:#10b981; font-weight:800;"><span class="pulse-dot"></span>${this.escapeHtml(j.status)}</span>
            <span class="badge-match" style="margin-left:0.4rem;">🎯 ${j.matchScore || 88}% Profile Match</span>
            <h3 style="font-size:1.25rem; font-weight:800; margin-top:0.35rem;">${this.escapeHtml(j.title)}</h3>
            <p style="font-size:0.875rem; color:var(--text-muted); font-weight:600;">${this.escapeHtml(j.client)} — 📍 ${this.escapeHtml(j.location)}</p>
          </div>
          <button onclick="APP.toggleSaveJob('${j.id}')" class="btn btn-outline btn-sm" style="color:var(--dark); border-color:#cbd5e1;">♡ SAVE</button>
        </div>

        <div style="display:flex; gap:1rem; flex-wrap:wrap; font-size:0.85rem; color:var(--dark); margin:0.75rem 0;">
          <div>💼 <strong>Type:</strong> ${this.escapeHtml(j.type)}</div>
          <div>🕐 <strong>Exp:</strong> ${this.escapeHtml(j.expDisplay)}</div>
          <div>🌐 <strong>Mode:</strong> ${this.escapeHtml(j.workMode)}</div>
          <div>🏢 <strong>Dept:</strong> ${this.escapeHtml(j.department)}</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-top:1px solid #e2e8f0; padding-top:0.75rem;">
          <span style="font-size:0.78rem; color:var(--text-muted);">Posted: ${this.escapeHtml(j.postedDate)}</span>
          <div style="display:flex; gap:0.5rem;">
            <a href="job-details.html?id=${j.id}" class="btn btn-outline btn-sm" style="color:var(--dark); border-color:#cbd5e1;">VIEW DETAILS</a>
            <a href="job-details.html?id=${j.id}&apply=true" class="btn btn-primary btn-sm">APPLY NOW →</a>
          </div>
        </div>
      </div>
    `).join('');
  },

  filterJobs() {
    const query = document.getElementById('searchQuery') ? document.getElementById('searchQuery').value.toLowerCase() : '';
    this.filteredJobs = this.allJobs.filter(j => !query || j.title.toLowerCase().includes(query));
    this.renderJobsGrid(this.filteredJobs);
  },

  clearSearch() {
    this.filteredJobs = this.allJobs;
    this.renderJobsGrid(this.allJobs);
    this.showToast('Search filters reset', 'info');
  },

  async toggleSaveJob(jobId) {
    this.showToast('✓ Job saved to candidate bookmarks!', 'success');
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  APP.animateCounters();
});
