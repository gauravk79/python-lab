import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { ConceptSection } from '../components/ConceptSection';
import { IntroSection } from '../components/IntroSection';
import { Sidebar } from '../components/Sidebar';
import { units, allConcepts } from '../data/concepts';
import { useActiveSection } from '../hooks/useActiveSection';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeSection = useActiveSection(['intro', ...allConcepts.map(c => c.id)]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans flex selection:bg-[#e63946] selection:text-white">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        units={units} 
        activeSection={activeSection} 
        isOpen={sidebarOpen} 
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

          <div className="xmas-lights" aria-hidden="true">
            <div className="bulb red"></div>
            <div className="bulb blue"></div>
            <div className="bulb yellow"></div>
            <div className="bulb green"></div>
            <div className="bulb red"></div>
            <div className="bulb blue"></div>
            <div className="bulb yellow"></div>
          </div>
          
          <h1 className="text-6xl md:text-[6rem] leading-none font-display text-[#e63946] glow-text-red mb-6 tracking-wide drop-shadow-2xl">
            Hawkins <br className="md:hidden" /> Python Lab
          </h1>
          <p className="text-lg md:text-xl text-[#ffb703] font-mono tracking-tight uppercase border-y border-[#ffb703]/30 py-4 inline-block mx-auto shadow-inner bg-black/20 px-8">
            Classified. Do not share with the Mind Flayer.
          </p>
        </header>

        <main className="relative z-10">
          <IntroSection />
          <div className="max-w-4xl mx-auto px-6 space-y-20">
          {allConcepts.map((concept) => (
            <ConceptSection key={concept.id} concept={concept} />
          ))}
          </div>
        </main>

        <footer className="max-w-4xl mx-auto px-6 mt-32">
          <div className="bg-[#120000] border-2 border-[#e63946] glow-red rounded-[2rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-[#e63946] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
             <div className="absolute top-0 left-0 w-full h-1 bg-[#e63946] glow-red"></div>
             <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e63946] glow-red"></div>
             
             <h2 className="relative z-10 text-4xl md:text-5xl font-display text-[#e63946] glow-text-red tracking-widest mb-6 transform group-hover:scale-105 transition-transform duration-500">
               You're not in the Upside Down anymore
             </h2>
             <p className="relative z-10 text-xl md:text-2xl font-bold font-sans text-gray-200 tracking-wide">
               — you're a Python coder! —
             </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
