/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GUIDED_TOURS, GuidedTour, LOCATIONS } from '../data/campusData';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Navigation,
  MapPin,
  CheckCircle2,
  Play
} from 'lucide-react';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTourRoute: (buildingId: string, roomCode?: string) => void;
}

export const TourModal: React.FC<TourModalProps> = ({
  isOpen,
  onClose,
  onStartTourRoute,
}) => {
  const [selectedTour, setSelectedTour] = useState<GuidedTour>(GUIDED_TOURS[0]);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentStop = selectedTour.stops[currentStopIndex];
  const targetBuilding = LOCATIONS[currentStop.buildingId];

  const handleNext = () => {
    if (currentStopIndex < selectedTour.stops.length - 1) {
      const nextIndex = currentStopIndex + 1;
      setCurrentStopIndex(nextIndex);
      const nextStop = selectedTour.stops[nextIndex];
      onStartTourRoute(nextStop.buildingId, nextStop.highlightRoom);
    }
  };

  const handlePrev = () => {
    if (currentStopIndex > 0) {
      const prevIndex = currentStopIndex - 1;
      setCurrentStopIndex(prevIndex);
      const prevStop = selectedTour.stops[prevIndex];
      onStartTourRoute(prevStop.buildingId, prevStop.highlightRoom);
    }
  };

  const handleSelectStop = (idx: number) => {
    setCurrentStopIndex(idx);
    const stop = selectedTour.stops[idx];
    onStartTourRoute(stop.buildingId, stop.highlightRoom);
  };

  const handleStartTour = () => {
    setCurrentStopIndex(0);
    const stop = selectedTour.stops[0];
    onStartTourRoute(stop.buildingId, stop.highlightRoom);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tours Didácticos & Orientación UCB</h2>
              <p className="text-xs text-slate-500">Aprende a moverte por el campus como un universitario experimentado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
            aria-label="Cerrar tour didáctico"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour Selector Tabs */}
        <div className="p-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
          {GUIDED_TOURS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTour(t);
                setCurrentStopIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedTour.id === t.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Active Tour Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Tour Intro Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                {selectedTour.badge}
              </span>
              <span className="text-xs font-bold text-slate-800">{selectedTour.title}</span>
            </div>
            <p className="text-xs text-slate-600">{selectedTour.description}</p>
          </div>

          {/* Current Stop Spotlight Card */}
          {currentStop && (
            <div className="p-4 bg-white rounded-xl border-2 border-amber-400 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-800">
                  Parada {currentStopIndex + 1} de {selectedTour.stops.length}
                </span>
                <span className="font-semibold text-slate-500 font-mono">
                  {targetBuilding ? targetBuilding.shortName : ''}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {currentStop.stopTitle}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed">
                {currentStop.explanation}
              </p>

              {/* Building quick image or preview */}
              {targetBuilding && targetBuilding.image && (
                <div className="h-32 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={targetBuilding.image}
                    alt={targetBuilding.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentStopIndex === 0}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <button
                  onClick={() => {
                    onStartTourRoute(currentStop.buildingId, currentStop.highlightRoom);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-300" />
                  <span>Trazar ruta hacia aquí</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStopIndex === selectedTour.stops.length - 1}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-30 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Full List of Stops in this Tour */}
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Todas las Paradas del Recorrido
            </div>
            <div className="space-y-1.5">
              {selectedTour.stops.map((stop, idx) => {
                const isSelected = idx === currentStopIndex;
                const building = LOCATIONS[stop.buildingId];
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectStop(idx)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span>{stop.stopTitle}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-normal">
                      {building?.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Campus Universitario UCB La Paz</span>
          <button
            onClick={handleStartTour}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Iniciar Tour Desde la Parada 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
