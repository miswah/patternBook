/* Renders one pattern (looked up via ?id=) into #pattern-root. */

const LANG_PRISM_CLASS = {
  JavaScript: "language-javascript",
  Java: "language-java",
  Python: "language-python",
  "C++": "language-cpp",
  "C#": "language-csharp",
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function starRatingSmall(n) {
  const max = 3;
  let out = "";
  for (let i = 0; i < max; i++) out += i < n ? "★" : "☆";
  return out;
}

function section(title, icon, innerHtml) {
  return `
    <section class="pq-section nes-container is-rounded">
      <h2>${icon ? `<i class="nes-icon ${icon} is-small"></i>` : ""}${title}</h2>
      ${innerHtml}
    </section>`;
}

function renderList(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

function renderParticipants(participants) {
  return participants
    .map((p) => `<div class="pq-participant"><b>${p.name}</b>${p.desc}</div>`)
    .join("");
}

function renderRelated(relatedIds) {
  if (!relatedIds || relatedIds.length === 0) {
    return `<p style="opacity:0.6;">No related patterns catalogued yet.</p>`;
  }
  const links = relatedIds
    .map((id) => {
      const p = getPattern(id);
      if (!p) return "";
      const cat = getCategory(p.category);
      return `<a class="nes-badge" href="pattern.html?id=${p.id}"><span class="${cat.badge}">${p.name}</span></a>`;
    })
    .join("");
  return `<div class="pq-related-list">${links}</div>`;
}

/* ---------- Implementation section: language tabs + class sub-tabs ---------- */

function renderImplementation(implementations) {
  const langTabs = implementations
    .map(
      (impl, i) => `
      <button class="pq-tab-btn nes-btn ${i === 0 ? "is-primary" : ""}" data-lang-index="${i}">
        ${impl.language}
      </button>`
    )
    .join("");

  const langPanels = implementations
    .map((impl, i) => {
      const classTabs = impl.classes
        .map(
          (cls, j) => `
          <button class="pq-class-tab-btn nes-btn ${j === 0 ? "is-success" : ""}" data-class-index="${j}">
            ${cls.name}
          </button>`
        )
        .join("");

      const classPanels = impl.classes
        .map((cls, j) => {
          const prismClass = LANG_PRISM_CLASS[impl.language] || "language-clike";
          return `
            <div class="pq-code-panel ${j === 0 ? "active" : ""}" data-class-panel="${j}">
              <pre class="nes-container is-dark"><code class="${prismClass}">${escapeHtml(cls.code)}</code></pre>
            </div>`;
        })
        .join("");

      return `
        <div class="pq-lang-panel" data-lang-panel="${i}" style="display:${i === 0 ? "block" : "none"};">
          ${impl.classes.length > 1 ? `<div class="pq-class-tabs">${classTabs}</div>` : ""}
          ${classPanels}
        </div>`;
    })
    .join("");

  return `
    <div class="pq-lang-tabs">${langTabs}</div>
    ${langPanels}
  `;
}

function wireImplementationTabs(container) {
  // Language tab switching
  container.querySelectorAll(".pq-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.langIndex;
      container.querySelectorAll(".pq-tab-btn").forEach((b) => b.classList.remove("is-primary"));
      btn.classList.add("is-primary");
      container.querySelectorAll(".pq-lang-panel").forEach((panel) => {
        panel.style.display = panel.dataset.langPanel === idx ? "block" : "none";
      });
    });
  });

  // Class tab switching (scoped to each language panel)
  container.querySelectorAll(".pq-lang-panel").forEach((langPanel) => {
    langPanel.querySelectorAll(".pq-class-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.classIndex;
        langPanel.querySelectorAll(".pq-class-tab-btn").forEach((b) => b.classList.remove("is-success"));
        btn.classList.add("is-success");
        langPanel.querySelectorAll(".pq-code-panel").forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.classPanel === idx);
        });
      });
    });
  });
}

/* ---------- Main render ---------- */

