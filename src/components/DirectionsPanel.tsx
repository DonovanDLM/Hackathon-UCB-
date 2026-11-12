/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BuildingLocation,
  LOCATIONS,
  NavigationStep,
  pxToMeters,
  metersToMinutes
} from '../data/campusData';
import {
  Navigation,
  X,
  ArrowUpDown,
  Footprints,
  Clock,
  MapPin,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface DirectionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  originId: string;
  setOriginId: (id: string) => void;
  destinationId: string;
  setDestinationId: (id: string) => void;
  destRoomLabel?: string | null;
  setDestRoomLabel: (label: string | null) => void;
  pathLengthPx: number;
  steps: NavigationStep[];
  walkingNodeIndex: number;
  isSimulatingWalk: boolean;
  onToggleSimulateWalk: () => void;
  onResetRoute: () => void;
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  isOpen,
  onClose,
  originId,
  setOriginId,
  destinationId,
  setDestinationId,
  destRoomLabel,
  setDestRoomLabel,
  pathLengthPx,
  steps,
  walkingNodeIndex,
  isSimulatingWalk,
  onToggleSimulateWalk,
  onResetRoute,
}) => {
  if (!isOpen) return null;

  const originLoc = LOCATIONS[originId] || LOCATIONS['ingreso'];
  const destLoc = LOCATIONS[destinationId] || LOCATIONS['bloque_i'];

  const meters = pxToMeters(pathLengthPx);
  const minutes = metersToMinutes(meters);

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
    setDestRoomLabel(null);
  };

  return (
    <div className="absolute top-16 left-4 md:left-6 w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 z-20 flex flex-col max-h-[calc(100vh-5.5rem)] overflow-hidden transition-all">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Navigation className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-sm font-bold text-slate-900">Ruta Peatonal Campus UCB</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
          aria-label="Cerrar panel de rutas"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          {/* Visual track line */}
          <div className="flex flex-col items-center gap-1 py-1 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-white" />
            <div className="w-0.5 h-7 bg-slate-200" />
            <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
          </div>

          {/* Dropdowns */}
          <div className="flex-1 flex flex-col gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                Punto de Partida
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(LOCATIONS).map((loc) => (
                  <option key={`orig-${loc.id}`} value={loc.id}>
                    [{loc.code}] {loc.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                Destino
              </label>
              <select
                value={destinationId}
                onChange={(e) => {
                  setDestinationId(e.target.value);
                  setDestRoomLabel(null);
                }}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(LOCATIONS).map((loc) => (
                  <option key={`dest-${loc.id}`} value={loc.id}>
                    [{loc.code}] {loc.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            title="Invertir origen y destino"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors shrink-0"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Room Specific Badge if navigated to a specific room */}
        {destRoomLabel && (
          <div className="mt-3 p-2 bg-blue-50/80 rounded-lg border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
            <span className="truncate">
              Buscando aula: <strong>{destRoomLabel}</strong>
            </span>
            <button
              onClick={() => setDestRoomLabel(null)}
              className="text-blue-400 hover:text-blue-700 ml-2"
              title="Quitar filtro de aula"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Bar */}
      <div className="px-4 py-3 bg-blue-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Footprints className="w-4 h-4 text-blue-600" />
            <span className="font-mono tabular-nums">{meters} m</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{minutes} min a pie</span>
          </div>
        </div>

        <button
          onClick={onToggleSimulateWalk}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            isSimulatingWalk
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Play className={`w-3 h-3 ${isSimulatingWalk ? 'fill-current' : ''}`} />
          <span>{isSimulatingWalk ? 'Pausar' : 'Simular'}</span>
        </button>
      </div>

      {/* Step-by-Step Directions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
          Instrucciones Paso a Paso
        </div>

        {steps.map((step, index) => {
          const isCurrentStep = index === walkingNodeIndex;
          const isCompleted = index < walkingNodeIndex;

          return (
            <div
              key={index}
              className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                isCurrentStep
                  ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-100 shadow-xs'
                  : isCompleted
                  ? 'bg-slate-50/60 border-slate-200/60 opacity-65'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                  isCurrentStep
                    ? 'bg-blue-600 text-white font-bold'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.icon}
              </div>

              <div className="flex-1">
                <p
                  className="text-slate-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: step.text }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Accessibility Note */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="truncate">Ruta peatonal con rampas universales</span>
        <button
          onClick={onResetRoute}
          className="text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
};
