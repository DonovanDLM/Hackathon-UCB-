/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Navigation, Compass, Layers, Sparkles } from 'lucide-react';

interface CampusHeaderProps {
  activeView: 'map' | 'directory' | 'tour';
  setActiveView: (view: 'map' | 'directory' | 'tour') => void;
  onOpenDirections: () => void;
  onOpenTour: () => void;
  isDirectionsOpen: boolean;
}

export const CampusHeader: React.FC<CampusHeaderProps> = ({
  activeView,
  setActiveView,
  onOpenDirections,
  onOpenTour,
  isDirectionsOpen,
}) => {
  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between gap-4 z-30 shrink-0 shadow-xs">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
          <MapPin className="w-4 h-4 text-amber-300" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap flex items-center gap-1.5">
            <span>UCB La Paz</span>
            <span className="text-slate-300 font-light">|</span>
            <span className="text-blue-700 font-semibold">Campus Obrajes</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-none hidden sm:inline">
            Guía Didáctica & Navegador Peatonal
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveView('map')}
          className={`transition-colors whitespace-nowrap flex items-center gap-1.5 py-1 ${
            activeView === 'map' ? 'text-blue-700 border-b-2 border-blue-700 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Mapa del Campus</span>
        </button>

        <button
          onClick={() => setActiveView('directory')}
          className={`transition-colors whitespace-nowrap flex items-center gap-1.5 py-1 ${
            activeView === 'directory' ? 'text-blue-700 border-b-2 border-blue-700 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Directorio de Aulas & Labs</span>
        </button>

        <button
          onClick={onOpenTour}
          className="transition-colors whitespace-nowrap flex items-center gap-1.5 py-1 text-amber-700 hover:text-amber-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Tour del Cachorro UCB</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action CTA */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTour}
          className="md:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Tour</span>
        </button>

        <button
          onClick={onOpenDirections}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 ${
            isDirectionsOpen
              ? 'bg-blue-800 text-white ring-2 ring-blue-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-amber-300" />
          <span>Cómo Llegar</span>
        </button>
      </div>
    </header>
  );
};
