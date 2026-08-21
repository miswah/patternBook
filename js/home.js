/* Renders CATEGORIES + PATTERNS (from data.js) onto the home page. */

function starRating(n) {
  const max = 3;
  let out = "";
  for (let i = 0; i < max; i++) {
    out += i < n ? "★" : "☆";
  }
  return out;
}

function renderHome() {
  const root = document.getElementById("realms");

  CATEGORIES.forEach((cat) => {
    const patterns = patternsByCategory(cat.id);

    const section = document.createElement("section");
    section.className = "pq-realm";

    section.innerHTML = `
      <div class="pq-realm-head">
        <h2 class="pixel-font">${cat.label}</h2>
        <span class="nes-badge">
          <span class="${cat.badge}">${patterns.length} pattern${patterns.length === 1 ? "" : "s"}</span>
        </span>
      </div>
      <div class="pq-realm-blurb">${cat.blurb}</div>
      <div class="pq-grid"></div>
    `;

    const grid = section.querySelector(".pq-grid");

    if (patterns.length === 0) {
      grid.innerHTML = `<p style="font-size:11px;opacity:0.6;">No patterns catalogued here yet.</p>`;
    } else {
      patterns.forEach((p) => {
        const card = document.createElement("a");
        card.className = "pq-card nes-container is-rounded";
        card.href = `pattern.html?id=${p.id}`;
        card.innerHTML = `
          <h3>${p.name}</h3>
          <p>${p.summary}</p>
          <div class="pq-stars">${starRating(p.difficulty)}</div>
        `;
        grid.appendChild(card);
      });
    }

    root.appendChild(section);
  });
}

renderHome();