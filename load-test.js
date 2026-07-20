import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = "http://localhost:3000";
const LOCALES = ["es", "en"];

const pageErrorRate = new Rate("page_errors");
const pageDuration = new Trend("page_duration");

const TOUR_SLUG = "barco-manglar-damas";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "10s", target: 80 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    page_errors: ["rate < 0.01"],
    http_req_duration: ["p(95) < 2000"],
  },
};

const pages = [
  { path: "/es", name: "home es" },
  { path: "/en", name: "home en" },
  { path: "/es/tours", name: "tours listing es" },
  { path: "/en/tours", name: "tours listing en" },
  { path: `/es/tours/${TOUR_SLUG}`, name: "tour detail es" },
  { path: `/en/tours/${TOUR_SLUG}`, name: "tour detail en" },
  { path: "/es/gallery", name: "gallery es" },
  { path: "/en/gallery", name: "gallery en" },
  { path: "/es/about", name: "about es" },
  { path: "/es/contact", name: "contact es" },
  { path: "/admin/login", name: "admin login" },
];

function visitPage(path, name) {
  const start = Date.now();
  const res = http.get(`${BASE_URL}${path}`);
  const dur = Date.now() - start;

  const ok = check(res, {
    [`${name} status 200`]: (r) => r.status === 200,
  });

  pageErrorRate.add(!ok, { page: name });
  pageDuration.add(dur, { page: name });
}

export default function () {
  group("Public pages", function () {
    for (const p of pages) {
      visitPage(p.path, p.name);
      sleep(Math.random() * 0.5 + 0.1);
    }
  });
}


