import { CodeHighlighter } from '../components/CodeHighlighter';

type Concept = {
  id: string;
  title: string;
  emoji: string;
  explanation: string;
  code: string;
  output: string;
  theme: {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    terminalText: string;
  };
};

const concepts: Concept[] = [
  {
    id: "variables",
    title: "Variables",
    emoji: "🏷️",
    explanation: "Variables are like magical boxes where you can store information. You can give a box a name and put anything you want inside it!",
    code: `name = "Alex"\nage = 10\nprint("Hello, my name is", name)\nprint("I am", age, "years old")`,
    output: `Hello, my name is Alex\nI am 10 years old`,
    theme: {
      bg: "bg-[#fff0f3]",
      border: "border-[#ffccd5]",
      text: "text-[#e5383b]",
      iconBg: "bg-[#ffb3c1]",
      terminalText: "text-rose-200",
    }
  },
  {
    id: "math",
    title: "Math",
    emoji: "🔢",
    explanation: "Python is super smart at math. You can use it as a giant calculator to add, subtract, multiply, and even find huge powers!",
    code: `a = 7\nb = 3\nprint(a + b)   # 10\nprint(a - b)   # 4\nprint(a * b)   # 21\nprint(a ** b)  # 343`,
    output: `10\n4\n21\n343`,
    theme: {
      bg: "bg-[#f0f8ff]",
      border: "border-[#bde0fe]",
      text: "text-[#0077b6]",
      iconBg: "bg-[#a2d2ff]",
      terminalText: "text-blue-200",
    }
  },
  {
    id: "strings",
    title: "Strings",
    emoji: "🔤",
    explanation: "A string is just a line of text or characters. Python can do cool tricks with strings, like making them ALL CAPS or counting how many letters they have.",
    code: `message = "python is fun"\nprint(message.upper())\nprint(message.title())\nprint(len(message))`,
    output: `PYTHON IS FUN\nPython Is Fun\n13`,
    theme: {
      bg: "bg-[#fff6e6]",
      border: "border-[#ffe0b2]",
      text: "text-[#f57c00]",
      iconBg: "bg-[#ffcc80]",
      terminalText: "text-orange-200",
    }
  },
  {
    id: "lists",
    title: "Lists & Loops",
    emoji: "🍎",
    explanation: "A list keeps your things in order. A loop lets you do something to every single item in that list without writing it over and over again!",
    code: `fruits = ["Apple", "Banana", "Cherry"]\nfor fruit in fruits:\n    print(fruit)`,
    output: `Apple\nBanana\nCherry`,
    theme: {
      bg: "bg-[#f0fff4]",
      border: "border-[#bbf7d0]",
      text: "text-[#16a34a]",
      iconBg: "bg-[#86efac]",
      terminalText: "text-green-200",
    }
  },
  {
    id: "functions",
    title: "Functions",
    emoji: "⚙️",
    explanation: "Functions are mini-programs inside your code. You build a machine once, give it a name, and then you can use it whenever you want!",
    code: `def greet(name):\n    return "Hello, " + name + "!"\n\nprint(greet("Alex"))\nprint(greet("Sam"))`,
    output: `Hello, Alex!\nHello, Sam!`,
    theme: {
      bg: "bg-[#fdf4ff]",
      border: "border-[#f5d0fe]",
      text: "text-[#c026d3]",
      iconBg: "bg-[#e879f9]",
      terminalText: "text-purple-200",
    }
  },
  {
    id: "dictionaries",
    title: "Dictionaries",
    emoji: "📖",
    explanation: "Just like a real dictionary links a word to its meaning, a Python dictionary links a 'key' to a 'value'. It's perfect for keeping track of details!",
    code: `person = {"name": "Alex", "age": 10, "language": "Python"}\nfor key, value in person.items():\n    print(key, ":", value)`,
    output: `name : Alex\nage : 10\nlanguage : Python`,
    theme: {
      bg: "bg-[#fffbf0]",
      border: "border-[#fef08a]",
      text: "text-[#ca8a04]",
      iconBg: "bg-[#fde047]",
      terminalText: "text-yellow-200",
    }
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans pb-32">
      <header className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6 animate-bounce">
          <span className="text-7xl">🐍</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
          <span className="text-rose-500">My</span>{' '}
          <span className="text-blue-500">First</span>{' '}
          <br className="md:hidden" />
          <span className="text-emerald-500">Python</span>{' '}
          <span className="text-amber-500">Program</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
          A fun, easy way to learn coding! Read the explanations, check out the code, and see what happens.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 space-y-16">
        {concepts.map((concept) => (
          <section 
            key={concept.id}
            className={`${concept.theme.bg} border-4 ${concept.theme.border} rounded-[2rem] p-6 md:p-10 shadow-sm transition-transform hover:-translate-y-1 duration-300`}
          >
            <div className="flex items-center gap-5 mb-6">
              <div className={`${concept.theme.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0`}>
                {concept.emoji}
              </div>
              <h2 className={`text-4xl md:text-5xl font-display font-bold ${concept.theme.text}`}>
                {concept.title}
              </h2>
            </div>
            
            <p className="text-lg md:text-xl text-gray-800 font-medium mb-10 leading-relaxed">
              {concept.explanation}
            </p>

            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl border border-gray-800 font-mono text-[14px] md:text-[16px] leading-relaxed">
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 border-b border-gray-800">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
                <span className="ml-4 text-xs text-gray-400 font-sans tracking-wide">main.py</span>
              </div>
              
              <div className="p-5 md:p-8 overflow-x-auto">
                <pre className="whitespace-pre">
                  <code>
                    <CodeHighlighter code={concept.code} />
                  </code>
                </pre>
              </div>
              
              <div className="bg-[#0a0a0a] border-t border-gray-800 flex flex-col">
                <div className="px-4 py-2 border-b border-gray-800 bg-[#141414] flex items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Output</span>
                </div>
                <div className="p-5 md:p-8 overflow-x-auto">
                  <pre className={`whitespace-pre ${concept.theme.terminalText} font-mono`}>
                    {concept.output}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="max-w-3xl mx-auto px-6 mt-24">
        <div className="bg-gradient-to-r from-rose-400 via-purple-500 to-blue-500 rounded-[2rem] p-10 md:p-14 text-center text-white shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            You're doing great!
          </h2>
          <p className="text-2xl md:text-3xl font-medium opacity-90">
            Keep coding 🚀
          </p>
        </div>
      </footer>
    </div>
  );
}
