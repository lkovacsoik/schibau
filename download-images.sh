#!/usr/bin/env bash
# Letölti az eredeti schi-bau.hu képeit és videóit a helyi images/ és videos/ mappákba.
# Futtatás a weboldal mappájából: bash download-images.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p "$(dirname "images/logo.jpg")" && curl -fsSL -o "images/logo.jpg" "https://schi-bau.hu/wp-content/uploads/2017/08/Schi-Bau_fejlec.jpg" && echo "OK  images/logo.jpg" || echo "HIBA images/logo.jpg"
mkdir -p "$(dirname "images/header.jpg")" && curl -fsSL -o "images/header.jpg" "https://schi-bau.hu/wp-content/themes/sydney/images/header.jpg" && echo "OK  images/header.jpg" || echo "HIBA images/header.jpg"
mkdir -p "$(dirname "images/munkaink/3.jpg")" && curl -fsSL -o "images/munkaink/3.jpg" "https://schi-bau.hu/wp-content/gallery/munkaink/3.jpg" && echo "OK  images/munkaink/3.jpg" || echo "HIBA images/munkaink/3.jpg"
mkdir -p "$(dirname "images/munkaink/2.jpg")" && curl -fsSL -o "images/munkaink/2.jpg" "https://schi-bau.hu/wp-content/gallery/munkaink/2.jpg" && echo "OK  images/munkaink/2.jpg" || echo "HIBA images/munkaink/2.jpg"
mkdir -p "$(dirname "images/munkaink/1.jpg")" && curl -fsSL -o "images/munkaink/1.jpg" "https://schi-bau.hu/wp-content/gallery/munkaink/1.jpg" && echo "OK  images/munkaink/1.jpg" || echo "HIBA images/munkaink/1.jpg"
mkdir -p "$(dirname "images/munkaink/IMG_1279.jpg")" && curl -fsSL -o "images/munkaink/IMG_1279.jpg" "https://schi-bau.hu/wp-content/gallery/munkaink/IMG_1279.jpg" && echo "OK  images/munkaink/IMG_1279.jpg" || echo "HIBA images/munkaink/IMG_1279.jpg"
mkdir -p "$(dirname "images/munkaink/5.jpg")" && curl -fsSL -o "images/munkaink/5.jpg" "https://schi-bau.hu/wp-content/gallery/munkaink/5.jpg" && echo "OK  images/munkaink/5.jpg" || echo "HIBA images/munkaink/5.jpg"
mkdir -p "$(dirname "images/vicces-kepek/4.jpg")" && curl -fsSL -o "images/vicces-kepek/4.jpg" "https://schi-bau.hu/wp-content/gallery/vicces-kepek/4.jpg" && echo "OK  images/vicces-kepek/4.jpg" || echo "HIBA images/vicces-kepek/4.jpg"
mkdir -p "$(dirname "images/gepek/mk8-120.jpg")" && curl -fsSL -o "images/gepek/mk8-120.jpg" "https://schi-bau.hu/wp-content/gallery/gepek/mk8-120.jpg" && echo "OK  images/gepek/mk8-120.jpg" || echo "HIBA images/gepek/mk8-120.jpg"
mkdir -p "$(dirname "images/gepek/moskito60.jpg")" && curl -fsSL -o "images/gepek/moskito60.jpg" "https://schi-bau.hu/wp-content/gallery/gepek/moskito60.jpg" && echo "OK  images/gepek/moskito60.jpg" || echo "HIBA images/gepek/moskito60.jpg"
mkdir -p "$(dirname "videos/IMG_0839.mp4")" && curl -fsSL -o "videos/IMG_0839.mp4" "https://schi-bau.hu/wp-content/uploads/2017/08/IMG_0839.mp4" && echo "OK  videos/IMG_0839.mp4" || echo "HIBA videos/IMG_0839.mp4"
mkdir -p "$(dirname "videos/IMG_1280.mp4")" && curl -fsSL -o "videos/IMG_1280.mp4" "https://schi-bau.hu/wp-content/uploads/2017/08/IMG_1280.mp4" && echo "OK  videos/IMG_1280.mp4" || echo "HIBA videos/IMG_1280.mp4"
