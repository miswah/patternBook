/* ============================================================
   Pattern Book — add-pattern.js
   ------------------------------------------------------------
   Manages the Pattern & Anti-Pattern form, entry type switching,
   dynamic list items, JS/JSON code generation, clipboard copy,
   and live preview rendering.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ---- Categories Configuration ----
  const DESIGN_CATS = typeof CATEGORIES !== "undefined" ? CATEGORIES : [
    { id: "creational", label: "Creational Realm" },
    { id: "structural", label: "Structural Realm" },
    { id: "behavioral", label: "Behavioral Realm" }
  ];

  const ANTI_CATS = typeof ANTI_CATEGORIES !== "undefined" ? ANTI_CATEGORIES : [
    { id: "arch-antipattern", label: "Architectural Anti-Patterns" },
    { id: "design-antipattern", label: "Design Anti-Patterns" },
    { id: "coding-antipattern", label: "Coding Anti-Patterns" }
  ];

  function updateCategoryOptions(isAnti) {
    const select = document.getElementById("p-category");
    select.innerHTML = "";
    const list = isAnti ? ANTI_CATS : DESIGN_CATS;
    list.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.label;
      select.appendChild(opt);
    });
    
    const diffLabel = document.getElementById("p-difficulty-label");
    if (diffLabel) {
      diffLabel.textContent = isAnti ? "Severity (1 - 3 Stars):" : "Difficulty (1 - 3 Stars):";
    }
  }

  // ---- Entry Type Switcher ----
  const entryTypeRadios = document.getElementsByName("entry-type");

  function getEntryType() {
    for (const r of entryTypeRadios) {
      if (r.checked) return r.value;
    }
    return "pattern";
  }

  function handleTypeChange() {
    const isAnti = getEntryType() === "antipattern";
    document.getElementById("pattern-fields-wrap").style.display = isAnti ? "none" : "block";
    document.getElementById("antipattern-fields-wrap").style.display = isAnti ? "block" : "none";
    updateCategoryOptions(isAnti);
  }

  entryTypeRadios.forEach(r => r.addEventListener("change", handleTypeChange));
  updateCategoryOptions(false);

  // ---- Helper UI Builders ----

  function createStringRow(containerId, placeholder, initialValue = "") {
    const container = document.getElementById(containerId);
    if (!container) return;
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
    if (!container) return;
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
    if (!container) return;
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
        <label>Classes / Modules / Code Blocks:</label>
        <div class="classes-list"></div>
        <button type="button" class="nes-btn is-normal is-small add-class-btn">+ Add Code Block</button>
      </div>
    `;

    const classesList = implBlock.querySelector(".classes-list");

    function addClassRow(clsName = "", clsCode = "") {
      const classRow = document.createElement("div");
      classRow.className = "pq-class-row nes-container";
      classRow.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
          <input type="text" class="nes-input cls-name" placeholder="Block Title (e.g. AntiPattern_Code / Refactored_Code)" value="${escapeAttr(clsName)}" />
          <button type="button" class="nes-btn is-error is-small remove-class-btn">×</button>
        </div>
        <textarea class="nes-textarea cls-code" rows="6" placeholder="// Code sample...">${escapeHtmlText(clsCode)}</textarea>
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

  // ---- Dynamic Add Event Listeners ----

  document.getElementById("add-applicability-btn").addEventListener("click", () => {
    createStringRow("applicability-list", "e.g. Use when a class cannot anticipate the class of objects it must create.");
  });

  document.getElementById("add-participant-btn").addEventListener("click", () => {
    createParticipantRow();
  });

  document.getElementById("add-consequence-btn").addEventListener("click", () => {
    createStringRow("consequences-list", "e.g. Provides hooks for subclasses to extend internal behavior.");
  });

  const addForceBtn = document.getElementById("add-force-btn");
  if (addForceBtn) {
    addForceBtn.addEventListener("click", () => {
      createStringRow("forces-list", "e.g. Time pressure leads to adding methods to existing central class.");
    });
  }

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

  function extractFromForm() {
    const entryType = getEntryType();
    const isAnti = entryType === "antipattern";

    const getStringList = (containerId) => {
      const inputs = document.querySelectorAll(`#${containerId} input`);
      return Array.from(inputs).map(i => i.value.trim()).filter(Boolean);
    };

    const implementations = Array.from(document.querySelectorAll("#implementations-list .pq-impl-block")).map(block => {
      const language = block.querySelector(".impl-lang").value.trim();
      const classes = Array.from(block.querySelectorAll(".pq-class-row")).map(cRow => {
        const name = cRow.querySelector(".cls-name").value.trim();
        const code = cRow.querySelector(".cls-code").value;
        return name || code ? { name, code } : null;
      }).filter(Boolean);
      return language || classes.length ? { language, classes } : null;
    }).filter(Boolean);

    const baseObj = {
      id: document.getElementById("p-id").value.trim() || (isAnti ? "my-antipattern" : "my-pattern"),
      name: document.getElementById("p-name").value.trim() || (isAnti ? "My Anti-Pattern" : "My Pattern"),
      category: document.getElementById("p-category").value,
      difficulty: parseInt(document.getElementById("p-difficulty").value, 10) || 1,
      summary: document.getElementById("p-summary").value.trim(),
    };

    if (isAnti) {
      return {
        type: "antipattern",
        ...baseObj,
        problem: document.getElementById("ap-problem").value.trim(),
        context: document.getElementById("ap-context").value.trim(),
        forces: getStringList("forces-list"),
        supposedSolution: document.getElementById("ap-supposed").value.trim(),
        refactoredSolution: document.getElementById("ap-refactored").value.trim(),
        example: document.getElementById("ap-example").value.trim(),
        implementations,
        related: getStringList("related-list"),
      };
    } else {
      const participants = Array.from(document.querySelectorAll("#participants-list .pq-participant-row")).map(row => {
        const name = row.querySelector(".part-name").value.trim();
        const desc = row.querySelector(".part-desc").value.trim();
        return name || desc ? { name, desc } : null;
      }).filter(Boolean);

      return {
        ...baseObj,
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
  }

  function formatJsObject(obj) {
    const isAnti = obj.type === "antipattern";

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
    if (isAnti) {
      js += `  type: "antipattern",\n`;
    }
    js += `  id: ${JSON.stringify(obj.id)},\n`;
    js += `  name: ${JSON.stringify(obj.name)},\n`;
    js += `  category: ${JSON.stringify(obj.category)},\n`;
    js += `  difficulty: ${obj.difficulty},\n`;
    js += `  summary: ${formatString(obj.summary)},\n`;

    if (isAnti) {
      js += `  problem:\n    ${formatString(obj.problem)},\n`;
      js += `  context:\n    ${formatString(obj.context)},\n`;
      js += `  forces: ${formatArrayOfStrings(obj.forces, '  ')},\n`;
      js += `  supposedSolution:\n    ${formatString(obj.supposedSolution)},\n`;
      js += `  refactoredSolution:\n    ${formatString(obj.refactoredSolution)},\n`;
      js += `  example:\n    ${formatString(obj.example)},\n`;
    } else {
      js += `  intent:\n    ${formatString(obj.intent)},\n`;
      js += `  motivation:\n    ${formatString(obj.motivation)},\n`;
      js += `  applicability: ${formatArrayOfStrings(obj.applicability, '  ')},\n`;
      if (obj.structureSvg) {
        js += `  structureSvg: ${formatString(obj.structureSvg)},\n`;
      }
      js += `  participants: ${formatParticipants(obj.participants)},\n`;
      js += `  collaboration:\n    ${formatString(obj.collaboration)},\n`;
      js += `  consequences: ${formatArrayOfStrings(obj.consequences, '  ')},\n`;
    }

    js += `  implementations: ${formatImplementations(obj.implementations)},\n`;

    if (!isAnti && obj.knownUses && obj.knownUses.length) {
      js += `  knownUses: ${formatArrayOfStrings(obj.knownUses, '  ')},\n`;
    }
    if (obj.related && obj.related.length) {
      js += `  related: ${JSON.stringify(obj.related)},\n`;
    }
    js += `}`;
    return js;
  }

  // ---- Generation & Actions ----

  let currentObj = null;

  function updateOutput() {
    currentObj = extractFromForm();
    const jsCode = formatJsObject(currentObj);
    const codeEl = document.getElementById("output-code");
    codeEl.textContent = jsCode;
    if (window.Prism) Prism.highlightElement(codeEl);

    // Update preview if active
    const previewContainer = document.getElementById("preview-container");
    if (previewContainer.style.display !== "none") {
      renderPatternDetail(currentObj, document.getElementById("pattern-root"));
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
      renderPatternDetail(currentObj, document.getElementById("pattern-root"));
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
    const jsCode = formatJsObject(currentObj);
    navigator.clipboard.writeText(jsCode).then(() => {
      const targetArray = currentObj.type === "antipattern" ? "ANTIPATTERNS" : "PATTERNS";
      setCopyStatus(`✓ Copied JS Object (paste into ${targetArray} in data.js)!`);
    }).catch(err => {
      setCopyStatus("Failed to copy automatically. Please copy from code box.", false);
    });
  });

  document.getElementById("copy-json-btn").addEventListener("click", () => {
    updateOutput();
    const jsonStr = JSON.stringify(currentObj, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopyStatus("✓ Copied JSON to clipboard!");
    }).catch(err => {
      setCopyStatus("Failed to copy automatically.", false);
    });
  });

  // ---- Form Reset & Example Loaders ----

  function clearForm() {
    document.getElementById("pattern-form").reset();
    document.getElementById("applicability-list").innerHTML = "";
    document.getElementById("participants-list").innerHTML = "";
    document.getElementById("consequences-list").innerHTML = "";
    const forcesList = document.getElementById("forces-list");
    if (forcesList) forcesList.innerHTML = "";
    document.getElementById("implementations-list").innerHTML = "";
    const knownUsesList = document.getElementById("known-uses-list");
    if (knownUsesList) knownUsesList.innerHTML = "";
    document.getElementById("related-list").innerHTML = "";
    document.getElementById("output-code").textContent = '// Complete the form above and click "Generate Code"...';
    document.getElementById("preview-container").style.display = "none";
  }

  document.getElementById("reset-btn").addEventListener("click", () => {
    clearForm();
    handleTypeChange();
  });

  document.getElementById("load-example-pattern-btn").addEventListener("click", () => {
    clearForm();
    document.querySelector('input[name="entry-type"][value="pattern"]').checked = true;
    handleTypeChange();

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

  const loadExampleAntiBtn = document.getElementById("load-example-antipattern-btn");
  if (loadExampleAntiBtn) {
    loadExampleAntiBtn.addEventListener("click", () => {
      clearForm();
      document.querySelector('input[name="entry-type"][value="antipattern"]').checked = true;
      handleTypeChange();

      document.getElementById("p-id").value = "god-object";
      document.getElementById("p-name").value = "God Object (The Blob)";
      document.getElementById("p-category").value = "design-antipattern";
      document.getElementById("p-difficulty").value = "3";
      document.getElementById("p-summary").value = "A single class that handles too many responsibilities, concentrating business logic into a monolithic entity.";
      document.getElementById("ap-problem").value = "An object knows too much or does too much, monopolizing execution and reducing other classes to simple passive data holders.";
      document.getElementById("ap-context").value = "As software grows under deadline pressure, developers keep adding methods and fields to an existing central manager class instead of designing proper abstractions.";
      
      createStringRow("forces-list", "", "Quick feature additions seem faster by modifying a large existing class.");
      createStringRow("forces-list", "", "Lack of clear domain boundaries and responsibility separation.");

      document.getElementById("ap-supposed").value = "Centralizing all control in one 'God' manager class (e.g. SystemManager, AppController) so everything is accessible in one place.";
      document.getElementById("ap-refactored").value = "Extract responsibilities using Single Responsibility Principle (SRP). Split the Blob into smaller, cohesive classes and delegate behavior using patterns like Command, Strategy, or Observer.";
      document.getElementById("ap-example").value = "An OrderProcessor class that validates user input, calculates taxes, connects to MySQL, formats HTML receipts, and sends email notifications.";

      createImplementationBlock("JavaScript", [
        {
          name: "AntiPattern_GodObject",
          code: `// ANTIPATTERN: God Object doing everything\nclass OrderSystem {\n  processOrder(order) {\n    this.validateOrder(order);\n    this.calculateTax(order);\n    this.saveToDatabase(order);\n    this.chargeCreditCard(order);\n    this.sendEmailReceipt(order);\n  }\n}`
        },
        {
          name: "Refactored_Solution",
          code: `// REFACTORED: Delegated single-responsibility classes\nclass OrderProcessor {\n  constructor(validator, db, paymentGateway, notifier) {\n    this.validator = validator;\n    this.db = db;\n    this.paymentGateway = paymentGateway;\n    this.notifier = notifier;\n  }\n  process(order) {\n    this.validator.validate(order);\n    this.db.save(order);\n    this.paymentGateway.charge(order);\n    this.notifier.sendReceipt(order);\n  }\n}`
        }
      ]);

      createStringRow("related-list", "", "singleton");

      updateOutput();
    });
  }

  // Initial defaults
  createStringRow("applicability-list", "e.g. When exact types of objects aren't known beforehand.");
  createParticipantRow();
  createStringRow("consequences-list", "e.g. Decouples code from concrete classes.");
  createImplementationBlock();
  createStringRow("known-uses-list", "e.g. Document editor frameworks.");

});
