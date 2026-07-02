import streamlit as st

st.title("🐍 My First Python Program")
st.write("Welcome! Let's explore Python basics together.")

# --- Variables ---
st.header("📦 Variables")
name = "World"
version = 1
st.write(f"Hello, **{name}**!")
st.write(f"This is version **{version}** of our program.")

# --- Numbers & Math ---
st.header("🔢 Numbers & Math")
a = 7
b = 3
col1, col2, col3, col4, col5 = st.columns(5)
col1.metric(f"{a} + {b}", a + b)
col2.metric(f"{a} - {b}", a - b)
col3.metric(f"{a} × {b}", a * b)
col4.metric(f"{a} ÷ {b}", f"{a / b:.2f}")
col5.metric(f"{a} ^ {b}", a ** b)

# --- Strings ---
st.header("🔤 Strings")
message = "python is fun"
st.write(f"Original: `{message}`")
st.write(f"Uppercase: `{message.upper()}`")
st.write(f"Title Case: `{message.title()}`")
st.write(f"Length: `{len(message)}` characters")

# --- Lists & Loops ---
st.header("🍎 Lists & Loops")
fruits = ["Apple", "Banana", "Cherry", "Mango", "Kiwi"]
st.write("Here is a list of fruits:")
for i, fruit in enumerate(fruits, start=1):
    st.write(f"  {i}. {fruit}")

# --- Functions ---
st.header("⚙️ Functions")

def greet(person_name):
    return f"Hey there, {person_name}! 👋"

def is_even(number):
    return number % 2 == 0

st.write(greet("Python Learner"))
st.write("Is each number even or odd?")
cols = st.columns(10)
for i, n in enumerate(range(1, 11)):
    label = "Even ✅" if is_even(n) else "Odd ❌"
    cols[i].write(f"**{n}**")
    cols[i].caption(label)

# --- Dictionaries ---
st.header("📖 Dictionaries")
person = {"Name": "Alice", "Age": 28, "Language": "Python", "Level": "Beginner"}
st.write("A dictionary stores information like this:")
st.table(person.items())

st.success("That's Python basics — you're doing great! 🚀")
