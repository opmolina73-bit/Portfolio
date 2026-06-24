document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.section, .skill-card, .exp-item');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to observe again
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 2. Parallax Cursor Effect (Visual Panel Shapes)
  const visualSide = document.querySelector('.visual-side');
  const shapeStar = document.querySelector('.shape-star');
  const shapePolygon = document.querySelector('.shape-polygon');
  const shapeBlob = document.querySelector('.shape-blob');
  const decorGreen = document.getElementById('decor-green');

  window.addEventListener('mousemove', (e) => {
    // Get mouse offset from center of window
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Apply translations with different intensities for depth
    if (shapeStar) {
      shapeStar.style.transform = `translate(${dx * -0.03}px, ${dy * -0.03}px) rotate(${15 + dx * 0.02}deg)`;
    }
    if (shapePolygon) {
      shapePolygon.style.transform = `translate(${dx * 0.04}px, ${dy * -0.04}px) rotate(${-10 + dx * -0.01}deg)`;
    }
    if (shapeBlob) {
      shapeBlob.style.transform = `translate(${dx * -0.02}px, ${dy * 0.05}px) rotate(${5 + dy * 0.01}deg)`;
    }
    if (decorGreen) {
      decorGreen.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
    }
  });

  // 3. Hover Triggers: Connect left-side hover triggers to right-side shapes
  const hoverTriggers = document.querySelectorAll('.hover-trigger');
  
  hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
      const color = trigger.getAttribute('data-color');
      highlightShape(color, true);
    });

    trigger.addEventListener('mouseleave', () => {
      const color = trigger.getAttribute('data-color');
      highlightShape(color, false);
    });
  });

  function highlightShape(color, isHighlighted) {
    if (color === 'blue' && shapePolygon) {
      if (isHighlighted) {
        shapePolygon.classList.add('active-shape');
      } else {
        shapePolygon.classList.remove('active-shape');
      }
    } else if (color === 'orange' && shapeStar) {
      if (isHighlighted) {
        shapeStar.classList.add('active-shape');
      } else {
        shapeStar.classList.remove('active-shape');
      }
    } else if (color === 'red' && shapeBlob) {
      if (isHighlighted) {
        shapeBlob.classList.add('active-shape');
      } else {
        shapeBlob.classList.remove('active-shape');
      }
    } else if (color === 'green' && decorGreen) {
      if (isHighlighted) {
        decorGreen.style.opacity = '0.25';
        decorGreen.style.filter = 'blur(50px)';
      } else {
        decorGreen.style.opacity = '0.08';
        decorGreen.style.filter = 'blur(80px)';
      }
    }
  }

  // 4. Contact Form Handling with feedback states
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Visual sending feedback
      formStatus.textContent = "SENDING MESSAGE...";
      formStatus.className = "form-status";
      
      // Simulate API call
      setTimeout(() => {
        formStatus.textContent = `THANK YOU, ${name.toUpperCase()}! YOUR MESSAGE HAS BEEN SENT.`;
        formStatus.className = "form-status success";
        contactForm.reset();
      }, 1200);
    });
  }
});
