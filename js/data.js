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

const ANTI_CATEGORIES = [
  { id: "arch-antipattern", label: "Architectural Anti-Patterns", badge: "is-error",
    blurb: "System-level pitfalls that degrade system architecture and scalability." },
  { id: "design-antipattern", label: "Design Anti-Patterns", badge: "is-warning",
    blurb: "Object-oriented design traps that lead to coupled and fragile codebases." },
  { id: "coding-antipattern", label: "Coding Anti-Patterns", badge: "is-dark",
    blurb: "Implementation anti-patterns in source code structure and logic." },
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
  },
  // ============================================================

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
  "id": "observer",
  "name": "Observer",
  "category": "behavioral",
  "difficulty": 2,
  "summary": "Boardcast changes across all the subscribers",
  "intent": "Defines a one-to-many dependency between objects so that when one object (the Subject/Observable) changes state, all of its dependents (the Observers) are notified and updated automatically.",
  "motivation": "Imagine you are building a Weather Station application. You have a WeatherData object that tracks temperature, humidity, and barometric pressure. You also have multiple display elements (Current Conditions, Weather Statistics, and a Simple Forecast) that need to update whenever the weather data changes.\n\nIf you hardcode the display updates inside the WeatherData class, you tightly couple the data to the displays. Every time you want to add or remove a display, you have to modify the core WeatherData code. The Observer pattern solves this by creating a \"Publisher-Subscriber\" model. The WeatherData (Observable) simply maintains a list of interested subscribers (Observers). When the weather changes, it iterates through the list and announces, \"Here is the new data!\" It doesn't need to know anything about the concrete display classes, achieving loose coupling.",
  "applicability": [
    "A change to one object requires changing others, and you don't know exactly how many objects need to be changed dynamically.",
    "An object needs to notify other objects without making assumptions about who those objects are (you want to avoid tightly coupled classes).",
    "You are building user interfaces (event listeners), triggering notifications, or implementing the Model-View-Controller (MVC) architecture."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 400\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n  </style>\n\n  <!-- Interfaces -->\n  <!-- Subject Interface -->\n  <rect x=\"50\" y=\"30\" width=\"220\" height=\"100\" class=\"box\" />\n  <text x=\"160\" y=\"55\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"160\" y=\"75\" class=\"text-title\">Subject (Observable)</text>\n  <line x1=\"50\" y1=\"85\" x2=\"270\" y2=\"85\" class=\"line\" />\n  <text x=\"60\" y=\"105\" class=\"text-body\">+ registerObserver(o: Observer)</text>\n  <text x=\"60\" y=\"120\" class=\"text-body\">+ removeObserver(o: Observer)</text>\n  <text x=\"60\" y=\"135\" class=\"text-body\">+ notifyObservers()</text> <!-- Fixed y-coordinate -->\n\n  <!-- Observer Interface -->\n  <rect x=\"450\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"560\" y=\"55\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"560\" y=\"75\" class=\"text-title\">Observer</text>\n  <line x1=\"450\" y1=\"85\" x2=\"670\" y2=\"85\" class=\"line\" />\n  <text x=\"460\" y=\"105\" class=\"text-body\">+ update()</text>\n\n  <!-- Implementations -->\n  <!-- Concrete Subject -->\n  <rect x=\"50\" y=\"220\" width=\"220\" height=\"110\" class=\"box\" />\n  <text x=\"160\" y=\"245\" class=\"text-title\">WeatherData</text>\n  <line x1=\"50\" y1=\"255\" x2=\"270\" y2=\"255\" class=\"line\" />\n  <text x=\"60\" y=\"275\" class=\"text-body\">- observers: List&lt;Observer&gt;</text>\n  <text x=\"60\" y=\"290\" class=\"text-body\">- temperature: float</text>\n  <line x1=\"50\" y1=\"300\" x2=\"270\" y2=\"300\" class=\"line\" />\n  <text x=\"60\" y=\"320\" class=\"text-body\">+ getTemperature()</text>\n\n  <!-- Concrete Observer -->\n  <rect x=\"450\" y=\"220\" width=\"220\" height=\"90\" class=\"box\" />\n  <text x=\"560\" y=\"245\" class=\"text-title\">CurrentConditionsDisplay</text>\n  <line x1=\"450\" y1=\"255\" x2=\"670\" y2=\"255\" class=\"line\" />\n  <text x=\"460\" y=\"275\" class=\"text-body\">- subject: Subject</text>\n  <line x1=\"450\" y1=\"285\" x2=\"670\" y2=\"285\" class=\"line\" />\n  <text x=\"460\" y=\"305\" class=\"text-body\">+ update()</text>\n\n  <!-- Inheritance Arrows (Dashed for interfaces) -->\n  <path d=\"M 160 220 L 160 130\" class=\"line dashed\" />\n  <polygon points=\"160,130 155,145 165,145\" class=\"arrow\" />\n\n  <path d=\"M 560 220 L 560 110\" class=\"line dashed\" />\n  <polygon points=\"560,110 555,125 565,125\" class=\"arrow\" />\n\n  <!-- Association Arrow (Subject knows Observers) -->\n  <path d=\"M 270 80 L 440 80\" class=\"line\" />\n  <polygon points=\"450,80 435,75 435,85\" class=\"arrow\" />\n  <text x=\"310\" y=\"70\" class=\"text-body\">observes &gt;</text>\n</svg>",
  "participants": [
    {
      "name": "Subject (Observable)",
      "desc": "An interface or abstract class that provides methods to attach and detach Observer objects."
    },
    {
      "name": "Observer",
      "desc": "An interface that defines an update() method, which the Subject calls when its state changes."
    },
    {
      "name": "ConcreteSubject",
      "desc": "Stores the state of interest. Sends a notification to its registered Observers when its state changes."
    },
    {
      "name": "ConcreteObserver",
      "desc": "Maintains a reference to a ConcreteSubject, implements the Observer interface, and ensures its state stays synchronized with the subject's state upon receiving an update."
    }
  ],
  "collaboration": "1.The ConcreteObserver registers itself with the ConcreteSubject.\n2. The state of the ConcreteSubject changes.\n3.The ConcreteSubject iterates through its list of registered observers and calls their update() methods.\n4.The ConcreteObserver receives the notification, optionally queries the ConcreteSubject for the new data (if not passed directly in the update method), and updates itself.",
  "consequences": [
    "Loose Coupling: The Subject only knows that an observer implements a specific interface. It doesn't know the concrete class of the observer, what it does, or how it works.",
    "Dynamic Relationships: Observers can be added, removed, or swapped out at runtime without modifying the Subject.",
    "Open/Closed Principle: You can introduce new subscriber classes without modifying the publisher's code.",
    "Memory Leaks (Lapsed Listener Problem): If observers are not explicitly deregistered when they are no longer needed, the Subject will keep a strong reference to them, preventing garbage collection.",
    "Unintended Cascades: A small change in the Subject might trigger an unexpected chain reaction of updates across a massive tree of observers, slowing down performance.",
    "Order of Updates: Observers are notified in an arbitrary order. If they depend on a specific execution sequence, bugs can arise."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "Subject",
          "code": "public interface Subject {\n    void registerObserver(Observer o);\n    void removeObserver(Observer o);\n    void notifyObservers();\n}"
        },
        {
          "name": "Observer",
          "code": "public interface Observer {\n    // Note: This is the \"Push\" model where data is sent to the observer.\n    void update(float temp, float humidity, float pressure);\n}"
        },
        {
          "name": "WeatherData",
          "code": "import java.util.ArrayList;\nimport java.util.List;\n\npublic class WeatherData implements Subject {\n    private List<Observer> observers;\n    private float temperature;\n    private float humidity;\n    private float pressure;\n\n    public WeatherData() {\n        observers = new ArrayList<>();\n    }\n\n    public void registerObserver(Observer o) {\n        observers.add(o);\n    }\n\n    public void removeObserver(Observer o) {\n        int i = observers.indexOf(o);\n\n        if (i >= 0) {\n            observers.remove(i);\n        }\n    }\n\n    public void notifyObservers() {\n        for (Observer observer : observers) {\n            observer.update(temperature, humidity, pressure);\n        }\n    }\n\n    public void measurementsChanged() {\n        notifyObservers();\n    }\n\n    public void setMeasurements(\n        float temperature,\n        float humidity,\n        float pressure\n    ) {\n        this.temperature = temperature;\n        this.humidity = humidity;\n        this.pressure = pressure;\n\n        measurementsChanged();\n    }\n}"
        },
        {
          "name": "CurrentConditionsDisplay",
          "code": "public class CurrentConditionsDisplay implements Observer {\n    private float temperature;\n    private float humidity;\n    private Subject weatherData;\n\n    public CurrentConditionsDisplay(Subject weatherData) {\n        this.weatherData = weatherData;\n        weatherData.registerObserver(this);\n    }\n\n    public void update(float temperature, float humidity, float pressure) {\n        this.temperature = temperature;\n        this.humidity = humidity;\n        display();\n    }\n\n    public void display() {\n        System.out.println(\n            \"Current conditions: \"\n            + temperature\n            + \"F degrees and \"\n            + humidity\n            + \"% humidity\"\n        );\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Java APIs: java.util.Observable and java.util.Observer (Deprecated in Java 9+ in favor of the java.beans.PropertyChangeListener or modern Reactive streams).",
    "UI Frameworks: Button click listeners and event handlers in Swing (ActionListener), Android (OnClickListener), and JavaScript DOM events.",
    "Reactive Programming: Libraries like RxJava, RxJS, and Apple's Combine framework are massive, super-charged extensions of the Observer pattern.",
    "MVC Architecture: The Model notifies the View components when data changes so the UI can redraw."
  ],
  "related": [
    "pub-sub",
    "mediator",
    "singleton"
  ]
}
];

