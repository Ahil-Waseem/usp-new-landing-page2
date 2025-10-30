// mobile menu toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

// all nav links inside mobile menu for auto-close on click
const mobileLinks = document.querySelectorAll(".mobile-link");

// open
hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.add("open");
  hamburgerBtn.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
});

// close
function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
}

closeMenuBtn.addEventListener("click", closeMobileMenu);

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// OPTIONAL: add shadow to header on scroll for subtle depth
const headerEl = document.getElementById("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 8) {
    headerEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
  } else {
    headerEl.style.boxShadow = "0 1px 0 rgba(0,0,0,0.05)";
  }
});

// COUNTER NUMBERS SCRIPT START
// -------- IMPACT COUNTERS --------

// helper: format large numbers (e.g. 1000000 -> "1M")
function formatNumber(n, hasPercent) {
  if (n >= 1000000) {
    // turn 1000000 -> "1M"
    const millions = n / 1000000;
    // keep no decimals for clean look like "1M", "9M"
    // return millions.toFixed(millions % 1 === 0 ? 0 : 1) + "M";
      return parseFloat(millions.toFixed(1)) + "M";
  }

  // add commas for readability e.g. 4900 -> "4,900"
  const withCommas = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (hasPercent) return withCommas; // % symbol is already in DOM as suffix
  return withCommas;
}

// animate one counter
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"), 10);
  const isPercent = el.textContent.trim().endsWith("%"); // check initial content design
  const duration = 1500; // ms
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const currentVal = Math.floor(progress * target);

    el.firstChild.nodeValue = formatNumber(
      progress === 1 ? target : currentVal,
      isPercent
    );

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// observe when impact-card enters viewport
const impactSection = document.querySelector(".impact-card");
let countersStarted = false;

if (impactSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;

          document
            .querySelectorAll(".impact-value")
            .forEach((counterEl) => animateCounter(counterEl));
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(impactSection);
}

// WHAT WE DO SECTION
const items = document.querySelectorAll(".whatwedo-accordion-item");
const displayImage = document.querySelector(".whatwedo-accordion-image");

// Function to close all accordions
function closeAllAccordions() {
  items.forEach((el) => {
    el.classList.remove("active");
    el.querySelector(".icon").textContent = "+";
  });
}

items.forEach((item) => {
  item.addEventListener("click", (event) => {
    const isActive = item.classList.contains("active");

    // If clicked on an already open item → close it
    if (isActive) {
      item.classList.remove("active");
      item.querySelector(".icon").textContent = "+";
      return;
    }

    // Otherwise close all and open clicked one
    closeAllAccordions();
    item.classList.add("active");
    item.querySelector(".icon").textContent = "−";

    // Change image
    const newImage = item.getAttribute("data-image");
    displayImage.classList.remove("active");
    setTimeout(() => {
      displayImage.src = `assets/images/${newImage}`;
      displayImage.classList.add("active");
    }, 200);

    event.stopPropagation(); // prevent outside click trigger
  });

  // Double-click to close too
  item.addEventListener("dblclick", (event) => {
    item.classList.remove("active");
    item.querySelector(".icon").textContent = "+";
    event.stopPropagation();
  });
});

// Close accordion if clicked outside
document.addEventListener("click", (event) => {
  const accordionArea = document.querySelector(".whatwedo-accordion-container");
  if (!accordionArea.contains(event.target)) {
    closeAllAccordions();
  }
});

// WHAT WE DO SECTION SCRIPT START
// slider logic for all pillars
document.querySelectorAll(".pillar-slider").forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const dots = slider.querySelectorAll(".dot");

  let currentIndex = 0;

  function goToSlide(index) {
    currentIndex = index;
    const offsetPercent = currentIndex * -100;
    track.style.transform = `translateX(${offsetPercent}%)`;

    dots.forEach((d, i) => {
      d.classList.toggle("active", i === currentIndex);
    });
  }

  // click on dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
    });
  });

  // optional: swipe support for mobile
  let startX = 0;
  let isDown = false;

  track.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const diff = e.touches[0].clientX - startX;
    // no drag transform preview here (keeps code simple/stable)
    // could add if you want smooth drag preview
  });

  track.addEventListener("touchend", (e) => {
    if (!isDown) return;
    isDown = false;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff < -40 && currentIndex < dots.length - 1) {
      // swipe left -> next
      goToSlide(currentIndex + 1);
    } else if (diff > 40 && currentIndex > 0) {
      // swipe right -> prev
      goToSlide(currentIndex - 1);
    }
  });

  // init first slide
  goToSlide(0);
});
// WHAT WE DO SECTION SCRIPT END

