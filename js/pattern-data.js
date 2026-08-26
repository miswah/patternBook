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
  // Composite - Structural
  // ============================================================
  {
  "id": "composite",
  "name": "Composite",
  "category": "structural",
  "difficulty": 3,
  "summary": "Compose objects into tree structures to represent part-whole hierarchies, allowing clients to treat individual objects and compositions uniformly.",
  "intent": "Composes objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.",
  "motivation": "Returning to the Objectville Restaurant merger, things have gotten more complicated. The Diner now wants to add a Dessert Menu as a *sub-menu* inside their main Lunch menu. Using the Iterator pattern alone breaks down because a menu now consists of individual items *and* other menus. \n\nIf the Waitress tries to print this, she would have to write complex logic to check if an item is a single dish or a whole sub-menu that needs its own iteration. The Composite pattern solves this by defining a single unified `MenuComponent` interface. Both individual `MenuItem`s (Leaves) and full `Menu`s (Composites) implement this interface. A `Menu` holds a collection of `MenuComponent`s (which could be items or other menus). Now, the Waitress just calls `print()` on the top-level menu. The composite automatically delegates `print()` to its children, recursively printing the entire tree without the Waitress knowing whether she is dealing with a single item or a massive sub-menu tree.",
  "applicability": [
    "When you need to represent part-whole hierarchies of objects (tree structures).",
    "When you want clients to be able to ignore the difference between compositions of objects and individual objects. Clients will treat all objects in the composite structure uniformly.",
    "When you are building recursive UI components, file systems, or nested category structures."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 450\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .diamond { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; }\n  </style>\n\n  <!-- Client -->\n  <rect x=\"50\" y=\"40\" width=\"150\" height=\"50\" class=\"box\" />\n  <text x=\"125\" y=\"70\" class=\"text-title\">Client</text>\n\n  <!-- Component Interface/Abstract Class -->\n  <rect x=\"300\" y=\"20\" width=\"220\" height=\"100\" class=\"box\" />\n  <text x=\"410\" y=\"45\" class=\"text-title\">&lt;&lt;abstract&gt;&gt;</text>\n  <text x=\"410\" y=\"65\" class=\"text-title\">Component</text>\n  <line x1=\"300\" y1=\"75\" x2=\"520\" y2=\"75\" class=\"line\" />\n  <text x=\"310\" y=\"90\" class=\"text-body\">+ operation()</text>\n  <text x=\"310\" y=\"105\" class=\"text-body\">+ add(Component c)</text>\n\n  <!-- Leaf -->\n  <rect x=\"150\" y=\"250\" width=\"200\" height=\"70\" class=\"box\" />\n  <text x=\"250\" y=\"280\" class=\"text-title\">Leaf</text>\n  <line x1=\"150\" y1=\"290\" x2=\"350\" y2=\"290\" class=\"line\" />\n  <text x=\"160\" y=\"310\" class=\"text-body\">+ operation()</text>\n\n  <!-- Composite -->\n  <rect x=\"450\" y=\"250\" width=\"220\" height=\"90\" class=\"box\" />\n  <text x=\"560\" y=\"280\" class=\"text-title\">Composite</text>\n  <line x1=\"450\" y1=\"290\" x2=\"670\" y2=\"290\" class=\"line\" />\n  <text x=\"460\" y=\"310\" class=\"text-body\">+ operation()</text>\n  <text x=\"460\" y=\"325\" class=\"text-body\">+ add(Component c)</text>\n\n  <!-- Client to Component -->\n  <path d=\"M 200 65 L 290 65\" class=\"line\" />\n  <polygon points=\"290,65 280,60 280,70\" class=\"arrow\" />\n\n  <!-- Leaf Implements/Extends Component -->\n  <path d=\"M 250 250 L 250 170 L 410 170 L 410 120\" class=\"line\" />\n  <polygon points=\"410,120 405,130 415,130\" class=\"arrow\" />\n\n  <!-- Composite Implements/Extends Component -->\n  <path d=\"M 560 250 L 560 170 L 410 170\" class=\"line\" />\n\n  <!-- Composite Contains Component (Aggregation) -->\n  <path d=\"M 670 295 L 750 295 L 750 70 L 535 70\" class=\"line\" />\n  <polygon points=\"535,70 545,65 545,75\" class=\"arrow\" />\n  <polygon points=\"670,295 680,290 690,295 680,300\" class=\"diamond\" />\n  <text x=\"755\" y=\"180\" class=\"text-body\">children</text>\n</svg>",
  "participants": [
    {
      "name": "Component (MenuComponent)",
      "desc": "Declares the interface for objects in the composition. Implements default behavior for the interface common to all classes (often throwing an exception for methods that don't apply, like add/remove on a Leaf)."
    },
    {
      "name": "Leaf (MenuItem)",
      "desc": "Represents leaf objects in the composition. A leaf has no children. It defines behavior for primitive objects in the composition."
    },
    {
      "name": "Composite (Menu)",
      "desc": "Defines behavior for components having children. Stores child components and implements child-related operations in the Component interface."
    },
    {
      "name": "Client (Waitress)",
      "desc": "Manipulates objects in the composition through the Component interface."
    }
  ],
  "collaboration": "1. The Client uses the Component class interface to interact with objects in the composite structure.\n2. If the recipient is a Leaf, the request is handled directly.\n3. If the recipient is a Composite, it usually forwards the request to its child components, possibly performing additional operations before and/or after forwarding.",
  "consequences": [
    "Uniformity: Clients can treat primitive objects and composite objects exactly the same. No messy `if (obj instanceof Composite)` checks everywhere.",
    "Extensibility: It's very easy to add new kinds of components to the tree. They just need to implement the Component interface.",
    "Loss of Strong Typing: The pattern often favors transparency (putting add/remove methods in the Component base class) over strict safety. This means you might not find out until runtime that you are trying to add an item to a Leaf.",
    "Overly General: It can be harder to restrict the components of a composite. Sometimes you want a composite to have only certain components, but the type system won't help you catch errors."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "MenuComponent",
          "code": "public abstract class MenuComponent {\n    // We throw UnsupportedOperationException by default so Leaves \n    // don't have to implement add/remove/getChild if they don't want to.\n    public void add(MenuComponent menuComponent) {\n        throw new UnsupportedOperationException();\n    }\n    public void remove(MenuComponent menuComponent) {\n        throw new UnsupportedOperationException();\n    }\n    public MenuComponent getChild(int i) {\n        throw new UnsupportedOperationException();\n    }\n    \n    // Operational methods\n    public String getName() {\n        throw new UnsupportedOperationException();\n    }\n    public double getPrice() {\n        throw new UnsupportedOperationException();\n    }\n    public void print() {\n        throw new UnsupportedOperationException();\n    }\n}"
        },
        {
          "name": "MenuItem",
          "code": "// The Leaf\npublic class MenuItem extends MenuComponent {\n    String name;\n    double price;\n\n    public MenuItem(String name, double price) {\n        this.name = name;\n        this.price = price;\n    }\n\n    public String getName() { return name; }\n    public double getPrice() { return price; }\n\n    public void print() {\n        System.out.println(\"  \" + getName() + \", \" + getPrice());\n    }\n}"
        },
        {
          "name": "Menu",
          "code": "import java.util.ArrayList;\nimport java.util.Iterator;\n\n// The Composite\npublic class Menu extends MenuComponent {\n    ArrayList<MenuComponent> menuComponents = new ArrayList<>();\n    String name;\n    String description;\n\n    public Menu(String name, String description) {\n        this.name = name;\n        this.description = description;\n    }\n\n    public void add(MenuComponent menuComponent) {\n        menuComponents.add(menuComponent);\n    }\n\n    public void remove(MenuComponent menuComponent) {\n        menuComponents.remove(menuComponent);\n    }\n\n    public MenuComponent getChild(int i) {\n        return menuComponents.get(i);\n    }\n\n    public String getName() { return name; }\n\n    public void print() {\n        System.out.print(\"\\n\" + getName());\n        System.out.println(\", \" + description);\n        System.out.println(\"---------------------\");\n\n        // The Composite recursively delegates printing to its children\n        Iterator<MenuComponent> iterator = menuComponents.iterator();\n        while (iterator.hasNext()) {\n            MenuComponent menuComponent = iterator.next();\n            menuComponent.print();\n        }\n    }\n}"
        },
        {
          "name": "Waitress",
          "code": "public class Waitress {\n    MenuComponent allMenus;\n\n    public Waitress(MenuComponent allMenus) {\n        this.allMenus = allMenus;\n    }\n\n    public void printMenu() {\n        // The Waitress doesn't care if it's a leaf or a composite!\n        allMenus.print();\n    }\n}"
        },
        {
          "name": "MenuTestDrive",
          "code": "public class MenuTestDrive {\n    public static void main(String args[]) {\n        MenuComponent pancakeHouseMenu = new Menu(\"PANCAKE HOUSE MENU\", \"Breakfast\");\n        MenuComponent dinerMenu = new Menu(\"DINER MENU\", \"Lunch\");\n        MenuComponent dessertMenu = new Menu(\"DESSERT MENU\", \"Dessert of course!\");\n\n        MenuComponent allMenus = new Menu(\"ALL MENUS\", \"All menus combined\");\n\n        allMenus.add(pancakeHouseMenu);\n        allMenus.add(dinerMenu);\n\n        dinerMenu.add(new MenuItem(\"Pasta\", 3.89));\n        // Adding a composite (sub-menu) inside a composite\n        dinerMenu.add(dessertMenu);\n\n        dessertMenu.add(new MenuItem(\"Apple Pie\", 1.59));\n\n        Waitress waitress = new Waitress(allMenus);\n        waitress.printMenu();\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "File Systems: Files are leaves; Directories are composites. A directory can hold files and other directories, and operations like `delete()` or `getSize()` recursively apply to the whole tree.",
    "UI Toolkits: In frameworks like Java Swing, React, or HTML DOM, a UI element (like a `JPanel` or a `<div>`) can contain primitive elements (like buttons) or other nested containers. Rendering or event bubbling propagates through the composite tree.",
    "Graphics Systems: Grouping shapes in drawing applications (like grouping a circle and square together so they scale and move as a single entity)."
  ],
  "related": [
    "iterator",
    "decorator",
    "visitor"
  ]
  },
  // ============================================================
  // Proxy - Structural
  // ============================================================
  {
  "id": "proxy",
  "name": "Proxy",
  "category": "structural",
  "difficulty": 3,
  "summary": "Provide a surrogate or placeholder for another object to control access to it.",
  "intent": "Provides a surrogate or placeholder for another object to control access to it. It allows you to perform something either before or after the request gets through to the original object.",
  "motivation": "Imagine you are building a CD/Album Cover Viewer application. The app fetches high-resolution images over a slow network. If you instantiate a real `HighResImage` object and wait for the image to download, your entire UI will freeze, making the app look broken.\n\nThe Proxy pattern solves this by creating a \"Virtual Proxy\" (`ImageProxy`) that acts as a stand-in for the real image. Both the proxy and the real image implement the same `Icon` interface. When the UI asks the proxy to `draw()` itself, the proxy immediately draws a \"Loading CD cover, please wait...\" message on the screen and fires off a background thread to download the actual image. Once the real image is fully instantiated and loaded, the proxy seamlessly delegates all future `draw()` calls to the real image. The client (the UI) has absolutely no idea it was talking to a proxy instead of the real thing.",
  "applicability": [
    "Remote Proxy: When you need a local representative for an object that lives in a different JVM or network space (e.g., Java RMI, gRPC stubs).",
    "Virtual Proxy: When you need to create expensive objects on demand or hide the fact that an object hasn't been fully loaded yet (lazy loading).",
    "Protection Proxy: When you need to control access to the original object based on access rights or roles (e.g., controlling who can modify employee records)."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 400\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n  </style>\n\n  <!-- Client -->\n  <rect x=\"50\" y=\"50\" width=\"150\" height=\"50\" class=\"box\" />\n  <text x=\"125\" y=\"80\" class=\"text-title\">Client</text>\n\n  <!-- Subject Interface -->\n  <rect x=\"350\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"460\" y=\"55\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"460\" y=\"75\" class=\"text-title\">Subject</text>\n  <line x1=\"350\" y1=\"85\" x2=\"570\" y2=\"85\" class=\"line\" />\n  <text x=\"360\" y=\"100\" class=\"text-body\">+ request()</text>\n\n  <!-- RealSubject -->\n  <rect x=\"180\" y=\"220\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"290\" y=\"245\" class=\"text-title\">RealSubject</text>\n  <line x1=\"180\" y1=\"255\" x2=\"400\" y2=\"255\" class=\"line\" />\n  <text x=\"190\" y=\"275\" class=\"text-body\">+ request()</text>\n\n  <!-- Proxy -->\n  <rect x=\"520\" y=\"220\" width=\"220\" height=\"90\" class=\"box\" />\n  <text x=\"630\" y=\"245\" class=\"text-title\">Proxy</text>\n  <line x1=\"520\" y1=\"255\" x2=\"740\" y2=\"255\" class=\"line\" />\n  <text x=\"530\" y=\"275\" class=\"text-body\">- realSubject: RealSubject</text>\n  <text x=\"530\" y=\"295\" class=\"text-body\">+ request()</text>\n\n  <!-- Client to Subject -->\n  <path d=\"M 200 75 L 340 75\" class=\"line\" />\n  <polygon points=\"340,75 330,70 330,80\" class=\"arrow\" />\n\n  <!-- Implementations -->\n  <path d=\"M 290 220 L 290 150 L 460 150 L 460 110\" class=\"line dashed\" />\n  <polygon points=\"460,110 455,120 465,120\" class=\"arrow\" />\n\n  <path d=\"M 630 220 L 630 150 L 460 150\" class=\"line dashed\" />\n\n  <!-- Proxy to RealSubject (Association) -->\n  <path d=\"M 520 260 L 410 260\" class=\"line\" />\n  <polygon points=\"410,260 420,255 420,265\" class=\"arrow\" />\n  <text x=\"445\" y=\"255\" class=\"text-body\">controls &gt;</text>\n\n  <!-- Note/Delegation Callout -->\n  <path d=\"M 630 310 L 630 360 L 520 360\" class=\"line dashed\" />\n  <rect x=\"300\" y=\"340\" width=\"220\" height=\"40\" class=\"box\" style=\"fill: #fff3cd; stroke: #ffc107; stroke-dasharray: 4,4;\" />\n  <text x=\"410\" y=\"365\" class=\"text-body\" style=\"text-anchor: middle; font-family: monospace;\">realSubject.request();</text>\n</svg>",
  "participants": [
    {
      "name": "Subject (Icon)",
      "desc": "Defines the common interface for RealSubject and Proxy so that the Proxy can be used anywhere a RealSubject is expected."
    },
    {
      "name": "RealSubject (ImageIcon)",
      "desc": "The real object that the proxy represents. It performs the actual, heavy, or secure work."
    },
    {
      "name": "Proxy (ImageProxy)",
      "desc": "Maintains a reference that lets the proxy access the real subject. It controls access to the real subject and may be responsible for creating and deleting it."
    }
  ],
  "collaboration": "1. The Client makes a request to the Proxy, believing it is talking to the RealSubject (because they share the same interface).\n2. The Proxy intercepts the request. It may do some work first (like checking permissions, fetching from a cache, or drawing a loading screen).\n3. If appropriate, the Proxy delegates the request to the RealSubject.\n4. The RealSubject executes the request and returns the result back through the Proxy to the Client.",
  "consequences": [
    "Separation of Concerns: It separates the core business logic (RealSubject) from the housekeeping logic (caching, loading, access control, network communication).",
    "Transparency: The Client doesn't need to be rewritten to support the proxy; the interface remains identical.",
    "Performance Optimization: Virtual proxies and caching proxies can drastically improve perceived and actual application performance.",
    "Overhead/Indirection: Introduces another layer of abstraction, which can sometimes complicate debugging or add a tiny amount of performance overhead due to the delegation."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "Icon",
          "code": "// The Subject Interface\npublic interface Icon {\n    int getIconWidth();\n    int getIconHeight();\n    void paintIcon();\n}"
        },
        {
          "name": "ImageIcon",
          "code": "// The RealSubject (simplified for example)\npublic class ImageIcon implements Icon {\n    private String imageUrl;\n\n    public ImageIcon(String imageUrl) {\n        this.imageUrl = imageUrl;\n        // Imagine this constructor takes 5 seconds to download the image\n        simulateNetworkDelay(); \n    }\n\n    public int getIconWidth() { return 800; }\n    public int getIconHeight() { return 600; }\n\n    public void paintIcon() {\n        System.out.println(\"Drawing the high-res image from: \" + imageUrl);\n    }\n\n    private void simulateNetworkDelay() {\n        try {\n            Thread.sleep(3000);\n        } catch (InterruptedException e) {\n            e.printStackTrace();\n        }\n    }\n}"
        },
        {
          "name": "ImageProxy",
          "code": "// The Virtual Proxy\npublic class ImageProxy implements Icon {\n    private ImageIcon imageIcon; // The RealSubject\n    private String imageUrl;\n    private boolean retrieving = false;\n\n    public ImageProxy(String imageUrl) {\n        this.imageUrl = imageUrl;\n    }\n\n    public int getIconWidth() {\n        if (imageIcon != null) return imageIcon.getIconWidth();\n        return 800; // Default loading width\n    }\n\n    public int getIconHeight() {\n        if (imageIcon != null) return imageIcon.getIconHeight();\n        return 600; // Default loading height\n    }\n\n    public void paintIcon() {\n        if (imageIcon != null) {\n            // If the real subject is ready, delegate to it!\n            imageIcon.paintIcon();\n        } else {\n            // Otherwise, show a loading message and load it in the background\n            System.out.println(\"Loading CD cover, please wait...\");\n            if (!retrieving) {\n                retrieving = true;\n                \n                // Background thread to prevent UI freezing\n                new Thread(() -> {\n                    try {\n                        imageIcon = new ImageIcon(imageUrl);\n                        // Once loaded, we would typically trigger a UI repaint here\n                        System.out.println(\"Image loaded! Next paint will show it.\");\n                    } catch (Exception e) {\n                        e.printStackTrace();\n                    }\n                }).start();\n            }\n        }\n    }\n}"
        },
        {
          "name": "Client",
          "code": "public class Client {\n    public static void main(String[] args) {\n        // The Client thinks it's just getting a regular Icon\n        Icon cdCover = new ImageProxy(\"http://images.com/album.jpg\");\n\n        // The first time it paints, it shows \"Loading...\"\n        cdCover.paintIcon();\n\n        // Simulate some time passing while the background thread works\n        try { Thread.sleep(4000); } catch (Exception e) {}\n\n        // The next time it paints, the proxy delegates to the real object\n        cdCover.paintIcon();\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Hibernate / Entity Framework: Object-Relational Mappers (ORMs) heavily use Virtual Proxies. When you load a `User` from the database, their list of `Orders` might be a proxy. The actual SQL query to fetch the orders isn't executed until you call `user.getOrders()`, saving massive amounts of memory and time.",
    "Java Dynamic Proxies (`java.lang.reflect.Proxy`): Allows you to create proxy classes on the fly at runtime, commonly used for Protection Proxies or wrapping method calls with AOP (Aspect Oriented Programming) logging/transactions.",
    "gRPC / Java RMI: Remote method calls use Remote Proxies (stubs). The client calls a method on a local proxy object, which marshals the arguments, sends them over the network to the real object on the server, and returns the result."
  ],
  "related": [
    "adapter",
    "decorator",
    "facade"
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
  },
  // ============================================================
  // Template - Behavioral
  // ============================================================
  {
  "id": "template-method",
  "name": "Template Method",
  "category": "behavioral",
  "difficulty": 1,
  "summary": "Define the skeleton of an algorithm in a base class, letting subclasses override specific steps without changing the algorithm's structure.",
  "intent": "Defines the skeleton of an algorithm in a method, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.",
  "motivation": "Imagine you are building a system for a barista. You have classes for `Coffee` and `Tea`. Both beverages follow a very similar recipe: boil water, brew the beverage, pour it into a cup, and add condiments. If you write separate classes for both, you'll duplicate the recipe structure and the common steps (boiling water, pouring). \n\nThe Template Method pattern solves this by putting the basic recipe inside a `prepareRecipe()` method in an abstract base class (`CaffeineBeverage`). This method acts as a template, calling a series of helper methods in a specific order. The shared steps (`boilWater`, `pourInCup`) are implemented directly in the base class. The specific steps (`brew`, `addCondiments`) are declared as abstract, forcing the `Coffee` and `Tea` subclasses to provide their own specific implementations. This ensures the overarching algorithm remains exactly the same while allowing localized variations.",
  "applicability": [
    "To implement the invariant parts of an algorithm once and leave it up to subclasses to implement the behavior that can vary.",
    "When common behavior among subclasses should be factored and localized in a common class to avoid code duplication.",
    "To control subclass extensions. You can define a template method that calls \"hook\" operations at specific points, permitting extensions only at those exact points."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 450\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .note-box { fill: #fff3cd; stroke: #ffc107; stroke-width: 1; rx: 5; stroke-dasharray: 4,4; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .text-code { font-family: monospace; font-size: 11px; fill: #212529; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n  </style>\n\n  <!-- Abstract Class -->\n  <rect x=\"250\" y=\"40\" width=\"250\" height=\"120\" class=\"box\" />\n  <text x=\"375\" y=\"65\" class=\"text-title\">&lt;&lt;abstract&gt;&gt;</text>\n  <text x=\"375\" y=\"85\" class=\"text-title\">AbstractClass</text>\n  <line x1=\"250\" y1=\"95\" x2=\"500\" y2=\"95\" class=\"line\" />\n  <text x=\"260\" y=\"115\" class=\"text-body\">+ templateMethod()</text>\n  <text x=\"260\" y=\"135\" class=\"text-body\"># primitiveOperation1()</text>\n  <text x=\"260\" y=\"150\" class=\"text-body\"># primitiveOperation2()</text>\n\n  <!-- Concrete Class -->\n  <rect x=\"250\" y=\"250\" width=\"250\" height=\"80\" class=\"box\" />\n  <text x=\"375\" y=\"275\" class=\"text-title\">ConcreteClass</text>\n  <line x1=\"250\" y1=\"285\" x2=\"500\" y2=\"285\" class=\"line\" />\n  <text x=\"260\" y=\"305\" class=\"text-body\"># primitiveOperation1()</text>\n  <text x=\"260\" y=\"320\" class=\"text-body\"># primitiveOperation2()</text>\n\n  <!-- Inheritance Arrow -->\n  <path d=\"M 375 250 L 375 175\" class=\"line\" />\n  <polygon points=\"375,160 365,175 385,175\" class=\"arrow\" />\n\n  <!-- Note/Callout for Template Method -->\n  <rect x=\"550\" y=\"60\" width=\"220\" height=\"80\" class=\"note-box\" />\n  <text x=\"560\" y=\"80\" class=\"text-code\">primitiveOperation1();</text>\n  <text x=\"560\" y=\"95\" class=\"text-code\">...</text>\n  <text x=\"560\" y=\"110\" class=\"text-code\">primitiveOperation2();</text>\n  <text x=\"560\" y=\"125\" class=\"text-code\">...</text>\n\n  <!-- Note connection line -->\n  <path d=\"M 380 110 L 550 100\" class=\"line dashed\" />\n  <circle cx=\"375\" cy=\"111\" r=\"3\" fill=\"#343a40\" />\n</svg>",
  "participants": [
    {
      "name": "AbstractClass (CaffeineBeverage)",
      "desc": "Defines abstract primitive operations that concrete subclasses define to implement steps of an algorithm. Implements a template method defining the skeleton of an algorithm."
    },
    {
      "name": "ConcreteClass (Coffee, Tea)",
      "desc": "Implements the primitive operations to carry out subclass-specific steps of the algorithm. Cannot override the template method itself (usually marked final)."
    }
  ],
  "collaboration": "1. A client calls the template method on the AbstractClass (often via a ConcreteClass instance).\n2. The template method executes the algorithm step-by-step.\n3. When the algorithm reaches an abstract method or a \"hook\", it relies on the ConcreteClass's specific implementation to fulfill that step, before continuing the overall flow.",
  "consequences": [
    "Code Reuse: Fundamentally promotes code reuse by extracting the common algorithm structure into a single location.",
    "Inverted Control (Hollywood Principle): \"Don't call us, we'll call you.\" The parent abstract class drives the algorithm and calls the subclass operations when needed, not the other way around.",
    "Rigidity: Subclasses are strictly bound by the overall flow of the algorithm. If a subclass needs to drastically change the order of operations, the Template Method might be too restrictive.",
    "Liskov Substitution Risks: Subclasses must be careful not to violate the intended semantics of the overridden steps, otherwise they might break the base algorithm."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "CaffeineBeverage",
          "code": "public abstract class CaffeineBeverage {\n    // The Template Method is marked final so subclasses can't change the algorithm steps\n    public final void prepareRecipe() {\n        boilWater();\n        brew();\n        pourInCup();\n        // Using a \"hook\" to conditionally execute a step\n        if (customerWantsCondiments()) {\n            addCondiments();\n        }\n    }\n\n    // Abstract methods must be implemented by subclasses\n    abstract void brew();\n    abstract void addCondiments();\n\n    // Concrete methods are shared across all subclasses\n    void boilWater() {\n        System.out.println(\"Boiling water\");\n    }\n\n    void pourInCup() {\n        System.out.println(\"Pouring into cup\");\n    }\n\n    // A \"Hook\" method. It has a default implementation, but can be overridden\n    boolean customerWantsCondiments() {\n        return true;\n    }\n}"
        },
        {
          "name": "Tea",
          "code": "public class Tea extends CaffeineBeverage {\n    public void brew() {\n        System.out.println(\"Steeping the tea\");\n    }\n\n    public void addCondiments() {\n        System.out.println(\"Adding Lemon\");\n    }\n}"
        },
        {
          "name": "Coffee",
          "code": "import java.io.BufferedReader;\nimport java.io.InputStreamReader;\n\npublic class Coffee extends CaffeineBeverage {\n    public void brew() {\n        System.out.println(\"Dripping Coffee through filter\");\n    }\n\n    public void addCondiments() {\n        System.out.println(\"Adding Sugar and Milk\");\n    }\n\n    // Overriding the hook method to provide custom logic\n    public boolean customerWantsCondiments() {\n        String answer = getUserInput();\n        return answer.toLowerCase().startsWith(\"y\");\n    }\n\n    private String getUserInput() {\n        // Dummy implementation for brevity\n        return \"yes\";\n    }\n}"
        },
        {
          "name": "BeverageTestDrive",
          "code": "public class BeverageTestDrive {\n    public static void main(String[] args) {\n        Tea myTea = new Tea();\n        Coffee myCoffee = new Coffee();\n\n        System.out.println(\"\\nMaking tea...\");\n        myTea.prepareRecipe();\n\n        System.out.println(\"\\nMaking coffee...\");\n        myCoffee.prepareRecipe();\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Java Arrays.sort(): Uses a template method under the hood, dictating the sorting algorithm but relying on the `compareTo()` method implemented by the objects being sorted to determine order.",
    "Spring Framework: Heavily relies on this pattern in classes like `JdbcTemplate`, `RestTemplate`, and `JmsTemplate` to manage boilerplate connection setup/teardown while deferring specific SQL queries or mapping logic to the developer.",
    "UI Lifecycles: Framework hooks like React's `componentDidMount()`, Vue's `mounted()`, or Android Activity lifecycles (`onCreate()`, `onPause()`) are essentially hook methods called by a central template method controlling the UI lifecycle."
  ],
  "related": [
    "strategy",
    "factory-method"
  ]
  },
  // ===========================================================
  // Iterator - Behavioral
  // ===========================================================
  {
  "id": "iterator",
  "name": "Iterator",
  "category": "behavioral",
  "difficulty": 2,
  "summary": "Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
  "intent": "Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
  "motivation": "Imagine two restaurants, the Objectville Diner and the Objectville Pancake House, are merging. The Waitress needs to print a combined menu. However, the Pancake House stores its menu items in an `ArrayList`, while the Diner uses a standard Java `Array`. \n\nIf the Waitress tries to print both, she has to write two separate loops, exposing the internal implementation details of both menus directly in her code. If a third restaurant joins using a `HashMap`, she has to write yet another loop. The Iterator pattern solves this by encapsulating the iteration logic into a separate `Iterator` object. Both menus implement a `createIterator()` method that returns an object implementing a standard `Iterator` interface (`hasNext()`, `next()`). The Waitress now only interacts with the `Iterator`, completely decoupled from how the menus actually store their data.",
  "applicability": [
    "When you need to access an aggregate object's contents without exposing its internal representation (data structures).",
    "When you want to support multiple traversals of aggregate objects (e.g., forward, backward, filtered).",
    "When you want to provide a uniform interface for traversing different aggregate structures (polymorphic iteration)."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 450\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n    .diamond { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; }\n  </style>\n\n  <!-- Client -->\n  <rect x=\"300\" y=\"20\" width=\"200\" height=\"50\" class=\"box\" />\n  <text x=\"400\" y=\"50\" class=\"text-title\">Client</text>\n\n  <!-- Aggregate Interface -->\n  <rect x=\"100\" y=\"120\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"210\" y=\"145\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"210\" y=\"165\" class=\"text-title\">Aggregate</text>\n  <line x1=\"100\" y1=\"175\" x2=\"320\" y2=\"175\" class=\"line\" />\n  <text x=\"110\" y=\"190\" class=\"text-body\">+ createIterator(): Iterator</text>\n\n  <!-- Iterator Interface -->\n  <rect x=\"480\" y=\"120\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"590\" y=\"145\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"590\" y=\"165\" class=\"text-title\">Iterator</text>\n  <line x1=\"480\" y1=\"175\" x2=\"700\" y2=\"175\" class=\"line\" />\n  <text x=\"490\" y=\"190\" class=\"text-body\">+ hasNext(): boolean</text>\n  <text x=\"490\" y=\"205\" class=\"text-body\">+ next(): Object</text>\n\n  <!-- Concrete Aggregate -->\n  <rect x=\"100\" y=\"280\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"210\" y=\"305\" class=\"text-title\">ConcreteAggregate</text>\n  <line x1=\"100\" y1=\"315\" x2=\"320\" y2=\"315\" class=\"line\" />\n  <text x=\"110\" y=\"335\" class=\"text-body\">+ createIterator(): Iterator</text>\n\n  <!-- Concrete Iterator -->\n  <rect x=\"480\" y=\"280\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"590\" y=\"305\" class=\"text-title\">ConcreteIterator</text>\n  <line x1=\"480\" y1=\"315\" x2=\"700\" y2=\"315\" class=\"line\" />\n  <text x=\"490\" y=\"335\" class=\"text-body\">+ hasNext(): boolean</text>\n  <text x=\"490\" y=\"350\" class=\"text-body\">+ next(): Object</text>\n\n  <!-- Client to Aggregate -->\n  <path d=\"M 320 70 L 210 70 L 210 110\" class=\"line\" />\n  <polygon points=\"210,110 205,100 215,100\" class=\"arrow\" />\n\n  <!-- Client to Iterator -->\n  <path d=\"M 480 70 L 590 70 L 590 110\" class=\"line\" />\n  <polygon points=\"590,110 585,100 595,100\" class=\"arrow\" />\n\n  <!-- Implements Aggregate -->\n  <path d=\"M 210 280 L 210 200\" class=\"line dashed\" />\n  <polygon points=\"210,200 205,210 215,210\" class=\"arrow\" />\n\n  <!-- Implements Iterator -->\n  <path d=\"M 590 280 L 590 200\" class=\"line dashed\" />\n  <polygon points=\"590,200 585,210 595,210\" class=\"arrow\" />\n\n  <!-- ConcreteAggregate creates ConcreteIterator -->\n  <path d=\"M 320 320 L 470 320\" class=\"line dashed\" />\n  <polygon points=\"470,320 460,315 460,325\" class=\"arrow\" />\n  <text x=\"365\" y=\"310\" class=\"text-body\">creates &gt;</text>\n</svg>",
  "participants": [
    {
      "name": "Iterator",
      "desc": "Defines an interface for accessing and traversing elements. Usually includes methods like `hasNext()`, `next()`, and optionally `remove()`."
    },
    {
      "name": "ConcreteIterator",
      "desc": "Implements the Iterator interface and keeps track of the current position in the traversal of the aggregate."
    },
    {
      "name": "Aggregate (Menu)",
      "desc": "Defines an interface for creating an Iterator object."
    },
    {
      "name": "ConcreteAggregate (DinerMenu)",
      "desc": "Implements the Aggregate interface and returns an instance of the proper ConcreteIterator."
    }
  ],
  "collaboration": "1. The Client asks the Aggregate object to generate an Iterator.\n2. The Aggregate instantiates and returns a ConcreteIterator tied to its specific internal data structure.\n3. The Client uses the Iterator's generic methods (`hasNext()`, `next()`) to traverse the elements, completely unaware of whether the underlying data is an Array, a List, a Tree, etc.",
  "consequences": [
    "Single Responsibility Principle: It extracts the heavy traversal code out of the aggregate class, simplifying it.",
    "Open/Closed Principle: You can implement new types of collections and iterators and pass them to existing code without breaking anything.",
    "Uniform Interface: It provides a standard way to iterate over entirely different data structures, enabling polymorphism.",
    "Overkill for Simple Collections: If your application only works with standard collections and standard loops, creating custom iterators might be unnecessary complexity."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "MenuItem",
          "code": "public class MenuItem {\n    String name;\n    double price;\n\n    public MenuItem(String name, double price) {\n        this.name = name;\n        this.price = price;\n    }\n\n    public String getName() { return name; }\n    public double getPrice() { return price; }\n}"
        },
        {
          "name": "Menu",
          "code": "import java.util.Iterator;\n\n// The Aggregate interface\npublic interface Menu {\n    public Iterator<MenuItem> createIterator();\n}"
        },
        {
          "name": "DinerMenuIterator",
          "code": "import java.util.Iterator;\n\n// The ConcreteIterator for an Array\npublic class DinerMenuIterator implements Iterator<MenuItem> {\n    MenuItem[] items;\n    int position = 0;\n\n    public DinerMenuIterator(MenuItem[] items) {\n        this.items = items;\n    }\n\n    public MenuItem next() {\n        MenuItem menuItem = items[position];\n        position = position + 1;\n        return menuItem;\n    }\n\n    public boolean hasNext() {\n        if (position >= items.length || items[position] == null) {\n            return false;\n        } else {\n            return true;\n        }\n    }\n}"
        },
        {
          "name": "DinerMenu",
          "code": "import java.util.Iterator;\n\n// The ConcreteAggregate\npublic class DinerMenu implements Menu {\n    static final int MAX_ITEMS = 6;\n    int numberOfItems = 0;\n    MenuItem[] menuItems;\n\n    public DinerMenu() {\n        menuItems = new MenuItem[MAX_ITEMS];\n        addItem(\"Vegetarian BLT\", 2.99);\n        addItem(\"Soup of the day\", 3.29);\n    }\n\n    public void addItem(String name, double price) {\n        MenuItem menuItem = new MenuItem(name, price);\n        if (numberOfItems >= MAX_ITEMS) {\n            System.err.println(\"Menu is full!\");\n        } else {\n            menuItems[numberOfItems] = menuItem;\n            numberOfItems = numberOfItems + 1;\n        }\n    }\n\n    // Returns the custom Iterator\n    public Iterator<MenuItem> createIterator() {\n        return new DinerMenuIterator(menuItems);\n    }\n}"
        },
        {
          "name": "Waitress",
          "code": "import java.util.Iterator;\n\n// The Client\npublic class Waitress {\n    Menu dinerMenu;\n    Menu pancakeHouseMenu; // Assuming this returns standard ArrayList.iterator()\n\n    public Waitress(Menu pancakeHouseMenu, Menu dinerMenu) {\n        this.pancakeHouseMenu = pancakeHouseMenu;\n        this.dinerMenu = dinerMenu;\n    }\n\n    public void printMenu() {\n        Iterator<MenuItem> pancakeIterator = pancakeHouseMenu.createIterator();\n        Iterator<MenuItem> dinerIterator = dinerMenu.createIterator();\n\n        System.out.println(\"MENU\\n----\\nBREAKFAST\");\n        printMenu(pancakeIterator);\n        System.out.println(\"\\nLUNCH\");\n        printMenu(dinerIterator);\n    }\n\n    // Overloaded method that only depends on the Iterator interface\n    private void printMenu(Iterator<MenuItem> iterator) {\n        while (iterator.hasNext()) {\n            MenuItem menuItem = iterator.next();\n            System.out.println(menuItem.getName() + \", \" + menuItem.getPrice());\n        }\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "Java Collections Framework: The `java.util.Iterator` interface is the standard implementation. Every standard collection (`ArrayList`, `HashSet`, etc.) implements `Iterable` and provides an iterator.",
    "Enhanced For-Loops: The \"for-each\" loop in Java (`for (Item i : list)`) is syntactic sugar that compiles down to using an Iterator under the hood.",
    "C# LINQ & Enumerators: The `IEnumerable` and `IEnumerator` interfaces in .NET are direct implementations of the Iterator pattern used extensively across the C# language."
  ],
  "related": [
    "composite",
    "factory-method",
    "visitor"
  ]
  },
  // ===========================================================
  // State - Behavioral
  // ===========================================================
  {
  "id": "state",
  "name": "State",
  "category": "behavioral",
  "difficulty": 3,
  "summary": "Allow an object to alter its behavior when its internal state changes, making it appear as if it changed its class.",
  "intent": "Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.",
  "motivation": "Imagine you are writing the software for a Mighty Gumball, Inc. gumball machine. The machine goes through various states: `NoQuarter`, `HasQuarter`, `Sold`, and `SoldOut`. Initially, you might implement actions like `insertQuarter()` or `turnCrank()` using massive `switch` or `if-else` statements checking the current state. \n\nThis becomes a maintenance nightmare. If Mighty Gumball wants to add a 1-in-10 \"Winner\" state (you get two gumballs for one quarter), you have to open up and modify every single method in the class, risking breaking existing code. The State pattern solves this by encapsulating each state's behavior into its own distinct class (e.g., `HasQuarterState`). The `GumballMachine` (the Context) simply holds a reference to a `State` object and delegates all actions to it. When it's time to transition, the current state object updates the context to hold a new state object. The messy conditional logic disappears, replaced by polymorphism.",
  "applicability": [
    "When an object's behavior depends on its state, and it must change its behavior at runtime depending on that state.",
    "When operations have massive, multipart conditional statements that depend on the object's state. The State pattern puts each branch of the conditional in a separate class."
  ],
  "structureSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 350\" width=\"100%\" height=\"100%\">\n  <style>\n    .box { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; rx: 5; }\n    .text-title { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #212529; text-anchor: middle; }\n    .text-body { font-family: sans-serif; font-size: 12px; fill: #495057; }\n    .line { stroke: #343a40; stroke-width: 2; fill: none; }\n    .arrow { fill: #343a40; }\n    .dashed { stroke-dasharray: 5,5; }\n    .diamond { fill: #f8f9fa; stroke: #343a40; stroke-width: 2; }\n  </style>\n\n  <!-- Context -->\n  <rect x=\"50\" y=\"30\" width=\"220\" height=\"90\" class=\"box\" />\n  <text x=\"160\" y=\"55\" class=\"text-title\">Context</text>\n  <line x1=\"50\" y1=\"65\" x2=\"270\" y2=\"65\" class=\"line\" />\n  <text x=\"60\" y=\"85\" class=\"text-body\">+ request()</text>\n  <text x=\"60\" y=\"105\" class=\"text-body\">+ setState(State s)</text>\n\n  <!-- State Interface -->\n  <rect x=\"480\" y=\"30\" width=\"220\" height=\"80\" class=\"box\" />\n  <text x=\"590\" y=\"55\" class=\"text-title\">&lt;&lt;interface&gt;&gt;</text>\n  <text x=\"590\" y=\"75\" class=\"text-title\">State</text>\n  <line x1=\"480\" y1=\"85\" x2=\"700\" y2=\"85\" class=\"line\" />\n  <text x=\"490\" y=\"100\" class=\"text-body\">+ handle()</text>\n\n  <!-- Concrete State A -->\n  <rect x=\"350\" y=\"200\" width=\"200\" height=\"70\" class=\"box\" />\n  <text x=\"450\" y=\"225\" class=\"text-title\">ConcreteStateA</text>\n  <line x1=\"350\" y1=\"235\" x2=\"550\" y2=\"235\" class=\"line\" />\n  <text x=\"360\" y=\"255\" class=\"text-body\">+ handle()</text>\n\n  <!-- Concrete State B -->\n  <rect x=\"570\" y=\"200\" width=\"200\" height=\"70\" class=\"box\" />\n  <text x=\"670\" y=\"225\" class=\"text-title\">ConcreteStateB</text>\n  <line x1=\"570\" y1=\"235\" x2=\"770\" y2=\"235\" class=\"line\" />\n  <text x=\"580\" y=\"255\" class=\"text-body\">+ handle()</text>\n\n  <!-- Context -> State (Aggregation) -->\n  <path d=\"M 270 70 L 470 70\" class=\"line\" />\n  <polygon points=\"470,70 460,65 460,75\" class=\"arrow\" />\n  <polygon points=\"270,70 280,65 290,70 280,75\" class=\"diamond\" />\n  <text x=\"355\" y=\"60\" class=\"text-body\">state</text>\n\n  <!-- Note/Delegation Callout -->\n  <path d=\"M 140 100 L 140 160 L 250 160\" class=\"line dashed\" />\n  <rect x=\"250\" y=\"140\" width=\"140\" height=\"40\" class=\"box\" style=\"fill: #fff3cd; stroke: #ffc107; stroke-dasharray: 4,4;\" />\n  <text x=\"320\" y=\"165\" class=\"text-body\" style=\"text-anchor: middle;\">state.handle()</text>\n\n  <!-- Inheritance Arrows -->\n  <path d=\"M 450 200 L 450 140 L 590 140 L 590 110\" class=\"line dashed\" />\n  <path d=\"M 670 200 L 670 140 L 590 140 L 590 110\" class=\"line dashed\" />\n  <polygon points=\"590,110 585,120 595,120\" class=\"arrow\" />\n</svg>",
  "participants": [
    {
      "name": "Context (GumballMachine)",
      "desc": "Defines the interface of interest to clients. Maintains an instance of a ConcreteState subclass that defines the current state."
    },
    {
      "name": "State",
      "desc": "Defines an interface for encapsulating the behavior associated with a particular state of the Context."
    },
    {
      "name": "ConcreteState (HasQuarterState, NoQuarterState)",
      "desc": "Each subclass implements a behavior associated with a state of the Context. Can also handle state transitions by setting a new state on the Context."
    }
  ],
  "collaboration": "1. The Client interacts with the Context object (e.g., calling `insertQuarter()`).\n2. The Context delegates the handling of that request to its current State object.\n3. The State object executes the appropriate behavior. If a state transition is required, the State object (or sometimes the Context itself) updates the Context's current state reference to a new ConcreteState object.",
  "consequences": [
    "Localizes State Behavior: It puts all behavior associated with a particular state into one object. This makes adding new states incredibly easy (just add a new class) compared to hunting down conditional statements.",
    "State Transitions are Explicit: Instead of state changes being an assignment to some internal integer or string variable, transitions are explicit class changes, reducing subtle bugs.",
    "Increased Number of Classes: Like many design patterns, it trades complex logic for a larger number of classes. For very simple state machines, this pattern might be overkill.",
    "Shared States: If State objects have no instance variables (meaning their behavior entirely depends on arguments passed in), they can be shared among multiple Contexts (acting as Flyweights)."
  ],
  "implementations": [
    {
      "language": "Java",
      "classes": [
        {
          "name": "State",
          "code": "public interface State {\n    void insertQuarter();\n    void ejectQuarter();\n    void turnCrank();\n    void dispense();\n}"
        },
        {
          "name": "NoQuarterState",
          "code": "public class NoQuarterState implements State {\n    GumballMachine gumballMachine;\n\n    public NoQuarterState(GumballMachine gumballMachine) {\n        this.gumballMachine = gumballMachine;\n    }\n\n    public void insertQuarter() {\n        System.out.println(\"You inserted a quarter\");\n        // Transition to the new state\n        gumballMachine.setState(gumballMachine.getHasQuarterState());\n    }\n\n    public void ejectQuarter() {\n        System.out.println(\"You haven't inserted a quarter\");\n    }\n\n    public void turnCrank() {\n        System.out.println(\"You turned, but there's no quarter\");\n    }\n\n    public void dispense() {\n        System.out.println(\"You need to pay first\");\n    }\n}"
        },
        {
          "name": "HasQuarterState",
          "code": "public class HasQuarterState implements State {\n    GumballMachine gumballMachine;\n\n    public HasQuarterState(GumballMachine gumballMachine) {\n        this.gumballMachine = gumballMachine;\n    }\n\n    public void insertQuarter() {\n        System.out.println(\"You can't insert another quarter\");\n    }\n\n    public void ejectQuarter() {\n        System.out.println(\"Quarter returned\");\n        gumballMachine.setState(gumballMachine.getNoQuarterState());\n    }\n\n    public void turnCrank() {\n        System.out.println(\"You turned...\");\n        gumballMachine.setState(gumballMachine.getSoldState());\n    }\n\n    public void dispense() {\n        System.out.println(\"No gumball dispensed\");\n    }\n}"
        },
        {
          "name": "GumballMachine",
          "code": "public class GumballMachine {\n    State noQuarterState;\n    State hasQuarterState;\n    State soldState;\n\n    State state;\n    int count = 0;\n\n    public GumballMachine(int numberGumballs) {\n        noQuarterState = new NoQuarterState(this);\n        hasQuarterState = new HasQuarterState(this);\n        // soldState = new SoldState(this);\n\n        this.count = numberGumballs;\n        if (numberGumballs > 0) {\n            state = noQuarterState;\n        }\n    }\n\n    // Context delegates behavior to the current state\n    public void insertQuarter() {\n        state.insertQuarter();\n    }\n\n    public void ejectQuarter() {\n        state.ejectQuarter();\n    }\n\n    public void turnCrank() {\n        state.turnCrank();\n        state.dispense();\n    }\n\n    // Used by state objects to transition the machine\n    void setState(State state) {\n        this.state = state;\n    }\n\n    // Getters for state objects...\n    public State getHasQuarterState() {\n        return hasQuarterState;\n    }\n\n    public State getNoQuarterState() {\n        return noQuarterState;\n    }\n    \n    public State getSoldState() {\n        return soldState;\n    }\n}"
        }
      ]
    }
  ],
  "knownUses": [
    "UI Controls: A toggle button or a media player (Play, Pause, Stopped states) behaves differently based on its current state.",
    "Network Connections: TCP connections have distinct states (Listening, Established, Closed) that drastically alter how they respond to incoming packets.",
    "Game Development: AI agents or characters frequently use Finite State Machines (FSMs) based on the State pattern (e.g., Idle, Patrol, Attack, Flee states)."
  ],
  "related": [
    "strategy",
    "singleton",
    "flyweight"
  ]
}
];
