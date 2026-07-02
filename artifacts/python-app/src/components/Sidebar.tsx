import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

export type Unit = {
  id: string;
  title: string;
  sections: { id: string; title: string }[];
};

interface SidebarProps {
  units: Unit[];
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ units, activeSection, isOpen, onClose }: SidebarProps) {
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(
    units.reduce((acc, unit) => ({ ...acc, [unit.id]: true }), {})
  );

  const toggleUnit = (id: string) => {
    setExpandedUnits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      onClose(); // Close mobile sidebar if open
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a14] border-r border-[#e63946]/50 shadow-[4px_0_20px_rgba(230,57,70,0.15)] relative">
      <div className="absolute top-0 right-0 w-[1px] h-full bg-[#e63946] glow-red"></div>
      
      <div className="p-6 pb-4 border-b border-gray-800/80">
        <h1 className="text-4xl font-display text-[#e63946] glow-text-red leading-none mb-1 tracking-wide">Hawkins</h1>
        <h2 className="text-xl font-display text-white leading-none tracking-widest opacity-90">Python Lab</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {units.map((unit, index) => (
          <div key={unit.id} className="space-y-2">
            <button
              onClick={() => toggleUnit(unit.id)}
              className="w-full flex items-center justify-between text-left focus:outline-none group"
            >
              <span className="font-display text-lg text-[#ffb703] group-hover:text-yellow-300 transition-colors tracking-wide drop-shadow-[0_0_5px_rgba(255,183,3,0.4)]">
                Unit {index + 1}: {unit.title}
              </span>
              {expandedUnits[unit.id] ? (
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-[#ffb703] transition-colors" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#ffb703] transition-colors" />
              )}
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
                            onClick={() => scrollToSection(sec.id)}
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
        ))}
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