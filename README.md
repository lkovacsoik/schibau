# Schi-Bau 2004 – statikus weboldal

Sima HTML/CSS/JS, nincs szükség CMS-re, adatbázisra vagy PHP-ra. Bármely tárhelyre feltölthető (a mappa tartalmát kell a webgyökérbe másolni).

## Oldalak
- `index.html` – Kezdőlap + Bemutatkozás (#bemutatkozas)
- `referenciak.html` – 129 referencia, szűrővel és keresővel
- `galeria.html` – Videók, Munkáink, Vicces képek, Gépek (nagyító képnézegetővel)
- `arajanlat.html` – Árajánlatkérő űrlap
- `adatvedelem.html`, `adatvedelem-6-melleklet.html` – Adatvédelmi szabályzat és 6. sz. melléklet

## Képek és videók
A képek az `images/`, a videók a `videos/` mappában vannak, az eredeti schi-bau.hu-ról letöltve (a logó és a CMYK-s gépfotó webre optimalizálva).
Újraletöltéshez: `bash download-images.sh` (a mappából futtatva, internetkapcsolattal).

## Árajánlat űrlap
Statikus oldalon nincs szerveroldali levélküldés, ezért a Küldés gomb a látogató levelezőprogramját nyitja meg kitöltött levéllel (schibau2004@gmail.com).
Ha közvetlen küldést szeretnének, az `arajanlat.html` űrlap `action` attribútumát egy űrlapszolgáltatás címére (pl. Formspree, Netlify Forms) kell átírni.

## Sütik és hozzájárulás
A `js/consent.js` kezeli a süti-hozzájárulást (Eht. 155. § (4), GDPR): sáv egyenrangú Elfogadom / Elutasítom gombbal, kategóriánkénti beállítások, és minden oldal alján „Süti-beállítások” hivatkozás a döntés módosításához. Tájékoztató: `suti-tajekoztato.html`.
Jelenleg a honlap csak a feltétlenül szükséges `sb-consent` bejegyzést tárolja; a betűtípus is saját tárhelyről töltődik (`fonts/`), nincs Google Fonts.
Ha később analitika vagy külső beágyazás (YouTube, Google Térkép stb.) kerül az oldalra, csak hozzájárulással szabad betölteni:
`<script type="text/plain" data-consent="statisztika" src="…"></script>` vagy `<iframe data-consent="kulso" data-src="…"></iframe>`.
Ilyenkor frissíteni kell a `consent.js` CATEGORIES listáját és a tájékoztató táblázatát, valamint növelni a `VERSION` értékét.
