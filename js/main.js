/* ==========================================================================
   Bruin Capital Advisory — shared behavior
   ========================================================================== */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Build a DOM node: el("a", { class: "btn", href: "/x" }, "text", childNode)
  // Text always goes through text nodes, so content can never inject markup.
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      node.setAttribute(k, k === "href" || k === "src" ? safeUrl(v) : v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  // Allow relative paths, http(s) and mailto only — blocks javascript: URLs.
  function safeUrl(u) {
    const s = String(u).trim();
    if (/^(https?:|mailto:)/i.test(s) || !/^[a-z][a-z0-9+.-]*:/i.test(s)) return s;
    return "#";
  }

  const fmtDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  /* ---- Mobile nav ---- */
  const toggle = $(".nav-toggle");
  const nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- Header shadow once the page scrolls ---- */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Roaring bear: roars on mouse hover, keyboard focus, or tap ---- */
  const roar = $(".roar");
  if (roar) {
    const play = () => {
      if (reduceMotion || roar.classList.contains("is-roaring")) return;
      roar.classList.add("is-roaring");
      setTimeout(() => roar.classList.remove("is-roaring"), 1600);
    };
    roar.addEventListener("mouseenter", play);
    roar.addEventListener("focus", play);
    roar.addEventListener("click", play);
  }

  /* ---- Optional group photo behind the home banner ---- */
  const hero = $(".hero");
  if (hero && window.BCA_HERO_PHOTO) {
    // Resolve against the page, not the stylesheet, so a path like "assets/x.jpg" works.
    const photo = new URL(safeUrl(window.BCA_HERO_PHOTO), document.baseURI).href;
    hero.style.setProperty("--hero-photo", `url("${photo.replace(/"/g, "%22")}")`);
    hero.classList.add("has-photo");
  }

  /* ---- Footer: year + contact links ---- */
  const year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
  const c = window.BCA_CONTACT || {};
  document.querySelectorAll("[data-email]").forEach((a) => {
    a.href = "mailto:" + c.email;
    if (!a.children.length) a.textContent = c.email;
  });
  document.querySelectorAll("[data-instagram]").forEach((a) => (a.href = safeUrl(c.instagram)));
  document.querySelectorAll("[data-linkedin]").forEach((a) => (a.href = safeUrl(c.linkedin)));

  const reports = window.BCA_REPORTS || [];

  /* ---- Homepage carousel ---- */
  const carousel = $(".carousel");
  if (carousel) {
    const slidesEl = $(".slides", carousel);
    const dotsEl = $(".dots", carousel);
    const items = reports.slice(0, 3);
    const slides = items.length
      ? items.map((r) =>
          el("article", { class: "slide" },
            el("p", { class: "tag" }, r.sector),
            el("h3", {}, r.title),
            el("a", { class: "btn btn-light", href: r.url }, "View report")))
      : [el("article", { class: "slide" },
          el("p", { class: "tag" }, "Reports"),
          el("h3", {}, "Our first member reports are on the way."),
          el("a", { class: "btn btn-light", href: "reports.html" }, "Visit reports"))];
    slidesEl.replaceChildren(...slides);

    let i = 0;
    const n = slides.length;
    const dots = slides.map((_, j) => el("button", { type: "button", "aria-label": `Go to slide ${j + 1}` }));
    const go = (k) => {
      i = (k + n) % n;
      slidesEl.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
    };
    if (n > 1) {
      dotsEl.replaceChildren(...dots);
      dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
      $(".prev", carousel).addEventListener("click", () => go(i - 1));
      $(".next", carousel).addEventListener("click", () => go(i + 1));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const timer = reduce ? null : setInterval(() => go(i + 1), 6000);
      carousel.addEventListener("mouseenter", () => clearInterval(timer));
      go(0);
    } else {
      carousel.querySelectorAll(".carousel-arrow").forEach((b) => b.remove());
    }
  }

  /* ---- Reports page ---- */
  const list = $(".report-list");
  if (list) {
    const filters = $(".filters");
    const sectors = window.BCA_SECTORS || [];
    const buttons = sectors.map((name, j) => el("button", { type: "button", "aria-pressed": String(j === 0) }, name));
    filters.replaceChildren(...buttons);
    const empty = $(".empty");

    const render = (sector) => {
      const shown = reports.filter((r) => r.sector === sector);
      list.replaceChildren(...shown.map((r) =>
        el("article", { class: "report-card" },
          el("p", { class: "tag" }, r.sector),
          el("h3", {}, el("a", { href: r.url }, r.title)),
          el("p", {}, r.summary),
          el("time", { datetime: r.date }, fmtDate(r.date)))));
      empty.textContent = `No ${sector} reports yet. Our first ones are on the way.`;
      empty.hidden = shown.length > 0;
    };
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        render(b.textContent);
      }));
    if (sectors.length) render(sectors[0]);
  }

  /* ---- Projects page ---- */
  const projectList = $(".project-list");
  if (projectList) {
    const projects = window.BCA_PROJECTS || [];
    projectList.replaceChildren(...projects.map((p) =>
      el("article", { class: "report-card" },
        p.type && el("p", { class: "tag" }, p.type),
        el("h3", {}, p.url ? el("a", { href: p.url }, p.title) : p.title),
        el("p", {}, p.summary),
        p.team && el("p", { class: "team" }, p.team),
        p.date && el("time", { datetime: p.date }, fmtDate(p.date)))));
    $(".empty").hidden = projects.length > 0;
  }

  /* ---- Team page ---- */
  const team = $(".team-grid");
  if (team) {
    const members = window.BCA_TEAM || [];
    team.replaceChildren(...members.map((m) =>
      el("article", { class: "member" },
        el("img", {
          class: "photo",
          src: m.photo || "assets/team/placeholder.svg",
          alt: m.photo ? `Headshot of ${m.name}` : "",
          loading: "lazy",
        }),
        el("h3", {}, m.name),
        el("p", {}, m.role),
        m.linkedin && el("a", { href: m.linkedin, rel: "noopener", target: "_blank" }, "LinkedIn"))));
    $(".empty").hidden = members.length > 0;
  }

  /* ---- Scroll reveal ---- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
      ".carousel, .about .section-title, .about-row, .step, .split > div, .member, .report-card, .filters, .empty:not([hidden]), .legal > *");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((t, j) => {
      const sibs = t.parentElement ? [...t.parentElement.children].indexOf(t) : 0;
      t.style.setProperty("--d", Math.min(sibs, 5) * 0.07 + "s");
      t.classList.add("reveal");
      io.observe(t);
    });
  }
})();
