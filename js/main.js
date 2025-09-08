// Optimized JavaScript for Classic Collisions website
// Performance-focused implementation with debouncing and efficient DOM manipulation

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
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
};

// DOM ready function
const domReady = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};

// Header scroll effect
const initHeaderScroll = () => {
  const header = document.getElementById("header");
  if (!header) return;

  const handleScroll = throttle(() => {
    const scrolled = window.scrollY > 100;
    header.classList.toggle("scrolled", scrolled);
  }, 16); // ~60fps

  window.addEventListener("scroll", handleScroll, { passive: true });
};

// Mobile menu functionality
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) return;

  // Toggle mobile menu
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isActive = navMenu.classList.contains("active");

    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? "" : "hidden";
  });

  // Handle dropdown toggles in mobile
  const dropdownLinks = document.querySelectorAll(".nav-menu .dropdown > a");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = link.parentElement;
        const isActive = dropdown.classList.contains("active");

        // Close other dropdowns
        document
          .querySelectorAll(".nav-menu .dropdown.active")
          .forEach((item) => {
            if (item !== dropdown) item.classList.remove("active");
          });

        dropdown.classList.toggle("active");
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Close menu on window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    }, 250)
  );
};

// Smooth scrolling for anchor links
const initSmoothScroll = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight =
          document.getElementById("header")?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navMenu = document.querySelector(".nav-menu");
        const menuToggle = document.querySelector(".mobile-menu-toggle");
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          menuToggle?.classList.remove("active");
          document.body.style.overflow = "";
        }
      }
    });
  });
};

// Team slider functionality
const initTeamSlider = () => {
  const sliderTrack = document.querySelector(".team-slider-track");
  const teamMembers = document.querySelectorAll(".team-member");
  const nextBtn = document.querySelector(".team-nav.next");
  const prevBtn = document.querySelector(".team-nav.prev");

  if (!sliderTrack || !teamMembers.length || !nextBtn || !prevBtn) return;

  let currentIndex = 0;

  const getCardWidth = () => teamMembers[0].offsetWidth + 20; // including margin
  const getVisibleCards = () => {
    const containerWidth = document.querySelector(
      ".team-slider-container"
    ).offsetWidth;
    return Math.floor(containerWidth / getCardWidth());
  };
  const getMaxIndex = () => Math.max(0, teamMembers.length - getVisibleCards());

  const updateSlider = () => {
    const translateX = currentIndex * getCardWidth();
    sliderTrack.style.transform = `translateX(-${translateX}px)`;

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  };

  nextBtn.addEventListener("click", () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      currentIndex = Math.min(currentIndex, getMaxIndex());
      updateSlider();
    }, 250)
  );

  // Initial setup
  updateSlider();
};

// Service modal functionality
const initServiceModals = () => {
  const serviceButtons = document.querySelectorAll(".service-learn-more");

  const serviceData = {
    "Collision Repair": {
      description: "Our comprehensive collision repair service includes:",
      features: [
        "Free initial damage assessment",
        "Insurance claim assistance",
        "State-of-the-art repair equipment",
        "Factory-certified technicians",
        "Lifetime warranty on repairs",
        "Free rental car assistance",
      ],
    },
    "Paint Services": {
      description: "Expert paint services featuring:",
      features: [
        "Computerized color matching",
        "Premium quality paints",
        "Clear coat protection",
        "Custom paint jobs",
        "Spot repair and blending",
        "Environmental-friendly products",
      ],
    },
    "HVAC Services": {
      description: "Complete HVAC repairs including:",
      features: [
        "Diagnostics and troubleshooting",
        "Component replacement",
        "System cleaning and maintenance",
        "Refrigerant recharge",
        "Climate control repair",
        "Energy efficiency optimization",
      ],
    },
    "ADAS Calibration": {
      description: "Advanced Driver-Assistance Systems calibration:",
      features: [
        "Camera calibration",
        "Radar sensor alignment",
        "Lane departure warning setup",
        "Collision avoidance system tuning",
        "Parking sensor calibration",
        "Safety compliance verification",
      ],
    },
  };

  serviceButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const serviceCard = button.closest(".service-card");
      const serviceName = serviceCard.querySelector("h3").textContent.trim();
      const data = serviceData[serviceName];

      if (data) {
        createModal(serviceName, data);
      }
    });
  });

  const createModal = (title, data) => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal" aria-label="Close modal">&times;</button>
        <h3>${title}</h3>
        <p>${data.description}</p>
        <ul>
          ${data.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <a href="estimate.html" class="btn btn-primary">Get Estimate</a>
      </div>
    `;

    document.body.appendChild(modal);

    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add("active");
    });

    // Close handlers
    const closeBtn = modal.querySelector(".close-modal");
    const closeModal = () => {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Escape key handler
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  };
};

// Initialize all functionality
domReady(() => {
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initTeamSlider();
  initServiceModals();

  // Initialize AOS if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 600,
      once: true,
      offset: 100,
    });
  }
});
