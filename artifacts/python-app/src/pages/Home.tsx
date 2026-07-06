import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, UserCircle2 } from 'lucide-react';
import { ConceptSection } from '../components/ConceptSection';
import { IntroSection } from '../components/IntroSection';
import { Sidebar } from '../components/Sidebar';
import { units, allConcepts } from '../data/concepts';
import { useActiveSection } from '../hooks/useActiveSection';
import { useAuth } from '@/context/auth-context';
import { useProgress } from '@/context/progress-context';

const INTRO_UNIT_ID = 'intro';
const FINAL_UNIT_ID = units[units.length - 1]?.id ?? '';
const CELEBRATION_DURATION_MS = 5500;
const CELEBRATION_PARTICLES = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: 10 + (index % 5) * 18,
  delay: (index % 5) * 0.06,
  duration: 0.95 + (index % 4) * 0.1,
  driftX: (index % 2 === 0 ? 1 : -1) * (18 + (index % 4) * 14),
  symbol: ['✦', '✧', '✹', '✷', '✶'][index % 5],
  color: ['#e63946', '#ffb703', '#7dd3fc', '#22c55e', '#f9a8d4'][index % 5],
}));

const unitCelebrations: Record<string, { eyebrow: string; title: string; message: string }> = {
  intro: {
    eyebrow: 'Welcome To Hawkins Lab',
    title: 'The Terminal Is Listening',
    message:
      'Your clearance is active. When you begin training, each unit will unlock a new mission deeper into Hawkins.',
  },
  'unit-1': {
    eyebrow: 'Unit 1 Complete',
    title: 'The Hawkins Files Are Secure',
    message:
      'You decoded the first batch of lab intel. Variables, data, and debugging are now under your control.',
  },
  'unit-2': {
    eyebrow: 'Unit 2 Complete',
    title: 'You Outsmarted The Upside Down',
    message:
      'Your decisions held under pressure. Conditionals, branching paths, and monster logic are now part of your toolkit.',
  },
  'unit-3': {
    eyebrow: 'Unit 3 Complete',
    title: 'You Survived The Time Loops',
    message:
      'The mission repeated, and you stayed in control. Loops, repetition, and escape routes are no longer a threat.',
  },
  'unit-4': {
    eyebrow: 'Unit 4 Complete',
    title: 'Your Powers Are Online',
    message:
      'You can now define, call, and test reusable powers. Hawkins would call that a high-value ability.',
  },
  'unit-5': {
    eyebrow: 'Unit 5 Complete',
    title: 'The Party Roster Is Organized',
    message:
      'Lists, strings, and mutation patterns are now part of your field training. The party is ready to move.',
  },
  'unit-6': {
    eyebrow: 'Unit 6 Complete',
    title: 'The Dossiers Have Been Decoded',
    message:
      'You traced records through dictionaries and nested data. Hawkins Lab would rather you did not know this much.',
  },
  'unit-7': {
    eyebrow: 'Unit 7 Complete',
    title: 'You Built The Mind Hive',
    message:
      'Classes, methods, and composition are under your command. You are no longer just surviving Hawkins. You are building in it.',
  },
};

