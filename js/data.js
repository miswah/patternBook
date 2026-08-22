/* ============================================================
   Pattern Book — data.js
   ------------------------------------------------------------
   This is the ONLY file you need to touch to add a new pattern.
   Copy an existing entry in PATTERNS, change the id, and fill
   in your own content. Every field is plain text or an array of
   strings, except `structureSvg` (raw SVG markup) and
   `implementations` (see the Observer entry below for the full
   shape, including multiple languages and multiple classes).
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

// ---- Small reusable SVG helper bits (kept inline so the whole
// site works from the file system with zero build step).
const svgBox = (x, y, w, h, label, sub) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" class="uml-box"/>
    <line x1="${x}" y1="${y + 26}" x2="${x + w}" y2="${y + 26}" class="uml-line"/>
    <text x="${x + w / 2}" y="${y + 18}" class="uml-title" text-anchor="middle">${label}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h - 10}" class="uml-sub" text-anchor="middle">${sub}</text>` : ""}
  </g>`;

const PATTERNS = [
  // ============================================================
  // SINGLETON — Creational
  // ============================================================
  {
    id: "singleton",
    name: "Singleton",
    category: "creational",
    difficulty: 1,
    summary: "Ensure a class has only one instance, and provide a global point of access to it.",
    intent:
      "Ensure a class only ever has one instance, and provide a single, well-known access point to that instance from anywhere in the program.",
    motivation:
      "Some objects only need to exist once: a print spooler, a configuration store, a connection pool. Passing that one object around through every constructor is clumsy, and using a global variable doesn't stop someone from creating a second instance by accident. Singleton solves both problems: the class itself is responsible for tracking its sole instance and can intercept requests to create new ones.",
    applicability: [
      "There must be exactly one instance of a class, and it must be reachable from a well-known access point.",
      "The sole instance should be extensible by subclassing, and clients should be able to use the extended instance without changing their code.",
      "Lazy initialization is desirable — the instance shouldn't be created until it's first needed.",
    ],
    structureSvg: `
      <svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" class="uml-svg">
        ${svgBox(140, 20, 160, 90, "Singleton", "-instance : Singleton")}
        <text x="150" y="90" class="uml-method">+ getInstance()</text>
        <text x="150" y="106" class="uml-method">+ singletonOperation()</text>
        <line x1="220" y1="110" x2="220" y2="150" class="uml-arrow-self" marker-end="url(#arrow)"/>
        <path d="M220,150 C160,170 160,60 190,45" class="uml-arrow-self" fill="none" marker-end="url(#arrow)"/>
        <text x="60" y="165" class="uml-note">calls getInstance() on itself to create/return the one instance</text>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" class="uml-arrowhead"/>
          </marker>
        </defs>
      </svg>`,
    participants: [
      { name: "Singleton", desc: "Defines the getInstance() operation that lets clients access its unique instance. Responsible for creating and holding its own sole instance." },
    ],
    collaboration:
      "Clients access the Singleton instance exclusively through the class's getInstance() operation. They never call a public constructor directly.",
    consequences: [
      "Controlled access to the sole instance, since the class encapsulates it.",
      "Reduced namespace pollution compared to global variables.",
      "Permits refinement — the Singleton class can be subclassed, and the app can be configured with an instance of the extended class at runtime.",
      "Permits a variable number of instances if requirements change later, since the access mechanism is already encapsulated.",
      "Can make unit testing harder, since the single shared instance carries state across tests unless explicitly reset.",
    ],
    implementations: [
      {
        language: "JavaScript",
        classes: [
          {
            name: "Singleton",
            code:
`class Singleton {
  static #instance;

  constructor() {
    if (Singleton.#instance) {
      throw new Error("Use Singleton.getInstance()");
    }
    this.createdAt = Date.now();
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }

  singletonOperation() {
    return \`instance created at \${this.createdAt}\`;
  }
}

// usage
const a = Singleton.getInstance();
const b = Singleton.getInstance();
console.log(a === b); // true`,
          },
        ],
      },
      {
        language: "Java",
        classes: [
          {
            name: "Singleton",
            code:
`public final class Singleton {
    private static volatile Singleton instance;
    private final long createdAt;

    private Singleton() {
        this.createdAt = System.currentTimeMillis();
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public long singletonOperation() {
        return createdAt;
    }
}`,
          },
        ],
      },
      {
        language: "Python",
        classes: [
          {
            name: "Singleton",
            code:
`class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.created_at = None
        return cls._instance

    def singleton_operation(self):
        return f"instance id: {id(self)}"


a = Singleton()
b = Singleton()
assert a is b`,
          },
        ],
      },
    ],
    knownUses: [
      "Runtime environments that expose a single logging service instance.",
      "Application-wide configuration objects loaded once from disk or environment variables.",
      "Connection pool managers, where creating a second pool would waste resources.",
    ],
    related: ["adapter"],
  }, {
    id: "singleton",
    name: "Singleton",
    category: "creational",
    difficulty: 1,
    summary: "Ensure a class has only one instance, and provide a global point of access to it.",
    intent:
      "Ensure a class only ever has one instance, and provide a single, well-known access point to that instance from anywhere in the program.",
    motivation:
      "Some objects only need to exist once: a print spooler, a configuration store, a connection pool. Passing that one object around through every constructor is clumsy, and using a global variable doesn't stop someone from creating a second instance by accident. Singleton solves both problems: the class itself is responsible for tracking its sole instance and can intercept requests to create new ones.",
    applicability: [
      "There must be exactly one instance of a class, and it must be reachable from a well-known access point.",
      "The sole instance should be extensible by subclassing, and clients should be able to use the extended instance without changing their code.",
      "Lazy initialization is desirable — the instance shouldn't be created until it's first needed.",
    ],
    structureSvg: `
      <svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg" class="uml-svg">
        ${svgBox(140, 20, 160, 90, "Singleton", "-instance : Singleton")}
        <text x="150" y="90" class="uml-method">+ getInstance()</text>
        <text x="150" y="106" class="uml-method">+ singletonOperation()</text>
        <line x1="220" y1="110" x2="220" y2="150" class="uml-arrow-self" marker-end="url(#arrow)"/>
        <path d="M220,150 C160,170 160,60 190,45" class="uml-arrow-self" fill="none" marker-end="url(#arrow)"/>
        <text x="60" y="165" class="uml-note">calls getInstance() on itself to create/return the one instance</text>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" class="uml-arrowhead"/>
          </marker>
        </defs>
      </svg>`,
    participants: [
      { name: "Singleton", desc: "Defines the getInstance() operation that lets clients access its unique instance. Responsible for creating and holding its own sole instance." },
    ],
    collaboration:
      "Clients access the Singleton instance exclusively through the class's getInstance() operation. They never call a public constructor directly.",
    consequences: [
      "Controlled access to the sole instance, since the class encapsulates it.",
      "Reduced namespace pollution compared to global variables.",
      "Permits refinement — the Singleton class can be subclassed, and the app can be configured with an instance of the extended class at runtime.",
      "Permits a variable number of instances if requirements change later, since the access mechanism is already encapsulated.",
      "Can make unit testing harder, since the single shared instance carries state across tests unless explicitly reset.",
    ],
    implementations: [
      {
        language: "JavaScript",
        classes: [
          {
            name: "Singleton",
            code:
`class Singleton {
  static #instance;

  constructor() {
    if (Singleton.#instance) {
      throw new Error("Use Singleton.getInstance()");
    }
    this.createdAt = Date.now();
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }

  singletonOperation() {
    return \`instance created at \${this.createdAt}\`;
  }
}

// usage
const a = Singleton.getInstance();
const b = Singleton.getInstance();
console.log(a === b); // true`,
          },
        ],
      },
      {
        language: "Java",
        classes: [
          {
            name: "Singleton",
            code:
`public final class Singleton {
    private static volatile Singleton instance;
    private final long createdAt;

    private Singleton() {
        this.createdAt = System.currentTimeMillis();
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public long singletonOperation() {
        return createdAt;
    }
}`,
          },
        ],
      },
      {
        language: "Python",
        classes: [
          {
            name: "Singleton",
            code:
`class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.created_at = None
        return cls._instance

    def singleton_operation(self):
        return f"instance id: {id(self)}"


a = Singleton()
b = Singleton()
assert a is b`,
          },
        ],
      },
    ],
    knownUses: [
      "Runtime environments that expose a single logging service instance.",
      "Application-wide configuration objects loaded once from disk or environment variables.",
      "Connection pool managers, where creating a second pool would waste resources.",
    ],
    related: ["adapter"],
  },

  // ============================================================
  // ADAPTER — Structural
  // ============================================================
  {
    id: "adapter",
    name: "Adapter",
    category: "structural",
    difficulty: 2,
    summary: "Convert the interface of a class into another interface clients expect.",
    intent:
      "Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.",
    motivation:
      "Imagine a drawing editor that works against a Shape interface, and a third-party TextView class you'd like to reuse as a shape on the canvas — but TextView exposes completely different method names and doesn't subclass Shape. Rewriting TextView isn't an option (you don't own it, or it's used elsewhere unmodified). An Adapter wraps TextView and translates Shape calls into TextView calls.",
    applicability: [
      "You want to use an existing class, but its interface doesn't match the one you need.",
      "You want to create a reusable class that cooperates with classes that don't necessarily have compatible interfaces.",
      "You need to use several existing subclasses but it's impractical to adapt their interface by subclassing every one.",
    ],
    structureSvg: `
      <svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" class="uml-svg">
        ${svgBox(20, 20, 120, 60, "Client", "")}
        ${svgBox(200, 20, 130, 60, "Target", "«interface»")}
        <text x="212" y="70" class="uml-method">+ request()</text>
        <line x1="140" y1="50" x2="200" y2="50" class="uml-line" marker-end="url(#arrow2)"/>
        ${svgBox(200, 120, 130, 80, "Adapter", "")}
        <text x="212" y="172" class="uml-method">+ request()</text>
        <line x1="265" y1="80" x2="265" y2="120" class="uml-arrow-self" stroke-dasharray="4 3"/>
        <text x="272" y="105" class="uml-note" font-size="9">implements</text>
        ${svgBox(300, 140, 140, 60, "Adaptee", "")}
        <text x="312" y="190" class="uml-method">+ specificRequest()</text>
        <line x1="330" y1="160" x2="300" y2="160" class="uml-line" marker-end="url(#arrow2)"/>
        <defs>
          <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" class="uml-arrowhead"/>
          </marker>
        </defs>
      </svg>`,
    participants: [
      { name: "Target", desc: "Defines the domain-specific interface that Client uses." },
      { name: "Client", desc: "Collaborates with objects conforming to the Target interface." },
      { name: "Adaptee", desc: "Defines an existing interface that needs adapting." },
      { name: "Adapter", desc: "Adapts the interface of Adaptee to the Target interface." },
    ],
    collaboration:
      "Clients call operations on an Adapter instance through the Target interface. The Adapter, in turn, forwards the call to Adaptee, translating arguments and return values as needed.",
    consequences: [
      "A single Adapter can work with many Adaptees, i.e. the Adaptee itself and all of its subclasses (class-adapter form only allows one Adaptee at compile time).",
      "Lets a class already in production be reused without touching its source.",
      "Overriding Adaptee behavior is harder with object adapters, since the Adapter holds an Adaptee reference rather than inheriting from it.",
    ],
    implementations: [
      {
        language: "JavaScript",
        classes: [
          {
            name: "Adapter",
            code:
`class TextView { // the Adaptee — third-party, can't change it
  displayText(str) { return \`[TextView] \${str}\`; }
}

class Shape { // Target interface
  draw() { throw new Error("not implemented"); }
}

class TextShapeAdapter extends Shape {
  #textView;
  constructor(textView) {
    super();
    this.#textView = textView;
  }
  draw() {
    return this.#textView.displayText("rendered as a shape");
  }
}

const shape = new TextShapeAdapter(new TextView());
console.log(shape.draw());`,
          },
        ],
      },
      {
        language: "Java",
        classes: [
          {
            name: "Shape",
            code:
`public interface Shape {
    String draw();
}`,
          },
          {
            name: "TextView",
            code:
`public class TextView { // Adaptee
    public String displayText(String s) {
        return "[TextView] " + s;
    }
}`,
          },
          {
            name: "TextShapeAdapter",
            code:
`public class TextShapeAdapter implements Shape {
    private final TextView textView;

    public TextShapeAdapter(TextView textView) {
        this.textView = textView;
    }

    @Override
    public String draw() {
        return textView.displayText("rendered as a shape");
    }
}`,
          },
        ],
      },
    ],
    knownUses: [
      "GUI toolkits that adapt third-party widgets to a common Component interface.",
      "Wrapping a legacy payment gateway SDK behind a modern PaymentProvider interface.",
      "Data-access layers that adapt varied database drivers to one Repository contract.",
    ],
    related: ["observer"],
  },

  // ============================================================
  // OBSERVER — Behavioral
  // ============================================================
  {
    id: "observer",
    name: "Observer",
    category: "behavioral",
    difficulty: 2,
    summary: "Define a one-to-many dependency so that when one object changes state, all its dependents are notified automatically.",
    intent:
      "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
    motivation:
      "Splitting a system into cooperating classes has a recurring side effect: you need to keep related objects consistent without making the classes tightly coupled. A spreadsheet and a bar chart might both display the same underlying data — the moment the data changes, both views must refresh, but the data object shouldn't need to know the concrete classes of every view watching it. Observer decouples the subject (the data) from its observers (the views): the subject only knows it has a list of objects implementing a simple Update interface.",
    applicability: [
      "A change to one object requires changing an unknown, open-ended number of others.",
      "An object should be able to notify other objects without knowing who those objects are — minimizing coupling.",
      "An abstraction has two aspects, one dependent on the other; encapsulating each in a separate object lets you vary and reuse them independently.",
    ],
    structureSvg: `
      <svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="uml-svg">
        ${svgBox(30, 20, 150, 90, "Subject", "")}
        <text x="40" y="90" class="uml-method">+ attach(o)</text>
        <text x="40" y="104" class="uml-method">+ notify()</text>
        ${svgBox(280, 20, 160, 70, "Observer", "«interface»")}
        <text x="292" y="72" class="uml-method">+ update()</text>
        <line x1="180" y1="60" x2="280" y2="55" class="uml-line" stroke-dasharray="4 3" marker-end="url(#arrow3)"/>
        <text x="195" y="45" class="uml-note" font-size="9">notifies *</text>
        ${svgBox(30, 150, 150, 70, "ConcreteSubject", "")}
        <line x1="105" y1="150" x2="105" y2="110" class="uml-arrow-self" stroke-dasharray="4 3"/>
        ${svgBox(280, 150, 160, 70, "ConcreteObserver", "")}
        <text x="292" y="200" class="uml-method">+ update()</text>
        <line x1="360" y1="150" x2="360" y2="90" class="uml-arrow-self" stroke-dasharray="4 3"/>
        <defs>
          <marker id="arrow3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" class="uml-arrowhead"/>
          </marker>
        </defs>
      </svg>`,
    participants: [
      { name: "Subject", desc: "Knows its observers (any number may observe it). Provides an interface to attach and detach observers." },
      { name: "Observer", desc: "Defines an updating interface for objects that should be notified of changes in a subject." },
      { name: "ConcreteSubject", desc: "Stores state of interest to ConcreteObserver objects, and sends a notification when its state changes." },
      { name: "ConcreteObserver", desc: "Maintains a reference to a ConcreteSubject, stores state that should stay consistent with the subject's, and implements the Observer update interface." },
    ],
    collaboration:
      "ConcreteSubject notifies its observers whenever a change occurs that could make its state and its observers' state inconsistent. After being notified, a ConcreteObserver may query the subject for the new state it needs to reconcile its own.",
    consequences: [
      "Abstract coupling between Subject and Observer — a subject only knows it has a list of observers, each conforming to the simple Observer interface.",
      "Supports broadcast communication — notification isn't targeted at particular receivers.",
      "Unexpected updates can cascade, since observers have no knowledge of one another's presence or cost.",
    ],
    implementations: [
      {
        language: "JavaScript",
        classes: [
          {
            name: "Subject",
            code:
`class Subject {
  #observers = new Set();

  attach(observer) { this.#observers.add(observer); }
  detach(observer) { this.#observers.delete(observer); }

  notify(state) {
    for (const observer of this.#observers) observer.update(state);
  }
}`,
          },
          {
            name: "ConcreteSubject",
            code:
`class WeatherStation extends Subject {
  #temperature = 0;

  setTemperature(value) {
    this.#temperature = value;
    this.notify({ temperature: value });
  }
}`,
          },
          {
            name: "ConcreteObserver",
            code:
`class Display {
  constructor(name) { this.name = name; }
  update(state) {
    console.log(\`[\${this.name}] temp is now \${state.temperature}\`);
  }
}

const station = new WeatherStation();
station.attach(new Display("Phone"));
station.attach(new Display("Watch"));
station.setTemperature(24);`,
          },
        ],
      },
      {
        language: "Python",
        classes: [
          {
            name: "Subject",
            code:
`class Subject:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def detach(self, observer):
        self._observers.remove(observer)

    def notify(self, state):
        for observer in self._observers:
            observer.update(state)`,
          },
          {
            name: "ConcreteSubject",
            code:
`class WeatherStation(Subject):
    def set_temperature(self, value):
        self._temperature = value
        self.notify({"temperature": value})`,
          },
          {
            name: "ConcreteObserver",
            code:
`class Display:
    def __init__(self, name):
        self.name = name

    def update(self, state):
        print(f"[{self.name}] temp is now {state['temperature']}")


station = WeatherStation()
station.attach(Display("Phone"))
station.attach(Display("Watch"))
station.set_temperature(24)`,
          },
        ],
      },
    ],
    knownUses: [
      "DOM event listeners (addEventListener) are a direct application of Observer.",
      "MVC frameworks, where views observe a model and re-render on change.",
      "Reactive state libraries (e.g. store subscriptions in Redux, Vue's reactivity system).",
    ],
    related: ["singleton", "adapter"],
  },
];

// Lookup helpers used by the render scripts.
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}
function getPattern(id) {
  return PATTERNS.find((p) => p.id === id);
}
function patternsByCategory(categoryId) {
  return PATTERNS.filter((p) => p.category === categoryId);
}