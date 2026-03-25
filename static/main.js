(() => {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Developer easter egg (silent, but satisfying)
  // eslint-disable-next-line no-console
  console.log("Welcome to ZAS Tech — Intelligence in Motion");

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  // Tailwind-only UI: avoid CSS-variable hover effects that required custom CSS.

  function attachPerceptionHook() {
    const target = document.getElementById("hookTyped");
    if (!target) return;

    const words = ["adapt.", "learn.", "evolve."];
    let wIdx = 0;
    let tIdx = 0;
    let deleting = false;

    if (reduceMotion) {
      target.textContent = ` ${words.join(" ")}`;
      return;
    }

    const tick = () => {
      const word = words[wIdx] ?? words[0];
      const speed = deleting ? 36 : 54;

      if (!deleting) {
        tIdx = Math.min(word.length, tIdx + 1);
        target.textContent = ` ${word.slice(0, tIdx)}`;
        if (tIdx >= word.length) {
          deleting = true;
          window.setTimeout(tick, 820);
          return;
        }
      } else {
        tIdx = Math.max(0, tIdx - 1);
        target.textContent = ` ${word.slice(0, tIdx)}`;
        if (tIdx <= 0) {
          deleting = false;
          wIdx = (wIdx + 1) % words.length;
        }
      }

      window.setTimeout(tick, speed);
    };

    tick();
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
      glowA: "rgba(37,99,235,0.28)",
      glowB: "rgba(16,185,129,0.18)",
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
          ctx.strokeStyle = `rgba(37,99,235,${0.04 + t * 0.26})`;
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
        ctx.fillStyle = "rgba(37,99,235,0.75)";
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

  attachPerceptionHook();
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

    const activeOn = (el) => {
      el.classList.add("border", "border-primary/30", "bg-primary/10");
      el.classList.remove("border-transparent");
    };
    const activeOff = (el) => {
      el.classList.remove("border", "border-primary/30", "bg-primary/10");
      el.classList.add("border-transparent");
    };

    const setActive = (id) => {
      for (const t of tabs) activeOff(t);
      const el = byId.get(id);
      if (el) activeOn(el);
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

    window.addEventListener(
      "hashchange",
      () => {
        const id = (location.hash || "").replace("#", "");
        if (id) setActive(id);
      },
      { passive: true },
    );
  })();

  // Mobile menu toggle
  (() => {
    const btn = document.querySelector('[data-menu-btn="true"]');
    const menu = document.getElementById("mobileMenu");
    if (!(btn instanceof HTMLButtonElement)) return;
    if (!(menu instanceof HTMLElement)) return;

    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      menu.classList.toggle("hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        const closeBtn = menu.querySelector("[data-menu-close]");
        if (closeBtn instanceof HTMLElement) closeBtn.focus();
      } else {
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
  })();
})();

