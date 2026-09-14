/**
 * Confetti & Sparkle Particle Engine
 * Realistic gravity, rotation, heart shapes, gold stars, and romantic sparkles
 */

const Confetti = (() => {
  let canvas, ctx;
  let particles = [];
  let animationId = null;
  let width, height;

  const COLORS = [
    '#e63946', '#ff758f', '#ffccd5', '#f4a261', '#ffd166',
    '#06d6a0', '#a29bfe', '#ffffff', '#ffb703'
  ];

  function init() {
    canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor(x, y, isHeart = false) {
      this.x = x ?? Math.random() * width;
      this.y = y ?? -10;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.size = Math.random() * 8 + 6;
      this.speedX = (Math.random() - 0.5) * 8;
      this.speedY = Math.random() * -12 - 4; // Initial upward burst
      this.gravity = 0.28;
      this.drag = 0.985;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
      this.isHeart = isHeart || Math.random() < 0.35;
      this.oscillationSpeed = Math.random() * 0.05 + 0.02;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.speedY += this.gravity;
      this.speedX *= this.drag;
      this.speedY *= this.drag;
      this.x += this.speedX + Math.sin(this.angle) * 1.5;
      this.y += this.speedY;
      this.angle += this.oscillationSpeed;
      this.rotation += this.rotationSpeed;

      if (this.y > height * 0.7) {
        this.opacity -= 0.018;
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        // Draw Heart Shape
        const s = this.size * 0.7;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.4, 0, s * 1.4);
        ctx.bezierCurveTo(s * 1.4, s * 0.4, s, -s * 0.6, 0, s * 0.3);
        ctx.fill();
      } else {
        // Draw Confetti Ribbon
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }

      ctx.restore();
    }
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.opacity <= 0 || p.y > height + 20) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function burst(x, y, count = 120) {
    if (!canvas) init();
    const spawnX = x ?? width / 2;
    const spawnY = y ?? height / 2;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(spawnX, spawnY));
    }

    if (!animationId) {
      loop();
    }
  }

  function rain(durationMs = 4000) {
    if (!canvas) init();
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > durationMs) {
        clearInterval(interval);
        return;
      }
      for (let i = 0; i < 6; i++) {
        const p = new Particle(Math.random() * width, -10);
        p.speedY = Math.random() * 3 + 2;
        p.speedX = (Math.random() - 0.5) * 3;
        particles.push(p);
      }
      if (!animationId) loop();
    }, 60);
  }

  return {
    init,
    burst,
    rain
  };
})();

window.Confetti = Confetti;
