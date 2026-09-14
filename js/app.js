/**
 * Main Application Logic
 * Multi-Step Journey Controller, Ambient Particles, Interactive Envelope, and Evasive Button
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize subsystems
  Confetti.init();
  CakeController.init();
  AudioPlayer.init();
  initAmbientCanvas();

  // State
  let currentStep = 1;
  const totalSteps = 4;

  // DOM Elements
  const steps = document.querySelectorAll('.step-section');
  const stepNodes = document.querySelectorAll('.step-node');
  const stepperFill = document.querySelector('.stepper-line-fill');
  const modal = document.getElementById('audio-modal');
  const enterBtn = document.getElementById('btn-enter');

  // Step Names for tracking
  const stepNames = [
    'Apology Letter',
    'Memory Scrapbook',
    'Birthday Cake',
    'Call Me Finale'
  ];

  // =========================================================================
  // Welcome Modal & Autoplay Unlock
  // =========================================================================
  if (enterBtn && modal) {
    enterBtn.addEventListener('click', () => {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
      }, 400);

      // Start music
      AudioPlayer.play();

      // Silent tracking notification
      if (window.Tracker) {
        Tracker.trackEnterExperience();
      }
    });
  }

  // =========================================================================
  // Step Navigation
  // =========================================================================
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > totalSteps) return;

    // Update sections
    steps.forEach((step, idx) => {
      if (idx + 1 === stepNumber) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update Stepper Nodes
    stepNodes.forEach((node, idx) => {
      const stepIdx = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepIdx === stepNumber) {
        node.classList.add('active');
      } else if (stepIdx < stepNumber) {
        node.classList.add('completed');
      }
    });

    // Update Progress Bar Fill
    const progressPercent = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    if (stepperFill) {
      stepperFill.style.width = `${progressPercent}%`;
    }

    currentStep = stepNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track Milestone
    if (window.Tracker) {
      Tracker.trackStepView(currentStep, stepNames[currentStep - 1]);
    }
  }

  // Stepper Node Click
  stepNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const stepNum = parseInt(node.getAttribute('data-step'), 10);
      goToStep(stepNum);
    });
  });

  // Next / Prev Buttons
  document.querySelectorAll('.btn-nav-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      goToStep(currentStep + 1);
    });
  });

  document.querySelectorAll('.btn-nav-prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  // =========================================================================
  // Step 1: Envelope & Wax Seal Unfolding
  // =========================================================================
  const waxSeal = document.getElementById('wax-seal');
  const envelopeClosed = document.getElementById('envelope-closed');
  const letterUnfolded = document.getElementById('letter-unfolded');

  if (waxSeal && envelopeClosed && letterUnfolded) {
    waxSeal.addEventListener('click', openLetter);
    envelopeClosed.addEventListener('click', openLetter);
  }

  function openLetter() {
    if (envelopeClosed.style.display === 'none') return;

    envelopeClosed.style.opacity = '0';
    envelopeClosed.style.transform = 'scale(0.95)';
    envelopeClosed.style.transition = 'all 0.4s ease';

    setTimeout(() => {
      envelopeClosed.style.display = 'none';
      letterUnfolded.style.display = 'block';

      // Confetti burst for delicate opening
      Confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60);

      if (window.Tracker) {
        Tracker.trackLetterOpen();
      }
    }, 380);
  }

  // =========================================================================
  // Step 2: Polaroid Flipping
  // =========================================================================
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // =========================================================================
  // Step 4: The Playful Evasive "Still Thinking" Button
  // =========================================================================
  const evasiveBtn = document.getElementById('btn-evasive');
  const forgiveYesBtn = document.getElementById('btn-forgive-yes');
  const callMeDirectBtn = document.getElementById('btn-call-direct');
  const whatsappDirectBtn = document.getElementById('btn-whatsapp-direct');

  const funnyPhrases = [
    "Nope! Not an option today! 😜",
    "Hey! Don't tap this! 🥺",
    "Just call me already! 📞",
    "I know you miss me too! 🖤",
    "Stop trying to click this! 😂",
    "Call your idiot now! 🙈"
  ];
  let phraseIndex = 0;

  if (evasiveBtn) {
    const dodge = (e) => {
      e.preventDefault();
      const parent = evasiveBtn.parentElement;
      const parentRect = parent.getBoundingClientRect();

      // Random offsets
      const maxX = Math.min(120, parentRect.width / 2);
      const maxY = 50;

      const randomX = (Math.random() - 0.5) * (maxX * 2);
      const randomY = (Math.random() - 0.5) * (maxY * 2);

      evasiveBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
      evasiveBtn.innerText = funnyPhrases[phraseIndex % funnyPhrases.length];
      phraseIndex++;

      evasiveBtn.classList.add('wiggle');
      setTimeout(() => evasiveBtn.classList.remove('wiggle'), 600);
    };

    evasiveBtn.addEventListener('mouseenter', dodge);
    evasiveBtn.addEventListener('touchstart', dodge, { passive: false });
    evasiveBtn.addEventListener('click', dodge);
  }

  if (forgiveYesBtn) {
    forgiveYesBtn.addEventListener('click', () => {
      Confetti.burst(window.innerWidth / 2, window.innerHeight * 0.5, 120);
      Confetti.rain(4000);

      if (window.Tracker) {
        Tracker.trackCallClick();
      }

      // Smooth dial
      setTimeout(() => {
        window.location.href = 'tel:+916379044546';
      }, 700);
    });
  }

  if (callMeDirectBtn) {
    callMeDirectBtn.addEventListener('click', () => {
      if (window.Tracker) {
        Tracker.trackCallClick();
      }
    });
  }

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      if (window.Tracker) {
        Tracker.trackWhatsAppClick();
      }
    });
  }

  // =========================================================================
  // Background Ambient Dust Canvas
  // =========================================================================
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedY: Math.random() * -0.4 - 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulsing: Math.random() * 0.02 + 0.01
      });
    }

    function animateAmbient() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.pulsing) * 0.005;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 220, ${Math.max(0.1, Math.min(0.8, p.opacity))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 117, 143, 0.5)';
        ctx.fill();
      });

      requestAnimationFrame(animateAmbient);
    }

    animateAmbient();
  }
});
