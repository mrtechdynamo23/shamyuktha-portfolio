/**
 * script.js — Shamyuktha S AI/ML Portfolio
 * ─────────────────────────────────────────────────────────────
 * Premium Interactions, Animations, and Dynamic Functionality
 * Visual Identity: WHITE + BLUE + NAVY
 * 
 * Features:
 *  1. Hero Typewriter Effect
 *  2. Hero Light-Mode Neural Network Constellation Canvas
 *  3. Sticky Navigation & Active Link Spy
 *  4. Mobile Navigation Drawer
 *  5. Custom Cursor (Fine pointer devices)
 *  6. Scroll Progress Bar & Back-to-Top Button
 *  7. Project Filtering by Category
 *  8. Project Details Modal with Rich Content & Publication Links
 *  9. Contact Form Interactive Handler
 * 10. IntersectionObserver Scroll Reveal
 * 11. Accessible Reduced-Motion Support
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════════════
     1. HERO TYPEWRITER EFFECT
     ══════════════════════════════════════════════════════ */
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const roles = [
      'AI & Machine Learning Developer',
      'Generative AI & LLM Specialist',
      'Python & NLP Engineer',
      'Deep Learning Researcher',
      'Java Full Stack Developer'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 75;
    const DELETE_SPEED = 35;
    const HOLD_FULL = 2200;
    const HOLD_EMPTY = 450;

    function runTypeLoop() {
      const currentRole = roles[roleIdx];

      if (!isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;

        if (charIdx === currentRole.length) {
          isDeleting = true;
          setTimeout(runTypeLoop, HOLD_FULL);
          return;
        }
        setTimeout(runTypeLoop, TYPE_SPEED + (Math.random() * 25));
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;

        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(runTypeLoop, HOLD_EMPTY);
          return;
        }
        setTimeout(runTypeLoop, DELETE_SPEED);
      }
    }

    if (!prefersReducedMotion) {
      setTimeout(runTypeLoop, 800);
    } else {
      typewriterEl.textContent = roles[0];
    }
  }

  /* ══════════════════════════════════════════════════════
     2. HERO NEURAL CONSTELLATION CANVAS (Light Mode Theme)
     ══════════════════════════════════════════════════════ */
  const canvas = document.getElementById('hero-neural-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 42;
    const CONNECT_DIST = 135;
    let mouse = { x: null, y: null, radius: 140 };

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 2.2 + 1.2;
        this.color = Math.random() > 0.4 ? 'rgba(37, 99, 235, 0.45)' : 'rgba(14, 165, 233, 0.4)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.5;
            this.y += (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    initParticles();
    animateParticles();
  }

  /* ══════════════════════════════════════════════════════
     3. STICKY NAVBAR & ACTIVE NAVIGATION SPY
     ══════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Sticky shadow toggle
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Spy
    let currentId = '';
    const scrollPosition = scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });

    mobileNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ══════════════════════════════════════════════════════
     4. MOBILE NAVIGATION DRAWER
     ═══════════════════════════════════════════════════ */
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (navToggle && mobileDrawer) {
    function toggleDrawer() {
      const isOpen = navToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
    }

    function closeDrawer() {
      navToggle.classList.remove('open');
      mobileDrawer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }

    navToggle.addEventListener('click', toggleDrawer);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     5. CUSTOM CURSOR (Fine Pointer Devices)
     ══════════════════════════════════════════════════════ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        isVisible = true;
      }

      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isVisible = false;
    });

    // Hover expand on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .filter-btn');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '48px';
        cursorRing.style.height = '48px';
        cursorRing.style.borderColor = 'rgba(37, 99, 235, 0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'rgba(37, 99, 235, 0.4)';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     6. SCROLL PROGRESS & BACK TO TOP BUTTON
     ══════════════════════════════════════════════════════ */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollProgressBar && docHeight > 0) {
      const progress = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     7. PROJECT FILTERING
     ══════════════════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');

          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     8. PROJECT DETAILS MODAL & RICH DATA
     ══════════════════════════════════════════════════════ */
  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const projectDetails = {
    crispr: {
      title: 'CRISPR gRNA Efficiency & Off-Target Risk Prediction',
      category: 'Deep Learning · Bioinformatics Research',
      date: 'Jan 2026 – Apr 2026',
      lead: 'Bioinformatic Convolutional Neural Network predicting on-target cleavage efficiency and scoring off-target mismatch propensity directly from genomic sequences.',
      description: 'CRISPR-Cas9 genome editing hinges on picking guide RNAs that cut exclusively at the intended target locus without causing dangerous double-strand breaks elsewhere in the genome. In this research project, we designed and trained a specialized Convolutional Neural Network (CNN) pipeline to process one-hot encoded genomic matrices, identify nucleotide composition patterns, and calculate quantitative risk scores.',
      highlights: [
        'Trained 1D/2D CNN architectures on genomic benchmark datasets to predict Cas9 cleavage efficiencies.',
        'Extracted position-weighted GC motifs and flanking PAM sequence correlations.',
        'Published in the peer-reviewed Journal of Advance and Future Research (JAAFR), Vol. 4, Issue 3, March 2026.',
        'Interactive Streamlit bioinformatics web application for real-time gRNA sequence scoring.'
      ],
      stack: ['Python', 'Deep Learning', 'Convolutional Neural Networks (CNN)', 'Streamlit', 'Bioinformatics', 'Pandas', 'NumPy', 'Scikit-Learn'],
      links: [
        {
          label: 'View Publication (JAAFR)',
          url: 'https://rjwave.org/jaafr/viewpaperforall.php?paper=JAAFR2603799',
          isPrimary: true,
          svgIcon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'
        }
      ]
    },
    jarvis: {
      title: 'J.A.R.V.I.S. — AI-Powered Voice Assistant',
      category: 'Speech AI · Python Voice Engine',
      date: 'Aug 2025 – Dec 2025',
      lead: 'Interactive voice automation assistant providing real-time speech transcription, command parsing, and system integration.',
      description: 'Engineered an intelligent voice-activated system in Python using SpeechRecognition and pyttsx3. The system captures microphone input, parses user intent through natural language heuristics, and performs automated system operations, desktop tasks, web search lookups, and spoken audio responses.',
      highlights: [
        'Bidirectional voice interaction loop with fast speech-to-text and text-to-speech rendering.',
        'Automated desktop workflow execution, system controls, and real-time knowledge queries.',
        'Modular architecture designed for pluggable tool integrations and voice skills.',
        'Robust fallback and error recovery during background noise or microphone interruptions.'
      ],
      stack: ['Python', 'SpeechRecognition', 'pyttsx3', 'NLP', 'OS Automation', 'Audio Signal Processing'],
      links: [
        {
          label: 'View GitHub Repository',
          url: 'https://github.com/shamyukthaS/JARVIS---An-AI-powered-Assistant',
          isPrimary: true,
          svgIcon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>'
        }
      ]
    },
    medico: {
      title: 'MEDICO — Hospital Management System',
      category: 'Django · Full Stack & AI Chatbot',
      date: 'Jan 2025 – May 2025',
      lead: 'Comprehensive web portal uniting Doctors, Patients, and Hospital Admins with an integrated NLP healthcare assistant.',
      description: 'Architected an enterprise healthcare management system in Django with role-based access control. Implemented complete workflows for appointment scheduling, patient records, prescription tracking, and integrated an NLP chatbot to guide patients with common inquiries.',
      highlights: [
        'Role-based authentication & dashboard workflows for Doctors, Patients, and Hospital Admins.',
        'Integrated conversational NLP medical inquiry assistant with symptom check guidelines.',
        'Relational MySQL database architecture ensuring strict record integrity and patient data privacy.',
        'RESTful API architecture ready for telemedicine and lab result expansions.'
      ],
      stack: ['Python', 'Django', 'MySQL', 'HTML5/CSS3', 'REST APIs', 'NLP Chatbot'],
      links: [
        {
          label: 'View GitHub Repository',
          url: 'https://github.com/shamyukthaS/Medical-assistant',
          isPrimary: true,
          svgIcon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>'
        }
      ]
    },
    shopwise: {
      title: 'ShopWise AI — Agentic Personal Shopping Assistant',
      category: 'Generative AI · Agentic LLMs',
      date: 'Recent · Hexaware Mavericks Designathon',
      lead: 'Intelligent shopping assistant leveraging autonomous LLM agents and semantic embeddings to deliver personalized product curation.',
      description: 'Developed for the Hexaware Mavericks Designathon, ShopWise AI utilizes LLM reasoning agents combined with vector embeddings to comprehend nuanced customer preferences, budget boundaries, and purchase intent, delivering dynamic, individualized recommendations.',
      highlights: [
        'Agentic query decomposition and user persona modeling.',
        'Context-aware semantic similarity search with embeddings and SQLite storage.',
        'Seamless conversational interface tailored for interactive retail assistance.'
      ],
      stack: ['Generative AI', 'LLM Agents', 'Vector Embeddings', 'Node.js', 'SQLite', 'Contextual Intent Parsing'],
      links: [
        {
          label: 'View GitHub Repository',
          url: 'https://github.com/shamyukthaS/Hyper-personalised-Shopping-App',
          isPrimary: true,
          svgIcon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>'
        }
      ]
    },
    lexisense: {
      title: 'LEXISENSE — Intelligent NLP & Text Analysis Platform',
      category: 'Natural Language Processing · Analytics',
      date: 'Apr 2026 – Aug 2026',
      lead: 'Modular text processing platform extracting sentiment, linguistic patterns, and key semantic entities from raw text.',
      description: 'Designed a text intelligence engine in Python utilizing advanced linguistic pipelines. LexiSense tokenizes, cleans, and analyzes text to classify sentiment, identify key named entities, and synthesize structured metadata from unstructured documents.',
      highlights: [
        'Linguistic tokenization, stop-word reduction, and n-gram frequency extraction.',
        'Sentiment classification and entity recognition using trained ML classifiers.',
        'Configurable analytics pipeline capable of batch processing complex text collections.'
      ],
      stack: ['Python', 'NLP', 'NLTK', 'spaCy', 'Scikit-Learn', 'Text Analytics'],
      links: []
    },
    weather: {
      title: 'Weather Forecasting Predictive System',
      category: 'Predictive Machine Learning · Forecasting',
      date: 'Verified Machine Learning',
      lead: 'Predictive meteorology system trained on historical weather datasets for localized climate parameter forecasting.',
      description: 'Built a machine learning regression and classification pipeline in Python to forecast key weather variables including temperature anomalies, precipitation probabilities, and atmospheric pressure trends based on historical feature correlations.',
      highlights: [
        'Rigorous data cleaning, missing-value imputation, and multi-feature correlation analysis.',
        'Model training and evaluation across multiple Scikit-Learn regressors and classifiers.',
        'Clear diagnostic metric visualisations (MAE, RMSE, R-squared) validating model accuracy.'
      ],
      stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Supervised Learning'],
      links: []
    }
  };

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal || !modalContent) return;

    let highlightsHtml = '';
    if (data.highlights && data.highlights.length > 0) {
      highlightsHtml = `
        <div class="modal-highlights-title">Key Engineering Highlights</div>
        <ul class="modal-highlights-list">
          ${data.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
      `;
    }

    let stackHtml = '';
    if (data.stack && data.stack.length > 0) {
      stackHtml = `
        <div class="modal-stack-title">Technologies & Tools</div>
        <div class="modal-tech-stack">
          ${data.stack.map((t) => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      `;
    }

    let actionsHtml = '';
    if (data.links && data.links.length > 0) {
      actionsHtml = `
        <div class="modal-actions">
          ${data.links.map((link) => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn ${link.isPrimary ? 'btn--primary' : 'btn--secondary'} btn--sm">
              <span>${link.label}</span>
              ${link.svgIcon || ''}
            </a>
          `).join('')}
        </div>
      `;
    }

    modalContent.innerHTML = `
      <div class="modal-header-meta">
        <span class="modal-category-badge">${data.category}</span>
        <span class="modal-date">${data.date}</span>
      </div>
      <h3 class="modal-project-title" id="modal-project-title">${data.title}</h3>
      <div class="modal-lead">${data.lead}</div>
      <p class="modal-description">${data.description}</p>
      ${highlightsHtml}
      ${stackHtml}
      ${actionsHtml}
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind project details buttons
  const detailButtons = document.querySelectorAll('.project-detail-btn');
  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-project-id');
      openProjectModal(pId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  /* ══════════════════════════════════════════════════════
     9. CONTACT FORM INTERACTION
     ═══════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formFeedback && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle></svg>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Message Sent!</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;

        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${name || 'there'}! Your message has been received. Shamyuktha will get in touch with you shortly.`;

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = `
            <span>Send Message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          `;
        }, 4000);
      }, 700);
    });
  }

  /* ══════════════════════════════════════════════════════
     10. INTERSECTION OBSERVER SCROLL REVEAL
     ═══════════════════════════════════════════════════ */
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ══════════════════════════════════════════════════════
     11. DYNAMIC COPYRIGHT YEAR
     ═══════════════════════════════════════════════════ */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
