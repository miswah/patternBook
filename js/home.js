/* ============================================================
   Pattern Book — home.js
   ------------------------------------------------------------
   Renders the problem-oriented homepage with live search,
   quick problem filters, category selectors, decision matrix,
   and problem-focused pattern cards.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  let activeSearch = "";
  let activeType = "all"; // "all" | "pattern" | "antipattern"
  let activeCategory = "all";

  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-filter");
  const statsBar = document.getElementById("search-stats");
  const realmsContainer = document.getElementById("realms");

  const allCategories = [
    ...(typeof CATEGORIES !== "undefined" ? CATEGORIES : []),
    ...(typeof ANTI_CATEGORIES !== "undefined" ? ANTI_CATEGORIES : [])
  ];

  function getAllItems() {
    const patterns = (typeof PATTERNS !== "undefined" ? PATTERNS : []).map(p => ({ ...p, type: "pattern" }));
    const antipatterns = (typeof ANTIPATTERNS !== "undefined" ? ANTIPATTERNS : []).map(a => ({ ...a, type: "antipattern" }));
    return [...patterns, ...antipatterns];
  }

  function starRating(n) {
    const max = 3;
    let out = "";
    for (let i = 0; i < max; i++) {
      out += i < n ? "★" : "☆";
    }
    return out;
  }

  function matchesSearch(item, queryStr) {
    if (!queryStr) return true;
    const terms = queryStr.toLowerCase().split(/\s+/).filter(Boolean);
    
    const textPool = [
      item.id,
      item.name,
      item.summary,
      item.intent,
      item.problem,
      item.motivation,
      item.context,
      item.supposedSolution,
      item.refactoredSolution,
      item.category,
      Array.isArray(item.applicability) ? item.applicability.join(" ") : "",
      Array.isArray(item.forces) ? item.forces.join(" ") : "",
      Array.isArray(item.knownUses) ? item.knownUses.join(" ") : "",
    ].join(" ").toLowerCase();

    return terms.every(term => textPool.includes(term));
  }

  function filterItems() {
    const allItems = getAllItems();
    return allItems.filter(item => {
      // 1. Type filter
      if (activeType === "pattern" && item.type !== "pattern") return false;
      if (activeType === "antipattern" && item.type !== "antipattern") return false;

      // 2. Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) return false;

      // 3. Search query
      if (!matchesSearch(item, activeSearch)) return false;

      return true;
    });
  }

  function renderCard(item) {
    const isAnti = item.type === "antipattern" || !!item.problem;
    const cat = getCategory(item.category) || { label: item.category, badge: isAnti ? "is-error" : "is-primary" };

    const card = document.createElement("a");
    card.className = `pq-card nes-container is-rounded ${isAnti ? "pq-anti-card" : ""}`;
    card.href = `pattern.html?id=${item.id}`;

    const mainText = isAnti ? (item.problem || item.summary) : (item.intent || item.summary);
    const labelTag = isAnti ? `<span class="nes-badge"><span class="is-error">ANTI</span></span>` : `<span class="nes-badge"><span class="${cat.badge}">${cat.label}</span></span>`;

    card.innerHTML = `
      <div class="pq-card-header">
        <h3>${item.name}</h3>
        ${labelTag}
      </div>
      <div class="pq-card-problem-box ${isAnti ? "is-problem" : "is-solution"}">
        <strong>${isAnti ? "⚠️ Problem / Pitfall:" : "🎯 Solves / Intent:"}</strong>
        <p>${mainText}</p>
      </div>
      ${item.summary && mainText !== item.summary ? `<p class="pq-card-summary">${item.summary}</p>` : ""}
      <div class="pq-card-footer">
        <span class="pq-stars">${starRating(item.difficulty || 1)}</span>
        <span class="pq-card-link">View Solution &rarr;</span>
      </div>
    `;

    return card;
  }

  function renderHome() {
    const filtered = filterItems();
    const totalItems = getAllItems();
    const patternCount = filtered.filter(i => i.type === "pattern").length;
    const antiCount = filtered.filter(i => i.type === "antipattern").length;

    // Update Stats Bar
    if (activeSearch || activeType !== "all" || activeCategory !== "all") {
      statsBar.innerHTML = `Found <strong>${filtered.length}</strong> matching entries (${patternCount} Patterns, ${antiCount} Anti-Patterns) out of ${totalItems.length} total catalogued. <button type="button" id="clear-filters-btn" class="nes-btn is-error is-small" style="margin-left: 10px; font-size: 9px;">Clear Filters</button>`;
      const clearBtn = document.getElementById("clear-filters-btn");
      if (clearBtn) clearBtn.addEventListener("click", resetFilters);
    } else {
      statsBar.innerHTML = `Showing all <strong>${filtered.length}</strong> catalog entries (${patternCount} Design Patterns, ${antiCount} Anti-Patterns).`;
    }

    realmsContainer.innerHTML = "";

    if (filtered.length === 0) {
      realmsContainer.innerHTML = `
        <div class="nes-container is-rounded pq-empty-state">
          <p class="pixel-font" style="font-size: 13px; color: var(--pq-red);">No matching entries found!</p>
          <p style="font-size: 12px; margin-top: 10px;">No patterns or anti-patterns matched your search "<strong>${escapeHtml(activeSearch)}</strong>".</p>
          <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="nes-btn is-primary is-small" id="reset-search-btn">Reset Search</button>
            <a href="add-pattern.html" class="nes-btn is-success is-small">+ Add New Pattern</a>
          </div>
        </div>
      `;
      const resetBtn = document.getElementById("reset-search-btn");
      if (resetBtn) resetBtn.addEventListener("click", resetFilters);
      return;
    }

    // Group filtered items by category (realms)
    const activeCategories = allCategories.filter(cat => 
      filtered.some(item => item.category === cat.id)
    );

    activeCategories.forEach(cat => {
      const categoryItems = filtered.filter(item => item.category === cat.id);
      if (categoryItems.length === 0) return;

      const isAntiCategory = cat.badge === "is-error" || cat.id.includes("antipattern");

      const section = document.createElement("section");
      section.className = "pq-realm";

      section.innerHTML = `
        <div class="pq-realm-head">
          <h2 class="pixel-font" style="font-size:13px; color: ${isAntiCategory ? "var(--pq-red)" : "#fff"};">${cat.label}</h2>
          <span class="nes-badge">
            <span class="${cat.badge}">${categoryItems.length} ${isAntiCategory ? "anti-pattern" : "pattern"}${categoryItems.length === 1 ? "" : "s"}</span>
          </span>
        </div>
        <div class="pq-realm-blurb">${cat.blurb}</div>
        <div class="pq-grid"></div>
      `;

      const grid = section.querySelector(".pq-grid");
      categoryItems.forEach(item => {
        grid.appendChild(renderCard(item));
      });

      realmsContainer.appendChild(section);
    });
  }

  function resetFilters() {
    activeSearch = "";
    activeType = "all";
    activeCategory = "all";
    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "all";

    document.querySelectorAll(".pq-type-btn").forEach(btn => {
      btn.classList.toggle("is-primary", btn.dataset.type === "all");
      btn.classList.toggle("active", btn.dataset.type === "all");
    });

    renderHome();
  }

  function escapeHtml(str) {
    return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---- Event Listeners ----

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearch = e.target.value;
      renderHome();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      activeCategory = e.target.value;
      renderHome();
    });
  }

  // Type Filter Buttons
  document.querySelectorAll(".pq-type-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pq-type-btn").forEach(b => {
        b.classList.remove("is-primary", "active");
      });
      btn.classList.add("is-primary", "active");
      activeType = btn.dataset.type;
      renderHome();
    });
  });

  // Quick Problem Chips
  document.querySelectorAll(".pq-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const searchTerms = chip.dataset.search;
      searchInput.value = searchTerms;
      activeSearch = searchTerms;
      renderHome();
      searchInput.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Initial Render
  renderHome();

});