// <!-- OUR ROCESS SECTION SCRIPT START -->
const phaseButtons = document.querySelectorAll(".process-phase");

const step1Title = document.getElementById("step1-title");
const step1Desc = document.getElementById("step1-desc");
const step2Title = document.getElementById("step2-title");
const step2Desc = document.getElementById("step2-desc");
const step3Title = document.getElementById("step3-title");
const step3Desc = document.getElementById("step3-desc");

phaseButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 1. Visually set active state on left cards
    phaseButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 2. Pull data-* from clicked button
    const s1t = btn.getAttribute("data-step1-title");
    const s1d = btn.getAttribute("data-step1-desc");
    const s2t = btn.getAttribute("data-step2-title");
    const s2d = btn.getAttribute("data-step2-desc");
    const s3t = btn.getAttribute("data-step3-title");
    const s3d = btn.getAttribute("data-step3-desc");

    // 3. Update right column
    step1Title.textContent = s1t;
    step1Desc.textContent = s1d;
    step2Title.textContent = s2t;
    step2Desc.textContent = s2d;
    step3Title.textContent = s3t;
    step3Desc.textContent = s3d;
  });
});
// <!-- OUR ROCESS SECTION SCRIPT END -->

// SETUP CHECK-LIST SECTION script start

// ===================== DESKTOP SLIDER LOGIC ===================== //
const track = document.getElementById("checklistTrack");
const cards = track
  ? Array.from(track.querySelectorAll(".checklist-card"))
  : [];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function updateSlider() {
  if (!track) return;

  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  cards.forEach((card, i) => {
    if (i === currentIndex) {
      card.classList.add("active");
      card.classList.remove("ghost");
      card.style.pointerEvents = "auto";
    } else {
      card.classList.remove("active");
      card.classList.add("ghost");
      card.style.pointerEvents = "none";
    }
  });

  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex += 1;
      updateSlider();
    }
  });

  updateSlider();
}

// ===================== MOBILE OVERLAY LOGIC ===================== //
const overlay = document.getElementById("mobileDetailOverlay");
const panel = document.getElementById("mobileDetailPanel");
const closeBtn = document.getElementById("mobileCloseBtn");
const contentBox = document.getElementById("mobileDetailContent");

// the data for mobile detail views
const mobileDetailsData = {
  initial: {
    icon: "📄➕",
    title: "Initial Requirements",
    sections: [
      {
        heading: "Brand Understanding",
        body: [
          "Review brand guidelines, references, and preferred content formats to align with brand identity.",
        ],
      },
      {
        heading: "Login Management",
        body: [
          "Organize and secure all login credentials for streamlined access.",
        ],
      },
      {
        heading: "Profile Optimization",
        body: ["Optimize key elements of social media profiles:"],
        bullets: [
          "<strong>Bio:</strong> Ensure consistency & relevance to the brand.",
          "<strong>Captions:</strong> Establish tone and style for brand voice.",
          "<strong>Highlights:</strong> Curate highlights that showcase key brand content.",
        ],
      },
    ],
  },

  final: {
    icon: "📘📊",
    title: "Final Requirements",
    sections: [
      {
        heading: "Access & Assets",
        body: [
          "Share all social handles, ad accounts, and brand folders.",
          "Provide past campaign creatives and performance reports.",
        ],
      },
      {
        heading: "Content Inputs",
        body: [
          "Core USPs, product shots, testimonial material.",
          "Founder / team presence for face-of-brand content.",
        ],
      },
      {
        heading: "Expectations & Goals",
        body: [
          "Growth targets (reach, followers, leads, etc.).",
          "Priority platforms + timelines for launch.",
        ],
      },
    ],
  },
};

// build the HTML for the overlay content
function buildMobileDetailHTML(data) {
  let html = `
    <div class="detail-header-icon">${data.icon}</div>
    <h3 class="detail-title">${data.title}</h3>
  `;

  data.sections.forEach((section) => {
    html += `
      <div class="mobile-detail-block">
        <h4>
          <span class="green-check">✔</span>
          <span>${section.heading}</span>
        </h4>
    `;

    if (section.body && section.body.length) {
      section.body.forEach((p) => {
        html += `<p>${p}</p>`;
      });
    }

    if (section.bullets && section.bullets.length) {
      html += `<ul>`;
      section.bullets.forEach((b) => {
        html += `
          <li>
            <span class="green-check">✔</span>
            <span>${b}</span>
          </li>`;
      });
      html += `</ul>`;
    }

    html += `</div>`;
  });

  return html;
}

