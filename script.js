/* =========================================================
   Fathya Fathimah Azzahra — Portfolio
   ========================================================= */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. SETTINGS: edit this block
     --------------------------------------------------------- */
  const CONFIG = {
    // Link yang masih kosong ("") otomatis menyembunyikan tombolnya,
    // jadi tidak ada link mati di halaman.
    links: {
      github: "", // isi: "https://github.com/username-kamu"
      pubSinkron: "", // isi: link DOI / halaman artikel Jurnal Sinkron
      pubProcessor: "", // isi: link DOI / halaman artikel Jurnal Processor
      book: "", // isi: link buku (penerbit / toko)
    },

    // Email tidak ditulis utuh di HTML dan tidak dipasang sebagai link mailto.
    // Alamat baru disusun di browser saat popup dibuka (ditulis terbalik di sini).
    emailReversed: "moc.liamg@arzzahtafayhtaf",

    // Isi email yang sudah terisi otomatis saat tombol "Write an email" ditekan.
    mail: {
      email: {
        subject: "Hello from your portfolio",
        body: "Hello Fathya,\n\n\n\nBest regards,\n[Your name]",
      },
      cv: {
        subject: "CV request - Portfolio",
        body:
          "Hello Fathya,\n\nI visited your portfolio and would like to request your latest CV.\n\nThank you,\n[Your name]",
      },
    },
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const getEmail = () => CONFIG.emailReversed.split("").reverse().join("");

  /* ---------------------------------------------------------
     2. Links from CONFIG (hidden while empty)
     --------------------------------------------------------- */
  function applyLinks(scope = document) {
    $$("[data-link]", scope).forEach((el) => {
      const url = CONFIG.links[el.dataset.link];
      if (url) {
        el.href = url;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }
  applyLinks();

  // Keep the small "Connect" tiles balanced if one of them is hidden
  const smallTiles = $$(".connect-grid .tile:not(.wide):not([hidden])");
  if (smallTiles.length % 2 === 1) {
    smallTiles[smallTiles.length - 1].classList.add("span-all");
  }

  /* ---------------------------------------------------------
     3. Navbar: shadow on scroll, mobile menu, active link
     --------------------------------------------------------- */
  const navbar = $(".navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const navToggle = $(".nav-toggle");
  const navLinks = $("#nav-links");
  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $("i", navToggle).className = open ? "ph ph-x" : "ph ph-list";
  };
  navToggle.addEventListener("click", () =>
    setMenu(!navLinks.classList.contains("open")),
  );
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-right")) setMenu(false);
  });

  const navAnchors = $$('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`),
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  navAnchors.forEach((a) => {
    const target = $(a.getAttribute("href"));
    if (target) sectionObserver.observe(target);
  });
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY < 200) navAnchors.forEach((a) => a.classList.remove("active"));
    },
    { passive: true },
  );

  /* ---------------------------------------------------------
     4. Scroll reveal (staggered per batch)
     --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty("--d", `${n * 90}ms`);
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
        n += 1;
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     5. Experience accordion
     --------------------------------------------------------- */
  $$(".exp-head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".exp-item");
      const open = !item.classList.contains("open");
      item.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------------------------------------------------------
     6. Modal (projects, HKI, certificates, contact)
     --------------------------------------------------------- */
  const modal = $("#modal");
  const panel = $(".modal-panel", modal);
  const modalBody = $("#modal-body");
  let lastFocus = null;

  function openModal(templateId) {
    const tpl = document.getElementById(templateId);
    if (!tpl) return;

    if (!modal.classList.contains("open")) lastFocus = document.activeElement;

    modalBody.replaceChildren(tpl.content.cloneNode(true));
    modal.classList.toggle("modal-wide", tpl.dataset.size === "wide");
    applyLinks(modalBody);
    $$("[data-email]", modalBody).forEach((el) => {
      el.textContent = getEmail();
    });

    const title = $(".modal-title", modalBody);
    if (title) {
      title.id = "modal-title";
      panel.setAttribute("aria-labelledby", "modal-title");
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    panel.scrollTop = 0;
    window.setTimeout(() => panel.focus({ preventScroll: true }), 40);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // keep Tab focus inside the dialog
  panel.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = $$("a[href], button:not([disabled])", panel).filter(
      (el) => el.offsetParent !== null,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------------------------------------------------------
     7. Contact actions (email is only built when clicked)
     --------------------------------------------------------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  function handleAction(btn) {
    const address = getEmail();
    if (btn.dataset.action === "mail") {
      const tpl = CONFIG.mail[btn.dataset.mode] || CONFIG.mail.email;
      window.location.href =
        `mailto:${address}` +
        `?subject=${encodeURIComponent(tpl.subject)}` +
        `&body=${encodeURIComponent(tpl.body)}`;
    }
    if (btn.dataset.action === "copy") {
      copyText(address).then((ok) => {
        const label = $("[data-copy-label]", btn);
        const icon = $("i", btn);
        if (!label) return;
        label.textContent = ok ? "Copied!" : "Select and copy manually";
        if (icon && ok) icon.className = "ph ph-check";
        window.setTimeout(() => {
          label.textContent = "Copy address";
          if (icon) icon.className = "ph ph-copy";
        }, 2000);
      });
    }
  }

  /* ---------------------------------------------------------
     8. Lightbox for certificate images
     --------------------------------------------------------- */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = '<img alt="" />';
  document.body.appendChild(lightbox);
  const lightboxImg = $("img", lightbox);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  lightbox.addEventListener("click", closeLightbox);

  /* ---------------------------------------------------------
     9. Global event wiring
     --------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]") && modal.contains(e.target)) {
      closeModal();
      return;
    }

    const contactTrigger = e.target.closest("[data-open-contact]");
    if (contactTrigger) {
      e.preventDefault();
      openModal(
        contactTrigger.dataset.openContact === "cv"
          ? "tpl-contact-cv"
          : "tpl-contact-email",
      );
      return;
    }

    const modalTrigger = e.target.closest("[data-modal]");
    if (modalTrigger) {
      e.preventDefault();
      openModal(modalTrigger.dataset.modal);
      return;
    }

    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      handleAction(actionBtn);
      return;
    }

    const certImg = e.target.closest(".cert-thumb img");
    if (certImg) openLightbox(certImg.currentSrc || certImg.src, certImg.alt);
  });

  // cards use role="button", so Enter / Space should open them too
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox.classList.contains("open")) closeLightbox();
      else if (modal.classList.contains("open")) closeModal();
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-modal][role='button']")) {
      e.preventDefault();
      openModal(e.target.dataset.modal);
    }
  });
})();
