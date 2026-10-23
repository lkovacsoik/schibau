/* Schi-Bau 2004 – süti- és hozzájáruláskezelő
 *
 * Előzetes hozzájárulás (Eht. 155. § (4), GDPR 6. cikk (1) a) és 7. cikk):
 * a nem feltétlenül szükséges sütik, szkriptek és beágyazások csak azután
 * töltődnek be, hogy a látogató az adott kategóriát engedélyezte.
 *
 * Használat új külső tartalomhoz:
 *   <script type="text/plain" data-consent="statisztika" src="..."></script>
 *   <iframe data-consent="kulso" data-src="https://..."></iframe>
 * A hozzájárulás megadásáig ezek nem futnak / nem töltődnek be.
 * Ha új kategóriát vagy sütit vesz fel, frissítse a CATEGORIES listát,
 * a suti-tajekoztato.html táblázatát, és növelje a VERSION értékét
 * (ekkor mindenkitől újra kérünk hozzájárulást).
 */
(function () {
  "use strict";

  var KEY = "sb-consent";
  var VERSION = 1;
  var MAX_AGE_DAYS = 365; // ennyi idő után újra megkérdezzük a látogatót
  var POLICY_URL = "suti-tajekoztato.html";

  var CATEGORIES = [
    {
      id: "szukseges",
      required: true,
      title: "Feltétlenül szükséges",
      text: "Ezek nélkül a honlap nem működik megfelelően. Itt tároljuk például az Ön süti-beállításait. Nem kapcsolhatók ki, és nem igényelnek hozzájárulást.",
      items: [{ name: "sb-consent", type: "helyi tárolás (localStorage)", duration: "12 hónap", purpose: "Az Ön süti-beállításainak megjegyzése." }]
    },
    {
      id: "statisztika",
      title: "Statisztikai sütik",
      text: "Névtelen látogatottsági statisztikák, amelyek segítenek a honlap fejlesztésében.",
      items: [],
      cookies: [/^_ga/, /^_gid$/, /^_gat/]
    },
    {
      id: "kulso",
      title: "Külső tartalmak és marketing",
      text: "Harmadik féltől származó beágyazott tartalmak (pl. térkép, videómegosztó) és hirdetési sütik. Ezek betöltésekor a külső szolgáltató adatokat (pl. IP-címet) kaphat.",
      items: [],
      cookies: [/^_fbp$/, /^_gcl/]
    }
  ];

  var optional = CATEGORIES.filter(function (c) { return !c.required; });
  var state = read();
  var banner, dialog, lastFocus;

  /* ---------- Tárolás ---------- */
  function read() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (!s || s.v !== VERSION || !s.date || !s.cats) return null;
      if (Date.now() - new Date(s.date).getTime() > MAX_AGE_DAYS * 864e5) return null;
      return s;
    } catch (e) { return null; }
  }

  function save(cats) {
    var prev = state;
    state = { v: VERSION, date: new Date().toISOString(), cats: cats };
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    hideBanner();
    closeDialog();

    // Visszavont kategória: töröljük a sütijeit, és újratöltjük az oldalt,
    // hogy a már elindult külső szkriptek is leálljanak.
    var revoked = prev && optional.some(function (c) { return prev.cats[c.id] && !cats[c.id]; });
    if (revoked) {
      optional.forEach(function (c) { if (!cats[c.id]) deleteCookies(c.cookies || []); });
      location.reload();
      return;
    }
    apply();
    document.dispatchEvent(new CustomEvent("sb:consent", { detail: state }));
  }

  function allowed(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    if (c && c.required) return true;
    return !!(state && state.cats[id]);
  }

  function choose(all) {
    var cats = {};
    optional.forEach(function (c) { cats[c.id] = all; });
    save(cats);
  }

  function deleteCookies(patterns) {
    if (!patterns.length) return;
    var host = location.hostname, parts = host.split("."), domains = [""];
    for (var i = 0; i < parts.length - 1; i++) domains.push("; domain=." + parts.slice(i).join("."));
    document.cookie.split(";").forEach(function (pair) {
      var name = pair.split("=")[0].trim();
      if (!patterns.some(function (p) { return p.test(name); })) return;
      domains.forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
      });
    });
  }

  /* ---------- Blokkolt tartalmak engedélyezése ---------- */
  function apply() {
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(function (old) {
      if (!allowed(old.dataset.consent)) return;
      var s = document.createElement("script");
      for (var i = 0; i < old.attributes.length; i++) {
        var a = old.attributes[i];
        if (a.name !== "type" && a.name !== "data-consent") s.setAttribute(a.name, a.value);
      }
      if (!old.src) s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
    document.querySelectorAll("[data-consent][data-src]").forEach(function (el) {
      if (!allowed(el.dataset.consent)) return;
      el.src = el.dataset.src;
      el.removeAttribute("data-src");
      var ph = el.parentNode.querySelector(".consent-placeholder");
      if (ph) ph.remove();
    });
  }

  /* ---------- Felület ---------- */
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  function buildBanner() {
    banner = el("div", { "class": "consent-banner", role: "region", "aria-label": "Süti-beállítások", "aria-describedby": "consent-text" });
    banner.innerHTML =
      '<h2 class="consent-title">Sütik ezen a honlapon</h2>' +
      '<p id="consent-text">A honlap működéséhez szükséges adatokon túl csak az Ön engedélyével használnánk statisztikai, ' +
      'külső tartalmakhoz kapcsolódó vagy marketing célú sütiket. Döntését bármikor módosíthatja az oldal alján található ' +
      '„Süti-beállítások” hivatkozással. Részletek: <a href="' + POLICY_URL + '">Süti tájékoztató</a>.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn consent-btn" data-consent-action="reject">Elutasítom</button>' +
      '<button type="button" class="btn consent-btn" data-consent-action="accept">Elfogadom</button>' +
      '<button type="button" class="consent-link" data-consent-open>Beállítások</button>' +
      "</div>";
    document.body.appendChild(banner);
    // A banner a „vissza a tetejére” gomb előtt legyen, hogy a CSS testvér-szelektor működjön
    var top = document.querySelector(".to-top");
    if (top) top.parentNode.insertBefore(banner, top);
  }

  function showBanner() {
    if (!banner) buildBanner();
    requestAnimationFrame(function () { banner.classList.add("is-visible"); });
  }

  function hideBanner() {
    if (banner) banner.classList.remove("is-visible");
  }

  function buildDialog() {
    dialog = el("div", { "class": "consent-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "consent-modal-title", hidden: "" });
    var rows = CATEGORIES.map(function (c) {
      var list = c.items.length
        ? "<ul>" + c.items.map(function (i) {
            return "<li><code>" + i.name + "</code> – " + i.purpose + " (" + i.type + ", " + i.duration + ")</li>";
          }).join("") + "</ul>"
        : '<p class="consent-none">Jelenleg a honlap ilyen sütit nem használ.</p>';
      return '<div class="consent-cat">' +
        '<div class="consent-cat-head">' +
        '<label for="consent-' + c.id + '">' + c.title + "</label>" +
        '<span class="consent-switch"><input type="checkbox" role="switch" id="consent-' + c.id + '" data-cat="' + c.id + '"' +
        (c.required ? " checked disabled" : "") + '><span aria-hidden="true"></span></span>' +
        "</div><p>" + c.text + "</p>" +
        '<details><summary>Részletek</summary>' + list + "</details></div>";
    }).join("");
    dialog.innerHTML =
      '<div class="consent-panel">' +
      '<button type="button" class="consent-close" data-consent-close aria-label="Bezárás">×</button>' +
      '<h2 id="consent-modal-title">Süti-beállítások</h2>' +
      '<p>Az alábbiakban kategóriánként dönthet arról, mely sütiket engedélyezi. A nem feltétlenül szükséges kategóriák ' +
      'alapértelmezetten ki vannak kapcsolva. Hozzájárulását bármikor visszavonhatja. Bővebben: ' +
      '<a href="' + POLICY_URL + '">Süti tájékoztató</a>.</p>' +
      rows +
      '<div class="consent-actions">' +
      '<button type="button" class="btn consent-btn" data-consent-action="reject">Mindet elutasítom</button>' +
      '<button type="button" class="btn consent-btn" data-consent-action="accept">Mindet elfogadom</button>' +
      '<button type="button" class="btn consent-btn" data-consent-action="save">Kiválasztottak mentése</button>' +
      "</div></div>";
    document.body.appendChild(dialog);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeDialog(); return; }
      if (e.key !== "Tab") return;
      var f = dialog.querySelectorAll("button, a[href], input:not([disabled]), summary");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function openDialog() {
    if (!dialog) buildDialog();
    optional.forEach(function (c) {
      dialog.querySelector("#consent-" + c.id).checked = allowed(c.id);
    });
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.documentElement.classList.add("consent-open");
    requestAnimationFrame(function () { dialog.classList.add("is-visible"); });
    dialog.querySelector(".consent-close").focus();
  }

  function closeDialog() {
    if (!dialog || dialog.hidden) return;
    dialog.classList.remove("is-visible");
    dialog.hidden = true;
    document.documentElement.classList.remove("consent-open");
    if (!state) showBanner();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-consent-open], [data-consent-action], [data-consent-close], .consent-placeholder button");
    if (!t) return;
    if (t.hasAttribute("data-consent-open")) { e.preventDefault(); hideBanner(); openDialog(); return; }
    if (t.hasAttribute("data-consent-close")) { closeDialog(); return; }
    if (t.closest(".consent-placeholder")) {
      // Egy blokkolt beágyazás helyén lévő „Engedélyezem” gomb: csak az adott kategóriát kapcsolja be
      var cat = t.closest(".consent-placeholder").dataset.consent, cats = {};
      optional.forEach(function (c) { cats[c.id] = allowed(c.id) || c.id === cat; });
      save(cats);
      return;
    }
    var act = t.dataset.consentAction;
    if (act === "accept") choose(true);
    else if (act === "reject") choose(false);
    else if (act === "save") {
      var cats = {};
      optional.forEach(function (c) { cats[c.id] = dialog.querySelector("#consent-" + c.id).checked; });
      save(cats);
    }
  });

  /* ---------- Indulás ---------- */
  window.SchiBauConsent = {
    allowed: allowed,
    open: openDialog,
    get: function () { return state; }
  };

  try { localStorage.removeItem("sb-cookie-ok"); } catch (e) {} // a korábbi, csak tájékoztató sávé
  if (state) apply();
  else showBanner();
})();
