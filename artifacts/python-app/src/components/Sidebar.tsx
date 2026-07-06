import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import type { UnitProgressSummary } from '@/context/progress-context';

export type Unit = {
  id: string;
  title: string;
  sections: { id: string; title: string }[];
};

interface SidebarProps {
  units: Unit[];
  activeSection: string;
  currentUnitId: string;
  unitProgressById: Record<string, UnitProgressSummary>;
  isOpen: boolean;
  onSelectSection: (sectionId: string, unitId: string) => void;
  onClose: () => void;
}

export function Sidebar({ units, activeSection, currentUnitId, unitProgressById, isOpen, onSelectSection, onClose }: SidebarProps) {
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(
    units.reduce((acc, unit) => ({ ...acc, [unit.id]: false }), {})
  );
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setExpandedUnits(
      units.reduce(
        (acc, unit) => ({ ...acc, [unit.id]: unit.id === currentUnitId }),
        {},
      ),
    );
  }, [currentUnitId, units]);

  const toggleUnit = (id: string) => {
    setExpandedUnits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a14] border-r border-[#e63946]/50 shadow-[4px_0_20px_rgba(230,57,70,0.15)] relative">
      <div className="absolute top-0 right-0 w-[1px] h-full bg-[#e63946] glow-red"></div>
      
      <div className="p-6 pb-4 border-b border-gray-800/80">
        <h1 className="text-4xl font-display text-[#0044ff] glow-text-blue leading-none mb-1 tracking-wide">Hawkins</h1>
        <h2 className="text-xl font-display text-[#0044ff] glow-text-blue leading-none tracking-widest opacity-90">Python Lab</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Intro link */}
        <div>
          <button
            onClick={() => onSelectSection('intro', 'intro')}
            className={`block w-full text-left py-2 px-3 rounded-md transition-all text-sm font-sans font-medium relative overflow-hidden
              ${currentUnitId === 'intro'
                ? 'text-white bg-[#0044ff]/10'
                : 'text-[#0044ff] hover:text-[#60a5fa] hover:bg-[#0044ff]/5'
              }
            `}
          >
            {currentUnitId === 'intro' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0044ff] glow-text-blue"
              />
            )}
            <span className={`font-display text-base tracking-wide ${currentUnitId === 'intro' ? 'text-[#0044ff] glow-text-blue' : 'text-[#0044ff]'}`}>
              ⫸ Welcome Briefing
            </span>
          </button>
        </div>

        {units.map((unit, index) => {
          const progress = unitProgressById?.[unit.id];

          return (
          <div key={unit.id} className="space-y-2">
            <button
              onClick={() => toggleUnit(unit.id)}
              className="w-full flex items-center justify-between text-left focus:outline-none group"
            >
              <div className="min-w-0 flex-1 pr-3">
                <span className={`block font-display text-lg transition-colors tracking-wide drop-shadow-[0_0_5px_rgba(255,183,3,0.4)] ${
                  currentUnitId === unit.id
                    ? 'text-yellow-300'
                    : 'text-[#ffb703] group-hover:text-yellow-300'
                }`}>
                  Unit {index + 1}: {unit.title}
                </span>
                <span className={`mt-1 block text-[11px] font-mono uppercase tracking-[0.2em] ${
                  progress?.completed
                    ? 'text-green-400'
                    : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  {progress?.completed
                    ? 'Complete'
                    : `${progress?.completedSections ?? 0}/${progress?.totalSections ?? unit.sections.length} sections`}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {progress?.completed && (
                  <span className="rounded-full border border-green-500/40 bg-green-500/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-green-300">
                    Cleared
                  </span>
                )}
                {expandedUnits[unit.id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-[#ffb703] transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#ffb703] transition-colors" />
                )}
              </div>
            </button>
            <AnimatePresence initial={false}>
              {expandedUnits[unit.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1 ml-2 border-l border-gray-800/80 pl-3">
                    {unit.sections.map((sec) => {
                      const isActive = activeSection === sec.id;
                      return (
                        <li key={sec.id}>
                          <button
                            onClick={() => onSelectSection(sec.id, unit.id)}
                            className={`block w-full text-left py-2 px-3 rounded-r-md transition-all text-sm font-sans font-medium relative overflow-hidden group
                              ${isActive 
                                ? 'text-white bg-[#e63946]/10' 
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                              }
                            `}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="active-indicator"
                                className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e63946] glow-red"
                              />
                            )}
                            <span className={isActive ? "glow-text-red" : ""}>{sec.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] h-[100dvh] sticky top-0 shrink-0 z-40">
        {sidebarContent}
      </div>

      {/* Mobile Overlay & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] z-50 md:hidden"
            >
              <button 
                onClick={onClose}
                className="absolute top-5 right-4 p-2 text-white bg-black/50 hover:bg-black/80 rounded-full z-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}