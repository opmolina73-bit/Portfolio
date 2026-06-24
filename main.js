const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const steps = [...document.querySelectorAll(".journey-step")];
const dots = [...document.querySelectorAll(".rail-dot")];
const routeCards = [...document.querySelectorAll(".route-card")];
const canvas = document.querySelector("#route-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let mouseX = 0;
let mouseY = 0;

const colors = ["#2178ff", "#e84b37", "#ffb642", "#73d7b7", "#202020"];

function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(28, Math.min(70, Math.floor(width / 18)));
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 3 + Math.random() * 10,
    speed: 0.25 + Math.random() * 0.7,
    drift: -0.35 + Math.random() * 0.7,
    rotation: Math.random() * Math.PI,
    color: colors[index % colors.length],
    shape: index % 3,
  }));
}

function drawParticle(particle) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = particle.color === "#202020" ? 0.08 : 0.24;
  ctx.fillStyle = particle.color;

  if (particle.shape === 0) {
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
  } else if (particle.shape === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -particle.size);
    ctx.lineTo(particle.size, particle.size);
    ctx.lineTo(-particle.size, particle.size);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift + mouseX * 0.0008;
    particle.rotation += 0.006 + mouseY * 0.000002;

    if (particle.y < -20) {
      particle.y = height + 20;
      particle.x = Math.random() * width;
    }

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;

    drawParticle(particle);
  });

  requestAnimationFrame(animateCanvas);
}

function setActiveStep(index) {
  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
}

function initAnime() {
  if (prefersReducedMotion || typeof anime === "undefined") return;

  anime
    .timeline({
      easing: "easeOutExpo",
      duration: 900,
    })
    .add({
      targets: ".brand span",
      scale: [0, 1],
      rotate: [-30, 0],
      delay: anime.stagger(90),
    })
    .add(
      {
        targets: ".hero-copy .eyebrow, .hero-copy h1, .hero-copy p, .hero-actions a",
        translateY: [36, 0],
        opacity: [0, 1],
        delay: anime.stagger(75),
      },
      "-=520",
    )
    .add(
      {
        targets: ".route-card",
        translateY: [70, 0],
        rotate: (el) => el.classList.contains("design") ? [13, 4] : el.classList.contains("camera") ? [-14, -5] : [-11, -2],
        opacity: [0, 1],
        delay: anime.stagger(120),
      },
      "-=760",
    );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const index = steps.indexOf(entry.target);
        setActiveStep(index);
        entry.target.classList.add("is-visible");

        anime({
          targets: entry.target.querySelectorAll(".section-head, .chapter-number, article, .timeline-panel, .experience-item, .contact-links a"),
          translateY: [46, 0],
          opacity: [0, 1],
          delay: anime.stagger(80),
          duration: 760,
          easing: "easeOutCubic",
        });
      });
    },
    { threshold: 0.32 },
  );

  steps.forEach((step) => observer.observe(step));
}

function bindParallax() {
  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX - width / 2;
    mouseY = event.clientY - height / 2;

    if (prefersReducedMotion) return;

    routeCards.forEach((card) => {
      const depth = Number(card.dataset.depth || 0.1);
      card.style.translate = `${mouseX * depth * 0.04}px ${mouseY * depth * 0.04}px`;
    });
  });

  window.addEventListener("scroll", () => {
    if (prefersReducedMotion) return;
    const scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty("--hero-spin", `${scrollRatio * 80}deg`);
  }, { passive: true });
}

window.addEventListener("resize", sizeCanvas);

sizeCanvas();
bindParallax();
initAnime();

if (!prefersReducedMotion) {
  animateCanvas();
}
