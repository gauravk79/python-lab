export type ConceptData = {
  id: string;
  title: string;
  emoji: string;
  explanation: string;
  initialCode: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    correctFeedback: string;
    wrongFeedback: string;
  };
  blank: {
    textParts: [string, string];
    answer: string;
    praise: string;
  };
};

export const units = [
  {
    id: "unit-1",
    title: "THE HAWKINS FILES",
    sections: [
      { id: "data-types", title: "Transmission Intercepted" },
      { id: "variables", title: "Label Your Intel" },
      { id: "math", title: "Hawkins Lab Calculations" },
      { id: "field-challenge-1", title: "Milestone: Signal Decoder" },
      { id: "debugging", title: "Signal Corrupted" },
      { id: "comment-checkpoints", title: "Notes from the Lab" },
      { id: "terminal-challenge", title: "Final Terminal Challenge" }
    ]
  },
  {
    id: "unit-2",
    title: "UPSIDE DOWN DECISIONS",
    sections: [
      { id: "if-statements", title: "Friend or Foe?" },
      { id: "elif-else", title: "Multiple Threats" },
      { id: "nested-conditionals", title: "Nested Portals" },
      { id: "boolean-logic", title: "Eleven's Logic" }
    ]
  },
  {
    id: "unit-3",
    title: "TIME LOOPS IN HAWKINS",
    sections: [
      { id: "for-loops", title: "The Party Patrol" },
      { id: "while-loops", title: "Running from the Mind Flayer" },
      { id: "loop-control", title: "Escape Routes" },
      { id: "random-modules", title: "Random Encounters" }
    ]
  },
  {
    id: "unit-4",
    title: "ELEVEN'S POWER PROTOCOLS",
    sections: [
      { id: "functions", title: "Activate the Power" },
      { id: "return-values", title: "Powers Return" },
      { id: "scope", title: "Organizing the Resistance" },
      { id: "testing", title: "Testing the Lab" }
    ]
  },
  {
    id: "unit-5",
    title: "THE PARTY ROSTER",
    sections: [
      { id: "list-indices", title: "Finding the Right File" },
      { id: "string-manipulation", title: "Decoding the Message" },
      { id: "list-mutation", title: "Updating the Roster" }
    ]
  },
  {
    id: "unit-6",
    title: "HAWKINS LAB DOSSIERS",
    sections: [
      { id: "dictionaries", title: "Subject Files" },
      { id: "dict-iteration", title: "Scanning All Records" },
      { id: "nested-data", title: "Files Within Files" }
    ]
  },
  {
    id: "unit-7",
    title: "BUILDING THE MIND HIVE",
    sections: [
      { id: "classes", title: "Subject Blueprints" },
      { id: "methods", title: "Activating Abilities" },
      { id: "class-design", title: "Designing the Lab" }
    ]
  }
];

