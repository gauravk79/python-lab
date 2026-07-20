export type LearningResource = {
  label: string;
  url: string;
};

export type LearningModule = {
  objective: string;
  missionBrief: string;
  keyTakeaways: string[];
  briefingQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    correctFeedback: string;
    wrongFeedback: string;
  };
  summaryVideos?: Array<{
    title: string;
    url: string;
    youtubeUrl?: string;
    transcriptUrl?: string;
  }>;
  summaryVideo?: {
    title: string;
    url: string;
    youtubeUrl?: string;
    transcriptUrl?: string;
  };
  workedExample: {
    title: string;
    code: string;
    explanation: string;
  };
  commonPitfall: string;
  checkpoint: {
    question: string;
    answer: string;
  };
  miniChallenge?: {
    prompt: string;
    task: string;
    solution: string;
  };
  resources: LearningResource[];
};

type ConceptSeed = {
  id: string;
  title: string;
  explanation: string;
  initialCode: string;
};

type LessonOverrides = Partial<Omit<LearningModule, 'resources'>> & {
  resourceQuery?: string;
  customResources?: LearningResource[];
  hideSummaryVideo?: boolean;
};

const KHAN_COURSE_URL =
  'https://www.khanacademy.org/computing/intro-to-python-fundamentals';
const KHAN_DEFAULT_TRANSCRIPT_URL =
  'https://www.khanacademy.org/transcript/xfb9a45063ea6473f';

