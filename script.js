// Particle Background
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const PANEL_CHECK_INTERVAL = 5; // only check glow every 5 frames
let frameCounter = 0;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = "rgba(0, 170, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  frameCounter++;
  if (frameCounter % PANEL_CHECK_INTERVAL === 0) {
    updatePanelGlow();
  }

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();

// Ripple Effect
document.addEventListener("click", e => {
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${e.pageX}px`;
  ripple.style.top = `${e.pageY}px`;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
});

// Dynamic Panel Glow
const panels = document.querySelectorAll(".glass-panel");

function updatePanelGlow() {
  panels.forEach(panel => {
    const panelRect = panel.getBoundingClientRect();
    let glowIntensity = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (
        p.x > panelRect.left &&
        p.x < panelRect.right &&
        p.y > panelRect.top &&
        p.y < panelRect.bottom
      ) {
        glowIntensity += 0.15;
      }
    }

    glowIntensity = Math.min(glowIntensity, 1);

    panel.style.boxShadow = `0 0 ${25 + glowIntensity * 30}px rgba(0, 204, 255, ${0.3 + glowIntensity * 0.3})`;
    panel.style.borderColor = `rgba(0, 204, 255, ${0.2 + glowIntensity * 0.1})`;
  });
}
