/* ==========================================================================
   OBSYRA PRIVATE LIMITED - Main Interactive JavaScript (Multi-page Support)
   Featuring Webhook Integration with Deployed Google Apps Script
   ========================================================================== */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwEzp0hSOe6iqaiP65lOjWFIhclQ1R1io2KS9Omn-IdBr2pSBF_t2QDKZUFjvFRemXzBg/exec';

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initCounters();
  initNocMonitor();
  initScrollEffects();
  initMovingCarousel();
  if (document.getElementById('slider-sites')) {
    updateEstimator();
  }
});

/* ==========================================================================
   1. HERO NETWORK TOPOLOGY CANVAS ANIMATION
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const count = Math.min(Math.floor(width / 25), 45);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
      color: Math.random() > 0.4 ? '#E5B842' : '#00F0FF'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(229, 184, 66, ${1 - dist / 160 * 0.8})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. MOVING IMAGE CAROUSEL CONTROLLER
   ========================================================================== */
let carouselTimer = null;
let currentSlideIndex = 0;

function initMovingCarousel() {
  const container = document.getElementById('moving-carousel');
  if (!container) return;

  const slides = container.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });

    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
  }

  window.nextSlide = function() {
    showSlide(currentSlideIndex + 1);
  };

  window.prevSlide = function() {
    showSlide(currentSlideIndex - 1);
  };

  window.goToSlide = function(index) {
    showSlide(index);
  };

  function startAutoPlay() {
    stopAutoPlay();
    carouselTimer = setInterval(() => {
      nextSlide();
    }, 4500);
  }

  function stopAutoPlay() {
    if (carouselTimer) clearInterval(carouselTimer);
  }

  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);

  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 40) {
      nextSlide();
    } else if (touchEndX - touchStartX > 40) {
      prevSlide();
    }
  }, { passive: true });

  startAutoPlay();
}

/* ==========================================================================
   3. NUMERIC COUNTER ANIMATIONS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const speed = 200;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;

        let count = 0;
        const inc = target / speed;

        const update = () => {
          count += inc;
          if (count < target) {
            counter.innerText = isDecimal ? count.toFixed(2) : Math.ceil(count).toLocaleString();
            setTimeout(update, 15);
          } else {
            counter.innerText = isDecimal ? target.toFixed(2) : target.toLocaleString() + '+';
          }
        };

        update();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   4. LIVE NOC MONITOR SIMULATOR
   ========================================================================== */
function initNocMonitor() {
  const throughputEl = document.getElementById('noc-throughput');
  const fieldTechsEl = document.getElementById('noc-field-techs');
  const progressBar = document.getElementById('noc-progress-bar');

  if (!throughputEl) return;

  setInterval(() => {
    const randomGbs = (820 + Math.floor(Math.random() * 55)).toString();
    throughputEl.innerText = `${randomGbs} Gbps`;

    if (fieldTechsEl) {
      const randomTechs = (1240 + Math.floor(Math.random() * 20)).toLocaleString();
      fieldTechsEl.innerText = randomTechs;
    }

    const randomProgress = (65 + Math.floor(Math.random() * 25));
    if (progressBar) progressBar.style.width = `${randomProgress}%`;
  }, 3500);
}

/* ==========================================================================
   5. NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-links');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* ==========================================================================
   6. SERVICES FILTER TABS
   ========================================================================== */
