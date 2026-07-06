import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { runPythonSimulator } from '../utils/pythonSimulator';
import { useProgress } from '@/context/progress-context';
import { useAuth } from '@/context/auth-context';

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

export function ConceptSection({
  concept,
  onPromptLogin,
}: {
  concept: ConceptData;
  onPromptLogin: () => void;
}) {
  const { user } = useAuth();
  const { sectionProgressById, updateSectionProgress } = useProgress();
  const savedProgress = sectionProgressById[concept.id];
  const [code, setCode] = useState(concept.initialCode);
  const [output, setOutput] = useState('');
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  const [blankValue, setBlankValue] = useState('');
  const [blankSubmitted, setBlankSubmitted] = useState(false);
  const [terminalSolved, setTerminalSolved] = useState(false);
  const isTerminalChallenge = concept.id === 'terminal-challenge';

  React.useEffect(() => {
    setCode(concept.initialCode);
    setOutput('');
  }, [concept.initialCode]);

  React.useEffect(() => {
    setQuizChoice(savedProgress?.quizChoice ?? null);
    setQuizSubmitted(savedProgress?.quizSubmitted ?? false);
    setBlankValue(savedProgress?.blankValue ?? '');
    setBlankSubmitted(savedProgress?.blankSubmitted ?? false);
    setTerminalSolved(savedProgress?.terminalSolved ?? false);
  }, [
    concept.id,
    savedProgress?.blankSubmitted,
    savedProgress?.blankValue,
    savedProgress?.quizChoice,
    savedProgress?.quizSubmitted,
    savedProgress?.terminalSolved,
  ]);

  const buildSavedProgress = (
    nextQuizChoice: number | null,
    nextQuizSubmitted: boolean,
    nextBlankValue: string,
    nextBlankSubmitted: boolean,
    nextTerminalSolved: boolean,
  ) => {
    const nextQuizCorrect =
      nextQuizSubmitted && nextQuizChoice === concept.quiz.correctIndex;
    const nextBlankCorrect =
      nextBlankSubmitted && nextBlankValue.trim() === concept.blank.answer;
    const quizSignalBoost = isTerminalChallenge ? 25 : 50;
    const blankSignalBoost = isTerminalChallenge ? 25 : 50;
    const terminalSignalBoost = isTerminalChallenge ? 50 : 0;
    const score =
      Number(nextQuizCorrect) * quizSignalBoost +
      Number(nextBlankCorrect) * blankSignalBoost +
      Number(nextTerminalSolved) * terminalSignalBoost;

    return {
      quizChoice: nextQuizChoice,
      quizSubmitted: nextQuizSubmitted,
      quizCorrect: nextQuizCorrect,
      blankValue: nextBlankValue,
      blankSubmitted: nextBlankSubmitted,
      blankCorrect: nextBlankCorrect,
      terminalSolved: nextTerminalSolved,
      score,
      completed: isTerminalChallenge
        ? nextTerminalSolved && nextQuizCorrect && nextBlankCorrect
        : nextQuizCorrect && nextBlankCorrect,
    };
  };

  const handleRun = () => {
    maybeShowLoginNotice();
    const res = runPythonSimulator(code);
    setOutput(res);

    if (!isTerminalChallenge) {
      return;
    }

    const solvedNow =
      terminalSolved ||
      (res.includes('Portal: https://es.hawkinslab.org/computing') &&
        res.includes('Best signal: 84.99'));

    setTerminalSolved(solvedNow);
    updateSectionProgress(
      concept.id,
      buildSavedProgress(quizChoice, quizSubmitted, blankValue, blankSubmitted, solvedNow),
    );
  };

  const maybeShowLoginNotice = () => {
    if (!user) {
      setShowLoginNotice(true);
    }
  };

  const handleQuiz = (idx: number) => {
    maybeShowLoginNotice();
    setQuizChoice(idx);
    setQuizSubmitted(true);
    updateSectionProgress(
      concept.id,
      buildSavedProgress(idx, true, blankValue, blankSubmitted, terminalSolved),
    );
  };

  const checkBlank = () => {
    maybeShowLoginNotice();
    setBlankSubmitted(true);
    updateSectionProgress(
      concept.id,
      buildSavedProgress(quizChoice, quizSubmitted, blankValue, true, terminalSolved),
    );
  };

  const isQuizCorrect = quizChoice === concept.quiz.correctIndex;
  const isBlankCorrect = blankValue.trim() === concept.blank.answer;

  return (
    <motion.section 
      id={concept.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-[#121220] border border-[#e63946] glow-red rounded-xl p-6 md:p-10 text-white relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none select-none grayscale">
         <span className="text-[12rem] leading-none">{concept.emoji}</span>
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-display text-[#e63946] mb-4 glow-text-red">
          {concept.title} <span className="opacity-80 text-3xl align-middle ml-2">{concept.emoji}</span>
        </h2>
        <p className="text-xl text-gray-300 font-sans mb-10 max-w-2xl leading-relaxed">
          {concept.explanation}
        </p>

        {/* Part 1: Editable Code */}
        <div className="mb-14">
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Hawkins Lab Terminal
          </h3>
          {isTerminalChallenge && (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 text-sm font-mono tracking-[0.04em] ${
                terminalSolved
                  ? 'border-green-500/50 bg-green-900/20 text-green-300'
                  : 'border-[#ffb703]/40 bg-[#ffb703]/10 text-[#ffdd8a]'
              }`}
            >
              {terminalSolved
                ? 'Terminal objective complete (+50 Signal Boost saved)'
                : 'Run a correct terminal fix to earn +50 Signal Boost and unlock section completion.'}
            </div>
          )}
          <div className="bg-black/80 border border-gray-700 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-gray-700 relative group">
              <div className="absolute top-2 right-4 text-xs text-gray-600 font-mono">input.py</div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-48 bg-transparent text-green-400 font-mono text-[15px] leading-relaxed resize-none outline-none focus:ring-0"
                spellCheck="false"
              />
              <button 
                onClick={handleRun}
                className="absolute bottom-4 right-4 bg-[#e63946] hover:bg-red-500 text-white font-bold py-2 px-6 rounded shadow-[0_0_15px_rgba(230,57,70,0.6)] transition-all active:scale-95 flex items-center gap-2 tracking-wider"
              >
                <span className="text-sm">▶</span> RUN
              </button>
            </div>
            <div className="flex-1 p-5 bg-[#08080c] relative min-h-[140px]">
              <div className="absolute top-2 right-4 text-xs text-gray-600 font-mono">output</div>
              <pre className="font-mono text-[15px] text-gray-300 whitespace-pre-wrap mt-6 leading-relaxed">
                {output || <span className="text-gray-600 italic">Awaiting transmission...</span>}
              </pre>
            </div>
          </div>
        </div>

        {/* Part 2: Quiz */}
        <div className="mb-14">
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Mind Flayer's Test
          </h3>
          {showLoginNotice && !user && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onPromptLogin}
              className="mb-4 block w-full rounded-lg border border-[#0044ff]/40 bg-[#0044ff]/12 px-4 py-3 text-left text-sm font-mono tracking-[0.02em] text-[#bfdbfe] transition-colors hover:bg-[#0044ff]/20"
            >
              Sign in to track your progress.
            </motion.button>
          )}
          <div className="bg-[#1a1a2e] p-6 md:p-8 rounded-lg border border-gray-700 shadow-inner">
            <p className="text-lg md:text-xl mb-6 font-medium text-gray-200">{concept.quiz.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {concept.quiz.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuiz(i)}
                  className={`p-4 text-left rounded border-2 transition-all font-mono text-sm md:text-base ${
                    quizChoice === i 
                      ? 'border-[#ffb703] bg-[#ffb703]/20 text-white' 
                      : 'border-gray-700 hover:border-gray-500 bg-black/40 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-gray-500">{String.fromCharCode(65 + i)})</span> {opt}
                </button>
              ))}
            </div>
            
            {quizSubmitted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-6 p-5 rounded-lg font-bold flex items-start gap-4 ${
                  isQuizCorrect 
                    ? 'bg-green-900/30 border-2 border-green-500 text-green-300 glow-green' 
                    : 'bg-red-900/30 border-2 border-red-500 text-red-300 animate-shake-st'
                }`}
              >
                <span className="text-3xl shrink-0 mt-1">{isQuizCorrect ? '📡' : '⚠️'}</span>
                <div className="text-lg leading-snug">
                  {isQuizCorrect ? concept.quiz.correctFeedback : concept.quiz.wrongFeedback}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Part 3: Fill in the Blank */}
        <div>
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Patch the Signal
          </h3>
          <div className="bg-[#1a1a2e] p-6 md:p-8 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center gap-6 shadow-inner">
             <div className="font-mono text-lg bg-black px-6 py-4 rounded border border-gray-600 flex-1 flex flex-wrap items-center gap-3 w-full shadow-inner">
                <span className="text-gray-300">{concept.blank.textParts[0]}</span>
                <input 
                  type="text" 
                  value={blankValue}
                  onChange={e => {
                    maybeShowLoginNotice();
                    setBlankValue(e.target.value);
                  }}
                  className="w-20 bg-[#2a2a3e] border-2 border-[#ffb703] text-center text-[#ffb703] font-bold outline-none rounded py-1 focus:bg-[#3a3a4e] transition-colors"
                />
                <span className="text-gray-300">{concept.blank.textParts[1]}</span>
             </div>
             <button 
                onClick={checkBlank}
                className="w-full md:w-auto bg-[#ffb703] hover:bg-yellow-500 text-black font-bold py-4 px-10 rounded transition-all active:scale-95 tracking-widest text-lg shrink-0"
             >
               CHECK
             </button>
          </div>

          {blankSubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg font-bold text-lg flex items-center gap-3 border ${
                isBlankCorrect 
                  ? 'text-green-400 bg-green-900/20 border-green-500/50 glow-green' 
                  : 'text-red-400 bg-red-900/20 border-red-500/50 animate-shake-st'
              }`}
            >
              {isBlankCorrect 
                ? <><span className="text-2xl">✓</span> {concept.blank.praise}</> 
                : <><span className="text-2xl">❌</span> The connection failed. Answer: {concept.blank.answer}</>
              }
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
