# My First Python Program 🐍

# --- Variables ---
name = "World"
version = 1

print("=" * 40)
print(f"  My First Python Program (v{version})")
print("=" * 40)
print()

# --- Greeting ---
print(f"Hello, {name}!")
print("Welcome to Python — let's explore the basics.\n")

# --- Numbers & Math ---
print("--- Numbers & Math ---")
a = 7
b = 3
print(f"  {a} + {b} = {a + b}")
print(f"  {a} - {b} = {a - b}")
print(f"  {a} * {b} = {a * b}")
print(f"  {a} / {b} = {a / b:.2f}")
print(f"  {a} ** {b} = {a ** b}  (that's {a} to the power of {b})")
print()

# --- Strings ---
print("--- Strings ---")
message = "python is fun"
print(f"  Original : {message}")
print(f"  Uppercase: {message.upper()}")
print(f"  Title case: {message.title()}")
print(f"  Length   : {len(message)} characters")
print()

# --- Lists & Loops ---
print("--- Lists & Loops ---")
fruits = ["apple", "banana", "cherry", "mango", "kiwi"]
print(f"  Fruit list: {fruits}")
print("  Let's loop through them:")
for i, fruit in enumerate(fruits, start=1):
    print(f"    {i}. {fruit.capitalize()}")
print()

# --- Functions ---
def greet(person_name):
    """A simple function that returns a greeting."""
    return f"Hey there, {person_name}! 👋"

def is_even(number):
    """Returns True if the number is even."""
    return number % 2 == 0

print("--- Functions ---")
print(f"  {greet('Python Learner')}")
print()

print("  Checking even / odd for 1 to 10:")
for n in range(1, 11):
    label = "even" if is_even(n) else "odd"
    print(f"    {n:2d} is {label}")
print()

# --- Dictionaries ---
print("--- Dictionaries ---")
person = {
    "name": "Alice",
    "age": 28,
    "language": "Python",
    "level": "Beginner",
}
print("  Profile:")
for key, value in person.items():
    print(f"    {key:<10}: {value}")
print()

# --- Done ---
print("=" * 40)
print("  That's Python basics in a nutshell!")
print("  Keep coding — you're doing great. 🚀")
print("=" * 40)