function renderPatternDetail(pattern, root = document.getElementById("pattern-root")) {
  if (!root) return;

  if (!pattern) {
    root.innerHTML = `
      <section class="pq-section nes-container is-rounded">
        <h2>Pattern not found</h2>
        <p>No pattern or anti-pattern with specified id is catalogued.</p>
        <a class="nes-btn is-primary" href="index.html">Back to the Codex</a>
      </section>`;
    return;
  }

  const isAnti = pattern.type === "antipattern" || !!pattern.problem;
  const cat = getCategory(pattern.category) || { label: pattern.category || "General", badge: isAnti ? "is-error" : "is-primary" };
  if (document.getElementById("pattern-root") === root) {
    document.title = `${pattern.name || "Pattern"} — Pattern Book`;
  }

  let bodySectionsHtml = "";

  if (isAnti) {
    bodySectionsHtml = `
      ${pattern.problem ? section("Problem", "nes-icon close is-small", `<p style="color:#e76e55; font-weight:bold;">${pattern.problem}</p>`) : ""}
      ${pattern.context ? section("Context", "", `<p>${pattern.context}</p>`) : ""}
      ${pattern.forces && pattern.forces.length ? section("Forces", "", renderList(pattern.forces)) : ""}
      ${pattern.supposedSolution ? section("Supposed Solution (The Pitfall)", "nes-icon warning is-small", `<p>${pattern.supposedSolution}</p>`) : ""}
      ${pattern.refactoredSolution ? section("Refactored Solution (The Fix)", "nes-icon trophy is-small", `<p>${pattern.refactoredSolution}</p>`) : ""}
      ${pattern.example ? section("Example", "", `<p>${pattern.example}</p>`) : ""}
      ${pattern.implementations && pattern.implementations.length ? section("Sample Code & Refactoring", "", `<div id="impl-root"></div>`) : ""}
      ${pattern.related && pattern.related.length ? section("Related Patterns / Anti-Patterns", "", renderRelated(pattern.related)) : ""}
    `;
  } else {
    bodySectionsHtml = `
      ${pattern.intent ? section("Intent", "nes-icon trophy is-small", `<p>${pattern.intent}</p>`) : ""}
      ${pattern.motivation ? section("Motivation", "", `<p>${pattern.motivation}</p>`) : ""}
      ${pattern.applicability && pattern.applicability.length ? section("Applicability", "", renderList(pattern.applicability)) : ""}
      ${pattern.structureSvg ? section("Structure", "", `<div class="pq-structure-wrap">${pattern.structureSvg}</div>`) : ""}
      ${pattern.participants && pattern.participants.length ? section("Participants", "", renderParticipants(pattern.participants)) : ""}
      ${pattern.collaboration ? section("Collaboration", "", `<p>${pattern.collaboration}</p>`) : ""}
      ${pattern.consequences && pattern.consequences.length ? section("Consequences", "", renderList(pattern.consequences)) : ""}
      ${pattern.implementations && pattern.implementations.length ? section("Implementation", "", `<div id="impl-root"></div>`) : ""}
      ${pattern.knownUses && pattern.knownUses.length ? section("Known Uses", "", renderList(pattern.knownUses)) : ""}
      ${pattern.related && pattern.related.length ? section("Related Patterns", "", renderRelated(pattern.related)) : ""}
    `;
  }

  root.innerHTML = `
    <header class="pq-detail-head nes-container is-rounded" style="${isAnti ? "border-color: var(--pq-red);" : ""}">
      <span class="nes-badge"><span class="${cat.badge}">${cat.label}</span></span>
      ${isAnti ? `<span class="nes-badge" style="margin-left: 8px;"><span class="is-error">Anti-Pattern</span></span>` : ""}
      <h1 class="pixel-font" style="margin-top:12px; ${isAnti ? "color:#e76e55;" : ""}">${pattern.name || "Untitled"}</h1>
      <div class="pq-summary">${pattern.summary || ""}</div>
      <div class="pq-stars" style="margin-top:8px;">${starRatingSmall(pattern.difficulty || 1)} ${isAnti ? "severity" : "difficulty"}</div>
    </header>

    ${bodySectionsHtml}
  `;

  if (pattern.implementations && pattern.implementations.length) {
    const implRoot = root.querySelector("#impl-root") || document.getElementById("impl-root");
    if (implRoot) {
      implRoot.innerHTML = renderImplementation(pattern.implementations);
      wireImplementationTabs(implRoot);
    }
  }

  if (window.Prism) Prism.highlightAll();
}

function renderPattern() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  const pattern = getPattern(id);
  renderPatternDetail(pattern);
}

if (document.location.pathname.endsWith("pattern.html")) {
  renderPattern();
}