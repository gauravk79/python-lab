import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { runRealPythonMilestone } from '../lib/realPythonRunner';
import { buildLearningModule } from '../data/learning';
import { useProgress } from '@/context/progress-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

type SummaryVideo = {
  title: string;
  url: string;
  youtubeUrl?: string;
  transcriptUrl?: string;
};

const getYoutubeVideoId = (video: SummaryVideo) => {
  const source = video.youtubeUrl || video.url;
  const parsed = source.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );

  if (!parsed) {
    return null;
  }

  return parsed[1];
};

type YouTubePlayerEvent = {
  data: number;
};

type YouTubePlayerInstance = {
  destroy: () => void;
};

type YouTubePlayerNamespace = {
  Player: new (
    element: HTMLElement,
    config: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onStateChange?: (event: YouTubePlayerEvent) => void;
      };
    },
  ) => YouTubePlayerInstance;
  PlayerState: {
    ENDED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubePlayerNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeIframeApiReadyPromise: Promise<void> | null = null;

const ensureYouTubeIframeApi = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeIframeApiReadyPromise) {
    return youtubeIframeApiReadyPromise;
  }

  youtubeIframeApiReadyPromise = new Promise<void>((resolve) => {
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      resolve();
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });

  return youtubeIframeApiReadyPromise;
};

type InputPrompt = {
  key: string;
  label: string;
};