function openMobileDetail(which) {
  const data = mobileDetailsData[which];
  if (!data) return;

  // inject content
  contentBox.innerHTML = buildMobileDetailHTML(data);

  // show overlay
  overlay.classList.add("active");

  // focus for a11y
  panel.focus();
}

function closeMobileDetail() {
  overlay.classList.remove("active");
}

// click handlers for each mobile card arrow
document.querySelectorAll(".mobile-card-arrow").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const which = btn.getAttribute("data-detail"); // "initial" or "final"
    openMobileDetail(which);
  });
});

// close button / click outside
if (closeBtn) {
  closeBtn.addEventListener("click", closeMobileDetail);
}
if (overlay) {
  overlay.addEventListener("click", (e) => {
    // close if clicking the dimmed area, not the panel
    if (e.target === overlay) {
      closeMobileDetail();
    }
  });
}

// SETUP CHECK-LIST SECTION script END

// TESTIMONIAL SECTION SCRIPT START

(function () {
  const testiTrack = document.getElementById("testimonialsTrack");
  if (!testiTrack) return;

  const testiPrevBtn = document.getElementById("testiPrev");
  const testiNextBtn = document.getElementById("testiNext");
  const testiCards = testiTrack.querySelectorAll(".testimonial-card");

  let testiIndex = 0;

  function getVisibleCount() {
    // tweak breakpoint however you want
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function getMaxIndex() {
    return testiCards.length - getVisibleCount();
  }

  function updateTestimonialSlider() {
    const gapPx = parseFloat(getComputedStyle(testiTrack).gap) || 0;
    const cardWidth = testiCards[0].getBoundingClientRect().width;
    const offset = (cardWidth + gapPx) * testiIndex * -1;
    testiTrack.style.transform = `translateX(${offset}px)`;

    if (testiPrevBtn) {
      testiPrevBtn.disabled = testiIndex === 0;
    }
    if (testiNextBtn) {
      testiNextBtn.disabled = testiIndex === getMaxIndex();
    }
  }

  if (testiNextBtn) {
    testiNextBtn.addEventListener("click", () => {
      if (testiIndex < getMaxIndex()) {
        testiIndex++;
        updateTestimonialSlider();
      }
    });
  }

  if (testiPrevBtn) {
    testiPrevBtn.addEventListener("click", () => {
      if (testiIndex > 0) {
        testiIndex--;
        updateTestimonialSlider();
      }
    });
  }

  window.addEventListener("resize", () => {
    // clamp index if viewport change reduced max slides
    if (testiIndex > getMaxIndex()) {
      testiIndex = getMaxIndex();
    }
    updateTestimonialSlider();
  });

  updateTestimonialSlider();
})();
// TESTIMONIAL SECTION SCRIPT END

// FAQ SCRIPT START

// FAQ accordion logic with outside click close
(function () {
  const faqItems = document.querySelectorAll(".faq-item");

  function closeAll() {
    faqItems.forEach((item) => {
      item.classList.remove("active");
    });
  }

  // click question to toggle
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");

    btn.addEventListener("click", (e) => {
      const isActive = item.classList.contains("active");

      // close others first
      closeAll();

      // then toggle current if it was not already open
      if (!isActive) {
        item.classList.add("active");
      }

      // stop this click from triggering the "outside" listener below
      e.stopPropagation();
    });
  });

  // click anywhere outside -> close all
  document.addEventListener("click", (e) => {
    // if click is NOT inside any faq-item, close
    const clickedInsideFAQ = e.target.closest(".faq-item");
    if (!clickedInsideFAQ) {
      closeAll();
    }
  });
})();

// FAQ SCRIPT END

// OUTCOMES SCRIPT START

