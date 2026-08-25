/* ====================================================
   Pattern Book — antipattern.js
   ==================================================== */

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
