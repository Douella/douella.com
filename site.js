const CONTACT = {
  phone: "+972559100445",
  phoneDisplay: "0559100445",
  whatsapp: "972559100445",
  instagram: "https://www.instagram.com/ella_gantz_doula",
  instagramHandle: "@ella_gantz_doula",
  facebook: "https://www.facebook.com/ella.gantz/",
  facebookLabel: "אלה גנץ · דולה והכנה ללידה"
};

const DEFAULT_WA_MESSAGE = "היי אלה, אשמח לשמוע עוד על הליווי";

function whatsappLink(message) {
  const text = message || DEFAULT_WA_MESSAGE;
  const number = String(CONTACT.whatsapp).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function applyContactDetails() {
  document.querySelectorAll("[data-contact-link]").forEach((link) => {
    const type = link.dataset.contactLink;

    if (type === "whatsapp") {
      link.href = whatsappLink(link.dataset.waMessage);
    }

    if (type === "phone") {
      link.href = `tel:${CONTACT.phone}`;
    }

    if (type === "instagram") {
      link.href = CONTACT.instagram;
    }

    if (type === "facebook") {
      link.href = CONTACT.facebook;
    }
  });

  document.querySelectorAll('[data-contact-text="phone"]').forEach((el) => {
    el.textContent = CONTACT.phoneDisplay;
  });

  document.querySelectorAll('[data-contact-text="instagramHandle"]').forEach((el) => {
    el.textContent = CONTACT.instagramHandle;
  });

  document.querySelectorAll('[data-contact-text="facebookLabel"]').forEach((el) => {
    el.textContent = CONTACT.facebookLabel;
  });
}

function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const toggle = document.getElementById("menu-toggle");
  if (!menu || !toggle) return;

  const setExpanded = (value) => {
    toggle.setAttribute("aria-expanded", String(value));
  };

  const openMenu = () => {
    if (menu.open) return;
    if (typeof menu.showModal === "function") {
      menu.showModal();
    } else {
      menu.setAttribute("open", "");
    }
    document.body.classList.add("menu-open");
    setExpanded(true);
  };

  const closeMenu = () => {
    if (menu.open && typeof menu.close === "function") {
      menu.close();
    } else {
      menu.removeAttribute("open");
    }
    document.body.classList.remove("menu-open");
    setExpanded(false);
  };

  toggle.addEventListener("click", openMenu);

  menu.querySelectorAll("[data-close-menu]").forEach((el) => {
    el.addEventListener("click", closeMenu);
  });

  menu.addEventListener("click", (event) => {
    if (event.target === menu) closeMenu();
  });

  menu.addEventListener("close", () => {
    document.body.classList.remove("menu-open");
    setExpanded(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1020 && menu.open) closeMenu();
  });
}

function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function initActiveNav() {
  const links = Array.from(document.querySelectorAll(".main-nav a"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const linksById = new Map(
    links.map((link) => [link.getAttribute("href").replace("#", ""), link])
  );

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        const activeLink = linksById.get(entry.target.id);
        if (activeLink) activeLink.classList.add("is-active");
      });
    },
    { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initTestimonialLightbox() {
  const dialog = document.getElementById("testimonial-lightbox");
  const image = document.getElementById("lightbox-image");
  const title = document.getElementById("lightbox-title");
  const fullLink = document.getElementById("lightbox-full");
  if (!dialog || !image || !title || !fullLink) return;

  const openButtons = document.querySelectorAll("[data-lightbox-src]");
  if (!openButtons.length) return;

  const closeLightbox = () => {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    document.body.classList.remove("lightbox-open");
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.dataset.lightboxSrc;
      image.src = src;
      image.alt = button.dataset.lightboxAlt || "";
      title.textContent = button.dataset.lightboxTitle || "ההמלצה המקורית";
      fullLink.href = src;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      document.body.classList.add("lightbox-open");
    });
  });

  dialog.querySelectorAll("[data-close-lightbox]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeLightbox();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
  });
}

function initAboutGallery() {
  const gallery = document.querySelector("[data-about-gallery]");
  if (!gallery) return;

  const sync = () => {
    const canScroll = gallery.scrollWidth > gallery.clientWidth + 1;
    gallery.tabIndex = canScroll ? 0 : -1;
    gallery.setAttribute(
      "aria-label",
      canScroll
        ? "תמונות אישיות של אלה. ניתן לגלול עם מקשי החצים."
        : "תמונות אישיות של אלה"
    );
  };

  gallery.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (gallery.scrollWidth <= gallery.clientWidth + 1) return;

    const step = Math.min(gallery.clientWidth * 0.8, 340);
    const delta = event.key === "ArrowLeft" ? -step : step;
    gallery.scrollBy({ left: delta, behavior: "smooth" });
    event.preventDefault();
  });

  window.addEventListener("resize", sync);
  sync();
}

function initTestimonialControls() {
  const track = document.querySelector(".testimonial-track");
  const prev = document.querySelector("[data-testimonial-prev]");
  const next = document.querySelector("[data-testimonial-next]");
  const count = document.querySelector("[data-testimonial-count]");
  if (!track || !prev || !next || !count) return;

  const cards = Array.from(track.querySelectorAll(".testimonial-card"));
  if (!cards.length) return;

  const isRTL = getComputedStyle(track).direction === "rtl";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getStep = () => {
    const card = cards[0];
    if (!card) return 0;
    return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  };

  const update = () => {
    const step = getStep();
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const position = Math.max(0, Math.min(maxScroll, Math.abs(track.scrollLeft)));
    const index = step > 0 ? Math.min(cards.length - 1, Math.round(position / step)) : 0;

    count.textContent = `${index + 1} מתוך ${cards.length}`;
    prev.disabled = index <= 0;
    next.disabled = index >= cards.length - 1;
  };

  const scrollByStep = (direction) => {
    const step = getStep();
    if (!step) return;
    const rtlDirection = isRTL ? -1 : 1;
    track.scrollBy({
      left: direction * step * rtlDirection,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  prev.addEventListener("click", () => scrollByStep(-1));
  next.addEventListener("click", () => scrollByStep(1));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", () => requestAnimationFrame(update));
  update();
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

applyContactDetails();
initHeader();
initMobileMenu();
initTestimonialLightbox();
initAboutGallery();
initTestimonialControls();
initReveal();
initActiveNav();
initYear();