function filterServices(category, btn) {
  const buttons = document.querySelectorAll('.tab-nav .tab-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   7. INTERACTIVE B2B ESTIMATOR
   ========================================================================== */
function updateEstimator() {
  const sitesSlider = document.getElementById('slider-sites');
  if (!sitesSlider) return;

  const sites = parseInt(sitesSlider.value);
  const km = parseInt(document.getElementById('slider-km').value);
  const slaLevel = parseInt(document.getElementById('slider-sla').value);

  document.getElementById('val-sites').innerText = `${sites} Sites / Towers`;
  document.getElementById('val-km').innerText = `${km} KM Fiber`;

  const slaLabels = ["4-Hour Standard SLA", "2-Hour Express SLA", "1-Hour Emergency SLA", "30-Min NOC Priority"];
  document.getElementById('val-sla').innerText = slaLabels[slaLevel - 1];

  const basePrice = 3000;
  const siteCost = sites * 180;
  const kmCost = km * 35;
  const slaMultiplier = 1 + (slaLevel - 1) * 0.35;

  const totalMonthly = Math.round((basePrice + siteCost + kmCost) * slaMultiplier);

  document.getElementById('calc-total').innerHTML = `$${totalMonthly.toLocaleString()} <span style="font-size: 1rem; color: var(--text-muted); font-weight: normal;">/ mo</span>`;
}

function submitEstimationRFP() {
  const sites = document.getElementById('val-sites').innerText;
  const km = document.getElementById('val-km').innerText;
  const sla = document.getElementById('val-sla').innerText;
  const total = document.getElementById('calc-total').innerText;

  sessionStorage.setItem('rfp_msg', `[ESTIMATED RFP REQ] Scope: ${sites}, Fiber: ${km}, SLA: ${sla}. Target Estimate: ${total}. Please provide official commercial quote.`);
  
  window.location.href = 'contact.html?rfp=true';
}

if (window.location.pathname.includes('contact.html')) {
  window.addEventListener('DOMContentLoaded', () => {
    const savedRfp = sessionStorage.getItem('rfp_msg');
    if (savedRfp) {
      const msgField = document.getElementById('c-msg');
      if (msgField) {
        msgField.value = savedRfp;
        sessionStorage.removeItem('rfp_msg');
        showToast('RFP parameters auto-synced from Estimator!');
      }
    }
  });
}

/* ==========================================================================
   8. CAREERS JOB FILTERING
   ========================================================================== */
function filterJobs(category, btn) {
  const pills = document.querySelectorAll('.careers-filter .filter-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const jobs = document.querySelectorAll('.job-card');
  jobs.forEach(job => {
    if (category === 'all' || job.getAttribute('data-category') === category) {
      job.style.display = 'flex';
    } else {
      job.style.display = 'none';
    }
  });
}

/* ==========================================================================
   9. APPLICATION & MODAL HANDLERS (AUTOMATED WEBHOOK DISPATCH)
   ========================================================================== */
function openApplyModal(roleName) {
  const modal = document.getElementById('apply-modal');
  const roleTitle = document.getElementById('modal-role-title');
  const appliedRoleInput = document.getElementById('applied-role');

  if (roleTitle) roleTitle.innerText = `Apply: ${roleName}`;
  if (appliedRoleInput) appliedRoleInput.value = roleName;

  if (modal) modal.classList.add('active');
}

function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) modal.classList.remove('active');
}

function updateFileName(input) {
  const label = document.getElementById('file-label');
  if (input.files && input.files[0]) {
    label.innerText = `Selected File: ${input.files[0].name}`;
    label.style.color = 'var(--gold-primary)';
  }
}

function handleCandidateSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('app-name').value;
  const email = document.getElementById('app-email').value;
  const phone = document.getElementById('app-phone').value;
  const role = document.getElementById('applied-role').value;

  const payload = {
    action: "Career Application",
    name: name,
    email: email,
    phone: phone,
    role: role,
    message: `Application submitted for position: ${role}`
  };

  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  }).catch(() => {});

  closeApplyModal();
  showToast(`Success! Application for ${role} submitted for ${name}.`);
  document.getElementById('candidate-form').reset();
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('c-name')?.value || '';
  const email = document.getElementById('c-email')?.value || '';
  const phone = document.getElementById('c-phone')?.value || '';
  const org = document.getElementById('c-org')?.value || '';
  const msg = document.getElementById('c-msg')?.value || '';

  const payload = {
    action: "Contact B2B Inquiry",
    name: name,
    email: email,
    phone: phone,
    subject: `Organization: ${org}`,
    message: msg
  };

  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  }).catch(() => {});

  showToast(`B2B Inquiry Received! Thank you ${name} (${org}). Our team will reach out within 2 hours.`);
  document.getElementById('b2b-contact-form')?.reset();
}

/* ==========================================================================
   10. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--gold-primary);"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   11. FLOATING OBSYRA CYBER AI BOT CONTROLLER
   ========================================================================== */
