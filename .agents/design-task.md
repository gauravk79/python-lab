You are rebuilding the "Hawkins Python Lab" app (artifacts/python-app) to cover the full Khan Academy "Intro to Python Fundamentals" course — all 7 units — with a collapsible left sidebar navigation and Stranger Things-themed unit/section names.

---
## LAYOUT CHANGE: SIDEBAR + MAIN CONTENT

Change the page layout from a single centered column to a two-panel layout:
- **Left sidebar** (fixed, 260px wide on desktop): unit + section nav links. On mobile: hidden by default, toggled by a hamburger button that appears top-left.
- **Main content** (flex-1, scrollable): the existing header + all concept sections.

Sidebar behavior:
1. **Click to jump**: clicking a section link scrolls smoothly to that section's `<section id="...">`
2. **Highlight on scroll**: use IntersectionObserver to detect which section is currently visible and highlight its link in the sidebar (red glow, left border accent)

Sidebar structure: collapsible unit headings (click to expand/collapse), each containing their section links. Units start expanded. Sidebar has a glowing red right border.

Sidebar styling: dark panel (#0a0a14), unit headings in amber (#ffb703) Creepster font, section links in light gray that turn red-glowing when active.

On mobile (<768px): sidebar is a slide-in drawer toggled by a ☰ hamburger button in the top-left of the header. Overlay dims the main content when open.

---
## REORGANIZED UNITS — STRANGER THINGS THEMED NAMES

Keep ALL existing 6 concept sections (Variables, Math, Strings, Lists & Loops, Functions, Dictionaries). Reorganize them and add new sections:

### Unit 1: "THE HAWKINS FILES" (Computational Thinking with Variables)
- id: unit-1
Sections:
1. id: data-types — "Transmission Intercepted" → Data Types & Print (NEW)
2. id: variables — "Label Your Intel" → Variables (EXISTING — keep all content)
3. id: math — "Hawkins Lab Calculations" → Arithmetic & Math (EXISTING — keep all content)
4. id: debugging — "Signal Corrupted" → Debugging & Errors (NEW)

### Unit 2: "UPSIDE DOWN DECISIONS" (Designing Algorithms with Conditionals)
- id: unit-2
Sections:
5. id: if-statements — "Friend or Foe?" → If Statements (NEW)
6. id: elif-else — "Multiple Threats" → elif & else (NEW)
7. id: nested-conditionals — "Nested Portals" → Nested Conditionals (NEW)
8. id: boolean-logic — "Eleven's Logic" → Compound Boolean and/or/not (NEW)

### Unit 3: "TIME LOOPS IN HAWKINS" (Simulating Phenomena with Loops)
- id: unit-3
Sections:
9. id: for-loops — "The Party Patrol" → For Loops (EXISTING Lists & Loops — keep all content)
10. id: while-loops — "Running from the Mind Flayer" → While Loops (NEW)
11. id: loop-control — "Escape Routes" → break & continue (NEW)
12. id: random-modules — "Random Encounters" → Module Imports & Random (NEW)

### Unit 4: "ELEVEN'S POWER PROTOCOLS" (Playing Games with Functions)
- id: unit-4
Sections:
13. id: functions — "Activate the Power" → Function Definitions (EXISTING — keep all content)
14. id: return-values — "Powers Return" → Return Values (NEW)
15. id: scope — "Organizing the Resistance" → Code Organization & Scope (NEW)
16. id: testing — "Testing the Lab" → Testing with assert (NEW)

### Unit 5: "THE PARTY ROSTER" (Automating Tasks with Lists)
- id: unit-5
Sections:
17. id: list-indices — "Finding the Right File" → List Indices (NEW)
18. id: string-manipulation — "Decoding the Message" → String Manipulation (NEW)
19. id: list-mutation — "Updating the Roster" → List Mutation append/remove/sort (NEW)

### Unit 6: "HAWKINS LAB DOSSIERS" (Analyzing Data with Dictionaries)
- id: unit-6
Sections:
20. id: dictionaries — "Subject Files" → Dictionaries (EXISTING — keep all content)
21. id: dict-iteration — "Scanning All Records" → Dictionary Iteration (NEW)
22. id: nested-data — "Files Within Files" → Nested Data (NEW)

### Unit 7: "BUILDING THE MIND HIVE" (Building Software with Classes)
- id: unit-7
Sections:
23. id: classes — "Subject Blueprints" → Classes & Attributes (NEW)
24. id: methods — "Activating Abilities" → Methods (NEW)
25. id: class-design — "Designing the Lab" → Class Design & Composition (NEW)

---
## NEW SECTION CONTENT

Each new section follows the SAME format as existing sections:
- Stranger Things explanation (1-2 sentences)
- Code block with Stranger Things characters
- Editable textarea + RUN SEQUENCE button (calls runPythonSimulator)
- Quiz: 4 options, Stranger Things-flavored question, green glow on correct, red shake on wrong
- Fill-in-the-blank: "Patch the Signal" with input + CHECK button

---
### "Transmission Intercepted" — Data Types & Print

Explanation: "Python speaks in different types — strings for text, integers for whole numbers, floats for decimals, booleans for True/False. Like Hawkins Lab data logs!"

Code:
```
name = "Eleven"
number = 11
weight = 97.5
is_psychic = True
print(type(name))
print(type(number))
print(type(is_psychic))
```
Output:
```
<class 'str'>
<class 'int'>
<class 'bool'>
```

Quiz Q: "Dustin logs a temperature reading of 98.6 in Python. What data type is that?"
Options: ["str", "int", "float", "bool"]
Correct index: 2
Correct msg: "Float! Numbers with decimal points are floats — like the temperature of the Upside Down."
Wrong hint: "Decimal numbers are floats. Whole numbers are ints. Text is str. True/False is bool."

Fill: ["is_safe = ", ""] answer: "True"
Praise: "True is a boolean — Python's way of saying yes!"

---
### "Signal Corrupted" — Debugging & Errors

Explanation: "Even Hawkins Lab scientists make mistakes. Syntax errors are typos. Runtime errors crash the program. Logic errors give wrong answers silently."

Code:
```
hero = "Eleven"
power = 11
result = power * 2
print("Power doubled:", result)
print("Hero:", hero)
```
Output:
```
Power doubled: 22
Hero: Eleven
```

Quiz Q: "Will's code runs but gives the wrong answer. What type of error is that?"
Options: ["Syntax error", "Runtime error", "Logic error", "Import error"]
Correct index: 2
Correct msg: "Logic error! The code runs fine but the result is wrong — sneaky, like the Mind Flayer hiding in plain sight."
Wrong hint: "Syntax = typo. Runtime = crashes while running. Logic = wrong answer. Which one runs but gives bad output?"

Fill: ['print("Hawkins" ', ' " Lab")'] answer: "+"
Praise: "+ concatenates strings — joining Hawkins and Lab together!"

---
### "Friend or Foe?" — If Statements

Explanation: "if statements make decisions — like Eleven checking if a creature is a Demogorgon before using her powers!"

Code:
```
creature = "Demogorgon"
if creature == "Demogorgon":
    print("Use your powers, Eleven!")
print("Stay alert.")
```
Output:
```
Use your powers, Eleven!
Stay alert.
```

Quiz Q: "What symbol does Python use to CHECK if two values are equal?"
Options: ["=", "=>", "==", "!="]
Correct index: 2
Correct msg: "== checks equality. = assigns a value. Don't mix them up in the dark tunnels!"
Wrong hint: "= assigns (puts a value in). == compares (checks if equal). Which one checks?"

Fill: ["if threat ", " 'Demogorgon':"] answer: "=="
Praise: "== is the comparison operator — asking 'are these the same?'"

---
### "Multiple Threats" — elif & else

Explanation: "elif and else handle multiple possibilities — like choosing a different escape route depending on which monster you face!"

Code:
```
threat = "Mind Flayer"
if threat == "Demogorgon":
    print("Run to the Wheeler house!")
elif threat == "Mind Flayer":
    print("Get to the Byers house!")
else:
    print("Stay calm and radio for help.")
```
Output:
```
Get to the Byers house!
```

Quiz Q: "What keyword handles a second condition if the first if is False?"
Options: ["else", "then", "elif", "or"]
Correct index: 2
Correct msg: "elif! Short for 'else if' — it checks another condition when the first one is False."
Wrong hint: "else runs when ALL conditions are False. elif checks ANOTHER specific condition."

Fill: ["", " threat == 'Mind Flayer':"] answer: "elif"
Praise: "elif checks the next condition — another door in the Upside Down!"

---
### "Nested Portals" — Nested Conditionals

Explanation: "Conditionals inside conditionals — like checking which tunnel you're in AND whether it's safe inside!"

Code:
```
location = "tunnels"
has_flare = True
if location == "tunnels":
    if has_flare:
        print("Light the flare! You can see!")
    else:
        print("Too dark. Find a light source.")
else:
    print("You are safe above ground.")
```
Output:
```
Light the flare! You can see!
```

Quiz Q: "How many conditions must be True to print 'Light the flare!'?"
Options: ["0", "1", "2", "3"]
Correct index: 2
Correct msg: "Both! location must be 'tunnels' AND has_flare must be True. Nested = both layers checked."
Wrong hint: "Count the if statements. The inner print only runs if BOTH outer and inner conditions pass."

Fill: ["if has_flare", ""] answer: ":"
Praise: "The colon : starts the indented block — open the portal!"

---
### "Eleven's Logic" — Compound Boolean

Explanation: "and, or, not combine conditions — like needing BOTH a sensory deprivation tank AND quiet to use Eleven's powers!"

Code:
```
has_tank = True
is_quiet = True
if has_tank and is_quiet:
    print("Eleven can enter the void!")
if not is_quiet:
    print("Too noisy for the void.")
```
Output:
```
Eleven can enter the void!
```

Quiz Q: "Which keyword means BOTH conditions must be True?"
Options: ["or", "not", "and", "if"]
Correct index: 2
Correct msg: "and requires ALL conditions to be True — like needing the tank AND the quiet."
Wrong hint: "or = at least one True. not = flips True/False. and = ALL must be True. Which needs both?"

Fill: ["if has_tank ", " is_quiet:"] answer: "and"
Praise: "and joins two conditions — both must be True to enter the void!"

---
### "Running from the Mind Flayer" — While Loops

Explanation: "while loops keep running as long as a condition is True — like running until you reach the safe house!"

Code:
```
distance = 0
while distance < 5:
    print("Running... distance:", distance)
    distance = distance + 1
print("You made it to the safe house!")
```
Output:
```
Running... distance: 0
Running... distance: 1
Running... distance: 2
Running... distance: 3
Running... distance: 4
You made it to the safe house!
```

Quiz Q: "When does a while loop stop?"
Options: ["After 10 times", "When you press stop", "When its condition becomes False", "Never"]
Correct index: 2
Correct msg: "When the condition is False! distance < 5 becomes False once distance hits 5 — safe at last!"
Wrong hint: "A while loop checks its condition EACH time. It stops when that condition becomes False."

Fill: ["", " distance < 5:"] answer: "while"
Praise: "while starts the loop — keep going until we reach safety!"

---
### "Escape Routes" — break & continue

Explanation: "break exits a loop immediately. continue skips to the next iteration — like skipping a blocked tunnel and trying the next one!"

Code:
```
tunnels = ["blocked", "clear", "blocked", "exit"]
for tunnel in tunnels:
    if tunnel == "blocked":
        continue
    if tunnel == "exit":
        print("Found the exit!")
        break
    print("Tunnel:", tunnel)
```
Output:
```
Tunnel: clear
Found the exit!
```

Quiz Q: "Which keyword skips the rest of the current loop iteration?"
Options: ["break", "skip", "pass", "continue"]
Correct index: 3
Correct msg: "continue! It jumps to the next loop cycle — skip the blocked tunnel, try the next!"
Wrong hint: "break exits the loop entirely. continue skips just the current iteration. Which skips forward?"

Fill: ["if tunnel == 'blocked': ", ""] answer: "continue"
Praise: "continue skips this tunnel and checks the next one!"

---
### "Random Encounters" — Module Imports

Explanation: "Python modules add extra powers! The random module generates random numbers — like rolling the dice on which monster appears!"

Code:
```
import random
monsters = ["Demogorgon", "Mind Flayer", "Vecna", "Demodog"]
encounter = random.choice(monsters)
danger = random.randint(1, 10)
print("You encountered:", encounter)
print("Danger level:", danger)
```
Output (example):
```
You encountered: Vecna
Danger level: 7
```

Quiz Q: "What keyword brings a module into your Python program?"
Options: ["include", "require", "using", "import"]
Correct index: 3
Correct msg: "import! import random gives you access to all the random module's powers."
Wrong hint: "Python uses one specific keyword to load a module. Same keyword every language learner memorizes first."

Fill: ["", " random"] answer: "import"
Praise: "import unlocks a module — like opening a new Hawkins Lab wing!"

---
### "Powers Return" — Return Values

Explanation: "Functions can send back a result — like Eleven's powers returning what she finds in the void!"

Code:
```
def power_level(name, base):
    total = base * 2
    return total

eleven = power_level("Eleven", 11)
mike = power_level("Mike", 3)
print("Eleven's power:", eleven)
print("Mike's power:", mike)
```
Output:
```
Eleven's power: 22
Mike's power: 6
```

Quiz Q: "What keyword sends a value BACK from a function?"
Options: ["send", "give", "output", "return"]
Correct index: 3
Correct msg: "return! It sends the result back to whoever called the function — mission complete!"
Wrong hint: "Python has one special keyword to send a value out of a function. It 'returns' it to the caller."

Fill: ["", " total"] answer: "return"
Praise: "return sends the value back — Eleven's mission report delivered!"

---
### "Organizing the Resistance" — Scope

Explanation: "Variables inside a function are private to that function — classified files only that agent can access!"

Code:
```
secret = "Hawkins"

def reveal_secret():
    local_msg = "The lab is at " + secret
    return local_msg

print(reveal_secret())
```
Output:
```
The lab is at Hawkins
```

Quiz Q: "A variable created INSIDE a function can be used..."
Options: ["Anywhere in the program", "Only inside that function", "Only in the next function", "Everywhere except main"]
Correct index: 1
Correct msg: "Only inside that function! Local scope keeps it classified — no leaks to the outside."
Wrong hint: "Variables inside a function are 'local' — they only exist while that function runs."

Fill: ["def ", "():"] answer: "reveal_secret"
Praise: "The name after def is the function's name — you pick it!"

---
### "Testing the Lab" — Assert

Explanation: "assert checks that your code does what you expect — like Hopper verifying every lab door is locked before leaving!"

Code:
```
def double_power(x):
    return x * 2

assert double_power(11) == 22
assert double_power(3) == 6
print("All power tests passed!")
```
Output:
```
All power tests passed!
```

Quiz Q: "What does assert do if the condition is False?"
Options: ["Prints a warning", "Returns False", "Raises an error", "Skips the line"]
Correct index: 2
Correct msg: "It raises an AssertionError — the test FAILS loudly. Just like Hopper when a door isn't locked!"
Wrong hint: "assert is all-or-nothing: if True, nothing happens. If False, the program crashes with an AssertionError."

Fill: ["assert double_power(11) ", " 22"] answer: "=="
Praise: "== checks equality — assert uses it to verify your code is correct!"

---
### "Finding the Right File" — List Indices

Explanation: "Each item in a list has a position number called an index — starting at 0! Like Hawkins Lab filing cabinets numbered from zero."

Code:
```
party = ["Mike", "Dustin", "Lucas", "Will", "Eleven"]
print(party[0])
print(party[4])
print(party[-1])
```
Output:
```
Mike
Eleven
Eleven
```

Quiz Q: "party = ['Mike','Dustin','Lucas']. What is party[1]?"
Options: ["Mike", "Dustin", "Lucas", "Error"]
Correct index: 1
Correct msg: "Dustin! Index 1 is the SECOND item — Python counts from 0. Tricky like the Upside Down!"
Wrong hint: "Python lists start at index 0. Count: 0=Mike, 1=Dustin, 2=Lucas."

Fill: ["print(party[", "])"] answer: "0"
Praise: "Index 0 is the first item — Python starts counting at zero!"

---
### "Decoding the Message" — String Manipulation

Explanation: "Strings are sequences of characters — slice them, split them, search inside them. Like decoding Joyce's light-up wall messages!"

Code:
```
message = "HELP WILL IS HERE"
print(message[0:4])
print(message.split(" "))
print(len(message))
```
Output:
```
HELP
['HELP', 'WILL', 'IS', 'HERE']
17
```

Quiz Q: "message = 'UPSIDE DOWN'. What does message[0:6] return?"
Options: ["UPSIDE", "UPSIDE DOWN", "DOWN", "UP"]
Correct index: 0
Correct msg: "UPSIDE! Slicing [0:6] takes characters from index 0 up to (not including) 6."
Wrong hint: "Slicing [start:end] takes from start index up to (but not including) end. Count the characters."

Fill: ["message.", '(" ")'] answer: "split"
Praise: ".split() breaks a string into a list of words — message decoded!"

---
### "Updating the Roster" — List Mutation

Explanation: "Lists can grow and shrink — use append to add, remove to delete, sort to organize. Like managing the Hawkins resistance party!"

Code:
```
party = ["Mike", "Dustin", "Lucas"]
party.append("Eleven")
party.append("Max")
party.remove("Lucas")
party.sort()
print(party)
print("Party size:", len(party))
```
Output:
```
['Dustin', 'Eleven', 'Max', 'Mike']
Party size: 4
```

Quiz Q: "Which method ADDS an item to the END of a list?"
Options: ["add()", "insert()", "push()", "append()"]
Correct index: 3
Correct msg: "append()! Eleven joins the end of the party list — she was the last to arrive but essential!"
Wrong hint: "Python lists have a specific method for adding to the end. It 'appends' — tacks on the end."

Fill: ["party.", '("Max")'] answer: "append"
Praise: "append() adds Max to the end of the party list — welcome to the team!"

---
### "Scanning All Records" — Dictionary Iteration

Explanation: "Loop through a dictionary with .items() to get every key-value pair — like scanning every file in Hawkins Lab!"

Code:
```
subject = {"name": "Eleven", "number": 11, "power": "telekinesis"}
for key, value in subject.items():
    print(key + ":", value)
```
Output:
```
name: Eleven
number: 11
power: telekinesis
```

Quiz Q: "How do you loop through BOTH keys and values in a dictionary?"
Options: ["for x in dict:", "for k, v in dict.items()", "for dict.keys():", "dict.loop()"]
Correct index: 1
Correct msg: ".items() gives you (key, value) pairs — scan every record in the Hawkins files!"
Wrong hint: "dict.items() returns (key, value) pairs. The for loop unpacks each pair into two variables."

Fill: ["for key, value in subject.", "():"] answer: "items"
Praise: ".items() gives every key-value pair — full file access granted!"

---
### "Files Within Files" — Nested Data

Explanation: "Dictionaries and lists can contain other dictionaries and lists — like a Hawkins Lab file with sub-files inside it!"

Code:
```
lab = {
    "name": "Hawkins Lab",
    "subjects": ["Eleven", "Eight", "Nine"],
    "director": {"name": "Brenner", "cleared": True}
}
print(lab["name"])
print(lab["subjects"][0])
print(lab["director"]["name"])
```
Output:
```
Hawkins Lab
Eleven
Brenner
```

Quiz Q: "lab = {'team': ['Mike', 'Dustin']}. How do you get 'Dustin'?"
Options: ["lab['team']['Dustin']", "lab['team'][1]", "lab[1]['team']", "lab.team[1]"]
Correct index: 1
Correct msg: "lab['team'][1]! First get the list with 'team', then index into it. Chained access!"
Wrong hint: "First get the list: lab['team']. Then index into it like a normal list: [1]."

Fill: ['lab["director"][', "]"] answer: '"name"'
Praise: "String keys in quotes access dictionary values — Brenner's file opened!"

---
### "Subject Blueprints" — Classes & Attributes

Explanation: "A class is a blueprint for creating objects — like a Hawkins Lab template for creating test subjects with their own data!"

Code:
```
class Subject:
    def __init__(self, name, number):
        self.name = name
        self.number = number

eleven = Subject("Eleven", 11)
eight = Subject("Eight", 8)
print(eleven.name, eleven.number)
print(eight.name, eight.number)
```
Output:
```
Eleven 11
Eight 8
```

Quiz Q: "What is the special method that runs automatically when you CREATE a new object?"
Options: ["__create__", "__start__", "__init__", "__new__"]
Correct index: 2
Correct msg: "__init__! It initializes the object's attributes — the lab opens a new subject file!"
Wrong hint: "Python classes use a special 'dunder' method to set up new objects. It INITializes them."

Fill: ["class ", ":"] answer: "Subject"
Praise: "class defines the blueprint — Subject is its name. Welcome to Hawkins Lab!"

---
### "Activating Abilities" — Methods

Explanation: "Methods are functions that belong to a class — like each subject having their own special power they can activate!"

Code:
```
class Subject:
    def __init__(self, name, power):
        self.name = name
        self.power = power

    def activate(self):
        return self.name + " uses " + self.power + "!"

eleven = Subject("Eleven", "telekinesis")
print(eleven.activate())
```
Output:
```
Eleven uses telekinesis!
```

Quiz Q: "What is the first parameter of every class method?"
Options: ["this", "class", "self", "object"]
Correct index: 2
Correct msg: "self! It refers to the specific object the method belongs to — Eleven knows she's Eleven!"
Wrong hint: "Every class method needs to know WHICH object it belongs to. Python passes it automatically as the first parameter."

Fill: ["def activate(", ")"] answer: "self"
Praise: "self refers to the object itself — Eleven knows she's Eleven, not Eight!"

---
### "Designing the Lab" — Class Design & Composition

Explanation: "Classes can contain other objects — a Lab class that holds many Subject objects. This is called composition!"

Code:
```
class Subject:
    def __init__(self, name):
        self.name = name

class Lab:
    def __init__(self, location):
        self.location = location
        self.subjects = []

    def add_subject(self, subject):
        self.subjects.append(subject)

    def roster(self):
        names = []
        for s in self.subjects:
            names.append(s.name)
        return names

lab = Lab("Hawkins")
lab.add_subject(Subject("Eleven"))
lab.add_subject(Subject("Eight"))
print(lab.location)
print(lab.roster())
```
Output:
```
Hawkins
['Eleven', 'Eight']
```

Quiz Q: "What is it called when one class contains instances of another class?"
Options: ["Inheritance", "Composition", "Abstraction", "Encapsulation"]
Correct index: 1
Correct msg: "Composition! A Lab HAS subjects — built from other objects. Like Hawkins Lab containing all subjects."
Wrong hint: "When a class CONTAINS objects of another class (HAS-A relationship), that's composition."

Fill: ["self.subjects.", "(subject)"] answer: "append"
Praise: "append adds a new Subject to the lab's roster — another file in the cabinet!"

---
## PYTHON SIMULATOR UPDATES (src/utils/pythonSimulator.ts)

Extend runPythonSimulator to handle all new patterns. Since these are known snippets, use pattern-matching per known content + general variable substitution:

New patterns to support:
1. type() calls → detect "type(varname)" and return "<class 'typename'>" based on value type
2. Basic if/elif/else with == comparisons on string variables
3. boolean literals True/False in assignments
4. while loops with counter variable (distance = 0; while distance < N; distance = distance + 1)
5. for loops with break/continue — simulate the tunnel example
6. import random — return pre-seeded output (Vecna, danger 7)
7. assert statements — if same as known expected output, print "All power tests passed!"
8. list[N] indexing — return the Nth element of a recognized list literal
9. message[0:4] slicing — return the slice
10. .split(" ") — return a Python-style list string
11. .append(), .remove(), .sort() — mutate an internal JS array and print result
12. class + __init__ + instantiation — detect class definition, store attributes, print them
13. method calls like eleven.activate() → return the concatenated string
14. nested dict/list access like lab["subjects"][0] — return the correct value
15. for s in self.subjects: names.append(s.name) → return ['Eleven', 'Eight']

The simulator does NOT need to be a general Python interpreter. For each known snippet, detect the key distinctive line (e.g. "import random", "class Subject", "while distance < 5", etc.) and return the known output. Additionally support simple variable substitution so students can change string values (like "Eleven" to their name) and see their name appear in output.

---
## IMPLEMENTATION NOTES

- Create src/components/Sidebar.tsx with the full navigation structure
- Create src/hooks/useActiveSection.ts with IntersectionObserver logic
- Update src/pages/Home.tsx to use sidebar layout
- Update src/utils/pythonSimulator.ts with new patterns
- Keep ConceptSection.tsx component unchanged — just pass new data to it
- All new sections use the EXACT same ConceptSection component with data props
- Maintain the Stranger Things dark aesthetic throughout
- Every new <section> element gets the id matching the sidebar links
- No eval() or Function() constructor
- No routing changes — single scrolling page
- Make sure Creepster and Fira Code fonts load (they should already be in index.css)
