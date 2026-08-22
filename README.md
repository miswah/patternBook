# Pattern Book — Design Pattern & Anti-Pattern Codex

A static, dependency-free (vanilla JS) site for cataloguing design patterns and anti-patterns,
styled with [NES.css](https://nostalgic-css.github.io/NES.css/). No build
step, no framework — open `index.html` in a browser (or serve the folder)
and it works.

## Structure

```
index.html        Home page: patterns & anti-patterns grouped by realm (category)
pattern.html       Detail page: reads ?id=xxx and renders pattern/anti-pattern sections
add-pattern.html   Interactive form: builds Pattern & Anti-Pattern JS objects & JSON
css/style.css      Theme on top of NES.css (scanline background, UML styling, tabs)
js/data.js         <-- THE ONLY FILE YOU NEED TO EDIT to add entries
js/home.js         Renders home page codex realms from data.js
js/pattern.js       Renders detail pages from data.js
js/add-pattern.js   Powers the form switcher, JS/JSON generator, clipboard copy & live preview
```

## Adding Patterns & Anti-Patterns

You can use the built-in **Codex Entry Generator** at `add-pattern.html` (or click **+ Add New Pattern** on the home page):
1. Select **Design Pattern** or **Anti-Pattern**.
2. Fill out the fields interactively (or click **Load Example Pattern** / **Load Example Anti-Pattern** for a quick demo).
3. Click **Toggle Live Preview** to preview how it looks.
4. Click **Copy JS Object** to copy the formatted code directly to your clipboard and paste it into `PATTERNS` or `ANTIPATTERNS` in `js/data.js`.

---

### Data Shapes (`js/data.js`)

#### 1. Design Pattern Shape (`PATTERNS` array)

| Field             | Section on the page          | Type                          |
|-------------------|-------------------------------|--------------------------------|
| `intent`          | Intent                        | string                         |
| `motivation`       | Motivation                     | string                         |
| `applicability`    | Applicability                  | string[]                       |
| `structureSvg`     | Structure                      | raw SVG markup (string)        |
| `participants`     | Participants                   | `{name, desc}[]`               |
| `collaboration`    | Collaboration                  | string                         |
| `consequences`     | Consequences                   | string[]                       |
| `implementations`  | Implementation (tabs)          | `{language, classes: [{name, code}]}` |
| `knownUses`        | Known Uses                     | string[]                       |
| `related`          | Related Patterns               | array of pattern/anti-pattern `id`s |

Categories must be one of `CATEGORIES`: `creational`, `structural`, `behavioral`.

#### 2. Anti-Pattern Shape (`ANTIPATTERNS` array)

| Field                 | Section on the page              | Type                          |
|-----------------------|-----------------------------------|--------------------------------|
| `type`                | Must be `"antipattern"`          | string                         |
| `problem`             | Problem                           | string                         |
| `context`             | Context                           | string                         |
| `forces`              | Forces                            | string[]                       |
| `supposedSolution`    | Supposed Solution (The Pitfall)  | string                         |
| `refactoredSolution`  | Refactored Solution (The Fix)     | string                         |
| `example`             | Example Scenario                  | string                         |
| `implementations`     | Sample & Refactored Code          | `{language, classes: [{name, code}]}` |
| `related`             | Related Items                     | array of pattern/anti-pattern `id`s |

Categories must be one of `ANTI_CATEGORIES`: `arch-antipattern`, `design-antipattern`, `coding-antipattern`.

---

### Implementation shape (multi-language + multi-class/block tabs)

```js
implementations: [
  {
    language: "JavaScript",       // shown as a top-level tab
    classes: [
      { name: "AntiPattern_GodObject", code: "class OrderSystem { ... }" },
      { name: "Refactored_Solution", code: "class OrderProcessor { ... }" },
    ],
  },
]
```

Code blocks are syntax-highlighted with Prism. JavaScript, Java, and
Python are preconfigured in `pattern.js` (`LANG_PRISM_CLASS`).

---

## Notes

- Everything is loaded via `<script>` tags (no `fetch`/JSON), so the site works straight off the filesystem (`file://`) with zero local server setup.
- Includes worked design patterns (**Singleton**, **Adapter**, **Observer**) and anti-patterns (**God Object**, **Spaghetti Code**).