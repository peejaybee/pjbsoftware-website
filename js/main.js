/**
 * PJB Software & Consulting - Client Script
 * Handles responsive navigation, interactive ROI calculator, FAQ toggles, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRoiCalculator();
  initFaqAccordion();
  initContactForm();
  highlightActiveNav();
});

/* ==========================================================================
   1. Navbar Scroll & Mobile Menu Toggle
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Header background on scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close menu when clicking outside or clicking any nav link
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

/* ==========================================================================
   2. Active Navigation Highlight
   ========================================================================== */
function highlightActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. Interactive Automation ROI Calculator
   ========================================================================== */
function initRoiCalculator() {
  const teamInput = document.getElementById('calc-team');
  const hoursInput = document.getElementById('calc-hours');
  const rateInput = document.getElementById('calc-rate');

  const teamDisplay = document.getElementById('val-team');
  const hoursDisplay = document.getElementById('val-hours');
  const rateDisplay = document.getElementById('val-rate');

  const outHoursSaved = document.getElementById('result-hours-saved');
  const outAnnualSavings = document.getElementById('result-annual-savings');
  const outPayback = document.getElementById('result-payback');

  if (!teamInput || !hoursInput || !rateInput) return;

  function calculate() {
    const teamSize = parseInt(teamInput.value, 10) || 1;
    const hoursWeekly = parseInt(hoursInput.value, 10) || 1;
    const hourlyRate = parseInt(rateInput.value, 10) || 25;

    // Update display values
    if (teamDisplay) teamDisplay.textContent = teamSize + (teamSize === 1 ? ' person' : ' people');
    if (hoursDisplay) hoursDisplay.textContent = hoursWeekly + ' hrs/wk';
    if (rateDisplay) rateDisplay.textContent = '$' + hourlyRate + '/hr';

    // Calculation logic:
    // Conservative automation rate: 60% of repetitive task time freed up via AI / automated workflows
    const automationFactor = 0.60;
    
    // Monthly hours saved per team: (teamSize * hoursWeekly * 4.33 wks/month) * factor
    const monthlyHoursSaved = Math.round(teamSize * hoursWeekly * 4.33 * automationFactor);

    // Annual direct labor cost savings: teamSize * hoursWeekly * 52 wks * hourlyRate * factor
    const annualSavings = Math.round(teamSize * hoursWeekly * 52 * hourlyRate * automationFactor);

    // Estimated payback turnaround
    let paybackPeriod = '< 60 Days';
    if (annualSavings > 100000) {
      paybackPeriod = '< 30 Days';
    } else if (annualSavings < 25000) {
      paybackPeriod = '< 90 Days';
    }

    if (outHoursSaved) {
      outHoursSaved.textContent = monthlyHoursSaved.toLocaleString() + ' hrs';
    }
    if (outAnnualSavings) {
      outAnnualSavings.textContent = '$' + annualSavings.toLocaleString();
    }
    if (outPayback) {
      outPayback.textContent = paybackPeriod;
    }
  }

  // Bind input listeners
  [teamInput, hoursInput, rateInput].forEach(elem => {
    elem.addEventListener('input', calculate);
  });

  // Initial calculation run
  calculate();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Optional: Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   5. Consultation Request Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  const feedbackBox = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const company = form.querySelector('#company')?.value.trim() || 'Not specified';
    const service = form.querySelector('#service')?.value;
    const timeline = form.querySelector('#timeline')?.value || 'Not specified';
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !service || !message) {
      showFeedback('Please fill out all required fields marked with *.', 'error');
      return;
    }

    // Simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showFeedback('Please enter a valid work email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Inquiry...';

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@pjbsoftware.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Consulting Inquiry: ${service} from ${name}`,
          _template: 'table',
          _captcha: 'false',
          name: name,
          email: email,
          company: company,
          service: service,
          timeline: timeline,
          message: message
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.success === 'true' || result.success === true)) {
        form.reset();
        showFeedback(
          `<strong>Thank you, ${escapeHtml(name)}!</strong> Your inquiry has been sent to <strong>info@pjbsoftware.com</strong>. We will review your project requirements and respond within 24 business hours.`,
          'success'
        );
      } else if (result.message && result.message.toLowerCase().includes('activation')) {
        showFeedback(
          `<strong>Activation Required:</strong> FormSubmit has sent a confirmation link to <strong>info@pjbsoftware.com</strong>. Please check your inbox and click <em>"Activate Form"</em> to enable delivery. Once clicked, future submissions will arrive immediately.`,
          'success'
        );
      } else if (window.location.protocol === 'file:' || (result.message && result.message.toLowerCase().includes('web server'))) {
        showFeedback(
          `<strong>Local File Warning:</strong> FormSubmit requires the site to be browsed through a web server (such as your live Cloudflare domain or locally via <code>http://localhost:8000</code>). Browsers block form delivery from raw <code>file:///</code> paths.`,
          'error'
        );
      } else {
        const errorMsg = result.message || 'Submission was not accepted by the mail service.';
        showFeedback(
          `${escapeHtml(errorMsg)} Please reach out directly to <a href="mailto:info@pjbsoftware.com?subject=Consulting%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}" style="color: var(--accent-cyan-light); text-decoration: underline; font-weight: bold;">info@pjbsoftware.com</a>.`,
          'error'
        );
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      if (window.location.protocol === 'file:') {
        showFeedback(
          `<strong>Local File Warning:</strong> You are viewing this page as a local file (<code>file:///</code>). FormSubmit and browser security policies require an HTTP server (e.g. <code>http://localhost:8000</code> or your live Cloudflare site) to send AJAX requests.`,
          'error'
        );
      } else {
        showFeedback(
          `There was an issue sending your message automatically. Please email us directly at <a href="mailto:info@pjbsoftware.com?subject=Consulting%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}" style="color: var(--accent-cyan-light); text-decoration: underline; font-weight: bold;">info@pjbsoftware.com</a> and we will respond promptly.`,
          'error'
        );
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (feedbackBox) {
        feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  function showFeedback(msg, type) {
    if (!feedbackBox) return;
    feedbackBox.innerHTML = msg;
    feedbackBox.className = `form-feedback ${type}`;
    feedbackBox.style.display = 'block';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