function toggleAiBot() {
  const windowEl = document.getElementById('ai-bot-window');
  if (windowEl) windowEl.classList.toggle('active');
}

function sendAiMessage(customText = null) {
  const inputEl = document.getElementById('ai-bot-input');
  const messagesEl = document.getElementById('ai-bot-messages');
  if (!messagesEl) return;

  const userMsgText = customText || inputEl?.value.trim();
  if (!userMsgText) return;

  // Add User Message Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = userMsgText;
  messagesEl.appendChild(userBubble);

  if (inputEl) inputEl.value = '';
  messagesEl.scrollTop = messagesEl.scrollHeight;

  // Simulated AI Reasoning Delay
  setTimeout(() => {
    let botReply = "Obsyra Private Limited (CIN: U63991PN2026PTC252127) specializes in VIL 5G Core, Nokia AirScale gNB rollouts, and digital workforce management across PAN India.";
    const lower = userMsgText.toLowerCase();

    if (lower.includes('vil') || lower.includes('vodafone')) {
      botReply = "⚡ VIL Project: We execute 5G Core Standalone testing, MME/EPG packet validation, and virtual node provisioning for Vodafone Idea Limited.";
    } else if (lower.includes('nokia') || lower.includes('airscale') || lower.includes('tower')) {
      botReply = "📡 Nokia Project: Turnkey integration of Nokia AirScale gNodeB, Wavence microwave backhaul links, and DWDM optical splicing.";
    } else if (lower.includes('workforce') || lower.includes('attendance') || lower.includes('login') || lower.includes('pin')) {
      botReply = "🆔 Workforce Portal: Access workforce.html to scan dynamic QR attendance, view PIN logins (Test Admin: OBSY-20261 / PIN 1805), and manage field staff.";
    } else if (lower.includes('job') || lower.includes('career') || lower.includes('apply')) {
      botReply = "💼 Careers: We are hiring 5G Core Engineers, Tower Technicians, and Optical Splicers! Apply directly on careers.html or submit your inquiry.";
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('address')) {
      botReply = "📍 Headquarters: M.NO. 1/448, Near Shankar Parvati Mangal Karalay, Vagholi, Pune, Maharashtra - 412207. Email: info@obsyra.co.in.";
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `<i class="fa-solid fa-robot" style="color: var(--cyan-accent); margin-right: 6px;"></i> ${botReply}`;
    messagesEl.appendChild(botBubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 600);
}

/* ==========================================================================
   12. INTERACTIVE GIS REGIONAL HUB SWITCHER
   ========================================================================== */
function selectGisHub(hubName, element) {
  const tags = document.querySelectorAll('.hub-tag');
  tags.forEach(t => t.classList.remove('active'));
  if (element) element.classList.add('active');

  const hubData = {
    'Pune HQ': { throughput: '940 Gbps', sites: '280 Active Sites', status: 'RoC Pune Registered HQ' },
    'Mumbai 5G Core': { throughput: '1.2 Tbps', sites: '420 Active Sites', status: 'VIL 5G EPC Core Hub' },
    'Gujarat Circle': { throughput: '680 Gbps', sites: '310 Active Sites', status: 'Nokia AirScale gNB Deployment' },
    'Delhi NCR': { throughput: '850 Gbps', sites: '390 Active Sites', status: 'DWDM Optical Transport Matrix' }
  };

  const info = hubData[hubName];
  if (info) {
    const throughputEl = document.getElementById('noc-throughput');
    const fieldTechsEl = document.getElementById('noc-field-techs');
    if (throughputEl) throughputEl.innerText = info.throughput;
    if (fieldTechsEl) fieldTechsEl.innerText = info.sites;
    showToast(`GIS Operational Hub Switched: ${hubName} (${info.status})`);
  }
}

/* ==========================================================================
   13. 1-CLICK EXECUTIVE CORPORATE PDF BROCHURE EXPORTER
   ========================================================================== */
function downloadCorporateProfilePdf() {
  showToast("Preparing Official Executive Corporate Profile PDF...");
  setTimeout(() => {
    window.print();
  }, 800);
}
