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
