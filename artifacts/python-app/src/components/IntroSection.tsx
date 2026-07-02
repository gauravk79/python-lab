import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type Line = {
  text: string;
  color?: string;
  pauseAfter?: number; // extra ms to wait before starting next line
};

const LINES: Line[] = [
  { text: '> HAWKINS NATIONAL LABORATORY', color: 'text-[#e63946]', pauseAfter: 120 },
  { text: '> CLASSIFIED ACCESS TERMINAL — LEVEL 4 CLEARANCE REQUIRED', color: 'text-[#e63946]', pauseAfter: 400 },
  { text: '', pauseAfter: 100 },
  { text: '> Initializing secure connection...', color: 'text-green-400', pauseAfter: 500 },
  { text: '> Loading Python training modules... OK', color: 'text-green-400', pauseAfter: 300 },
  { text: '> WARNING: Mind Flayer activity detected in sector 7.', color: 'text-yellow-400', pauseAfter: 500 },
  { text: '> Deploying psychic interference countermeasures... DONE', color: 'text-green-400', pauseAfter: 600 },
  { text: '', pauseAfter: 100 },
  { text: '> Welcome, Recruit.', color: 'text-white', pauseAfter: 500 },
  { text: '', pauseAfter: 80 },
  { text: '> You have been selected for PROJECT PYTHON —', color: 'text-gray-300', pauseAfter: 80 },
  { text: '> a top-secret Hawkins Lab initiative to train the next', color: 'text-gray-300', pauseAfter: 80 },
  { text: '> generation of scientific operatives. Like you.', color: 'text-gray-300', pauseAfter: 400 },
  { text: '', pauseAfter: 80 },
  { text: '> In this course you will learn to:', color: 'text-[#ffb703]', pauseAfter: 200 },
  { text: '>   [Unit 1] Store secret intel............. Variables & Data', color: 'text-gray-400', pauseAfter: 100 },
  { text: '>   [Unit 2] Make decisions under pressure.. Conditionals', color: 'text-gray-400', pauseAfter: 100 },
  { text: '>   [Unit 3] Run operations on repeat....... Loops', color: 'text-gray-400', pauseAfter: 100 },
  { text: '>   [Unit 4] Activate special abilities..... Functions', color: 'text-gray-400', pauseAfter: 100 },
  { text: '>   [Unit 5] Organize mission data.......... Lists & Strings', color: 'text-gray-400', pauseAfter: 100 },
  { text: '>   [Unit 6] Build subject profiles......... Dictionaries', color: 'text-gray-400', pauseAfter: 100 },
  { text: '>   [Unit 7] Create your own operatives.... Classes', color: 'text-gray-400', pauseAfter: 500 },
  { text: '', pauseAfter: 80 },
  { text: '> Dr. Brenner has authorized your access.', color: 'text-gray-300', pauseAfter: 300 },
  { text: '> Eleven is rooting for you from the void.', color: 'text-gray-300', pauseAfter: 300 },
  { text: '> The Mind Flayer cannot stop what you are about to learn.', color: 'text-gray-300', pauseAfter: 600 },
  { text: '', pauseAfter: 80 },
  { text: '> Scroll down to begin your training, Recruit.', color: 'text-[#e63946]', pauseAfter: 0 },
  { text: '> [CONNECTION ESTABLISHED — GOOD LUCK]', color: 'text-[#e63946]', pauseAfter: 0 },
];

const CHAR_SPEED = 22; // ms per character

export function IntroSection() {
  // Index of fully completed lines
  const [completedLines, setCompletedLines] = useState<number>(0);
  // How many chars of the currently-typing line are visible
  const [currentChars, setCurrentChars] = useState<number>(0);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;

    const line = LINES[completedLines];
    if (!line) { setDone(true); return; }

    if (currentChars < line.text.length) {
      // Still typing the current line
      const t = setTimeout(() => setCurrentChars(c => c + 1), CHAR_SPEED);
      return () => clearTimeout(t);
    } else {
      // Line finished — pause then move to next
      const pause = line.pauseAfter ?? 80;
      const t = setTimeout(() => {
        setCompletedLines(l => l + 1);
        setCurrentChars(0);
      }, pause);
      return () => clearTimeout(t);
    }
  }, [completedLines, currentChars, done]);

  // Auto-scroll to bottom as text streams in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [completedLines, currentChars]);

  const skipToEnd = () => {
    setCompletedLines(LINES.length);
    setCurrentChars(0);
    setDone(true);
  };

  return (
    <motion.section
      id="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 mb-20"
    >
      {/* Terminal window */}
      <div className="bg-black border border-[#e63946]/60 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(230,57,70,0.2)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d1a] border-b border-gray-800">
          <div className="w-3 h-3 rounded-full bg-[#e63946] shadow-[0_0_6px_rgba(230,57,70,0.8)]" />
          <div className="w-3 h-3 rounded-full bg-[#ffb703] shadow-[0_0_6px_rgba(255,183,3,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          <span className="ml-3 text-xs text-gray-500 font-mono tracking-widest uppercase">
            hawkins-lab-terminal v1984
          </span>
          {!done && (
            <button
              onClick={skipToEnd}
              className="ml-auto text-xs text-gray-600 hover:text-gray-400 font-mono transition-colors"
            >
              [skip]
            </button>
          )}
        </div>

        {/* Terminal body */}
        <div className="p-6 font-mono text-sm md:text-base leading-relaxed min-h-[320px] max-h-[520px] overflow-y-auto">
          {/* Completed lines */}
          {LINES.slice(0, completedLines).map((line, i) => (
            <div key={i} className={line.color ?? 'text-gray-300'}>
              {line.text || '\u00A0'}
            </div>
          ))}

          {/* Currently-typing line */}
          {completedLines < LINES.length && (
            <div className={LINES[completedLines].color ?? 'text-gray-300'}>
              {LINES[completedLines].text.slice(0, currentChars)}
              {/* Blinking cursor */}
              <span className="animate-[blink_1s_step-end_infinite] inline-block w-[9px] h-[1.1em] bg-current ml-[1px] align-middle opacity-90" />
            </div>
          )}

          {/* After done — static blinking cursor on new line */}
          {done && (
            <div className="text-green-400 mt-1">
              {'> '}
              <span className="animate-[blink_1s_step-end_infinite] inline-block w-[9px] h-[1.1em] bg-current ml-[1px] align-middle opacity-90" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scanline overlay for CRT effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
        }}
      />
    </motion.section>
  );
}