const ANTIPATTERNS = [
  {
    type: "antipattern",
    id: "god-object",
    name: "God Object (The Blob)",
    category: "design-antipattern",
    difficulty: 3,
    summary: "A single class that handles too many responsibilities, concentrating business logic into a monolithic entity.",
    problem: "An object knows too much or does too much, monopolizing execution and reducing other classes to simple passive data holders.",
    context: "As software grows under deadline pressure, developers keep adding methods and fields to an existing central manager class instead of designing proper abstractions.",
    forces: [
      "Quick feature additions seem faster by modifying a large existing class.",
      "Lack of clear domain boundaries and responsibility separation.",
      "High coupling makes it risky to refactor without automated tests."
    ],
    supposedSolution: "Centralizing all control in one 'God' manager class (e.g. SystemManager, AppController) so everything is accessible in one place.",
    refactoredSolution: "Extract responsibilities using Single Responsibility Principle (SRP). Split the Blob into smaller, cohesive classes and delegate behavior using patterns like Command, Strategy, or Observer.",
    example: "An OrderProcessor class that validates user input, calculates taxes, connects to MySQL, formats HTML receipts, and sends email notifications.",
    implementations: [
      {
        language: "JavaScript",
        classes: [
          {
            name: "AntiPattern_GodObject",
            code:
`// ANTIPATTERN: God Object doing everything
class OrderSystem {
  processOrder(order) {
    this.validateOrder(order);
    this.calculateTax(order);
    this.saveToDatabase(order);
    this.chargeCreditCard(order);
    this.sendEmailReceipt(order);
  }
  // 50+ other unrelated methods...
}`
          },
          {
            name: "Refactored_Solution",
            code:
`// REFACTORED: Delegated single-responsibility classes
class OrderProcessor {
  constructor(validator, db, paymentGateway, notifier) {
    this.validator = validator;
    this.db = db;
    this.paymentGateway = paymentGateway;
    this.notifier = notifier;
  }

  process(order) {
    this.validator.validate(order);
    this.db.save(order);
    this.paymentGateway.charge(order);
    this.notifier.sendReceipt(order);
  }
}`
          }
        ]
      }
    ],
    related: ["singleton"]
  },
  {
    type: "antipattern",
    id: "spaghetti-code",
    name: "Spaghetti Code",
    category: "coding-antipattern",
    difficulty: 2,
    summary: "Unstructured program code with complex, tangled control flow structures.",
    problem: "Code lacks structure, making it nearly impossible to trace execution flow, debug, or extend without breaking existing logic.",
    context: "Long-lived legacy projects edited by many developers without consistent architecture or refactoring cycles.",
    forces: [
      "Rushing to meet immediate deadlines without refactoring.",
      "Lack of code reviews and coding standards.",
      "Over-reliance on global state and deeply nested conditional statements."
    ],
    supposedSolution: "Patching existing functions with nested if/else blocks and flag variables to quickly implement new feature requests.",
    refactoredSolution: "Modularize code into small functions with single responsibilities. Replace complex control flow with domain models, polymorphism, or state pattern state machines.",
    example: "A 2,000-line script with global variables, deeply nested callbacks, and unconditional jumps.",
    implementations: [
      {
        language: "JavaScript",
        classes: [
          {
            name: "Spaghetti_Code_Example",
            code:
`// ANTIPATTERN: Tangled flags & nested conditions
function handle(req, flag1, flag2, data) {
  if (flag1) {
    if (data && data.user) {
      if (flag2) {
        // ... nested logic
      }
    }
  }
}`
          }
        ]
      }
    ],
    related: ["god-object"]
  }
];

// Lookup helpers used by the render scripts.
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || ANTI_CATEGORIES.find((c) => c.id === id);
}

function getPattern(id) {
  return PATTERNS.find((p) => p.id === id) || ANTIPATTERNS.find((p) => p.id === id);
}

function patternsByCategory(categoryId) {
  const isAnti = ANTI_CATEGORIES.some((c) => c.id === categoryId);
  if (isAnti) {
    return ANTIPATTERNS.filter((p) => p.category === categoryId);
  }
  return PATTERNS.filter((p) => p.category === categoryId);
}