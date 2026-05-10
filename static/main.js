(() => {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Developer easter egg (silent, but satisfying)
  // eslint-disable-next-line no-console
  console.log("Welcome to ZAS Tech");

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function attachReveal() {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    if (reduceMotion) {
      for (const el of els) el.classList.add("reveal-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    for (const el of els) io.observe(el);
  }

  function attachCountUp() {
    const els = Array.from(document.querySelectorAll(".count"));
    if (!els.length) return;

    const run = (el) => {
      const end = Number(el.getAttribute("data-count") ?? "0");
      const start = 0;
      const dur = 950;
      const t0 = performance.now();

      const frame = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(start + (end - start) * eased);
        el.textContent = String(v);
        if (p < 1) requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    };

    if (reduceMotion) {
      for (const el of els) el.textContent = String(Number(el.getAttribute("data-count") ?? "0"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = /** @type {HTMLElement} */ (entry.target);
          if (el.getAttribute("data-done") === "1") continue;
          el.setAttribute("data-done", "1");
          run(el);
        }
      },
      { threshold: 0.4 },
    );

    for (const el of els) io.observe(el);
  }

  function attachNeuralCanvas() {
    const canvas = document.getElementById("neural");
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    /** @type {{x:number,y:number,vx:number,vy:number}}[] */
    let points = [];
    let raf = 0;

    const cursor = { x: 0, y: 0, active: false };

    const palette = {
      point: "rgba(148,163,184,0.55)",
      glowA: "rgba(45,212,191,0.26)",
      glowB: "rgba(34,211,238,0.18)",
    };

    const hero = canvas.closest('[data-section-root="hero"]') || canvas.closest("section");
    if (hero) {
      hero.addEventListener(
        "pointermove",
        (e) => {
          const rect = canvas.getBoundingClientRect();
          cursor.x = e.clientX - rect.left;
          cursor.y = e.clientY - rect.top;
          cursor.active = true;
        },
        { passive: true },
      );
      hero.addEventListener("pointerleave", () => {
        cursor.active = false;
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * DPR);
      canvas.height = Math.floor(rect.height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const area = rect.width * rect.height;
      const target = Math.max(46, Math.min(96, Math.floor(area / 23000)));

      points = Array.from({ length: target }, () => {
        const speed = 0.14 + Math.random() * 0.30;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      });
    }

    function drawOnce() {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(148,163,184,0.35)";
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick() {
      raf = window.requestAnimationFrame(tick);
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      // soft ambient glow
      const g1 = ctx.createRadialGradient(w * 0.72, h * 0.18, 0, w * 0.72, h * 0.18, Math.min(w, h) * 0.65);
      g1.addColorStop(0, palette.glowA);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.22, h * 0.42, 0, w * 0.22, h * 0.42, Math.min(w, h) * 0.55);
      g2.addColorStop(0, palette.glowB);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // update + subtle cursor attraction
      const attractRadius = Math.min(220, Math.max(140, Math.floor(Math.min(w, h) * 0.22)));
      for (const p of points) {
        if (cursor.active) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d > 0.001 && d < attractRadius) {
            const t = 1 - d / attractRadius;
            p.vx += (dx / d) * (0.015 * t);
            p.vy += (dy / d) * (0.015 * t);
          }
        }

        // gentle damping to keep motion calm
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // connections
      const maxDist = Math.min(170, Math.max(115, Math.floor(Math.min(w, h) * 0.19)));
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > maxDist) continue;
          const t = 1 - d / maxDist;
          ctx.strokeStyle = `rgba(148,163,184,${0.04 + t * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // cursor links (perception: “alive”)
      if (cursor.active) {
        const linkDist = Math.min(210, maxDist + 40);
        for (const p of points) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          const t = 1 - d / linkDist;
          ctx.strokeStyle = `rgba(45,212,191,${0.04 + t * 0.26})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(cursor.x, cursor.y);
          ctx.stroke();
        }
      }

      // points
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148,163,184,0.55)";
        ctx.fill();
      }

      if (cursor.active) {
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.75)";
        ctx.fill();
      }
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    if (reduceMotion) drawOnce();
    else tick();

    window.addEventListener("visibilitychange", () => {
      if (document.hidden && raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      } else if (!document.hidden && !raf && !reduceMotion) {
        tick();
      }
    });
  }

  function attachHeroSpotlight() {
    const hero = document.querySelector('[data-section-root="hero"]');
    if (!(hero instanceof HTMLElement)) return;
    if (reduceMotion) return;

    /** @param {PointerEvent} e */
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100;
      const y = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100;
      hero.style.setProperty("--spot-x", `${x}%`);
      hero.style.setProperty("--spot-y", `${y}%`);
    };

    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", () => {
      hero.style.removeProperty("--spot-x");
      hero.style.removeProperty("--spot-y");
    });
  }

  attachReveal();
  attachHeroSpotlight();
  attachCountUp();
  attachNeuralCanvas();

  // Scrollspy for section tabs
  (() => {
    const tabs = Array.from(document.querySelectorAll('[data-tab="true"][data-section]'));
    if (!tabs.length) return;

    const byId = new Map(tabs.map((t) => [t.getAttribute("data-section"), t]));
    const sections = tabs
      .map((t) => document.getElementById(t.getAttribute("data-section") || ""))
      .filter((s) => s instanceof HTMLElement);

    const passiveStandard =
      "rounded-full border border-transparent px-3.5 py-2 text-xs font-semibold text-white/75 transition duration-300 ease-out hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.04)]";
    const activeStandard =
      "rounded-full border border-teal-400/45 bg-teal-500/15 px-3.5 py-2 text-xs font-semibold text-white shadow-glow-nav transition duration-300 ease-out hover:bg-teal-500/25";
    const passiveContact =
      "rounded-full border border-cyan-400/35 bg-cyan-500/12 px-3.5 py-2 text-xs font-semibold text-white transition duration-300 ease-out hover:border-cyan-400/55 hover:bg-cyan-500/18 hover:shadow-[0_0_28px_rgba(34,211,238,0.2)]";
    const activeContact =
      "rounded-full border border-cyan-400/55 bg-cyan-500/22 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,0.28)] transition duration-300 ease-out hover:bg-cyan-500/28";

    const setActive = (id) => {
      for (const t of tabs) {
        const sid = t.getAttribute("data-section") || "";
        if (sid === id) {
          t.className = sid === "contact" ? activeContact : activeStandard;
        } else {
          t.className = sid === "contact" ? passiveContact : passiveStandard;
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        const id = visible?.target?.id;
        if (id) setActive(id);
      },
      { root: null, threshold: [0.22, 0.35, 0.5], rootMargin: "-20% 0px -65% 0px" },
    );

    for (const s of sections) io.observe(s);

    const applyHash = () => {
      const id = (location.hash || "").replace("#", "");
      if (id && byId.has(id)) setActive(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash, { passive: true });
    window.addEventListener("zas:languagechange", applyHash, { passive: true });
  })();

  // Mobile menu toggle
  (() => {
    const btn = document.querySelector('[data-menu-btn="true"]');
    const menu = document.getElementById("mobileMenu");
    const panel = menu?.querySelector?.('[data-menu-panel="true"]');
    if (!(btn instanceof HTMLButtonElement)) return;
    if (!(menu instanceof HTMLElement)) return;

    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      menu.classList.toggle("hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        if (panel instanceof HTMLElement) {
          // ensure the panel animates in even if toggled quickly
          panel.classList.remove("translate-x-full");
        }
        const closeBtn = menu.querySelector('button[data-menu-close="true"]');
        if (closeBtn instanceof HTMLElement) closeBtn.focus();
      } else {
        if (panel instanceof HTMLElement) {
          panel.classList.add("translate-x-full");
        }
        btn.focus();
      }
    };

    btn.addEventListener("click", () => {
      const isOpen = menu.getAttribute("aria-hidden") === "false";
      setOpen(!isOpen);
    });

    menu.addEventListener("click", (e) => {
      const t = /** @type {HTMLElement} */ (e.target);
      if (t?.getAttribute?.("data-menu-close") === "true") setOpen(false);
      if (t?.getAttribute?.("data-menu-link") === "true") setOpen(false);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (menu.getAttribute("aria-hidden") === "false") setOpen(false);
    });

    // close if viewport grows back to desktop
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 860 && menu.getAttribute("aria-hidden") === "false") setOpen(false);
      },
      { passive: true },
    );

    // start closed with correct transform state
    if (panel instanceof HTMLElement) panel.classList.add("translate-x-full");
  })();

  // Live Server / simple static hosts reject POST to .html (HTTP 405). Netlify handles POST in production.
  (() => {
    const form = document.querySelector('form[name="contact"]');
    if (!(form instanceof HTMLFormElement)) return;
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
    if (!isLocal) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let dest = (form.getAttribute("action") || "thank-you.html").trim();
      if (dest.startsWith("/")) dest = dest.slice(1) || "thank-you.html";
      window.location.href = dest;
    });
  })();
})();

