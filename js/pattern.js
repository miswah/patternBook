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

function renderPattern() {
  const root = document.getElementById("pattern-root");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const pattern = getPattern(id);

  if (!pattern) {
    root.innerHTML = `
      <section class="pq-section nes-container is-rounded">
        <h2>Pattern not found</h2>
        <p>No pattern with id "<code>${id || ""}</code>" is catalogued.</p>
        <a class="nes-btn is-primary" href="index.html">Back to the Codex</a>
      </section>`;
    return;
  }

  const cat = getCategory(pattern.category);
  document.title = `${pattern.name} — Pattern Book`;

  root.innerHTML = `
    <header class="pq-detail-head nes-container is-rounded">
      <span class="nes-badge"><span class="${cat.badge}">${cat.label}</span></span>
      <h1 class="pixel-font" style="margin-top:12px;">${pattern.name}</h1>
      <div class="pq-summary">${pattern.summary}</div>
      <div class="pq-stars" style="margin-top:8px;">${starRatingSmall(pattern.difficulty)} difficulty</div>
    </header>

    ${section("Intent", "nes-icon trophy is-small", `<p>${pattern.intent}</p>`)}
    ${section("Motivation", "", `<p>${pattern.motivation}</p>`)}
    ${section("Applicability", "", renderList(pattern.applicability))}
    ${section(
      "Structure",
      "",
      `<div class="pq-structure-wrap">${pattern.structureSvg}</div>`
    )}
    ${section("Participants", "", renderParticipants(pattern.participants))}
    ${section("Collaboration", "", `<p>${pattern.collaboration}</p>`)}
    ${section("Consequences", "", renderList(pattern.consequences))}
    ${section("Implementation", "", `<div id="impl-root"></div>`)}
    ${section("Known Uses", "", renderList(pattern.knownUses))}
    ${section("Related Patterns", "", renderRelated(pattern.related))}
  `;

  const implRoot = document.getElementById("impl-root");
  implRoot.innerHTML = renderImplementation(pattern.implementations);
  wireImplementationTabs(implRoot);

  if (window.Prism) Prism.highlightAll();
}

renderPattern();