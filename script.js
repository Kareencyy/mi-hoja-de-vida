// ==================== VARIABLES GLOBALES ====================
let particles = [];
let isMenuOpen = false;
let currentSection = "hero";

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  initCustomCursor();
  initParticles();
  initNavigation();
  initScrollAnimations();
  initCounters();
  initProgressBars();
  initSmoothScroll();
  initMobileMenu();
  initHoverEffects();
  initTypingAnimation();
}

// ==================== CURSOR PERSONALIZADO ====================
function initCustomCursor() {
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");

  if (!cursor || !cursorFollower) return;

  // Detectar si es dispositivo móvil o tablet
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // No mostrar cursor personalizado en dispositivos móviles
  if (isMobile) {
    cursor.style.display = "none";
    cursorFollower.style.display = "none";
    return;
  }

  document.addEventListener("mousemove", (e) => {
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      // Suavizar el seguimiento del follower
      setTimeout(() => {
        cursorFollower.style.left = e.clientX + "px";
        cursorFollower.style.top = e.clientY + "px";
      }, 80);
    });
  });

  // Efectos en hover
  const interactiveElements = document.querySelectorAll(
    "a, button, .glass-card, .nav-link, .nav-toggle"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      cursorFollower.classList.add("cursor-hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      cursorFollower.classList.remove("cursor-hover");
    });
  });

  // Ocultar cursor nativo
  document.body.style.cursor = "none";

  // Mostrar cursor nativo cuando el cursor sale de la ventana
  document.addEventListener("mouseout", (e) => {
    if (e.relatedTarget === null) {
      document.body.style.cursor = "auto";
    }
  });

  document.addEventListener("mouseover", () => {
    document.body.style.cursor = "none";
  });
}

// ==================== SISTEMA DE PARTÍCULAS ====================
function initParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  // Crear partículas
  for (let i = 0; i < 50; i++) {
    createParticle();
  }

  // Animar partículas
  animateParticles();
}

function createParticle() {
  const particle = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.2,
  };
  particles.push(particle);
}

function animateParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  container.innerHTML = "";

  particles.forEach((particle, index) => {
    // Actualizar posición
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Rebotar en los bordes
    if (particle.x < 0 || particle.x > window.innerWidth) {
      particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > window.innerHeight) {
      particle.speedY *= -1;
    }

    // Crear elemento DOM
    const particleEl = document.createElement("div");
    particleEl.className = "particle";
    particleEl.style.cssText = `
            position: absolute;
            left: ${particle.x}px;
            top: ${particle.y}px;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: radial-gradient(circle, rgba(59, 130, 246, ${particle.opacity}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        `;
    container.appendChild(particleEl);
  });

  requestAnimationFrame(animateParticles);
}

// ==================== NAVEGACIÓN ====================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      scrollToSection(targetId);

      // Actualizar active link
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Cerrar menú móvil si está abierto
      if (isMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  // Highlight activo según scroll
  window.addEventListener("scroll", updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  currentSection = current;
}

// ==================== SCROLL SUAVE ====================
function initSmoothScroll() {
  // Polyfill para navegadores antiguos
  if (!("scrollBehavior" in document.documentElement.style)) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/dist/smoothscroll.min.js";
    document.head.appendChild(script);
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 100;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// ==================== ANIMACIONES DE SCROLL ====================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");

          // Animaciones específicas por tipo de elemento
          if (entry.target.classList.contains("timeline-item")) {
            animateTimelineItem(entry.target);
          }
          if (entry.target.classList.contains("course-card")) {
            animateCard(entry.target);
          }
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-50px",
    }
  );

  // Observar elementos animables
  const animateElements = document.querySelectorAll(
    ".glass-card, .timeline-item, .course-card, .experience-item"
  );
  animateElements.forEach((el) => observer.observe(el));
}

function animateTimelineItem(element) {
  const dot = element.querySelector(".timeline-dot");
  const content = element.querySelector(".timeline-content");

  if (dot) {
    setTimeout(() => {
      dot.style.transform = "scale(1.2)";
      dot.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.6)";
    }, 200);
  }

  if (content) {
    setTimeout(() => {
      content.style.transform = "translateX(0)";
      content.style.opacity = "1";
    }, 400);
  }
}

function animateCard(element) {
  element.style.transform = "translateY(0) scale(1)";
  element.style.opacity = "1";
}

