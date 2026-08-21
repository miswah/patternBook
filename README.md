# Pattern Book — a design pattern codex

A static, dependency-free (vanilla JS) site for cataloguing design patterns,
styled with [NES.css](https://nostalgic-css.github.io/NES.css/). No build
step, no framework — open `index.html` in a browser (or serve the folder)
and it works.

## Structure

```
index.html        Home page: patterns grouped by realm (category)
pattern.html       Detail page: reads ?id=xxx and renders every section
css/style.css      Theme on top of NES.css (scanline background, UML
                    diagram styling, language/class tab styling)
js/data.js         <-- THE ONLY FILE YOU NEED TO EDIT to add patterns
js/home.js         Renders the home page from data.js
js/pattern.js       Renders the detail page from data.js
```

## Adding a new pattern

Open `js/data.js` and add an object to the `PATTERNS` array. Copy the
`adapter` or `observer` entry as a starting template — every field maps
1:1 onto a section of the detail page:

| Field             | Section on the page          | Type                          |
|-------------------|-------------------------------|--------------------------------|
| `intent`          | Intent                        | string                         |
| `motivation`       | Motivation                     | string                         |
| `applicability`    | Applicability                  | string[]                       |
| `structureSvg`     | Structure                      | raw SVG markup (string)        |
| `participants`     | Participants                   | `{name, desc}[]`               |
| `collaboration`    | Collaboration                  | string                         |
| `consequences`     | Consequences                   | string[]                       |
| `implementations`  | Implementation (tabs)          | see below                      |
| `knownUses`        | Known Uses                     | string[]                       |
| `related`          | Related Patterns               | array of other pattern `id`s   |

`category` must be one of the ids in `CATEGORIES` (`creational`,
`structural`, `behavioral`) — add a new realm there if you need one.

### Implementation shape (multi-language + multi-class tabs)

```js
implementations: [
  {
    language: "JavaScript",       // shown as a top-level tab
    classes: [
      { name: "Subject", code: "class Subject { ... }" },
      { name: "ConcreteSubject", code: "class ConcreteSubject ... " },
      // one class -> no sub-tabs shown, just the code
      // 2+ classes -> sub-tabs appear under the language tab
    ],
  },
  {
    language: "Python",
    classes: [ /* ... */ ],
  },
],
```

Code blocks are syntax-highlighted with Prism. JavaScript, Java, and
Python are wired up in `pattern.js` (`LANG_PRISM_CLASS`) — add a line
there (and load the matching Prism component script in `pattern.html`)
for any other language you use.

### Structure diagrams

`structureSvg` is raw SVG, styled by the `.uml-*` classes in
`style.css` so every diagram looks consistent. There's a small
`svgBox(x, y, w, h, label, sub)` helper at the top of `data.js` for
drawing a class box quickly — see the existing three patterns for
worked examples of composing boxes, lines, and arrowheads. If you'd
rather draw diagrams in a real tool, export as SVG and paste the
markup in directly (or swap `structureSvg` for an `<img src="...">` —
the wrapper `.pq-structure-wrap` div works with either).

## Notes

- Everything is loaded via `<script>` tags (no `fetch`/JSON), so the
  site works straight off the filesystem (`file://`) with no local
  server required.
- NES.css, Google Fonts, and Prism are loaded from CDNs — an internet
  connection is needed the first time each page loads.
- Three fully worked patterns are included as a template: **Singleton**
  (Creational), **Adapter** (Structural), **Observer** (Behavioral).