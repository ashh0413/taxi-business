/* ═══════════════════════════════════════════════════════════════
   TAXI HUB — Main JavaScript
   Liquid Glass Interactions & Functionality
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════════════════════════
// THEME MANAGEMENT
// ═══════════════════════════════════════════════════════════════

const ThemeManager = {
  STORAGE_KEY: 'taxihub-theme',

  init() {
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || 'dark';
    this.setTheme(savedTheme, false); // false = don't animate

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light', true);
        }
      });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next, true);
  },

  setTheme(theme, animate = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    // Trigger animation if enabled
    if (animate) {
      document.documentElement.style.transition =
        'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1), color 250ms cubic-bezier(0.16, 1, 0.3, 1)';

      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 250);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// ACCORDION
// ═══════════════════════════════════════════════════════════════

function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion-item');

    items.forEach(item => {
      const header = item.querySelector('.accordion-header');

      if (header) {
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all items in this accordion
          items.forEach(i => i.classList.remove('open'));

          // Toggle clicked item
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// BOTTOM NAVIGATION
// ═══════════════════════════════════════════════════════════════

function initBottomNav() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Don't prevent default if it's a link
      if (this.tagName === 'A') return;

      // Remove active from all
      navItems.forEach(n => n.classList.remove('active'));

      // Add active to clicked
      this.classList.add('active');
    });
  });

  // Auto-highlight based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// WHATSAPP BOOKING
// ═══════════════════════════════════════════════════════════════

const WhatsApp = {
  PHONE: '919158798744',

  // Pre-filled message templates
  MESSAGES: {
    default: "Hi! I'd like to book a taxi in Goa.",
    airport: "Hi! I need airport pickup/drop service in Goa.",
    sightseeing: "Hi! I'm interested in your sightseeing tours in Goa.",
    fleet: "Hi! I'd like to know more about your fleet.",
    bulk: "Hi! I have a bulk booking inquiry.",
    gallery: "Hi! I saw your gallery and would like to book.",
    tips: "Hi! I have a question about your travel tips.",
    faq: "Hi! I have a question.",
    contact: "Hi! I'd like to get in touch.",
    custom: "Hi! "
  },

  // Generate WhatsApp URL
  getUrl(messageType = 'default') {
    const message = this.MESSAGES[messageType] || this.MESSAGES.custom;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${this.PHONE}?text=${encoded}`;
  },

  // Open WhatsApp with specific message
  open(messageType = 'default') {
    window.open(this.getUrl(messageType), '_blank');
  },

  // Book specific vehicle
  bookVehicle(vehicleName) {
    const message = `Hi! I'd like to book a ${vehicleName}.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${this.PHONE}?text=${encoded}`, '_blank');
  },

  // Book specific route
  bookRoute(routeName) {
    const message = `Hi! I'm interested in the ${routeName} trip. What are the details?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${this.PHONE}?text=${encoded}`, '_blank');
  },

  // Enquiry from form
  sendEnquiry(formData) {
    const message = `Hi! I'd like to make an enquiry.\n\n${formData}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${this.PHONE}?text=${encoded}`, '_blank');
  }
};

// Make WhatsApp available globally
window.WhatsApp = WhatsApp;

// ═══════════════════════════════════════════════════════════════
// FORM HANDLING
// ═══════════════════════════════════════════════════════════════

function initForms() {
  const forms = document.querySelectorAll('form[data-whatsapp]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      let message = `Booking Enquiry:\n\n`;

      for (const [key, value] of formData.entries()) {
        if (value) {
          message += `${formatLabel(key)}: ${value}\n`;
        }
      }

      WhatsApp.sendEnquiry(message);
    });
  });
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

// ═══════════════════════════════════════════════════════════════
// BOOKING FORM MODAL
// ═══════════════════════════════════════════════════════════════

function initBookingModal() {
  const modalTriggers = document.querySelectorAll('[data-book]');
  const modal = document.getElementById('booking-modal');

  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const vehicleSelect = modal.querySelector('#booking-vehicle');
  const routeSelect = modal.querySelector('#booking-route');
  const dateInput = modal.querySelector('#booking-date');
  const passengersInput = modal.querySelector('#booking-passengers');
  const submitBtn = modal.querySelector('#booking-submit');

  // Open modal
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.dataset.book;

      if (type === 'vehicle' && vehicleSelect) {
        vehicleSelect.value = trigger.dataset.vehicle || '';
      } else if (type === 'route' && routeSelect) {
        routeSelect.value = trigger.dataset.route || '';
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Submit booking
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const vehicle = vehicleSelect?.value || '';
      const route = routeSelect?.value || '';
      const date = dateInput?.value || '';
      const passengers = passengersInput?.value || '';

      let message = 'Hi! I would like to make a booking:\n\n';

      if (vehicle) message += `Vehicle: ${vehicle}\n`;
      if (route) message += `Route/Trip: ${route}\n`;
      if (date) message += `Date: ${date}\n`;
      if (passengers) message += `Passengers: ${passengers}\n`;

      WhatsApp.sendEnquiry(message);
      closeModal();
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    form.reset();
  }
}

// ═══════════════════════════════════════════════════════════════
// TRIP CALCULATOR
// ═══════════════════════════════════════════════════════════════

const TripCalculator = {
  // Base prices
  prices: {
    sedan: 1600,
    ertiga: 1800,
    marazzo: 2200
  },

  // Per km rates (for custom routes)
  perKm: 12,

  // Duration rates (for hourly)
  hourlyRate: {
    sedan: 300,
    ertiga: 350,
    marazzo: 450
  },

  // Calculate trip cost
  calculate(type, vehicle, data) {
    let base = this.prices[vehicle] || this.prices.sedan;

    switch (type) {
      case 'hourly':
        return base + (this.hourlyRate[vehicle] * (data.hours - 4));

      case 'airport':
        return base + (data.distance * this.perKm);

      case 'custom':
        return base + (data.stops * 200);

      default:
        return base;
    }
  },

  // Format price
  format(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
};

// ═══════════════════════════════════════════════════════════════
// GALLERY LIGHTBOX
// ═══════════════════════════════════════════════════════════════

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ═══════════════════════════════════════════════════════════════
// LAZY LOADING IMAGES
// ═══════════════════════════════════════════════════════════════

function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      if (!img.classList.contains('loaded')) {
        imageObserver.observe(img);
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .service-card, .car-card, .route-card, .accordion-item, .trust-badge'
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, index) => {
    // Add staggered delay for cards
    if (el.classList.contains('service-card') ||
        el.classList.contains('car-card') ||
        el.classList.contains('route-card') ||
        el.classList.contains('accordion-item')) {
      const delay = (index % 4) * 80;
      el.style.transitionDelay = `${delay}ms`;
    }
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════
// PARALLAX HERO
// ═══════════════════════════════════════════════════════════════

function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');

  if (!heroBg) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 420;

    if (scrolled < heroHeight) {
      const parallaxOffset = scrolled * 0.4;
      heroBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
// FLEET CAROUSEL
// ═══════════════════════════════════════════════════════════════

function initFleetCarousel() {
  const carousel = document.querySelector('.fleet-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.fleet-track');
  const cards = carousel.querySelectorAll('.car-card');
  const dotsContainer = carousel.querySelector('.carousel-dots');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = carousel.querySelectorAll('.carousel-dot');

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 16; // CSS gap
    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    updateCarousel();
  }

  // Touch/drag support
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < cards.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
      isDragging = false;
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Mouse drag support
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  track.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < cards.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    }
    isDragging = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseleave', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    updateCarousel();
  });

  // Initial setup
  track.style.cursor = 'grab';
  updateCarousel();
}

// ═══════════════════════════════════════════════════════════════
// CARD INTERACTIONS
// ═══════════════════════════════════════════════════════════════

function initCardInteractions() {
  // Service cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
      const link = this.querySelector('a');
      if (link) {
        window.location.href = link.href;
      }
    });
  });

  // Car cards - WhatsApp booking
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', function() {
      const vehicleName = this.querySelector('.car-name')?.textContent;
      if (vehicleName) {
        WhatsApp.bookVehicle(vehicleName.trim());
      }
    });
  });

  // Route cards - WhatsApp enquiry
  document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', function() {
      const routeName = this.querySelector('.route-name')?.textContent;
      if (routeName) {
        WhatsApp.bookRoute(routeName.trim());
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// VISITORS COUNTER (SIMULATED FOR DEMO)
// ═══════════════════════════════════════════════════════════════

function initVisitorBadge() {
  const badge = document.querySelector('.visitor-count');
  if (!badge) return;

  // In production, this would be an actual counter
  // For demo, we show a realistic number
  const visits = localStorage.getItem('taxihub-visits') || 0;
  const newVisits = parseInt(visits) + 1;
  localStorage.setItem('taxihub-visits', newVisits);
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════════

function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.counter;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.counter);
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  element.classList.add('counted');

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
      element.classList.add('counter-done');
    }
  }

  requestAnimationFrame(update);
}

// ═══════════════════════════════════════════════════════════════
// FLOATING ELEMENTS
// ═══════════════════════════════════════════════════════════════

function initFloatingElements() {
  const floaters = document.querySelectorAll('.float-animation');
  floaters.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.5}s`;
  });
}

// ═══════════════════════════════════════════════════════════════
// ENHANCED SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════

function initEnhancedScrollReveal() {
  // Reveal left animations
  const leftElements = document.querySelectorAll('.reveal-left');
  const leftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        leftObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  leftElements.forEach(el => leftObserver.observe(el));

  // Reveal right animations
  const rightElements = document.querySelectorAll('.reveal-right');
  const rightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        rightObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  rightElements.forEach(el => rightObserver.observe(el));

  // Reveal scale animations
  const scaleElements = document.querySelectorAll('.reveal-scale');
  const scaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        scaleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scaleElements.forEach(el => scaleObserver.observe(el));

  // Stagger reveal for grid items
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObserver.observe(el));
}

// ═══════════════════════════════════════════════════════════════
// FLEET SLIDER
// ═══════════════════════════════════════════════════════════════

const fleetSlider = {
  currentIndex: 0,
  slides: null,
  indicators: null,

  init() {
    this.slides = document.querySelectorAll('.fleet-slide');
    this.indicators = document.querySelectorAll('.fleet-indicators .indicator');
    if (!this.slides.length) return;

    // Touch support
    let startX = 0;
    const slider = document.querySelector('.fleet-single-card');
    if (slider) {
      slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) this.prev();
          else this.next();
        }
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Indicator clicks
    this.indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => this.goTo(i));
    });
  },

  next() {
    const total = this.slides.length;
    this.goTo((this.currentIndex + 1) % total);
  },

  prev() {
    const total = this.slides.length;
    this.goTo((this.currentIndex - 1 + total) % total);
  },

  goTo(index) {
    this.slides[this.currentIndex].classList.remove('active');
    this.indicators[this.currentIndex]?.classList.remove('active');

    this.currentIndex = index;

    this.slides[this.currentIndex].classList.add('active');
    this.indicators[this.currentIndex]?.classList.add('active');
  }
};

// INITIALIZE ALL
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initAccordions();
  initBottomNav();
  initForms();
  initBookingModal();
  initGalleryLightbox();
  initLazyLoading();
  initSmoothScroll();
  initCardInteractions();
  initVisitorBadge();
  initScrollReveal();
  initHeroParallax();
  initAnimatedCounters();
  initFloatingElements();
  initEnhancedScrollReveal();
  fleetSlider.init();

  // Add loaded class for animations
  document.body.classList.add('loaded');
});

// ═══════════════════════════════════════════════════════════════
// EXPORTS (for module usage if needed)
// ═══════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    WhatsApp,
    TripCalculator
  };
}