(function () {
  const viewport = document.getElementById("outcomesViewport");
  const track = document.getElementById("outcomesTrack");
  const prevBtn = document.querySelector(".outcomes-prev");
  const nextBtn = document.querySelector(".outcomes-next");
  const progressBar = document.getElementById("outcomesProgressBar");

  // how far to scroll per click = width of first card + gap
  function getStep() {
    const firstCard = track.querySelector(".outcome-card");
    if (!firstCard) return 0;
    const cardStyles = window.getComputedStyle(firstCard);
    const cardWidth = firstCard.getBoundingClientRect().width;
    // gap between cards is 1rem. let's read from parent
    const gap = parseFloat(
      window.getComputedStyle(track).columnGap ||
        window.getComputedStyle(track).gap ||
        16
    );
    return cardWidth + gap;
  }

  function updateButtons() {
    // disable prev if scrolled to start
    prevBtn.disabled = viewport.scrollLeft <= 0 + 2;

    // disable next if scrolled to (max - fudge)
    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
    nextBtn.disabled = viewport.scrollLeft >= maxScrollLeft - 2;
  }

  function updateProgress() {
    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
    let ratio = 0;
    if (maxScrollLeft > 0) {
      ratio = viewport.scrollLeft / maxScrollLeft;
    }
    progressBar.style.width = (ratio * 100).toFixed(2) + "%";
  }

  function scrollByStep(dir) {
    const step = getStep();
    viewport.scrollBy({
      left: dir * step,
      behavior: "smooth",
    });
  }

  // click arrows
  prevBtn.addEventListener("click", () => scrollByStep(-1));
  nextBtn.addEventListener("click", () => scrollByStep(1));

  // sync state on scroll
  viewport.addEventListener("scroll", () => {
    updateButtons();
    updateProgress();
  });

  // sync state on load / resize (so buttons + bar look correct initially)
  function initState() {
    updateButtons();
    updateProgress();
  }
  window.addEventListener("resize", initState);
  initState();
})();

// OUTCOMES SCRIPT END


// ===============================
// Footer Accordion Toggle button animation
// ===============================
function toggleAccordion(header) {
  const item = header.parentElement;
  const allItems = document.querySelectorAll(".accordion-item");

  // Close other accordions
  allItems.forEach((otherItem) => {
    if (otherItem !== item && otherItem.classList.contains("active")) {
      otherItem.classList.remove("active");
    }
  });

  // Toggle current accordion
  item.classList.toggle("active");
}
// CONTACT FORM SUBMIT + REDIRECT
(function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnTextEl = submitBtn.querySelector(".btn-text");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // stop normal browser navigation

    // 1. Lock the button UI
    submitBtn.disabled = true;
    submitBtn.classList.add("loading"); // optional style hook
    btnTextEl.textContent = "Submitting...";

    // 2. Prepare data to send (same fields you already have)
    const formData = new FormData(form);

    try {
      // 3. Send to your Google Apps Script
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        mode: "no-cors", // Apps Script usually needs this so fetch doesn't block
      });

      // 4. OPTIONAL: clear the form now so if user comes back, it's empty
      form.reset();

      // 5. Force redirect to thankyou page
      window.location.href = "thankyou.html";
    } catch (err) {
      console.error("Form submit failed:", err);

      // fallback: unlock button so user can retry
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      btnTextEl.textContent = "Book a Call";

      alert("Something went wrong. Please try again.");
    }
  });
})();


// Pop UP Form

// =======================
// LEAD POPUP LOGIC
// =======================
(function () {
  const overlay = document.getElementById("leadModalOverlay");
  const closeBtn = document.getElementById("leadModalClose");

  if (!overlay) return;

  // open the modal
  function openLeadModal() {
    overlay.classList.add("active");
    document.body.classList.add("modal-open");
  }

  // close the modal
  function closeLeadModal() {
    overlay.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  // auto-open after 3 seconds on page load
  setTimeout(() => {
    openLeadModal();
  }, 3000);

  // close on X click
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLeadModal);
  }

  // close if user clicks outside modal box
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeLeadModal();
    }
  });
})();
// POPUP CONTACT FORM SUBMIT + REDIRECT
(function () {
  const form = document.getElementById("popupContactForm");
  const submitBtn = document.getElementById("popupSubmitBtn");
  if (!form || !submitBtn) return;

  const btnTextEl = submitBtn.querySelector(".btn-text");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // lock UI
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    btnTextEl.textContent = "Submitting...";

    const formData = new FormData(form);

    try {
      await fetch(form.action, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      // reset the form so if user comes back it's clean
      form.reset();

      // redirect
      window.location.href = "thankyou.html";
    } catch (err) {
      console.error("Popup form submit failed:", err);

      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      btnTextEl.textContent = "Book a Call";

      alert("Something went wrong. Please try again.");
    }
  });
})();

