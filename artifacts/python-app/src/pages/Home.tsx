import React from 'react';
import { ConceptSection, ConceptData } from '../components/ConceptSection';

const concepts: ConceptData[] = [
  {
    id: "variables",
    title: "Variables",
    emoji: "🏷️",
    explanation: "Variables are like the boxes in Joyce's living room — you label them and store something inside!",
    initialCode: `hero = "Eleven"\npower_level = 11\nprint("Hero:", hero)\nprint("Power level:", power_level)`,
    quiz: {
      question: "Eleven needs to store her name in Python. Which line is correct?",
      options: ['print("Eleven")', 'name = "Eleven"', '"Eleven" = name', 'store("Eleven")'],
      correctIndex: 1,
      correctFeedback: "Friends don't lie — and neither does Python! = puts a value into a variable.",
      wrongFeedback: "Variables use = to assign. The name goes on the LEFT, the value on the right."
    },
    blank: {
      textParts: ["hero ", " \"Eleven\""],
      answer: "=",
      praise: "= assigns a value to a variable. You cracked the Hawkins Lab code!"
    }
  },
  {
    id: "math",
    title: "Math",
    emoji: "🔢",
    explanation: "Python can crunch numbers faster than Dustin can calculate Demogorgon claw count!",
    initialCode: `demogorgons = 3\nclaws_each = 4\ntotal_claws = demogorgons * claws_each\nprint("Total claws:", total_claws)\nprint("Claws squared:", claws_each ** 2)`,
    quiz: {
      question: "Dustin counts 3 Demogorgons, each with 4 claws. Which code finds the total?",
      options: ["4 + 3", "claws = 4 - 3", "claws = 4 * 3", "claws = 4 / 3"],
      correctIndex: 2,
      correctFeedback: "12 claws total! * means multiply — run, Dustin, RUN!",
      wrongFeedback: "Counting repeated groups means multiplying. Which operator is that?"
    },
    blank: {
      textParts: ["print(11 ", " 2)"],
      answer: "**",
      praise: "** is the power operator! 11 ** 2 = 121. Eleven... squared!"
    }
  },
  {
    id: "strings",
    title: "Strings",
    emoji: "🔤",
    explanation: "Strings are text — like secret messages Joyce spells out with her Christmas lights!",
    initialCode: `message = "the upside down"\nprint(message.upper())\nprint(message.title())\nprint(len(message))`,
    quiz: {
      question: "Mike wants to print 'THE UPSIDE DOWN' in all caps. Which code works?",
      options: ["print(msg.lower())", "print(msg.upper())", "print(upper(msg))", "print(msg.caps())"],
      correctIndex: 1,
      correctFeedback: ".upper() shouts your string into ALL CAPS — like yelling across the Upside Down!",
      wrongFeedback: "String methods go after a dot. Which one makes text uppercase?"
    },
    blank: {
      textParts: ["print(message.", "())"],
      answer: "upper",
      praise: ".upper() sends your text to the UPSIDE DOWN — in ALL CAPS!"
    }
  },
  {
    id: "lists",
    title: "Lists & Loops",
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
    id: "functions",
    title: "Functions",
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
    id: "dictionaries",
    title: "Dictionaries",
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
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32 selection:bg-[#e63946] selection:text-white">
      <header className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center relative">
        <div className="xmas-lights" aria-hidden="true">
          <div className="bulb red"></div>
          <div className="bulb blue"></div>
          <div className="bulb yellow"></div>
          <div className="bulb green"></div>
          <div className="bulb red"></div>
          <div className="bulb blue"></div>
          <div className="bulb yellow"></div>
        </div>
        
        <h1 className="text-7xl md:text-[7rem] leading-none font-display text-[#e63946] glow-text-red mb-6 tracking-wide drop-shadow-2xl">
          Hawkins <br className="md:hidden" /> Python Lab
        </h1>
        <p className="text-xl md:text-2xl text-[#ffb703] font-mono tracking-tight uppercase border-y border-[#ffb703]/30 py-4 inline-block mx-auto shadow-inner bg-black/20 px-8">
          Classified. Do not share with the Mind Flayer.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-20 relative z-10">
        {concepts.map((concept) => (
          <ConceptSection key={concept.id} concept={concept} />
        ))}
      </main>

      <footer className="max-w-4xl mx-auto px-6 mt-32">
        <div className="bg-[#120000] border-2 border-[#e63946] glow-red rounded-[2rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-[#e63946] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
           <div className="absolute top-0 left-0 w-full h-1 bg-[#e63946] glow-red"></div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e63946] glow-red"></div>
           
           <h2 className="relative z-10 text-4xl md:text-6xl font-display text-[#e63946] glow-text-red tracking-widest mb-6 transform group-hover:scale-105 transition-transform duration-500">
             You're not in the Upside Down anymore
           </h2>
           <p className="relative z-10 text-xl md:text-3xl font-bold font-sans text-gray-200 tracking-wide">
             — you're a Python coder! —
           </p>
        </div>
      </footer>
    </div>
  );
}