const extractInputPrompts = (sourceCode: string): InputPrompt[] => {
  const prompts: InputPrompt[] = [];
  const matches = sourceCode.matchAll(/input\(([^)]*)\)/g);
  let index = 0;

  for (const match of matches) {
    const rawArg = (match[1] ?? '').trim();
    const textMatch = rawArg.match(/^(["'])([\s\S]*)\1$/);
    const label = textMatch?.[2]?.trim() || `Input ${index + 1}`;
    prompts.push({ key: `input-${index}`, label });
    index += 1;
  }

  return prompts;
};

const injectInputValues = (
  sourceCode: string,
  prompts: InputPrompt[],
  values: Record<string, string>,
) => {
  let index = 0;

  return sourceCode.replace(/input\(([^)]*)\)/g, (fullMatch) => {
    const prompt = prompts[index];
    index += 1;

    if (!prompt) {
      return fullMatch;
    }

    const value = values[prompt.key] ?? '';
    if (value === '') {
      return fullMatch;
    }

    return JSON.stringify(value);
  });
};

const evaluateMilestoneAttempt = (sourceCode: string, output: string) => {
  const checks = [
    {
      passed:
        /Total weight:\s*82\.5/.test(output) &&
        /Average per crate:\s*13\.75/.test(output),
      message: 'Output must include both required lines with exact values.',
    },
    {
      passed: /^\s*crate_count\s*=\s*6(?:\.0+)?\s*$/m.test(sourceCode),
      message: 'Set crate_count to 6.',
    },
    {
      passed: /^\s*base_weight\s*=\s*12\.5\s*$/m.test(sourceCode),
      message: 'Set base_weight to 12.5.',
    },
    {
      passed: /^\s*bonus_weight\s*=\s*["']7\.5["']\s*$/m.test(sourceCode),
      message: 'Set bonus_weight to the string "7.5".',
    },
    {
      passed: /float\(\s*bonus_weight\s*\)/.test(sourceCode),
      message: 'Convert bonus_weight using float(...).',
    },
    {
      passed: /^\s*total_weight\s*=.*crate_count.*base_weight.*(?:bonus_weight|float\s*\()/m.test(sourceCode),
      message: 'Compute total_weight from crate_count, base_weight, and converted bonus_weight.',
    },
    {
      passed: /^\s*avg_weight\s*=.*total_weight.*crate_count/m.test(sourceCode),
      message: 'Compute avg_weight using total_weight and crate_count.',
    },
    {
      passed: /print\(\s*["']Total weight:["']\s*,\s*total_weight\s*\)/.test(sourceCode),
      message: 'Print "Total weight:" using the variable total_weight.',
    },
    {
      passed: /print\(\s*["']Average per crate:["']\s*,\s*avg_weight\s*\)/.test(sourceCode),
      message: 'Print "Average per crate:" using the variable avg_weight.',
    },
  ];

  return {
    solved: checks.every((check) => check.passed),
    unmet: checks.filter((check) => !check.passed).map((check) => check.message),
  };
};

const evaluateTerminalChallengeAttempt = (sourceCode: string, output: string) => {
  const checks = [
    {
      passed:
        output.includes('Portal: https://es.hawkinslab.org/computing') &&
        output.includes('Best signal: 84.99'),
      message:
        'Output must include both exact lines: "Portal: https://es.hawkinslab.org/computing" and "Best signal: 84.99".',
    },
    {
      passed: /^\s*language_code\s*=\s*["']es["']\s*$/m.test(sourceCode),
      message: 'Set language_code to "es".',
    },
    {
      passed: /^\s*subject\s*=\s*["']computing["']\s*$/m.test(sourceCode),
      message: 'Set subject to "computing".',
    },
    {
      passed: /^\s*base_signal\s*=\s*["']99\.99["']\s*$/m.test(sourceCode),
      message: 'Keep base_signal as the string "99.99" before conversion.',
    },
    {
      passed: /^\s*base_signal\s*=\s*float\(\s*base_signal\s*\)\s*$/m.test(sourceCode),
      message: 'Convert base_signal using float(base_signal).',
    },
    {
      passed:
        /^\s*percent_discount\s*=\s*base_signal\s*-\s*base_signal\s*\*\s*0\.15\s*$/m.test(sourceCode) ||
        /^\s*percent_discount\s*=\s*base_signal\s*-\s*\(\s*base_signal\s*\*\s*0\.15\s*\)\s*$/m.test(sourceCode),
      message: 'Compute percent_discount as base_signal - base_signal * 0.15.',
    },
    {
      passed: /^\s*fixed_discount\s*=\s*base_signal\s*-\s*12\s*$/m.test(sourceCode),
      message: 'Compute fixed_discount as base_signal - 12.',
    },
    {
      passed: !/^\s*best_signal\s*=\s*max\s*\(/m.test(sourceCode),
      message: 'Use min(...) for best_signal, not max(...).',
    },
    {
      passed:
        /^\s*best_signal\s*=\s*min\(\s*fixed_discount\s*,\s*percent_discount\s*\)\s*$/m.test(sourceCode) ||
        /^\s*best_signal\s*=\s*min\(\s*percent_discount\s*,\s*fixed_discount\s*\)\s*$/m.test(sourceCode),
      message: 'Pick best_signal with min(fixed_discount, percent_discount).',
    },
    {
      passed:
        /^\s*url\s*=\s*["']https:\/\/["']\s*\+\s*language_code\s*\+\s*["']\.hawkinslab\.org\/["']\s*\+\s*subject\s*$/m.test(
          sourceCode,
        ),
      message: 'Build url as "https://" + language_code + ".hawkinslab.org/" + subject.',
    },
    {
      passed: /print\(\s*["']Portal:["']\s*,\s*url\s*\)/.test(sourceCode),
      message: 'Print "Portal:" using the url variable.',
    },
    {
      passed: /print\(\s*["']Best signal:["']\s*,\s*round\(\s*best_signal\s*,\s*2\s*\)\s*\)/.test(sourceCode),
      message: 'Print "Best signal:" using round(best_signal, 2).',
    },
  ];

  return {
    solved: checks.every((check) => check.passed),
    unmet: checks.filter((check) => !check.passed).map((check) => check.message),
  };
};

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
  studentName,
  onPromptLogin,
}: {
  concept: ConceptData;
  studentName?: string;
  onPromptLogin: () => void;
}) {
  const isTerminalChallenge = concept.id === 'terminal-challenge';
  const isMilestoneChallenge = concept.id === 'field-challenge-1';
  const showAssessmentOnly = isMilestoneChallenge || isTerminalChallenge;
  const learningModule = React.useMemo(
    () =>
      buildLearningModule({
        id: concept.id,
        title: concept.title,
        explanation: concept.explanation,
        initialCode: concept.initialCode,
      }),
    [concept.explanation, concept.id, concept.initialCode, concept.title],
  );
  const shouldStartWithEmptyTerminal =
    !isTerminalChallenge &&
    !showAssessmentOnly &&
    learningModule.workedExample.code !== concept.initialCode;
  const initialEditorCode = shouldStartWithEmptyTerminal ? '' : concept.initialCode;

  const { user } = useAuth();
  const { toast } = useToast();
  const { sectionProgressById, updateSectionProgress } = useProgress();
  const savedProgress = sectionProgressById[concept.id];
  const [code, setCode] = useState(initialEditorCode);
  const [output, setOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [briefingQuizChoice, setBriefingQuizChoice] = useState<number | null>(null);
  const [briefingQuizSubmitted, setBriefingQuizSubmitted] = useState(false);
  
  const [blankValue, setBlankValue] = useState('');
  const [blankSubmitted, setBlankSubmitted] = useState(false);
  const [terminalSolved, setTerminalSolved] = useState(false);
  const [learnCompleted, setLearnCompleted] = useState(false);
  const [showCheckpointAnswer, setShowCheckpointAnswer] = useState(false);
  const [showMiniChallengeSolution, setShowMiniChallengeSolution] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [activeVideo, setActiveVideo] = useState<SummaryVideo | null>(null);
  const [watchedVideoUrls, setWatchedVideoUrls] = useState<string[]>([]);
  const [highlightTerminalPanel, setHighlightTerminalPanel] = useState(false);
  const activeVideoPlayerContainerRef = React.useRef<HTMLDivElement | null>(null);
  const activeYouTubePlayerRef = React.useRef<YouTubePlayerInstance | null>(null);
  const terminalSectionRef = React.useRef<HTMLDivElement | null>(null);
  const missionAlias = studentName?.trim() || 'Recruit';
  const positiveCallsign = `Nice work, ${missionAlias}.`;
  const retryCallsign = `Keep going, ${missionAlias}.`;
  const inputPrompts = React.useMemo(
    () => (isMilestoneChallenge ? [] : extractInputPrompts(code)),
    [code, isMilestoneChallenge],
  );
  const summaryVideos: SummaryVideo[] =
    learningModule.summaryVideos && learningModule.summaryVideos.length > 0
      ? learningModule.summaryVideos
      : learningModule.summaryVideo
        ? [learningModule.summaryVideo]
        : [];
  const hasSummaryVideos = summaryVideos.length > 0;
  const watchedSummaryVideosCount = summaryVideos.filter((video) => watchedVideoUrls.includes(video.url)).length;
  const pendingSummaryVideosCount = summaryVideos.length - watchedSummaryVideosCount;
  const areAllSummaryVideosWatched = hasSummaryVideos && pendingSummaryVideosCount === 0;

  React.useEffect(() => {
    setCode(initialEditorCode);
    setOutput('');
    setShowCheckpointAnswer(false);
    setShowMiniChallengeSolution(false);
    setInputValues({});
    setActiveVideo(null);
    setWatchedVideoUrls([]);
  }, [concept.initialCode, initialEditorCode]);

  React.useEffect(() => {
    setInputValues((previous) => {
      const next: Record<string, string> = {};
      inputPrompts.forEach((prompt) => {
        next[prompt.key] = previous[prompt.key] ?? '';
      });
      return next;
    });
  }, [inputPrompts]);

  React.useEffect(() => {
    setQuizChoice(savedProgress?.quizChoice ?? null);
    setQuizSubmitted(savedProgress?.quizSubmitted ?? false);
    setBriefingQuizChoice(savedProgress?.briefingQuizChoice ?? null);
    setBriefingQuizSubmitted(savedProgress?.briefingQuizSubmitted ?? false);
    setBlankValue(savedProgress?.blankValue ?? '');
    setBlankSubmitted(savedProgress?.blankSubmitted ?? false);
    setTerminalSolved(savedProgress?.terminalSolved ?? false);
    setLearnCompleted(savedProgress?.learnCompleted ?? false);
    setWatchedVideoUrls(savedProgress?.watchedVideoUrls ?? []);
  }, [
    concept.id,
    savedProgress?.blankSubmitted,
    savedProgress?.blankValue,
    savedProgress?.briefingQuizChoice,
    savedProgress?.briefingQuizSubmitted,
    savedProgress?.learnCompleted,
    savedProgress?.quizChoice,
    savedProgress?.quizSubmitted,
    savedProgress?.terminalSolved,
    savedProgress?.watchedVideoUrls,
  ]);

  React.useEffect(() => {
    if (!hasSummaryVideos || !areAllSummaryVideosWatched || learnCompleted) {
      return;
    }

    setLearnCompleted(true);
    toast({
      title: 'Briefing complete',
      description: `All summary videos watched for ${concept.title}.`,
    });
    updateSectionProgress(
      concept.id,
      buildSavedProgress(
        true,
        briefingQuizChoice,
        briefingQuizSubmitted,
        quizChoice,
        quizSubmitted,
        blankValue,
        blankSubmitted,
        terminalSolved,
        watchedVideoUrls,
      ),
    );
  }, [
    areAllSummaryVideosWatched,
    blankSubmitted,
    blankValue,
    briefingQuizChoice,
    briefingQuizSubmitted,
    concept.id,
    hasSummaryVideos,
    learnCompleted,
    quizChoice,
    quizSubmitted,
    terminalSolved,
    updateSectionProgress,
    watchedVideoUrls,
  ]);

  const buildSavedProgress = (
    nextLearnCompleted: boolean,
    nextBriefingQuizChoice: number | null,
    nextBriefingQuizSubmitted: boolean,
    nextQuizChoice: number | null,
    nextQuizSubmitted: boolean,
    nextBlankValue: string,
    nextBlankSubmitted: boolean,
    nextTerminalSolved: boolean,
    nextWatchedVideoUrls: string[],
  ) => {
    const nextLearnCompletedResolved = showAssessmentOnly
      ? true
      : hasSummaryVideos
      ? summaryVideos.every((video) => nextWatchedVideoUrls.includes(video.url))
      : nextLearnCompleted;
    const nextBriefingQuizCorrect =
      showAssessmentOnly
        ? true
        :
      nextBriefingQuizSubmitted &&
      learningModule.briefingQuiz !== undefined &&
      nextBriefingQuizChoice === learningModule.briefingQuiz.correctIndex;
    const nextQuizCorrect =
      showAssessmentOnly
        ? true
        : nextQuizSubmitted && nextQuizChoice === concept.quiz.correctIndex;
    const nextBlankCorrect =
      showAssessmentOnly
        ? true
        : nextBlankSubmitted && nextBlankValue.trim() === concept.blank.answer;
    const briefingSignalBoost = learningModule.briefingQuiz ? 20 : 0;
    const quizSignalBoost = isTerminalChallenge ? 25 : 50;
    const blankSignalBoost = isTerminalChallenge ? 25 : 50;
    const terminalSignalBoost = isTerminalChallenge ? 50 : 0;
    const score = showAssessmentOnly
      ? Number(nextTerminalSolved) * 100
      : Number(nextBriefingQuizCorrect) * briefingSignalBoost +
        Number(nextQuizCorrect) * quizSignalBoost +
        Number(nextBlankCorrect) * blankSignalBoost +
        Number(nextTerminalSolved) * terminalSignalBoost;

    return {
      learnCompleted: nextLearnCompletedResolved,
      briefingQuizChoice: nextBriefingQuizChoice,
      briefingQuizSubmitted: nextBriefingQuizSubmitted,
      briefingQuizCorrect: nextBriefingQuizCorrect,
      quizChoice: nextQuizChoice,
      quizSubmitted: nextQuizSubmitted,
      quizCorrect: nextQuizCorrect,
      blankValue: nextBlankValue,
      blankSubmitted: nextBlankSubmitted,
      blankCorrect: nextBlankCorrect,
      terminalSolved: nextTerminalSolved,
      watchedVideoUrls: nextWatchedVideoUrls,
      score,
      completed: showAssessmentOnly
        ? nextTerminalSolved
        : isTerminalChallenge
        ? nextTerminalSolved && nextQuizCorrect && nextBlankCorrect
        : nextQuizCorrect && nextBlankCorrect,
    };
  };

  const handleRun = async () => {
    maybeShowLoginNotice();
    const codeForExecution = injectInputValues(code, inputPrompts, inputValues);
    const orderedInputs = inputPrompts.map((prompt) => inputValues[prompt.key] ?? '');
    setIsRunningCode(true);

    let res = '';
    try {
      res = await runRealPythonMilestone(codeForExecution, orderedInputs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown runtime error.';
      res = `Runtime bootstrap failed: ${message}`;
    } finally {
      setIsRunningCode(false);
    }

    let finalOutput = res;

    if (!isTerminalChallenge && !isMilestoneChallenge) {
      setOutput(finalOutput);
      return;
    }

    const solvedNow = isMilestoneChallenge
      ? (() => {
          const milestoneResult = evaluateMilestoneAttempt(code, res);
          if (!milestoneResult.solved) {
            finalOutput = `${res}\n\nMilestone checks still pending:\n- ${milestoneResult.unmet.join('\n- ')}`;
          }
          return milestoneResult.solved;
        })()
      : (() => {
          const terminalResult = evaluateTerminalChallengeAttempt(code, res);
          if (!terminalResult.solved) {
            finalOutput = `${res}\n\nTerminal challenge checks still pending:\n- ${terminalResult.unmet.join('\n- ')}`;
          }
          return terminalResult.solved;
        })();

    setOutput(finalOutput);

    setTerminalSolved(solvedNow);
    updateSectionProgress(
      concept.id,
      buildSavedProgress(
        learnCompleted,
        briefingQuizChoice,
        briefingQuizSubmitted,
        quizChoice,
        quizSubmitted,
        blankValue,
        blankSubmitted,
        solvedNow,
        watchedVideoUrls,
      ),
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
      buildSavedProgress(
        learnCompleted,
        briefingQuizChoice,
        briefingQuizSubmitted,
        idx,
        true,
        blankValue,
        blankSubmitted,
        terminalSolved,
        watchedVideoUrls,
      ),
    );
  };

  const checkBlank = () => {
    maybeShowLoginNotice();
    setBlankSubmitted(true);
    updateSectionProgress(
      concept.id,
      buildSavedProgress(
        learnCompleted,
        briefingQuizChoice,
        briefingQuizSubmitted,
        quizChoice,
        quizSubmitted,
        blankValue,
        true,
        terminalSolved,
        watchedVideoUrls,
      ),
    );
  };

  const handleBriefingQuiz = (idx: number) => {
    maybeShowLoginNotice();
    setBriefingQuizChoice(idx);
    setBriefingQuizSubmitted(true);
    updateSectionProgress(
      concept.id,
      buildSavedProgress(
        learnCompleted,
        idx,
        true,
        quizChoice,
        quizSubmitted,
        blankValue,
        blankSubmitted,
        terminalSolved,
        watchedVideoUrls,
      ),
    );
  };

  const markVideoWatched = (videoUrl: string) => {
    if (watchedVideoUrls.includes(videoUrl)) {
      return;
    }

    const nextWatchedVideoUrls = [...watchedVideoUrls, videoUrl];
    const justWatchedVideo = summaryVideos.find((video) => video.url === videoUrl);
    const nextWatchedCount = summaryVideos.filter((video) =>
      nextWatchedVideoUrls.includes(video.url),
    ).length;
    setWatchedVideoUrls(nextWatchedVideoUrls);
    toast({
      title: 'Video progress saved',
      description: `${justWatchedVideo?.title ?? 'Summary video'} marked watched (${nextWatchedCount}/${summaryVideos.length}).`,
    });
    updateSectionProgress(
      concept.id,
      buildSavedProgress(
        learnCompleted,
        briefingQuizChoice,
        briefingQuizSubmitted,
        quizChoice,
        quizSubmitted,
        blankValue,
        blankSubmitted,
        terminalSolved,
        nextWatchedVideoUrls,
      ),
    );
  };

  const loadWorkedExample = () => {
    setCode(learningModule.workedExample.code);
    setOutput('Worked example loaded into the Hawkins Lab Terminal below. Press RUN to execute.');
    terminalSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightTerminalPanel(true);
    window.setTimeout(() => setHighlightTerminalPanel(false), 1400);
  };

  const activeYouTubeVideoId = activeVideo ? getYoutubeVideoId(activeVideo) : null;

  React.useEffect(() => {
    if (!activeVideo || !activeYouTubeVideoId) {
      return;
    }

    let cancelled = false;

    void ensureYouTubeIframeApi().then(() => {
      if (cancelled || !activeVideoPlayerContainerRef.current || !window.YT?.Player) {
        return;
      }

      activeYouTubePlayerRef.current?.destroy();
      activeYouTubePlayerRef.current = new window.YT.Player(activeVideoPlayerContainerRef.current, {
        videoId: activeYouTubeVideoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event: YouTubePlayerEvent) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              markVideoWatched(activeVideo.url);
              setActiveVideo(null);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      activeYouTubePlayerRef.current?.destroy();
      activeYouTubePlayerRef.current = null;
    };
  }, [activeVideo, activeYouTubeVideoId, markVideoWatched]);

  const isQuizCorrect = quizChoice === concept.quiz.correctIndex;
  const isBriefingQuizCorrect =
    learningModule.briefingQuiz !== undefined &&
    briefingQuizChoice === learningModule.briefingQuiz.correctIndex;
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
        <p className="mb-4 inline-flex items-center rounded-full border border-[#0044ff]/40 bg-[#05081f]/85 px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] text-[#93c5fd]">
          Mission lead: {missionAlias}
        </p>
        {!showAssessmentOnly && (
          <p className="text-xl text-gray-300 font-sans mb-10 max-w-2xl leading-relaxed">
            {concept.explanation}
          </p>
        )}

        {/* Part 1: Mission Briefing */}
        <div className="mb-14">
          {isMilestoneChallenge && (
            <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#facc15]/70 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.28),rgba(15,23,42,0.82)_45%,rgba(8,10,26,0.95)_85%)] px-5 py-4 shadow-[0_0_30px_rgba(250,204,21,0.24)]">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#facc15]/20 blur-2xl" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-16 w-16 rounded-full bg-[#22c55e]/20 blur-2xl" />
              <p className="inline-flex items-center rounded-full border border-[#facc15]/45 bg-[#facc15]/15 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#fde68a]">
                Milestone Field Test
              </p>
              <p className="mt-2 text-sm text-gray-100">Cross this checkpoint to prove live mission readiness and unlock the Field Badge.</p>
            </div>
          )}
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Mission Briefing
          </h3>

          <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-6 md:p-8 shadow-inner space-y-5">
            <div className="rounded-lg border border-[#0044ff]/35 bg-[#05081f]/70 px-4 py-3">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#93c5fd] mb-1">Objective</p>
              <p className="text-base text-gray-100">{learningModule.objective}</p>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#93c5fd] mb-2">Brief</p>
              <p className="text-base text-gray-300 leading-relaxed">{learningModule.missionBrief}</p>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#93c5fd] mb-2">Key Takeaways</p>
              <ul className="space-y-2 text-gray-200">
                {learningModule.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ffb703]" aria-hidden="true" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!showAssessmentOnly && (
              <div className="rounded-lg border border-red-500/35 bg-red-950/20 px-4 py-3">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-red-300 mb-1">Common Pitfall</p>
                <p className="text-sm text-red-100">{learningModule.commonPitfall}</p>
              </div>
            )}

            {!showAssessmentOnly && (
              <div className="rounded-lg border border-[#ffb703]/35 bg-[#ffb703]/10 px-4 py-3">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#ffdd8a] mb-1">Checkpoint</p>
                <p className="text-sm text-white mb-3">{learningModule.checkpoint.question}</p>
                <button
                  onClick={() => setShowCheckpointAnswer((prev) => !prev)}
                  className="rounded border border-[#ffb703]/45 bg-black/40 px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] text-[#ffdd8a] hover:bg-black/55"
                >
                  {showCheckpointAnswer ? 'Hide answer' : 'Reveal answer'}
                </button>
                {showCheckpointAnswer && (
                  <p className="mt-3 text-sm text-gray-200">{learningModule.checkpoint.answer}</p>
                )}
              </div>
            )}

            {!showAssessmentOnly && learningModule.briefingQuiz && (
              <div className="rounded-lg border border-[#22c55e]/35 bg-[#052814]/45 px-4 py-3">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#86efac] mb-2">Input Test (+20 Signal Boost)</p>
                <p className="text-sm text-white mb-3">{learningModule.briefingQuiz.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {learningModule.briefingQuiz.options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleBriefingQuiz(index)}
                      className={`rounded border px-3 py-2 text-left text-xs font-mono uppercase tracking-[0.08em] transition-colors ${
                        briefingQuizChoice === index
                          ? 'border-[#22c55e]/70 bg-[#14532d]/45 text-[#bbf7d0]'
                          : 'border-gray-600/60 bg-black/35 text-gray-200 hover:bg-black/55'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {briefingQuizSubmitted && (
                  <p className={`mt-3 text-sm ${isBriefingQuizCorrect ? 'text-green-300' : 'text-red-300'}`}>
                    {isBriefingQuizCorrect
                      ? learningModule.briefingQuiz.correctFeedback
                      : learningModule.briefingQuiz.wrongFeedback}
                  </p>
                )}
              </div>
            )}

            {!showAssessmentOnly && learningModule.miniChallenge && (
              <div className="rounded-lg border border-[#22c55e]/35 bg-[#052814]/45 px-4 py-3">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#86efac] mb-1">
                  {learningModule.miniChallenge.prompt}
                </p>
                <p className="text-sm text-gray-100 mb-3">{learningModule.miniChallenge.task}</p>
                <button
                  onClick={() => setShowMiniChallengeSolution((prev) => !prev)}
                  className="rounded border border-[#22c55e]/45 bg-black/40 px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] text-[#86efac] hover:bg-black/55"
                >
                  {showMiniChallengeSolution ? 'Hide solution' : 'Reveal solution'}
                </button>
                {showMiniChallengeSolution && (
                  <pre className="mt-3 rounded-lg border border-gray-700 bg-black/70 p-3 font-mono text-xs text-green-300 whitespace-pre-wrap">
                    {learningModule.miniChallenge.solution}
                  </pre>
                )}
              </div>
            )}

            {!showAssessmentOnly && learningModule.resources.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#93c5fd] mb-2">Deepen Learning</p>
                <div className="flex flex-col gap-2">
                  {learningModule.resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-[#0044ff]/35 bg-[#0044ff]/12 px-3 py-2 text-sm text-[#bfdbfe] transition-colors hover:bg-[#0044ff]/22"
                    >
                      {resource.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!showAssessmentOnly && summaryVideos.length > 0 && (
              <div className="rounded-lg border border-[#7dd3fc]/35 bg-[#05253a]/55 px-4 py-4">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#7dd3fc] mb-2">
                  Summary Videos
                </p>
                <p className="mb-3 text-xs text-gray-300">
                  {watchedSummaryVideosCount}/{summaryVideos.length} watched.{' '}
                  {pendingSummaryVideosCount > 0
                    ? `${pendingSummaryVideosCount} pending to complete briefing.`
                    : 'All required videos completed.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {summaryVideos.map((video) => (
                    <button
                      type="button"
                      key={video.url}
                      onClick={() => setActiveVideo(video)}
                      className="w-full rounded border border-[#7dd3fc]/45 bg-[#7dd3fc]/15 px-3 py-2 text-left text-xs font-mono uppercase tracking-[0.14em] text-[#bae6fd] transition-colors hover:bg-[#7dd3fc]/25"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden="true">{watchedVideoUrls.includes(video.url) ? '✓' : '▶'}</span>
                        <span>{watchedVideoUrls.includes(video.url) ? 'WATCHED' : 'WATCH'}</span>
                      </span>{' '}
                      {video.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!showAssessmentOnly && hasSummaryVideos ? (
              <div
                className={`w-full rounded-lg border px-4 py-3 text-center text-sm font-mono uppercase tracking-[0.12em] ${
                  areAllSummaryVideosWatched
                    ? 'border-green-500/50 bg-green-900/25 text-green-300'
                    : 'border-[#7dd3fc]/40 bg-[#05253a]/45 text-[#bae6fd]'
                }`}
              >
                {areAllSummaryVideosWatched
                  ? 'BRIEFING COMPLETED'
                  : 'Watch all summary videos to auto-complete briefing.'}
              </div>
            ) : null}

            {showLoginNotice && !user && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onPromptLogin}
                className="block w-full rounded-lg border border-[#0044ff]/40 bg-[#0044ff]/12 px-4 py-3 text-left text-sm font-mono tracking-[0.02em] text-[#bfdbfe] transition-colors hover:bg-[#0044ff]/20"
              >
                Sign in to track your progress.
              </motion.button>
            )}
          </div>
        </div>

        {/* Part 2: Editable Code */}
        <div ref={terminalSectionRef} className="mb-14">
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Hawkins Lab Terminal
          </h3>
          {!showAssessmentOnly && (
            <div className="mb-4 rounded-lg border border-[#0044ff]/35 bg-[#05081f]/70 px-4 py-4">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-[#93c5fd] mb-2">Worked Example</p>
              <p className="text-sm text-[#ffdd8a] mb-2">{learningModule.workedExample.title}</p>
              <pre className="rounded-lg border border-gray-700 bg-black/70 p-4 font-mono text-sm text-green-300 whitespace-pre-wrap">
                {learningModule.workedExample.code}
              </pre>
              <p className="mt-2 text-sm text-gray-300">{learningModule.workedExample.explanation}</p>
              <p className="mt-3 text-xs font-mono uppercase tracking-[0.12em] text-gray-400">
                Run path: load this snippet into the terminal below, then press RUN.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={loadWorkedExample}
                  className="rounded border border-[#0044ff]/45 bg-[#0044ff]/15 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#bfdbfe] transition-colors hover:bg-[#0044ff]/25"
                >
                  Load into terminal
                </button>
              </div>
            </div>
          )}
          {isTerminalChallenge && (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 text-sm font-mono tracking-[0.04em] ${
                terminalSolved
                  ? 'border-green-500/50 bg-green-900/20 text-green-300'
                  : 'border-[#ffb703]/40 bg-[#ffb703]/10 text-[#ffdd8a]'
              }`}
            >
              {terminalSolved
                ? `${positiveCallsign} Terminal objective complete (+50 Signal Boost saved).`
                : `${retryCallsign} Run a correct terminal fix to earn +50 Signal Boost and unlock section completion.`}
            </div>
          )}
          {isMilestoneChallenge && (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 text-sm font-mono tracking-[0.04em] ${
                terminalSolved
                  ? 'border-green-500/50 bg-green-900/20 text-green-300'
                  : 'border-[#facc15]/45 bg-[#f59e0b]/10 text-[#fde68a]'
              }`}
            >
              {terminalSolved
                ? `${positiveCallsign} Milestone cleared. Field Badge signal confirmed.`
                : `${retryCallsign} Expected output: Total weight: 82.5 and Average per crate: 13.75.`}
            </div>
          )}
          <div className={`bg-black/80 border rounded-lg overflow-hidden shadow-2xl transition-all duration-500 ${
            highlightTerminalPanel
              ? 'border-[#7dd3fc] ring-2 ring-[#7dd3fc]/60'
              : 'border-gray-700'
          }`}>
            <div className="p-5 border-b border-gray-700 relative group">
              <div className="mb-3 mt-1 rounded-lg border border-gray-800 bg-black/35 px-3 py-2">
                <div className="text-xs text-gray-500 font-mono">input.py</div>
              </div>
              <button
                onClick={handleRun}
                disabled={isRunningCode}
                className="absolute right-5 top-6 z-10 rounded border border-[#e63946]/70 bg-[#e63946] px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRunningCode ? 'RUNNING...' : 'RUN'}
              </button>
              {inputPrompts.length > 0 && (
                <div className="mb-3 mt-1 rounded-lg border border-[#7dd3fc]/35 bg-[#05253a]/45 p-3">
                  <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[#7dd3fc]">
                    Provide input values before run
                  </p>
                  <div className="grid gap-2">
                    {inputPrompts.map((prompt) => (
                      <label key={prompt.key} className="text-xs text-gray-200">
                        <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-gray-400">
                          {prompt.label}
                        </span>
                        <input
                          type="text"
                          value={inputValues[prompt.key] ?? ''}
                          onChange={(event) =>
                            setInputValues((previous) => ({
                              ...previous,
                              [prompt.key]: event.target.value,
                            }))
                          }
                          className="w-full rounded border border-[#7dd3fc]/35 bg-black/50 px-2 py-1.5 text-sm text-white outline-none focus:border-[#7dd3fc]"
                          placeholder="Type the value this prompt should receive"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-72 bg-transparent text-green-400 font-mono text-[15px] leading-relaxed resize-y outline-none focus:ring-0 overflow-x-auto"
                wrap="off"
                spellCheck="false"
              />
            </div>
            <div className="p-5 bg-[#08080c] relative min-h-[140px]">
              <div className="mb-2 text-xs text-gray-600 font-mono">output</div>
              <pre className="font-mono text-[15px] text-gray-300 whitespace-pre-wrap leading-relaxed">
                {output || <span className="text-gray-600 italic">Awaiting transmission...</span>}
              </pre>
            </div>
          </div>
        </div>

        {/* Part 3: Quiz */}
        {!showAssessmentOnly && (
        <div className="mb-14">
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
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
                  {isQuizCorrect
                    ? `${positiveCallsign} ${concept.quiz.correctFeedback}`
                    : `${retryCallsign} ${concept.quiz.wrongFeedback}`}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        )}

        {/* Part 4: Fill in the Blank */}
        {!showAssessmentOnly && (
        <div>
          <h3 className="text-2xl font-sans font-bold text-[#ffb703] mb-4 flex items-center gap-3">
            <span className="bg-[#ffb703] text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
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
                ? <><span className="text-2xl">✓</span> {positiveCallsign} {concept.blank.praise}</> 
                : <><span className="text-2xl">❌</span> {retryCallsign} The connection failed. Answer: {concept.blank.answer}</>
              }
            </motion.div>
          )}
        </div>
        )}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" role="dialog" aria-modal="true" aria-label={`Summary video: ${activeVideo.title}`}>
          <div className="w-full max-w-4xl rounded-xl border border-[#7dd3fc]/35 bg-[#0b1328] p-4 md:p-6 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h4 className="text-sm md:text-base font-mono uppercase tracking-[0.14em] text-[#bae6fd]">
                {activeVideo.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded border border-gray-600 bg-black/45 px-2.5 py-1 text-xs font-mono uppercase tracking-[0.12em] text-gray-200 hover:bg-black/65"
              >
                Close
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-700 bg-black">
              {activeYouTubeVideoId ? (
                <div className="aspect-video w-full">
                  <div
                    ref={activeVideoPlayerContainerRef}
                    className="h-full w-full"
                    aria-label={activeVideo.title}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-sm text-gray-200">
                    This video cannot be embedded directly in the app.
                  </p>
                  <a
                    href={activeVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-[#7dd3fc]/45 bg-[#7dd3fc]/15 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#bae6fd] hover:bg-[#7dd3fc]/25"
                  >
                    Open on Khan Academy
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      markVideoWatched(activeVideo.url);
                      setActiveVideo(null);
                    }}
                    className="rounded border border-green-500/45 bg-green-900/30 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-green-300 hover:bg-green-900/45"
                  >
                    Mark watched
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-[#7dd3fc]/45 bg-[#7dd3fc]/12 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#bae6fd] hover:bg-[#7dd3fc]/22"
              >
                Open lesson page
              </a>
              {activeVideo.transcriptUrl && (
                <a
                  href={activeVideo.transcriptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-gray-600 bg-black/45 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-gray-200 hover:bg-black/65"
                >
                  Open transcript
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
