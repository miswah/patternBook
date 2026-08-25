/* ============================================================
   Pattern Book — data.js
   ------------------------------------------------------------
   Contains category configurations, SVG helper functions, and
   lookup helper functions for patterns & anti-patterns.
   Pattern data is stored in `js/pattern-data.js`.
   Anti-pattern data is stored in `js/antipattern.js`.
   ============================================================ */

// ---- Realms (categories). Order here = order on the home page.
const CATEGORIES = [
  { id: "creational", label: "Creational Realm", badge: "is-primary",
    blurb: "Patterns that govern how objects come into being." },
  { id: "structural", label: "Structural Realm", badge: "is-success",
    blurb: "Patterns that compose objects and classes into larger structures." },
  { id: "behavioral", label: "Behavioral Realm", badge: "is-warning",
    blurb: "Patterns concerned with algorithms and the assignment of responsibility." },
];

const ANTI_CATEGORIES = [
  { id: "arch-antipattern", label: "Architectural Anti-Patterns", badge: "is-error",
    blurb: "System-level pitfalls that degrade system architecture and scalability." },
  { id: "design-antipattern", label: "Design Anti-Patterns", badge: "is-warning",
    blurb: "Object-oriented design traps that lead to coupled and fragile codebases." },
  { id: "coding-antipattern", label: "Coding Anti-Patterns", badge: "is-dark",
    blurb: "Implementation anti-patterns in source code structure and logic." },
];

// ---- Small reusable SVG helper bits (kept inline so the whole
// site works from the file system with zero build step).
const svgBox = (x, y, w, h, label, sub) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" class="uml-box"/>
    <line x1="${x}" y1="${y + 26}" x2="${x + w}" y2="${y + 26}" class="uml-line"/>
    <text x="${x + w / 2}" y="${y + 18}" class="uml-title" text-anchor="middle">${label}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h - 10}" class="uml-sub" text-anchor="middle">${sub}</text>` : ""}
  </g>`;

// Lookup helpers used by the render scripts.
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || ANTI_CATEGORIES.find((c) => c.id === id);
}

function getPattern(id) {
  const pList = typeof PATTERNS !== "undefined" ? PATTERNS : [];
  const apList = typeof ANTIPATTERNS !== "undefined" ? ANTIPATTERNS : [];
  return pList.find((p) => p.id === id) || apList.find((p) => p.id === id);
}

function patternsByCategory(categoryId) {
  const pList = typeof PATTERNS !== "undefined" ? PATTERNS : [];
  const apList = typeof ANTIPATTERNS !== "undefined" ? ANTIPATTERNS : [];
  const isAnti = ANTI_CATEGORIES.some((c) => c.id === categoryId);
  if (isAnti) {
    return apList.filter((p) => p.category === categoryId);
  }
  return pList.filter((p) => p.category === categoryId);
}