export default function Home() {
  const { user, loading, isConfigured, signInWithGoogle, signOutUser } = useAuth();
  const {
    currentUnitId,
    setCurrentUnitId,
    completedSectionsCount,
    totalSectionsCount,
    unitProgressById,
    loading: progressLoading,
  } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [pendingSectionId, setPendingSectionId] = useState<string | null>(null);
  const [celebrationLabel, setCelebrationLabel] = useState<string | null>(null);
  const unitContentTopRef = useRef<HTMLDivElement | null>(null);
  const authMenuRef = useRef<HTMLDivElement | null>(null);
  const celebrationTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentUnitIndex = units.findIndex((unit) => unit.id === currentUnitId);
  const currentUnit = currentUnitIndex >= 0 ? units[currentUnitIndex] : undefined;
  const nextUnit =
    currentUnitId === INTRO_UNIT_ID
      ? units[0]
      : currentUnitIndex >= 0
        ? units[currentUnitIndex + 1]
        : undefined;

  const visibleSectionIds = useMemo(
    () => currentUnit?.sections.map((section) => section.id) ?? [],
    [currentUnit],
  );
  const visibleConcepts = useMemo(
    () => allConcepts.filter((concept) => visibleSectionIds.includes(concept.id)),
    [visibleSectionIds],
  );
  const activeSection = useActiveSection(
    currentUnitId === INTRO_UNIT_ID ? [INTRO_UNIT_ID] : visibleSectionIds,
  );
  const celebration = unitCelebrations[currentUnitId] ?? unitCelebrations[INTRO_UNIT_ID];
  const currentUnitProgress = currentUnitId === INTRO_UNIT_ID ? undefined : unitProgressById?.[currentUnitId];
  const isCurrentUnitComplete = currentUnitId === INTRO_UNIT_ID
    ? false
    : (currentUnitProgress?.completed ?? false);
  const showFinalCourseCard = currentUnitId === FINAL_UNIT_ID && isCurrentUnitComplete;
  const inProgressEyebrow =
    currentUnitId === INTRO_UNIT_ID
      ? celebration.eyebrow
      : `Unit Progress • ${currentUnitProgress?.completedSections ?? 0}/${currentUnitProgress?.totalSections ?? 0}`;
  const inProgressTitle =
    currentUnitId === INTRO_UNIT_ID
      ? celebration.title
      : `${currentUnit?.title ?? 'Current Unit'} In Progress`;
  const inProgressMessage =
    currentUnitId === INTRO_UNIT_ID
      ? celebration.message
      : 'Complete every section in this unit to secure the files and unlock the completion briefing.';
  const studentFirstName = (user?.displayName ?? user?.email?.split('@')[0] ?? 'Student')
    .trim()
    .split(/\s+/)[0];

  useEffect(() => {
    setAuthMenuOpen(false);
  }, [user]);

  useEffect(() => {
    if (!authMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (authMenuRef.current?.contains(target)) {
        return;
      }

      setAuthMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [authMenuOpen]);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (!pendingSectionId) {
      return;
    }

    let frame = 0;
    let attempts = 0;

    const scrollToPendingTarget = () => {
      const element = document.getElementById(pendingSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPendingSectionId(null);
        return;
      }

      attempts += 1;
      if (attempts >= 5) {
        unitContentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPendingSectionId(null);
        return;
      }

      frame = window.requestAnimationFrame(scrollToPendingTarget);
    };

    frame = window.requestAnimationFrame(scrollToPendingTarget);

    return () => window.cancelAnimationFrame(frame);
  }, [pendingSectionId, currentUnitId]);

  const handleSelectSection = (sectionId: string, unitId: string) => {
    if (unitId !== currentUnitId) {
      setCurrentUnitId(unitId);
    }
    setPendingSectionId(sectionId);
    setSidebarOpen(false);
  };

  const playCelebrationSound = () => {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') {
      return;
    }

    const audioContext = audioContextRef.current ?? new window.AudioContext();
    audioContextRef.current = audioContext;

    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    const now = audioContext.currentTime;
    const notes = [392, 523.25, 659.25];

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.04 + index * 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.48 + index * 0.04);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now + index * 0.06);
      oscillator.stop(now + 0.55 + index * 0.06);
    });
  };

  const handleAdvanceToNextUnit = () => {
    if (!nextUnit) {
      return;
    }

    if (celebrationTimeoutRef.current) {
      window.clearTimeout(celebrationTimeoutRef.current);
    }
    setCelebrationLabel(nextUnit.title);
    playCelebrationSound();
    celebrationTimeoutRef.current = window.setTimeout(() => {
      setCelebrationLabel(null);
      celebrationTimeoutRef.current = null;
    }, CELEBRATION_DURATION_MS);

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setCurrentUnitId(nextUnit.id);
    setPendingSectionId(nextUnit.sections[0]?.id ?? INTRO_UNIT_ID);
  };

  const handlePromptLogin = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setAuthMenuOpen(true);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans flex selection:bg-[#e63946] selection:text-white">
      <AnimatePresence>
        {celebrationLabel && (
          <motion.div
            key={celebrationLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-y-0 left-0 right-0 pointer-events-none z-[90] overflow-hidden md:left-[280px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.16),transparent_62%)]" />
            {CELEBRATION_PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, y: 40, x: 0, scale: 0.65 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-10, -170, -250],
                  x: [0, particle.driftX],
                  scale: [0.65, 1, 0.82],
                  rotate: [0, particle.driftX > 0 ? 18 : -18, particle.driftX > 0 ? 34 : -34],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'easeOut',
                }}
                className="absolute bottom-20 text-3xl md:text-4xl font-bold"
                style={{ left: `${particle.left}%`, color: particle.color }}
              >
                {particle.symbol}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              <div className="w-[min(92vw,36rem)] rounded-[1.75rem] border border-[#e63946] bg-[#120000]/95 px-8 py-6 text-center text-white shadow-[0_0_36px_rgba(230,57,70,0.45)]">
                <p className="text-xs md:text-sm font-mono uppercase tracking-[0.35em] text-[#ffb703] mb-3">
                  Signal Boost Detected
                </p>
                <h2 className="text-3xl md:text-4xl font-display text-[#e63946] glow-text-red mb-2">
                  Portal To {celebrationLabel}
                </h2>
                <p className="text-gray-200 text-base md:text-lg">
                  The lights are flashing. Another Hawkins mission has opened.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        units={units} 
        activeSection={activeSection} 
        currentUnitId={currentUnitId}
        unitProgressById={unitProgressById}
        isOpen={sidebarOpen} 
        onSelectSection={handleSelectSection}
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 relative pb-32">
        <header className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center relative">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-6 left-6 md:hidden p-2 text-white bg-[#e63946] shadow-[0_0_15px_rgba(230,57,70,0.6)] rounded-lg transition-colors z-20"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div ref={authMenuRef} className="absolute top-6 right-6 z-20">
            <button
              onClick={() => setAuthMenuOpen((prev) => !prev)}
              className={`relative rounded-full border p-2 shadow-[0_0_12px_rgba(0,68,255,0.3)] transition-colors ${
                user
                  ? 'border-[#22c55e]/70 bg-[#05200f]/90 text-[#86efac] hover:bg-[#0b2f1a]'
                  : 'border-[#0044ff]/45 bg-[#05081f]/85 text-[#93c5fd] hover:bg-[#0044ff]/20'
              }`}
              aria-label={user ? 'Account menu (signed in)' : 'Account menu'}
            >
              <UserCircle2 className="w-6 h-6" />
              {user && (
                <span
                  className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#05081f] bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)]"
                  aria-hidden="true"
                />
              )}
            </button>

            {authMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className={`absolute top-full mt-2 rounded-xl border border-[#0044ff]/30 bg-[#05081f]/95 p-3 shadow-[0_0_20px_rgba(0,68,255,0.22)] backdrop-blur-sm ${
                  user || loading ? 'right-0 w-64 text-left' : 'right-0 w-auto min-w-[9.5rem] text-center'
                }`}
              >
                {loading ? (
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-gray-300">
                    Checking access...
                  </div>
                ) : user ? (
                  <>
                    <div className="mb-2 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{studentFirstName}</p>
                      <p className="text-xs text-gray-300 truncate">{user.email}</p>
                    </div>
                    <div className="mb-3 rounded-lg border border-[#ffb703]/25 bg-[#ffb703]/10 px-2 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#ffb703]">
                      {progressLoading
                        ? 'Loading progress...'
                        : `${completedSectionsCount}/${totalSectionsCount} complete`}
                    </div>
                    <button
                      onClick={() => {
                        setAuthMenuOpen(false);
                        void signOutUser();
                      }}
                      className="w-full rounded-lg border border-[#0044ff]/40 bg-black/30 px-3 py-2 text-xs font-mono uppercase tracking-[0.16em] text-[#93c5fd] transition-colors hover:bg-[#0044ff]/10"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    {!isConfigured && (
                      <p className="mb-2 text-xs text-gray-300">
                        Add Firebase env vars to enable sign-in and progress saving.
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setAuthMenuOpen(false);
                        void signInWithGoogle();
                      }}
                      disabled={!isConfigured}
                      className="mx-auto block rounded-lg bg-[#0044ff] px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>

          <div className="xmas-lights" aria-hidden="true">
            <div className="bulb red"></div>
            <div className="bulb blue"></div>
            <div className="bulb yellow"></div>
            <div className="bulb green"></div>
            <div className="bulb red"></div>
            <div className="bulb blue"></div>
            <div className="bulb yellow"></div>
          </div>
          
          <h1 className="text-6xl md:text-[6rem] leading-none font-display text-[#0044ff] glow-text-blue mb-6 tracking-wide drop-shadow-2xl">
            Hawkins <br className="md:hidden" /> Python Lab
          </h1>
          <p className="text-lg md:text-xl text-[#ffb703] font-mono tracking-tight uppercase border-y border-[#ffb703]/30 py-4 inline-block mx-auto shadow-inner bg-black/20 px-8">
            Classified. Do not share with the Mind Flayer.
          </p>

        </header>

        <main className="relative z-10">
          <div className="max-w-4xl mx-auto px-6 space-y-20">
            <div ref={unitContentTopRef} />
            {currentUnitId === INTRO_UNIT_ID ? (
              <IntroSection />
            ) : (
              <>
                {visibleConcepts.map((concept) => (
                  <ConceptSection
                    key={concept.id}
                    concept={concept}
                    onPromptLogin={handlePromptLogin}
                  />
                ))}
              </>
            )}
          </div>
        </main>

        <footer className="max-w-4xl mx-auto px-6 mt-32">
          <div className="bg-[#120000] border-2 border-[#e63946] glow-red rounded-[2rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-[#e63946] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
             <div className="absolute top-0 left-0 w-full h-1 bg-[#e63946] glow-red"></div>
             <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e63946] glow-red"></div>
             {showFinalCourseCard ? (
               <>
                 <h2 className="relative z-10 text-4xl md:text-5xl font-display text-[#e63946] glow-text-red tracking-widest mb-6 transform group-hover:scale-105 transition-transform duration-500">
                   You're not in the Upside Down anymore
                 </h2>
                 <p className="relative z-10 text-xl md:text-2xl font-bold font-sans text-gray-200 tracking-wide">
                   — you're a Python coder! —
                 </p>
               </>
             ) : (
               <>
                 <p className="relative z-10 text-sm md:text-base font-mono uppercase tracking-[0.35em] text-[#ffb703] mb-5">
                   {isCurrentUnitComplete ? celebration.eyebrow : inProgressEyebrow}
                 </p>
                 <h2 className="relative z-10 text-4xl md:text-5xl font-display text-[#e63946] glow-text-red tracking-widest mb-6 transform group-hover:scale-105 transition-transform duration-500">
                   {isCurrentUnitComplete ? celebration.title : inProgressTitle}
                 </h2>
                 <p className="relative z-10 text-xl md:text-2xl font-bold font-sans text-gray-200 tracking-wide">
                   {isCurrentUnitComplete ? celebration.message : inProgressMessage}
                 </p>
                 {nextUnit && (
                   <button
                     onClick={handleAdvanceToNextUnit}
                     className="relative z-10 mt-8 bg-[#e63946] hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_18px_rgba(230,57,70,0.55)] transition-all active:scale-95 tracking-wide"
                   >
                     {currentUnitId === INTRO_UNIT_ID ? 'Begin Unit 1' : 'Open Next Unit'}
                   </button>
                 )}
               </>
             )}
          </div>
        </footer>
      </div>
    </div>
  );
}
