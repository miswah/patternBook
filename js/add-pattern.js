/* ============================================================
   Pattern Book — add-pattern.js
   ------------------------------------------------------------
   Manages the Add Pattern form, dynamic list items, JS/JSON code
   generation, clipboard copy, and live preview rendering.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ---- Helper UI Builders ----

  function createStringRow(containerId, placeholder, initialValue = "") {
    const container = document.getElementById(containerId);
    const row = document.createElement("div");
    row.className = "pq-dynamic-row";
    row.innerHTML = `
      <input type="text" class="nes-input" placeholder="${placeholder}" value="${escapeAttr(initialValue)}" />
      <button type="button" class="nes-btn is-error is-small remove-btn">×</button>
    `;
    row.querySelector(".remove-btn").addEventListener("click", () => row.remove());
    container.appendChild(row);
  }

  function createParticipantRow(initialName = "", initialDesc = "") {
    const container = document.getElementById("participants-list");
    const row = document.createElement("div");
    row.className = "pq-dynamic-row pq-participant-row";
    row.innerHTML = `
      <input type="text" class="nes-input part-name" placeholder="Participant Name (e.g. Creator)" value="${escapeAttr(initialName)}" />
      <input type="text" class="nes-input part-desc" placeholder="Description of role..." value="${escapeAttr(initialDesc)}" />
      <button type="button" class="nes-btn is-error is-small remove-btn">×</button>
    `;
    row.querySelector(".remove-btn").addEventListener("click", () => row.remove());
    container.appendChild(row);
  }

  function createImplementationBlock(lang = "JavaScript", classes = [{ name: "", code: "" }]) {
    const container = document.getElementById("implementations-list");
    const implBlock = document.createElement("div");
    implBlock.className = "nes-container is-rounded pq-impl-block";
    
    implBlock.innerHTML = `
      <div class="pq-impl-header">
        <div class="nes-field">
          <label>Language:</label>
          <input type="text" class="nes-input impl-lang" placeholder="e.g. JavaScript, Python, Java" value="${escapeAttr(lang)}" />
        </div>
        <button type="button" class="nes-btn is-error is-small remove-impl-btn">Remove Language</button>
      </div>
      <div class="classes-container" style="margin-top: 15px;">
        <label>Classes / Modules:</label>
        <div class="classes-list"></div>
        <button type="button" class="nes-btn is-normal is-small add-class-btn">+ Add Class</button>
      </div>
    `;

    const classesList = implBlock.querySelector(".classes-list");

    function addClassRow(clsName = "", clsCode = "") {
      const classRow = document.createElement("div");
      classRow.className = "pq-class-row nes-container";
      classRow.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
          <input type="text" class="nes-input cls-name" placeholder="Class/Interface Name (e.g. ConcreteCreator)" value="${escapeAttr(clsName)}" />
          <button type="button" class="nes-btn is-error is-small remove-class-btn">×</button>
        </div>
        <textarea class="nes-textarea cls-code" rows="6" placeholder="// Implementation code...">${escapeHtmlText(clsCode)}</textarea>
      `;
      classRow.querySelector(".remove-class-btn").addEventListener("click", () => classRow.remove());
      classesList.appendChild(classRow);
    }

    implBlock.querySelector(".add-class-btn").addEventListener("click", () => addClassRow());
    implBlock.querySelector(".remove-impl-btn").addEventListener("click", () => implBlock.remove());

    classes.forEach(c => addClassRow(c.name, c.code));

    container.appendChild(implBlock);
  }

  function escapeAttr(str) {
    return (str || "").replace(/"/g, "&quot;");
  }

  function escapeHtmlText(str) {
    return (str || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---- Initial Rows Setup ----

  document.getElementById("add-applicability-btn").addEventListener("click", () => {
    createStringRow("applicability-list", "e.g. Use when a class cannot anticipate the class of objects it must create.");
  });

  document.getElementById("add-participant-btn").addEventListener("click", () => {
    createParticipantRow();
  });

  document.getElementById("add-consequence-btn").addEventListener("click", () => {
    createStringRow("consequences-list", "e.g. Provides hooks for subclasses to extend internal behavior.");
  });

  document.getElementById("add-implementation-btn").addEventListener("click", () => {
    createImplementationBlock();
  });

  document.getElementById("add-known-use-btn").addEventListener("click", () => {
    createStringRow("known-uses-list", "e.g. java.util.Calendar.getInstance()");
  });

  document.getElementById("add-related-btn").addEventListener("click", () => {
    createStringRow("related-list", "e.g. singleton");
  });

  document.getElementById("insert-svg-template-btn").addEventListener("click", () => {
    const template = `<svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" class="uml-svg">\n  \${svgBox(40, 20, 150, 80, "Creator", "+ factoryMethod()")}\n  \${svgBox(230, 20, 150, 80, "Product", "+ doStuff()")}\n  <line x1="190" y1="60" x2="230" y2="60" class="uml-line" marker-end="url(#arrow)"/>\n  <defs>\n    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">\n      <path d="M0,0 L6,3 L0,6 Z" class="uml-arrowhead"/>\n    </marker>\n  </defs>\n</svg>`;
    document.getElementById("p-structureSvg").value = template;
  });

  // ---- Form Extraction & Output Formatting ----

  function extractPatternFromForm() {
    const getStringList = (containerId) => {
      const inputs = document.querySelectorAll(`#${containerId} input`);
      return Array.from(inputs).map(i => i.value.trim()).filter(Boolean);
    };

    const participants = Array.from(document.querySelectorAll("#participants-list .pq-participant-row")).map(row => {
      const name = row.querySelector(".part-name").value.trim();
      const desc = row.querySelector(".part-desc").value.trim();
      return name || desc ? { name, desc } : null;
    }).filter(Boolean);

    const implementations = Array.from(document.querySelectorAll("#implementations-list .pq-impl-block")).map(block => {
      const language = block.querySelector(".impl-lang").value.trim();
      const classes = Array.from(block.querySelectorAll(".pq-class-row")).map(cRow => {
        const name = cRow.querySelector(".cls-name").value.trim();
        const code = cRow.querySelector(".cls-code").value;
        return name || code ? { name, code } : null;
      }).filter(Boolean);
      return language || classes.length ? { language, classes } : null;
    }).filter(Boolean);

    return {
      id: document.getElementById("p-id").value.trim() || "my-pattern",
      name: document.getElementById("p-name").value.trim() || "My Pattern",
      category: document.getElementById("p-category").value,
      difficulty: parseInt(document.getElementById("p-difficulty").value, 10) || 1,
      summary: document.getElementById("p-summary").value.trim(),
      intent: document.getElementById("p-intent").value.trim(),
      motivation: document.getElementById("p-motivation").value.trim(),
      applicability: getStringList("applicability-list"),
      structureSvg: document.getElementById("p-structureSvg").value.trim(),
      participants,
      collaboration: document.getElementById("p-collaboration").value.trim(),
      consequences: getStringList("consequences-list"),
      implementations,
      knownUses: getStringList("known-uses-list"),
      related: getStringList("related-list"),
    };
  }

  function formatJsObject(obj) {
    const formatString = (str) => {
      if (!str) return '""';
      if (str.includes('\n') || str.includes('"')) {
        return `\`${str.replace(/`/g, '\\`')}\``;
      }
      return JSON.stringify(str);
    };

    const formatArrayOfStrings = (arr, indent = '    ') => {
      if (!arr || arr.length === 0) return '[]';
      const items = arr.map(s => `${indent}  ${formatString(s)},`).join('\n');
      return `[\n${items}\n${indent}]`;
    };

    const formatParticipants = (parts) => {
      if (!parts || parts.length === 0) return '[]';
      const items = parts.map(p => 
        `    { name: ${JSON.stringify(p.name)}, desc: ${formatString(p.desc)} },`
      ).join('\n');
      return `[\n${items}\n  ]`;
    };

    const formatImplementations = (impls) => {
      if (!impls || impls.length === 0) return '[]';
      const implBlocks = impls.map(impl => {
        const classesCode = impl.classes.map(c => {
          const codeFormatted = c.code.includes('\n')
            ? `\`\n${c.code}\``
            : formatString(c.code);
          return `          {\n            name: ${JSON.stringify(c.name)},\n            code:\n${codeFormatted},\n          }`;
        }).join(',\n');

        return `    {\n      language: ${JSON.stringify(impl.language)},\n      classes: [\n${classesCode}\n      ],\n    }`;
      }).join(',\n');

      return `[\n${implBlocks}\n  ]`;
    };

    let js = `{\n`;
    js += `  id: ${JSON.stringify(obj.id)},\n`;
    js += `  name: ${JSON.stringify(obj.name)},\n`;
    js += `  category: ${JSON.stringify(obj.category)},\n`;
    js += `  difficulty: ${obj.difficulty},\n`;
    js += `  summary: ${formatString(obj.summary)},\n`;
    js += `  intent:\n    ${formatString(obj.intent)},\n`;
    js += `  motivation:\n    ${formatString(obj.motivation)},\n`;
    js += `  applicability: ${formatArrayOfStrings(obj.applicability, '  ')},\n`;
    if (obj.structureSvg) {
      js += `  structureSvg: ${formatString(obj.structureSvg)},\n`;
    }
    js += `  participants: ${formatParticipants(obj.participants)},\n`;
    js += `  collaboration:\n    ${formatString(obj.collaboration)},\n`;
    js += `  consequences: ${formatArrayOfStrings(obj.consequences, '  ')},\n`;
    js += `  implementations: ${formatImplementations(obj.implementations)},\n`;
    if (obj.knownUses && obj.knownUses.length) {
      js += `  knownUses: ${formatArrayOfStrings(obj.knownUses, '  ')},\n`;
    }
    if (obj.related && obj.related.length) {
      js += `  related: ${JSON.stringify(obj.related)},\n`;
    }
    js += `}`;
    return js;
  }

  // ---- Generation & Actions ----

  let currentPattern = null;

  function updateOutput() {
    currentPattern = extractPatternFromForm();
    const jsCode = formatJsObject(currentPattern);
    const codeEl = document.getElementById("output-code");
    codeEl.textContent = jsCode;
    if (window.Prism) Prism.highlightElement(codeEl);

    // Update preview if active
    const previewContainer = document.getElementById("preview-container");
    if (previewContainer.style.display !== "none") {
      renderPatternDetail(currentPattern, document.getElementById("pattern-root"));
    }
  }

  document.getElementById("generate-btn").addEventListener("click", () => {
    updateOutput();
    document.getElementById("output-section").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("toggle-preview-btn").addEventListener("click", () => {
    const previewContainer = document.getElementById("preview-container");
    if (previewContainer.style.display === "none") {
      previewContainer.style.display = "block";
      updateOutput();
      renderPatternDetail(currentPattern, document.getElementById("pattern-root"));
    } else {
      previewContainer.style.display = "none";
    }
  });

  // ---- Clipboard Copying ----

  function setCopyStatus(msg, isSuccess = true) {
    const statusEl = document.getElementById("copy-status");
    statusEl.textContent = msg;
    statusEl.style.color = isSuccess ? "var(--pq-green)" : "var(--pq-red)";
    setTimeout(() => {
      statusEl.textContent = "";
    }, 3500);
  }

  document.getElementById("copy-js-btn").addEventListener("click", () => {
    updateOutput();
    const jsCode = formatJsObject(currentPattern);
    navigator.clipboard.writeText(jsCode).then(() => {
      setCopyStatus("✓ Copied JS Object to clipboard!");
    }).catch(err => {
      setCopyStatus("Failed to copy automatically. Please copy from code box.", false);
    });
  });

  document.getElementById("copy-json-btn").addEventListener("click", () => {
    updateOutput();
    const jsonStr = JSON.stringify(currentPattern, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopyStatus("✓ Copied JSON to clipboard!");
    }).catch(err => {
      setCopyStatus("Failed to copy automatically.", false);
    });
  });

  // ---- Load Example & Reset ----

  function clearForm() {
    document.getElementById("pattern-form").reset();
    document.getElementById("applicability-list").innerHTML = "";
    document.getElementById("participants-list").innerHTML = "";
    document.getElementById("consequences-list").innerHTML = "";
    document.getElementById("implementations-list").innerHTML = "";
    document.getElementById("known-uses-list").innerHTML = "";
    document.getElementById("related-list").innerHTML = "";
    document.getElementById("output-code").textContent = '// Complete the form above and click "Generate Pattern Code"...';
    document.getElementById("preview-container").style.display = "none";
  }

  document.getElementById("reset-btn").addEventListener("click", () => {
    clearForm();
    initDefaults();
  });

  document.getElementById("load-example-btn").addEventListener("click", () => {
    clearForm();
    document.getElementById("p-id").value = "factory-method";
    document.getElementById("p-name").value = "Factory Method";
    document.getElementById("p-category").value = "creational";
    document.getElementById("p-difficulty").value = "2";
    document.getElementById("p-summary").value = "Define an interface for creating an object, but let subclasses decide which class to instantiate.";
    document.getElementById("p-intent").value = "Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.";
    document.getElementById("p-motivation").value = "A framework needs to standardize the architectural model for a range of applications, but allows individual applications to instantiate their own specific objects. Factory Method solves this by encapsulating object creation.";

    createStringRow("applicability-list", "", "A class cannot anticipate the class of objects it must create.");
    createStringRow("applicability-list", "", "A class wants its subclasses to specify the objects it creates.");

    document.getElementById("p-structureSvg").value = `<svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" class="uml-svg">\n  \${svgBox(40, 20, 150, 80, "Creator", "+ factoryMethod()")}\n  \${svgBox(230, 20, 150, 80, "Product", "+ doStuff()")}\n  <line x1="190" y1="60" x2="230" y2="60" class="uml-line" marker-end="url(#arrow)"/>\n  <defs>\n    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">\n      <path d="M0,0 L6,3 L0,6 Z" class="uml-arrowhead"/>\n    </marker>\n  </defs>\n</svg>`;

    createParticipantRow("Product", "Defines the interface of objects the factory method creates.");
    createParticipantRow("Creator", "Declares the factory method, which returns an object of type Product.");

    document.getElementById("p-collaboration").value = "Creator relies on its subclasses to define the factory method so that it returns an instance of the appropriate ConcreteProduct.";

    createStringRow("consequences-list", "", "Eliminates the need to bind application-specific classes into your code.");
    createStringRow("consequences-list", "", "Provides hooks for subclasses to extend internal behavior.");

    createImplementationBlock("JavaScript", [
      {
        name: "Creator",
        code: `class Dialog {\n  createButton() {\n    throw new Error("Factory method must be overridden");\n  }\n\n  render() {\n    const okButton = this.createButton();\n    okButton.onClick();\n  }\n}`
      },
      {
        name: "ConcreteCreator",
        code: `class WindowsDialog extends Dialog {\n  createButton() {\n    return new WindowsButton();\n  }\n}`
      }
    ]);

    createStringRow("known-uses-list", "", "UI toolkit framework rendering dialogs and buttons.");
    createStringRow("related-list", "", "singleton");

    updateOutput();
  });

  function initDefaults() {
    createStringRow("applicability-list", "e.g. When exact types of objects aren't known beforehand.");
    createParticipantRow();
    createStringRow("consequences-list", "e.g. Decouples code from concrete classes.");
    createImplementationBlock();
    createStringRow("known-uses-list", "e.g. Document editor frameworks.");
  }

  initDefaults();

});
