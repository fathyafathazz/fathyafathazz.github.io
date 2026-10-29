/* =========================================================
   Fathya Fathazz — Halaman jasa
   ========================================================= */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. PENGATURAN: edit bagian ini
     --------------------------------------------------------- */
  const CONFIG = {
    // Opsional: kalau kamu punya Google Form / formulir pesanan, isi link-nya.
    // Selama kosong, tombol "Minta penawaran" membuka popup di halaman ini.
    formUrl: "",

    // Email tidak ditulis utuh di HTML dan bukan link mailto.
    // Alamat baru disusun saat popup dibuka (ditulis terbalik di sini).
    emailReversed: "moc.liamg@arzzahtafayhtaf",

    // Harga "mulai dari" dalam Rupiah (angka tanpa titik).
    // Kosongkan (0) kalau ingin kartunya menampilkan "Harga sesuai kebutuhan".
    // Catatan: ppt = per slide, admin = per bulan.
    prices: {
      landing: 1500000,
      katalog: 4000000,
      toko: 8000000,
      inventory: 5000000,
      ppt: 15000,
      poster: 50000,
      undangan: 150000,
      admin: 1500000,
    },
  };

  // Daftar pilihan jasa di popup (harus sama dengan data-quote di kartu)
  const SERVICES = [
    "Landing page / company profile",
    "Web katalog produk",
    "Toko online (checkout)",
    "Sistem inventory",
    "Desain PPT",
    "Poster (Canva)",
    "Undangan online & cetak",
    "Admin toko online",
    "Lainnya",
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const getEmail = () => CONFIG.emailReversed.split("").reverse().join("");

  /* ---------------------------------------------------------
     2. Harga (jika diisi)
     --------------------------------------------------------- */
  const rupiah = (n) =>
    "Rp\u00a0" + new Intl.NumberFormat("id-ID").format(n);

  $$("[data-price]").forEach((el) => {
    const value = CONFIG.prices[el.dataset.price];
    if (value) el.textContent = `Mulai dari ${rupiah(value)}${el.dataset.unit || ""}`;
  });

  // Kotak "Pilih jasa": tampilkan harga terendah dari kelompoknya
  $$("[data-price-min]").forEach((el) => {
    const values = el.dataset.priceMin
      .split(" ")
      .map((key) => CONFIG.prices[key])
      .filter(Boolean);
    if (!values.length) return;
    const unit = el.dataset.priceMin === "admin" ? " / bulan" : "";
    el.textContent = `Mulai dari ${rupiah(Math.min(...values))}${unit}`;
  });

  /* ---------------------------------------------------------
     3. Navbar: bayangan saat scroll, menu HP, link aktif
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
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
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
          a.classList.toggle(
            "active",
            a.getAttribute("href") === `#${entry.target.id}`,
          ),
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
      if (window.scrollY < 200)
        navAnchors.forEach((a) => a.classList.remove("active"));
    },
    { passive: true },
  );

  /* ---------------------------------------------------------
     4. Animasi muncul saat scroll
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
     5. FAQ (buka-tutup)
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
     6. Popup
     --------------------------------------------------------- */
  const modal = $("#modal");
  const panel = $(".modal-panel", modal);
  const modalBody = $("#modal-body");
  let lastFocus = null;

  function openModal(templateId, afterRender) {
    const tpl = document.getElementById(templateId);
    if (!tpl) return;
    if (!modal.classList.contains("open")) lastFocus = document.activeElement;

    modalBody.replaceChildren(tpl.content.cloneNode(true));
    $$("[data-email]", modalBody).forEach((el) => {
      el.textContent = getEmail();
    });
    if (afterRender) afterRender(modalBody);

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

  panel.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = $$(
      "a[href], button:not([disabled]), input, select, textarea",
      panel,
    ).filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (
      e.shiftKey &&
      (document.activeElement === first || document.activeElement === panel)
    ) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------------------------------------------------------
     7. Popup "Minta penawaran"
     --------------------------------------------------------- */
  function openQuote(service) {
    if (CONFIG.formUrl) {
      window.open(CONFIG.formUrl, "_blank", "noopener");
      return;
    }
    openModal("tpl-quote", (scope) => {
      const select = $("[data-services]", scope);
      SERVICES.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
      if (service && SERVICES.includes(service)) select.value = service;
    });
  }

  function buildMessage() {
    const val = (id) => ($(`#${id}`, modalBody)?.value || "").trim();
    const service = val("q-service") || "Lainnya";
    const name = val("q-name") || "[nama kamu]";
    const brief = val("q-brief") || "[ceritakan kebutuhanmu]";
    const deadline = val("q-deadline") || "-";
    return {
      subject: `Permintaan penawaran: ${service}`,
      body:
        `Halo Fathya,\n\nSaya ingin meminta penawaran untuk: ${service}.\n\n` +
        `Nama: ${name}\nKebutuhan: ${brief}\nTarget selesai: ${deadline}\n\n` +
        `Terima kasih.`,
    };
  }

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

  function flash(btn, doneText) {
    const label = $("[data-label]", btn);
    const icon = $("i", btn);
    if (!label) return;
    const original = label.textContent;
    const originalIcon = icon ? icon.className : "";
    label.textContent = doneText;
    if (icon) icon.className = "ph ph-check";
    window.setTimeout(() => {
      label.textContent = original;
      if (icon) icon.className = originalIcon;
    }, 2000);
  }

  function handleAction(btn) {
    const action = btn.dataset.action;
    if (action === "send") {
      const { subject, body } = buildMessage();
      window.location.href =
        `mailto:${getEmail()}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    }
    if (action === "copy-message") {
      const { subject, body } = buildMessage();
      copyText(`Subjek: ${subject}\n\n${body}`).then((ok) =>
        flash(btn, ok ? "Tersalin!" : "Salin manual"),
      );
    }
    if (action === "copy-address") {
      copyText(getEmail()).then((ok) =>
        flash(btn, ok ? "Tersalin!" : "Salin manual"),
      );
    }
  }

  /* ---------------------------------------------------------
     8. Event
     --------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]") && modal.contains(e.target)) {
      closeModal();
      return;
    }
    const quoteTrigger = e.target.closest("[data-quote]");
    if (quoteTrigger) {
      e.preventDefault();
      openQuote(quoteTrigger.dataset.quote);
      return;
    }
    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) handleAction(actionBtn);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
      return;
    }
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.matches("[data-quote][role='button']")
    ) {
      e.preventDefault();
      openQuote(e.target.dataset.quote);
    }
  });
})();