export const allConcepts: ConceptData[] = [
  // UNIT 1
  {
    id: "data-types",
    title: "Transmission Intercepted",
    emoji: "📡",
    explanation: "Python speaks in different types — strings for text, integers for whole numbers, floats for decimals, booleans for True/False. Like Hawkins Lab data logs!",
    initialCode: `name = "Eleven"\nnumber = 11\nweight = 97.5\nis_psychic = True\nprint(name, "is text (string)")\nprint(number, "is whole number (integer)")\nprint(is_psychic, "is true/false (boolean)")`,
    quiz: {
      question: "Dustin logs a temperature reading of 98.6 in Python. What data type is that?",
      options: ["str", "int", "float", "bool"],
      correctIndex: 2,
      correctFeedback: "Float! Numbers with decimal points are floats — like the temperature of the Upside Down.",
      wrongFeedback: "Decimal numbers are floats. Whole numbers are ints. Text is str. True/False is bool."
    },
    blank: {
      textParts: ["is_safe = ", ""],
      answer: "True",
      praise: "True is a boolean — Python's way of saying yes!"
    }
  },
  {
    id: "variables",
    title: "Label Your Intel",
    emoji: "🏷️",
    explanation: "Variables are like the boxes in Joyce's living room — you label them and store something inside!",
    initialCode: `hero = "Eleven"\npower_level = 11\nprint("Hero:", hero)\nprint("Power level:", power_level)`,
    quiz: {
      question: "Input test: Which line asks the user for a city and stores it in a variable?",
      options: [
        'print("Search for a city:")',
        'city = input("Search for a city: ")',
        'input = city("Search for a city: ")',
        'city == input("Search for a city: ")'
      ],
      correctIndex: 1,
      correctFeedback: "Correct. input(...) collects text from the user, and city stores it for reuse later.",
      wrongFeedback: "Look for a variable on the left and input(...) on the right. That is how you capture user input."
    },
    blank: {
      textParts: ["hero ", " \"Eleven\""],
      answer: "=",
      praise: "= assigns a value to a variable. You cracked the Hawkins Lab code!"
    }
  },
  {
    id: "math",
    title: "Hawkins Lab Calculations",
    emoji: "🔢",
    explanation: "Python can crunch numbers faster than Dustin can calculate Demogorgon claw count!",
    initialCode: `demogorgons = 3\nclaws_each = 4\ntotal_claws = demogorgons * claws_each\nprint("Total claws:", total_claws)\nprint("Claws squared:", claws_each ** 2)`,
    quiz: {
      question: "Type-casting test: Which snippet correctly adds 10 to a number entered by the user?",
      options: [
        'n = input("Enter number: ")\nprint(n + 10)',
        'n = int(input("Enter number: "))\nprint(n + 10)',
        'print(input("Enter number: ") + 10)',
        'n = float(input("Enter number: "))\nprint(n + "10")'
      ],
      correctIndex: 1,
      correctFeedback: "Exactly. Convert input to int first, then arithmetic works as expected.",
      wrongFeedback: "input() returns text, so convert with int(...) before doing numeric addition."
    },
    blank: {
      textParts: ["print(11 ", " 2)"],
      answer: "**",
      praise: "** is the power operator! 11 ** 2 = 121. Eleven... squared!"
    }
  },
  {
    id: "field-challenge-1",
    title: "Milestone: Signal Decoder",
    emoji: "🛰️",
    explanation:
      "Milestone mission unlocked. A supply drone from Hawkins Lab sent corrupted readings. Write Python code that stores crate_count = 6, base_weight = 12.5, and bonus_weight = \"7.5\". Convert bonus_weight so math works, then compute total_weight and avg_weight. Required output lines: Total weight: 82.5 and Average per crate: 13.75.",
    initialCode:
      "# MILESTONE: Signal Decoder Field Test\n# TODO 1: store the intercepted values\ncrate_count = 0\nbase_weight = 0.0\nbonus_weight = \"0\"\n\n# TODO 2: convert bonus_weight so arithmetic works\n\n# TODO 3: compute total_weight and avg_weight\n\n# TODO 4: print both required lines exactly\n# Total weight: 82.5\n# Average per crate: 13.75",
    quiz: {
      question: "Before doing math with bonus_weight = \"7.5\", what should you do first?",
      options: [
        "Keep it as text",
        "Convert with float(bonus_weight)",
        "Convert with bool(bonus_weight)",
        "Wrap it in print()",
      ],
      correctIndex: 1,
      correctFeedback:
        "Correct. float(...) converts the intercepted text value into a usable number for calculations.",
      wrongFeedback:
        "This value starts as text. Convert it with float(...) before multiplying or adding.",
    },
    blank: {
      textParts: ["bonus_weight = ", "(bonus_weight)"],
      answer: "float",
      praise:
        "Field-ready. You converted the signal from text to number and stabilized the calculation pipeline.",
    },
  },
  {
    id: "debugging",
    title: "Signal Corrupted",
    emoji: "🐛",
    explanation: "All major bug classes are now in this one mission. Diagnose syntax errors that block execution, runtime errors that crash mid-run, and logic errors that silently produce wrong answers.",
    initialCode: `print("Run me!")\nprint("Debug command center active.")\nprint("Use the scenario buttons above the terminal to load Syntax, Runtime, and Logic tests.")`,
    quiz: {
      question: "A script prints two lines, then crashes with TypeError. Which bug class is that?",
      options: ["Syntax error", "Runtime error", "Logic error", "Comment error"],
      correctIndex: 1,
      correctFeedback: "Correct. Runtime errors appear during execution after the program has already started running.",
      wrongFeedback: "If execution starts and then crashes, it's runtime. Syntax errors stop before line 1. Logic errors do not crash."
    },
    blank: {
      textParts: ["If code runs but output is wrong, the bug is a ", " error."],
      answer: "logic",
      praise: "Exactly. Logic errors are the silent ones: execution succeeds, intent fails."
    }
  },
  {
    id: "comment-checkpoints",
    title: "Notes from the Lab",
    emoji: "📝",
    explanation: "Comments and small checkpoints make debugging easier. Python ignores comments, but teammates rely on them.",
    initialCode: `print("Run me!")\n# Sum the first five multiples of 9\nprint(9 + 18 + 27 + 34 + 45)\nprint("Checkpoint complete")`,
    quiz: {
      question: "Why is running code in small steps better than writing everything first?",
      options: [
        "It makes Python faster",
        "It uses less memory",
        "It helps isolate which recent change caused a bug",
        "It avoids all bugs"
      ],
      correctIndex: 2,
      correctFeedback: "Right. Small checkpoints make debugging much easier when something breaks.",
      wrongFeedback: "Iterative development helps you pinpoint the exact change that introduced the issue."
    },
    blank: {
      textParts: ["", " This line is a comment for humans."],
      answer: "#",
      praise: "Perfect. Python skips comments, but humans use them as mission notes."
    }
  },
  {
    id: "terminal-challenge",
    title: "Final Terminal Challenge",
    emoji: "🖥️",
    explanation:
      "Final Unit 1 mission. Use this checklist: (1) change language_code from \"pt\" to \"es\", (2) convert base_signal to a number before arithmetic, and (3) choose the discount that gives the lower final signal (best discount). Keep output labels unchanged. Success output must include: Portal: https://es.hawkinslab.org/computing and Best signal: 84.99.",
    initialCode:
      "# FINAL TERMINAL CHALLENGE\n# Fix this script by completing all TODO steps.\n\nprint(\"Run me!\")\n\n# TODO 1: Set language_code to \"es\"\nlanguage_code = \"pt\"\nsubject = \"computing\"\n\n# TODO 2: Convert this to a numeric value before arithmetic\nbase_signal = \"99.99\"\n\n# TODO 3: Keep these calculations valid and pick the best signal\n# Hint: \"best\" discount means the lower post-discount signal.\npercent_discount = base_signal - base_signal * 0.15\nfixed_discount = base_signal - 12\nbest_signal = max(fixed_discount, percent_discount)\n\n# TODO 4: Keep these output labels exactly\nurl = \"https://\" + language_code + \".hawkinslab.org/\" + subject\nprint(\"Portal:\", url)\nprint(\"Best signal:\", round(best_signal, 2))",
    quiz: {
      question:
        "In this final challenge, which fix must happen before percent_discount math can run?",
      options: [
        "Convert it with float(base_signal)",
        "Convert it with str(base_signal)",
        "Leave it as is",
        "Only wrap it in print()",
      ],
      correctIndex: 0,
      correctFeedback:
        "Correct. Use float(...) so subtraction and multiplication run without a TypeError.",
      wrongFeedback:
        "The math lines require a numeric value. Convert text to float before arithmetic.",
    },
    blank: {
      textParts: ["url = \"https://\" + language_code + \".hawkinslab.org/\" ", " subject"],
      answer: "+",
      praise: "Nice. + joins string parts so the final portal URL is complete.",
    },
  },

  // UNIT 2
  {
    id: "if-statements",
    title: "Friend or Foe?",
    emoji: "🤔",
    explanation: "if statements make decisions — like Eleven checking if a creature is a Demogorgon before using her powers!",
    initialCode: `creature = "Demogorgon"\nif creature == "Demogorgon":\n    print("Use your powers, Eleven!")\nprint("Stay alert.")`,
    quiz: {
      question: "What symbol does Python use to CHECK if two values are equal?",
      options: ["=", "=>", "==", "!="],
      correctIndex: 2,
      correctFeedback: "== checks equality. = assigns a value. Don't mix them up in the dark tunnels!",
      wrongFeedback: "= assigns (puts a value in). == compares (checks if equal). Which one checks?"
    },
    blank: {
      textParts: ["if threat ", " 'Demogorgon':"],
      answer: "==",
      praise: "== is the comparison operator — asking 'are these the same?'"
    }
  },
  {
    id: "elif-else",
    title: "Multiple Threats",
    emoji: "🚪",
    explanation: "elif and else handle multiple possibilities — like choosing a different escape route depending on which monster you face!",
    initialCode: `threat = "Mind Flayer"\nif threat == "Demogorgon":\n    print("Run to the Wheeler house!")\nelif threat == "Mind Flayer":\n    print("Get to the Byers house!")\nelse:\n    print("Stay calm and radio for help.")`,
    quiz: {
      question: "What keyword handles a second condition if the first if is False?",
      options: ["else", "then", "elif", "or"],
      correctIndex: 2,
      correctFeedback: "elif! Short for 'else if' — it checks another condition when the first one is False.",
      wrongFeedback: "else runs when ALL conditions are False. elif checks ANOTHER specific condition."
    },
    blank: {
      textParts: ["", " threat == 'Mind Flayer':"],
      answer: "elif",
      praise: "elif checks the next condition — another door in the Upside Down!"
    }
  },
  {
    id: "nested-conditionals",
    title: "Nested Portals",
    emoji: "🌀",
    explanation: "Conditionals inside conditionals — like checking which tunnel you're in AND whether it's safe inside!",
    initialCode: `location = "tunnels"\nhas_flare = True\nif location == "tunnels":\n    if has_flare:\n        print("Light the flare! You can see!")\n    else:\n        print("Too dark. Find a light source.")\nelse:\n    print("You are safe above ground.")`,
    quiz: {
      question: "How many conditions must be True to print 'Light the flare!'?",
      options: ["0", "1", "2", "3"],
      correctIndex: 2,
      correctFeedback: "Both! location must be 'tunnels' AND has_flare must be True. Nested = both layers checked.",
      wrongFeedback: "Count the if statements. The inner print only runs if BOTH outer and inner conditions pass."
    },
    blank: {
      textParts: ["if has_flare", ""],
      answer: ":",
      praise: "The colon : starts the indented block — open the portal!"
    }
  },
  {
    id: "boolean-logic",
    title: "Eleven's Logic",
    emoji: "🧠",
    explanation: "and, or, not combine conditions — like needing BOTH a sensory deprivation tank AND quiet to use Eleven's powers!",
    initialCode: `has_tank = True\nis_quiet = True\nif has_tank and is_quiet:\n    print("Eleven can enter the void!")\nif not is_quiet:\n    print("Too noisy for the void.")`,
    quiz: {
      question: "Which keyword means BOTH conditions must be True?",
      options: ["or", "not", "and", "if"],
      correctIndex: 2,
      correctFeedback: "and requires ALL conditions to be True — like needing the tank AND the quiet.",
      wrongFeedback: "or = at least one True. not = flips True/False. and = ALL must be True. Which needs both?"
    },
    blank: {
      textParts: ["if has_tank ", " is_quiet:"],
      answer: "and",
      praise: "and joins two conditions — both must be True to enter the void!"
    }
  },

  // UNIT 3
  {
    id: "for-loops",
    title: "The Party Patrol",
    emoji: "🍎",
    explanation: "Lists keep things in order — like the party members in Hawkins. Loops visit each one!",
    initialCode: `party = ["Mike", "Dustin", "Lucas", "Will", "Eleven"]\nfor member in party:\n    print("Party member:", member)`,
    quiz: {
      question: "Joyce has a list: lights = ['red','yellow','green']. How does she check each one?",
      options: ["print(lights)", "look at lights", "for light in lights:", "lights.check()"],
      correctIndex: 2,
      correctFeedback: "Yes! for...in visits every item — just like Joyce checking every Christmas bulb!",
      wrongFeedback: "A for loop uses the 'in' keyword. What's the right syntax?"
    },
    blank: {
      textParts: ["for member ", " party:"],
      answer: "in",
      praise: "'in' tells Python to go through each item. The whole party is here!"
    }
  },
  {
    id: "while-loops",
    title: "Running from the Mind Flayer",
    emoji: "🏃",
    explanation: "while loops keep running as long as a condition is True — like running until you reach the safe house!",
    initialCode: `distance = 0\nwhile distance < 5:\n    print("Running... distance:", distance)\n    distance = distance + 1\nprint("You made it to the safe house!")`,
    quiz: {
      question: "When does a while loop stop?",
      options: ["After 10 times", "When you press stop", "When its condition becomes False", "Never"],
      correctIndex: 2,
      correctFeedback: "When the condition is False! distance < 5 becomes False once distance hits 5 — safe at last!",
      wrongFeedback: "A while loop checks its condition EACH time. It stops when that condition becomes False."
    },
    blank: {
      textParts: ["", " distance < 5:"],
      answer: "while",
      praise: "while starts the loop — keep going until we reach safety!"
    }
  },
  {
    id: "loop-control",
    title: "Escape Routes",
    emoji: "🚧",
    explanation: "break exits a loop immediately. continue skips to the next iteration — like skipping a blocked tunnel and trying the next one!",
    initialCode: `tunnels = ["blocked", "clear", "blocked", "exit"]\nfor tunnel in tunnels:\n    if tunnel == "blocked":\n        continue\n    if tunnel == "exit":\n        print("Found the exit!")\n        break\n    print("Tunnel:", tunnel)`,
    quiz: {
      question: "Which keyword skips the rest of the current loop iteration?",
      options: ["break", "skip", "pass", "continue"],
      correctIndex: 3,
      correctFeedback: "continue! It jumps to the next loop cycle — skip the blocked tunnel, try the next!",
      wrongFeedback: "break exits the loop entirely. continue skips just the current iteration. Which skips forward?"
    },
    blank: {
      textParts: ["if tunnel == 'blocked': ", ""],
      answer: "continue",
      praise: "continue skips this tunnel and checks the next one!"
    }
  },
  {
    id: "random-modules",
    title: "Random Encounters",
    emoji: "🎲",
    explanation: "Python modules add extra powers! The random module generates random numbers — like rolling the dice on which monster appears!",
    initialCode: `import random\nmonsters = ["Demogorgon", "Mind Flayer", "Vecna", "Demodog"]\nencounter = random.choice(monsters)\ndanger = random.randint(1, 10)\nprint("You encountered:", encounter)\nprint("Danger level:", danger)`,
    quiz: {
      question: "What keyword brings a module into your Python program?",
      options: ["include", "require", "using", "import"],
      correctIndex: 3,
      correctFeedback: "import! import random gives you access to all the random module's powers.",
      wrongFeedback: "Python uses one specific keyword to load a module. Same keyword every language learner memorizes first."
    },
    blank: {
      textParts: ["", " random"],
      answer: "import",
      praise: "import unlocks a module — like opening a new Hawkins Lab wing!"
    }
  },

  // UNIT 4
  {
    id: "functions",
    title: "Activate the Power",
    emoji: "⚙️",
    explanation: "Functions are like Eleven's powers — you define them once, then call on them anytime!",
    initialCode: `def warn(monster):\n    return "Watch out! " + monster + " is near!"\n\nprint(warn("Demogorgon"))\nprint(warn("Mind Flayer"))`,
    quiz: {
      question: "Lucas wrote a function called warn(). How does he USE it?",
      options: ["function warn()", "def warn()", "create warn()", "warn()"],
      correctIndex: 3,
      correctFeedback: "def DEFINES it, warn() CALLS it. Activate the warning system!",
      wrongFeedback: "def makes a function. To actually run it, write its name with ()."
    },
    blank: {
      textParts: ["", " warn(monster):"],
      answer: "def",
      praise: "def defines a function — like naming a new power for Eleven!"
    }
  },
  {
    id: "return-values",
    title: "Powers Return",
    emoji: "⚡",
    explanation: "Functions can send back a result — like Eleven's powers returning what she finds in the void!",
    initialCode: `def power_level(name, base):\n    total = base * 2\n    return total\n\neleven = power_level("Eleven", 11)\nmike = power_level("Mike", 3)\nprint("Eleven's power:", eleven)\nprint("Mike's power:", mike)`,
    quiz: {
      question: "What keyword sends a value BACK from a function?",
      options: ["send", "give", "output", "return"],
      correctIndex: 3,
      correctFeedback: "return! It sends the result back to whoever called the function — mission complete!",
      wrongFeedback: "Python has one special keyword to send a value out of a function. It 'returns' it to the caller."
    },
    blank: {
      textParts: ["", " total"],
      answer: "return",
      praise: "return sends the value back — Eleven's mission report delivered!"
    }
  },
  {
    id: "scope",
    title: "Organizing the Resistance",
    emoji: "📁",
    explanation: "Variables inside a function are private to that function — classified files only that agent can access!",
    initialCode: `secret = "Hawkins"\n\ndef reveal_secret():\n    local_msg = "The lab is at " + secret\n    return local_msg\n\nprint(reveal_secret())`,
    quiz: {
      question: "A variable created INSIDE a function can be used...",
      options: ["Anywhere in the program", "Only inside that function", "Only in the next function", "Everywhere except main"],
      correctIndex: 1,
      correctFeedback: "Only inside that function! Local scope keeps it classified — no leaks to the outside.",
      wrongFeedback: "Variables inside a function are 'local' — they only exist while that function runs."
    },
    blank: {
      textParts: ["def ", "():"],
      answer: "reveal_secret",
      praise: "The name after def is the function's name — you pick it!"
    }
  },
  {
    id: "testing",
    title: "Testing the Lab",
    emoji: "🧪",
    explanation: "assert checks that your code does what you expect — like Hopper verifying every lab door is locked before leaving!",
    initialCode: `def double_power(x):\n    return x * 2\n\nassert double_power(11) == 22\nassert double_power(3) == 6\nprint("All power tests passed!")`,
    quiz: {
      question: "What does assert do if the condition is False?",
      options: ["Prints a warning", "Returns False", "Raises an error", "Skips the line"],
      correctIndex: 2,
      correctFeedback: "It raises an AssertionError — the test FAILS loudly. Just like Hopper when a door isn't locked!",
      wrongFeedback: "assert is all-or-nothing: if True, nothing happens. If False, the program crashes with an AssertionError."
    },
    blank: {
      textParts: ["assert double_power(11) ", " 22"],
      answer: "==",
      praise: "== checks equality — assert uses it to verify your code is correct!"
    }
  },

  // UNIT 5
  {
    id: "list-indices",
    title: "Finding the Right File",
    emoji: "🗂️",
    explanation: "Each item in a list has a position number called an index — starting at 0! Like Hawkins Lab filing cabinets numbered from zero.",
    initialCode: `party = ["Mike", "Dustin", "Lucas", "Will", "Eleven"]\nprint(party[0])\nprint(party[4])\nprint(party[-1])`,
    quiz: {
      question: "party = ['Mike','Dustin','Lucas']. What is party[1]?",
      options: ["Mike", "Dustin", "Lucas", "Error"],
      correctIndex: 1,
      correctFeedback: "Dustin! Index 1 is the SECOND item — Python counts from 0. Tricky like the Upside Down!",
      wrongFeedback: "Python lists start at index 0. Count: 0=Mike, 1=Dustin, 2=Lucas."
    },
    blank: {
      textParts: ["print(party[", "])"],
      answer: "0",
      praise: "Index 0 is the first item — Python starts counting at zero!"
    }
  },
  {
    id: "string-manipulation",
    title: "Decoding the Message",
    emoji: "🔍",
    explanation: "Strings are sequences of characters — slice them, split them, search inside them. Like decoding Joyce's light-up wall messages!",
    initialCode: `message = "HELP WILL IS HERE"\nprint(message[0:4])\nprint(message.split(" "))\nprint(len(message))`,
    quiz: {
      question: "message = 'UPSIDE DOWN'. What does message[0:6] return?",
      options: ["UPSIDE", "UPSIDE DOWN", "DOWN", "UP"],
      correctIndex: 0,
      correctFeedback: "UPSIDE! Slicing [0:6] takes characters from index 0 up to (not including) 6.",
      wrongFeedback: "Slicing [start:end] takes from start index up to (but not including) end. Count the characters."
    },
    blank: {
      textParts: ["message.", '(" ")'],
      answer: "split",
      praise: ".split() breaks a string into a list of words — message decoded!"
    }
  },
  {
    id: "list-mutation",
    title: "Updating the Roster",
    emoji: "📋",
    explanation: "Lists can grow and shrink — use append to add, remove to delete, sort to organize. Like managing the Hawkins resistance party!",
    initialCode: `party = ["Mike", "Dustin", "Lucas"]\nparty.append("Eleven")\nparty.append("Max")\nparty.remove("Lucas")\nparty.sort()\nprint(party)\nprint("Party size:", len(party))`,
    quiz: {
      question: "Which method ADDS an item to the END of a list?",
      options: ["add()", "insert()", "push()", "append()"],
      correctIndex: 3,
      correctFeedback: "append()! Eleven joins the end of the party list — she was the last to arrive but essential!",
      wrongFeedback: "Python lists have a specific method for adding to the end. It 'appends' — tacks on the end."
    },
    blank: {
      textParts: ["party.", '("Max")'],
      answer: "append",
      praise: "append() adds Max to the end of the party list — welcome to the team!"
    }
  },

  // UNIT 6
  {
    id: "dictionaries",
    title: "Subject Files",
    emoji: "📖",
    explanation: "Dictionaries pair keys with values — like Hawkins Lab files linking a subject to their data!",
    initialCode: `subject = {"name": "Eleven", "number": 11, "location": "Hawkins"}\nfor key, value in subject.items():\n    print(key, ":", value)`,
    quiz: {
      question: "Max has profile = {'name': 'Max', 'age': 14}. How does she get her name?",
      options: ["profile.name", "profile['name']", "profile->name", "get(profile, name)"],
      correctIndex: 1,
      correctFeedback: "Radical! Square brackets + the key name gets your value — like finding a Hawkins Lab file!",
      wrongFeedback: "Dictionary lookup uses square brackets: dict['key']."
    },
    blank: {
      textParts: ["subject ", " {\"name\": \"Eleven\"}"],
      answer: "=",
      praise: "= creates the dictionary. Hawkins Lab file opened!"
    }
  },
  {
    id: "dict-iteration",
    title: "Scanning All Records",
    emoji: "📡",
    explanation: "Loop through a dictionary with .items() to get every key-value pair — like scanning every file in Hawkins Lab!",
    initialCode: `subject = {"name": "Eleven", "number": 11, "power": "telekinesis"}\nfor key, value in subject.items():\n    print(key + ":", value)`,
    quiz: {
      question: "How do you loop through BOTH keys and values in a dictionary?",
      options: ["for x in dict:", "for k, v in dict.items()", "for dict.keys():", "dict.loop()"],
      correctIndex: 1,
      correctFeedback: ".items() gives you (key, value) pairs — scan every record in the Hawkins files!",
      wrongFeedback: "dict.items() returns (key, value) pairs. The for loop unpacks each pair into two variables."
    },
    blank: {
      textParts: ["for key, value in subject.", "():"],
      answer: "items",
      praise: ".items() gives every key-value pair — full file access granted!"
    }
  },
  {
    id: "nested-data",
    title: "Files Within Files",
    emoji: "📂",
    explanation: "Dictionaries and lists can contain other dictionaries and lists — like a Hawkins Lab file with sub-files inside it!",
    initialCode: `lab = {\n    "name": "Hawkins Lab",\n    "subjects": ["Eleven", "Eight", "Nine"],\n    "director": {"name": "Brenner", "cleared": True}\n}\nprint(lab["name"])\nprint(lab["subjects"][0])\nprint(lab["director"]["name"])`,
    quiz: {
      question: "lab = {'team': ['Mike', 'Dustin']}. How do you get 'Dustin'?",
      options: ["lab['team']['Dustin']", "lab['team'][1]", "lab[1]['team']", "lab.team[1]"],
      correctIndex: 1,
      correctFeedback: "lab['team'][1]! First get the list with 'team', then index into it. Chained access!",
      wrongFeedback: "First get the list: lab['team']. Then index into it like a normal list: [1]."
    },
    blank: {
      textParts: ['lab["director"][', "]"],
      answer: '"name"',
      praise: "String keys in quotes access dictionary values — Brenner's file opened!"
    }
  },

  // UNIT 7
  {
    id: "classes",
    title: "Subject Blueprints",
    emoji: "🏗️",
    explanation: "A class is a blueprint for creating objects — like a Hawkins Lab template for creating test subjects with their own data!",
    initialCode: `class Subject:\n    def __init__(self, name, number):\n        self.name = name\n        self.number = number\n\neleven = Subject("Eleven", 11)\neight = Subject("Eight", 8)\nprint(eleven.name, eleven.number)\nprint(eight.name, eight.number)`,
    quiz: {
      question: "What is the special method that runs automatically when you CREATE a new object?",
      options: ["__create__", "__start__", "__init__", "__new__"],
      correctIndex: 2,
      correctFeedback: "__init__! It initializes the object's attributes — the lab opens a new subject file!",
      wrongFeedback: "Python classes use a special 'dunder' method to set up new objects. It INITializes them."
    },
    blank: {
      textParts: ["class ", ":"],
      answer: "Subject",
      praise: "class defines the blueprint — Subject is its name. Welcome to Hawkins Lab!"
    }
  },
  {
    id: "methods",
    title: "Activating Abilities",
    emoji: "🔥",
    explanation: "Methods are functions that belong to a class — like each subject having their own special power they can activate!",
    initialCode: `class Subject:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\n    def activate(self):\n        return self.name + " uses " + self.power + "!"\n\neleven = Subject("Eleven", "telekinesis")\nprint(eleven.activate())`,
    quiz: {
      question: "What is the first parameter of every class method?",
      options: ["this", "class", "self", "object"],
      correctIndex: 2,
      correctFeedback: "self! It refers to the specific object the method belongs to — Eleven knows she's Eleven!",
      wrongFeedback: "Every class method needs to know WHICH object it belongs to. Python passes it automatically as the first parameter."
    },
    blank: {
      textParts: ["def activate(", ")"],
      answer: "self",
      praise: "self refers to the object itself — Eleven knows she's Eleven, not Eight!"
    }
  },
  {
    id: "class-design",
    title: "Designing the Lab",
    emoji: "🏛️",
    explanation: "Classes can contain other objects — a Lab class that holds many Subject objects. This is called composition!",
    initialCode: `class Subject:\n    def __init__(self, name):\n        self.name = name\n\nclass Lab:\n    def __init__(self, location):\n        self.location = location\n        self.subjects = []\n\n    def add_subject(self, subject):\n        self.subjects.append(subject)\n\n    def roster(self):\n        names = []\n        for s in self.subjects:\n            names.append(s.name)\n        return names\n\nlab = Lab("Hawkins")\nlab.add_subject(Subject("Eleven"))\nlab.add_subject(Subject("Eight"))\nprint(lab.location)\nprint(lab.roster())`,
    quiz: {
      question: "What is it called when one class contains instances of another class?",
      options: ["Inheritance", "Composition", "Abstraction", "Encapsulation"],
      correctIndex: 1,
      correctFeedback: "Composition! A Lab HAS subjects — built from other objects. Like Hawkins Lab containing all subjects.",
      wrongFeedback: "When a class CONTAINS objects of another class (HAS-A relationship), that's composition."
    },
    blank: {
      textParts: ["self.subjects.", "(subject)"],
      answer: "append",
      praise: "append adds a new Subject to the lab's roster — another file in the cabinet!"
    }
  }
];
