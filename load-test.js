// ============================================================
// MÓDULO 04 — Load Testing con k6
// ============================================================
// Uso:
//   1. Instalar k6: https://k6.io/docs/get-started/installation
//   2. k6 run load-test.js
//
// Escenarios:
//   - homepage:     50 VUs constantes, 2min
//   - toursBrowse:  30 VUs, 1min (lista + detalles)
//   - contactForm:  10 VUs, 1min (envío de formularios)
// ============================================================

import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE = __ENV.BASE_URL || "http://localhost:3000";

const errorRate = new Rate("errors");
const homeTTFB = new Trend("home_ttfb");
const toursTTFB = new Trend("tours_ttfb");
const detailTTFB = new Trend("detail_ttfb");
const galleryTTFB = new Trend("gallery_ttfb");

const SLUGS = ["safari-manuel-antonio", "caminata-manglar-damas", "caminata-nocturna"];

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 30 },
    { duration: "1m", target: 80 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    errors: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
    home_ttfb: ["p(95)<1500"],
    tours_ttfb: ["p(95)<1500"],
    detail_ttfb: ["p(95)<1500"],
    gallery_ttfb: ["p(95)<2000"],
  },
};

function randomLocale() {
  return Math.random() > 0.5 ? "es" : "en";
}

export default function () {
  group("homepage", function () {
    const res = http.get(`${BASE}/${randomLocale()}`);
    check(res, { "status 200": (r) => r.status === 200 });
    homeTTFB.add(res.timings.waiting);
    errorRate.add(res.status !== 200);
    sleep(1);
  });

  group("tours listing", function () {
    const res = http.get(`${BASE}/${randomLocale()}/tours`);
    check(res, { "tours status 200": (r) => r.status === 200 });
    toursTTFB.add(res.timings.waiting);
    errorRate.add(res.status !== 200);
    sleep(1);
  });

  group("tour detail", function () {
    const slug = SLUGS[Math.floor(Math.random() * SLUGS.length)];
    const res = http.get(`${BASE}/${randomLocale()}/tours/${slug}`);
    check(res, { "detail status 200": (r) => r.status === 200 });
    detailTTFB.add(res.timings.waiting);
    errorRate.add(res.status !== 200);
    sleep(2);
  });

  group("gallery", function () {
    const res = http.get(`${BASE}/${randomLocale()}/gallery`);
    check(res, { "gallery status 200": (r) => r.status === 200 });
    galleryTTFB.add(res.timings.waiting);
    errorRate.add(res.status !== 200);
    sleep(1);
  });

  group("about page", function () {
    const res = http.get(`${BASE}/${randomLocale()}/about`);
    check(res, { "about status 200": (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
    sleep(1);
  });
}
