/* ====================================================
   Pattern Book — pattern-data.js
   ==================================================== */

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
  // Factory - Creational
  // ============================================================
  {
  "id": "factory-method",
  "name": "Factory Method",
  "category": "creational",
  "difficulty": 2,
  "summary": "Define an interface for creating an object, but let subclasses decide which class to instantiate.",
  "intent": "Defines an interface for creating an object, but lets subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.",
  "motivation": "Imagine you are building a Pizza franchise application. You have a central `PizzaStore` class with an `orderPizza()` method that prepares, bakes, cuts, and boxes the pizza. However, franchises in New York and Chicago offer different styles of pizzas (e.g., thin crust vs. deep dish). \n\nIf you use the `new` operator inside `orderPizza()` to create concrete pizza objects, your store is tightly coupled to specific regional pizzas. Every time a new franchise opens, you have to modify the core `orderPizza` code. The Factory Method pattern solves this by encapsulating object creation. You define an abstract `createPizza()` method in the base `PizzaStore`. Subclasses like `NYPizzaStore` and `ChicagoPizzaStore` implement this method to instantiate their specific regional pizzas. The superclass's `orderPizza()` method relies strictly on the abstract `Pizza` type, completely oblivious to the concrete classes being instantiated.",
  "applicability": [
    "When a class can't anticipate the class of objects it must create.",
    "When a class wants its subclasses to specify the objects it creates.",
    "When classes delegate responsibility to one of several helper subclasses, and you want to localize the knowledge of which helper subclass is the delegate."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 400\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n  </style>\n\n  <!-- Creator -->\n  <rect x=\"50\" y=\"30\" width=\"250\" height=\"90\" class=\"box\" />\n  <text x=\"175\" y=\"55\" class=\"text-title\">&lt;&lt;abstract&gt;&gt;</text>\n  <text x=\"175\" y=\"75\" class=\"text-title\">Creator (PizzaStore)</text>\n  <line x1=\"50\" y1=\"85\" x2=\"300\" y2=\"85\" class=\"line\" />\n  <text x=\"60\" y=\"105\" class=\"text-body\">+ anOperation()</text>\n  <text x=\"60\" y=\"120\" class=\"text-body\"># factoryMethod(): Product</text>\n\n  <!-- Concrete Creator -->\n  <rect x=\"50\" y=\"220\" width=\"250\" height=\"80\" class=\"box\" />\n  <text x=\"175\" y=\"245\" class=\"text-title\">ConcreteCreator</text>\n  <line x1=\"50\" y1=\"255\" x2=\"300\" y2=\"255\" class=\"line\" />\n  <text x=\"60\" y=\"275\" class=\"text-body\"># factoryMethod(): Product</text>\n\n  <!-- Product -->\n  <rect x=\"450\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"560\" y=\"55\" class=\"text-title\">&lt;&lt;abstract&gt;&gt;</text>\n  <text x=\"560\" y=\"75\" class=\"text-title\">Product (Pizza)</text>\n  <line x1=\"450\" y1=\"85\" x2=\"670\" y2=\"85\" class=\"line\" />\n\n  <!-- Concrete Product -->\n  <rect x=\"450\" y=\"220\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"560\" y=\"245\" class=\"text-title\">ConcreteProduct</text>\n  <line x1=\"450\" y1=\"255\" x2=\"670\" y2=\"255\" class=\"line\" />\n\n  <!-- Inheritance Arrows -->\n  <path d=\"M 175 220 L 175 130\" class=\"line\" />\n  <polygon points=\"175,130 170,145 180,145\" class=\"arrow\" />\n\n  <path d=\"M 560 220 L 560 120\" class=\"line\" />\n  <polygon points=\"560,120 555,135 565,135\" class=\"arrow\" />\n\n  <!-- Dependency Arrow (ConcreteCreator creates ConcreteProduct) -->\n  <path d=\"M 300 260 L 440 260\" class=\"line dashed\" />\n  <polygon points=\"450,260 435,255 435,265\" class=\"arrow\" />\n  <text x=\"345\" y=\"250\" class=\"text-body\">creates &gt;</text>\n</svg>",
  "participants": [
    {
      "name": "Creator (PizzaStore)",
      "desc": "Declares the factory method, which returns an object of type Product. It may also define a default implementation of the factory method, and it contains other operations that rely on the Product."
    },
    {
      "name": "ConcreteCreator (NYPizzaStore)",
      "desc": "Overrides the factory method to return an instance of a ConcreteProduct."
    },
    {
      "name": "Product (Pizza)",
      "desc": "Defines the interface or abstract class of the objects the factory method creates."
    },
    {
      "name": "ConcreteProduct (NYStyleCheesePizza)",
      "desc": "Implements the Product interface. This is the specific object created by the ConcreteCreator."
    }
  ],
  "collaboration": "1. The application or client interacts with the Creator class, invoking a method like `orderPizza()`.\n2. Inside the Creator, the `factoryMethod()` is called to get a Product instance.\n3. Because the object was instantiated using a subclass (ConcreteCreator), the specific ConcreteProduct is returned and used by the Creator's general workflow.",
  "consequences": [
    "Decoupling: It eliminates the need to bind application-specific concrete classes into your code. Your code only deals with the Product interface/abstraction.",
    "Dependency Inversion Principle: High-level components (PizzaStore) and low-level components (NYStyleCheesePizza) both depend on the same abstraction (Pizza), rather than the high-level depending on the low-level.",
    "Single Responsibility Principle: Object creation logic is moved to a dedicated part of the system, keeping the core business logic uncluttered.",
    "Class Explosion: The pattern requires creating a new subclass of the Creator for every new type of Product you want to support, potentially resulting in many small classes."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "Pizza",
          "code": "public abstract class Pizza {\n    String name;\n\n    public void prepare() {\n        System.out.println(\"Preparing \" + name);\n    }\n\n    public void bake() {\n        System.out.println(\"Baking for 25 minutes at 350\");\n    }\n\n    public void cut() {\n        System.out.println(\"Cutting the pizza into diagonal slices\");\n    }\n\n    public void box() {\n        System.out.println(\"Place pizza in official PizzaStore box\");\n    }\n\n    public String getName() {\n        return name;\n    }\n}"
        },
        {
          "name": "NYStyleCheesePizza",
          "code": "public class NYStyleCheesePizza extends Pizza {\n    public NYStyleCheesePizza() {\n        name = \"NY Style Sauce and Cheese Pizza\";\n    }\n}"
        },
        {
          "name": "PizzaStore",
          "code": "public abstract class PizzaStore {\n    // The Factory Method\n    protected abstract Pizza createPizza(String item);\n\n    public Pizza orderPizza(String type) {\n        // The Creator relies on its subclasses to create the object\n        Pizza pizza = createPizza(type);\n\n        // The Creator performs operations on the abstract Product\n        pizza.prepare();\n        pizza.bake();\n        pizza.cut();\n        pizza.box();\n\n        return pizza;\n    }\n}"
        },
        {
          "name": "NYPizzaStore",
          "code": "public class NYPizzaStore extends PizzaStore {\n    // Subclass implements the Factory Method\n    protected Pizza createPizza(String item) {\n        if (item.equals(\"cheese\")) {\n            return new NYStyleCheesePizza();\n        } else if (item.equals(\"pepperoni\")) {\n            // return new NYStylePepperoniPizza();\n            return null;\n        } else {\n            return null;\n        }\n    }\n}"
        },
        {
          "name": "Main",
          "code": "public class Main {\n    public static void main(String[] args) {\n        PizzaStore nyStore = new NYPizzaStore();\n        \n        // The client only deals with the NYPizzaStore\n        // The store handles the correct creation behind the scenes\n        Pizza pizza = nyStore.orderPizza(\"cheese\");\n        System.out.println(\"Ethan ordered a \" + pizza.getName() + \"\\n\");\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Java Collections Framework: Methods like `iterator()` on standard Java Collections are a classic example of Factory Method. A generic list defines the method, but `ArrayList` creates an `ArrayListIterator`, while `LinkedList` creates a `LinkedListIterator`.",
    "Spring Framework: The `FactoryBean` interface in Spring is a variation of the Factory Method pattern used heavily for bean instantiation.",
    "JDBC: `DriverManager.getConnection()` is an example where a driver acts as a factory for returning specific implementation database connections."
  ],
  "related": [
    "abstract-factory",
    "template-method",
    "prototype"
  ]
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
  // Decorator - Structural
  // ============================================================
  {
  "id": "decorator",
  "name": "Decorator",
  "category": "structural",
  "difficulty": 2,
  "summary": "Attach additional responsibilities to an object dynamically without subclassing.",
  "intent": "Attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.",
  "motivation": "Imagine you are building a point-of-sale system for Starbuzz Coffee. They offer various coffee blends (House Blend, Dark Roast, Espresso) and numerous condiments (Steamed Milk, Soy, Mocha, Whip). If you use subclassing to calculate the cost, you'll end up with an exploding class explosion (e.g., `HouseBlendWithMochaAndWhip`, `DarkRoastWithDoubleMocha`). The Decorator pattern solves this by wrapping the base beverage with condiment decorators at runtime. You start with a `DarkRoast` object, wrap it in a `Mocha` object, and then wrap that in a `Whip` object. Each wrapper shares the same interface as the base object, adds its own cost to the total, and delegates the rest of the operation to the object it wraps.",
  "applicability": [
    "When you need to add responsibilities to individual objects dynamically and transparently, without affecting other objects.",
    "When extending behavior by subclassing is impractical due to a massive class explosion of permutations.",
    "When you want to add or remove behaviors or features at runtime."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 450\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .diamond { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; }\n  </style>\n\n  <!-- Component -->\n  <rect x=\"290\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"400\" y=\"55\" class=\"text-title\">&lt;&lt;abstract&gt;&gt;</text>\n  <text x=\"400\" y=\"75\" class=\"text-title\">Component</text>\n  <line x1=\"290\" y1=\"85\" x2=\"510\" y2=\"85\" class=\"line\" />\n  <text x=\"300\" y=\"100\" class=\"text-body\">+ operation()</text>\n\n  <!-- Concrete Component -->\n  <rect x=\"100\" y=\"180\" width=\"220\" height=\"70\" class=\"box\" />\n  <text x=\"210\" y=\"210\" class=\"text-title\">ConcreteComponent</text>\n  <line x1=\"100\" y1=\"225\" x2=\"320\" y2=\"225\" class=\"line\" />\n  <text x=\"110\" y=\"240\" class=\"text-body\">+ operation()</text>\n\n  <!-- Decorator -->\n  <rect x=\"480\" y=\"180\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"590\" y=\"205\" class=\"text-title\">&lt;&lt;abstract&gt;&gt;</text>\n  <text x=\"590\" y=\"225\" class=\"text-title\">Decorator</text>\n  <line x1=\"480\" y1=\"235\" x2=\"700\" y2=\"235\" class=\"line\" />\n  <text x=\"490\" y=\"250\" class=\"text-body\">+ operation()</text>\n\n  <!-- Concrete Decorator -->\n  <rect x=\"480\" y=\"320\" width=\"220\" height=\"90\" class=\"box\" />\n  <text x=\"590\" y=\"345\" class=\"text-title\">ConcreteDecorator</text>\n  <line x1=\"480\" y1=\"355\" x2=\"700\" y2=\"355\" class=\"line\" />\n  <text x=\"490\" y=\"375\" class=\"text-body\">- addedState</text>\n  <text x=\"490\" y=\"395\" class=\"text-body\">+ operation()</text>\n\n  <!-- Inheritance lines -->\n  <!-- ConcreteComponent to Component -->\n  <path d=\"M 210 180 L 210 140 L 400 140 L 400 110\" class=\"line\" />\n  <polygon points=\"400,110 395,120 405,120\" class=\"arrow\" />\n\n  <!-- Decorator to Component -->\n  <path d=\"M 590 180 L 590 140 L 400 140 L 400 110\" class=\"line\" />\n\n  <!-- ConcreteDecorator to Decorator -->\n  <path d=\"M 590 320 L 590 260\" class=\"line\" />\n  <polygon points=\"590,260 585,270 595,270\" class=\"arrow\" />\n\n  <!-- Aggregation (Decorator has-a Component) -->\n  <path d=\"M 700 220 L 750 220 L 750 70 L 510 70\" class=\"line\" />\n  <polygon points=\"510,70 525,65 525,75\" class=\"arrow\" />\n  <polygon points=\"700,220 710,215 720,220 710,225\" class=\"diamond\" />\n  <text x=\"755\" y=\"145\" class=\"text-body\">component</text>\n</svg>",
  "participants": [
    {
      "name": "Component (Beverage)",
      "desc": "Defines the interface for objects that can have responsibilities added to them dynamically."
    },
    {
      "name": "ConcreteComponent (Espresso, DarkRoast)",
      "desc": "Defines an object to which additional responsibilities can be attached. This is the base object you are decorating."
    },
    {
      "name": "Decorator (CondimentDecorator)",
      "desc": "Maintains a reference to a Component object and defines an interface that conforms to Component's interface. It \"has a\" Component and \"is a\" Component."
    },
    {
      "name": "ConcreteDecorator (Mocha, Whip)",
      "desc": "Adds specific responsibilities (like cost or description) to the component. It delegates operations to the wrapped component and adds its own behavior before or after."
    }
  ],
  "collaboration": "1. The client configures a ConcreteComponent (base object) with one or more ConcreteDecorators.\n2. When the client calls a method (like cost()), the outermost Decorator receives the call.\n3. The Decorator delegates the operation to the Component it wraps, and adds its own behavior (like adding the cost of the condiment) either before or after the delegation.",
  "consequences": [
    "More flexibility than static inheritance: Decorators allow adding or removing responsibilities at runtime by wrapping objects differently.",
    "Avoids feature-laden classes high up in the hierarchy: You can add functionalities a-la-carte instead of predicting all features in a base class.",
    "Lots of little objects: A design using Decorator often results in systems composed of many tiny, similar-looking objects, which can be hard for a developer unfamiliar with the system to learn and debug.",
    "Type matching issues: If code relies on checking exact object types (e.g., using instanceof), decorators can break that logic because a decorated object is not strictly the exact same type as the base concrete object."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "Beverage",
          "code": "public abstract class Beverage {\n    String description = \"Unknown Beverage\";\n\n    public String getDescription() {\n        return description;\n    }\n\n    public abstract double cost();\n}"
        },
        {
          "name": "CondimentDecorator",
          "code": "public abstract class CondimentDecorator extends Beverage {\n    // We require decorators to reimplement getDescription()\n    public abstract String getDescription();\n}"
        },
        {
          "name": "Espresso",
          "code": "public class Espresso extends Beverage {\n    public Espresso() {\n        description = \"Espresso\";\n    }\n\n    public double cost() {\n        return 1.99;\n    }\n}"
        },
        {
          "name": "Mocha",
          "code": "public class Mocha extends CondimentDecorator {\n    Beverage beverage;\n\n    public Mocha(Beverage beverage) {\n        this.beverage = beverage;\n    }\n\n    public String getDescription() {\n        return beverage.getDescription() + \", Mocha\";\n    }\n\n    public double cost() {\n        return .20 + beverage.cost();\n    }\n}"
        },
        {
          "name": "StarbuzzCoffee",
          "code": "public class StarbuzzCoffee {\n    public static void main(String args[]) {\n        // Order an Espresso with no condiments\n        Beverage beverage = new Espresso();\n        System.out.println(beverage.getDescription() \n            + \" $\" + beverage.cost());\n\n        // Order a Double Mocha Espresso\n        Beverage beverage2 = new Espresso();\n        beverage2 = new Mocha(beverage2);\n        beverage2 = new Mocha(beverage2);\n        System.out.println(beverage2.getDescription() \n            + \" $\" + beverage2.cost());\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Java I/O Streams (java.io): The java.io package is heavily based on Decorator. BufferedInputStream decorates FileInputStream, LineNumberInputStream decorates BufferedInputStream, etc.",
    "UI Frameworks: Adding visual elements like scrollbars or borders to windows or text areas dynamically.",
    "Middleware/Interceptors: Wrapping HTTP request/response objects to add logging, authentication, or caching transparently."
  ],
  "related": [
    "adapter",
    "composite",
    "strategy"
  ]
  },
  // =============================================================
  // Facade - Structural
  // =============================================================
  {
  "id": "facade",
  "name": "Facade",
  "category": "structural",
  "difficulty": 1,
  "summary": "Provide a unified, simplified interface to a complex subsystem of classes.",
  "intent": "Provides a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.",
  "motivation": "Imagine you have built a killer Home Theater system. You have a DVD Player, a Projector, an Automated Screen, a Surround Sound Amplifier, and Smart Lights. To watch a movie, you have to execute a tedious sequence: dim the lights, lower the screen, turn on the projector, set the projector input to the DVD, turn on the amplifier, set the amplifier input to the DVD, set the amp volume, turn on the DVD player, and press play. \n\nIf you put all this logic directly into your client application, it becomes incredibly complex and tightly coupled to a dozen different device classes. The Facade pattern solves this by introducing a `HomeTheaterFacade` class. This facade exposes a simple, high-level method like `watchMovie(\"Raiders of the Lost Ark\")`. Under the hood, the facade understands exactly how to orchestrate the complex subsystem of devices, giving the client a simple, single point of entry.",
  "applicability": [
    "When you want to provide a simple interface to a complex subsystem. Subsystems often get more complex as they evolve, and a facade provides a default, simplified view for most clients.",
    "When there are many dependencies between clients and the implementation classes of an abstraction. A facade decouples the subsystem from clients and other subsystems, promoting subsystem independence and portability.",
    "When you want to layer your subsystems. Use a facade to define an entry point to each subsystem level, simplifying the communication between them."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 450\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .subsystem-box { fill: #e9ecef; stroke: #6c757d; stroke-width: 2; stroke-dasharray: 5,5; rx: 10; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; stroke: #6c757d; }\n  </style>\n\n  <!-- Client -->\n  <rect x=\"50\" y=\"180\" width=\"150\" height=\"60\" class=\"box\" />\n  <text x=\"125\" y=\"215\" class=\"text-title\">Client</text>\n\n  <!-- Facade -->\n  <rect x=\"300\" y=\"160\" width=\"180\" height=\"100\" class=\"box\" />\n  <text x=\"390\" y=\"190\" class=\"text-title\">Facade</text>\n  <line x1=\"300\" y1=\"200\" x2=\"480\" y2=\"200\" class=\"line\" />\n  <text x=\"310\" y=\"225\" class=\"text-body\">+ watchMovie()</text>\n  <text x=\"310\" y=\"245\" class=\"text-body\">+ endMovie()</text>\n\n  <!-- Subsystem Boundary -->\n  <rect x=\"550\" y=\"30\" width=\"220\" height=\"360\" class=\"subsystem-box\" />\n  <text x=\"660\" y=\"60\" class=\"text-title\" fill=\"#6c757d\">Complex Subsystem</text>\n\n  <!-- Subsystem Classes -->\n  <rect x=\"580\" y=\"90\" width=\"160\" height=\"50\" class=\"box\" />\n  <text x=\"660\" y=\"120\" class=\"text-title\">Amplifier</text>\n\n  <rect x=\"580\" y=\"180\" width=\"160\" height=\"50\" class=\"box\" />\n  <text x=\"660\" y=\"210\" class=\"text-title\">DvdPlayer</text>\n\n  <rect x=\"580\" y=\"270\" width=\"160\" height=\"50\" class=\"box\" />\n  <text x=\"660\" y=\"300\" class=\"text-title\">Projector</text>\n\n  <!-- Client to Facade -->\n  <path d=\"M 200 210 L 290 210\" class=\"line\" />\n  <polygon points=\"290,210 280,205 280,215\" class=\"arrow\" />\n\n  <!-- Facade to Subsystems -->\n  <path d=\"M 480 180 L 570 120\" class=\"line\" />\n  <polygon points=\"570,120 560,118 565,128\" class=\"arrow\" />\n\n  <path d=\"M 480 210 L 570 210\" class=\"line\" />\n  <polygon points=\"570,210 560,205 560,215\" class=\"arrow\" />\n\n  <path d=\"M 480 240 L 570 290\" class=\"line\" />\n  <polygon points=\"570,290 565,280 560,290\" class=\"arrow\" />\n\n  <!-- Inter-subsystem coupling (shows complexity) -->\n  <path d=\"M 660 140 L 660 170\" class=\"line dashed\" />\n  <polygon points=\"660,170 655,160 665,160\" class=\"arrow\" fill=\"#6c757d\" />\n\n  <path d=\"M 620 230 L 620 260\" class=\"line dashed\" />\n  <polygon points=\"620,260 615,250 625,250\" class=\"arrow\" fill=\"#6c757d\" />\n</svg>",
  "participants": [
    {
      "name": "Facade (HomeTheaterFacade)",
      "desc": "Knows which subsystem classes are responsible for a request. Delegates client requests to appropriate subsystem objects."
    },
    {
      "name": "Subsystem classes (Amplifier, DvdPlayer, etc.)",
      "desc": "Implement the core subsystem functionality. They handle the work assigned by the Facade object but have no knowledge of the facade (they don't keep references to it)."
    }
  ],
  "collaboration": "1. Clients communicate with the complex subsystem by sending requests directly to the Facade.\n2. The Facade receives the simple request and forwards/translates it into a series of complex requests to the appropriate subsystem objects.\n3. The subsystem objects perform the actual work. The client only ever talks to the Facade, shielding it from the complexity.",
  "consequences": [
    "Shielding: It shields clients from subsystem components, reducing the number of objects that clients deal with and making the subsystem easier to use.",
    "Loose Coupling: Promotes weak coupling between the subsystem and its clients. If the internals of the Home Theater system change (e.g., upgrading from a DVD to a Streaming Box), you only have to update the Facade, not the client code.",
    "Principle of Least Knowledge (Law of Demeter): Helps strictly enforce this OO principle by giving the client only one 'friend' (the Facade) to talk to, rather than letting the client reach in and talk to all the subsystem parts directly.",
    "Not a Prison: It does NOT prevent expert clients from bypassing the Facade and using the subsystem classes directly if they need advanced functionality. It's a convenience, not an absolute encapsulation."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "Amplifier",
          "code": "public class Amplifier {\n    public void on() { System.out.println(\"Amp on\"); }\n    public void setDvd(DvdPlayer dvd) { System.out.println(\"Amp setting DVD player\"); }\n    public void setSurroundSound() { System.out.println(\"Amp surround sound on (5 speakers, 1 subwoofer)\"); }\n    public void setVolume(int level) { System.out.println(\"Amp setting volume to \" + level); }\n    public void off() { System.out.println(\"Amp off\"); }\n}"
        },
        {
          "name": "DvdPlayer",
          "code": "public class DvdPlayer {\n    public void on() { System.out.println(\"DVD on\"); }\n    public void play(String movie) { System.out.println(\"DVD playing \\\"\" + movie + \"\\\"\"); }\n    public void stop() { System.out.println(\"DVD stopped\"); }\n    public void eject() { System.out.println(\"DVD eject\"); }\n    public void off() { System.out.println(\"DVD off\"); }\n}"
        },
        {
          "name": "Projector",
          "code": "public class Projector {\n    public void on() { System.out.println(\"Projector on\"); }\n    public void wideScreenMode() { System.out.println(\"Projector in widescreen mode (16x9 aspect ratio)\"); }\n    public void off() { System.out.println(\"Projector off\"); }\n}"
        },
        {
          "name": "HomeTheaterFacade",
          "code": "public class HomeTheaterFacade {\n    private Amplifier amp;\n    private DvdPlayer dvd;\n    private Projector projector;\n\n    // The Facade is passed all the subsystem components in its constructor\n    public HomeTheaterFacade(Amplifier amp, DvdPlayer dvd, Projector projector) {\n        this.amp = amp;\n        this.dvd = dvd;\n        this.projector = projector;\n    }\n\n    // A simplified macro-method that orchestrates the subsystem\n    public void watchMovie(String movie) {\n        System.out.println(\"Get ready to watch a movie...\");\n        projector.on();\n        projector.wideScreenMode();\n        amp.on();\n        amp.setDvd(dvd);\n        amp.setSurroundSound();\n        amp.setVolume(5);\n        dvd.on();\n        dvd.play(movie);\n    }\n\n    public void endMovie() {\n        System.out.println(\"\\nShutting movie theater down...\");\n        projector.off();\n        amp.off();\n        dvd.stop();\n        dvd.eject();\n        dvd.off();\n    }\n}"
        },
        {
          "name": "Client",
          "code": "public class Client {\n    public static void main(String[] args) {\n        // Subsystem components are usually instantiated or injected here\n        Amplifier amp = new Amplifier();\n        DvdPlayer dvd = new DvdPlayer();\n        Projector projector = new Projector();\n\n        // The Client creates the Facade\n        HomeTheaterFacade homeTheater = \n            new HomeTheaterFacade(amp, dvd, projector);\n\n        // The Client relies strictly on the simple Facade API\n        homeTheater.watchMovie(\"Raiders of the Lost Ark\");\n        homeTheater.endMovie();\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "API Wrappers: Any time you use a library that wraps a messy, complex legacy API or a low-level C++ library in a clean, modern language wrapper, you are using a Facade.",
    "SLF4J (Simple Logging Facade for Java): Acts as a unified, simple facade for various complex logging frameworks like Logback, log4j, and java.util.logging.",
    "Spring Framework: Spring heavily uses facades to hide the complex instantiation and configuration of beans and transactions from the standard developer workflows."
  ],
  "related": [
    "adapter",
    "mediator",
    "singleton"
  ]
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
  },
  // ============================================================
  // Command - Behavioral
  // ============================================================
  {
  "id": "command",
  "name": "Command",
  "category": "behavioral",
  "difficulty": 3,
  "summary": "Encapsulate a request as an object, allowing you to parameterize clients, queue requests, and support undo operations.",
  "intent": "Encapsulates a request as an object, thereby letting you parameterize other objects with different requests, queue or log requests, and support undoable operations.",
  "motivation": "Imagine you are designing a programmable home automation remote control. The remote has generic slots and buttons (on/off), but the smart devices you need to control (Lights, Ceiling Fans, Garage Doors) all have entirely different interfaces and methods (e.g., `light.turnOn()`, `garageDoor.open()`). If you hardcode the device actions directly into the remote's button logic, the remote becomes tightly coupled to specific vendor classes.\n\nThe Command pattern solves this by wrapping the request into a standalone object. You create a `Command` interface with a single `execute()` method. A `LightOnCommand` implements this interface and binds the specific `Light` receiver to its `turnOn()` action. The remote (Invoker) only needs to know how to call `execute()` on the command it holds, completely decoupling the remote from the physical devices.",
  "applicability": [
    "You want to parameterize objects with an action to perform (like menu items or buttons in a UI).",
    "You need to specify, queue, and execute requests at different times (e.g., thread pools or task queues).",
    "You need to support undo (un-execute) operations by storing state inside the command before it executes.",
    "You need to support logging changes so that they can be reapplied sequentially in case of a system crash."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 350\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n    .diamond { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; }\n  </style>\n\n  <!-- Invoker -->\n  <rect x=\"50\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"160\" y=\"55\" class=\"text-title\">Invoker</text>\n  <line x1=\"50\" y1=\"65\" x2=\"270\" y2=\"65\" class=\"line\" />\n  <text x=\"60\" y=\"85\" class=\"text-body\">+ setCommand(c: Command)</text>\n  <text x=\"60\" y=\"100\" class=\"text-body\">+ executeCommand()</text>\n\n  <!-- Command -->\n  <rect x=\"480\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"590\" y=\"55\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"590\" y=\"75\" class=\"text-title\">Command</text>\n  <line x1=\"480\" y1=\"85\" x2=\"700\" y2=\"85\" class=\"line\" />\n  <text x=\"490\" y=\"105\" class=\"text-body\">+ execute()</text>\n\n  <!-- Receiver -->\n  <rect x=\"50\" y=\"200\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"160\" y=\"225\" class=\"text-title\">Receiver</text>\n  <line x1=\"50\" y1=\"235\" x2=\"270\" y2=\"235\" class=\"line\" />\n  <text x=\"60\" y=\"255\" class=\"text-body\">+ action()</text>\n\n  <!-- Concrete Command -->\n  <rect x=\"480\" y=\"200\" width=\"220\" height=\"90\" class=\"box\" />\n  <text x=\"590\" y=\"225\" class=\"text-title\">ConcreteCommand</text>\n  <line x1=\"480\" y1=\"235\" x2=\"700\" y2=\"235\" class=\"line\" />\n  <text x=\"490\" y=\"255\" class=\"text-body\">- receiver: Receiver</text>\n  <text x=\"490\" y=\"275\" class=\"text-body\">+ execute()</text>\n\n  <!-- Invoker -> Command (Aggregation) -->\n  <path d=\"M 290 70 L 470 70\" class=\"line\" />\n  <polygon points=\"470,70 460,65 460,75\" class=\"arrow\" />\n  <polygon points=\"270,70 280,65 290,70 280,75\" class=\"diamond\" />\n\n  <!-- ConcreteCommand implements Command -->\n  <path d=\"M 590 200 L 590 110\" class=\"line dashed\" />\n  <polygon points=\"590,110 585,125 595,125\" class=\"arrow\" />\n\n  <!-- ConcreteCommand -> Receiver -->\n  <path d=\"M 480 250 L 280 250\" class=\"line\" />\n  <polygon points=\"280,250 290,245 290,255\" class=\"arrow\" />\n</svg>",
  "participants": [
    {
      "name": "Command",
      "desc": "Declares an interface for executing a specific operation."
    },
    {
      "name": "ConcreteCommand (LightOnCommand)",
      "desc": "Defines a binding between a Receiver object and an action. It implements the execute() method by invoking the corresponding operations on the Receiver."
    },
    {
      "name": "Client (RemoteLoader)",
      "desc": "Creates a ConcreteCommand object and sets its corresponding receiver."
    },
    {
      "name": "Invoker (RemoteControl)",
      "desc": "Holds a command and asks it to carry out the request by calling its execute() method."
    },
    {
      "name": "Receiver (Light)",
      "desc": "Knows how to perform the actual business logic or operations associated with carrying out a request."
    }
  ],
  "collaboration": "1. The Client creates a ConcreteCommand object and specifies its Receiver.\n2. An Invoker object stores the ConcreteCommand object (often passed in via a setter or constructor).\n3. The Invoker issues a request at a later point in time by calling `execute()` on the command.\n4. The ConcreteCommand intercepts this call and invokes the actual operational methods on its Receiver to carry out the request.",
  "consequences": [
    "Decoupling: It completely decouples the object that invokes the operation from the one that knows how to perform it.",
    "First-Class Objects: Commands are first-class objects. They can be manipulated, queued, logged, or passed around like any other object.",
    "Macro Commands: You can assemble multiple commands into a single composite command (e.g., a 'Party Mode' button that turns on lights, starts music, and dims blinds).",
    "Class Explosion: A potential downside is the proliferation of tiny Command classes for every single possible action in the system."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "Command",
          "code": "public interface Command {\n    public void execute();\n}"
        },
        {
          "name": "Light",
          "code": "// The Receiver\npublic class Light {\n    public void on() {\n        System.out.println(\"Light is On\");\n    }\n\n    public void off() {\n        System.out.println(\"Light is Off\");\n    }\n}"
        },
        {
          "name": "LightOnCommand",
          "code": "// The ConcreteCommand\npublic class LightOnCommand implements Command {\n    Light light;\n\n    public LightOnCommand(Light light) {\n        this.light = light;\n    }\n\n    public void execute() {\n        light.on();\n    }\n}"
        },
        {
          "name": "SimpleRemoteControl",
          "code": "// The Invoker\npublic class SimpleRemoteControl {\n    Command slot;\n\n    public SimpleRemoteControl() {}\n\n    public void setCommand(Command command) {\n        slot = command;\n    }\n\n    public void buttonWasPressed() {\n        slot.execute();\n    }\n}"
        },
        {
          "name": "RemoteControlTest",
          "code": "// The Client\npublic class RemoteControlTest {\n    public static void main(String[] args) {\n        SimpleRemoteControl remote = new SimpleRemoteControl();\n        Light light = new Light();\n        LightOnCommand lightOn = new LightOnCommand(light);\n\n        // Parameterize the invoker with the command\n        remote.setCommand(lightOn);\n        \n        // The invoker executes the command\n        remote.buttonWasPressed();\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Java's Runnable Interface: Runnable acts exactly like a Command. Thread pools or Schedulers (Invokers) execute these Runnable (Command) objects without needing to know what the task actually is.",
    "GUI Actions: Swing ActionListeners or standard UI button click handlers encapsulate an action to be performed when a button is clicked.",
    "Undo/Redo Mechanisms: By extending the Command interface to include an `undo()` method, commands can be stored on a history stack. Popping them off and calling `undo()` restores previous states."
  ],
  "related": [
    "memento",
    "composite",
    "prototype"
  ]
}
];