// ==================== CONTADORES ANIMADOS ====================
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    element.textContent = Math.floor(current);

    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, 16);
}

// ==================== BARRAS DE PROGRESO ====================
function initProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgressBar(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  progressBars.forEach((bar) => observer.observe(bar));
}

function animateProgressBar(element) {
  const progress = element.getAttribute("data-progress");

  setTimeout(() => {
    element.style.width = progress + "%";
    element.style.opacity = "1";

    // Efecto de brillo
    setTimeout(() => {
      element.style.boxShadow = `0 0 20px rgba(59, 130, 246, 0.5)`;
    }, 500);
  }, 200);
}

// ==================== MENÚ MÓVIL ====================
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", toggleMobileMenu);

  // Cerrar menú al hacer click fuera
  document.addEventListener("click", (e) => {
    if (isMenuOpen && !toggle.contains(e.target) && !menu.contains(e.target)) {
      toggleMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  const nav = document.querySelector(".nav-glass");

  isMenuOpen = !isMenuOpen;

  toggle.classList.toggle("active");
  menu.classList.toggle("active");
  nav.classList.toggle("menu-open");

  // Aplicar estilos directamente para asegurar que funcione
  if (isMenuOpen) {
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.position = "absolute";
    menu.style.top = "100%";
    menu.style.left = "0";
    menu.style.right = "0";
    menu.style.backgroundColor = "var(--glass-bg)";
    menu.style.backdropFilter = "blur(20px)";
    menu.style.padding = "16px";
    menu.style.borderRadius = "0 0 20px 20px";
    menu.style.boxShadow = "var(--shadow-glass)";
    menu.style.zIndex = "999";
    menu.style.opacity = "1";
    menu.style.visibility = "visible";
    menu.style.transform = "translateY(0)";
  } else {
    // Usar setTimeout para permitir la animación antes de ocultar
    setTimeout(() => {
      if (!isMenuOpen) {
        menu.style.display = "";
      }
    }, 300);
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
    menu.style.transform = "translateY(-20px)";
  }

  // Prevenir scroll del body cuando el menú está abierto
  document.body.style.overflow = isMenuOpen ? "hidden" : "";
}

// ==================== EFECTOS DE HOVER ====================
function initHoverEffects() {
  // Efecto de inclinación en las tarjetas
  const cards = document.querySelectorAll(".glass-card, .course-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Efecto de ondas en botones
  const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");

  buttons.forEach((button) => {
    button.addEventListener("click", createRipple);
  });
}

function createRipple(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;

  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// ==================== ANIMACIÓN DE ESCRITURA ====================
function initTypingAnimation() {
  const subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle) return;

  const text = subtitle.textContent;
  subtitle.textContent = "";

  let i = 0;
  const timer = setInterval(() => {
    subtitle.textContent += text.charAt(i);
    i++;

    if (i > text.length) {
      clearInterval(timer);
      subtitle.classList.add("typing-complete");
    }
  }, 100);
}

// ==================== UTILIDADES ====================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==================== RESPONSIVE HANDLERS ====================
window.addEventListener(
  "resize",
  debounce(() => {
    // Reinicializar partículas en resize
    particles = [];
    initParticles();

    // Cerrar menú móvil si está abierto
    if (isMenuOpen && window.innerWidth > 768) {
      toggleMobileMenu();
    }
  }, 250)
);

// ==================== CSS ANIMATIONS (Agregado dinámicamente) ====================
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .typing-complete::after {
        content: '|';
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .cursor-hover {
        transform: scale(1.5);
        background: rgba(59, 130, 246, 0.8) !important;
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column !important;
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        background-color: #1e1b4b !important; /* Cambiado de var(--glass-bg) a un color sólido */
        backdrop-filter: blur(20px) !important;
        padding: 16px !important;
        border-radius: 0 0 20px 20px !important;
        box-shadow: var(--shadow-glass) !important;
        z-index: 999 !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
        transition: all 0.3s ease !important;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-menu.active li {
        margin: 10px 0 !important;
        width: 100% !important;
    }
    
    .nav-menu.active .nav-link {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
    }
    
    .nav-glass.menu-open {
        border-radius: 20px 20px 0 0 !important;
    }
`;
document.head.appendChild(style);

// ==================== EXPORTAR FUNCIONES PARA USO EXTERNO ====================
window.CVApp = {
  scrollToSection,
  toggleMobileMenu,
  createRipple,
};

console.log("🚀 CV Futurista cargado correctamente!");
