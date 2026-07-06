import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { allConcepts, units } from '@/data/concepts';
import { useAuth } from '@/context/auth-context';
import { db, isFirebaseConfigured } from '@/lib/firebase';

const INTRO_UNIT_ID = 'intro';

export type SavedSectionProgress = {
  quizChoice: number | null;
  quizSubmitted: boolean;
  quizCorrect: boolean;
  blankValue: string;
  blankSubmitted: boolean;
  blankCorrect: boolean;
  terminalSolved: boolean;
  score: number;
  completed: boolean;
  updatedAt: number;
};

export type UnitProgressSummary = {
  completedSections: number;
  totalSections: number;
  completed: boolean;
  score: number;
};

type StudentProgressDocument = {
  currentUnitId?: string;
  sectionProgress?: Record<string, SavedSectionProgress>;
  completedUnits?: string[];
  unitProgress?: Record<string, UnitProgressSummary>;
};

type ProgressContextValue = {
  currentUnitId: string;
  setCurrentUnitId: (unitId: string) => void;
  sectionProgressById: Record<string, SavedSectionProgress>;
  updateSectionProgress: (
    sectionId: string,
    nextProgress: Omit<SavedSectionProgress, 'updatedAt'>,
  ) => void;
  loading: boolean;
  completedSections: string[];
  completedSectionsCount: number;
  totalSectionsCount: number;
  unitProgressById: Record<string, UnitProgressSummary>;
  completedUnits: string[];
  completedUnitsCount: number;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function getProgressDocRef(uid: string) {
  if (!db) {
    return null;
  }

  return doc(db, 'studentProgress', uid);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentUnitId, setCurrentUnitIdState] = useState(INTRO_UNIT_ID);
  const [sectionProgressById, setSectionProgressById] = useState<Record<string, SavedSectionProgress>>({});
  const [loading, setLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (!user || !db || !isFirebaseConfigured) {
      setCurrentUnitIdState(INTRO_UNIT_ID);
      setSectionProgressById({});
      setLoading(false);
      setHasHydrated(false);
      return;
    }

    let cancelled = false;

    const loadProgress = async () => {
      setLoading(true);
      setHasHydrated(false);
      try {
        const progressRef = getProgressDocRef(user.uid);
        if (!progressRef) {
          if (!cancelled) {
            setCurrentUnitIdState(INTRO_UNIT_ID);
            setSectionProgressById({});
            setLoading(false);
            setHasHydrated(true);
          }
          return;
        }

        const snapshot = await getDoc(progressRef);
        const data = snapshot.data() as StudentProgressDocument | undefined;

        if (cancelled) {
          return;
        }

        setCurrentUnitIdState(data?.currentUnitId ?? INTRO_UNIT_ID);
        setSectionProgressById(data?.sectionProgress ?? {});
        setHasHydrated(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !db || !isFirebaseConfigured || loading || !hasHydrated) {
      return;
    }

    const progressRef = getProgressDocRef(user.uid);
    if (!progressRef) {
      return;
    }

    const completedSections = Object.entries(sectionProgressById)
      .filter(([, value]) => value.completed)
      .map(([sectionId]) => sectionId);

    const sectionScores = Object.fromEntries(
      Object.entries(sectionProgressById).map(([sectionId, value]) => [sectionId, value.score]),
    );

    const unitProgress = Object.fromEntries(
      units.map((unit) => {
        const totalSections = unit.sections.length;
        const completedUnitSections = unit.sections.filter(
          (section) => sectionProgressById[section.id]?.completed,
        );
        const unitScore = unit.sections.reduce(
          (sum, section) => sum + (sectionProgressById[section.id]?.score ?? 0),
          0,
        );

        return [
          unit.id,
          {
            completedSections: completedUnitSections.length,
            totalSections,
            completed: completedUnitSections.length === totalSections,
            score: unitScore,
          },
        ];
      }),
    );

    const completedUnits = Object.entries(unitProgress)
      .filter(([, value]) => value.completed)
      .map(([unitId]) => unitId);

    void setDoc(
      progressRef,
      {
        displayName: user.displayName ?? null,
        email: user.email ?? null,
        currentUnitId,
        completedSections,
        completedUnits,
        sectionScores,
        sectionProgress: sectionProgressById,
        unitProgress,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }, [currentUnitId, hasHydrated, loading, sectionProgressById, user]);

  const setCurrentUnitId = (unitId: string) => {
    setCurrentUnitIdState(unitId);
  };

  const updateSectionProgress = (
    sectionId: string,
    nextProgress: Omit<SavedSectionProgress, 'updatedAt'>,
  ) => {
    setSectionProgressById((previous) => ({
      ...previous,
      [sectionId]: {
        ...nextProgress,
        updatedAt: Date.now(),
      },
    }));
  };

  const completedSections = useMemo(
    () =>
      Object.entries(sectionProgressById)
        .filter(([, value]) => value.completed)
        .map(([sectionId]) => sectionId),
    [sectionProgressById],
  );

  const unitProgressById = useMemo(
    () =>
      Object.fromEntries(
        units.map((unit) => {
          const totalSections = unit.sections.length;
          const completedUnitSections = unit.sections.filter(
            (section) => sectionProgressById[section.id]?.completed,
          );
          const unitScore = unit.sections.reduce(
            (sum, section) => sum + (sectionProgressById[section.id]?.score ?? 0),
            0,
          );

          return [
            unit.id,
            {
              completedSections: completedUnitSections.length,
              totalSections,
              completed: completedUnitSections.length === totalSections,
              score: unitScore,
            },
          ];
        }),
      ) as Record<string, UnitProgressSummary>,
    [sectionProgressById],
  );

  const completedUnits = useMemo(
    () =>
      Object.entries(unitProgressById)
        .filter(([, value]) => value.completed)
        .map(([unitId]) => unitId),
    [unitProgressById],
  );

  const value = useMemo(
    () => ({
      currentUnitId,
      setCurrentUnitId,
      sectionProgressById,
      updateSectionProgress,
      loading,
      completedSections,
      completedSectionsCount: completedSections.length,
      totalSectionsCount: allConcepts.length,
      unitProgressById,
      completedUnits,
      completedUnitsCount: completedUnits.length,
    }),
    [completedSections, completedUnits, currentUnitId, loading, sectionProgressById, unitProgressById],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return context;
}