const LESSON_OVERRIDES: Record<string, LessonOverrides> = {
  'data-types': {
    objective: 'Classify values as integer, float, string, or boolean and explain why that classification matters.',
    missionBrief:
      'Transmission intercepted: Hawkins Lab captured raw values from the Upside Down feed. Your task is to label each value by type before the system can process it safely.',
    customResources: [
      {
        label: 'Khan Academy: Data types',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:program-execution/a/data-types',
      },
    ],
    summaryVideos: [
      {
        title: 'Primitive data types (quick recap)',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:video-extras/x5279a44ae0ab15d6:video-shorts/v/primitive-data-types',
        youtubeUrl: 'https://www.youtube.com/watch?v=cchjwZPmlY4',
        transcriptUrl: 'https://www.khanacademy.org/transcript/xfb9a45063ea6473f',
      },
      {
        title: 'Tracing program execution',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:program-execution/v/intro-to-tracing-program-execution',
        youtubeUrl: 'https://www.youtube.com/watch?v=N-oyB_UYZ74',
      },
    ],
    hideSummaryVideo: false,
    keyTakeaways: [
      'Integers are whole numbers with no decimal point (for example -47 or 2024).',
      'Floats include a decimal point, even when the decimal part is zero (for example 100.0).',
      'Booleans are only True or False, and capitalization matters in Python.',
      'Strings must be wrapped in quotes, even when they look like numbers (for example "5280").',
      'Complex media like images and audio are represented under the hood using numeric values.',
    ],
    workedExample: {
      title: 'Type labeling scan',
      code: 'distance_miles = 21\nalert_code = "False"\nsignal_strength = -64.87\nportal_open = True\n\nprint(distance_miles, "-> integer")\nprint(alert_code, "-> string")\nprint(signal_strength, "-> float")\nprint(portal_open, "-> boolean")',
      explanation:
        'Notice the difference between True (boolean) and "False" (string). Quotes define strings; absence of quotes plus correct capitalization defines booleans.',
    },
    commonPitfall:
      'Treating quoted values like numbers or booleans causes logic mistakes. "100.0" is a string, not a float, until converted.',
    checkpoint: {
      question: 'What is the type of "False" and why is it different from False?',
      answer: '"False" is a string because it is quoted text. False (without quotes) is a boolean value.',
    },
    briefingQuiz: {
      question: 'Which value below is a float?',
      options: ['"98.5"', '98.5', 'False', '"False"'],
      correctIndex: 1,
      correctFeedback: 'Correct. 98.5 is numeric and has a decimal point, so it is a float.',
      wrongFeedback: 'Look for a decimal number without quotes. Quoted values are strings.',
    },
    resourceQuery: 'python data types',
  },
  variables: {
    objective: 'Use variables to avoid hardcoding, reuse results, generalize code, and choose clear names.',
    missionBrief:
      'Your intel labels should do more than store one value. In Hawkins Lab, strong variable design lets you reuse the same signal in multiple places, save calculations once instead of repeating them, build code that can swap to a new target quickly, and avoid NameErrors caused by unclear or mistyped labels.',
    summaryVideos: [
      {
        title: 'Variables & assignments',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:variables/v/what-is-a-variable-python',
        youtubeUrl: 'https://www.youtube.com/watch?v=52RHZdBSjTw',
      },
      {
        title: 'Tracing Variables',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:variables/v/evaluating-variable-expressions',
        youtubeUrl: 'https://www.youtube.com/watch?v=HW__or3B9pw',
      },
      {
        title: 'User Input & Frontend Development',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:variables/v/user-input-and-frontend-development',
        youtubeUrl: 'https://www.youtube.com/watch?v=SOLnbKI73Wo',
      },
    ],
    customResources: [
      {
        label: 'Khan Academy: Variable design patterns',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:variables/a/variable-design-patterns',
      },
      {
        label: 'Khan Academy: Python style guide',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/a/python-style-guide',
      },
      {
        label: 'Khan Academy: Built-in functions',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/a/built-in-functions',
      },
    ],
    keyTakeaways: [
      'Store one value in a variable when you need it in multiple places instead of hardcoding it repeatedly.',
      'Save important calculations into variables so you can reuse the result without recomputing it everywhere.',
      'Generalize your code by changing a variable value instead of rewriting several output lines or URLs.',
      'Choose descriptive snake_case names so humans can understand the program quickly.',
      'Use noun-style names for data (for example mission_total) and yes/no names for booleans (for example is_stable).',
      'Function docs use a signature like min(x, y) to show input count/order and what value is returned.',
      'print(x) displays output, while str(x), int(x), and float(x) convert values and return new ones.',
      'A NameError happens when you use a variable before defining it or mistype its name.',
    ],
    commonPitfall:
      'Two beginner traps: repeating literal values in many places and assuming all text can be cast directly (for example int("99.99") raises ValueError). Both make debugging much harder.',
    checkpoint: {
      question: 'What does a function signature like min(x, y) tell you?',
      answer: 'It tells you the function name, how many input arguments to pass, and the order those arguments should be provided.',
    },
    workedExample: {
      title: 'Variable design pattern scan',
      code: 'mission_code = "XR-17"\nenergy_cell_count = 4\nenergy_per_cell = 6\ntotal_energy = energy_cell_count * energy_per_cell\nscanner_region = "north-gate"\nstatus_message = "Scanner locked on " + scanner_region\n\nprint("Mission code:", mission_code)\nprint("Repeat code:", mission_code)\nprint("Total energy:", total_energy)\nprint("Reserve energy check:", total_energy)\nprint(status_message)',
      explanation:
        'This original Hawkins-style snippet shows the same patterns without hardcoding repeated values: mission_code is reused in multiple outputs, total_energy stores a calculation once for reuse, scanner_region makes the final message easy to swap later, and the snake_case names keep each role clear.',
    },
    briefingQuiz: {
      question: 'Which option best shows the variable design pattern of reusing a result?',
      options: [
        'print(14.5 * 3)\nprint(14.5 * 3)',
        'total = 14.5 * 3\nprint(total)\nprint(total)',
        'print("total")\nprint("total")',
        '14.5 * 3 = total\nprint(total)',
      ],
      correctIndex: 1,
      correctFeedback: 'Correct. Compute once, store the result, and reuse the variable everywhere you need it.',
      wrongFeedback: 'The design pattern is: do the calculation once, assign it to a variable, then reuse that variable.',
    },
    miniChallenge: {
      prompt: 'Mini challenge: Generalize the signal',
      task: 'Create a variable named station_name, give it a value, and use it in two different print lines so changing one assignment updates both outputs.',
      solution: 'station_name = "Starcourt"\nprint("Scanning station:", station_name)\nprint("Station cleared:", station_name)',
    },
  },
  math: {
    objective: 'Use arithmetic operators to model game and story calculations.',
    customResources: [
      {
        label: 'Khan Academy: Python style guide',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/a/python-style-guide',
      },
      {
        label: 'Khan Academy: Built-in functions',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/a/built-in-functions',
      },
    ],
    summaryVideos: [
      {
        title: 'PRINT FUNCTION',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:program-execution/v/plus-operator-and-the-print-function',
        youtubeUrl: 'https://www.youtube.com/watch?v=lkQT8zb0_A8',
      },
      {
        title: 'Type Casting',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/v/type-casting',
        youtubeUrl: 'https://www.youtube.com/watch?v=y-FlANhhNiA',
      },
      {
        title: 'Tracing Order of Operations',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/v/tracing-order-of-operations',
        youtubeUrl: 'https://www.youtube.com/watch?v=7Gc4wAQZcfA',
      },
    ],
    keyTakeaways: [
      'Use * for multiplication and / for division.',
      'Use ** for exponents.',
      'Store computed values in new variables to reuse them.',
      'Use built-in helpers like round(x, 2), min(...), max(...), and abs(x) instead of manual workaround math.',
      'len(text) counts all characters in a string, including spaces and punctuation.',
      'Keep arithmetic readable with one space around operators and no extra spaces inside parentheses.',
      'Break long expressions into intermediate variables so each line has one clear purpose.',
    ],
    workedExample: {
      title: 'Built-in function toolkit scan',
      code: 'base_signal = 84.5924\nshadow_loss = -3.6\nroute_a = 42.8\nroute_b = 39.95\nstatus = "Signal lock confirmed"\n\nprint("Rounded signal:", round(base_signal, 2))\nprint("Absolute loss:", abs(shadow_loss))\nprint("Best route:", min(route_a, route_b))\nprint("Worst route:", max(route_a, route_b))\nprint("Status length:", len(status))',
      explanation:
        'This snippet demonstrates common built-in functions for arithmetic and strings. Each call takes inputs (arguments) and returns a value you can print or reuse.',
    },
    commonPitfall:
      'Assuming ^ is power or packing too much math into one dense line. In Python exponent is **, and readable steps are easier to debug.',
    briefingQuiz: {
      question: 'You need to show 84.5924 as a price with two decimal places. Which call is correct?',
      options: ['round(84.5924)', 'round(84.5924, 2)', 'int(84.5924)', 'abs(84.5924, 2)'],
      correctIndex: 1,
      correctFeedback: 'Correct. round(x, 2) keeps two digits after the decimal.',
      wrongFeedback: 'Use round(x, 2) when you need two decimal places in output.',
    },
    checkpoint: {
      question: 'How do you square 11 in Python?',
      answer: 'Use 11 ** 2.',
    },
    resourceQuery: 'python arithmetic operators',
  },
  debugging: {
    objective: 'Identify syntax, runtime, and logic errors in one command-center mission and choose the right fix strategy for each.',
    missionBrief:
      'Bugs are normal. In Hawkins Lab, this single command-center section now covers all three failure classes: syntax errors block execution, runtime errors crash mid-run, and logic errors run but give the wrong result.',
    keyTakeaways: [
      'Syntax errors: invalid Python structure, so execution does not begin.',
      'Runtime errors: program starts, then fails on a specific line.',
      'Logic errors: program finishes, but output does not match intent.',
      'Debug faster by writing and testing in small checkpoints.',
      'Use the terminal scenario presets to practice each bug class in sequence: Syntax -> Runtime -> Logic.',
    ],
    summaryVideos: [
      {
        title: 'Debugging with Linters and Stack Traces',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:program-execution/v/debugging-with-linters-and-stack-traces',
        youtubeUrl: 'https://www.youtube.com/watch?v=WUoCSkSW4cs',
      },
    ],
    workedExample: {
      title: 'Command-center scenario presets',
      code: '# Scenario 1: Syntax error\nprint("Run me!")\nprint("Signal check")\nprint(12.43 + 38.43 +)\n\n# Scenario 2: Runtime error\nprint("Runtime scan started")\nprint(28.32 + 431.89)\nprint(47 + "82")\n\n# Scenario 3: Logic error\nprint("The sum of the numbers from 1 to 10 is:")\nprint(1 + 2 + 3 + 4 + 5 + 6 + 7 + 9 + 10)',
      explanation:
        'Load one scenario at a time into the terminal. First classify the bug type, then apply a targeted fix and rerun immediately.',
    },
    commonPitfall:
      'Trying random fixes before naming the error type wastes time. First classify: syntax, runtime, or logic, then choose a targeted fix.',
    checkpoint: {
      question: 'In this merged section, what is your first move when a run fails: patch code immediately or classify the bug class first?',
      answer: 'Classify the bug class first (syntax, runtime, or logic), then choose a targeted fix. Classification drives faster debugging.',
    },
    briefingQuiz: {
      question: 'A program runs to completion with no traceback, but answer is wrong. What bug type is most likely?',
      options: ['Syntax error', 'Runtime error', 'Logic error', 'Import error'],
      correctIndex: 2,
      correctFeedback: 'Correct. Logic errors are intent mismatches: code runs, result is wrong.',
      wrongFeedback: 'Look for whether the program crashed. If it did not crash but output is wrong, that is a logic error.',
    },
    customResources: [
      {
        label: 'Khan Academy: Syntax, runtime, and logic errors',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:program-execution/a/errors',
      },
    ],
  },
  'runtime-errors': {
    summaryVideos: [
      {
        title: 'Debugging with Linters and Stack Traces',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:program-execution/v/debugging-with-linters-and-stack-traces',
        youtubeUrl: 'https://www.youtube.com/watch?v=WUoCSkSW4cs',
      },
    ],
  },
  'comment-checkpoints': {
    objective: 'Write mission notes that improve readability, maintenance, and debugging speed.',
    hideSummaryVideo: true,
    keyTakeaways: [
      'Use comments to explain intent (why a step exists), not obvious mechanics (what Python syntax already shows).',
      'Write comments as complete sentences with one space after #.',
      'Use blank lines to separate logical code blocks, like short paragraphs.',
      'Keep comments synchronized with code changes so old notes do not mislead teammates.',
    ],
    commonPitfall:
      'Stale comments are worse than no comments. If code changes, update or remove the comment immediately.',
    checkpoint: {
      question: 'Checkpoint: What should this comment explain, the why or a line-by-line syntax description?',
      answer: 'Explain the why. Let code structure show the mechanics unless a non-obvious detail needs clarification.',
    },
    briefingQuiz: {
      question: 'Which comment is stronger for teammates?',
      options: [
        '# add 2 numbers',
        '# Combine base and bonus weight to compute the mission total.',
        '# do math now',
        '# code stuff',
      ],
      correctIndex: 1,
      correctFeedback: 'Correct. Good comments explain intention and context, not vague mechanics.',
      wrongFeedback: 'Pick the option that explains why the line exists and what mission purpose it serves.',
    },
    customResources: [
      {
        label: 'Khan Academy: Python style guide',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals/x5279a44ae0ab15d6:computational-thinking-with-variables/x5279a44ae0ab15d6:arithmetic-expressions/a/python-style-guide',
      },
    ],
  },
  'field-challenge-1': {
    objective:
      'Decode live Hawkins cargo readings by writing a full mission script that converts intercepted values, computes total and average crate weight, and reports both outputs exactly.',
  },
  'terminal-challenge': {
    objective:
      'Complete the final repair mission by fixing language code, correcting numeric conversion, and producing the exact portal and best-signal outputs.',
  },
  'if-statements': {
    objective: 'Write branch logic that reacts to changing mission conditions.',
    keyTakeaways: [
      'if runs code only when a condition is True.',
      'Use indentation to keep branch blocks clear.',
      'Branching controls behavior without duplicating whole scripts.',
    ],
    commonPitfall:
      'Forgetting indentation after if causes syntax issues or wrong block behavior.',
    checkpoint: {
      question: 'When does an if block execute?',
      answer: 'Only when its condition evaluates to True.',
    },
    resourceQuery: 'python if statements',
  },
  'for-loops': {
    objective: 'Repeat operations with predictable iteration ranges.',
    keyTakeaways: [
      'for loops are ideal when count is known.',
      'range(n) gives values from 0 to n-1.',
      'Loop bodies should do one clear repeatable action.',
    ],
    commonPitfall:
      'Off by one errors from misunderstanding range boundaries.',
    checkpoint: {
      question: 'What values come from range(3)?',
      answer: '0, 1, and 2.',
    },
    resourceQuery: 'python for loops range',
  },
  functions: {
    objective: 'Package reusable logic into functions for cleaner programs.',
    keyTakeaways: [
      'def creates a function definition.',
      'Function parameters allow flexible inputs.',
      'Functions reduce copy and paste across your code.',
    ],
    commonPitfall:
      'Defining a function but never calling it leads to no output changes.',
    checkpoint: {
      question: 'Why use functions instead of repeating the same lines?',
      answer: 'Functions improve reuse, readability, and easier updates.',
    },
    resourceQuery: 'python functions',
  },
  dictionaries: {
    objective: 'Store and retrieve structured key value records.',
    keyTakeaways: [
      'Dictionary keys map to specific values.',
      'Use brackets to read or update a key value pair.',
      'Dictionaries are strong for profiles and lookups.',
    ],
    commonPitfall:
      'Accessing a missing key directly raises errors unless guarded.',
    checkpoint: {
      question: 'Which structure is best for profile fields like name and level?',
      answer: 'A dictionary because fields map by name to values.',
    },
    resourceQuery: 'python dictionaries',
  },
  classes: {
    objective: 'Model custom objects with shared structure and behavior.',
    keyTakeaways: [
      'Classes define blueprints for objects.',
      'Methods are functions attached to class instances.',
      'Object design groups data and behavior together.',
    ],
    commonPitfall:
      'Forgetting self in instance methods breaks attribute access.',
    checkpoint: {
      question: 'Why use a class instead of many unrelated variables?',
      answer: 'Classes keep related state and behavior together in one model.',
    },
    resourceQuery: 'python classes objects',
  },
};

const toTitleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const buildSearchUrl = (query: string) =>
  `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(query)}`;

export const buildLearningModule = (concept: ConceptSeed): LearningModule => {
  const override = LESSON_OVERRIDES[concept.id];
  const defaultTopic = toTitleCase(concept.id || concept.title);

  return {
    objective:
      override?.objective ||
      `Explain and apply ${defaultTopic.toLowerCase()} in a short Python mission script.`,
    missionBrief:
      override?.missionBrief || concept.explanation,
    keyTakeaways:
      override?.keyTakeaways || [
        'Understand the core rule in this concept.',
        'Read the worked example line by line.',
        'Use the practice terminal to test your understanding immediately.',
      ],
    summaryVideos: override?.summaryVideos || (override?.summaryVideo
      ? [override.summaryVideo]
      : undefined),
    summaryVideo: override?.hideSummaryVideo
      ? undefined
      : (override?.summaryVideo || {
          title: `Khan Summary Video: ${defaultTopic}`,
          url: KHAN_COURSE_URL,
          transcriptUrl: KHAN_DEFAULT_TRANSCRIPT_URL,
        }),
    workedExample:
      override?.workedExample || {
        title: `${concept.title} mission example`,
        code: concept.initialCode,
        explanation:
          'Run this snippet, inspect each line, and connect output back to the concept rule before moving to the challenge.',
      },
    commonPitfall:
      override?.commonPitfall ||
      'Moving too fast from reading to coding without checking assumptions usually creates avoidable bugs.',
    checkpoint: override?.checkpoint || {
      question: `In one sentence, what rule defines ${defaultTopic.toLowerCase()}?`,
      answer:
        'A correct answer names the rule clearly and describes when you should apply it in code.',
    },
    resources:
      override?.customResources ||
      [
        {
          label: 'Khan Academy: Intro to Python Fundamentals',
          url: KHAN_COURSE_URL,
        },
        {
          label: `Khan Academy search: ${override?.resourceQuery || defaultTopic}`,
          url: buildSearchUrl(override?.resourceQuery || `${defaultTopic} python`),
        },
      ],
  };
};
