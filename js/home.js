/* Renders CATEGORIES + PATTERNS (from data.js) onto the home page. */

function starRating(n) {
  const max = 3;
  let out = "";
  for (let i = 0; i < max; i++) {
    out += i < n ? "★" : "☆";
  }
  return out;
}

/* Renders CATEGORIES + PATTERNS & ANTI_CATEGORIES + ANTIPATTERNS onto the home page. */

function starRating(n) {
  const max = 3;
  let out = "";
  for (let i = 0; i < max; i++) {
    out += i < n ? "★" : "☆";
  }
  return out;
}

function renderRealmGroup(categoriesList, title, isAnti = false) {
  const root = document.getElementById("realms");

  const headerDiv = document.createElement("div");
  headerDiv.style.margin = "40px 0 20px";
  headerDiv.style.borderBottom = isAnti ? "4px dashed var(--pq-red)" : "4px double var(--pq-gold)";
  headerDiv.style.paddingBottom = "8px";
  headerDiv.innerHTML = `
    <h2 class="pixel-font" style="font-size: 16px; color: ${isAnti ? "var(--pq-red)" : "var(--pq-gold)"}; margin: 0;">
      ${title}
    </h2>
  `;
  root.appendChild(headerDiv);

  categoriesList.forEach((cat) => {
    const patterns = patternsByCategory(cat.id);

    const section = document.createElement("section");
    section.className = "pq-realm";

    section.innerHTML = `
      <div class="pq-realm-head">
        <h3 class="pixel-font" style="font-size:13px;">${cat.label}</h3>
        <span class="nes-badge">
          <span class="${cat.badge}">${patterns.length} ${isAnti ? "anti-pattern" : "pattern"}${patterns.length === 1 ? "" : "s"}</span>
        </span>
      </div>
      <div class="pq-realm-blurb">${cat.blurb}</div>
      <div class="pq-grid"></div>
    `;

    const grid = section.querySelector(".pq-grid");

    if (patterns.length === 0) {
      grid.innerHTML = `<p style="font-size:11px;opacity:0.6;">No ${isAnti ? "anti-patterns" : "patterns"} catalogued here yet.</p>`;
    } else {
      patterns.forEach((p) => {
        const card = document.createElement("a");
        card.className = "pq-card nes-container is-rounded";
        if (isAnti || p.type === "antipattern") {
          card.style.borderColor = "var(--pq-red)";
        }
        card.href = `pattern.html?id=${p.id}`;
        card.innerHTML = `
          <h3>${p.name} ${p.type === "antipattern" || isAnti ? `<span style="font-size:9px; color:var(--pq-red); float:right;">[ANTI]</span>` : ""}</h3>
          <p>${p.summary}</p>
          <div class="pq-stars">${starRating(p.difficulty)}</div>
        `;
        grid.appendChild(card);
      });
    }

    root.appendChild(section);
  });
}

function renderHome() {
  document.getElementById("realms").innerHTML = "";
  renderRealmGroup(CATEGORIES, "Design Patterns Codex", false);
  renderRealmGroup(ANTI_CATEGORIES, "Anti-Patterns Codex", true);
}

renderHome();