// newslatter form

// =======================
// NEWSLETTER FORMS (desktop + mobile)
// =======================
(function () {
  // helper to attach behavior to ANY newsletter form
  function setupNewsletter(formId, inputId, buttonId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(inputId);
    const btn = document.getElementById(buttonId);

    if (!form || !emailInput || !btn) return;

    const btnTextSpan = btn.querySelector(".btn-text");

    // 1. When user types, turn button red if there's any value
    emailInput.addEventListener("input", () => {
      if (emailInput.value.trim().length > 0) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // 2. On submit: block default, show loading, send to Apps Script, redirect
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // basic front-end validation: don't submit empty or invalid
      // (browser `required` + type=email will also help)
      if (emailInput.value.trim().length === 0) return;

      // lock UI
      btn.disabled = true;
      btn.classList.add("loading");
      if (btnTextSpan) btnTextSpan.textContent = "Subscribing...";

      const formData = new FormData(form);

      try {
        await fetch(form.action, {
          method: "POST",
          body: formData,
          mode: "no-cors", // Apps Script usually requires this
        });

        // clean the form so Back button doesn't keep value
        form.reset();
        btn.classList.remove("active");

        // redirect to thank you page
        window.location.href = "thankyou.html";
      } catch (err) {
        console.error("Newsletter submit failed:", err);

        // unlock so they can retry
        btn.disabled = false;
        btn.classList.remove("loading");
        if (btnTextSpan) btnTextSpan.textContent = "Subscribe";

        alert("Something went wrong. Please try again.");
      }
    });
  }

  // attach behavior to both desktop + mobile newsletter forms
  setupNewsletter(
    "newsletter-form",           // desktop form id
    "newsletter-email-desktop",  // desktop input id
    "newsletter-btn-desktop"     // desktop button id
  );

  setupNewsletter(
    "newsletter-form-mobile",    // mobile form id
    "newsletter-email-mobile",   // mobile input id
    "newsletter-btn-mobile"      // mobile button id
  );
})();

// LOGO DESIGNED SCRIPT

        
const logoConfig = {
    logo0: {
        id: 'logo0',
        path: '/assets/images/nr-black.png',
        alt: 'Supr Daily Large Logo'
    },
    logo1: {
        id: 'logo1',
        path: '/assets/images/Kred_logo-removebg-preview.png',
        alt: 'Kredbaharat'
    },
    logo2: {
        id: 'logo2',
        path: '/assets/images/Ojaldevelopers.webp',
        alt: 'Ojaldevelopers'
    },
    logo3: {
        id: 'logo3',
        path: '/assets/images/aabo.png',
        alt: 'Aabo'
    },
    logo4: {
        id: 'logo4',
        path: '/assets/images/MNS BLACK.png',
        alt: 'Mynirvana Stay'
    },
    logo5: {
        id: 'logo5',
        path: '/assets/images/Sundeck.png',
        alt: 'Sundeck'
    },
    logo6: {
        id: 'logo6',
        path: '/assets/images/rooted2.png',
        alt: 'Rooted'
    },
    logo7: {
        id: 'logo7',
        path: '/assets/images/today-new-logo.png',
        alt: 'Today'
    }
};

// Function to update a logo
function updateLogo(logoId, newLogoPath, newAltText = null) {
    const logoContainer = document.getElementById(logoId);
    if (!logoContainer) {
        console.error(`Logo container with ID ${logoId} not found`);
        return false;
    }
    
    const logoImg = logoContainer.querySelector('img');
    if (!logoImg) {
        console.error(`No image found in logo container ${logoId}`);
        return false;
    }
    
    // Update the logo source
    logoImg.src = newLogoPath;
    
    // Update alt text if provided
    if (newAltText) {
        logoImg.alt = newAltText;
    }
    
    // Update the configuration
    if (logoConfig[logoId]) {
        logoConfig[logoId].path = newLogoPath;
        if (newAltText) {
            logoConfig[logoId].alt = newAltText;
        }
    }
    
    console.log(`Logo ${logoId} updated successfully to ${newLogoPath}`);
    return true;
}

// Initialize all logos on page load
document.addEventListener('DOMContentLoaded', () => {
    // Apply all logos from configuration
    Object.values(logoConfig).forEach(logo => {
        updateLogo(logo.id, logo.path, logo.alt);
    });
});