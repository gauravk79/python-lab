import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

type Line = {
  text: string;
  color?: string;
  pauseAfter?: number;
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

const CHAR_SPEED = 22;         // ms per character
const MUSIC_TARGET_VOL = 0.55;
const FADE_IN_MS = 2000;
const FADE_OUT_MS = 1500;
const FADE_STEPS = 40;

export function IntroSection() {
  const [completedLines, setCompletedLines] = useState(0);
  const [currentChars, setCurrentChars] = useState(0);
  const [done, setDone] = useState(false);

  // true = audio.play() succeeded at least once
  const [isPlaying, setIsPlaying] = useState(false);
  // whether the user wants music on
  const [musicEnabled, setMusicEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Single active fade interval — any new fade cancels the previous one
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Guard so the "intro done" effect only fires the fade once
  const fadeOnDoneTriggered = useRef(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Audio setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/intro-theme.mp3`);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null; }
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // ── Single fade engine (cancels any prior fade) ────────────────────────────
  const startFade = useCallback((targetVol: number, durationMs: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) { onComplete?.(); return; }

    if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null; }

    const startVol = audio.volume;
    const delta = targetVol - startVol;
    if (Math.abs(delta) < 0.001) { audio.volume = targetVol; onComplete?.(); return; }

    let step = 0;
    fadeRef.current = setInterval(() => {
      step++;
      const audio = audioRef.current;
      if (!audio) {
        clearInterval(fadeRef.current!); fadeRef.current = null;
        onComplete?.(); return;
      }
      const newVol = Math.min(1, Math.max(0, startVol + delta * (step / FADE_STEPS)));
      audio.volume = newVol;
      if (step >= FADE_STEPS) {
        clearInterval(fadeRef.current!); fadeRef.current = null;
        onComplete?.();
      }
    }, durationMs / FADE_STEPS);
  }, []);

  // ── Start music (call after user gesture) ─────────────────────────────────
  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;

    audio.volume = 0;
    audio.play().then(() => {
      setIsPlaying(true);
      startFade(MUSIC_TARGET_VOL, FADE_IN_MS);
    }).catch(() => {
      // Autoplay blocked — leave isPlaying false so prompt stays visible
    });
  }, [isPlaying, startFade]);

  // ── Toggle mute / unmute ──────────────────────────────────────────────────
  const handleMusicToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      // First click ever — start music
      setMusicEnabled(true);
      startMusic();
      return;
    }

    if (musicEnabled) {
      // Mute: fade to 0 then pause
      setMusicEnabled(false);
      startFade(0, FADE_OUT_MS, () => { audioRef.current?.pause(); });
    } else {
      // Unmute: resume then fade in
      setMusicEnabled(true);
      audio.volume = 0;
      audio.play().then(() => {
        startFade(MUSIC_TARGET_VOL, FADE_IN_MS);
      }).catch(() => {});
    }
  }, [isPlaying, musicEnabled, startMusic, startFade]);

  // ── Fade out when intro naturally finishes ────────────────────────────────
  useEffect(() => {
    if (!done || fadeOnDoneTriggered.current || !isPlaying) return;
    fadeOnDoneTriggered.current = true;
    const t = setTimeout(() => {
      startFade(0, FADE_OUT_MS, () => { audioRef.current?.pause(); });
    }, 1200);
    return () => clearTimeout(t);
  }, [done, isPlaying, startFade]);

  // ── Skip ──────────────────────────────────────────────────────────────────
  const skipToEnd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger fade-out directly (don't rely on the done effect)
    fadeOnDoneTriggered.current = true;
    if (isPlaying) {
      startFade(0, FADE_OUT_MS, () => { audioRef.current?.pause(); });
    }
    setCompletedLines(LINES.length);
    setCurrentChars(0);
    setDone(true);
  }, [isPlaying, startFade]);

  // ── Typewriter effect ─────────────────────────────────────────────────────
  useEffect(() => {
    if (done) return;
    const line = LINES[completedLines];
    if (!line) { setDone(true); return; }

    if (currentChars < line.text.length) {
      const t = setTimeout(() => setCurrentChars(c => c + 1), CHAR_SPEED);
      return () => clearTimeout(t);
    } else {
      const pause = line.pauseAfter ?? 80;
      const t = setTimeout(() => {
        setCompletedLines(l => l + 1);
        setCurrentChars(0);
      }, pause);
      return () => clearTimeout(t);
    }
  }, [completedLines, currentChars, done]);

  // Auto-scroll as text streams in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [completedLines, currentChars]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.section
      id="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 mb-20"
      onClick={!isPlaying && musicEnabled ? startMusic : undefined}
    >
      <div className="bg-black border border-[#e63946]/60 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(230,57,70,0.2)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d1a] border-b border-gray-800">
          <div className="w-3 h-3 rounded-full bg-[#e63946] shadow-[0_0_6px_rgba(230,57,70,0.8)]" />
          <div className="w-3 h-3 rounded-full bg-[#ffb703] shadow-[0_0_6px_rgba(255,183,3,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          <span className="ml-3 text-xs text-gray-500 font-mono tracking-widest uppercase">
            hawkins-lab-terminal v1984
          </span>

          <div className="ml-auto flex items-center gap-3">
            {/* Music toggle */}
            {!done && (
              <button
                onClick={handleMusicToggle}
                aria-label={musicEnabled && isPlaying ? 'Mute intro music' : 'Unmute intro music'}
                className="text-xs font-mono transition-colors flex items-center gap-1"
                style={{ color: musicEnabled && isPlaying ? '#ffb703' : '#4b5563' }}
              >
                {musicEnabled && isPlaying ? '♪ music on' : '♪ music off'}
              </button>
            )}
            {/* Skip */}
            {!done && (
              <button
                onClick={skipToEnd}
                className="text-xs text-gray-600 hover:text-gray-400 font-mono transition-colors"
              >
                [skip]
              </button>
            )}
          </div>
        </div>

        {/* Click-to-enable prompt — only before first successful play */}
        {!isPlaying && !done && (
          <div className="px-6 pt-4 pb-0">
            <span className="text-[10px] font-mono text-[#ffb703]/70 animate-pulse tracking-widest">
              ▶ CLICK TO ENABLE HAWKINS LAB AUDIO TRANSMISSION
            </span>
          </div>
        )}

        {/* Terminal body */}
        <div className="p-6 font-mono text-sm md:text-base leading-relaxed min-h-[320px] max-h-[520px] overflow-y-auto">
          {LINES.slice(0, completedLines).map((line, i) => (
            <div key={i} className={line.color ?? 'text-gray-300'}>
              {line.text || '\u00A0'}
            </div>
          ))}

          {completedLines < LINES.length && (
            <div className={LINES[completedLines].color ?? 'text-gray-300'}>
              {LINES[completedLines].text.slice(0, currentChars)}
              <span className="animate-[blink_1s_step-end_infinite] inline-block w-[9px] h-[1.1em] bg-current ml-[1px] align-middle opacity-90" />
            </div>
          )}

          {done && (
            <div className="text-green-400 mt-1">
              {'> '}
              <span className="animate-[blink_1s_step-end_infinite] inline-block w-[9px] h-[1.1em] bg-current ml-[1px] align-middle opacity-90" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
        }}
      />
    </motion.section>
  );
}
