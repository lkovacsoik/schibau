/* SCHI-BAU 2004 Kft. – animációk és interakciók */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document.documentElement;

  /* Fejléc zsugorodás + vissza a tetejére */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* Mobil menü */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Képek finom előtűnése betöltéskor */
  document.querySelectorAll("img.lazy-fade").forEach(function (img) {
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
    else img.addEventListener("load", function () { img.classList.add("is-loaded"); }, { once: true });
  });

  /* Görgetésre megjelenő elemek */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Számláló animáció */
  function fmt(n) { return Math.round(n).toLocaleString("hu-HU"); }
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (reduce) { el.textContent = fmt(target); return; }
    var start = performance.now(), dur = 1800;
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  } else counters.forEach(runCounter);

  /* Hero diavetítés (áttűnés + Ken Burns) */
  var slides = document.querySelectorAll(".hero-slides img");
  var dotsWrap = document.querySelector(".hero-dots");
  if (slides.length > 1) {
    var idx = 0, timer;
    var dots = [];
    slides.forEach(function (_, i) {
      if (!dotsWrap) return;
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", (i + 1) + ". kép");
      b.addEventListener("click", function () { show(i); restart(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    function show(i) {
      slides[idx].classList.remove("is-active");
      if (dots[idx]) dots[idx].classList.remove("is-active");
      idx = (i + slides.length) % slides.length;
      // újraindítja a Ken Burns animációt
      void slides[idx].offsetWidth;
      slides[idx].classList.add("is-active");
      if (dots[idx]) dots[idx].classList.add("is-active");
    }
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(idx + 1); }, 6000); }
    show(0);
    restart();
  } else if (slides.length) slides[0].classList.add("is-active");

  /* Lightbox galéria */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (links.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Képnézegető");
    lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-close" type="button" aria-label="Bezárás">✕</button>' +
      '<button class="lb-prev" type="button" aria-label="Előző kép">←</button>' +
      '<button class="lb-next" type="button" aria-label="Következő kép">→</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("figcaption");
    var cur = 0, group = links, lastFocus;
    function open(link) {
      var g = link.getAttribute("data-lightbox");
      group = links.filter(function (l) { return l.getAttribute("data-lightbox") === g; });
      cur = group.indexOf(link);
      lastFocus = document.activeElement;
      load();
      lb.classList.add("is-open");
      doc.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    }
    function load() {
      var link = group[cur];
      var thumb = link.querySelector("img");
      lbImg.classList.remove("is-ready");
      var src = link.getAttribute("href"), fb = link.getAttribute("data-orig");
      lbImg.onload = function () { lbImg.classList.add("is-ready"); };
      lbImg.onerror = function () { if (fb && lbImg.src !== fb) lbImg.src = fb; };
      lbImg.src = src;
      lbImg.alt = thumb ? thumb.alt : "";
      lbCap.textContent = link.getAttribute("data-caption") || "";
      var many = group.length > 1;
      lb.querySelector(".lb-prev").hidden = !many;
      lb.querySelector(".lb-next").hidden = !many;
    }
    function close() {
      lb.classList.remove("is-open");
      doc.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    function step(d) { cur = (cur + d + group.length) % group.length; load(); }
    links.forEach(function (l) { l.addEventListener("click", function (e) { e.preventDefault(); open(l); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    var tx = null;
    lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      tx = null;
    });
  }

  /* Referencia szűrő és kereső */
  var grid = document.querySelector(".ref-grid");
  if (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll(".ref"));
    var chips = document.querySelectorAll(".chip");
    var input = document.getElementById("ref-search");
    var summary = document.querySelector(".ref-summary");
    var empty = document.querySelector(".empty");
    var filter = "all";
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    items.forEach(function (it) { it._text = norm(it.textContent); });
    function apply() {
      var q = input ? norm(input.value.trim()) : "";
      var n = 0, area = 0, i = 0;
      items.forEach(function (it) {
        var ok = (filter === "all" || it.getAttribute("data-type") === filter) && (!q || it._text.indexOf(q) !== -1);
        it.classList.toggle("is-hidden", !ok);
        it.classList.remove("pop");
        if (ok) {
          n++; area += parseInt(it.getAttribute("data-area"), 10);
          if (!reduce && i < 40) { it.style.animationDelay = (i * 18) + "ms"; void it.offsetWidth; it.classList.add("pop"); }
          i++;
        }
      });
      if (summary) summary.textContent = n + " munka · összesen " + area.toLocaleString("hu-HU") + " m²";
      if (empty) empty.style.display = n ? "none" : "block";
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
        c.classList.add("is-active"); c.setAttribute("aria-pressed", "true");
        filter = c.getAttribute("data-filter");
        apply();
      });
    });
    if (input) input.addEventListener("input", apply);
    apply();
  }

  /* Árajánlat űrlap: statikus oldal, ezért levelezőprogramot nyit */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var endpoint = form.getAttribute("action");
      if (endpoint && endpoint.indexOf("mailto:") !== 0) return; // külső űrlapszolgáltatás esetén normál küldés
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = form.elements;
      var body = f.message.value + "\n\n--\n" + f.name.value + "\n" + f.email.value + (f.phone.value ? "\n" + f.phone.value : "");
      var href = "mailto:schibau2004@gmail.com?subject=" + encodeURIComponent(f.subject.value) + "&body=" + encodeURIComponent(body);
      window.location.href = href;
      var st = form.querySelector(".form-status");
      if (st) st.textContent = "Megnyitottuk a levelezőprogramját, csak a Küldés gombot kell megnyomnia.";
    });
  }

  /* Süti tájékoztató */
  var cookie = document.querySelector(".cookie");
  if (cookie) {
    var seen = false;
    try { seen = localStorage.getItem("sb-cookie-ok") === "1"; } catch (err) {}
    if (!seen) setTimeout(function () { cookie.classList.add("is-visible"); }, 1200);
    cookie.querySelector("button").addEventListener("click", function () {
      cookie.classList.remove("is-visible");
      try { localStorage.setItem("sb-cookie-ok", "1"); } catch (err) {}
    });
  }

  /* Áttűnés oldalváltáskor, ha a böngésző nem ismeri a View Transitions API-t */
  if (!("onpagereveal" in window) && !reduce) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || a.target || a.hasAttribute("download") || a.hasAttribute("data-lightbox") || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || /^(mailto|tel):/.test(a.href)) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(function () { location.href = a.href; }, 280);
    });
    window.addEventListener("pageshow", function () { document.body.classList.remove("is-leaving"); });
  }
})();
